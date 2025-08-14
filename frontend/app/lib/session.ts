'use server'

import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'



const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)
 
export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}


 
export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Failed to verify session')
  }
}


export async function getUserDetailsFromCookie() {
  try {
    // Get "session" cookie from request
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return null; // no cookie found
    }

    
    const payload = await decrypt(sessionCookie);

    if (!payload) {
      return null; 
    }

    const { userId, email, exp,token } = payload;

    if (exp && Date.now() >= exp * 1000) {
      return null; // token expired
    }

    console.log("User Details",userId, email, exp,token)

    return { userId, email, expiresIn: exp,token };
  } catch (error) {
    console.error('Error reading session cookie:', error);
    return null;
  }
}

export async function createSession(userId: string,email:string,token:string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, expiresAt,email,token })
  const cookieStore = await cookies()
 
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}


export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}