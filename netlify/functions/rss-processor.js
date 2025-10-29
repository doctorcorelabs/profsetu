import { createClient } from '@supabase/supabase-js';
import Parser from 'rss-parser';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
});

// RSS feeds Indonesia - hanya CNN dan Antara, 20 berita per sumber
const RSS_FEEDS = [
  {
    name: 'CNN Indonesia',
    url: 'https://www.cnnindonesia.com/nasional/rss',
    category: 'nasional'
  },
  {
    name: 'Antara News',
    url: 'https://www.antaranews.com/rss/terkini.xml',
    category: 'nasional'
  }
];

async function processRSSFeed(feed) {
  try {
    console.log(`Processing ${feed.name}...`);
    const rss = await parser.parseURL(feed.url);
    
    // Batasi 20 berita terbaru per sumber
    const expiryMs = 3 * 24 * 60 * 60 * 1000; // 3 hari
    const nowIso = new Date().toISOString();
    const expiresAtIso = new Date(Date.now() + expiryMs).toISOString();

    const newsItems = rss.items.slice(0, 20).map(item => ({
      title: item.title || '',
      description: item.contentSnippet || item.content || '',
      link: item.link || '',
      pub_date: new Date(item.pubDate || item.isoDate || new Date()).toISOString(),
      source: feed.name,
      image_url: item.enclosure?.url || item.mediaContent?.url || null,
      // pastikan kolom waktu ada sehingga RLS/select bekerja konsisten
      created_at: nowIso,
      expires_at: expiresAtIso
    }));

    // Insert to database dengan upsert berdasarkan link
    const { error } = await supabase
      .from('rss_news')
      .upsert(newsItems, { 
        onConflict: 'link',
        ignoreDuplicates: false 
      });

    if (error) {
      console.error(`Error inserting ${feed.name}:`, error);
      return { success: false, error: error.message };
    } else {
      console.log(`Successfully processed ${newsItems.length} items from ${feed.name}`);
      return { success: true, count: newsItems.length };
    }
  } catch (error) {
    console.error(`Error processing ${feed.name}:`, error);
    return { success: false, error: error.message };
  }
}

async function cleanupExpiredNews() {
  try {
    const { error, count } = await supabase
      .from('rss_news')
      .delete()
      .lt('expires_at', new Date().toISOString());

    if (error) {
      console.error('Error cleaning up expired news:', error);
      return { success: false, error: error.message };
    } else {
      console.log('Successfully cleaned up expired news');
      return { success: true, deletedCount: count };
    }
  } catch (error) {
    console.error('Error cleaning up expired news:', error);
    return { success: false, error: error.message };
  }
}

export const handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    console.log('Starting RSS processing...');
    
    // Process all RSS feeds
    const results = await Promise.all(RSS_FEEDS.map(processRSSFeed));
    
    // Clean up expired news
    const cleanupResult = await cleanupExpiredNews();
    
    const successCount = results.filter(r => r.success).length;
    const totalProcessed = results.reduce((sum, r) => sum + (r.count || 0), 0);
    
    console.log(`RSS processing completed: ${successCount}/${RSS_FEEDS.length} feeds processed, ${totalProcessed} total items`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'RSS processing completed successfully',
        timestamp: new Date().toISOString(),
        feedsProcessed: successCount,
        totalFeeds: RSS_FEEDS.length,
        totalItemsProcessed: totalProcessed,
        cleanupResult: cleanupResult,
        feedResults: results
      })
    };
  } catch (error) {
    console.error('RSS processing failed:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'RSS processing failed',
        details: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};
