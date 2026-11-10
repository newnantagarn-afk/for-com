'use client';
import { useEffect, useState } from 'react';
export default function Dash() {
  const [rc, setRc] = useState([]), [st, setSt] = useState([]), [g, setG] = useState('day'), [lv, setLv] = useState(''), [cl, setCl] = useState('');
  useEffect(() => { fetch('/api/receipts').then((r) => r.json()).then((d) => setRc(Array.isArray(d) ? d : [])); fetch('/api/students').then((r) => r.json()).then((d) => setSt(Array.isArray(d) ? d : [])); }, []);
  const ok = rc.filter((r) => !r.cancelled), len = g === 'day' ? 10 : g === 'month' ? 7 : 4;
  const by = {}; ok.forEach((r) => { const k = (r.date || '').slice(0, len); by[k] = by[k] || { n: 0, sum: 0 }; by[k].n++; by[k].sum += Number(r.amount); });
  const total = ok.reduce((a, r) => a + Number(r.amount), 0);
  const un = st.filter((s) => !s.registered && (!lv || s.level === lv) && (!cl || s.classroom === cl));
  const uniq = (k) => [...new Set(st.map((s) => s[k]).filter(Boolean))];
  return <main><h2>แดชบอร์ด</h2>
    <div className="row"><div className="card">เงินเข้าทั้งหมด<div className="big">฿ {total.toLocaleString()}</div></div><div className="card">จำนวนใบเสร็จ<div className="big">{ok.length}</div></div><div className="card">ยังไม่ลงทะเบียน<div className="big">{st.filter((s) => !s.registered).length}</div></div></div>
    <div className="card"><b>สรุปตาม </b><select value={g} onChange={(e) => setG(e.target.value)}><option value="day">วัน</option><option value="month">เดือน</option><option value="year">ปี</option></select>
      <table><thead><tr><th>ช่วงเวลา</th><th>จำนวนใบเสร็จ</th><th>ยอดเงิน</th></tr></thead><tbody>{Object.keys(by).sort().reverse().map((k) => <tr key={k}><td>{k}</td><td>{by[k].n}</td><td>{by[k].sum.toLocaleString()}</td></tr>)}</tbody></table></div>
    <div className="card"><b>นักเรียนที่ยังไม่ลงทะเบียน </b>
      <select value={lv} onChange={(e) => setLv(e.target.value)}><option value="">ทุกระดับชั้น</option>{uniq('level').map((x) => <option key={x}>{x}</option>)}</select>
      <select value={cl} onChange={(e) => setCl(e.target.value)}><option value="">ทุกห้อง</option>{uniq('classroom').map((x) => <option key={x}>{x}</option>)}</select>
      <table><thead><tr><th>รหัส</th><th>ชื่อ</th><th>ห้อง</th><th>ชั้น</th><th>ปี</th></tr></thead><tbody>{un.map((s) => <tr key={s.id}><td>{s.student_no}</td><td>{s.name}</td><td>{s.classroom}</td><td>{s.level}</td><td>{s.year}</td></tr>)}</tbody></table></div></main>;
}
