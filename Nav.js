'use client';
import { usePathname } from 'next/navigation';
export default function Nav() {
  const p = usePathname();
  if (p === '/login') return null;
  const out = async () => { await fetch('/api/logout', { method: 'POST' }); location.href = '/login'; };
  return <nav><b>🏫 ระบบใบเสร็จ</b><a href="/dashboard">แดชบอร์ด</a><a href="/receipts">ใบเสร็จ</a><a href="/students">นักเรียน</a><a href="/users">ผู้ใช้</a><a href="/audit">ประวัติ</a><button className="r" onClick={out}>ออกจากระบบ</button></nav>;
}
