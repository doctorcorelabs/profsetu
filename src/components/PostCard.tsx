import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate } from '@/utils/formatDate'
// import { LazyImage } from './LazyImage' // Temporarily disabled

interface PostCardProps {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image?: string
  category: {
    id: string
    name: string
    slug: string
  }
  tags: Array<{
    id: string
    name: string
    slug: string
  }>
  created_at: string
  published_at?: string
}

export const PostCard = ({
  id,
  title,
  slug,
  excerpt,
  featured_image,
  category,
  tags,
  created_at,
  published_at
}: PostCardProps) => {
  return (
    <Card className="h-full shadow-card-custom hover:shadow-card-hover-custom transition-smooth hover:-translate-y-1 cursor-pointer">
      <Link to={`/posts/${slug}`}>
        {featured_image && (
          <div className="aspect-video overflow-hidden rounded-t-lg">
            <img
              src={featured_image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(published_at || created_at)}</span>
          </div>
          <CardTitle className="text-xl leading-tight line-clamp-2">
            {title}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-muted-foreground line-clamp-3 mb-4">
            {excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {category.name}
              </Badge>
            </div>
            
            {tags.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Tag className="w-3 h-3" />
                <span>{tags.slice(0, 2).map(tag => tag.name).join(', ')}</span>
                {tags.length > 2 && <span>+{tags.length - 2}</span>}
              </div>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
