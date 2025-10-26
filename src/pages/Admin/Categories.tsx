import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  FolderOpen
} from 'lucide-react'
import { generateSlug } from '@/utils/slugify'
import { toast } from 'react-hot-toast'

// Mock data - will be replaced with real data from Supabase
const mockCategories = [
  { id: '1', name: 'Politik', slug: 'politik', description: 'Berita dan kegiatan politik' },
  { id: '2', name: 'Sosial', slug: 'sosial', description: 'Kegiatan sosial dan kemasyarakatan' },
  { id: '3', name: 'Ekonomi', slug: 'ekonomi', description: 'Program ekonomi dan pembangunan' },
  { id: '4', name: 'Pendidikan', slug: 'pendidikan', description: 'Kegiatan pendidikan dan pelatihan' },
  { id: '5', name: 'Kesehatan', slug: 'kesehatan', description: 'Program kesehatan masyarakat' },
]

const Categories = () => {
  const [categories, setCategories] = useState(mockCategories)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  })

  const handleAdd = () => {
    setIsAdding(true)
    setFormData({ name: '', slug: '', description: '' })
  }

  const handleEdit = (category: any) => {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || ''
    })
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({ name: '', slug: '', description: '' })
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Nama kategori harus diisi')
      return
    }

    try {
      if (isAdding) {
        // Add new category
        const newCategory = {
          id: Date.now().toString(),
          name: formData.name,
          slug: formData.slug || generateSlug(formData.name),
          description: formData.description
        }
        setCategories([...categories, newCategory])
        toast.success('Kategori berhasil ditambahkan')
      } else if (editingId) {
        // Update existing category
        setCategories(categories.map(cat => 
          cat.id === editingId 
            ? { ...cat, name: formData.name, slug: formData.slug, description: formData.description }
            : cat
        ))
        toast.success('Kategori berhasil diperbarui')
      }
      
      handleCancel()
    } catch (error) {
      console.error('Error saving category:', error)
      toast.error('Gagal menyimpan kategori')
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      try {
        setCategories(categories.filter(cat => cat.id !== id))
        toast.success('Kategori berhasil dihapus')
      } catch (error) {
        console.error('Error deleting category:', error)
        toast.error('Gagal menghapus kategori')
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
          <h1 className="text-2xl font-bold text-gray-900">Kategori</h1>
          <p className="text-gray-600">Kelola kategori untuk mengorganisir posts</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Kategori
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isAdding ? 'Tambah Kategori Baru' : 'Edit Kategori'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nama Kategori *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Masukkan nama kategori"
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
            <div>
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Deskripsi kategori (opsional)"
                rows={3}
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

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <FolderOpen className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">/{category.slug}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {category.description && (
                <p className="text-sm text-gray-600 mb-3">{category.description}</p>
              )}
              <div className="flex items-center justify-between">
                <Badge variant="secondary">0 posts</Badge>
                <span className="text-xs text-gray-500">ID: {category.id}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Belum ada kategori</h3>
              <p className="text-sm">Mulai dengan menambahkan kategori pertama Anda</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Categories

