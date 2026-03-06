// PWA Service Worker Registration for Offline Support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('ServiceWorker registered successfully:', reg.scope))
            .catch(err => console.error('ServiceWorker registration failed:', err));
    });
}

document.addEventListener('DOMContentLoaded', () => {

    // --- Screen Navigation Logic ---
    const screens = {
        auth: document.getElementById('screen-auth'),
        dashboard: document.getElementById('screen-dashboard'),
        settings: document.getElementById('screen-settings'),
        bleeding: document.getElementById('screen-bleeding'),
        burns: document.getElementById('screen-burns'),
        cpr: document.getElementById('screen-cpr'),
        fracture: document.getElementById('screen-fracture'),
        choking: document.getElementById('screen-choking'),
        scan: document.getElementById('screen-scan'),
        map: document.getElementById('screen-map')
    };

    const bottomNav = document.getElementById('bottom-nav');

    function showScreen(screenId) {
        // Hide all screens
        Object.values(screens).forEach(screen => {
            if (screen) screen.classList.remove('active');
        });

        // Show requested screen
        if (screens[screenId]) {
            screens[screenId].classList.add('active');
        }

        // Trigger screen-specific logic
        if (screenId === 'map' && window.initMap) {
            if (!window.mapInstance) {
                setTimeout(window.initMap, 300);
            } else {
                setTimeout(() => window.mapInstance.invalidateSize(), 150);
            }
        }

        if (screenId === 'scan' && window.aiScanner && window.aiScanner.startCamera) {
            window.aiScanner.startCamera();
        } else if (window.aiScanner && window.aiScanner.stopCamera) {
            window.aiScanner.stopCamera();
        }

        // Toggle bottom nav visibility
        if (screenId === 'auth') {
            if (bottomNav) bottomNav.style.display = 'none';
        } else {
            if (bottomNav) bottomNav.style.display = 'flex';
        }
    }

    // --- Auth Screen Logic ---
    const tabLogin = document.getElementById('tab-btn-login');
    const tabRegister = document.getElementById('tab-btn-register');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');

    if (tabLogin && tabRegister) {
        tabLogin.addEventListener('click', () => {
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            formLogin.style.display = 'flex';
            formRegister.style.display = 'none';
        });

        tabRegister.addEventListener('click', () => {
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            formRegister.style.display = 'flex';
            formLogin.style.display = 'none';
        });
    }

    // Login/Register Buttons (Mock actions)
    document.getElementById('btn-do-login')?.addEventListener('click', () => {
        // In real app, authenticate user here
        showScreen('dashboard');
    });

    document.getElementById('btn-do-register')?.addEventListener('click', () => {
        // In real app, register user here
        showScreen('dashboard');
    });

    document.getElementById('btn-guest')?.addEventListener('click', () => {
        showScreen('dashboard');
    });

    document.getElementById('btn-logout')?.addEventListener('click', () => {
        showScreen('auth');
    });

    // --- Settings Navigation ---
    document.getElementById('btn-to-settings')?.addEventListener('click', () => {
        showScreen('settings');
    });

    document.getElementById('btn-back-settings')?.addEventListener('click', () => {
        showScreen('dashboard');
    });

    // --- Settings Toggles ---
    const toggles = document.querySelectorAll('.toggle-switch');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            this.classList.toggle('active');

            // Handle Dark Mode toggle explicitly
            if (this.id === 'toggle-dark') {
                if (this.classList.contains('active')) {
                    document.documentElement.style.setProperty('--background', '#0F172A');
                    document.documentElement.style.setProperty('--surface', '#1E293B');
                    document.documentElement.style.setProperty('--text-main', '#F8FAFC');
                    document.documentElement.style.setProperty('--text-muted', '#94A3B8');
                } else {
                    document.documentElement.style.setProperty('--background', '#F8FAFC');
                    document.documentElement.style.setProperty('--surface', '#FFFFFF');
                    document.documentElement.style.setProperty('--text-main', '#0F172A');
                    document.documentElement.style.setProperty('--text-muted', '#64748B');
                }
            }
        });
    });

    // --- Bottom Nav Buttons interactively (Mock) ---
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            // Remove active from all
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active to clicked
            this.classList.add('active');

            // Specific routing if we had multiple views
            const target = this.getAttribute('data-target');
            if (target === 'screen-dashboard') {
                showScreen('dashboard');
            }
        });
    });

    // --- AI Voice Bot Modal ---
    const btnAiBot = document.getElementById('btn-ai-bot');
    const aiModal = document.getElementById('ai-modal');
    const btnCloseAi = document.getElementById('btn-close-ai');

    if (btnAiBot && aiModal) {
        btnAiBot.addEventListener('click', () => {
            aiModal.style.display = 'flex';
            window.speak("I am AidReach AI. How can I help you today?");
        });
        if (btnCloseAi) {
            btnCloseAi.addEventListener('click', () => {
                aiModal.style.display = 'none';
                window.stopSpeaking();
            });
        }
    }

    // --- Language Selection Modal ---
    const langModal = document.getElementById('lang-modal');
    const btnCloseLang = document.getElementById('btn-close-lang');
    const langGrid = document.getElementById('lang-grid');

    if (langGrid && window.indicLanguages) {
        langGrid.innerHTML = '';
        window.indicLanguages.forEach(lang => {
            const btn = document.createElement('button');
            btn.className = 'lang-btn';
            if (lang.code === window.currentLangCode) btn.classList.add('active');
            btn.textContent = lang.name;

            btn.addEventListener('click', () => {
                // Remove active class from all
                document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Set application language and API configuration
                if (window.setLanguage) window.setLanguage(lang.code);

                // Provide visual feedback and close modal
                alert(`Language set to: ${lang.name}`);
                langModal.style.display = 'none';
            });

            langGrid.appendChild(btn);
        });
    }

    // We bind the Profile tab to open language selection for now
    const profileBtn = document.querySelector('.nav-item[data-target="#"]:last-child');
    if (profileBtn && langModal) {
        profileBtn.addEventListener('click', () => {
            langModal.style.display = 'flex';
        });
        if (btnCloseLang) btnCloseLang.addEventListener('click', () => langModal.style.display = 'none');
    }

    // --- Emergency SOS button animate (Mock interaction) ---
    const sosBtn = document.getElementById('btn-sos');
    if (sosBtn) {
        sosBtn.addEventListener('click', () => {
            sosBtn.innerHTML = '<i class="ph-fill ph-spinner-gap sos-icon" style="animation: spin 1s linear infinite;"></i><div class="sos-text">CALLING</div>';

            // Add keyframe for spin dynamically or assume it exists
            if (!document.getElementById('spin-style')) {
                const style = document.createElement('style');
                style.id = 'spin-style';
                style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
                document.head.appendChild(style);
            }

            setTimeout(() => {
                sosBtn.innerHTML = '<i class="ph-fill ph-warning-octagon sos-icon"></i><div class="sos-text">EMERGENCY</div><div style="font-size: 0.8rem; opacity: 0.9;">HELP</div>';
                alert('Emergency contacts notified and SOS triggered!');
            }, 3000);
        });
    }

    // --- Emergency Guides Navigation ---
    document.querySelectorAll('[data-action="open-scan"], .nav-item[data-target="screen-scan"]').forEach(el => el.addEventListener('click', () => showScreen('scan')));
    document.querySelectorAll('[data-action="open-map"], .nav-item[data-target="screen-map"]').forEach(el => el.addEventListener('click', () => { showScreen('map'); if (window.initMap) window.initMap(); }));

    document.querySelectorAll('.emg-card.bleeding').forEach(el => el.addEventListener('click', () => { showScreen('bleeding'); initBleeding(); }));
    document.querySelectorAll('.emg-card.burns').forEach(el => el.addEventListener('click', () => { showScreen('burns'); initBurns(); }));
    document.querySelectorAll('.emg-card.heart').forEach(el => el.addEventListener('click', () => { showScreen('cpr'); initCPR(); }));
    document.querySelectorAll('.emg-card.fracture').forEach(el => el.addEventListener('click', () => { showScreen('fracture'); initFracture(); }));
    document.querySelectorAll('.emg-card.breath').forEach(el => el.addEventListener('click', () => { showScreen('choking'); initChoking(); }));

    document.querySelectorAll('[data-action="go-back"]').forEach(btn => {
        btn.addEventListener('click', () => {
            // Stop speaking when going back
            stopSpeaking();
            if (window.cprInterval) { clearInterval(window.cprInterval); window.cprInterval = null; }
            if (window.burnsInterval) { clearInterval(window.burnsInterval); window.burnsInterval = null; }
            showScreen('dashboard');
        });
    });

    // ==========================================
    // STEP-BY-STEP LOGIC
    // ==========================================

    function setupSteps(prefix, steps) {
        let currentStep = 0;
        const domTitle = document.getElementById(`${prefix}-step-title`);
        const domSub = document.getElementById(`${prefix}-step-sub`);
        const domIcon = document.getElementById(`${prefix}-step-icon`);
        const domNum = document.getElementById(`${prefix}-step-num`);
        const domDots = document.getElementById(`${prefix}-dots`);
        const btnPrev = document.getElementById(`${prefix}-prev`);
        const btnNext = document.getElementById(`${prefix}-next`);

        function render() {
            const step = steps[currentStep];
            if (domTitle) domTitle.textContent = step.title;
            if (domSub) domSub.textContent = step.desc;
            if (domIcon) domIcon.textContent = step.icon;
            if (domNum) domNum.textContent = `STEP ${currentStep + 1} OF ${steps.length}`;

            if (domDots) {
                domDots.innerHTML = '';
                steps.forEach((_, i) => {
                    const d = document.createElement('div');
                    d.className = `step-dot ${i === currentStep ? 'active' : ''}`;
                    domDots.appendChild(d);
                });
            }

            if (btnPrev) btnPrev.style.visibility = (currentStep === 0) ? 'hidden' : 'visible';
            if (btnNext) btnNext.textContent = (currentStep === steps.length - 1) ? 'Finish' : 'Next →';

            speak(step.desc);
        }

        if (btnPrev) btnPrev.onclick = () => { if (currentStep > 0) { currentStep--; render(); } };
        if (btnNext) btnNext.onclick = () => {
            if (currentStep < steps.length - 1) { currentStep++; render(); }
            else { showScreen('dashboard'); stopSpeaking(); }
        };

        return () => { currentStep = 0; render(); };
    }

    const initBleeding = setupSteps('bleed', [
        { title: "Apply Pressure", desc: "Apply firm, direct pressure over the wound using a clean cloth or hands.", icon: "🤲" },
        { title: "Elevate", desc: "Raise the injured area above the heart if possible.", icon: "⬆️" },
        { title: "Bandage", desc: "Wrap tightly with a bandage, keeping the pressure steady.", icon: "🩹" },
        { title: "Check Signs", desc: "Check for paleness, cold skin, or confusion (shock).", icon: "👁️" },
        { title: "Seek Help", desc: "If bleeding doesn't stop or is severe, call emergency services immediately.", icon: "🚑" }
    ]);

    const initFracture = setupSteps('frac', [
        { title: "Do NOT Move", desc: "Keep the person completely still. Do not try to straighten or reposition the injured limb.", icon: "🛑" },
        { title: "Immobilize", desc: "Support the injury in the position found. You can use a rolled up magazine or rigid cardboard as a temporary splint if necessary.", icon: "🩹" },
        { title: "Apply Ice", desc: "Apply an ice pack wrapped in a cloth to reduce swelling for 10 minutes at a time.", icon: "🧊" },
        { title: "Treat for Shock", desc: "Keep the person warm and comfortable while waiting for help.", icon: "🧥" },
        { title: "Get Medical Help", desc: "Do not move them yourself if it's a leg, pelvis, or back injury. Call an ambulance.", icon: "🚑" }
    ]);

    const initChoking = setupSteps('choke', [
        { title: "Assess", desc: "Ask 'Are you choking?'. If they cannot cough loudly or breathe, act immediately.", icon: "🗣️" },
        { title: "5 Back Blows", desc: "Stand behind, support their chest with one hand, lean them forward, and give 5 sharp blows between the shoulder blades.", icon: "👋" },
        { title: "5 Abdominal Thrusts", desc: "Stand behind, make a fist above their navel, grasp fist with other hand, and give 5 quick upward thrusts.", icon: "🤜" },
        { title: "Repeat", desc: "Alternate 5 back blows and 5 abdominal thrusts until the object is dislodged.", icon: "🔄" }
    ]);

    let initBurns = () => {
        const startState = setupSteps('burns', [
            { title: "Cool with Water", desc: "Run cool, NOT cold, running water over the burn for at least 10 minutes.", icon: "💧" },
            { title: "Remove Items", desc: "Carefully remove any tight clothing or jewelry from the burned area before it swells.", icon: "👕" },
            { title: "Cover Wound", desc: "Cover the burn loosely with sterile non-stick gauze or a clean cloth. Do not use ice or ointments.", icon: "🩹" },
            { title: "Monitor", desc: "Watch for signs of shock and seek medical attention for severe burns or burns larger than the victim's hand.", icon: "👀" }
        ]);
        startState();

        const tRing = document.getElementById('burns-ring');
        const tTime = document.getElementById('burns-time');
        const tBtn = document.getElementById('burns-timer-btn');
        let timeLeft = 600; // 10 mins
        const fullDash = 565.48;

        if (tBtn) {
            tBtn.onclick = () => {
                if (window.burnsInterval) return;
                tBtn.textContent = 'TIMER RUNNING...';
                speak("Cooling timer started for 10 minutes.");
                window.burnsInterval = setInterval(() => {
                    timeLeft--;
                    const m = Math.floor(timeLeft / 60);
                    const s = timeLeft % 60;
                    if (tTime) tTime.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
                    if (tRing) tRing.style.strokeDashoffset = fullDash - ((timeLeft / 600) * fullDash);

                    if (timeLeft <= 0) {
                        clearInterval(window.burnsInterval);
                        window.burnsInterval = null;
                        if (tTime) tTime.textContent = "0:00";
                        if (tBtn) tBtn.textContent = "START 10-MIN TIMER";
                        speak("10 minutes cooling completed. Proceed to next step.");
                    }
                }, 1000);
            };
        }
    };

    let initCPR = () => {
        const btnStart = document.getElementById('cpr-start-btn');
        const heart = document.getElementById('cpr-heart');
        const countTxt = document.getElementById('cpr-counter');
        const instrTxt = document.getElementById('cpr-instruction');
        let count = 0;
        let isRunning = false;

        if (btnStart) {
            btnStart.textContent = "START CPR";
            if (countTxt) countTxt.textContent = "0";
            if (instrTxt) instrTxt.textContent = "Get ready...";
            stopSpeaking();

            btnStart.onclick = () => {
                if (isRunning) {
                    isRunning = false;
                    clearInterval(window.cprInterval);
                    btnStart.textContent = "RESUME CPR";
                    stopSpeaking();
                } else {
                    isRunning = true;
                    btnStart.textContent = "PAUSE CPR";
                    speak("Starting CPR. Push hard, and fast. Follow the beat.");

                    const intervalMs = Math.round(60000 / 110); // 110 BPM
                    window.cprInterval = setInterval(() => {
                        count++;
                        if (countTxt) countTxt.textContent = count;
                        if (heart) {
                            heart.classList.add('beat');
                            setTimeout(() => heart.classList.remove('beat'), 100);
                        }

                        if (count % 30 === 0) {
                            speak("Give 2 rescue breaths.");
                        } else if (count % 10 === 0) {
                            speak(count.toString());
                        }

                    }, intervalMs);
                }
            };
        }
    };

});
