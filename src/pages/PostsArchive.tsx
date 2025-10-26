import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { PostCard } from '@/components/PostCard'
import { Pagination } from '@/components/Pagination'
import { Search, Filter } from 'lucide-react'
import { fetchPublishedPosts, fetchCategories } from '@/lib/posts'
import { supabase } from '@/lib/supabase'

const mockPosts = [
  {
    id: "1",
    title: "Dialog dengan Petani: Mendengar Aspirasi Langsung",
    slug: "dialog-dengan-petani-mendengar-aspirasi-langsung",
    excerpt: "Setiya Utama menggelar dialog terbuka dengan para petani untuk membahas program subsidi pupuk dan akses pasar yang lebih baik.",
    featured_image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop",
    category: { id: "1", name: "Politik", slug: "politik" },
    tags: [
      { id: "1", name: "Pembangunan", slug: "pembangunan" },
      { id: "2", name: "Masyarakat", slug: "masyarakat" }
    ],
    created_at: "2025-01-15T10:00:00Z",
    published_at: "2025-01-15T10:00:00Z"
  },
  {
    id: "2",
    title: "Kunjungan ke Puskesmas Daerah",
    slug: "kunjungan-ke-puskesmas-daerah",
    excerpt: "Meninjau fasilitas kesehatan dan berkomitmen meningkatkan pelayanan medis untuk masyarakat kurang mampu.",
    featured_image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
    category: { id: "5", name: "Kesehatan", slug: "kesehatan" },
    tags: [
      { id: "3", name: "Program", slug: "program" },
      { id: "5", name: "Kesehatan", slug: "kesehatan" }
    ],
    created_at: "2025-01-08T14:30:00Z",
    published_at: "2025-01-08T14:30:00Z"
  },
  {
    id: "3",
    title: "Pelatihan UMKM Digital bersama Komunitas",
    slug: "pelatihan-umkm-digital-bersama-komunitas",
    excerpt: "Memfasilitasi pelatihan pemasaran digital untuk pelaku UMKM agar dapat bersaing di era digital.",
    featured_image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop",
    category: { id: "3", name: "Ekonomi", slug: "ekonomi" },
    tags: [
      { id: "4", name: "Kegiatan", slug: "kegiatan" },
      { id: "1", name: "Pembangunan", slug: "pembangunan" }
    ],
    created_at: "2024-12-22T09:15:00Z",
    published_at: "2024-12-22T09:15:00Z"
  },
  {
    id: "4",
    title: "Program Beasiswa untuk Anak Berprestasi",
    slug: "program-beasiswa-untuk-anak-berprestasi",
    excerpt: "Mendukung pendidikan anak-anak berprestasi dengan program beasiswa yang berkelanjutan.",
    featured_image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop",
    category: { id: "4", name: "Pendidikan", slug: "pendidikan" },
    tags: [
      { id: "1", name: "Pembangunan", slug: "pembangunan" },
      { id: "3", name: "Program", slug: "program" }
    ],
    created_at: "2024-12-15T08:00:00Z",
    published_at: "2024-12-15T08:00:00Z"
  },
  {
    id: "5",
    title: "Pembangunan Jembatan Penghubung Desa",
    slug: "pembangunan-jembatan-penghubung-desa",
    excerpt: "Proyek pembangunan jembatan untuk meningkatkan aksesibilitas antar desa di wilayah ini.",
    featured_image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    category: { id: "1", name: "Politik", slug: "politik" },
    tags: [
      { id: "1", name: "Pembangunan", slug: "pembangunan" },
      { id: "2", name: "Masyarakat", slug: "masyarakat" }
    ],
    created_at: "2024-12-10T14:30:00Z",
    published_at: "2024-12-10T14:30:00Z"
  },
  {
    id: "6",
    title: "Kampanye Kebersihan Lingkungan",
    slug: "kampanye-kebersihan-lingkungan",
    excerpt: "Gerakan bersama masyarakat untuk menjaga kebersihan dan keindahan lingkungan.",
    featured_image: "https://images.unsplash.com/photo-1581578731548-c6a0c3f2f6b8?w=400&h=300&fit=crop",
    category: { id: "2", name: "Sosial", slug: "sosial" },
    tags: [
      { id: "4", name: "Kegiatan", slug: "kegiatan" },
      { id: "2", name: "Masyarakat", slug: "masyarakat" }
    ],
    created_at: "2024-12-05T10:00:00Z",
    published_at: "2024-12-05T10:00:00Z"
  }
]

const mockCategories = [
  { id: "1", name: "Politik", slug: "politik" },
  { id: "2", name: "Sosial", slug: "sosial" },
  { id: "3", name: "Ekonomi", slug: "ekonomi" },
  { id: "4", name: "Pendidikan", slug: "pendidikan" },
  { id: "5", name: "Kesehatan", slug: "kesehatan" },
]

const PostsArchive = () => {
  const [posts, setPosts] = useState<any[]>([])
  const [filteredPosts, setFilteredPosts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const postsPerPage = 6

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [postsData, categoriesData] = await Promise.all([
          fetchPublishedPosts(),
          fetchCategories()
        ])

                 // Transform posts to include tags
         const postsWithTags = await Promise.all(
           postsData.map(async (post: any) => {
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

        setPosts(postsWithTags)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    let filtered = posts

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category.id === selectedCategory)
    }

    setFilteredPosts(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [posts, searchTerm, selectedCategory])

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = filteredPosts.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Semua Berita & Kegiatan
            </h1>
            <p className="text-gray-600">
              Temukan semua artikel dan kegiatan terbaru
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Cari berdasarkan judul atau konten..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Info */}
          <div className="mb-6">
            <p className="text-gray-600">
              Menampilkan {currentPosts.length} dari {filteredPosts.length} artikel
              {searchTerm && ` untuk "${searchTerm}"`}
              {selectedCategory !== 'all' && ` dalam kategori ${categories.find(c => c.id === selectedCategory)?.name}`}
            </p>
          </div>

          {/* Posts Grid */}
          {currentPosts.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentPosts.map((post) => (
                  <PostCard key={post.id} {...post} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">
                  <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Tidak ada artikel ditemukan</h3>
                  <p className="text-sm">
                    Coba ubah kata kunci pencarian atau filter kategori Anda
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default PostsArchive

