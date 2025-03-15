import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    console.log("Session API called, session:", session ? "exists" : "none");
    
    if (!session || !session.user) {
      return NextResponse.json({ user: null });
    }
    
    console.log("Returning user from session API:", session.user);
    return NextResponse.json({ user: session.user });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ user: null });
  }
}