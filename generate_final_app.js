const fs = require('fs');

const templates = JSON.parse(fs.readFileSync('scratch_templates.json', 'utf8'));
const courseData = JSON.parse(fs.readFileSync('scratch_course_data.json', 'utf8'));

// Build final clean index.html directly
const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dashboard Guru – Auto Rapor Harian</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<style>
:root{
  --g50:#f0fdf4;--g100:#dcfce7;--g200:#bbf7d0;--g300:#86efac;--g400:#4ade80;
  --g500:#22c55e;--g600:#16a34a;--g700:#15803d;--g900:#14532d;
  --slate:#1e293b;--slate2:#334155;--muted:#64748b;--border:#e2e8f0;
  --white:#ffffff;--bg:#f8fafc;
  --shadow-sm:0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04);
  --shadow-md:0 4px 12px rgba(0,0,0,.08);
  --shadow-lg:0 10px 30px rgba(0,0,0,.1);
  --shadow-xl:0 20px 40px rgba(0,0,0,.12);
  --radius:16px;--radius-sm:10px;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{font-family:'Plus Jakarta Sans',sans-serif;background:linear-gradient(135deg,var(--bg) 0%,#f0fdf4 100%);color:var(--slate);min-height:100vh;overflow-x:hidden;}

/* Nav */
.topnav{background:rgba(255,255,255,.95);border-bottom:1px solid var(--border);padding:0 32px;height:72px;display:flex;align-items:center;gap:16px;position:sticky;top:0;z-index:100;box-shadow:var(--shadow-md);backdrop-filter:blur(10px);}
.topnav-logo{width:44px;height:44px;background:linear-gradient(135deg,var(--g500),var(--g700));border-radius:12px;display:grid;place-items:center;font-size:22px;flex-shrink:0;box-shadow:0 4px 12px rgba(34,197,94,.2);animation:logoFloat 3s ease-in-out infinite;}
@keyframes logoFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
.topnav h1{font-size:20px;font-weight:800;background:linear-gradient(135deg,var(--g600),var(--g700));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:-.5px;}
.topnav span{font-size:13px;color:var(--muted);margin-left:auto;font-weight:500;}

/* Tabs */
.tab-bar{display:flex;gap:4px;padding:20px 28px 0;max-width:1500px;margin:0 auto;}
.tab-btn{padding:10px 22px;border:none;border-radius:10px 10px 0 0;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;background:var(--border);color:var(--muted);}
.tab-btn.active{background:var(--white);color:var(--g700);box-shadow:0 -2px 8px rgba(0,0,0,.06);}
.tab-btn:hover:not(.active){background:var(--g100);color:var(--g700);}

/* Layout */
.app-layout{display:flex;max-width:1500px;margin:0 auto;padding:0 28px 32px;gap:32px;align-items:flex-start;}
.tab-content{display:none;width:100%;padding-top:24px;}
.tab-content.active{display:flex;gap:32px;align-items:flex-start;}

.sidebar{width:420px;flex-shrink:0;display:flex;flex-direction:column;gap:20px;position:sticky;top:104px;max-height:calc(100vh - 124px);overflow-y:auto;padding-right:8px;}
.sidebar::-webkit-scrollbar{width:6px;}
.sidebar::-webkit-scrollbar-thumb{background:var(--g200);border-radius:8px;}

/* Cards */
.card{background:var(--white);border-radius:var(--radius);border:1px solid var(--border);box-shadow:var(--shadow-sm);padding:26px;transition:all .3s cubic-bezier(.4,0,.2,1);animation:cardSlideIn .5s ease-out forwards;opacity:0;}
@keyframes cardSlideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.card:nth-child(1){animation-delay:.1s}.card:nth-child(2){animation-delay:.2s}.card:nth-child(3){animation-delay:.3s}.card:nth-child(4){animation-delay:.4s}
.card:hover{border-color:var(--g300);box-shadow:var(--shadow-lg);transform:translateY(-2px);}
.card-title{font-size:12px;font-weight:800;color:var(--g700);text-transform:uppercase;letter-spacing:1px;margin-bottom:18px;display:flex;align-items:center;gap:10px;padding-bottom:12px;}
.card-title::before{content:'';width:4px;height:4px;background:var(--g500);border-radius:50%;}
.card-title::after{content:'';flex:1;height:2px;background:linear-gradient(90deg,var(--g200),transparent);border-radius:1px;}

/* Form */
.form-row{display:flex;gap:14px;}
.form-group{flex:1;display:flex;flex-direction:column;gap:8px;}
label{font-size:12px;font-weight:700;color:var(--slate2);letter-spacing:.3px;text-transform:uppercase;}
input[type="text"],input[type="date"],input[type="time"],input[type="file"],textarea,select{width:100%;padding:12px 16px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;color:var(--slate);background:var(--bg);transition:all .3s cubic-bezier(.4,0,.2,1);}
input:focus,textarea:focus,select:focus{outline:none;border-color:var(--g500);box-shadow:0 0 0 4px rgba(34,197,94,.1);background:var(--white);transform:translateY(-1px);}
select{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748b' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:36px;}
input[type="file"]{padding:10px 14px;cursor:pointer;font-size:13px;color:var(--muted);}

/* Student Cards */
.students-list{display:flex;flex-direction:column;gap:14px;}
.student-card{background:linear-gradient(135deg,var(--g50),#ffffff);border:1.5px solid var(--g200);border-radius:var(--radius-sm);padding:18px;display:flex;flex-direction:column;gap:12px;position:relative;animation:slideInLeft .4s cubic-bezier(.4,0,.2,1);transition:all .3s cubic-bezier(.4,0,.2,1);overflow:hidden;}
.student-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--g400),var(--g600));transform:scaleX(0);transform-origin:left;transition:transform .3s cubic-bezier(.4,0,.2,1);}
.student-card:hover{border-color:var(--g400);box-shadow:0 4px 12px rgba(34,197,94,.1);transform:translateX(2px);}
.student-card:hover::before{transform:scaleX(1);}
@keyframes slideInLeft{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}
.student-card-header{display:flex;align-items:center;gap:10px;}
.student-num{width:32px;height:32px;background:linear-gradient(135deg,var(--g500),var(--g700));color:white;border-radius:10px;display:grid;place-items:center;font-size:12px;font-weight:800;flex-shrink:0;box-shadow:0 2px 8px rgba(34,197,94,.2);}
.student-card-header input{flex:1;font-weight:700;border:none;background:transparent;color:var(--slate);padding:0;font-size:14px;}
.student-card-header input:focus{box-shadow:none;border:none;}
.btn-del{width:32px;height:32px;background:#fee2e2;color:#dc2626;border:none;border-radius:8px;cursor:pointer;display:grid;place-items:center;font-size:16px;flex-shrink:0;transition:all .3s;font-weight:600;}
.btn-del:hover{background:#fca5a5;transform:scale(1.05) rotate(10deg);}
.student-card textarea{min-height:90px;resize:vertical;font-size:13px;line-height:1.6;border:1px solid var(--g200);background:var(--white);}

/* Auto-generate section in student card */
.auto-gen-row{display:flex;flex-direction:column;gap:8px;}
.auto-gen-selectors{display:flex;gap:8px;}
.auto-gen-selectors select{font-size:12px;padding:8px 10px;padding-right:30px;}
.btn-generate{width:100%;padding:10px;background:linear-gradient(135deg,var(--g500),var(--g600));color:white;border:none;border-radius:var(--radius-sm);font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .3s;display:flex;align-items:center;justify-content:center;gap:8px;}
.btn-generate:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(34,197,94,.3);}
.btn-generate:active{transform:translateY(0);}

/* Buttons */
.btn-add{width:100%;padding:13px;background:linear-gradient(135deg,var(--g100),var(--g50));color:var(--g700);border:2px dashed var(--g400);border-radius:var(--radius-sm);font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .3s;margin-top:12px;position:relative;overflow:hidden;}
.btn-add:hover{background:linear-gradient(135deg,var(--g200),var(--g100));border-color:var(--g600);transform:translateY(-2px);box-shadow:0 4px 12px rgba(34,197,94,.15);}

.download-group{display:flex;flex-direction:column;gap:12px;}
.download-row{display:flex;gap:12px;}
.btn-dl{flex:1;padding:14px;border:none;border-radius:var(--radius-sm);font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:all .3s;position:relative;overflow:hidden;}
.btn-dl-png{background:linear-gradient(135deg,var(--slate),#0f172a);color:white;}
.btn-dl-png:hover{transform:translateY(-3px);box-shadow:0 8px 20px rgba(30,41,59,.25);}
.btn-dl-wa{background:linear-gradient(135deg,#25d366,#128c4a);color:white;}
.btn-dl-wa:hover{transform:translateY(-3px);box-shadow:0 8px 20px rgba(37,211,102,.25);}
.btn-dl-pdf{background:linear-gradient(135deg,var(--g600),var(--g700));color:white;}
.btn-dl-pdf:hover{transform:translateY(-3px);box-shadow:0 8px 20px rgba(22,163,74,.25);}
.btn-dl:disabled{opacity:.6;cursor:not-allowed;transform:none !important;}

/* Tip Box */
.tip-box{background:linear-gradient(135deg,var(--g50),#ffffff);border:1.5px solid var(--g200);border-radius:var(--radius-sm);padding:14px 16px;font-size:12px;color:var(--g700);line-height:1.7;margin-top:12px;}
.tip-box strong{color:var(--g600);font-weight:700;}

/* WA Preview */
.wa-preview{background:linear-gradient(135deg,#f0fdf4,#ffffff);border:1.5px solid var(--g200);border-radius:var(--radius-sm);padding:14px;margin-top:12px;}
.wa-preview-title{font-size:11px;font-weight:700;color:var(--g700);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px;display:flex;align-items:center;gap:8px;}
.wa-preview-title::before{content:'';width:3px;height:3px;background:var(--g500);border-radius:50%;}
.wa-bubble{background:white;border-radius:12px 12px 12px 4px;padding:12px 14px;font-size:12.5px;color:var(--slate2);line-height:1.7;white-space:pre-wrap;border:1px solid var(--border);box-shadow:var(--shadow-sm);}

/* Preview Area */
.preview-area{flex:1;min-width:0;}
.preview-label{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;margin-bottom:16px;display:flex;align-items:center;gap:10px;}
.live-dot{width:8px;height:8px;background:var(--g500);border-radius:50%;animation:dotPulse 2s cubic-bezier(.4,0,.6,1) infinite;box-shadow:0 0 8px rgba(34,197,94,.4);}
@keyframes dotPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(.8)}}
.preview-scroll{overflow-x:auto;border-radius:var(--radius);box-shadow:var(--shadow-xl);}

/* Report */
#report-preview, #auto-report-preview {
  width: 1000px;
  background: var(--white);
  position: relative;
  overflow: hidden;
  padding: 52px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.blob{position:absolute;z-index:0;pointer-events:none;animation:blobFloat 8s ease-in-out infinite;}
@keyframes blobFloat{0%,100%{transform:translate(0,0)}25%{transform:translate(10px,-10px)}50%{transform:translate(-5px,15px)}75%{transform:translate(8px,5px)}}
.blob-tl{top:-80px;left:-80px;width:280px;height:280px;background:var(--g500);border-radius:60% 40% 55% 45% / 50% 60% 40% 50%;opacity:.08;}
.blob-tr{top:-60px;right:-70px;width:240px;height:240px;background:var(--g400);border-radius:45% 55% 40% 60% / 55% 45% 55% 45%;opacity:.06;animation-delay:1s;}
.blob-br{bottom:-70px;right:-60px;width:260px;height:260px;background:var(--g200);border-radius:55% 45% 60% 40% / 40% 55% 45% 60%;opacity:.08;animation-delay:2s;}
.blob-bl{bottom:-50px;left:-50px;width:200px;height:200px;background:var(--slate);opacity:.04;border-radius:40% 60% 50% 50% / 60% 40% 60% 40%;animation-delay:1.5s;}
.rc{position:relative;z-index:2;}
.rpt-header{display:flex;justify-content:space-between;align-items:flex-end;padding-bottom:24px;border-bottom:2px solid var(--g200);margin-left:60px;}
.rpt-title{font-size:36px;font-weight:800;color:var(--slate);letter-spacing:-1px;line-height:1.1;}
.rpt-title span{color:var(--g600);}
.rpt-meta{text-align:right;}
.rpt-meta p{font-size:14px;color:var(--muted);font-weight:500;margin-bottom:4px;}
.rpt-meta strong{color:var(--slate);font-weight:700;}
.rpt-badge{display:inline-block;background:linear-gradient(135deg,var(--g100),var(--g50));color:var(--g700);font-size:11px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;padding:6px 14px;border-radius:20px;margin-bottom:10px;border:1px solid var(--g200);}
.rpt-body{display:flex;flex-direction:column;gap:24px;}
.rpt-photos{display:flex;flex-direction:row;gap:16px;}
.rpt-photo-wrap{flex:1;height:220px;border-radius:14px;overflow:hidden;background:linear-gradient(135deg,var(--g50),#ffffff);border:2px dashed var(--g200);position:relative;flex-shrink:0;transition:all .3s;}
.rpt-photo-wrap.has-photo{border:none;box-shadow:0 8px 24px rgba(34,197,94,.15);}
.rpt-photo-wrap img{width:100%;height:100%;object-fit:cover;display:block;}
.photo-empty-label{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:var(--g400);font-size:13px;font-weight:600;animation:photoLabelPulse 2s ease-in-out infinite;}
@keyframes photoLabelPulse{0%,100%{opacity:.6}50%{opacity:1}}
.photo-empty-label .icon{font-size:32px;}
.rpt-table-wrap{width:100%;background:var(--white);border-radius:14px;overflow:hidden;border:1px solid var(--border);box-shadow:var(--shadow-sm);}
table{width:100%;border-collapse:collapse;}
thead tr{background:linear-gradient(135deg,var(--slate),#0f172a);}
th{padding:14px 16px;color:white;font-size:12px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;}
th:first-child{text-align:left;width:160px;}
td{padding:14px 16px;font-size:13.5px;border-bottom:1px solid var(--border);vertical-align:top;color:var(--slate);transition:background .3s ease;}
tr:last-child td{border-bottom:none;}
td:first-child{font-weight:700;color:var(--g700);}
td:nth-child(2){white-space:pre-wrap;word-break:break-word;line-height:1.65;color:var(--slate2);}
tbody tr:nth-child(even) td{background:linear-gradient(90deg,var(--g50),var(--white));}
tbody tr:hover td{background:linear-gradient(90deg,var(--g100),var(--white));}
.rpt-footer{display:flex;justify-content:space-between;align-items:center;padding-top:18px;border-top:1px solid var(--g200);margin-left:60px;}
.rpt-footer-brand{font-size:12px;font-weight:800;color:var(--g600);}
.rpt-footer-note{font-size:11px;color:var(--muted);}

/* Toast */
#toast{position:fixed;bottom:28px;right:28px;background:var(--slate);color:white;padding:14px 20px;border-radius:12px;font-size:14px;font-weight:600;box-shadow:var(--shadow-xl);display:flex;align-items:center;gap:10px;opacity:0;transform:translateY(10px) translateX(400px);transition:all .3s cubic-bezier(.4,0,.2,1);z-index:9999;pointer-events:none;}
#toast.show{opacity:1;transform:translateY(0) translateX(0);}
#toast.success{background:linear-gradient(135deg,var(--g600),var(--g700));}
#toast.error{background:linear-gradient(135deg,#dc2626,#991b1b);}

/* Badge badges */
.badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;}
.badge-junior{background:#fef3c7;color:#92400e;}
.badge-kids{background:#dbeafe;color:#1e40af;}
.badge-teens{background:#ede9fe;color:#5b21b6;}

/* Modal Milestone & Calendar */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  animation: modalFadeIn 0.25s ease-out forwards;
}
@keyframes modalFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.modal-box {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.3);
  max-width: 580px;
  width: 100%;
  border: 1px solid var(--border);
  overflow: hidden;
  animation: modalSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes modalSlideUp {
  from { opacity: 0; transform: translateY(24px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.modal-header {
  padding: 20px 24px;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border-bottom: 1px solid #fde68a;
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
}
.modal-icon-badge {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 22px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  animation: bellRing 3s ease-in-out infinite;
}
@keyframes bellRing {
  0%, 100% { transform: rotate(0); }
  10%, 30% { transform: rotate(12deg); }
  20%, 40% { transform: rotate(-12deg); }
  50% { transform: rotate(0); }
}
.modal-title {
  font-size: 16px;
  font-weight: 800;
  color: #92400e;
  line-height: 1.2;
}
.modal-subtitle {
  font-size: 12px;
  color: #b45309;
  font-weight: 600;
  margin-top: 2px;
}
.modal-close-btn {
  margin-left: auto;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid #fde68a;
  border-radius: 8px;
  color: #92400e;
  font-size: 20px;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: all 0.2s;
  line-height: 1;
}
.modal-close-btn:hover {
  background: #ffffff;
  transform: scale(1.08);
}
.modal-body {
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: calc(85vh - 100px);
  overflow-y: auto;
}
.modal-alert-notice {
  background: #f8fafc;
  border-left: 4px solid #f59e0b;
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 13px;
  color: var(--slate);
  line-height: 1.5;
}
.modal-alert-notice strong {
  color: #b45309;
}
.milestone-student-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.milestone-student-item {
  background: linear-gradient(135deg, #f0fdf4, #ffffff);
  border: 1.5px solid var(--g200);
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.milestone-student-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.milestone-student-name {
  font-weight: 800;
  color: var(--slate);
  font-size: 14px;
}
.milestone-student-course {
  font-size: 12px;
  color: var(--muted);
  font-weight: 500;
}
.milestone-badge-pill {
  background: linear-gradient(135deg, #fef3c7, #fef9c3);
  color: #92400e;
  border: 1px solid #fde047;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
}
.modal-reminder-box {
  background: #f8fafc;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.modal-reminder-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--slate2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.preset-row {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
.btn-preset {
  background: #ffffff;
  border: 1.5px solid var(--g300);
  color: var(--g700);
  font-size: 11.5px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Plus Jakarta Sans', sans-serif;
  display: flex;
  align-items: center;
  gap: 4px;
}
.btn-preset:hover, .btn-preset.active {
  background: var(--g600);
  color: white;
  border-color: var(--g600);
  transform: translateY(-1px);
}
.btn-preset-max {
  border-color: #f59e0b;
  color: #b45309;
}
.btn-preset-max:hover, .btn-preset-max.active {
  background: #d97706;
  color: white;
  border-color: #d97706;
  transform: translateY(-1px);
}
.preset-tip {
  font-size: 11px;
  color: var(--muted);
  font-style: italic;
  margin-top: 2px;
}
.modal-btn-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.btn-cal {
  padding: 12px 14px;
  border: none;
  border-radius: var(--radius-sm);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.25s;
  text-align: center;
}
.btn-gcal {
  background: linear-gradient(135deg, #4285F4, #1a73e8);
  color: white;
  box-shadow: 0 3px 10px rgba(66, 133, 244, 0.25);
}
.btn-gcal:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(66, 133, 244, 0.35);
}
.btn-ics {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: white;
  box-shadow: 0 3px 10px rgba(14, 165, 233, 0.25);
}
.btn-ics:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(14, 165, 233, 0.35);
}
.modal-footer-actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
  padding-top: 14px;
}
.btn-continue-dl {
  flex: 2;
  padding: 13px;
  background: linear-gradient(135deg, var(--g600), var(--g700));
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s;
}
.btn-continue-dl:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(22, 163, 74, 0.3);
}
.btn-secondary-close {
  flex: 1;
  padding: 13px;
  background: var(--bg);
  border: 1.5px solid var(--border);
  color: var(--slate2);
  border-radius: var(--radius-sm);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-secondary-close:hover {
  background: #e2e8f0;
}

/* Card milestone indicator */
.card-milestone-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #fef3c7, #fef9c3);
  color: #92400e;
  border: 1px solid #fde047;
  font-size: 10.5px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 12px;
  margin-left: auto;
  animation: pulseBadge 2s infinite ease-in-out;
}
@keyframes pulseBadge {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.85; transform: scale(1.03); }
}

/* Quick Note Chips */
.chips-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-top: 4px;
}
.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.note-chip {
  background: #ffffff;
  border: 1.5px solid var(--g200);
  color: var(--slate2);
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(.4,0,.2,1);
  user-select: none;
}
.note-chip:hover {
  background: var(--g100);
  border-color: var(--g500);
  color: var(--g700);
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(34, 197, 94, 0.15);
}

@media(max-width:1200px){
  .tab-content.active{flex-direction:column;}
  .sidebar{width:100%;position:static;max-height:none;}
  #report-preview, #auto-report-preview {width:100%;}
}
@media(max-width:768px){
  .topnav{padding:0 20px;height:64px;}
  .topnav span{display:none;}
  .card{padding:20px;}
  .rpt-header{flex-direction:column;align-items:flex-start;margin-left:0;}
  .rpt-meta{text-align:left;margin-top:12px;}
  .rpt-photos{flex-direction:column;}
  .rpt-footer{flex-direction:column;align-items:flex-start;gap:8px;margin-left:0;}
  #report-preview, #auto-report-preview {padding:32px 20px;}
}
</style>
</head>
<body>

<nav class="topnav">
  <div class="topnav-logo">▢</div>
  <h1>Dashboard Guru</h1>
  <span>Class Meeting Report Generator</span>
</nav>

<div style="max-width:1500px;margin:0 auto;">
  <div class="tab-bar">
    <button class="tab-btn active" onclick="switchTab('manual')">✏️ Manual Report</button>
    <button class="tab-btn" onclick="switchTab('auto')">⚡ Auto Rapor Harian</button>
  </div>
</div>

<div class="app-layout">

  <!-- TAB: MANUAL (original dashboard) -->
  <div id="tab-manual" class="tab-content active">
    <aside class="sidebar">
      <div class="card">
        <div class="card-title">Class Information</div>
        <div class="form-row">
          <div class="form-group"><label>Class Name</label><input type="text" id="input-kelas" value="BGR-ADP-29" oninput="updatePreview()"></div>
          <div class="form-group"><label>Date</label><input type="date" id="input-tanggal" onchange="updatePreview()"></div>
        </div>
      </div>
      <div class="card">
        <div class="card-title">Documentation Photos</div>
        <div class="form-row">
          <div class="form-group"><label>Photo 1</label><input type="file" accept="image/*" onchange="handlePhoto(event,'photo1')"></div>
          <div class="form-group"><label>Photo 2</label><input type="file" accept="image/*" onchange="handlePhoto(event,'photo2')"></div>
        </div>
      </div>
      <div class="card">
        <div class="card-title">Student Data & Progress</div>
        <div class="students-list" id="students-container"></div>
        <button class="btn-add" onclick="addStudent()">+ Add Student</button>
      </div>
      <div class="card">
        <div class="card-title">Export & Share</div>
        <div class="download-group">
          <div class="download-row">
            <button class="btn-dl btn-dl-png" id="btn-png" onclick="downloadPNG()">Download PNG</button>
            <button class="btn-dl btn-dl-pdf" id="btn-pdf" onclick="downloadPDF()">Export PDF</button>
          </div>
          <button class="btn-dl btn-dl-wa" id="btn-wa" onclick="openWhatsApp()" style="width:100%">Send to WhatsApp</button>
        </div>
        <div class="wa-preview" id="wa-preview-box">
          <div class="wa-preview-title">WhatsApp Message Preview</div>
          <div class="wa-bubble" id="wa-bubble-text"></div>
        </div>
        <div class="tip-box"><strong>PNG</strong> — Download image only.<br><strong>Send to WhatsApp</strong> — Download PNG dan buka WhatsApp dengan pesan otomatis.<br><strong>PDF</strong> — Untuk arsip resmi.</div>
      </div>
    </aside>

    <div class="preview-area">
      <div class="preview-label"><span class="live-dot"></span>Live Preview — Terupdate otomatis saat mengetik</div>
      <div class="preview-scroll">
        <div id="report-preview">
          <div class="blob blob-tl"></div><div class="blob blob-tr"></div><div class="blob blob-br"></div><div class="blob blob-bl"></div>
          <div class="rpt-header rc">
            <div><div class="rpt-title">Class Meeting<br><span>Report</span></div></div>
            <div class="rpt-meta">
              <div class="rpt-badge">Timedoor Academy</div>
              <p>Class: <strong id="prev-kelas">BGR-ADP-29</strong></p>
              <p>Date: <strong id="prev-tanggal">—</strong></p>
            </div>
          </div>
          <div class="rpt-body rc">
            <div class="rpt-photos">
              <div class="rpt-photo-wrap" id="photo1-wrap"><div class="photo-empty-label"><span class="icon">▢</span><span>Photo 1</span></div></div>
              <div class="rpt-photo-wrap" id="photo2-wrap"><div class="photo-empty-label"><span class="icon">▢</span><span>Photo 2</span></div></div>
            </div>
            <div class="rpt-table-wrap">
              <table><thead><tr><th>Student Name</th><th>Today's Progress</th></tr></thead><tbody id="prev-tbody"></tbody></table>
            </div>
          </div>
          <div class="rpt-footer rc">
            <div class="rpt-footer-brand">Timedoor Academy</div>
            <div class="rpt-footer-note">Generated by Dashboard Guru · timedoor.net</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- TAB: AUTO RAPOR -->
  <div id="tab-auto" class="tab-content">
    <aside class="sidebar">
      <div class="card">
        <div class="card-title">Info Kelas</div>
        <div class="form-row">
          <div class="form-group"><label>Nama Kelas</label><input type="text" id="auto-kelas" value="BGR-CE-01" oninput="autoUpdatePreview()"></div>
          <div class="form-group"><label>Tanggal</label><input type="date" id="auto-tanggal" onchange="autoUpdatePreview()"></div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Foto Dokumentasi</div>
        <div class="form-row">
          <div class="form-group"><label>Foto 1</label><input type="file" accept="image/*" onchange="handleAutoPhoto(event,'aphoto1')"></div>
          <div class="form-group"><label>Foto 2</label><input type="file" accept="image/*" onchange="handleAutoPhoto(event,'aphoto2')"></div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Data Siswa & Generate Laporan</div>
        <div class="students-list" id="auto-students-container"></div>
        <button class="btn-add" onclick="addAutoStudent()">+ Tambah Siswa</button>
      </div>

      <div class="card">
        <div class="card-title">Export & Share</div>
        <div class="download-group">
          <div class="download-row">
            <button class="btn-dl btn-dl-png" id="abtn-png" onclick="downloadAutoPNG()">Download PNG</button>
            <button class="btn-dl btn-dl-pdf" id="abtn-pdf" onclick="downloadAutoPDF()">Export PDF</button>
          </div>
          <button class="btn-dl btn-dl-wa" id="abtn-wa" onclick="openAutoWhatsApp()" style="width:100%">Kirim ke WhatsApp</button>
        </div>
        <div class="wa-preview">
          <div class="wa-preview-title">Preview Pesan WhatsApp</div>
          <div class="wa-bubble" id="auto-wa-bubble"></div>
        </div>
        <div class="tip-box"><strong>Cara pakai:</strong> Masukkan nama siswa → pilih kriteria, course, dan lesson → klik ⚡ Generate untuk auto-generate teks progress. Teks bisa diedit manual setelahnya.</div>
      </div>
    </aside>

    <div class="preview-area">
      <div class="preview-label"><span class="live-dot"></span>Live Preview Auto Rapor Harian — Terupdate Otomatis</div>
      <div class="preview-scroll">
        <div id="auto-report-preview">
          <div class="blob blob-tl"></div><div class="blob blob-tr"></div><div class="blob blob-br"></div><div class="blob blob-bl"></div>
          <div class="rpt-header rc">
            <div><div class="rpt-title">Laporan Harian<br><span>Siswa</span></div></div>
            <div class="rpt-meta">
              <div class="rpt-badge">Timedoor Academy</div>
              <p>Kelas: <strong id="aprev-kelas">BGR-CE-01</strong></p>
              <p>Tanggal: <strong id="aprev-tanggal">—</strong></p>
            </div>
          </div>
          <div class="rpt-body rc">
            <div class="rpt-photos">
              <div class="rpt-photo-wrap" id="aphoto1-wrap"><div class="photo-empty-label"><span class="icon">▢</span><span>Foto 1</span></div></div>
              <div class="rpt-photo-wrap" id="aphoto2-wrap"><div class="photo-empty-label"><span class="icon">▢</span><span>Foto 2</span></div></div>
            </div>
            <div class="rpt-table-wrap">
              <table><thead><tr><th>Nama Siswa</th><th>Progress Hari Ini</th></tr></thead><tbody id="aprev-tbody"></tbody></table>
            </div>
          </div>
          <div class="rpt-footer rc">
            <div class="rpt-footer-brand">Timedoor Academy</div>
            <div class="rpt-footer-note">Generated by Dashboard Guru · timedoor.net</div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>

<div id="toast">Processing...</div>

<!-- MILESTONE REPORT REMINDER MODAL -->
<div id="milestone-modal" class="modal-backdrop" style="display:none;" onclick="if(event.target===this)closeMilestoneModal()">
  <div class="modal-box">
    <div class="modal-header">
      <div class="modal-icon-badge">📅</div>
      <div>
        <h3 class="modal-title">Pengingat Pembuatan Student Report</h3>
        <p class="modal-subtitle">Milestone Lesson Terdeteksi (Lesson 8, 16, 24, 32)</p>
      </div>
      <button class="modal-close-btn" onclick="closeMilestoneModal()">&times;</button>
    </div>
    <div class="modal-body">
      <div class="modal-alert-notice">
        <strong>⚠️ Peringatan untuk Guru:</strong> Terdapat murid yang berada di Milestone Lesson (evaluasi capaian / checkpoint). Guru diingatkan untuk menyusun dan melengkapi <em>Student Progress Report</em>.
      </div>
      <div class="milestone-student-list" id="milestone-student-list"></div>
      
      <div class="modal-reminder-box">
        <div class="modal-reminder-title">⏰ Jadwal Pengingat Kalender:</div>
        <div class="preset-row">
          <button type="button" class="btn-preset active" id="btn-preset-h5" onclick="applyDatePreset(5)">📅 Set H+5 (5 Hari)</button>
          <button type="button" class="btn-preset btn-preset-max" id="btn-preset-h7" onclick="applyDatePreset(7)">⭐ Set H+7 (Maksimal)</button>
          <button type="button" class="btn-preset" id="btn-preset-h0" onclick="applyDatePreset(0)">Hari Ini</button>
        </div>
        <div class="preset-tip">💡 Rekomendasi deadline report: H+5 s/d H+7 (Maksimal 7 hari setelah tanggal kelas).</div>
        <div class="form-row" style="margin-top:6px;">
          <div class="form-group">
            <label>Tanggal Deadline Report</label>
            <input type="date" id="milestone-reminder-date" onchange="clearPresetActive()">
          </div>
          <div class="form-group">
            <label>Jam Pengingat</label>
            <input type="time" id="milestone-reminder-time" value="09:00">
          </div>
        </div>
      </div>

      <div class="modal-btn-grid">
        <button class="btn-cal btn-gcal" onclick="addToGoogleCalendarFromModal()">
          <span>🗓️ Masuk ke Google Calendar</span>
        </button>
        <button class="btn-cal btn-ics" onclick="downloadICSFromModal()">
          <span>📥 Download Kalender (.ICS)</span>
        </button>
      </div>

      <div class="modal-footer-actions">
        <button class="btn-continue-dl" onclick="continueDownloadPNGFromModal()">
          <span>⬇️ Lanjutkan Download PNG</span>
        </button>
        <button class="btn-secondary-close" onclick="closeMilestoneModal()">Tutup</button>
      </div>
    </div>
  </div>
</div>

<script>
// ============================================================
// DATA & CONSTANTS
// ============================================================
const COURSE_DATA = ${JSON.stringify(courseData)};
const TEMPLATES = ${JSON.stringify(templates)};
const COURSE_MAP = {"Junior": ["3D ANIMATOR", "Website Designer", "Virtual World Maker", "Little Programmer"], "Kids": ["Coding Explorer", "Game Developer", "Code and Design with Roblox", "Interactive Mechanics on Roblox", "Full Stack Programming on Roblox", "Adcanced Lua Programming on Roblox"], "Teens": ["AI Computer Vision", "Python for Data Science", "AI Machine Learning", "JavaScript Developer", "Web Developer Teens", "Android Developer", "Python for AI", "Python Game Developer", "Python Coder"]};

const MILESTONE_LESSONS = [8, 16, 24, 32];
let pendingMilestoneList = [];
let pendingDownloadAction = null;

// ============================================================
// TAB SWITCHING
// ============================================================
function switchTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  event.target.classList.add('active');
}

// ============================================================
// UTILS
// ============================================================
const HARI = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

function formatDateLong(val) {
  if(!val) return '—';
  const [y,m,d] = val.split('-').map(Number);
  const dt = new Date(y,m-1,d);
  return HARI[dt.getDay()] + ', ' + d + ' ' + BULAN[m-1] + ' ' + y;
}
function formatDate(s) {
  if(!s) return '—';
  const [y,m,d] = s.split('-');
  return d + '-' + m + '-' + y;
}
function escHtml(s) {
  if (s == null) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function toast(msg, type='') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'show ' + type;
  clearTimeout(el._t);
  el._t = setTimeout(() => el.className = '', 3000);
}

function calculateOffsetDate(baseDateStr, daysOffset) {
  const base = baseDateStr || todayVal;
  const [y, m, d] = base.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + Number(daysOffset));
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return date.getFullYear() + '-' + mm + '-' + dd;
}

function isMilestoneLesson(num) {
  return MILESTONE_LESSONS.includes(Number(num));
}

// ============================================================
// MILESTONE & CALENDAR MODAL LOGIC
// ============================================================
function getMilestoneStudentsAuto() {
  const list = [];
  autoStudents.forEach((s, i) => {
    const lessonEl = document.getElementById('auto-lesson-' + i);
    const lessonVal = Number((lessonEl ? lessonEl.value : '') || s.lesson || 0);
    if (isMilestoneLesson(lessonVal)) {
      const nameEl = document.getElementById('auto-name-' + i);
      const courseEl = document.getElementById('auto-course-' + i);
      list.push({
        index: i,
        nama: (nameEl ? nameEl.value.trim() : '') || s.nama || ('Siswa ' + (i+1)),
        course: (courseEl ? courseEl.value : '') || s.course || 'Course',
        lesson: lessonVal
      });
    }
  });
  return list;
}

function getMilestoneStudentsManual() {
  const list = [];
  students.forEach((s, i) => {
    const match = (s.progress || '').match(/lesson\\s*(8|16|24|32)\\b/i);
    if (match) {
      list.push({
        index: i,
        nama: s.nama || ('Siswa ' + (i+1)),
        course: document.getElementById('input-kelas')?.value || 'Kelas',
        lesson: Number(match[1])
      });
    }
  });
  return list;
}

function applyDatePreset(days) {
  const classDate = document.getElementById('auto-tanggal')?.value || document.getElementById('input-tanggal')?.value || todayVal;
  const targetDate = calculateOffsetDate(classDate, days);
  const inputEl = document.getElementById('milestone-reminder-date');
  if (inputEl) inputEl.value = targetDate;

  document.querySelectorAll('.btn-preset').forEach(b => b.classList.remove('active'));
  if (days === 5) document.getElementById('btn-preset-h5')?.classList.add('active');
  else if (days === 7) document.getElementById('btn-preset-h7')?.classList.add('active');
  else if (days === 0) document.getElementById('btn-preset-h0')?.classList.add('active');
}

function clearPresetActive() {
  document.querySelectorAll('.btn-preset').forEach(b => b.classList.remove('active'));
}

function openMilestoneModal(milestoneList, onContinue) {
  pendingMilestoneList = milestoneList;
  pendingDownloadAction = onContinue;

  const listEl = document.getElementById('milestone-student-list');
  listEl.innerHTML = milestoneList.map(s => {
    return '<div class="milestone-student-item">' +
      '<div class="milestone-student-info">' +
        '<span class="milestone-student-name">' + escHtml(s.nama) + '</span>' +
        '<span class="milestone-student-course">' + escHtml(s.course) + '</span>' +
      '</div>' +
      '<span class="milestone-badge-pill">⭐ Lesson ' + s.lesson + ' (Report)</span>' +
    '</div>';
  }).join('');

  // Default to H+5
  applyDatePreset(5);

  document.getElementById('milestone-modal').style.display = 'flex';
}

function closeMilestoneModal() {
  document.getElementById('milestone-modal').style.display = 'none';
  pendingMilestoneList = [];
  pendingDownloadAction = null;
}

function continueDownloadPNGFromModal() {
  const action = pendingDownloadAction;
  closeMilestoneModal();
  if (typeof action === 'function') {
    action();
  }
}

function addToGoogleCalendarFromModal() {
  if (!pendingMilestoneList || !pendingMilestoneList.length) {
    toast('Tidak ada data siswa milestone.', 'error');
    return;
  }
  const dateVal = document.getElementById('milestone-reminder-date').value || todayVal;
  const timeVal = document.getElementById('milestone-reminder-time').value || '09:00';
  const kelas = document.getElementById('auto-kelas')?.value || document.getElementById('input-kelas')?.value || 'Kelas';
  
  const studentNames = pendingMilestoneList.map(s => s.nama).join(', ');
  const title = '[Report Due] Buat Student Report: ' + studentNames + ' (' + kelas + ')';

  const [year, month, day] = dateVal.split('-').map(Number);
  const [hour, min] = timeVal.split(':').map(Number);
  const startDate = new Date(year, month - 1, day, hour, min, 0);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 jam

  const toGCalISO = (d) => d.toISOString().replace(/-|:|\\.\\d+/g, '');
  const dates = toGCalISO(startDate) + '/' + toGCalISO(endDate);

  const details = 'PENGINGAT GURU TIMEDOOR ACADEMY:\\n\\nSegera susun dan kirimkan Student Progress Report / Evaluasi Milestone untuk murid berikut:\\n' +
    pendingMilestoneList.map(s => '• ' + s.nama + ' — ' + s.course + ' (Lesson ' + s.lesson + ')').join('\\n') +
    '\\n\\nKelas: ' + kelas + '\\nDeadline Pengisian: ' + dateVal + ' (' + timeVal + ')\\n\\nCatatan: Batas maksimal pembuatan report adalah H+5 hingga H+7 setelah tanggal kelas!';

  const gcalUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(title) + '&dates=' + dates + '&details=' + encodeURIComponent(details) + '&location=' + encodeURIComponent('Timedoor Academy');
  
  window.open(gcalUrl, '_blank');
  toast('✓ Membuka Google Calendar...', 'success');
}

function downloadICSFromModal() {
  if (!pendingMilestoneList || !pendingMilestoneList.length) {
    toast('Tidak ada data siswa milestone.', 'error');
    return;
  }
  const dateVal = document.getElementById('milestone-reminder-date').value || todayVal;
  const timeVal = document.getElementById('milestone-reminder-time').value || '09:00';
  const kelas = document.getElementById('auto-kelas')?.value || document.getElementById('input-kelas')?.value || 'Kelas';

  const studentNames = pendingMilestoneList.map(s => s.nama).join(', ');
  const title = '[Report Due] Buat Student Report: ' + studentNames + ' (' + kelas + ')';

  const [year, month, day] = dateVal.split('-').map(Number);
  const [hour, min] = timeVal.split(':').map(Number);
  const startDate = new Date(year, month - 1, day, hour, min, 0);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  const toICSDate = (d) => {
    const pad = (n) => String(n).padStart(2, '0');
    return d.getUTCFullYear() + pad(d.getUTCMonth()+1) + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + 'Z';
  };

  const details = 'PENGINGAT GURU TIMEDOOR ACADEMY:\\\\n\\\\nSegera susun dan kirimkan Student Progress Report untuk:\\\\n' +
    pendingMilestoneList.map(s => '• ' + s.nama + ' - ' + s.course + ' (Lesson ' + s.lesson + ')').join('\\\\n') +
    '\\\\n\\\\nKelas: ' + kelas + '\\\\nDeadline Report: ' + dateVal + ' (' + timeVal + ')';

  const now = new Date();
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Timedoor Academy//Dashboard Guru//ID',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:timedoor-report-' + Date.now() + '@timedoor.net',
    'DTSTAMP:' + toICSDate(now),
    'DTSTART:' + toICSDate(startDate),
    'DTEND:' + toICSDate(endDate),
    'SUMMARY:' + title,
    'DESCRIPTION:' + details,
    'LOCATION:Timedoor Academy',
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Pengingat Buat Student Report',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  const blob = new Blob([icsLines.join('\\r\\n')], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Reminder_Report_' + kelas.replace(/\\s+/g,'_') + '.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast('✓ File kalender (.ics) berhasil diunduh!', 'success');
}

// Quick Notes Chips helper
function addQuickNote(idx, chipKey) {
  const nameInput = document.getElementById('auto-name-' + idx);
  const nama = (nameInput ? nameInput.value.trim() : '') || autoStudents[idx].nama || 'Siswa';
  const textarea = document.getElementById('auto-progress-' + idx);
  if (!textarea) return;

  let appendMsg = '';
  if (chipKey === 1 || chipKey === 'aktif') {
    appendMsg = '\\n\\nCatatan: ' + nama + ' sangat aktif, antusias, dan mandiri selama mengikuti sesi kelas hari ini.';
  } else if (chipKey === 2 || chipKey === 'kreatif') {
    appendMsg = '\\n\\nCatatan: ' + nama + ' menunjukkan kreativitas tinggi dan kaya ide dalam merancang karyanya.';
  } else if (chipKey === 3 || chipKey === 'fokus') {
    appendMsg = '\\n\\nCatatan: ' + nama + ' sangat fokus, tekun, dan teliti dalam menyelesaikan setiap tantangan coding.';
  } else if (chipKey === 4 || chipKey === 'cepat') {
    appendMsg = '\\n\\nCatatan: ' + nama + ' sangat cepat memahami logika konsep materi baru dan mempraktikkannya dengan lancar.';
  } else if (chipKey === 5 || chipKey === 'kolaboratif') {
    appendMsg = '\\n\\nCatatan: ' + nama + ' sangat komunikatif, santun, dan senang berbagi ide positif dengan teman sekelas.';
  }

  if (appendMsg && !textarea.value.includes(appendMsg.trim())) {
    textarea.value = (textarea.value.trim() + appendMsg).trim();
    autoStudents[idx].progress = textarea.value;
    autoUpdateTable();
    toast('✓ Catatan guru ditambahkan!', 'success');
  }
}

// ============================================================
// MANUAL TAB (original)
// ============================================================
let students = [
  {nama:"Aysha",progress:"Aysha telah belajar membuat game AR di Delightex bertema hewan, serta mempelajari logika drone di Tynker.\\n\\nCatatan: Aysha menyelesaikan seluruh tugas dengan sangat baik dan memahami konsep looping."},
  {nama:"Puan",progress:"Izin (Sakit/Berhalangan)"}
];
const photoData = {photo1:null,photo2:null};

function buildWAMessage(){
  const tgl = document.getElementById('input-tanggal').value;
  const tglIndo = formatDateLong(tgl);
  const studentListText = students
    .filter(s => s.nama || s.progress)
    .map(s => '*' + (s.nama || '—') + '*\\n' + (s.progress || '—'))
    .join('\\n\\n');

  return 'Selamat Siang Bapak dan Ibu,\\n\\n' +
    'Mohon izin mengirimkan report pembelajaran anak-anak yaa Bapak dan Ibu ☺️🙏🏻\\n\\n' +
    'Untuk pertemuan ' + tglIndo + ', kelas berjalan dengan cukup baik. Anak-anak mengikuti pembelajaran hari ini dengan antusias. Berikut report pembelajarannya\\n\\n' +
    (studentListText || '—') + '\\n\\n' +
    'Note:\\n' +
    'Anak-anak dapat mempelajari kembali materi yang telah dipelajari dengan mengakses LMS Timedoor Academy : https://lms.timedooracademy.com/ dan login menggunakan akun masing-masing dari rumah. 🙏\\n\\n' +
    'Terima kasih banyak Bapak dan Ibu 😊🙏🏻';
}
function updateWAPreview(){
  document.getElementById('wa-bubble-text').textContent = buildWAMessage();
}
function updatePreview(){
  const kelas = document.getElementById('input-kelas').value || '—';
  const tgl = document.getElementById('input-tanggal').value;
  document.getElementById('prev-kelas').textContent = kelas;
  document.getElementById('prev-tanggal').textContent = formatDate(tgl);
  renderTable();
  updateWAPreview();
}
function renderTable(){
  const tbody = document.getElementById('prev-tbody');
  tbody.innerHTML = '';
  students.forEach(s => {
    if(!s.nama && !s.progress) return;
    const tr = document.createElement('tr');
    tr.innerHTML = '<td>' + (escHtml(s.nama)||'<em style="color:#94a3b8">—</em>') + '</td><td>' + escHtml(s.progress) + '</td>';
    tbody.appendChild(tr);
  });
}
function renderInputs(){
  const c = document.getElementById('students-container');
  c.innerHTML = '';
  students.forEach((s,i) => {
    const div = document.createElement('div');
    div.className = 'student-card';
    div.innerHTML = '<div class="student-card-header">' +
        '<div class="student-num">' + (i+1) + '</div>' +
        '<input type="text" placeholder="Nama siswa…" value="' + escHtml(s.nama) + '" oninput="students[' + i + '].nama=this.value;renderTable();updateWAPreview()">' +
        '<button class="btn-del" onclick="removeStudent(' + i + ')" title="Hapus">×</button>' +
      '</div>' +
      '<textarea placeholder="Progress atau catatan…" oninput="students[' + i + '].progress=this.value;renderTable();updateWAPreview()">' + escHtml(s.progress) + '</textarea>';
    c.appendChild(div);
  });
  renderTable();
}
function addStudent(){
  students.push({nama:'',progress:''});
  renderInputs();
  const cards = document.querySelectorAll('#students-container .student-card');
  if(cards.length) cards[cards.length-1].scrollIntoView({behavior:'smooth',block:'nearest'});
}
function removeStudent(i){
  if(students.length<=1){toast('Minimum 1 siswa.','error');return;}
  students.splice(i,1);
  renderInputs();
}
function handlePhoto(e,key){
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = ev => {photoData[key]=ev.target.result;renderPhoto(key,ev.target.result,false);};
  reader.readAsDataURL(file);
}
function renderPhoto(key,src,isAuto){
  const id = isAuto ? key+'-wrap' : key+'-wrap';
  const wrap = document.getElementById(id);
  if(!wrap) return;
  wrap.innerHTML = '<img src="' + src + '" alt="Foto">';
  wrap.classList.add('has-photo');
}

async function capturePNG(id){
  const el = document.getElementById(id);
  const originalOverflow = el.style.overflow;
  el.style.overflow = 'visible';
  
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    scrollY: 0, 
    windowWidth: el.scrollWidth,
    windowHeight: el.scrollHeight
  });
  
  el.style.overflow = originalOverflow;
  return canvas;
}

function downloadPNG(){
  const milestones = getMilestoneStudentsManual();
  if (milestones.length > 0) {
    openMilestoneModal(milestones, executeManualPNGDownload);
  } else {
    executeManualPNGDownload();
  }
}

async function executeManualPNGDownload(){
  const btn=document.getElementById('btn-png'); btn.disabled=true; btn.textContent='Processing...';
  toast('Creating PNG...');
  try{
    const canvas = await capturePNG('report-preview');
    const link = document.createElement('a');
    const kelas = document.getElementById('input-kelas').value.replace(/\\s+/g,'_')||'Report';
    link.download = 'Progress_' + kelas + '.png'; 
    link.href = canvas.toDataURL('image/png'); 
    link.click();
    toast('PNG downloaded!','success');
  }catch(err){toast('Gagal: '+err.message,'error');}
  finally{btn.disabled=false; btn.textContent='Download PNG';}
}

async function openWhatsApp(){
  const btn=document.getElementById('btn-wa'); btn.disabled=true; btn.textContent='Preparing...';
  try{
    const canvas = await capturePNG('report-preview');
    const link = document.createElement('a');
    const kelas = document.getElementById('input-kelas').value.replace(/\\s+/g,'_')||'Report';
    link.download = 'Progress_' + kelas + '.png'; 
    link.href = canvas.toDataURL('image/png'); 
    link.click();
    await new Promise(r=>setTimeout(r,800));
    window.open('https://wa.me/?text='+encodeURIComponent(buildWAMessage()),'_blank');
    toast('Done!','success');
  }catch(err){toast('Gagal: '+err.message,'error');}
  finally{btn.disabled=false; btn.textContent='Send to WhatsApp';}
}

async function downloadPDF(){
  const btn=document.getElementById('btn-pdf'); btn.disabled=true; btn.textContent='Processing...';
  toast('Creating PDF...');
  try{
    const {jsPDF}=window.jspdf;
    const kelas=document.getElementById('input-kelas').value||'—';
    const tanggal=formatDate(document.getElementById('input-tanggal').value);
    const doc=new jsPDF({orientation:'landscape',unit:'mm',format:'a4'});
    const W=doc.internal.pageSize.getWidth(),H=doc.internal.pageSize.getHeight();
    const G_DARK=[21,128,61],G_MED=[22,163,74],G_LIGHT=[220,252,231],SLATE=[30,41,59],WHITE=[255,255,255],MUTED=[100,116,139];
    doc.setFillColor(...WHITE);doc.rect(0,0,W,H,'F');
    doc.setFillColor(...SLATE);doc.roundedRect(0,0,W,36,0,0,'F');
    doc.setFont('helvetica','bold');doc.setFontSize(20);doc.setTextColor(...WHITE);doc.text('Class Meeting Report',14,23);
    doc.setFillColor(...G_MED);doc.roundedRect(W-74,9,60,18,4,4,'F');
    doc.setFontSize(9);doc.setTextColor(...WHITE);doc.text('Timedoor Academy',W-44,21,{align:'center'});
    doc.setFont('helvetica','normal');doc.setFontSize(10);doc.setTextColor(...MUTED);doc.text('Class: ',14,46);
    doc.setFont('helvetica','bold');doc.setTextColor(...SLATE);doc.text(kelas,30,46);
    doc.setFont('helvetica','normal');doc.setTextColor(...MUTED);doc.text('Date: ',14,54);
    doc.setFont('helvetica','bold');doc.setTextColor(...SLATE);doc.text(tanggal,34,54);
    doc.setDrawColor(...G_LIGHT);doc.setLineWidth(0.5);doc.line(14,59,W-14,59);
    const MARGIN=14,GAP=8,PHOTO_W=(W-MARGIN*2-GAP)/2,PHOTO_H=52,PHOTO_Y=64;
    for(let i=1;i<=2;i++){
      const px=MARGIN+(i-1)*(PHOTO_W+GAP);const src=photoData['photo'+i];
      if(src){const fmt=src.startsWith('data:image/png')?'PNG':'JPEG';doc.addImage(src,fmt,px,PHOTO_Y,PHOTO_W,PHOTO_H)}
      else{doc.setFillColor(...G_LIGHT);doc.roundedRect(px,PHOTO_Y,PHOTO_W,PHOTO_H,3,3,'F');doc.setFont('helvetica','italic');doc.setFontSize(9);doc.setTextColor(...MUTED);doc.text('Photo ' + i + ' not uploaded',px+PHOTO_W/2,PHOTO_Y+PHOTO_H/2,{align:'center'});}
    }
    const TABLE_X=MARGIN,TABLE_W=W-MARGIN*2,COL_NAME_W=50;
    let rowY=PHOTO_Y+PHOTO_H+8;const HEADER_H=10;
    doc.setFillColor(...SLATE);doc.roundedRect(TABLE_X,rowY,TABLE_W,HEADER_H,2,2,'F');
    doc.setFont('helvetica','bold');doc.setFontSize(9);doc.setTextColor(...WHITE);
    doc.text('STUDENT NAME',TABLE_X+5,rowY+6.5);doc.text("TODAY'S PROGRESS",TABLE_X+COL_NAME_W+5,rowY+6.5);
    rowY+=HEADER_H;
    doc.setFont('helvetica','normal');doc.setFontSize(9);
    students.forEach((s,idx)=>{
      if(!s.nama&&!s.progress)return;
      const lines=doc.splitTextToSize(s.progress||'—',TABLE_W-COL_NAME_W-8*2);
      const cellH=Math.max(10,lines.length*5+8);
      if(rowY+cellH>H-20){doc.addPage();rowY=20;}
      if(idx%2===0){doc.setFillColor(...G_LIGHT);doc.rect(TABLE_X,rowY,TABLE_W,cellH,'F');}
      doc.setDrawColor(...[226,232,240]);doc.setLineWidth(0.2);doc.line(TABLE_X,rowY+cellH,TABLE_X+TABLE_W,rowY+cellH);
      doc.setFont('helvetica','bold');doc.setTextColor(...G_DARK);doc.text(s.nama||'—',TABLE_X+4,rowY+5);
      doc.setFont('helvetica','normal');doc.setTextColor(...SLATE);doc.text(lines,TABLE_X+COL_NAME_W+4,rowY+5);
      rowY+=cellH;
    });
    doc.setDrawColor(...G_MED);doc.setLineWidth(0.5);
    doc.roundedRect(TABLE_X,PHOTO_Y+PHOTO_H+8,TABLE_W,rowY-(PHOTO_Y+PHOTO_H+8),2,2,'S');
    const footY=H-10;
    doc.setDrawColor(...G_LIGHT);doc.setLineWidth(0.4);doc.line(14,footY-6,W-14,footY-6);
    doc.setFont('helvetica','bold');doc.setFontSize(8);doc.setTextColor(...G_MED);doc.text('Timedoor Academy',14,footY);
    doc.setFont('helvetica','normal');doc.setTextColor(...MUTED);doc.text('Generated by Dashboard Guru · timedoor.net',W-14,footY,{align:'right'});
    doc.save('Progress_' + kelas.replace(/\\s+/g,'_') + '.pdf');
    toast('PDF downloaded!','success');
  }catch(err){toast('Gagal PDF: '+err.message,'error');}
  finally{btn.disabled=false;btn.textContent='Export PDF';}
}

// ============================================================
// AUTO TAB
// ============================================================
let autoStudents = [];
const autoPhotoData = {aphoto1:null,aphoto2:null};

function getCourseBadge(criteria){
  const map={Junior:'badge-junior',Kids:'badge-kids',Teens:'badge-teens'};
  return map[criteria]||'';
}

function getCourseOptions(criteria){
  const courses = COURSE_MAP[criteria] || [];
  return courses.map(c => '<option value="' + escHtml(c) + '">' + escHtml(c) + '</option>').join('');
}

function getLessonOptions(courseName){
  const lessons = COURSE_DATA[courseName] || [];
  return lessons.map(l => {
    const isM = isMilestoneLesson(l.num) ? ' ⭐ (Milestone)' : '';
    return '<option value="' + l.num + '">' + l.title + isM + '</option>';
  }).join('');
}

function onCriteriaChange(idx, selectEl){
  const criteria = selectEl.value;
  if(autoStudents[idx]) autoStudents[idx].criteria = criteria;
  const courseSelect = document.getElementById('auto-course-' + idx);
  courseSelect.innerHTML = '<option value="">— Pilih Course —</option>' + getCourseOptions(criteria);
  const lessonSelect = document.getElementById('auto-lesson-' + idx);
  lessonSelect.innerHTML = '<option value="">— Pilih Lesson —</option>';
  courseSelect.dispatchEvent(new Event('change'));
}

function onCourseChange(idx, selectEl){
  const courseName = selectEl.value;
  if(autoStudents[idx]) autoStudents[idx].course = courseName;
  const lessonSelect = document.getElementById('auto-lesson-' + idx);
  lessonSelect.innerHTML = '<option value="">— Pilih Lesson —</option>';
  if(courseName){
    lessonSelect.innerHTML += getLessonOptions(courseName);
  }
  checkCardMilestone(idx);
}

function onLessonChange(idx, selectEl){
  const lessonNum = selectEl.value;
  if(autoStudents[idx]) autoStudents[idx].lesson = lessonNum;
  checkCardMilestone(idx);
}

function checkCardMilestone(idx){
  const lessonEl = document.getElementById('auto-lesson-' + idx);
  const tagEl = document.getElementById('milestone-tag-' + idx);
  if (!lessonEl || !tagEl) return;
  const lessonNum = Number(lessonEl.value);
  if (isMilestoneLesson(lessonNum)) {
    tagEl.style.display = 'inline-flex';
    tagEl.textContent = '⭐ Lesson ' + lessonNum + ' (Wajib Report)';
  } else {
    tagEl.style.display = 'none';
  }
}

function generateProgress(idx){
  const namaInput = document.getElementById('auto-name-' + idx);
  const courseSelect = document.getElementById('auto-course-' + idx);
  const lessonSelect = document.getElementById('auto-lesson-' + idx);
  
  const nama = (namaInput ? namaInput.value.trim() : '') || (autoStudents[idx] ? autoStudents[idx].nama : '');
  const course = (courseSelect ? courseSelect.value : '') || (autoStudents[idx] ? autoStudents[idx].course : '');
  const lessonNum = (lessonSelect ? lessonSelect.value : '') || (autoStudents[idx] ? autoStudents[idx].lesson : '');
  
  if(!nama){ toast('Masukkan nama siswa dulu!','error'); return; }
  if(!course){ toast('Pilih course terlebih dahulu!','error'); return; }
  if(!lessonNum){ toast('Pilih lesson terlebih dahulu!','error'); return; }

  const templateRaw = (TEMPLATES[course] && TEMPLATES[course][lessonNum]) || ('Hari ini ' + nama + ' telah menyelesaikan materi Lesson ' + lessonNum + ' pada program ' + course + ' dengan sangat baik.');
  const text = templateRaw.replace(/\\{nama\\}/g, nama);
  
  const textarea = document.getElementById('auto-progress-' + idx);
  if (textarea) textarea.value = text;
  
  autoStudents[idx].nama = nama;
  autoStudents[idx].course = course;
  autoStudents[idx].lesson = lessonNum;
  autoStudents[idx].progress = text;
  
  autoUpdateTable();
  toast('✓ Progress berhasil di-generate!','success');
}

function renderAutoInputs(){
  const c = document.getElementById('auto-students-container');
  c.innerHTML = '';
  autoStudents.forEach((s,i) => {
    const isM = isMilestoneLesson(s.lesson);
    const div = document.createElement('div');
    div.className = 'student-card';
    div.innerHTML = '<div class="student-card-header">' +
        '<div class="student-num">' + (i+1) + '</div>' +
        '<input type="text" id="auto-name-' + i + '" placeholder="Nama siswa…" value="' + escHtml(s.nama) + '" oninput="autoStudents[' + i + '].nama=this.value;autoUpdateTable()">' +
        '<span id="milestone-tag-' + i + '" class="card-milestone-tag" style="display:' + (isM ? 'inline-flex' : 'none') + '">⭐ Lesson ' + (s.lesson||'') + ' (Wajib Report)</span>' +
        '<button class="btn-del" onclick="removeAutoStudent(' + i + ')" title="Hapus">×</button>' +
      '</div>' +
      '<div class="auto-gen-row">' +
        '<div class="auto-gen-selectors">' +
          '<select id="auto-criteria-' + i + '" onchange="onCriteriaChange(' + i + ',this)" style="flex:1">' +
            '<option value="">— Kriteria —</option>' +
            '<option value="Junior">Junior</option>' +
            '<option value="Kids">Kids</option>' +
            '<option value="Teens">Teens</option>' +
          '</select>' +
          '<select id="auto-course-' + i + '" onchange="onCourseChange(' + i + ',this)" style="flex:2">' +
            '<option value="">— Course —</option>' +
          '</select>' +
          '<select id="auto-lesson-' + i + '" onchange="onLessonChange(' + i + ',this)" style="flex:1.5">' +
            '<option value="">— Lesson —</option>' +
          '</select>' +
        '</div>' +
        '<button class="btn-generate" onclick="generateProgress(' + i + ')">⚡ Generate Progress</button>' +
      '</div>' +
      '<textarea id="auto-progress-' + i + '" placeholder="Progress akan ter-generate otomatis dengan kalimat ramah orang tua, atau ketik manual…" oninput="autoStudents[' + i + '].progress=this.value;autoUpdateTable()" style="min-height:100px">' + escHtml(s.progress) + '</textarea>' +
      '<div class="chips-label">💡 Tambah Catatan Personal (1-Klik):</div>' +
      '<div class="chips-container">' +
        '<span class="note-chip" onclick="addQuickNote(' + i + ', 1)">+ 🌟 Sangat Aktif</span>' +
        '<span class="note-chip" onclick="addQuickNote(' + i + ', 2)">+ 💡 Kreatif</span>' +
        '<span class="note-chip" onclick="addQuickNote(' + i + ', 3)">+ 🎯 Fokus & Teliti</span>' +
        '<span class="note-chip" onclick="addQuickNote(' + i + ', 4)">+ 🚀 Cepat Paham</span>' +
        '<span class="note-chip" onclick="addQuickNote(' + i + ', 5)">+ 🤝 Kolaboratif</span>' +
      '</div>';
    c.appendChild(div);
    
    // Restore selections if any
    if(s.criteria){
      const criteriaEl = document.getElementById('auto-criteria-' + i);
      if (criteriaEl) {
        criteriaEl.value = s.criteria;
        onCriteriaChange(i, criteriaEl);
        if(s.course){
          setTimeout(()=>{
            const courseEl = document.getElementById('auto-course-' + i);
            if(courseEl){ 
              courseEl.value = s.course; 
              onCourseChange(i,courseEl);
              if(s.lesson){ 
                setTimeout(()=>{ 
                  const lessonEl=document.getElementById('auto-lesson-' + i); 
                  if(lessonEl) {
                    lessonEl.value=s.lesson; 
                    checkCardMilestone(i);
                  }
                },50); 
              }
            }
          },50);
        }
      }
    }
  });
  autoUpdateTable();
}

function addAutoStudent(){
  autoStudents.push({nama:'',progress:'',criteria:'',course:'',lesson:''});
  renderAutoInputs();
  const cards = document.querySelectorAll('#auto-students-container .student-card');
  if(cards.length) cards[cards.length-1].scrollIntoView({behavior:'smooth',block:'nearest'});
}

function removeAutoStudent(i){
  if(autoStudents.length<=1){toast('Minimum 1 siswa.','error');return;}
  autoStudents.splice(i,1);
  renderAutoInputs();
}

function autoUpdateTable(){
  const tbody = document.getElementById('aprev-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  
  // Sync autoStudents values with DOM inputs if present
  autoStudents.forEach((s, idx) => {
    const nameEl = document.getElementById('auto-name-' + idx);
    const progEl = document.getElementById('auto-progress-' + idx);
    if (nameEl) s.nama = nameEl.value;
    if (progEl) s.progress = progEl.value;
  });

  autoStudents.forEach(s => {
    if(!s.nama && !s.progress) return;
    const tr = document.createElement('tr');
    tr.innerHTML = '<td>' + (escHtml(s.nama)||'<em style="color:#94a3b8">—</em>') + '</td><td>' + escHtml(s.progress) + '</td>';
    tbody.appendChild(tr);
  });
  autoUpdateWA();
}

function autoUpdatePreview(){
  const kelas = document.getElementById('auto-kelas')?.value || '—';
  const tgl = document.getElementById('auto-tanggal')?.value;
  const pk = document.getElementById('aprev-kelas');
  const pt = document.getElementById('aprev-tanggal');
  if (pk) pk.textContent = kelas;
  if (pt) pt.textContent = formatDate(tgl);
  autoUpdateTable();
  autoUpdateWA();
}

function buildAutoWAMessage(){
  const tgl = document.getElementById('auto-tanggal')?.value;
  const tglIndo = formatDateLong(tgl);

  const studentItems = autoStudents.map((s, idx) => {
    const nameEl = document.getElementById('auto-name-' + idx);
    const progEl = document.getElementById('auto-progress-' + idx);
    const nama = (nameEl ? nameEl.value.trim() : '') || s.nama || '';
    const prog = (progEl ? progEl.value.trim() : '') || s.progress || '';
    return { nama, progress: prog };
  }).filter(s => s.nama || s.progress);

  const studentListText = studentItems
    .map(s => '*' + (s.nama || '—') + '*\\n' + (s.progress || '—'))
    .join('\\n\\n');

  return 'Selamat Siang Bapak dan Ibu,\\n\\n' +
    'Mohon izin mengirimkan report pembelajaran anak-anak yaa Bapak dan Ibu ☺️🙏🏻\\n\\n' +
    'Untuk pertemuan ' + tglIndo + ', kelas berjalan dengan cukup baik. Anak-anak mengikuti pembelajaran hari ini dengan antusias. Berikut report pembelajarannya\\n\\n' +
    (studentListText || '—') + '\\n\\n' +
    'Note:\\n' +
    'Anak-anak dapat mempelajari kembali materi yang telah dipelajari dengan mengakses LMS Timedoor Academy : https://lms.timedooracademy.com/ dan login menggunakan akun masing-masing dari rumah. 🙏\\n\\n' +
    'Terima kasih banyak Bapak dan Ibu 😊🙏🏻';
}

function autoUpdateWA(){
  const el = document.getElementById('auto-wa-bubble');
  if (el) el.textContent = buildAutoWAMessage();
}

function handleAutoPhoto(e,key){
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = ev => { 
    autoPhotoData[key]=ev.target.result; 
    const wrap = document.getElementById(key+'-wrap');
    if(wrap){ 
      wrap.innerHTML = '<img src="' + ev.target.result + '" alt="Foto">'; 
      wrap.classList.add('has-photo'); 
    }
  };
  reader.readAsDataURL(file);
}

function downloadAutoPNG(){
  const milestones = getMilestoneStudentsAuto();
  if (milestones.length > 0) {
    openMilestoneModal(milestones, executeAutoPNGDownload);
  } else {
    executeAutoPNGDownload();
  }
}

async function executeAutoPNGDownload(){
  const btn=document.getElementById('abtn-png'); btn.disabled=true; btn.textContent='Processing...';
  toast('Creating PNG...');
  try{
    const canvas = await capturePNG('auto-report-preview');
    const link = document.createElement('a');
    const kelas = document.getElementById('auto-kelas').value.replace(/\\s+/g,'_')||'Rapor';
    link.download = 'Rapor_' + kelas + '.png'; 
    link.href = canvas.toDataURL('image/png'); 
    link.click();
    toast('PNG downloaded!','success');
  }catch(err){toast('Gagal: '+err.message,'error');}
  finally{btn.disabled=false;btn.textContent='Download PNG';}
}

async function openAutoWhatsApp(){
  const btn=document.getElementById('abtn-wa'); btn.disabled=true; btn.textContent='Preparing...';
  try{
    const canvas = await capturePNG('auto-report-preview');
    const link = document.createElement('a');
    const kelas = document.getElementById('auto-kelas').value.replace(/\\s+/g,'_')||'Rapor';
    link.download = 'Rapor_' + kelas + '.png'; 
    link.href = canvas.toDataURL('image/png'); 
    link.click();
    await new Promise(r=>setTimeout(r,800));
    window.open('https://wa.me/?text='+encodeURIComponent(buildAutoWAMessage()),'_blank');
    toast('Done!','success');
  }catch(err){toast('Gagal: '+err.message,'error');}
  finally{btn.disabled=false;btn.textContent='Kirim ke WhatsApp';}
}

async function downloadAutoPDF(){
  const btn=document.getElementById('abtn-pdf'); btn.disabled=true; btn.textContent='Processing...';
  toast('Creating PDF...');
  try{
    const {jsPDF}=window.jspdf;
    const kelas=document.getElementById('auto-kelas').value||'—';
    const tanggal=formatDate(document.getElementById('auto-tanggal').value);
    const doc=new jsPDF({orientation:'landscape',unit:'mm',format:'a4'});
    const W=doc.internal.pageSize.getWidth(),H=doc.internal.pageSize.getHeight();
    const G_DARK=[21,128,61],G_MED=[22,163,74],G_LIGHT=[220,252,231],SLATE=[30,41,59],WHITE=[255,255,255],MUTED=[100,116,139];
    doc.setFillColor(...WHITE);doc.rect(0,0,W,H,'F');
    doc.setFillColor(...SLATE);doc.roundedRect(0,0,W,36,0,0,'F');
    doc.setFont('helvetica','bold');doc.setFontSize(20);doc.setTextColor(...WHITE);doc.text('Laporan Harian Siswa',14,23);
    doc.setFillColor(...G_MED);doc.roundedRect(W-74,9,60,18,4,4,'F');
    doc.setFontSize(9);doc.setTextColor(...WHITE);doc.text('Timedoor Academy',W-44,21,{align:'center'});
    doc.setFont('helvetica','normal');doc.setFontSize(10);doc.setTextColor(...MUTED);doc.text('Kelas: ',14,46);
    doc.setFont('helvetica','bold');doc.setTextColor(...SLATE);doc.text(kelas,32,46);
    doc.setFont('helvetica','normal');doc.setTextColor(...MUTED);doc.text('Tanggal: ',14,54);
    doc.setFont('helvetica','bold');doc.setTextColor(...SLATE);doc.text(tanggal,38,54);
    doc.setDrawColor(...G_LIGHT);doc.setLineWidth(0.5);doc.line(14,59,W-14,59);
    const MARGIN=14,GAP=8,PHOTO_W=(W-MARGIN*2-GAP)/2,PHOTO_H=52,PHOTO_Y=64;
    for(let i=1;i<=2;i++){
      const px=MARGIN+(i-1)*(PHOTO_W+GAP);const src=autoPhotoData['aphoto'+i];
      if(src){const fmt=src.startsWith('data:image/png')?'PNG':'JPEG';doc.addImage(src,fmt,px,PHOTO_Y,PHOTO_W,PHOTO_H);}
      else{doc.setFillColor(...G_LIGHT);doc.roundedRect(px,PHOTO_Y,PHOTO_W,PHOTO_H,3,3,'F');doc.setFont('helvetica','italic');doc.setFontSize(9);doc.setTextColor(...MUTED);doc.text('Foto ' + i + ' belum diupload',px+PHOTO_W/2,PHOTO_Y+PHOTO_H/2,{align:'center'});}
    }
    const TABLE_X=MARGIN,TABLE_W=W-MARGIN*2,COL_NAME_W=50;
    let rowY=PHOTO_Y+PHOTO_H+8;const HEADER_H=10;
    doc.setFillColor(...SLATE);doc.roundedRect(TABLE_X,rowY,TABLE_W,HEADER_H,2,2,'F');
    doc.setFont('helvetica','bold');doc.setFontSize(9);doc.setTextColor(...WHITE);
    doc.text('NAMA SISWA',TABLE_X+5,rowY+6.5);doc.text('PROGRESS HARI INI',TABLE_X+COL_NAME_W+5,rowY+6.5);
    rowY+=HEADER_H;
    doc.setFont('helvetica','normal');doc.setFontSize(9);
    autoStudents.forEach((s,idx)=>{
      if(!s.nama&&!s.progress)return;
      const lines=doc.splitTextToSize(s.progress||'—',TABLE_W-COL_NAME_W-16);
      const cellH=Math.max(10,lines.length*5+8);
      if(rowY+cellH>H-20){doc.addPage();rowY=20;}
      if(idx%2===0){doc.setFillColor(...G_LIGHT);doc.rect(TABLE_X,rowY,TABLE_W,cellH,'F');}
      doc.setDrawColor(...[226,232,240]);doc.setLineWidth(0.2);doc.line(TABLE_X,rowY+cellH,TABLE_X+TABLE_W,rowY+cellH);
      doc.setFont('helvetica','bold');doc.setTextColor(...G_DARK);doc.text(s.nama||'—',TABLE_X+4,rowY+5);
      doc.setFont('helvetica','normal');doc.setTextColor(...SLATE);doc.text(lines,TABLE_X+COL_NAME_W+4,rowY+5);
      rowY+=cellH;
    });
    doc.setDrawColor(...G_MED);doc.setLineWidth(0.5);
    doc.roundedRect(TABLE_X,PHOTO_Y+PHOTO_H+8,TABLE_W,rowY-(PHOTO_Y+PHOTO_H+8),2,2,'S');
    const footY=H-10;
    doc.setDrawColor(...G_LIGHT);doc.setLineWidth(0.4);doc.line(14,footY-6,W-14,footY-6);
    doc.setFont('helvetica','bold');doc.setFontSize(8);doc.setTextColor(...G_MED);doc.text('Timedoor Academy',14,footY);
    doc.setFont('helvetica','normal');doc.setTextColor(...MUTED);doc.text('Generated by Dashboard Guru · timedoor.net',W-14,footY,{align:'right'});
    doc.save('Rapor_' + kelas.replace(/\\s+/g,'_') + '.pdf');
    toast('PDF downloaded!','success');
  }catch(err){toast('Gagal PDF: '+err.message,'error');}
  finally{btn.disabled=false;btn.textContent='Export PDF';}
}

// ============================================================
// INIT
// ============================================================
const _t = new Date();
const _mm = String(_t.getMonth()+1).padStart(2,'0');
const _dd = String(_t.getDate()).padStart(2,'0');
const todayVal = _t.getFullYear()+'-'+_mm+'-'+_dd;

document.getElementById('input-tanggal').value = todayVal;
document.getElementById('auto-tanggal').value = todayVal;

renderInputs();
updatePreview();

// Init auto tab with 2 sample students
autoStudents = [{nama:'',progress:''},{nama:'',progress:''}];
renderAutoInputs();
autoUpdatePreview();
</script>
</body>
</html>`;

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully generated clean index.html! File size:', html.length);
