// Script untuk menjalankan RSS processor secara lokal
// Jalankan: node run-rss-processor-local.js

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import Parser from 'rss-parser';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓ Set' : '✗ Missing');
  process.exit(1);
}

console.log('✓ Supabase credentials loaded');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
});

// RSS feeds Indonesia - CNN dan Antara
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
    console.log(`\n📡 Processing ${feed.name}...`);
    console.log(`   URL: ${feed.url}`);
    
    const rss = await parser.parseURL(feed.url);
    console.log(`   Found ${rss.items.length} items in feed`);
    
    // Batasi 20 berita terbaru per sumber
    const expiryMs = 3 * 24 * 60 * 60 * 1000; // 3 hari
    const nowIso = new Date().toISOString();
    const expiresAtIso = new Date(Date.now() + expiryMs).toISOString();

    const newsItems = rss.items.slice(0, 20).map(item => {
      const newsItem = {
        title: item.title || '',
        description: item.contentSnippet || item.content || item.description || '',
        link: item.link || '',
        pub_date: new Date(item.pubDate || item.isoDate || new Date()).toISOString(),
        source: feed.name,
        image_url: item.enclosure?.url || item.mediaContent?.url || null,
        created_at: nowIso,
        expires_at: expiresAtIso
      };
      return newsItem;
    });

    console.log(`   Prepared ${newsItems.length} items (limited to 20)`);
    console.log(`   Sample titles:`);
    newsItems.slice(0, 3).forEach((item, idx) => {
      console.log(`   ${idx + 1}. ${item.title.substring(0, 60)}...`);
    });

    // Insert to database dengan upsert berdasarkan link
    const { data, error } = await supabase
      .from('rss_news')
      .upsert(newsItems, { 
        onConflict: 'link',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      console.error(`   ❌ Error inserting ${feed.name}:`, error);
      return { success: false, error: error.message };
    } else {
      console.log(`   ✅ Successfully inserted/updated ${newsItems.length} items from ${feed.name}`);
      return { success: true, count: newsItems.length };
    }
  } catch (error) {
    console.error(`   ❌ Error processing ${feed.name}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function cleanupExpiredNews() {
  try {
    console.log('\n🧹 Cleaning up expired news...');
    const { data, error } = await supabase
      .from('rss_news')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select();

    if (error) {
      console.error('   ❌ Error cleaning up expired news:', error);
      return { success: false, error: error.message };
    } else {
      const deletedCount = data?.length || 0;
      console.log(`   ✅ Successfully cleaned up ${deletedCount} expired news items`);
      return { success: true, deletedCount };
    }
  } catch (error) {
    console.error('   ❌ Error cleaning up expired news:', error.message);
    return { success: false, error: error.message };
  }
}

async function verifyData() {
  try {
    console.log('\n📊 Verifying data in database...');
    
    const { data: cnnData, error: cnnError } = await supabase
      .from('rss_news')
      .select('*')
      .eq('source', 'CNN Indonesia')
      .order('pub_date', { ascending: false });

    const { data: antaraData, error: antaraError } = await supabase
      .from('rss_news')
      .select('*')
      .eq('source', 'Antara News')
      .order('pub_date', { ascending: false });

    if (cnnError || antaraError) {
      console.error('   ❌ Error verifying data:', cnnError || antaraError);
      return;
    }

    console.log(`   CNN Indonesia: ${cnnData?.length || 0} items`);
    console.log(`   Antara News: ${antaraData?.length || 0} items`);
    console.log(`   Total: ${(cnnData?.length || 0) + (antaraData?.length || 0)} items`);
    
    if (cnnData && cnnData.length > 0) {
      console.log('\n   Latest CNN articles:');
      cnnData.slice(0, 3).forEach((item, idx) => {
        console.log(`   ${idx + 1}. ${item.title.substring(0, 60)}...`);
        console.log(`      Published: ${new Date(item.pub_date).toLocaleString('id-ID')}`);
        console.log(`      Expires: ${new Date(item.expires_at).toLocaleString('id-ID')}`);
      });
    }

    if (antaraData && antaraData.length > 0) {
      console.log('\n   Latest Antara articles:');
      antaraData.slice(0, 3).forEach((item, idx) => {
        console.log(`   ${idx + 1}. ${item.title.substring(0, 60)}...`);
        console.log(`      Published: ${new Date(item.pub_date).toLocaleString('id-ID')}`);
        console.log(`      Expires: ${new Date(item.expires_at).toLocaleString('id-ID')}`);
      });
    }
  } catch (error) {
    console.error('   ❌ Error verifying data:', error.message);
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════');
  console.log('🚀 RSS PROCESSOR - LOCAL RUNNER');
  console.log('═══════════════════════════════════════════════');
  console.log('Started at:', new Date().toLocaleString('id-ID'));
  
  try {
    // Process all RSS feeds
    console.log('\n📰 Processing RSS feeds...');
    const results = await Promise.all(RSS_FEEDS.map(processRSSFeed));
    
    // Clean up expired news
    const cleanupResult = await cleanupExpiredNews();
    
    // Verify data
    await verifyData();
    
    // Summary
    const successCount = results.filter(r => r.success).length;
    const totalProcessed = results.reduce((sum, r) => sum + (r.count || 0), 0);
    
    console.log('\n═══════════════════════════════════════════════');
    console.log('📋 SUMMARY');
    console.log('═══════════════════════════════════════════════');
    console.log(`✓ Feeds processed: ${successCount}/${RSS_FEEDS.length}`);
    console.log(`✓ Total items processed: ${totalProcessed}`);
    console.log(`✓ Expired items deleted: ${cleanupResult.deletedCount || 0}`);
    console.log(`✓ Completed at: ${new Date().toLocaleString('id-ID')}`);
    console.log('═══════════════════════════════════════════════');
    
    if (successCount === RSS_FEEDS.length) {
      console.log('\n✅ All RSS feeds processed successfully!');
      console.log('🌐 Refresh your browser to see the news articles.');
    } else {
      console.log('\n⚠️  Some RSS feeds failed to process. Check the errors above.');
    }
  } catch (error) {
    console.error('\n❌ RSS processing failed:', error);
    process.exit(1);
  }
}

main();
