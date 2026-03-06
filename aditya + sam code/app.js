// ============================================================
// AidReach - Main Application v2.0
// Registration + Email/PIN Login Flow
// ============================================================
import { openDB, getUser, saveUser, getSetting, saveSetting } from './db.js';
import { registerUser, loginWithEmailPin, isRegistered, isLoggedIn, setLoggedIn, getCurrentUser } from './auth.js';
import { t, setLanguage, getLang } from './i18n.js';
import { speak, setVoiceEnabled, stopSpeaking } from './voice.js';

// ---- State ----
let currentScreen = 'splash';
let user = { name: 'User', email: '', phone: '', bloodGroup: 'A+', allergies: '', contact: '' };
let lang = 'en';
let voiceOn = true;

// CPR state
let cprRunning = false;
let cprInterval = null;
let cprCount = 0;
let cprPhase = 'compress';
let cprRound = 0;

// Burns timer state
let burnsTimerRunning = false;
let burnsTimerInterval = null;
let burnsSecondsLeft = 600;

// ---- Navigation ----
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('screen-' + id);
    if (target) {
        target.classList.add('active');
        currentScreen = id;
        updateNav(id);
        updateOfflineBadge();
    }
}

function updateNav(id) {
    const navScreens = ['dashboard', 'profile', 'settings'];
    const navEl = document.getElementById('bottom-nav');
    const sidebar = document.getElementById('desktop-sidebar');

    // Mobile bottom nav
    if (navEl) navEl.style.display = navScreens.includes(id) ? 'flex' : 'none';

    // Desktop sidebar — hide on splash/auth
    if (sidebar) sidebar.style.display = ['splash', 'auth'].includes(id) ? 'none' : '';

    // Mobile nav active state
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.screen === id);
    });

    // Sidebar active state
    const sidebarMap = {
        dashboard: 'sb-dashboard', profile: 'sb-profile', settings: 'sb-settings',
        cpr: 'sb-dashboard', bleeding: 'sb-dashboard', burns: 'sb-dashboard', fracture: 'sb-dashboard', choking: 'sb-dashboard'
    };
    document.querySelectorAll('.sidebar-nav-item').forEach(b => b.classList.remove('active'));
    const sbId = sidebarMap[id];
    if (sbId) { const el = document.getElementById(sbId); if (el) el.classList.add('active'); }
}

function updateOfflineBadge() {
    const badge = document.getElementById('offline-badge');
    if (!badge) return;
    const online = navigator.onLine;
    badge.classList.toggle('offline', !online);
    badge.querySelector('.offline-dot').style.background = online ? 'var(--green)' : 'var(--red-light)';
    badge.querySelector('.offline-label').textContent = online ? 'Online' : t('offline_active');
}

window.addEventListener('online', updateOfflineBadge);
window.addEventListener('offline', updateOfflineBadge);

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });
}

// ---- Splash ----
function initSplash() {
    showScreen('splash');
    setTimeout(async () => {
        await openDB();
        const savedLang = await getSetting('lang', 'en');
        lang = savedLang;
        setLanguage(lang);
        applyTranslations();
        voiceOn = await getSetting('voice', true);
        setVoiceEnabled(voiceOn);

        const registered = await isRegistered();
        const loggedIn = await isLoggedIn();
        const savedUser = await getCurrentUser();
        if (savedUser) Object.assign(user, savedUser);

        if (loggedIn && registered) {
            showDashboard();
        } else if (registered) {
            showAuthScreen('login');
        } else {
            showAuthScreen('register');
        }
    }, 2400);
}

// ---- Auth Screen (Register / Login) ----
function showAuthScreen(tab = 'register') {
    showScreen('auth');
    switchAuthTab(tab);
    setupPinAutoAdvance('reg', ['rp0', 'rp1', 'rp2', 'rp3']);
    setupPinAutoAdvance('login', ['lp0', 'lp1', 'lp2', 'lp3']);
}

function switchAuthTab(tab) {
    const isReg = tab === 'register';
    document.getElementById('tab-register').classList.toggle('active', isReg);
    document.getElementById('tab-login').classList.toggle('active', !isReg);
    document.getElementById('panel-register').style.display = isReg ? 'flex' : 'none';
    document.getElementById('panel-login').style.display = !isReg ? 'flex' : 'none';
    document.getElementById('auth-main-title').textContent = isReg ? 'Create Your Account' : 'Welcome Back';
    // Clear errors
    document.getElementById('reg-error').classList.remove('visible');
    document.getElementById('login-error').classList.remove('visible');
}

