import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { RichTextEditor } from './RichTextEditor'
import { generateSlug } from '@/utils/slugify'
import { Loader2, X, Plus } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { fetchCategories, fetchTags } from '@/lib/posts'

const postSchema = z.object({
  title: z.string().min(1, 'Judul harus diisi'),
  slug: z.string().min(1, 'Slug harus diisi'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Konten harus diisi'),
  status: z.enum(['draft', 'published']),
  category_id: z.string().optional(),
  featured_image: z.string().optional(),
})

type PostFormData = z.infer<typeof postSchema>

interface PostFormProps {
  initialData?: Partial<PostFormData> & { tags?: string[] }
  onSubmit: (data: PostFormData & { tags: string[] }) => Promise<void>
  isLoading?: boolean
}

export const PostForm = ({ initialData, onSubmit, isLoading = false }: PostFormProps) => {
  const [content, setContent] = useState(initialData?.content || '')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [catsData, tagsData] = await Promise.all([
          fetchCategories(),
          fetchTags()
        ])
        setCategories(catsData)
        setTags(tagsData)
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('Gagal memuat data')
      } finally {
        setLoadingData(false)
      }
    }
    loadData()
  }, [])

  // Set selected tags from initialData
  useEffect(() => {
    if (initialData && 'tags' in initialData && Array.isArray(initialData.tags)) {
      setSelectedTags(initialData.tags)
    }
  }, [initialData])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      excerpt: initialData?.excerpt || '',
      content: initialData?.content || '',
      status: initialData?.status || 'draft',
      category_id: initialData?.category_id || '',
      featured_image: initialData?.featured_image || '',
    }
  })

  const watchedTitle = watch('title')

  // Auto-generate slug when title changes
  useEffect(() => {
    if (watchedTitle && !initialData?.slug) {
      setIsGeneratingSlug(true)
      const timer = setTimeout(() => {
        const slug = generateSlug(watchedTitle)
        setValue('slug', slug)
        setIsGeneratingSlug(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [watchedTitle, setValue, initialData?.slug])

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    // Store as JSON string for TipTap content
    setValue('content', newContent)
  }

  const addTag = (tagId: string) => {
    if (!selectedTags.includes(tagId)) {
      setSelectedTags([...selectedTags, tagId])
    }
  }

  const removeTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter(id => id !== tagId))
  }

  const addNewTag = () => {
    if (newTag.trim() && !tags.some(tag => tag.name.toLowerCase() === newTag.toLowerCase())) {
      // In real implementation, this would create a new tag in the database
      toast.success(`Tag "${newTag}" akan ditambahkan`)
      setNewTag('')
    }
  }

  const onFormSubmit = async (data: PostFormData) => {
    try {
      await onSubmit({ ...data, tags: selectedTags })
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <Card>
            <CardHeader>
              <CardTitle>Konten Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Judul *</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Masukkan judul post"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    {...register('slug')}
                    placeholder="url-friendly-slug"
                    className={errors.slug ? 'border-red-500' : ''}
                  />
                  {isGeneratingSlug && (
                    <Loader2 className="h-4 w-4 animate-spin self-center" />
                  )}
                </div>
                {errors.slug && (
                  <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  URL akan menjadi: /posts/{watch('slug')}
                </p>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  {...register('excerpt')}
                  placeholder="Ringkasan singkat post (opsional)"
                  rows={3}
                />
              </div>

              <div>
                <Label>Konten *</Label>
                <RichTextEditor
                  content={content}
                  onChange={handleContentChange}
                  placeholder="Mulai menulis konten post Anda..."
                />
                {errors.content && (
                  <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Publish Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={watch('status')}
                  onValueChange={(value) => setValue('status', value as 'draft' | 'published')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={watch('category_id')}
                  onValueChange={(value) => setValue('category_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingData ? (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        Memuat kategori...
                      </div>
                    ) : categories.length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        Tidak ada kategori
                      </div>
                    ) : (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="featured_image">Featured Image URL</Label>
                <Input
                  id="featured_image"
                  {...register('featured_image')}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Pilih Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {loadingData ? (
                    <div className="text-sm text-gray-500">Memuat tags...</div>
                  ) : (
                    tags.map((tag) => (
                      <Button
                        key={tag.id}
                        type="button"
                        variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => 
                          selectedTags.includes(tag.id) 
                            ? removeTag(tag.id) 
                            : addTag(tag.id)
                        }
                      >
                        {tag.name}
                      </Button>
                    ))
                  )}
                </div>
              </div>

              <div>
                <Label>Selected Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTags.map((tagId) => {
                    const tag = tags.find(t => t.id === tagId)
                    return tag ? (
                      <Badge key={tagId} variant="secondary" className="flex items-center gap-1">
                        {tag.name}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeTag(tagId)}
                        />
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>

              <div>
                <Label>Tambahkan Tag Baru</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nama tag baru"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addNewTag()
                      }
                    }}
                  />
                  <Button type="button" size="sm" onClick={addNewTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            'Simpan Post'
          )}
        </Button>
      </div>
    </form>
  )
}

