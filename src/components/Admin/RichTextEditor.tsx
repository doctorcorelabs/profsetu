import React, { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo,
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface RichTextEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
}

export const RichTextEditor = ({ 
  content = '', 
  onChange, 
  placeholder = 'Mulai menulis...' 
}: RichTextEditorProps) => {
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)

  // Parse content - handle both JSON string and HTML
  let editorContent = content
  if (content) {
    try {
      const parsed = JSON.parse(content)
      if (parsed.type === 'doc') {
        editorContent = parsed
      }
    } catch {
      // If not JSON, use as HTML
      editorContent = content
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: editorContent,
    onUpdate: ({ editor }) => {
      // Get JSON content from TipTap
      const json = editor.getJSON()
      onChange?.(JSON.stringify(json))
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4 max-w-none',
      },
    },
  })

  // Add custom styles for lists
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .tiptap ul,
      .tiptap ol {
        margin: 0.75rem 0;
        padding-left: 1.5rem;
      }
      .tiptap ul {
        list-style-type: disc;
      }
      .tiptap ol {
        list-style-type: decimal;
      }
      .tiptap li {
        margin: 0.25rem 0;
      }
      .tiptap li p {
        margin: 0;
      }
      .tiptap blockquote {
        border-left: 4px solid #3b82f6;
        padding-left: 1rem;
        margin: 1rem 0;
        font-style: italic;
        color: #6b7280;
      }
      .tiptap img {
        margin: 1rem 0;
        border-radius: 0.5rem;
      }
      .tiptap a {
        color: #3b82f6;
        text-decoration: underline;
        cursor: pointer;
      }
      .tiptap a:hover {
        color: #2563eb;
      }
      .tiptap strong {
        font-weight: 600;
      }
      .tiptap em {
        font-style: italic;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  if (!editor) {
    return null
  }

  const addImage = () => {
    const url = window.prompt('Masukkan URL gambar:')
    if (url) {
      // Validate URL
      try {
        const imageUrl = url.startsWith('http://') || url.startsWith('https://') 
          ? url 
          : `https://${url}`
        editor.chain().focus().setImage({ 
          src: imageUrl,
          alt: 'Image',
          class: 'max-w-full h-auto rounded-lg'
        }).run()
      } catch (error) {
        console.error('Invalid image URL:', error)
      }
    }
  }

  const setLink = () => {
    if (linkUrl) {
      // Check if URL doesn't have protocol, add https://
      const url = linkUrl.startsWith('http://') || linkUrl.startsWith('https://') 
        ? linkUrl 
        : `https://${linkUrl}`
      
      editor.chain().focus().setLink({ href: url }).run()
      setLinkUrl('')
      setShowLinkInput(false)
    }
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    children, 
    title 
  }: { 
    onClick: () => void
    isActive?: boolean
    children: React.ReactNode
    title: string
  }) => (
    <Button
      type="button"
      variant={isActive ? 'default' : 'outline'}
      size="sm"
      onClick={onClick}
      title={title}
    >
      {children}
    </Button>
  )

  return (
    <div className="border rounded-lg">
      {/* Toolbar */}
      <div className="border-b p-2 flex flex-wrap gap-1 bg-gray-50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => {
            if (editor.isActive('link')) {
              editor.chain().focus().unsetLink().run()
            } else {
              setShowLinkInput(!showLinkInput)
            }
          }}
          isActive={editor.isActive('link')}
          title="Add/Remove Link"
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={addImage}
          title="Add Image"
        >
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="border-b p-2 flex gap-2">
          <Input
            placeholder="Masukkan URL link"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setLink()
              }
            }}
          />
          <Button size="sm" onClick={setLink}>
            Add
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => {
              setShowLinkInput(false)
              setLinkUrl('')
            }}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}

