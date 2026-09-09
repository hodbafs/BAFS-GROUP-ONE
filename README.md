# BAFS GROUP ONE — Web Application

เว็บแอปพลิเคชันส่งเสริมวัฒนธรรมองค์กร **BAFS Group Core Values (GROUP)** พร้อมระบบเช็กอินประจำวัน มินิเกม 8 รูปแบบ Passport และระบบสะสม Stamp

---

## 🚀 วิธีนำขึ้น GitHub และเปิดใช้งาน GitHub Pages

โฟลเดอร์นี้ถูกจัดเตรียมโครงสร้างให้พร้อม Deploy บน **GitHub Pages** โดยไม่ต้องแก้ไขโค้ดหรือ path ใดๆ เพิ่มเติม

### 📌 วิธีที่ 1: อัปโหลดผ่านหน้าเว็บ GitHub (ง่ายที่สุด ไม่ต้องติดตั้งโปรแกรม)

1. เข้าเว็บไซต์ [GitHub.com](https://github.com) แล้วล็อกอิน
2. กดปุ่ม **New** (สีเขียว) เพื่อสร้าง Repository ใหม่
   - ตั้งชื่อ เช่น afs-group-one
   - เลือกเป็น **Public** (หากต้องการใช้ GitHub Pages ฟรี)
   - ไม่ต้องติ๊ก Add README
   - กดปุ่ม **Create repository**
3. ที่หน้าแรกของ Repository ให้กดที่ข้อความ **uploading an existing file**
4. ลากไฟล์และโฟลเดอร์ทั้งหมดที่อยู่ในโฟลเดอร์ github_deploy นี้ไปวางในหน้าเว็บ GitHub
5. เลื่อนลงมาด้านล่าง กดปุ่มสีเขียว **Commit changes**

---

### 📌 วิธีที่ 2: ใช้คำสั่ง Git (สำหรับผู้ที่มี Git CLI ในเครื่อง)

เปิด Terminal หรือ Command Prompt ในโฟลเดอร์นี้ แล้วรัน:

``bash
git init
git add .
git commit -m "Initial deploy BAFS GROUP ONE"
git branch -M main
git remote add origin https://github.com/<USERNAME>/<REPO_NAME>.git
git push -u origin main
``

---

## 🌐 ขั้นตอนเปิดใช้งาน GitHub Pages (ให้ทุกคนเข้าใช้งานผ่านลิงก์ได้)

หลังจากอัปโหลดโค้ดขึ้น GitHub เรียบร้อยแล้ว:

1. ในหน้า Repository บน GitHub ให้คลิกแท็บ **Settings** (รูปฟันเฟืองด้านบน)
2. เมนูด้านซ้าย เลือก **Pages** (อยู่ในหมวด Code and automation)
3. ที่หัวข้อ **Build and deployment**:
   - **Source:** เลือก Deploy from a branch
   - **Branch:** เลือก main และเลือกโฟลเดอร์เป็น /(root)
   - กดปุ่ม **Save**
4. รอประมาณ 1–2 นาที GitHub จะแสดงแถบสีฟ้าพร้อม URL ของเว็บไซต์ เช่น:
   `
   Your site is live at https://<username>.github.io/<repo-name>/
   `
5. คลิกเปิดลิงก์ หรือแชร์ลิงก์นี้ให้เพื่อนร่วมงานเข้าใช้งานได้ทันที!

---

## 📁 โครงสร้างไฟล์ในโฟลเดอร์นี้

- index.html : หน้าแรกของเว็บ (ตั้งอยู่ที่ Root ตามมาตรฐาน GitHub Pages)
- style.css, 3.css, 4.css : สไตล์และการตกแต่งหน้าเว็บ
- pp.js, 3.js, 4.js : ระบบการทำงานหลักและ UI Flow
- games.js, ules.js, levels.js : ระบบเกม Core Values 8 เกมและกติกา
- community.js, ccount.js, data.js : ข้อมูลและระบบบันทึกในเครื่อง
- mascot/ : รูปภาพน้องเติมเต็ม (มุมหน้า, มุมข้าง, มุมหลัง)
- .github/workflows/deploy.yml : Workflow เผื่อกรณีใช้ GitHub Actions
- Open_Local_Preview.bat : ดับเบิลคลิกเพื่อทดสอบเปิดดูหน้าเว็บบนเครื่องคอมพิวเตอร์ก่อนอัปโหลด
