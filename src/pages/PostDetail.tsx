import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Tag, User } from 'lucide-react'
import { formatDate } from '@/utils/formatDate'
import { fetchPostBySlug } from '@/lib/posts'
import { Loader2 } from 'lucide-react'

const PostDetail = () => {
  const { slug } = useParams()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPost() {
      if (!slug) return
      
      try {
        setLoading(true)
        const data = await fetchPostBySlug(slug)
        setPost(data)
      } catch (error) {
        console.error('Error loading post:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post tidak ditemukan</h1>
          <p className="text-gray-600 mb-6">Post yang Anda cari tidak ditemukan atau telah dihapus.</p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Beranda
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // Parse content - can be JSON from TipTap or HTML string
  let contentHtml = ''
  if (typeof post.content === 'string') {
    try {
      const parsed = JSON.parse(post.content)
      // If it's TipTap JSON, extract HTML
      if (parsed.type === 'doc') {
        // Convert TipTap JSON to HTML (simplified)
        contentHtml = convertTipTapToHTML(parsed)
      } else {
        contentHtml = post.content
      }
    } catch {
      contentHtml = post.content
    }
  } else {
    contentHtml = post.content
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-white to-gray-50 border-b shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" asChild className="mb-6 hover:bg-gray-100">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Beranda
            </Link>
          </Button>
          
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{formatDate(post.published_at || post.created_at)}</span>
            </div>
            {post.category && (
              <>
                <span className="text-gray-300">•</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {post.category.name}
                </Badge>
              </>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-400" />
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 3).map((tag: any) => (
                    <Badge key={tag.id} variant="secondary" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl">
              {post.excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {post.featured_image && (
            <div className="mb-10 overflow-hidden rounded-xl shadow-xl">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-64 sm:h-[32rem] md:h-[36rem] object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          )}
          
          <Card className="shadow-lg border-gray-200">
            <CardContent className="p-8 sm:p-12 lg:p-16">
              <article 
                className="prose prose-lg sm:prose-xl max-w-none
                  prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
                  prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-12
                  prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-10
                  prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg
                  prose-a:text-blue-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900 prose-strong:font-semibold
                  prose-em:text-gray-600 prose-em:not-italic
                  prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
                  prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2
                  prose-li:text-gray-700 prose-li:my-2 prose-li:text-lg
                  prose-blockquote:border-l-4 prose-blockquote:border-blue-500 
                  prose-blockquote:pl-6 prose-blockquote:py-3 prose-blockquote:my-6
                  prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:bg-gray-50 prose-blockquote:rounded-r-lg
                  prose-img:rounded-xl prose-img:shadow-xl prose-img:my-8
                  prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-6
                  prose-code:text-red-600 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                  prose-hr:my-12"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Helper function to convert TipTap JSON to HTML
function convertTipTapToHTML(node: any): string {
  if (!node) return ''
  
  if (typeof node === 'string') return node
  
  if (node.type === 'text') {
    let text = node.text
    // Apply marks in correct order
    if (node.marks) {
      node.marks.forEach((mark: any) => {
        if (mark.type === 'bold') text = `<strong>${text}</strong>`
        if (mark.type === 'italic') text = `<em>${text}</em>`
        if (mark.type === 'link') {
          text = `<a href="${mark.attrs.href}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${text}</a>`
        }
      })
    }
    return text
  }
  
  let html = ''
  
  if (node.content) {
    html = node.content.map((child: any) => convertTipTapToHTML(child)).join('')
  }
  
  // Handle different node types
  switch (node.type) {
    case 'paragraph':
      return `<p class="mb-4 text-gray-700 leading-relaxed">${html}</p>`
    
    case 'heading':
      const level = node.attrs?.level || 1
      const headingClass = {
        1: 'text-4xl font-bold mb-6 mt-8',
        2: 'text-3xl font-bold mb-5 mt-7',
        3: 'text-2xl font-bold mb-4 mt-6',
        4: 'text-xl font-semibold mb-3 mt-5',
        5: 'text-lg font-semibold mb-3 mt-4',
        6: 'text-base font-semibold mb-2 mt-3',
      }[level] || 'text-lg font-semibold mb-2'
      return `<h${level} class="${headingClass} text-gray-900">${html}</h${level}>`
    
    case 'bulletList':
      return `<ul class="mb-4 ml-6 list-disc space-y-2">${html}</ul>`
    
    case 'orderedList':
      return `<ol class="mb-4 ml-6 list-decimal space-y-2">${html}</ol>`
    
    case 'listItem':
      return `<li class="text-gray-700 leading-relaxed">${html}</li>`
    
    case 'blockquote':
      return `<blockquote class="border-l-4 border-blue-500 pl-4 py-2 my-4 italic text-gray-600 bg-gray-50">${html}</blockquote>`
    
    case 'codeBlock':
      return `<pre class="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code>${html}</code></pre>`
    
    case 'hardBreak':
      return '<br />'
    
    case 'image':
      if (node.attrs?.src) {
        return `<div class="my-6">
          <img src="${node.attrs.src}" alt="${node.attrs.alt || 'Image'}" class="w-full h-auto rounded-lg shadow-lg" />
          ${node.attrs.alt ? `<p class="text-sm text-gray-500 italic mt-2 text-center">${node.attrs.alt}</p>` : ''}
        </div>`
      }
      return ''
    
    default:
      return html
  }
}

export default PostDetail

