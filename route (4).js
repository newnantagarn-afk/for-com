import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { db, sign } from '@/lib/server';
export async function POST(req) {
  const { username, password } = await req.json();
  let { data: u } = await db.from('users').select('*').eq('username', username).maybeSingle();
  if (!u) { // สร้างแอดมินคนแรกอัตโนมัติ เมื่อยังไม่มีผู้ใช้เลย
    const { count } = await db.from('users').select('*', { count: 'exact', head: true });
    if (count === 0 && username === 'admin') {
      ({ data: u } = await db.from('users').insert({ username, name: 'ผู้ดูแลระบบ', role: 'admin', password_hash: bcrypt.hashSync(password, 10) }).select().single());
    }
  }
  if (!u || !bcrypt.compareSync(password, u.password_hash)) return NextResponse.json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set('token', await sign({ id: u.id, name: u.name || u.username, role: u.role }), { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 28800 });
  await db.from('audit_logs').insert({ user_name: u.username, action: 'login', table_name: 'users', record_id: u.id });
  return res;
}
