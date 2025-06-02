import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function POST(request) {
  try {
    // Get request data
    const { newEmail, password } = await request.json();
    
    if (!newEmail) {
      return NextResponse.json({ error: "New email is required" }, { status: 400 });
    }
    
    const cookieStore = cookies();
    
    // Create server client with proper SSR handling
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
    const currentEmail = user.email;
    console.log('User authenticated:', userId);
    
    // If password provided, verify it first (for non-OAuth users)
    if (password && !user.app_metadata?.provider) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: currentEmail,
        password: password
      });
      
      if (signInError) {
        return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
      }
    }
    
    // Update the email in the users table
    const { error: updateUserError } = await supabase
      .from('users')
      .update({ email: newEmail })
      .eq('id', userId);
    
    if (updateUserError) {
      return NextResponse.json({ error: updateUserError.message }, { status: 500 });
    }
    
    // Create admin client to update auth email
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Update the auth user with admin privileges
    const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { email: newEmail, email_confirm: true }
    );
    
    if (authUpdateError) {
      return NextResponse.json({ error: authUpdateError.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, email: newEmail });
    
  } catch (error) {
    console.error('Email update error:', error);
    return NextResponse.json({ 
      error: error.message || "Server error updating email",
      stack: error.stack
    }, { status: 500 });
  }
}
