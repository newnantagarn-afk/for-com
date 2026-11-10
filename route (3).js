import { NextResponse } from 'next/server';
import { db, session } from '@/lib/server';
export async function POST(req) {
  const s = await session();
  if (!s || !['admin', 'finance'].includes(s.role)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const f = (await req.formData()).get('file');
  const path = `${Date.now()}-${f.name.replace(/[^\w.]/g, '_')}`;
  const { error } = await db.storage.from('receipts').upload(path, await f.arrayBuffer(), { contentType: f.type });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ url: db.storage.from('receipts').getPublicUrl(path).data.publicUrl });
}
