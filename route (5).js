import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { db, session } from '@/lib/server';
const ALL = ['admin', 'finance', 'director'], FW = ['admin', 'finance'];
const T = { receipts: { r: ALL, w: FW }, students: { r: ALL, w: FW }, users: { r: ['admin'], w: ['admin'] }, audit_logs: { r: ['admin', 'director'], w: [] } };
const J = (d, status = 200) => NextResponse.json(d, { status });
async function guard(t, write) {
  const s = await session(), c = T[t];
  if (!s || !c || !(write ? c.w : c.r).includes(s.role)) return [null, J({ error: 'ไม่มีสิทธิ์' }, 403)];
  return [s, null];
}
const log = (s, action, t, id, detail) => db.from('audit_logs').insert({ user_name: s.name, action, table_name: t, record_id: id, detail });
const prep = (t, b) => { b = { ...b }; if (t === 'users') { if (b.password) b.password_hash = bcrypt.hashSync(b.password, 10); delete b.password; } return b; };
const clean = (t, rows) => rows.map((r) => { delete r.password_hash; return r; });

export async function GET(req, { params: { table: t } }) {
  const [, err] = await guard(t, false); if (err) return err;
  const u = new URL(req.url).searchParams;
  let q = db.from(t).select('*').order('created_at', { ascending: false, nullsFirst: false }).limit(2000);
  if (t === 'students') q = db.from(t).select('*').order('name').limit(5000);
  if (u.get('id')) q = q.eq('id', u.get('id'));
  if (u.get('q')) q = q.or(t === 'receipts' ? `receipt_no.ilike.%${u.get('q')}%,payer.ilike.%${u.get('q')}%` : `name.ilike.%${u.get('q')}%`);
  if (t === 'receipts') { if (u.get('from')) q = q.gte('date', u.get('from')); if (u.get('to')) q = q.lte('date', u.get('to')); }
  const { data, error } = await q;
  return error ? J({ error: error.message }, 500) : J(clean(t, data));
}
export async function POST(req, { params: { table: t } }) {
  const [s, err] = await guard(t, true); if (err) return err;
  const body = await req.json();
  const rows = (Array.isArray(body) ? body : [body]).map((b) => prep(t, b));
  if (t === 'receipts') rows.forEach((r) => (r.created_by = s.name));
  const { data, error } = await db.from(t).insert(rows).select();
  if (error) return J({ error: error.message }, 400);
  await log(s, 'create', t, data[0]?.id, { count: data.length, ...(rows.length === 1 ? clean(t, [rows[0]])[0] : {}) });
  return J(clean(t, data));
}
async function locked(t, id) { if (t !== 'receipts') return false; const { data } = await db.from(t).select('locked').eq('id', id).single(); return data?.locked; }
export async function PUT(req, { params: { table: t } }) {
  const [s, err] = await guard(t, true); if (err) return err;
  const id = new URL(req.url).searchParams.get('id');
  if (await locked(t, id)) return J({ error: 'ใบเสร็จย้อนหลัง พิมพ์ได้อย่างเดียว แก้ไข/ยกเลิกไม่ได้' }, 403);
  const body = prep(t, await req.json()); delete body.id;
  const { data, error } = await db.from(t).update(body).eq('id', id).select();
  if (error) return J({ error: error.message }, 400);
  await log(s, 'update', t, id, clean(t, [body])[0]);
  return J(data);
}
export async function DELETE(req, { params: { table: t } }) {
  const [s, err] = await guard(t, true); if (err) return err;
  const id = new URL(req.url).searchParams.get('id');
  if (await locked(t, id)) return J({ error: 'ใบเสร็จย้อนหลัง ลบ/ยกเลิกไม่ได้' }, 403);
  if (t === 'users' && id === s.id) return J({ error: 'ลบบัญชีตัวเองไม่ได้' }, 400);
  const { error } = await db.from(t).delete().eq('id', id);
  if (error) return J({ error: error.message }, 400);
  await log(s, 'delete', t, id, {});
  return J({ ok: true });
}