function setupPinAutoAdvance(prefix, ids) {
    ids.forEach((id, idx) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', () => {
            const val = el.value.replace(/\D/g, '');
            el.value = val ? val[val.length - 1] : '';
            if (val && idx < ids.length - 1) {
                document.getElementById(ids[idx + 1])?.focus();
            }
        });
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !el.value && idx > 0) {
                document.getElementById(ids[idx - 1])?.focus();
            }
        });
    });
}

function getPinValue(ids) {
    return ids.map(id => document.getElementById(id)?.value || '').join('');
}

function showAuthError(panel, msg) {
    const el = document.getElementById(panel + '-error');
    if (el) { el.textContent = msg; el.classList.add('visible'); }
}

// ---- Do Register ----
async function doRegister() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const pin = getPinValue(['rp0', 'rp1', 'rp2', 'rp3']);

    if (!name) return showAuthError('reg', '⚠️ Please enter your full name.');
    if (!email || !email.includes('@')) return showAuthError('reg', '⚠️ Please enter a valid email.');
    if (!phone || phone.length < 6) return showAuthError('reg', '⚠️ Please enter a valid phone number.');
    if (pin.length !== 4) return showAuthError('reg', '⚠️ Please complete your 4-digit PIN.');

    const btn = document.getElementById('btn-register');
    btn.disabled = true; btn.textContent = 'Creating account…';

    await registerUser({ name, email, phone, pin });
    Object.assign(user, { name, email, phone, bloodGroup: 'A+', allergies: '', contact: phone });

    btn.disabled = false; btn.textContent = '🚀 Create Account & Enter';
    showDashboard();
}

