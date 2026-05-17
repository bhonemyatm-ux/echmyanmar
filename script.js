/* ============================================
   ECH Myanmar — Global Script
   ============================================ */
function playScanSound() {
  const audio = document.getElementById("scanSuccessSound");
  if (audio) {
    audio.currentTime = 0;  // reset in case last play was cut off
    audio.play().catch(err => {
      console.warn("Audio play failed (user interaction may be needed):", err);
    });
  }
}
(function () {
  'use strict';

  /* ---------- Nav toggle ---------- */
  const hamburger = document.getElementById('hamburger');
  const navDropdown = document.getElementById('navDropdown');

  if (hamburger && navDropdown) {
    hamburger.addEventListener('click', () => {
      const isOpen = navDropdown.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navDropdown.contains(e.target)) {
        navDropdown.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    navDropdown.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navDropdown.classList.remove('open');
        hamburger.classList.remove('open');
      });
    });
  }

  /* ---------- Active nav link ---------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-dropdown a').forEach((link) => {
    const href = link.getAttribute('href');
    if (
      href === currentPath ||
      (currentPath === '' && href === 'index.html') ||
      (currentPath === '/' && href === 'index.html')
    ) {
      link.classList.add('active');
    }
  });

  /* ---------- Smooth scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Scroll reveal animation ---------- */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.glass, .hero-badge, .section-header').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }

  /* ---------- Countdown timer (if element exists) ---------- */
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    const eventDate = new Date('2026-05-30T14:00:00');
    function updateCountdown() {
      const now = new Date();
      const diff = eventDate - now;
      if (diff <= 0) {
        countdownEl.textContent = 'Event is live now!';
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      countdownEl.textContent = `${d}d ${h}h ${m}m ${s}s`;
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* ---------- SUPERVISOR ATTENDANCE SYSTEM ---------- */
  // FIX 1: Only one declaration of readerEl (removed the duplicate)
  // FIX 2: Check for Html5Qrcode (not Html5QrcodeScanner — that class doesn't exist in the CDN)
  const readerEl = document.getElementById('reader');
  if (readerEl && window.Html5Qrcode) {
    initSupervisorScanner();
  }

  function initSupervisorScanner() {
    const resultBox     = document.getElementById('scanResult');
    const resultIcon    = document.getElementById('resultIcon');
    const resultTitle   = document.getElementById('resultTitle');
    const resultId      = document.getElementById('resultId');
    const scanAgainBtn  = document.getElementById('scanAgainBtn');
    const nextSessionBtn = document.getElementById('nextSessionBtn');
    const dashboardBtn  = document.getElementById('dashboardBtn');
    const dashboardEl   = document.getElementById('dashboard');
    const totalSessionsEl = document.getElementById('totalSessions');
    const memberListEl  = document.getElementById('memberList');
    const exportBtn     = document.getElementById('exportBtn');
    const clearSemesterBtn = document.getElementById('clearSemesterBtn');
    const logListEl     = document.getElementById('logList');
    const clearLogBtn   = document.getElementById('clearLog');

    let currentSession = parseInt(localStorage.getItem('ech_current_session') || '1');
    let totalSessions  = parseInt(localStorage.getItem('ech_total_sessions') || '0');

    const html5QrCode = new Html5Qrcode('reader');
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrCode.start(
      { facingMode: 'environment' },
      config,
      (decodedText) => onScanSuccess(decodedText),
      () => {}
    ).catch(() => {
      readerEl.innerHTML = '<p style="color:#EF4444;padding:2rem;">Tap to allow camera access, then refresh.</p>';
    });

   function onScanSuccess(decodedText) {
  const sessionKey = `ech_${currentSession}_${decodedText}`;
  if (sessionStorage.getItem(sessionKey)) {
    showResult('error', '⚠️', 'Already scanned this session!', decodedText);
    html5QrCode.pause();
    scanAgainBtn.style.display = 'block';
    return;
  }
  sessionStorage.setItem(sessionKey, '1');
  updateMemberAttendance(decodedText);
  addLogEntry(decodedText);
  showResult('success', '✅', 'Attendance recorded!', decodedText);
  html5QrCode.pause();
  scanAgainBtn.style.display = 'block';

  // Play sound only when scan is valid and saved
  playScanSound();
}

    function updateMemberAttendance(id) {
      const members = JSON.parse(localStorage.getItem('ech_members') || '{}');
      if (!members[id]) members[id] = { attended: 0, total: totalSessions };
      members[id].attended++;
      members[id].total = totalSessions + 1;
      localStorage.setItem('ech_members', JSON.stringify(members));
    }

    /* ---------- Attendance Log (this device / session) ---------- */
    function getLog() {
      return JSON.parse(sessionStorage.getItem('ech_log') || '[]');
    }

    function addLogEntry(id) {
      const log = getLog();
      log.unshift({ id, time: new Date().toLocaleTimeString() });
      sessionStorage.setItem('ech_log', JSON.stringify(log));
      renderLog();
    }

    function renderLog() {
      if (!logListEl) return;
      const log = getLog();
      if (!log.length) {
        logListEl.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;">No attendance logged yet.</p>';
        return;
      }
      logListEl.innerHTML = log.map(entry =>
        `<div class="log-entry">
          <span class="log-id">${entry.id}</span>
          <span class="log-time">${entry.time}</span>
        </div>`
      ).join('');
    }

    renderLog();

    if (clearLogBtn) {
      clearLogBtn.onclick = () => {
        sessionStorage.removeItem('ech_log');
        renderLog();
      };
    }

    /* ---------- Next Session ---------- */
    if (nextSessionBtn) {
      nextSessionBtn.onclick = () => {
        currentSession++;
        totalSessions++;
        localStorage.setItem('ech_current_session', currentSession);
        localStorage.setItem('ech_total_sessions', totalSessions);
        alert(`Session ${currentSession} started! Scanner is ready.`);
      };
    }

    /* ---------- Dashboard ---------- */
    if (dashboardBtn) dashboardBtn.onclick = renderDashboard;

    function renderDashboard() {
      const members = JSON.parse(localStorage.getItem('ech_members') || '{}');
      const list = Object.entries(members)
        .map(([id, data]) => ({
          id,
          attended: data.attended,
          total: data.total,
          pct: ((data.attended / data.total) * 100).toFixed(1)
        }))
        .sort((a, b) => b.pct - a.pct);

      memberListEl.innerHTML = list.length
        ? list.map(m =>
            `<div class="member-row">
              <span class="member-id">${m.id}</span>
              <span>${m.attended}/${m.total}</span>
              <span style="color:#10B981;font-weight:bold">${m.pct}%</span>
            </div>`
          ).join('')
        : '<p style="color:var(--text-muted)">No data yet.</p>';

      totalSessionsEl.textContent = totalSessions;
      dashboardEl.style.display = 'block';
    }

    /* ---------- Export CSV ---------- */
    if (exportBtn) {
      exportBtn.onclick = () => {
        // FIX 3: was localStorage.getElementById — correct method is localStorage.getItem
        const members = JSON.parse(localStorage.getItem('ech_members') || '{}');
        const rows = ['ID,Attended,Total,%'].concat(
          Object.entries(members).map(([id, data]) =>
            `${id},${data.attended},${data.total},${((data.attended / data.total) * 100).toFixed(1)}%`
          )
        );
        const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `ech-attendance-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
      };
    }

    /* ---------- Clear semester ---------- */
    if (clearSemesterBtn) {
      clearSemesterBtn.onclick = () => {
        if (confirm('This will erase all semester attendance data. Are you sure?')) {
          localStorage.removeItem('ech_members');
          localStorage.removeItem('ech_total_sessions');
          localStorage.removeItem('ech_current_session');
          currentSession = 1;
          totalSessions = 0;
          if (dashboardEl) dashboardEl.style.display = 'none';
          alert('Semester data cleared.');
        }
      };
    }

    /* ---------- Scan again ---------- */
    if (scanAgainBtn) {
      scanAgainBtn.onclick = () => {
        resultBox.style.display = 'none';
        scanAgainBtn.style.display = 'none';
        html5QrCode.resume();
      };
    }

    function showResult(type, icon, title, id) {
      resultBox.className = `scan-result ${type}`;
      resultIcon.textContent = icon;
      resultTitle.textContent = title;
      resultId.textContent = `ID: ${id}`;
      resultBox.style.display = 'block';
    }
  }

})();
