'use client';
import { useEffect, useState } from 'react';
export default function Print({ params }) {
  const [r, setR] = useState(null);
  useEffect(() => { fetch(`/api/receipts?id=${params.id}`).then((x) => x.json()).then((d) => setR(d[0])); }, []);
  if (!r) return <main>กำลังโหลด...</main>;
  return <main style={{ maxWidth: 650 }}><div className="card"><h2 style={{ textAlign: 'center' }}>ใบเสร็จรับเงิน {r.cancelled && '(ยกเลิก)'}</h2>
    <p>เลขที่: {r.receipt_no}　วันที่: {r.date}</p><p>ได้รับเงินจาก: {r.payer}</p><p>หมายเหตุ: {r.note}</p>
    <p className="big">฿ {Number(r.amount).toLocaleString()}</p>
    {r.file_url && <p className="no-print"><a href={r.file_url} target="_blank">ไฟล์แนบ</a></p>}
    <button className="no-print" onClick={() => window.print()}>🖨 พิมพ์</button></div></main>;
}
