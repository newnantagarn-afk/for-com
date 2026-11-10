import { createClient } from '@supabase/supabase-js';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
export const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const key = () => new TextEncoder().encode(process.env.JWT_SECRET);
export const sign = (p) => new SignJWT(p).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('8h').sign(key());
export async function session() {
  try { return (await jwtVerify(cookies().get('token')?.value, key())).payload; } catch { return null; }
}
