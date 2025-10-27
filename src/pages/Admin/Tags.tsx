import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Tag
} from 'lucide-react'
import { generateSlug } from '@/utils/slugify'
import { toast } from 'react-hot-toast'

// Mock data - will be replaced with real data from Supabase
const mockTags = [
  { id: '1', name: 'Pembangunan', slug: 'pembangunan' },
  { id: '2', name: 'Masyarakat', slug: 'masyarakat' },
  { id: '3', name: 'Program', slug: 'program' },
  { id: '4', name: 'Kegiatan', slug: 'kegiatan' },
  { id: '5', name: 'Pemerintahan', slug: 'pemerintahan' },
]

const Tags = () => {
  const [tags, setTags] = useState(mockTags)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  })

  const handleAdd = () => {
    setIsAdding(true)
    setFormData({ name: '', slug: '' })
  }

  const handleEdit = (tag: any) => {
    setEditingId(tag.id)
    setFormData({
      name: tag.name,
      slug: tag.slug
    })
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({ name: '', slug: '' })
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Nama tag harus diisi')
      return
    }

    try {
      if (isAdding) {
        // Add new tag
        const newTag = {
          id: Date.now().toString(),
          name: formData.name,
          slug: formData.slug || generateSlug(formData.name)
        }
        setTags([...tags, newTag])
        toast.success('Tag berhasil ditambahkan')
      } else if (editingId) {
        // Update existing tag
        setTags(tags.map(tag => 
          tag.id === editingId 
            ? { ...tag, name: formData.name, slug: formData.slug }
            : tag
        ))
        toast.success('Tag berhasil diperbarui')
      }
      
      handleCancel()
    } catch (error) {
      console.error('Error saving tag:', error)
      toast.error('Gagal menyimpan tag')
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tag ini?')) {
      try {
        setTags(tags.filter(tag => tag.id !== id))
        toast.success('Tag berhasil dihapus')
      } catch (error) {
        console.error('Error deleting tag:', error)
        toast.error('Gagal menghapus tag')
      }
    }
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name)
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
          <p className="text-gray-600">Kelola tags untuk mengkategorikan posts</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Tag
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isAdding ? 'Tambah Tag Baru' : 'Edit Tag'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nama Tag *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Masukkan nama tag"
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="url-friendly-slug"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Simpan
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tags.map((tag) => (
          <Card key={tag.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Tag className="h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{tag.name}</h3>
                    <p className="text-sm text-gray-500">/{tag.slug}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(tag)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(tag.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">0 posts</Badge>
                <span className="text-xs text-gray-500">ID: {tag.id}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tags.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              <Tag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Belum ada tags</h3>
              <p className="text-sm">Mulai dengan menambahkan tag pertama Anda</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Tags


