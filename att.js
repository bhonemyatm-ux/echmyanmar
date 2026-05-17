//ECH Myanmar Attendance System Javascript


(function () {
  'use strict';

 //အသံဖိုင် စနစ်တကျ ပွင့်စေရန်နှင့် ဖွင့်ရန်
 // Browser များ၏ Security စနစ်ကြောင့် User က နှိပ်မှ အသံထွက်ခွင့်ပေးသဖြင့်
 //  အသံဖိုင်များကို ကြိုတင် Unlock လုပ်ပေးသည့် Function
  function unlockAudioEl(el) {
    if (!el) return;
    el.play().then(() => { el.pause(); el.currentTime = 0; }).catch(() => {});
  }
// Scan အောင်မြင်သည့်အသံနှင့် ကျရှုံးသည့်အသံ Element memory ဆွဲယူခြင်း
  const _scanSoundEl = document.getElementById('scanSound');
  const _failSoundEl = document.getElementById('failSound');

// Screen ပေါ်ကို တစ်ချက်နှိပ်လိုက်တာနဲ့ အသံထွက်နိုင်အောင် ဆောက်ပေးထားသည့် Event
  const doUnlock = () => {
    unlockAudioEl(_scanSoundEl);
    unlockAudioEl(_failSoundEl);
    document.removeEventListener('click',    doUnlock);
    document.removeEventListener('touchend', doUnlock);
  };
  document.addEventListener('click',    doUnlock);
  document.addEventListener('touchend', doUnlock);

// အသံဖိုင်ကို Clone ပွားပြီး တစ်ခုပြီးတစ်ခု ထပ်ကာထပ်ကာ အဆင်ပြေပြေ အသံထွက်စေမည့် စနစ်
  function playSound(id) {
    const original = document.getElementById(id);
    if (!original) return;
    const clone = original.cloneNode();// အသံထပ်တူကျအောင် Clone လုပ်ခြင်း
    clone.play().catch(() => {});
  }
// သက်ဆိုင်ရာ အသံဖိုင်များကို စတင်ခေါ်ယူအသုံးပြုသည့် Function
  function playScanSound() { playSound('scanSound'); }
  function playFailSound() { playSound('failSound'); }

  //nav toggle (မိုဘိုင်းလ်ဖုန်း Menu ဖွင့်/ပိတ် စနစ်)
  const hamburger   = document.getElementById('hamburger');
  const navDropdown = document.getElementById('navDropdown');

  if (hamburger && navDropdown) {
    hamburger.addEventListener('click', () => {
      const isOpen = navDropdown.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

// Menu ဘားအပြင်ဘက် လွတ်နေတဲ့နေရာကို နှိပ်လိုက်လျှင် bar ပိတ်ပေးမည့် စနစ်
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navDropdown.contains(e.target)) {
        navDropdown.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Dropdown ထဲက Link တစ်ခုခုကို နှိပ်လိုက်ရင်လည်း Menu ဘားကို အလိုအလျောက် ပြန်ပိတ်ပေးခြင်းစနစ် ဘာညာ
    navDropdown.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navDropdown.classList.remove('open');
        hamburger.classList.remove('open');
      });
    });
  }

  //Active nav link (လက်ရှိရောက်နေသော စာမျက်နှာကို အရောင်လင်း)
  // လက်ရှိ ရောက်ရှိနေသော URL လမ်းကြောင်း (Path) အမည်ကို ရှာဖွေခြင်း
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-dropdown a').forEach((link) => {
    const href = link.getAttribute('href');
    // အကယ်၍ Link ဟာ လက်ရှိရောက်နေတဲ့ စာမျက်နှာဖြစ်ပါက '.active' ဆိုသည့် CSS Class ကို ထည့်ပေးခြင်း
    if (
      href === currentPath ||
      (currentPath === '' && href === 'index.html') ||
      (currentPath === '/' && href === 'index.html')
    ) {
      link.classList.add('active');
    }
  });

  //Smooth scroll (အပေါ်/အောက် ဆင်းလျှင် ညင်သာစွာ သွားစေခြင်း)
  // '#' ဖြင့် စတင်သော Anchor Link များကို နှိပ်ပါက ချောမွေ့စွာ Scroll ဆင်းပေးသည့်စနစ်
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

 //Scroll reveal (အောက်သို့ဆင်းလျှင် စာသားများ လှပစွာ ပေါ်လာစေခြင်း) animation
 //HTML Element များ Screen ပေါ်သို့ ရောက်ရှိလာမှသာ ပုံရိပ်ထင်ရှားလာစေမည့် (IntersectionObserver) စနစ်
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';// လုံးဝထင်ရှား
            entry.target.style.transform = 'translateY(0)';// မူလနေရာသို့ ပြန်ပို့ခြင်း
            observer.unobserve(entry.target);// တစ်ခါပေါ်ပြီးပါကပယ်ဖျက်ခြင်း
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }// အောက်မရောက်ခင် ကြိုတင်အလုပ်လုပ်ရန် သတ်မှတ်ချက်
    );
