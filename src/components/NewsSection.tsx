import { useState, useEffect } from 'react'
import { PostCard } from "./PostCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { fetchPublishedPosts } from '@/lib/posts'
import { supabase } from '@/lib/supabase'

export const NewsSection = () => {
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadNews() {
      try {
        const posts = await fetchPublishedPosts()
        
        // Fetch tags for each post
        const postsWithTags = await Promise.all(
          posts.slice(0, 3).map(async (post: any) => {
            const { data: tagData } = await supabase
              .from('post_tags')
              .select(`
                tag:tags(id, name, slug)
              `)
              .eq('post_id', post.id)
            
            return {
              ...post,
              tags: tagData?.map((item: any) => item.tag) || []
            }
          })
        )
        
        setNews(postsWithTags)
      } catch (error) {
        console.error('Error loading news:', error)
      } finally {
        setLoading(false)
      }
    }

    loadNews()
  }, [])

  if (loading) {
    return (
      <section id="berita" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Berita & Kegiatan Terbaru
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Tetap terhubung dengan aktivitas dan program terbaru kami
            </p>
            <Button asChild>
              <Link to="/posts">Lihat Semua Berita</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (news.length === 0) {
    return (
      <section id="berita" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Berita & Kegiatan Terbaru
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Belum ada berita tersedia saat ini
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="berita" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Berita & Kegiatan Terbaru
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Tetap terhubung dengan aktivitas dan program terbaru kami
          </p>
          <Button asChild>
            <Link to="/posts">Lihat Semua Berita</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {news.map((item, index) => (
            <div
              key={item.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <PostCard {...item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
