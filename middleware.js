import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
const rules = { '/users': ['admin'], '/audit': ['admin', 'director'], '/receipts': ['admin', 'finance', 'director'], '/students': ['admin', 'finance', 'director'] };
export async function middleware(req) {
  const p = req.nextUrl.pathname;
  let s = null;
  try { s = (await jwtVerify(req.cookies.get('token')?.value, new TextEncoder().encode(process.env.JWT_SECRET))).payload; } catch {}
  if (!s) return NextResponse.redirect(new URL('/login', req.url));
  const r = Object.keys(rules).find((k) => p.startsWith(k));
  if (r && !rules[r].includes(s.role)) return NextResponse.redirect(new URL('/dashboard', req.url));
  return NextResponse.next();
}
export const config = { matcher: ['/dashboard/:path*', '/receipts/:path*', '/students/:path*', '/users/:path*', '/audit/:path*', '/print/:path*'] };
