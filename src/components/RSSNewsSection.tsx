import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Clock, Newspaper, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface RSSNewsItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pub_date: string;
  source: string;
  image_url?: string;
}

export const RSSNewsSection = () => {
  const [news, setNews] = useState<RSSNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRSSNews = async () => {
    try {
      // Query tanpa filter expires_at terlebih dahulu untuk testing
      const { data, error } = await supabase
        .from('rss_news')
        .select('*')
        .order('pub_date', { ascending: false })
        .limit(15);

      if (error) {
        console.error('Error loading RSS news:', error);
        // Jika tabel tidak ada (code 42P01), tampilkan pesan
        if (error.code === '42P01' || error.code === 'PGRST116') {
          console.warn('RSS news table not found. Please run rss-news-schema.sql in Supabase.');
        }
      } else {
        // Filter expired news di client side
        const activeNews = (data || []).filter(item => {
          const expiresAt = new Date(item.expires_at);
          const now = new Date();
          return expiresAt > now;
        });
        setNews(activeNews);
      }
    } catch (error) {
      console.error('Error loading RSS news:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRSSNews();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRSSNews();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getSourceColor = (source: string) => {
    const colors: { [key: string]: string } = {
      'Detik News': 'bg-red-100 text-red-800',
      'Kompas': 'bg-blue-100 text-blue-800',
      'Tempo': 'bg-green-100 text-green-800',
      'CNN Indonesia': 'bg-purple-100 text-purple-800',
      'Antara News': 'bg-orange-100 text-orange-800'
    };
    return colors[source] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <section id="berita-indonesia" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Berita Indonesia Terkini
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Update berita terkini dari berbagai sumber terpercaya di Indonesia
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg shadow-md h-80"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return (
      <section id="berita-indonesia" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Berita Indonesia Terkini
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Belum ada berita tersedia saat ini
            </p>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Memuat...' : 'Refresh'}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="berita-indonesia" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Berita Indonesia Terkini
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Update berita terkini dari berbagai sumber terpercaya di Indonesia
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Diperbarui 2x sehari</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              <span>Berita dihapus setelah 2 hari</span>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Memuat...' : 'Refresh Berita'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {news.map((item, index) => (
            <Card 
              key={item.id} 
              className="hover:shadow-lg transition-all duration-300 animate-fade-in bg-white"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {item.image_url && (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getSourceColor(item.source)}`}
                  >
                    <Newspaper className="w-3 h-3 mr-1" />
                    {item.source}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {formatDate(item.pub_date)}
                  </span>
                </div>
                <CardTitle className="text-lg line-clamp-2 hover:text-blue-600 transition-colors">
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-start gap-2"
                  >
                    {item.title}
                    <ExternalLink className="w-4 h-4 flex-shrink-0 mt-1" />
                  </a>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="text-sm text-gray-600 line-clamp-3">
                  {truncateText(item.description)}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Berita dari berbagai sumber terpercaya • 
            <span className="text-blue-600 font-medium">Detik, Kompas, Tempo, CNN Indonesia, Antara</span>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Maksimal 5 berita per sumber • Update setiap 12 jam • Auto-hapus setelah 2 hari
          </p>
        </div>
      </div>
    </section>
  );
};