//Glass Card နှင့် Section Header များကို စာရင်းသွင်းခြင်
    document.querySelectorAll('.glass, .hero-badge, .section-header').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }

  /* ---------- Countdown ---------- */
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    const eventDate = new Date('2026-05-30T14:00:00');//Target Date
    function updateCountdown() {
      const diff = eventDate - new Date();// လက်ရှိအချိန်နှင့် ခြားနားချက်ကို ရှာဖွေခြင်း (မီလီစက္ကန့်ဖြင့်)
      if (diff <= 0) { countdownEl.textContent = 'Event is live now!'; return; }// အချိန်ကျော်သွားပါက ပြမည့်စာသား
      // မီလီစက္ကန့်မှ ရက်၊ နာရီ၊ မိနစ်၊ စက္ကန့်များသို့ တွက်ချက်ပြောင်းလဲခြင်း
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      countdownEl.textContent = `${d}d ${h}h ${m}m ${s}s`;// Screen ပေါ်တွင် ပြသခြင်း
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);// ၁ စက္ကန့်လျှင် တစ်ကြိမ် အလိုအလျောက် Update လုပ်ခြင်း
  }

//ECH ID validation (ID မှန်/မမှန် စစ်ဆေးခြင်း)
// ID ပုံစံသည် ECH ဖြင့်စတင်ရမည်ဖြစ်ပြီး နောက်တွင် အင်္ဂလိပ်စာလုံးများနှင့် အနည်းဆုံး 
// ဂဏန်း ၃ လုံး (ဥပမာ- ECHMember001) ပါရမည်ဟု Regex ဖြင့် စစ်ဆေးခြင်း
  function isValidECHId(id) {
    return /^ECH[A-Za-z]+\d{3,}$/.test(id.trim());
  }