// ---- Do Login ----
async function doLogin() {
    const email = document.getElementById('login-email').value.trim();
    const pin = getPinValue(['lp0', 'lp1', 'lp2', 'lp3']);

    if (!email) return showAuthError('login', '⚠️ Please enter your email.');
    if (pin.length !== 4) return showAuthError('login', '⚠️ Please enter all 4 PIN digits.');

    const btn = document.getElementById('btn-login');
    btn.disabled = true; btn.textContent = 'Verifying…';

    const result = await loginWithEmailPin(email, pin);

    btn.disabled = false; btn.textContent = '🔓 Login Securely';

    if (result.ok) {
        Object.assign(user, result.user);
        // Clear PIN fields for security
        ['lp0', 'lp1', 'lp2', 'lp3'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
        showDashboard();
    } else {
        // Shake
        document.querySelector('#panel-login .inline-pin').classList.add('shake');
        setTimeout(() => document.querySelector('#panel-login .inline-pin').classList.remove('shake'), 500);
        ['lp0', 'lp1', 'lp2', 'lp3'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
        document.getElementById('lp0')?.focus();
        showAuthError('login', '❌ ' + result.msg);
    }
}

// ---- Dashboard ----
function showDashboard() {
    showScreen('dashboard');
    const nameEl = document.getElementById('dash-user-name');
    if (nameEl) nameEl.textContent = user.name || 'User';
    const infoBar = document.getElementById('dash-info');
    if (infoBar) {
        infoBar.innerHTML = `
      <span>🩸 <strong>${user.bloodGroup || '—'}</strong></span>
      ${user.allergies ? `<span class="info-chip">⚠️ ${user.allergies}</span>` : ''}
      <span style="margin-left:auto;font-size:10px;color:var(--text-muted)">Tap 🆘 for emergency</span>`;
    }
    speak(lang === 'hi'
        ? 'AidReach तैयार है। कृपया एक आपातकाल चुनें।'
        : 'AidReach ready. Please select an emergency type.', lang);
}

// ---- CPR Module ----
function initCPR() {
    showScreen('cpr');
    cprRunning = false; cprCount = 0; cprRound = 0; cprPhase = 'compress';
    updateCPRDisplay();
    speak(lang === 'hi' ? 'CPR शुरू करें। जोर से दबाएं।' : 'Start CPR. Push hard and fast.', lang);
}

function updateCPRDisplay() {
    const counter = document.getElementById('cpr-counter');
    const instr = document.getElementById('cpr-instruction');
    const sub = document.getElementById('cpr-sub');
    const startBtn = document.getElementById('cpr-start-btn');
    if (cprPhase === 'breathe') {
        if (counter) counter.textContent = '2';
        if (instr) instr.textContent = t('cpr_breathe');
        if (sub) sub.textContent = t('cpr_breathe_sub');
        if (startBtn) startBtn.textContent = t('cpr_resume');
    } else {
        if (counter) counter.textContent = cprCount || '0';
        if (instr) instr.textContent = t('cpr_instruction');
        if (sub) sub.textContent = t('cpr_sub_text');
        if (startBtn) startBtn.textContent = cprRunning ? '⏸ PAUSE' : t('cpr_start');
    }
}

function toggleCPR() {
    if (cprPhase === 'breathe') {
        cprPhase = 'compress'; cprCount = 0; startCPRMetronome(); updateCPRDisplay(); return;
    }
    cprRunning ? pauseCPR() : startCPRMetronome();
}

function startCPRMetronome() {
    if (cprRunning) return;
    cprRunning = true;
    document.getElementById('cpr-start-btn').textContent = '⏸ PAUSE';
    cprInterval = setInterval(() => {
        cprCount++;
        const counter = document.getElementById('cpr-counter');
        if (counter) counter.textContent = cprCount;
        const heart = document.getElementById('cpr-heart');
        if (heart) { heart.classList.remove('beat'); void heart.offsetWidth; heart.classList.add('beat'); }
        if (cprCount >= 30) {
            pauseCPR(); cprPhase = 'breathe'; cprRound++;
            updateCPRDisplay();
            speak(lang === 'hi' ? '2 बचाव सांसें दें।' : 'Give 2 rescue breaths.', lang);
        }
    }, 545);
}

function pauseCPR() {
    cprRunning = false; clearInterval(cprInterval);
    const btn = document.getElementById('cpr-start-btn');
    if (btn && cprPhase !== 'breathe') btn.textContent = t('cpr_start');
}

// ---- Bleeding ----
const bleedSteps = [
    { icon: '🤲', titleKey: 'bleed_s1_title', subKey: 'bleed_s1_sub' },
    { icon: '🚫', titleKey: 'bleed_s2_title', subKey: 'bleed_s2_sub' },
    { icon: '⬆️', titleKey: 'bleed_s3_title', subKey: 'bleed_s3_sub' },
    { icon: '🩹', titleKey: 'bleed_s4_title', subKey: 'bleed_s4_sub' },
    { icon: '📞', titleKey: 'bleed_s5_title', subKey: 'bleed_s5_sub' },
];
let bleedCurrent = 0;
function initBleeding() {
    bleedCurrent = 0; showScreen('bleeding'); renderBleedStep();
    speak(lang === 'hi' ? 'रक्तस्राव नियंत्रण।' : 'Bleeding control. Apply direct pressure now.', lang);
}
function renderBleedStep() { updateStepUI('bleed', bleedCurrent, bleedSteps.length, bleedSteps[bleedCurrent]); }

// ---- Burns ----
const burnsSteps = [
    { icon: '💧', titleKey: 'burns_s1_title', subKey: 'burns_s1_sub' },
    { icon: '👕', titleKey: 'burns_s2_title', subKey: 'burns_s2_sub' },
    { icon: '📦', titleKey: 'burns_s3_title', subKey: 'burns_s3_sub' },
    { icon: '🏥', titleKey: 'burns_s4_title', subKey: 'burns_s4_sub' },
];
let burnsCurrent = 0;
function initBurns() {
    burnsCurrent = 0; burnsSecondsLeft = 600; burnsTimerRunning = false;
    clearInterval(burnsTimerInterval); showScreen('burns');
    renderBurnsStep(); updateBurnsTimer();
    speak(lang === 'hi' ? 'जलने का इलाज। ठंडे पानी से ठंडा करें।' : 'Burns treatment. Cool with running water for 10 minutes.', lang);
}
function renderBurnsStep() { updateStepUI('burns', burnsCurrent, burnsSteps.length, burnsSteps[burnsCurrent]); }
function updateBurnsTimer() {
    const mins = Math.floor(burnsSecondsLeft / 60);
    const secs = burnsSecondsLeft % 60;
    const timeEl = document.getElementById('burns-time');
    if (timeEl) timeEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    const ring = document.getElementById('burns-ring');
    if (ring) ring.style.strokeDashoffset = 565.48 * (1 - burnsSecondsLeft / 600);
    const btn = document.getElementById('burns-timer-btn');
    if (btn) btn.textContent = burnsTimerRunning ? t('timer_stop') : t('timer_start');
}
function toggleBurnsTimer() {
    if (burnsTimerRunning) { clearInterval(burnsTimerInterval); burnsTimerRunning = false; }
    else {
        burnsSecondsLeft = 600; burnsTimerRunning = true;
        speak(lang === 'hi' ? '10 मिनट टाइमर शुरू।' : '10 minute timer started. Keep cool water running.', lang);
        burnsTimerInterval = setInterval(() => {
            burnsSecondsLeft--;
            updateBurnsTimer();
            if (burnsSecondsLeft === 0) {
                clearInterval(burnsTimerInterval); burnsTimerRunning = false;
                speak(lang === 'hi' ? '10 मिनट पूरे। अब जले को ढकें।' : '10 minutes complete. Now cover the burn.', lang);
            }
        }, 1000);
    }
    updateBurnsTimer();
}

// ---- Fracture ----
const fracSteps = [
    { icon: '🛑', titleKey: 'frac_s1_title', subKey: 'frac_s1_sub' },
    { icon: '🧣', titleKey: 'frac_s2_title', subKey: 'frac_s2_sub' },
    { icon: '📏', titleKey: 'frac_s3_title', subKey: 'frac_s3_sub' },
    { icon: '❄️', titleKey: 'frac_s4_title', subKey: 'frac_s4_sub' },
    { icon: '🏥', titleKey: 'frac_s5_title', subKey: 'frac_s5_sub' },
];
let fracCurrent = 0;
function initFracture() {
    fracCurrent = 0; showScreen('fracture'); renderFracStep();
    speak(lang === 'hi' ? 'फ्रैक्चर देखभाल।' : 'Fracture care. Do not move the person.', lang);
}
function renderFracStep() { updateStepUI('frac', fracCurrent, fracSteps.length, fracSteps[fracCurrent]); }

// ---- Choking ----
const chokingAdultSteps = [
    { icon: '🗣️', titleKey: 'choke_a1_title', subKey: 'choke_a1_sub' },
    { icon: '👐', titleKey: 'choke_a2_title', subKey: 'choke_a2_sub' },
    { icon: '✊', titleKey: 'choke_a3_title', subKey: 'choke_a3_sub' },
    { icon: '🔄', titleKey: 'choke_a4_title', subKey: 'choke_a4_sub' },
];
const chokingChildSteps = [
    { icon: '👁️', titleKey: 'choke_c1_title', subKey: 'choke_c1_sub' },
    { icon: '👐', titleKey: 'choke_c2_title', subKey: 'choke_c2_sub' },
    { icon: '👆', titleKey: 'choke_c3_title', subKey: 'choke_c3_sub' },
    { icon: '🔄', titleKey: 'choke_c4_title', subKey: 'choke_c4_sub' },
];
let chokingMode = 'adult'; let chokeCurrent = 0;
function initChoking() {
    chokeCurrent = 0; chokingMode = 'adult'; showScreen('choking'); renderChokeStep();
    speak(lang === 'hi' ? 'दम घुटने पर राहत।' : 'Choking response. Give back blows immediately.', lang);
}
function renderChokeStep() {
    const steps = chokingMode === 'adult' ? chokingAdultSteps : chokingChildSteps;
    updateStepUI('choke', chokeCurrent, steps.length, steps[Math.min(chokeCurrent, steps.length - 1)]);
    document.querySelectorAll('.choking-toggle-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === chokingMode);
    });
}
function switchChokingMode(mode) { chokingMode = mode; chokeCurrent = 0; renderChokeStep(); }

// ---- Generic step renderer ----
function updateStepUI(prefix, current, total, step) {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set(`${prefix}-step-num`, `STEP ${current + 1} OF ${total}`);
    set(`${prefix}-step-icon`, step.icon);
    set(`${prefix}-step-title`, t(step.titleKey));
    set(`${prefix}-step-sub`, t(step.subKey));
    const prevBtn = document.getElementById(`${prefix}-prev`);
    const nextBtn = document.getElementById(`${prefix}-next`);
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.textContent = current === total - 1 ? '✅ Done' : 'Next →';
    const dotsEl = document.getElementById(`${prefix}-dots`);
    if (dotsEl) {
        dotsEl.innerHTML = Array.from({ length: total }, (_, i) =>
            `<div class="step-dot ${i === current ? 'active' : ''}"></div>`).join('');
    }
    speak(t(step.titleKey) + '. ' + t(step.subKey), lang);
}

// ---- Profile ----
function initProfile() {
    showScreen('profile');
    document.getElementById('prof-name').value = user.name || '';
    document.getElementById('prof-email').value = user.email || '';
    document.getElementById('prof-phone').value = user.phone || '';
    document.getElementById('prof-allergies').value = user.allergies || '';
    document.getElementById('prof-contact').value = user.contact || '';
    const av = document.getElementById('prof-avatar');
    if (av) av.textContent = (user.name || 'U')[0].toUpperCase();
    document.querySelectorAll('.blood-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.blood === (user.bloodGroup || 'A+'));
    });
}
async function saveProfile() {
    user.name = document.getElementById('prof-name').value || 'User';
    user.phone = document.getElementById('prof-phone').value;
    user.allergies = document.getElementById('prof-allergies').value;
    user.contact = document.getElementById('prof-contact').value;
    await saveUser(user);
    showDashboard();
}

