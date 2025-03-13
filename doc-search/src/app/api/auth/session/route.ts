import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.NEXTAUTH_SECRET; 

export async function GET() {
  try {
    // Get the token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    console.log("Session API called, token:", token ? token.substring(0, 10) + '...' : 'none');
    
    if (!token) {
      return NextResponse.json({ user: null });
    }
    
    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      console.log("Decoded token userId:", decoded.userId);
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
      
      if (!user) {
        console.log("No user found for token with userId:", decoded.userId);
        return NextResponse.json({ user: null });
      }
      
      console.log("Returning user from session API:", user);
      return NextResponse.json({ user });
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return NextResponse.json({ user: null });
    }
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ user: null });
  }
}