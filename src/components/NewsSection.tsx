import { useState, useEffect, useCallback } from 'react'
import { PostCard } from "./PostCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { fetchPublishedPosts } from '@/lib/posts'
import { supabase } from '@/lib/supabase'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const NewsSection = () => {
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const POSTS_PER_PAGE = 3
  const SLIDE_INTERVAL = 3000 // 3 detik

  useEffect(() => {
    async function loadNews() {
      try {
        const posts = await fetchPublishedPosts()
        
        // Fetch tags for 5 post terbaru
        const postsWithTags = await Promise.all(
          posts.slice(0, 5).map(async (post: any) => {
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

  // Auto slideshow
  useEffect(() => {
    if (news.length <= POSTS_PER_PAGE) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.ceil(news.length / POSTS_PER_PAGE) - 1
        return prev >= maxIndex ? 0 : prev + 1
      })
    }, SLIDE_INTERVAL)

    return () => clearInterval(interval)
  }, [news.length])

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.ceil(news.length / POSTS_PER_PAGE) - 1
      return prev <= 0 ? maxIndex : prev - 1
    })
  }, [news.length])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.ceil(news.length / POSTS_PER_PAGE) - 1
      return prev >= maxIndex ? 0 : prev + 1
    })
  }, [news.length])

  const visiblePosts = news.slice(
    currentIndex * POSTS_PER_PAGE,
    (currentIndex + 1) * POSTS_PER_PAGE
  )

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
        </div>

        {/* Slideshow Container */}
        <div className="relative max-w-6xl mx-auto mb-8">
          {/* Navigation Buttons */}
          {news.length > POSTS_PER_PAGE && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Posts Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {visiblePosts.map((item, index) => (
              <div
                key={item.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <PostCard {...item} />
              </div>
            ))}
          </div>

          {/* Indicators */}
          {news.length > POSTS_PER_PAGE && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.ceil(news.length / POSTS_PER_PAGE) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-primary w-8'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Button to view all posts */}
        <div className="text-center">
          <Button asChild size="lg">
            <Link to="/posts">Tampilkan Lebih Banyak</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
