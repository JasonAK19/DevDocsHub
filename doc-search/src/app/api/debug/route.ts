import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const authToken = cookieStore.get('auth_token');
  
  // Get all cookie names
  const allCookies = cookieStore.getAll().map(cookie => ({
    name: cookie.name,
    value: cookie.name === 'auth_token' ? 
      (cookie.value ? 'EXISTS (hidden for security)' : 'EMPTY') : 
      'HIDDEN'
  }));
  
  return NextResponse.json({
    authTokenExists: !!authToken,
    cookieDetails: authToken ? {
      name: authToken.name,
      value: 'HIDDEN', // Don't expose the actual token
      expires: authToken.expires,
      path: authToken.path,
      secure: authToken.secure,
      httpOnly: authToken.httpOnly,
    } : null,
    allCookies,
  });
}