//SUPERVISOR ATTENDANCE SYSTEM (စီမံခန့်ခွဲသူများအတွက် QR တက်ရောက်မှုစနစ်)
  const readerEl = document.getElementById('reader');
  // အကယ်၍ ကင်မရာ Reader Element နှင့် ပြင်ပ QR Library (Html5Qrcode) ရှိနေမှသာ စနစ်ကို စတင်လည်ပတ်မည့် code
  if (readerEl && window.Html5Qrcode) {
    initSupervisorScanner();
  }

  function initSupervisorScanner() {
    // လိုအပ်သော HTML Component များနှင့် ခလုတ်များအားလုံးကို စုဆောင်းခြင်း
    const scannerBox       = document.getElementById('scannerBox');
    const resultBox        = document.getElementById('scanResult');
    const resultIcon       = document.getElementById('resultIcon');
    const resultTitle      = document.getElementById('resultTitle');
    const resultId         = document.getElementById('resultId');
    const scanAgainBtn     = document.getElementById('scanAgainBtn');
    const nextSessionBtn   = document.getElementById('nextSessionBtn');
    const dashboardBtn     = document.getElementById('dashboardBtn');
    const dashboardEl      = document.getElementById('dashboard');
    const totalSessionsEl  = document.getElementById('totalSessions');
    const memberListEl     = document.getElementById('memberList');
    const exportBtn        = document.getElementById('exportBtn');
    const clearSemesterBtn = document.getElementById('clearSemesterBtn');
    const logListEl        = document.getElementById('logList');
    const clearLogBtn      = document.getElementById('clearLog');
    const cameraHint       = document.getElementById('cameraHint');

// LocalStorage ထဲမှ လက်ရှိ Session အခြေအနေ ဒေတာများကို ဖတ်ယူခြင်း (မရှိပါက စမှတ်အဖြစ် ၁ ဟု သတ်မှတ်သည်)
    let currentSession = parseInt(localStorage.getItem('ech_current_session') || '1');
    let totalSessions  = parseInt(localStorage.getItem('ech_total_sessions') || '0');

    // Scan ဖတ်နေစဉ်အတွင်း ခဏတာ စောင့်ဆိုင်းချိန် (Delay) အတွက် အသုံးပြုသည့် Variable များ
    let isProcessing = false;
    let hideTimer    = null;
//ပြင်ပ QR Code Scanner Object ကို သတ်မှတ်ထားသော ID ပေါ်တွင် တည်ဆောက်ခြင်း
    const html5QrCode = new Html5Qrcode('reader');

   //ဖုန်း Screen အကျယ်အဝန်းအလိုက် QR ဖတ်မည့် လေးထောင့်ကွက်အရွယ်အစားကို (အများဆုံး 250px) တွက်ချက်ပေးသည့် စနစ်
    function getQrBoxSize() {
      const readerWidth = readerEl.offsetWidth || 280;
      const size = Math.min(Math.floor(readerWidth * 0.70), 250);
      return { width: size, height: size };
    }
// Scanner ၏ လုပ်ဆောင်ချက် ချိန်ညှိမှုများ 10fps
    const config = {
      fps: 10,
      qrbox: getQrBoxSize(),
      aspectRatio: 1.0,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
    };

    // ဖုန်းနောက်ကင်မရာ (Rear Camera) ကို ဦးစားပေးစဖွင့်ပြီး မရပါက ရှေ့ကင်မရာ သို့မဟုတ် ရနိုင်သော ကင်မရာဖြင့် အလုပ်လုပ်စေမည့် စနစ်
    function startScanner() {
      html5QrCode.start(
        { facingMode: { exact: 'environment' } },
        config,
        onScanSuccess,
        () => {}
      ).catch(() => {
       // ဒုတိယအဆင့်: နောက်ကင်မရာမရပါက ရှေ့ကင်မရာ (Front/User) ဖြင့် စမ်းခြင်း
        html5QrCode.start(
          { facingMode: 'user' },
          config,
          onScanSuccess,
          () => {}
        ).catch(() => {
          // တတိယအဆင့်: ဖုန်းထဲတွင် ရနိုင်သမျှ ကင်မရာစာရင်းကို ရှာဖွေပြီး အဆင်ပြေရာဖြင့် ဖွင့်ခြင်း
          Html5Qrcode.getCameras().then((cameras) => {
            if (cameras && cameras.length > 0) {
              html5QrCode.start(
                cameras[0].id,
                config,
                onScanSuccess,
                () => {}
              ).catch(showCameraError);
            } else {
              showCameraError();
            }
          }).catch(showCameraError);
        });
      });
    }
// ကင်မရာ ဖွင့်မရပါက Screen ပေါ်တွင် Error စာသားပြသခြင်း
    function showCameraError() {
      readerEl.innerHTML = '';
      if (cameraHint) cameraHint.style.display = 'flex';
    }

    startScanner();// Scanner စတင်လည်ပတ်ခြင်း

    //သတ်မှတ်ချိန် ၁.၅ စက္ကန့်ပြည့်ပါက Scan ရလဒ်ကို ဖျောက်ပြီး နောက်တစ်ကြိမ် ဖတ်နိုင်အောင် ပြင်ဆင်ခြင်း
    //ပြန်လည်ပြုပြင်ထားသော feature
    function scheduleHide() {
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        hideTimer = null;
        resultBox.style.display = 'none';
        scanAgainBtn.style.display = 'none';
        isProcessing = false;// နောက်ထပ် QR ဖတ်လို့ရအောင် လမ်းပြန်ဖွင့်ပေးခြင်း
      }, 1500);
    }

    //ID အမှားများ သို့မဟုတ် ဒုတိယအကြိမ် ထပ်ဖတ်မိပါက တုန်ခါမှု (Shake Animation) ပြုလုပ်ခြင်း
    function triggerShake() {
      if (!scannerBox) return;
      scannerBox.classList.remove('shake');
      void scannerBox.offsetWidth;
      scannerBox.classList.add('shake');
      scannerBox.addEventListener('animationend', () => {
        scannerBox.classList.remove('shake');
      }, { once: true });
    }

    //QR Code ဖတ်လို့ အောင်မြင်သွားချိန်တွင် အဓိက အလုပ်လုပ်မည့် နေရာ
    function onScanSuccess(decodedText) {
      if (isProcessing) return;// အလုပ်ရှုပ်နေပါက နောက်ထပ် Scan ဖတ်ခြင်းကို ခဏပိတ်ထားမည်
      isProcessing = true;

      const id = decodedText.trim();

      // ၁။ invalid QR ဖြစ်နေပါက Error ပြပြီး အသံထွက်စေခြင်း
      if (!isValidECHId(id)) {
        showResult('error', '\u274C', 'Not an ECH member QR', id);
        playFailSound();
        triggerShake();
        scheduleHide();
        return;
      }

      // ၂။ ယခုလက်ရှိ Session မှာ တက်ရောက်ပြီးသား (Duplicate) ဖြစ်နေပါက အသိပေးခြင်း
      const sessionKey = `ech_${currentSession}_${id}`;
      if (sessionStorage.getItem(sessionKey)) {
        showResult('error', '\u26A0\uFE0F', 'Already scanned this session!', id);
        playFailSound();
        triggerShake();
        scheduleHide();
        return;
      }

      //၃။ ဒေတာအမှန်ဖြစ်ပါက တက်ရောက်မှုအဖြစ် မှတ်တမ်းတင်ခြင်း
      sessionStorage.setItem(sessionKey, '1');
      updateMemberAttendance(id);
      addLogEntry(id);
      showResult('success', '\u2705', 'Attendance recorded!', id);
      playScanSound();
      scheduleHide();
    }
