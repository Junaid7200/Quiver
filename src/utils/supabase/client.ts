import { createBrowserClient } from '@supabase/ssr'


// the createClient() function will be called on every page that needs to use supabase
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
