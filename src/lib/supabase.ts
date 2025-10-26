import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: any
          excerpt: string | null
          featured_image: string | null
          status: 'draft' | 'published'
          category_id: string | null
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: any
          excerpt?: string | null
          featured_image?: string | null
          status?: 'draft' | 'published'
          category_id?: string | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: any
          excerpt?: string | null
          featured_image?: string | null
          status?: 'draft' | 'published'
          category_id?: string | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          username: string
          password_hash: string
          created_at: string
        }
        Insert: {
          id?: string
          username: string
          password_hash: string
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          password_hash?: string
          created_at?: string
        }
      }
      rss_news: {
        Row: {
          id: string
          title: string
          description: string | null
          link: string
          pub_date: string
          source: string
          image_url: string | null
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          link: string
          pub_date: string
          source: string
          image_url?: string | null
          created_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          link?: string
          pub_date?: string
          source?: string
          image_url?: string | null
          created_at?: string
          expires_at?: string
        }
      }
    }
  }
}
