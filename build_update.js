const fs = require('fs');

// Read templates
const templates = JSON.parse(fs.readFileSync('scratch_templates.json', 'utf8'));

// Read original index.html
let html = fs.readFileSync('index.html', 'utf8');

// 1. Extra CSS
const extraCSS = `
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
  max-width: 560px;
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
`;

// Insert CSS before </style>
html = html.replace('</style>', extraCSS + '\n</style>');

// 2. Insert Modal HTML before <script>
const modalHTML = `
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
        <div class="form-row">
          <div class="form-group">
            <label>Tanggal Deadline Report</label>
            <input type="date" id="milestone-reminder-date">
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
`;

html = html.replace('<div id="toast">Processing...</div>', '<div id="toast">Processing...</div>\n' + modalHTML);

// 3. Replace TEMPLATES definition
const newTemplatesCode = 'const TEMPLATES = ' + JSON.stringify(templates) + ';\n';
html = html.replace(/const TEMPLATES = \{.*?\};\s*const COURSE_MAP/s, newTemplatesCode + 'const COURSE_MAP');

// 4. Update the JavaScript functions for milestone & calendar integration & upgraded generator
// Let's create the updated JS code for Auto Tab and Manual Tab
const updatedScriptSection = `
// ============================================================
// MILESTONE & CALENDAR MODAL LOGIC
// ============================================================
const MILESTONE_LESSONS = [8, 16, 24, 32];
let pendingMilestoneList = [];
let pendingDownloadAction = null;

function isMilestoneLesson(num) {
  return MILESTONE_LESSONS.includes(Number(num));
}

function getMilestoneStudentsAuto() {
  const list = [];
  autoStudents.forEach((s, i) => {
    const lessonEl = document.getElementById(\`auto-lesson-\${i}\`);
    const lessonVal = Number((lessonEl ? lessonEl.value : '') || s.lesson || 0);
    if (isMilestoneLesson(lessonVal)) {
      const nameEl = document.getElementById(\`auto-name-\${i}\`);
      const courseEl = document.getElementById(\`auto-course-\${i}\`);
      list.push({
        index: i,
        nama: (nameEl ? nameEl.value.trim() : '') || s.nama || \`Siswa \${i+1}\`,
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
        nama: s.nama || \`Siswa \${i+1}\`,
        course: document.getElementById('input-kelas')?.value || 'Kelas',
        lesson: Number(match[1])
      });
    }
  });
  return list;
}

function openMilestoneModal(milestoneList, onContinue) {
  pendingMilestoneList = milestoneList;
  pendingDownloadAction = onContinue;

  const listEl = document.getElementById('milestone-student-list');
  listEl.innerHTML = milestoneList.map(s => \`
    <div class="milestone-student-item">
      <div class="milestone-student-info">
        <span class="milestone-student-name">\${escHtml(s.nama)}</span>
        <span class="milestone-student-course">\${escHtml(s.course)}</span>
      </div>
      <span class="milestone-badge-pill">⭐ Lesson \${s.lesson} (Report)</span>
    </div>
  \`).join('');

  // Default reminder date: class date or tomorrow
  const activeTanggal = document.getElementById('auto-tanggal')?.value || document.getElementById('input-tanggal')?.value || todayVal;
  const remDateEl = document.getElementById('milestone-reminder-date');
  if (remDateEl && !remDateEl.value) {
    remDateEl.value = activeTanggal;
  }

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
  const title = \`[Report Due] Buat Student Report: \${studentNames} (\${kelas})\`;

  const [year, month, day] = dateVal.split('-').map(Number);
  const [hour, min] = timeVal.split(':').map(Number);
  const startDate = new Date(year, month - 1, day, hour, min, 0);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 jam

  const toGCalISO = (d) => d.toISOString().replace(/-|:|\\.\\d+/g, '');
  const dates = \`\${toGCalISO(startDate)}/\${toGCalISO(endDate)}\`;

  const details = \`PENGINGAT GURU TIMEDOOR ACADEMY:\\n\\nSegera susun dan kirimkan Student Progress Report / Evaluasi Milestone untuk murid berikut:\\n\` +
    pendingMilestoneList.map(s => \`• \${s.nama} — \${s.course} (Lesson \${s.lesson})\`).join('\\n') +
    \`\\n\\nKelas: \${kelas}\\nDeadline Pengisian: \${dateVal} (\${timeVal})\\n\\nPastikan pengisian rapor selesai dan dibagikan kepada orang tua siswa tepat waktu!\`;

  const gcalUrl = \`https://calendar.google.com/calendar/render?action=TEMPLATE&text=\${encodeURIComponent(title)}&dates=\${dates}&details=\${encodeURIComponent(details)}&location=\${encodeURIComponent('Timedoor Academy')}\`;
  
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
  const title = \`[Report Due] Buat Student Report: \${studentNames} (\${kelas})\`;

  const [year, month, day] = dateVal.split('-').map(Number);
  const [hour, min] = timeVal.split(':').map(Number);
  const startDate = new Date(year, month - 1, day, hour, min, 0);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  const toICSDate = (d) => {
    const pad = (n) => String(n).padStart(2, '0');
    return \`\${d.getUTCFullYear()}\${pad(d.getUTCMonth()+1)}\${pad(d.getUTCDate())}T\${pad(d.getUTCHours())}\${pad(d.getUTCMinutes())}\${pad(d.getUTCSeconds())}Z\`;
  };

  const details = \`PENGINGAT GURU TIMEDOOR ACADEMY:\\\\n\\\\nSegera susun dan kirimkan Student Progress Report untuk:\\\\n\` +
    pendingMilestoneList.map(s => \`• \${s.nama} - \${s.course} (Lesson \${s.lesson})\`).join('\\\\n') +
    \`\\\\n\\\\nKelas: \${kelas}\\\\nTanggal: \${dateVal}\`;

  const now = new Date();
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Timedoor Academy//Dashboard Guru//ID',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    \`UID:timedoor-report-\${Date.now()}@timedoor.net\`,
    \`DTSTAMP:\${toICSDate(now)}\`,
    \`DTSTART:\${toICSDate(startDate)}\`,
    \`DTEND:\${toICSDate(endDate)}\`,
    \`SUMMARY:\${title}\`,
    \`DESCRIPTION:\${details}\`,
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
  link.download = \`Reminder_Report_\${kelas.replace(/\\s+/g,'_')}.ics\`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast('✓ File kalender (.ics) berhasil diunduh!', 'success');
}

// Quick Notes Chips helper
function addQuickNote(idx, chipType) {
  const nama = document.getElementById(\`auto-name-\${idx}\`)?.value.trim() || 'Siswa';
  const textarea = document.getElementById(\`auto-progress-\${idx}\`);
  if (!textarea) return;

  let appendMsg = '';
  if (chipType.includes('Aktif')) {
    appendMsg = \`\\n\\nCatatan: \${nama} sangat aktif, antusias, dan mandiri selama mengikuti sesi kelas hari ini.\`;
  } else if (chipType.includes('Kreatif')) {
    appendMsg = \`\\n\\nCatatan: \${nama} menunjukkan kreativitas tinggi dan kaya ide dalam merancang karyanya.\`;
  } else if (chipType.includes('Fokus')) {
    appendMsg = \`\\n\\nCatatan: \${nama} sangat fokus, tekun, dan teliti dalam menyelesaikan setiap tantangan coding.\`;
  } else if (chipType.includes('Cepat')) {
    appendMsg = \`\\n\\nCatatan: \${nama} sangat cepat memahami logika konsep materi baru dan mempraktikkannya dengan lancar.\`;
  } else if (chipType.includes('Kolaboratif')) {
    appendMsg = \`\\n\\nCatatan: \${nama} sangat komunikatif, santun, dan senang berbagi ide positif dengan teman sekelas.\`;
  }

  if (appendMsg && !textarea.value.includes(appendMsg.trim())) {
    textarea.value = (textarea.value.trim() + appendMsg).trim();
    autoStudents[idx].progress = textarea.value;
    autoUpdateTable();
    toast('✓ Catatan guru ditambahkan!', 'success');
  }
}
`;

