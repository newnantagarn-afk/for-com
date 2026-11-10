import Crud from '@/components/Crud';
export default function P() {
  return <Crud table="audit_logs" title="ประวัติการแก้ไข (Audit Log)" fields={[{ k: 'created_at', label: 'เวลา' }, { k: 'user_name', label: 'ผู้ใช้' }, { k: 'action', label: 'การกระทำ' }, { k: 'table_name', label: 'ตาราง' }, { k: 'record_id', label: 'รหัสรายการ' }]} />;
}
