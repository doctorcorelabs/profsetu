import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PostForm } from '@/components/Admin/PostForm'
import { toast } from 'react-hot-toast'
import { createPost, updatePostTags } from '@/lib/posts'

const CreatePost = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    
    try {
      const { tags, ...postData } = data
      
      // Set published_at if status is published
      const finalPostData = {
        ...postData,
        published_at: postData.status === 'published' ? new Date().toISOString() : null
      }

      // Create post
      const result = await createPost(finalPostData)
      
      // Update tags
      if (tags && tags.length > 0) {
        await updatePostTags(result.id, tags)
      }
      
      toast.success('Post berhasil dibuat!')
      navigate('/admin/posts')
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error('Gagal membuat post')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Buat Post Baru</h1>
        <p className="text-gray-600">Tulis dan publikasikan artikel baru</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Post</CardTitle>
        </CardHeader>
        <CardContent>
          <PostForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default CreatePost

