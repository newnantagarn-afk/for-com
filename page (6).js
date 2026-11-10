import Crud from '@/components/Crud';
import { session } from '@/lib/server';
export default async function P() {
  const s = await session();
  return <Crud table="receipts" title="ใบเสร็จ" search receipt canWrite={['admin', 'finance'].includes(s.role)}
    fields={[{ k: 'receipt_no', label: 'เลขที่' }, { k: 'date', label: 'วันที่', type: 'date' }, { k: 'payer', label: 'ชื่อผู้จ่าย' }, { k: 'student_id', label: 'รหัสนักเรียน(เว้นว่าง=ใบเสร็จอิสระ)', hideInTable: true }, { k: 'amount', label: 'จำนวนเงิน', type: 'number' }, { k: 'note', label: 'หมายเหตุ' }, { k: 'file_url', label: 'ไฟล์', type: 'file' }, { k: 'locked', label: 'ล็อก(ย้อนหลัง)', hideInTable: true, opts: ['true', 'false'] }, { k: 'cancelled', label: 'ยกเลิก', hideInTable: true, opts: ['true', 'false'] }]} />;
}
