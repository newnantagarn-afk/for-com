'use client';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
// fields: [{k,label,type?,opts?,hideInTable?}]
export default function Crud({ table, title, fields, canWrite, search, receipt, excel, defaults = {} }) {
  const [rows, setRows] = useState([]), [form, setForm] = useState(defaults), [eid, setEid] = useState(null), [fl, setFl] = useState({ q: '', from: '', to: '' }), [msg, setMsg] = useState('');
  const load = async () => {
    const p = new URLSearchParams(Object.entries(fl).filter(([, v]) => v));
    const r = await fetch(`/api/${table}?${p}`); const d = await r.json(); setRows(Array.isArray(d) ? d : []);
  };
  useEffect(() => { load(); }, []);
  const call = async (method, url, body) => {
    const r = await fetch(url, { method, body: body && JSON.stringify(body) }); const d = await r.json();
    if (!r.ok) setMsg(d.error); else { setMsg(''); setForm(defaults); setEid(null); load(); } return d;
  };
  const save = () => (eid ? call('PUT', `/api/${table}?id=${eid}`, form) : call('POST', `/api/${table}`, form));
  const upload = async (k, file) => { const fd = new FormData(); fd.append('file', file); const d = await (await fetch('/api/upload', { method: 'POST', body: fd })).json(); d.url ? setForm((f) => ({ ...f, [k]: d.url })) : setMsg(d.error); };
  const imp = async (file) => {
    const wb = XLSX.read(await file.arrayBuffer()); const j = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    // หัวคอลัมน์ Excel: student_no, name, classroom, level, year
    await call('POST', '/api/students', j.map((x) => ({ student_no: String(x.student_no ?? ''), name: x.name, classroom: String(x.classroom ?? ''), level: String(x.level ?? ''), year: String(x.year ?? '') })));
  };
  return <main><h2>{title}</h2>
    {search && <div className="card">
      <input placeholder="ค้นหา เลขที่/ชื่อ" value={fl.q} onChange={(e) => setFl({ ...fl, q: e.target.value })} />
      {receipt && <><input type="date" value={fl.from} onChange={(e) => setFl({ ...fl, from: e.target.value })} /><input type="date" value={fl.to} onChange={(e) => setFl({ ...fl, to: e.target.value })} /></>}
      <button onClick={load}>ค้นหา</button></div>}
    {canWrite && <div className="card no-print"><b>{eid ? 'แก้ไข' : 'เพิ่มใหม่'}</b><br />
      {fields.map((f) => f.type === 'file' ? <span key={f.k}>{f.label}: <input type="file" accept="image/*,.pdf" onChange={(e) => upload(f.k, e.target.files[0])} /></span>
        : f.opts ? <select key={f.k} value={form[f.k] ?? ''} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}><option value="">{f.label}</option>{f.opts.map((o) => <option key={o}>{o}</option>)}</select>
        : <input key={f.k} type={f.type || 'text'} placeholder={f.label} title={f.label} value={form[f.k] ?? ''} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} />)}
      <button onClick={save}>บันทึก</button>{eid && <button className="g" onClick={() => { setEid(null); setForm(defaults); }}>ยกเลิก</button>}
      {excel && <div>นำเข้า Excel (คอลัมน์: student_no,name,classroom,level,year): <input type="file" accept=".xlsx,.xls,.csv" onChange={(e) => imp(e.target.files[0])} /></div>}
      <p style={{ color: 'red' }}>{msg}</p></div>}
    <div className="card" style={{ overflowX: 'auto' }}><table><thead><tr>{fields.filter((f) => !f.hideInTable).map((f) => <th key={f.k}>{f.label}</th>)}<th></th></tr></thead><tbody>
      {rows.map((r) => <tr key={r.id} style={{ opacity: r.cancelled ? 0.5 : 1 }}>
        {fields.filter((f) => !f.hideInTable).map((f) => <td key={f.k}>{f.type === 'file' ? (r[f.k] && <a href={r[f.k]} target="_blank">ดูไฟล์</a>) : typeof r[f.k] === 'boolean' ? (r[f.k] ? '✔' : '✘') : r[f.k]}</td>)}
        <td>{receipt && <a href={`/print/${r.id}`} target="_blank"><button>พิมพ์</button></a>}
          {canWrite && !r.locked && <><button className="g" onClick={() => { setEid(r.id); const { id, created_at, created_by, ...rest } = r; setForm(rest); window.scrollTo(0, 0); }}>แก้</button>
            <button className="r" onClick={() => confirm('ลบรายการนี้?') && call('DELETE', `/api/${table}?id=${r.id}`)}>ลบ</button></>}
          {r.locked && <small> 🔒 พิมพ์อย่างเดียว</small>}</td></tr>)}
    </tbody></table></div></main>;
}
