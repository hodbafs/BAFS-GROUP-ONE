# BAFS GROUP ONE V5

เว็บไซต์สำหรับพนักงานนำร่องประมาณ 50 คน: เช็กอินตามจังหวะของตน เกม GROUP, Checkpoint, Stamp, การ์ดขอบคุณ, พื้นที่รับฟัง, บทสนทนา และ HPE Studio

โค้ดชุดนี้ใช้ Firebase Project `bafs-group-one` ที่ผู้ใช้ให้ configuration มาแล้ว โครงสร้างนี้ใช้ Firebase Hosting + Google Authentication + Firestore โดยไม่ใช้ Cloud Functions, Cloud Storage หรือ Analytics และไม่มีคำสั่งเปิด Billing

**สถานะ:** โค้ดพร้อมตั้งค่าปลายทาง ยังไม่ใช่หลักฐานว่า Google Login/Firestore/Hosting ถูกเปิดในโครงการจริงแล้ว การตั้งค่า Web App อย่างเดียวไม่ให้สิทธิ์ผู้ช่วยเข้าจัดการ Firebase หรือ GitHub

## เริ่มตรงนี้

เปิด [SETUP_TH.md](SETUP_TH.md) ทำตามขั้นตอน Google Login → Firestore → ผู้ดูแลคนแรก → เผยแพร่ → เตรียมเกม

```bash
npm ci
npm run build
npx firebase login
npm run deploy
```

ใช้ Node.js 22 การทดสอบ Rules ในเครื่องต้องมี Java 17+ ตาม Firebase CLI รุ่นที่ล็อกไว้:

```bash
npm test
```

การทดสอบใช้ project `demo-one` ใน Emulator เท่านั้น ไม่แก้ข้อมูลจริง

## โครงสร้างไฟล์

- `public/index.html`: จุดเริ่มเว็บ โหลดโมดูลหน้าเว็บตามลำดับ
- `public/firebase-config.js`: Web configuration ของโครงการ (ข้อมูล public สำหรับ SDK)
- `public/firebase-client.js`: Firebase SDK, Google Sign-in, session, membership listener
- `public/firebase-bridge.js`: การบันทึกบัญชี เกม Checkpoint และข้อมูลชุมชน
- `public/v5.js` / `v5.css`: ประสบการณ์ V5 และ Responsive UI
- `public/data.js` / `rules.js`: Core Values, เกม และการตรวจคำตอบร่วม
- `public/app.js`, `games.js`, `levels.js`, `account.js`, `community.js`, `v3.js`, `v4.js`: ชิ้นส่วนฐานที่ V5 ใช้ต่อ ไม่ควรลบหรือสลับลำดับเอง
- `public/style.css`, `v3.css`, `v4.css`: รูปแบบฐานที่ V5 ปรับต่อ
- `public/catalog.json`: 168 ชุดเกมที่สร้างจาก build (8 เกม × 3 ระดับ × 7 ชุดหมุนเวียน)
- `firestore.rules`: ตรวจสิทธิ์และผลเกมที่ Firebase ก่อนยอมให้บันทึก
- `firestore.indexes.json`: การตั้งค่า index
- `firebase.json` / `.firebaserc`: การตั้งค่า Hosting และ project
- `scripts/build.mjs`: ตรวจ source/assets และสร้าง catalog
- `tests/security.test.mjs`: การทดสอบข้อมูลส่วนตัว สิทธิ์ HPE การผ่านเกมและ Stamp
- `.github/workflows/firebase-hosting.yml`: เผยแพร่แบบกดรันเองหลังตั้งค่า GitHub Secret

## ความปลอดภัยและการมองเห็น

| ข้อมูล | ผู้ที่อ่านได้ผ่านแอป |
|---|---|
| รายชื่อโปรไฟล์ (ชื่อ/ทีม) | สมาชิกที่ได้รับอนุมัติ |
| อีเมลและสิทธิ์สมาชิก | เจ้าของบัญชีของตนและ HPE |
| เกมและ Checkpoints | เจ้าของบัญชี |
| เช็กอิน | เก็บเฉพาะอุปกรณ์ตามบัญชี ไม่ส่ง Firestore |
| คำขอบคุณส่วนตัว | ผู้ส่งและผู้รับ |
| คำขอบคุณที่ผู้รับเลือกเผยแพร่ | สมาชิกที่ได้รับอนุมัติ |
| ONE VOICE | ผู้ส่งและ HPE |
| ONE TALK / คำตอบ | สมาชิกที่ได้รับอนุมัติ |
| รายงานข้อความ | HPE |
| ONE CHANGE | สมาชิกอ่าน; HPE สร้าง/อัปเดต |

