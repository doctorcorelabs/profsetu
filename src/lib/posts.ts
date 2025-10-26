import { supabase } from './supabase'
import { Database } from './supabase'

type Post = Database['public']['Tables']['posts']['Row']
type PostInsert = Database['public']['Tables']['posts']['Insert']
type PostUpdate = Database['public']['Tables']['posts']['Update']

export interface PostWithRelations extends Post {
  category?: {
    id: string
    name: string
    slug: string
  } | null
  tags?: Array<{
    id: string
    name: string
    slug: string
  }>
}

// Fetch all posts (for admin)
export async function fetchAllPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    throw error
  }

  return data
}

// Fetch published posts (for public)
export async function fetchPublishedPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching published posts:', error)
    throw error
  }

  return data
}

// Fetch post by ID (for admin edit)
export async function fetchPostById(id: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching post:', error)
    throw error
  }

  // Fetch tags for this post
  if (data) {
    const { data: tagData } = await supabase
      .from('post_tags')
      .select(`
        tag:tags(id, name, slug)
      `)
      .eq('post_id', data.id)
    
    return {
      ...data,
      tags: tagData?.map((item: any) => item.tag) || []
    }
  }

  return data
}

// Fetch post by slug
export async function fetchPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    console.error('Error fetching post:', error)
    throw error
  }

  // Fetch tags for this post
  if (data) {
    const { data: tagData } = await supabase
      .from('post_tags')
      .select(`
        tag:tags(id, name, slug)
      `)
      .eq('post_id', data.id)
    
    return {
      ...data,
      tags: tagData?.map((item: any) => item.tag) || []
    }
  }

  return data
}

// Create post
export async function createPost(postData: PostInsert) {
  const { data, error } = await supabase
    .from('posts')
    .insert(postData)
    .select()
    .single()

  if (error) {
    console.error('Error creating post:', error)
    throw error
  }

  return data
}

// Update post
export async function updatePost(id: string, postData: PostUpdate) {
  const { data, error } = await supabase
    .from('posts')
    .update(postData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating post:', error)
    throw error
  }

  return data
}

// Delete post
export async function deletePost(id: string) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting post:', error)
    throw error
  }
}

// Fetch categories
export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    throw error
  }

  return data
}

// Fetch tags
export async function fetchTags() {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching tags:', error)
    throw error
  }

  return data
}

// Create or update post tags
export async function updatePostTags(postId: string, tagIds: string[]) {
  // Delete existing tags
  await supabase
    .from('post_tags')
    .delete()
    .eq('post_id', postId)

  // Insert new tags
  if (tagIds.length > 0) {
    const { error } = await supabase
      .from('post_tags')
      .insert(
        tagIds.map(tagId => ({
          post_id: postId,
          tag_id: tagId
        }))
      )

    if (error) {
      console.error('Error updating post tags:', error)
      throw error
    }
  }
}
