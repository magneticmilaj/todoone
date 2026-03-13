// =============================================
//  ▼▼▼ 여기서 설정을 수정하세요 ▼▼▼
// =============================================

// 유효한 무료체험 코드 목록 (대소문자 구분 없음)
const VALID_CODES = [
  'FREECODE',   // ← 실제 코드로 교체하세요
  // 'CODE2',   // 추가 코드가 있으면 이렇게 추가
];

// 앱스토어 URL
const APP_STORE_URL  = 'APP_STORE_URL_HERE';   // ← iOS App Store 링크로 교체
const PLAY_STORE_URL = 'PLAY_STORE_URL_HERE';  // ← Google Play Store 링크로 교체

// =============================================
//  ▲▲▲ 설정 끝 ▲▲▲
// =============================================


/** 기기 감지 */
function detectDevice() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
  if (/android/i.test(ua)) return 'android';
  return 'other';
}

/** 무료체험 다운로드 처리 */
function handleDownload() {
  const input = document.getElementById('trialCode');
  const errorEl = document.getElementById('trialError');
  const code = input.value.trim().toUpperCase();

  const isValid = VALID_CODES.map(c => c.toUpperCase()).includes(code);

  if (!isValid) {
    errorEl.style.display = 'block';
    input.focus();
    return;
  }

  errorEl.style.display = 'none';

  const device = detectDevice();

  if (device === 'ios') {
    window.location.href = APP_STORE_URL;
  } else if (device === 'android') {
    window.location.href = PLAY_STORE_URL;
  } else {
    document.getElementById('iosBtn').href = APP_STORE_URL;
    document.getElementById('androidBtn').href = PLAY_STORE_URL;
    document.getElementById('storeModal').style.display = 'flex';
  }
}

/** 모달 외부 클릭 시 닫기 */
function closeModal(event) {
  if (event.target.id === 'storeModal') {
    event.target.style.display = 'none';
  }
}

/** 엔터키 / 입력 이벤트 (trialCode 있는 페이지만) */
const trialCodeEl = document.getElementById('trialCode');
if (trialCodeEl) {
  trialCodeEl.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') handleDownload();
  });
  trialCodeEl.addEventListener('input', function() {
    document.getElementById('trialError').style.display = 'none';
  });
}


// =============================================
//  우측 고정 네비게이션 (섹션 목록)
// =============================================

function buildSideNav() {
  const sections = document.querySelectorAll('section[data-label]');
  if (sections.length === 0) return;

  const nav = document.createElement('nav');
  nav.className = 'side-nav';
  nav.setAttribute('aria-label', '페이지 목록');

  sections.forEach(sec => {
    const a = document.createElement('a');
    a.href = '#' + sec.id;
    a.className = 'side-nav-item';
    a.textContent = sec.dataset.label;
    a.addEventListener('click', function(e) {
      e.preventDefault();
      sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    nav.appendChild(a);
  });

  document.body.appendChild(nav);

  // 현재 보이는 섹션 강조 (IntersectionObserver)
  const items = nav.querySelectorAll('.side-nav-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        items.forEach(a => a.classList.remove('active'));
        const active = nav.querySelector(`a[href="#${entry.target.id}"]`);
        if (active) {
          active.classList.add('active');
          // 사이드바 내에서 해당 항목이 보이도록 스크롤
          active.scrollIntoView({ block: 'nearest' });
        }
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '-10% 0px -60% 0px'
  });

  sections.forEach(sec => observer.observe(sec));
}

buildSideNav();