ผู้มีสิทธิ์ดูแล Google Cloud/Firebase Project อาจเข้าถึงฐานข้อมูลผ่าน Console/IAM ได้ จึงไม่ใช้คำสัญญาว่าแม้แต่เจ้าของระบบก็อ่านไม่ได้
อย่าเปิด Firestore แบบ test mode และอย่าลด Rules เป็น `allow read, write: if true`

## เกมและคะแนน

- Firestore Rules ตรวจหลักฐานคำตอบกับ catalog ที่ผู้ดูแลเตรียมไว้ ไม่เชื่อค่า `passed` จากหน้าเว็บเพียงอย่างเดียว
- ระดับต้องผ่านตามลำดับ และมีขั้นรู้จักค่านิยมก่อนเกมหลัก
- Stamp ต้องมีรู้จักค่านิยม + เกมหลักครบ 3 ระดับ + บันทึกนำไปใช้จริง 15–500 ตัวอักษร
- การนำไปใช้จริงเป็นการยืนยันด้วยตนเอง
- เกมผ่านครั้งแรกต่อเกมต่อวันได้ 20 แต้ม ภารกิจรายวัน 10 แต้ม Stamp ใหม่ 100 แต้ม
- คะแนนคำนวณจากรายการที่ผ่าน Rules ไม่มีเอกสารแต้มที่ผู้ใช้เพิ่มค่าเองได้
- catalog อ่านได้โดยสมาชิกและโจทย์เกมอยู่ใน browser ระบบนี้เป็นกิจกรรมมีส่วนร่วม ไม่ใช่ระบบสอบหรือระบบรางวัลที่ต้องป้องกันการใช้โปรแกรมช่วยตอบ
- โจทย์หมุน 7 ชุดต่อเกมและระดับ; เนื้อหาสถานการณ์บางส่วนอาจซ้ำกัน

## ข้อจำกัดการนำร่อง

- ไม่รวมการย้ายข้อมูลจาก Site ที่ใช้บัญชี ChatGPT มา Google UID โดยอัตโนมัติ ข้อมูลต้นทางยังคงอยู่
- ไม่รวมการอัปโหลดไฟล์/ภาพ/วิดีโอ, push notification, อีเมลแจ้งเตือน หรือการวิเคราะห์อารมณ์
- ONE TALK อัปเดตรายการหัวข้อล่าสุดแบบ realtime; คำตอบในวงคุยเปิดโหลดใหม่หรือกดอัปเดต
- แสดงหัวข้อ TALK 40 รายการล่าสุด และคำตอบ 100 รายการแรกต่อหัวข้อในรุ่นนำร่อง
- เมื่อลบหัวข้อ คำตอบใต้หัวข้อนั้นไม่ถูกลบโดย Firestore อัตโนมัติ แต่ Rules ปิดการอ่านเมื่อไม่มีหัวข้อ ให้ผู้ดูแลจัดการ retention ใน Console ตามนโยบายองค์กร
- อ่านประวัติเกมของตนเมื่อโหลด/บันทึกผล จึงควรติดตาม Firestore Usage เมื่อใช้งานต่อเนื่องเป็นเวลานาน
- ขนาดกลุ่ม 50 คนไม่ใช่การรับประกันว่าจะไม่ถึง quota Spark; ขึ้นกับความถี่การใช้งาน
- ไม่ได้ทดสอบ Google OAuth บนโดเมน production จริงจนกว่าเจ้าของโครงการจะเปิดและเผยแพร่ปลายทาง

## GitHub

เป้าหมายผู้ใช้: https://github.com/hodbafs/BAFS-GROUP-ONE

แตก ZIP แล้ววาง **ไฟล์ข้างในโฟลเดอร์โครงการ** เป็น root ของ repository อย่าวางทั้ง ZIP และอย่าสร้างโฟลเดอร์ซ้อนจน `firebase.json` อยู่ผิดตำแหน่ง
ให้ตรวจไฟล์เดิมและสำรองก่อน merge ไม่มี force push ในคู่มือนี้
GitHub เป็นที่เก็บ source และ Workflow; เว็บไซต์นี้เผยแพร่บน Firebase Hosting ไม่ใช่ GitHub Pages
