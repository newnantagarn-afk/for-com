import './globals.css';
import Nav from '@/components/Nav';
export const metadata = { title: 'ระบบใบเสร็จโรงเรียน' };
export default function L({ children }) { return <html lang="th"><body><Nav />{children}</body></html>; }
