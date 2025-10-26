import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PostForm } from '@/components/Admin/PostForm'
import { Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { fetchPostById, updatePost, updatePostTags } from '@/lib/posts'

const EditPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [postData, setPostData] = useState<any>(null)

  useEffect(() => {
    const loadPostData = async () => {
      try {
        if (!id) return
        
        const post = await fetchPostById(id)
        
        setPostData({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          content: post.content || '',
          status: post.status,
          category_id: post.category_id || '',
          featured_image: post.featured_image || '',
          tags: post.tags?.map((tag: any) => tag.id) || []
        })
      } catch (error) {
        console.error('Error loading post:', error)
        toast.error('Gagal memuat data post')
        navigate('/admin/posts')
      } finally {
        setIsLoadingData(false)
      }
    }

    if (id) {
      loadPostData()
    }
  }, [id, navigate])

  const handleSubmit = async (data: any) => {
    if (!id) return
    
    setIsLoading(true)
    
    try {
      // Update post
      const postUpdate: any = {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        status: data.status,
        category_id: data.category_id || null,
        featured_image: data.featured_image || null,
      }

      // Set published_at if status is published
      if (data.status === 'published') {
        postUpdate.published_at = new Date().toISOString()
      }

      await updatePost(id, postUpdate)

      // Update tags
      await updatePostTags(id, data.tags || [])

      toast.success('Post berhasil diperbarui!')
      navigate('/admin/posts')
    } catch (error) {
      console.error('Error updating post:', error)
      toast.error('Gagal memperbarui post')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat data post...</p>
        </div>
      </div>
    )
  }

  if (!postData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Post tidak ditemukan</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
        <p className="text-gray-600">Edit dan perbarui artikel</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Edit Post</CardTitle>
        </CardHeader>
        <CardContent>
          <PostForm
            initialData={postData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default EditPost

