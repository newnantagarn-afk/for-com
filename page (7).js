import Crud from '@/components/Crud';
import { session } from '@/lib/server';
export default async function P() {
  const s = await session();
  return <Crud table="students" title="นักเรียน" search excel canWrite={['admin', 'finance'].includes(s.role)}
    fields={[{ k: 'student_no', label: 'รหัส' }, { k: 'name', label: 'ชื่อ-สกุล' }, { k: 'classroom', label: 'ห้อง' }, { k: 'level', label: 'ระดับชั้น' }, { k: 'year', label: 'ปีการศึกษา' }, { k: 'registered', label: 'ลงทะเบียนแล้ว', opts: ['true', 'false'] }]} />;
}
