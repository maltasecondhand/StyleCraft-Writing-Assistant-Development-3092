import { createClient } from '@supabase/supabase-js'

// モックのSupabase設定（実際の開発時は環境変数を使用）
const SUPABASE_URL = 'https://your-project.supabase.co'
const SUPABASE_ANON_KEY = 'your-anon-key'

// モック用のクライアント
const mockSupabase = {
  auth: {
    getUser: () => Promise.resolve({ 
      data: { user: { id: 'mock-user-id' } }, 
      error: null 
    })
  },
  from: (table) => ({
    insert: (data) => Promise.resolve({ data: { id: 'mock-id', ...data[0] }, error: null }),
    update: (data) => ({
      eq: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: { id: 'mock-id', ...data }, error: null })
          })
        })
      })
    }),
    delete: () => ({
      eq: () => ({
        eq: () => Promise.resolve({ error: null })
      })
    }),
    select: (columns) => ({
      eq: () => ({
        order: () => Promise.resolve({ 
          data: [], 
          error: null 
        })
      })
    })
  }),
  storage: {
    from: (bucket) => ({
      upload: (path, file) => Promise.resolve({ 
        data: { path }, 
        error: null 
      }),
      getPublicUrl: (path) => ({ 
        data: { publicUrl: `https://mock-storage.com/${path}` } 
      })
    })
  }
};

// 実際のSupabaseが利用可能な場合は実際のクライアントを、そうでなければモックを使用
let supabaseClient;

try {
  if (SUPABASE_URL !== 'https://your-project.supabase.co' && SUPABASE_ANON_KEY !== 'your-anon-key') {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
  } else {
    console.log('Using mock Supabase client for development');
    supabaseClient = mockSupabase;
  }
} catch (error) {
  console.log('Falling back to mock Supabase client');
  supabaseClient = mockSupabase;
}

export default supabaseClient;