// ---- Settings ----
function initSettings() {
    showScreen('settings');
    document.querySelectorAll('.lang-btn').forEach(btn => { btn.classList.toggle('active', btn.dataset.lang === lang); });
    const voiceToggle = document.getElementById('voice-toggle');
    if (voiceToggle) voiceToggle.classList.toggle('on', voiceOn);
}
async function toggleVoice() {
    voiceOn = !voiceOn; setVoiceEnabled(voiceOn);
    await saveSetting('voice', voiceOn);
    const toggle = document.getElementById('voice-toggle');
    if (toggle) toggle.classList.toggle('on', voiceOn);
}
async function switchLang(l) {
    lang = l; setLanguage(l); await saveSetting('lang', l); applyTranslations();
    document.querySelectorAll('.lang-btn').forEach(btn => { btn.classList.toggle('active', btn.dataset.lang === l); });
}

// ---- Disaster Mode ----
function showDisasterMode() { document.getElementById('disaster-overlay').classList.add('active'); }
function hideDisasterMode() { document.getElementById('disaster-overlay').classList.remove('active'); }

// ---- Event delegation ----
document.addEventListener('click', async (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;

    switch (action) {
        // Auth
        case 'auth-tab': switchAuthTab(el.dataset.tab); break;
        case 'do-register': await doRegister(); break;
        case 'do-login': await doLogin(); break;

        // Nav
        case 'go-dashboard': showDashboard(); break;
        case 'go-profile': initProfile(); break;
        case 'go-settings': initSettings(); break;
        case 'go-cpr': initCPR(); break;
        case 'go-bleeding': initBleeding(); break;
        case 'go-burns': initBurns(); break;
        case 'go-fracture': initFracture(); break;
        case 'go-choking': initChoking(); break;
        case 'go-back': stopSpeaking(); showDashboard(); break;

        // CPR
        case 'cpr-toggle': toggleCPR(); break;
        case 'cpr-stop': pauseCPR(); stopSpeaking(); showDashboard(); break;

        // Bleeding
        case 'bleed-next':
            if (bleedCurrent < bleedSteps.length - 1) { bleedCurrent++; renderBleedStep(); }
            else { stopSpeaking(); showDashboard(); }
            break;
        case 'bleed-prev': if (bleedCurrent > 0) { bleedCurrent--; renderBleedStep(); } break;

        // Burns
        case 'burns-next':
            if (burnsCurrent < burnsSteps.length - 1) { burnsCurrent++; renderBurnsStep(); }
            else { stopSpeaking(); showDashboard(); }
            break;
        case 'burns-prev': if (burnsCurrent > 0) { burnsCurrent--; renderBurnsStep(); } break;
        case 'burns-timer': toggleBurnsTimer(); break;

        // Fracture
        case 'frac-next':
            if (fracCurrent < fracSteps.length - 1) { fracCurrent++; renderFracStep(); }
            else { stopSpeaking(); showDashboard(); }
            break;
        case 'frac-prev': if (fracCurrent > 0) { fracCurrent--; renderFracStep(); } break;

        // Choking
        case 'choke-mode': switchChokingMode(el.dataset.mode); break;
        case 'choke-next':
            const steps = chokingMode === 'adult' ? chokingAdultSteps : chokingChildSteps;
            if (chokeCurrent < steps.length - 1) { chokeCurrent++; renderChokeStep(); }
            else { stopSpeaking(); showDashboard(); }
            break;
        case 'choke-prev': if (chokeCurrent > 0) { chokeCurrent--; renderChokeStep(); } break;

        // Profile
        case 'save-profile': await saveProfile(); break;
        case 'blood-select':
            user.bloodGroup = el.dataset.blood;
            document.querySelectorAll('.blood-btn').forEach(b => b.classList.toggle('active', b.dataset.blood === el.dataset.blood));
            break;

        // Settings
        case 'toggle-voice': await toggleVoice(); break;
        case 'switch-lang': await switchLang(el.dataset.lang); break;
        case 'show-disaster': showDisasterMode(); break;
        case 'dismiss-disaster': hideDisasterMode(); break;
        case 'logout':
            await setLoggedIn(false); stopSpeaking();
            const registered = await isRegistered();
            showAuthScreen(registered ? 'login' : 'register');
            break;
    }
});

// ---- Init ----
initSplash();