// Replace functions in AUTO TAB and MANUAL TAB with upgraded logic
// Find onCriteriaChange, onCourseChange, generateProgress, renderAutoInputs, downloadAutoPNG, downloadPNG
const newAutoTabLogic = `
function getCourseBadge(criteria){
  const map={Junior:'badge-junior',Kids:'badge-kids',Teens:'badge-teens'};
  return map[criteria]||'';
}

function getCourseOptions(criteria){
  const courses = COURSE_MAP[criteria] || [];
  return courses.map(c => \`<option value="\${escHtml(c)}">\${escHtml(c)}</option>\`).join('');
}

function getLessonOptions(courseName){
  const lessons = COURSE_DATA[courseName] || [];
  return lessons.map(l => {
    const isM = isMilestoneLesson(l.num) ? ' ⭐ (Milestone)' : '';
    return \`<option value="\${l.num}">\${l.title}\${isM}</option>\`;
  }).join('');
}

function onCriteriaChange(idx, selectEl){
  const criteria = selectEl.value;
  if(autoStudents[idx]) autoStudents[idx].criteria = criteria;
  const courseSelect = document.getElementById(\`auto-course-\${idx}\`);
  courseSelect.innerHTML = '<option value="">— Pilih Course —</option>' + getCourseOptions(criteria);
  const lessonSelect = document.getElementById(\`auto-lesson-\${idx}\`);
  lessonSelect.innerHTML = '<option value="">— Pilih Lesson —</option>';
  courseSelect.dispatchEvent(new Event('change'));
}

function onCourseChange(idx, selectEl){
  const courseName = selectEl.value;
  if(autoStudents[idx]) autoStudents[idx].course = courseName;
  const lessonSelect = document.getElementById(\`auto-lesson-\${idx}\`);
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
  const lessonEl = document.getElementById(\`auto-lesson-\${idx}\`);
  const tagEl = document.getElementById(\`milestone-tag-\${idx}\`);
  if (!lessonEl || !tagEl) return;
  const lessonNum = Number(lessonEl.value);
  if (isMilestoneLesson(lessonNum)) {
    tagEl.style.display = 'inline-flex';
    tagEl.textContent = \`⭐ Lesson \${lessonNum} (Wajib Report)\`;
  } else {
    tagEl.style.display = 'none';
  }
}

function generateProgress(idx){
  const nama = document.getElementById(\`auto-name-\${idx}\`).value.trim();
  const course = document.getElementById(\`auto-course-\${idx}\`).value;
  const lessonNum = document.getElementById(\`auto-lesson-\${idx}\`).value;
  
  if(!nama){ toast('Masukkan nama siswa dulu!','error'); return; }
  if(!course){ toast('Pilih course terlebih dahulu!','error'); return; }
  if(!lessonNum){ toast('Pilih lesson terlebih dahulu!','error'); return; }

  const templateRaw = (TEMPLATES[course] && TEMPLATES[course][lessonNum]) || \`Hari ini \${nama} telah menyelesaikan materi Lesson \${lessonNum} pada program \${course} dengan sangat baik.\`;
  const text = templateRaw.replace(/\\{nama\\}/g, nama);
  
  const textarea = document.getElementById(\`auto-progress-\${idx}\`);
  textarea.value = text;
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
    div.innerHTML = \`
      <div class="student-card-header">
        <div class="student-num">\${i+1}</div>
        <input type="text" id="auto-name-\${i}" placeholder="Nama siswa…" value="\${escHtml(s.nama)}" oninput="autoStudents[\${i}].nama=this.value;autoUpdateTable()">
        <span id="milestone-tag-\${i}" class="card-milestone-tag" style="display:\${isM ? 'inline-flex' : 'none'}">⭐ Lesson \${s.lesson||''} (Wajib Report)</span>
        <button class="btn-del" onclick="removeAutoStudent(\${i})" title="Hapus">×</button>
      </div>
      <div class="auto-gen-row">
        <div class="auto-gen-selectors">
          <select id="auto-criteria-\${i}" onchange="onCriteriaChange(\${i},this)" style="flex:1">
            <option value="">— Kriteria —</option>
            <option value="Junior">Junior</option>
            <option value="Kids">Kids</option>
            <option value="Teens">Teens</option>
          </select>
          <select id="auto-course-\${i}" onchange="onCourseChange(\${i},this)" style="flex:2">
            <option value="">— Course —</option>
          </select>
          <select id="auto-lesson-\${i}" onchange="onLessonChange(\${i},this)" style="flex:1.5">
            <option value="">— Lesson —</option>
          </select>
        </div>
        <button class="btn-generate" onclick="generateProgress(\${i})">⚡ Generate Progress</button>
      </div>
      <textarea id="auto-progress-\${i}" placeholder="Progress akan ter-generate otomatis dengan kalimat yang ramah orang tua, atau ketik manual…" oninput="autoStudents[\${i}].progress=this.value;autoUpdateTable()" style="min-height:100px">\${escHtml(s.progress)}</textarea>
      <div class="chips-label">💡 Tambah Catatan Personal (1-Klik):</div>
      <div class="chips-container">
        <span class="note-chip" onclick="addQuickNote(\${i}, '🌟 Sangat Aktif & Mandiri')">+ 🌟 Sangat Aktif</span>
        <span class="note-chip" onclick="addQuickNote(\${i}, '💡 Kreatif & Penuh Ide')">+ 💡 Kreatif</span>
        <span class="note-chip" onclick="addQuickNote(\${i}, '🎯 Fokus & Teliti')">+ 🎯 Fokus & Teliti</span>
        <span class="note-chip" onclick="addQuickNote(\${i}, '🚀 Cepat Memahami')">+ 🚀 Cepat Paham</span>
        <span class="note-chip" onclick="addQuickNote(\${i}, '🤝 Kolaboratif')">+ 🤝 Kolaboratif</span>
      </div>\`;
    c.appendChild(div);
    
    // Restore selections if any
    if(s.criteria){
      const criteriaEl = document.getElementById(\`auto-criteria-\${i}\`);
      criteriaEl.value = s.criteria;
      onCriteriaChange(i, criteriaEl);
      if(s.course){
        setTimeout(()=>{
          const courseEl = document.getElementById(\`auto-course-\${i}\`);
          if(courseEl){ 
            courseEl.value = s.course; 
            onCourseChange(i,courseEl);
            if(s.lesson){ 
              setTimeout(()=>{ 
                const lessonEl=document.getElementById(\`auto-lesson-\${i}\`); 
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
  });
  autoUpdateTable();
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
    link.download=\`Rapor_\${kelas}.png\`; link.href=canvas.toDataURL('image/png'); link.click();
    toast('PNG downloaded!','success');
  }catch(err){toast('Gagal: '+err.message,'error');}
  finally{btn.disabled=false;btn.textContent='Download PNG';}
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
    link.download=\`Progress_\${kelas}.png\`; link.href=canvas.toDataURL('image/png'); link.click();
    toast('PNG downloaded!','success');
  }catch(err){toast('Gagal: '+err.message,'error');}
  finally{btn.disabled=false; btn.textContent='Download PNG';}
}
`;

// Replace in html
// We insert updatedScriptSection before function getCourseBadge
html = html.replace('function getCourseBadge(criteria){', updatedScriptSection + '\nfunction getCourseBadge(criteria){');

// Replace function downloadAutoPNG, downloadPNG, renderAutoInputs, etc.
// Let's replace the whole AUTO TAB section in script
const originalAutoTabStart = html.indexOf('function getCourseBadge(criteria){');
const originalAutoTabEnd = html.indexOf('async function openAutoWhatsApp(){');

if (originalAutoTabStart !== -1 && originalAutoTabEnd !== -1) {
  html = html.substring(0, originalAutoTabStart) + newAutoTabLogic + '\n' + html.substring(originalAutoTabEnd);
} else {
  console.error('Could not find AUTO TAB script section boundary!');
  process.exit(1);
}

// Replace original downloadPNG in MANUAL TAB
html = html.replace(/async function downloadPNG\(\)\{[\s\S]*?finally\{btn\.disabled=false; btn\.textContent='Download PNG';\}\s*\}/, '');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated index.html! New size:', html.length);