// မျက်နှာပြင်ပေါ်တွင်  scanner success သို့မဟုတ် fail ရလဒ်များကို စာသားများဖြင့် ပေါ်လာစေသည့် စနစ်
    function showResult(type, icon, title, id) {
      resultBox.className = `scan-result ${type}`;
      resultIcon.textContent = icon;
      resultTitle.textContent = title;
      resultId.textContent = `ID: ${id}`;
      resultBox.style.display = 'block';
    }

   // Manual စနစ်ဖြင့် ကိုယ်တိုင်ပိတ်ပြီး နောက်တစ်ကြိမ် ချက်ချင်းဖတ်ရန် ခလုတ်(မပါ)
    if (scanAgainBtn) {
      scanAgainBtn.onclick = () => {
        if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
        resultBox.style.display = 'none';
        scanAgainBtn.style.display = 'none';
        isProcessing = false;
      };
    }
//Attendance Log (ယခုလက်ရှိ ဖတ်ပြီးသမျှ စာရင်းမှတ်တမ်း)
  // SessionStorage ထဲက လက်ရှိ Log ဒေတာများကို ယူခြင်း
    function getLog() {
      return JSON.parse(sessionStorage.getItem('ech_log') || '[]');
    }
// နာရီအချိန်နှင့်တကွ မှတ်တမ်းအသစ်ကို ထိပ်ဆုံးမှ တိုး၍ သိမ်းဆည်းခြင်း
    function addLogEntry(id) {
      const log = getLog();
      log.unshift({ id, time: new Date().toLocaleTimeString() });
      sessionStorage.setItem('ech_log', JSON.stringify(log));
      renderLog();
    }
// HTML ပေါ်တွင် Log စာရင်းများကို ပုံဖော်ပြသခြင်း (မရှိပါက No attendance ဟု ပြမည်)
    function renderLog() {
      if (!logListEl) return;
      const log = getLog();
      if (!log.length) {
        logListEl.innerHTML = '<p class="att-empty-msg">No attendance logged yet.</p>';
        return;
      }
      logListEl.innerHTML = log.map(entry =>
        `<div class="log-entry">
          <span class="log-id">${entry.id}</span>
          <span class="log-time">${entry.time}</span>
        </div>`
      ).join('');
    }

    renderLog();// page စဖွင့်ချိန်တွင် Log ဟောင်းများရှိပါက ဆွဲထုတ်ပြသခြင်း
