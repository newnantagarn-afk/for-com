'use client';
import { useState } from 'react';
export default function Login() {
  const [f, setF] = useState({ username: '', password: '' }), [e, setE] = useState('');
  const go = async (ev) => {
    ev.preventDefault();
    const r = await fetch('/api/login', { method: 'POST', body: JSON.stringify(f) });
    r.ok ? (location.href = '/dashboard') : setE((await r.json()).error);
  };
  return <main style={{ maxWidth: 360, marginTop: 80 }}><div className="card"><h2>🏫 เข้าสู่ระบบ</h2>
    <input placeholder="ชื่อผู้ใช้" value={f.username} onChange={(x) => setF({ ...f, username: x.target.value })} style={{ width: '90%' }} />
    <input type="password" placeholder="รหัสผ่าน" value={f.password} onChange={(x) => setF({ ...f, password: x.target.value })} style={{ width: '90%' }} />
    <button onClick={go} style={{ width: '95%' }}>เข้าสู่ระบบ</button><p style={{ color: 'red' }}>{e}</p></div></main>;
}
