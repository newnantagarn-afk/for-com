import Crud from '@/components/Crud';
export default function P() {
  return <Crud table="users" title="จัดการผู้ใช้ / แอดมิน" canWrite
    fields={[{ k: 'username', label: 'ชื่อผู้ใช้' }, { k: 'name', label: 'ชื่อ' }, { k: 'role', label: 'สิทธิ์', opts: ['director', 'finance', 'admin'] }, { k: 'password', label: 'รหัสผ่าน (เว้นว่าง=ไม่เปลี่ยน)', hideInTable: true }]} />;
}
