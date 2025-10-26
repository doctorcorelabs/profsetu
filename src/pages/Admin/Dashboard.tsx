import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Eye, Edit, Calendar } from 'lucide-react'
import { fetchAllPosts } from '@/lib/posts'
import { formatDate } from '@/utils/formatDate'

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    thisMonth: 0
  })
  const [recentPosts, setRecentPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const posts = await fetchAllPosts()
        
        const now = new Date()
        const thisMonth = posts.filter(post => {
          const postDate = new Date(post.created_at)
          return postDate.getMonth() === now.getMonth() && 
                 postDate.getFullYear() === now.getFullYear()
        }).length

        setStats({
          total: posts.length,
          published: posts.filter(p => p.status === 'published').length,
          drafts: posts.filter(p => p.status === 'draft').length,
          thisMonth
        })

        setRecentPosts(posts.slice(0, 3))
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const statsData = [
    {
      title: 'Total Posts',
      value: stats.total.toString(),
      icon: FileText,
      description: 'Semua artikel',
      color: 'text-blue-600'
    },
    {
      title: 'Published',
      value: stats.published.toString(),
      icon: Eye,
      description: 'Artikel yang dipublikasi',
      color: 'text-green-600'
    },
    {
      title: 'Drafts',
      value: stats.drafts.toString(),
      icon: Edit,
      description: 'Artikel draft',
      color: 'text-yellow-600'
    },
    {
      title: 'This Month',
      value: stats.thisMonth.toString(),
      icon: Calendar,
      description: 'Artikel bulan ini',
      color: 'text-purple-600'
    }
  ]

  const getStatusColor = (status: string) => {
    return status === 'published' ? 'bg-green-500' : 'bg-yellow-500'
  }

  const getStatusText = (status: string, date: string) => {
    if (status === 'published') {
      return `Dipublikasi ${formatDate(date)}`
    }
    return `Draft - ${formatDate(date)}`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Ringkasan aktivitas dan statistik</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-12 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Ringkasan aktivitas dan statistik</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Postingan Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.length === 0 ? (
                <p className="text-sm text-gray-500">Tidak ada postingan</p>
              ) : (
                recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(post.status)}`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{post.title}</p>
                      <p className="text-xs text-gray-500">
                        {getStatusText(post.status, post.published_at || post.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="font-medium">Buat Post Baru</div>
                <div className="text-sm text-gray-500">Tulis artikel baru</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="font-medium">Kelola Kategori</div>
                <div className="text-sm text-gray-500">Atur kategori artikel</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="font-medium">Lihat Semua Post</div>
                <div className="text-sm text-gray-500">Kelola semua artikel</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard

