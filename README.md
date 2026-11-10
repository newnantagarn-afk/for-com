# ระบบใบเสร็จโรงเรียน (Next.js + Supabase + Vercel)
1. สร้างโปรเจกต์ Supabase → SQL Editor รัน `schema.sql` → Storage สร้าง bucket `receipts` (Public)
2. push โค้ดขึ้น GitHub → Vercel > Import Project
3. ตั้ง Environment Variables ตาม `.env.example` ใน Vercel แล้ว Deploy
4. เข้า /login ด้วย username `admin` + รหัสผ่านที่ต้องการ (ครั้งแรกจะสร้างแอดมินให้อัตโนมัติ) แล้วไปเพิ่มผู้ใช้ ผอ./การเงิน ที่หน้า "ผู้ใช้"
สิทธิ์: admin=ทุกอย่าง | finance=ใบเสร็จ+นักเรียน | director=ดูอย่างเดียว (ไม่เห็นหน้าผู้ใช้)
ใบเสร็จที่ตั้ง "ล็อก=true" (ย้อนหลัง/อิสระ) พิมพ์ได้อย่างเดียว แก้/ลบไม่ได้
