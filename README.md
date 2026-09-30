# ระบบจัดการเครื่องจักรและงานซ่อมบำรุง

## ภาพรวมโปรเจกต์
## เว็บที่ deploy แล้ว
https://machine-maintenance-virid.vercel.app

## เทคโนโลยีที่ใช้
Next.js (App Router), TypeScript, Tailwind CSS, Supabase (Auth + PostgreSQL + RLS),
Zod + React Hook Form, Recharts, GitHub Actions, Vercel

## ฟีเจอร์
(ตามข้อ 3.1-3.7: Login/Role, Machine, Alarm, Maintenance, ค้นหา/กรอง, Dashboard, Validation)

## บทบาทและสิทธิ์
(ตารางสิทธิ์ admin / technician)

## โครงสร้างฐานข้อมูล
(profiles, machines, alarms, maintenance_records และความสัมพันธ์ FK)

## วิธีติดตั้งและรันในเครื่อง
1. clone repo  2. npm install  3. คัดลอก .env.example เป็น .env.local แล้วใส่ค่า  4. npm run dev

## บัญชีสำหรับทดสอบ
admin@test.com / tech@test.com (admin123 / tech123)

## CI/CD และ Deployment

## การใช้ AI ช่วยพัฒนา
(ใช้ Claude ช่วยเรื่องอะไรบ้าง เช่น ออกแบบ schema และ RLS, เขียนโค้ด Auth/CRUD/Validation,
แก้ error, เขียน workflow; และคุณตรวจสอบ/ทดสอบผลอย่างไร)