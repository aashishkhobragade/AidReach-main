document.addEventListener('DOMContentLoaded', () => {
    
    // --- Screen Navigation Logic ---
    const screens = {
        auth: document.getElementById('screen-auth'),
        dashboard: document.getElementById('screen-dashboard'),
        settings: document.getElementById('screen-settings')
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
        toggle.addEventListener('click', function() {
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
        item.addEventListener('click', function() {
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

});
