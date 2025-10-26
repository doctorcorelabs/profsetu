import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  Tag,
  FileText
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { formatDate } from '@/utils/formatDate'
import { fetchAllPosts, deletePost } from '@/lib/posts'
import { toast } from 'react-hot-toast'

const PostsList = () => {
  const [posts, setPosts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadPosts()
  }, [])

  async function loadPosts() {
    try {
      setLoading(true)
      const data = await fetchAllPosts()
      
      // Transform data to include category name
      const transformedData = data.map(post => ({
        ...post,
        category: post.category?.name || 'Uncategorized'
      }))
      
      setPosts(transformedData)
    } catch (error) {
      console.error('Error loading posts:', error)
      toast.error('Gagal memuat posts')
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus post "${title}"?`)) {
      return
    }

    try {
      await deletePost(id)
      toast.success('Post berhasil dihapus')
      loadPosts() // Reload posts
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Gagal menghapus post')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="default" className="bg-green-100 text-green-800">Published</Badge>
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
            <p className="text-gray-600">Kelola semua artikel dan postingan</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Memuat posts...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
          <p className="text-gray-600">Kelola semua artikel dan postingan</p>
        </div>
        <Button asChild>
          <Link to="/admin/posts/create">
            <Plus className="h-4 w-4 mr-2" />
            Buat Post Baru
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter & Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
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
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                Semua
              </Button>
              <Button
                variant={filterStatus === 'published' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('published')}
              >
                <Eye className="h-4 w-4 mr-1" />
                Published
              </Button>
              <Button
                variant={filterStatus === 'draft' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('draft')}
              >
                <EyeOff className="h-4 w-4 mr-1" />
                Draft
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(post.status)}
                    <span className="text-sm text-gray-500">{post.category}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {post.excerpt || 'Tidak ada excerpt'}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(post.created_at)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/posts/${post.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(post.id, post.title)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Tidak ada posts ditemukan</h3>
              <p className="text-sm">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Coba ubah filter atau pencarian Anda'
                  : 'Mulai dengan membuat post pertama Anda'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PostsList

