import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function POST(request) {
  try {
    // Use the Server-Side Rendering helper for proper cookie handling
    const cookieStore = cookies();
    
    // Create server client with proper ssr helper
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set(name, value, options) {
            // Not needed for this operation
          },
          remove(name, options) {
            // Not needed for this operation
          }
        }
      }
    );
    
    // Get the current user with this client
    const { data: { user }, error: getUserError } = await supabase.auth.getUser();
    
    if (getUserError || !user) {
      return NextResponse.json({ 
        error: getUserError?.message || "Not authenticated", 
        cookies: cookieStore.getAll().map(c => c.name)
      }, { status: 401 });
    }
    
    const userId = user.id;
    console.log('User authenticated:', userId);
    
    // Delete user data from the users table first
    const { error: userDataError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    
    if (userDataError) {
      return NextResponse.json({ error: userDataError.message }, { status: 500 });
    }
    
    // Create admin client to delete the auth user
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Delete the auth user
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (deleteUserError) {
      return NextResponse.json({ error: deleteUserError.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json({ 
      error: error.message || "Server error deleting account",
      stack: error.stack
    }, { status: 500 });
  }
}