// ယခု Log များကို ရှင်းလင်းဖျက်ဆီးပစ်မည့် ခလုတ်
    if (clearLogBtn) {
      clearLogBtn.onclick = () => {
        sessionStorage.removeItem('ech_log');
        renderLog();
      };
    }

   // Next Session (နောက်တစ်ပတ် သို့မဟုတ် နောက်တစ်ကြိမ်ပွဲသို့ ကူးပြောင်းခြင်း)
    if (nextSessionBtn) {
      nextSessionBtn.onclick = () => {
        currentSession++;
        totalSessions++;
        localStorage.setItem('ech_current_session', currentSession);
        localStorage.setItem('ech_total_sessions', totalSessions);
        alert(`Session ${currentSession} started! Scanner is ready.`);
      };
    }

   //Dashboard (ကျောင်းသားအားလုံး၏ စုစုပေါင်း တက်ရောက်မှုဇယား)
    if (dashboardBtn) dashboardBtn.onclick = renderDashboard;

    function renderDashboard() {
      const members = JSON.parse(localStorage.getItem('ech_members') || '{}');
      // ကျောင်းသားတစ်ဦးစီ၏ ဒေတာများကို ရာခိုင်နှုန်းတွက်ချက်ပြီး ရာခိုင်နှုန်းအများဆုံးလူကို ထိပ်ဆုံးမှ စီစဉ် (Sort) ထားခြင်
      const list = Object.entries(members)
        .map(([id, data]) => ({
          id,
          attended: data.attended,
          total: data.total,
          pct: ((data.attended / data.total) * 100).toFixed(1)
        }))
        .sort((a, b) => parseFloat(b.pct) - parseFloat(a.pct));
// HTML အဖြစ် ပြောင်းလဲပြီး ဇယားကွက်ထဲသို့ ထည့်သွင်းပြသခြင်း
      memberListEl.innerHTML = list.length
        ? list.map(m =>
            `<div class="member-row">
              <span class="member-id">${m.id}</span>
              <span style="color:var(--text-muted);font-size:0.8rem;">${m.attended}/${m.total}</span>
              <span class="member-pct">${m.pct}%</span>
            </div>`
          ).join('')
        : '<p class="att-empty-msg">No data yet.</p>';

      totalSessionsEl.textContent = totalSessions;
      dashboardEl.style.display = 'block';// Dashboard ကို ပေါ်အောင်လုပ်ခြင်း
    }
    
    //Export CSV (ဒေတာများကို Excel/CSV ဖိုင်အဖြစ် downloadခြင်း)
    if (exportBtn) {
      exportBtn.onclick = () => {
        const members = JSON.parse(localStorage.getItem('ech_members') || '{}');
        // Excel တွင် ကော်လံကွက်များ အဆင်ပြေစေရန် ကော်မာ ( , ) ခံပြီး စာသားစီခြင်း
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

   //Clear semester (စာသင်နှစ်တစ်ခုလုံး၏ ဒေတာအားလုံးကို အပြီးတိုင်ဖျက်ခြင်း)
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
//ကျောင်းသားတစ်ဦးချင်းစီ၏ စုစုပေါင်းတက်ရက်နှင့် ရာခိုင်နှုန်းကို တွက်ချက်သိမ်းဆည်းပေးသည့် လုပ်ဆောင်ချက်
    function updateMemberAttendance(id) {
      const members = JSON.parse(localStorage.getItem('ech_members') || '{}');
      if (!members[id]) members[id] = { attended: 0, total: totalSessions };
      members[id].attended++;// တက်ရောက်ရက် ၁ ရက်တိုးခြင်း
      members[id].total = totalSessions + 1;// စုစုပေါင်းအတန်းအရေအတွက် ညှိခြင်း
      localStorage.setItem('ech_members', JSON.stringify(members));
    }
  }

})();
