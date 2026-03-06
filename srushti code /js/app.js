// Main Application Logic
const app = {
    init() {
        this.bindNavigation();
        this.bindSOS();
        this.registerServiceWorker();
    },

    bindNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const views = document.querySelectorAll('.view');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('data-target');

                // Update nav state
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                // Update view state
                views.forEach(view => {
                    if (view.id === targetId) {
                        view.classList.remove('hidden');
                        view.classList.add('active');
                    } else {
                        view.classList.add('hidden');
                        view.classList.remove('active');
                    }
                });

                // Re-calculate map size if map view is opened
                if (targetId === 'view-map' && window.mapInstance) {
                    setTimeout(() => {
                        window.mapInstance.invalidateSize();
                    }, 100);
                }

                // Stop camera if navigating away from scan
                if (targetId !== 'view-scan' && window.aiScanner) {
                    window.aiScanner.stopCamera();
                } else if (targetId === 'view-scan' && window.aiScanner) {
                    window.aiScanner.startCamera();
                }
            });
        });
    },

    bindSOS() {
        const sosBtn = document.getElementById('sos-btn');
        sosBtn.addEventListener('click', () => {
            if (confirm('Are you in immediate danger? Call emergency services now (112 / 911 / 999).')) {
                // In a real app, this could initiate a call or send SMS.
                window.location.href = "tel:112";
            }
        });
    },

    guidesData: {
        snake: {
            title: "Snake Bite First Aid",
            icon: "ph-bug",
            color: "var(--color-snake)",
            steps: [
                { title: "Stay Calm & Still", desc: "Keep the person calm. Movement accelerates venom spread." },
                { title: "Immobilize", desc: "Keep the bitten area below heart level if possible. Do not tie a tight tourniquet." },
                { title: "Clean Gently", desc: "Wipe area with damp cloth. Do NOT wash vigorously or attempt to suck venom out." },
                { title: "Seek Help", desc: "Get to a hospital immediately carrying the victim if possible." }
            ]
        },
        burn: {
            title: "Burn First Aid",
            icon: "ph-fire",
            color: "var(--color-burn)",
            steps: [
                { title: "Cool with Water", desc: "Hold under cool (not cold) running water for 10-20 minutes." },
                { title: "Remove Restraints", desc: "Remove rings, tight items quickly before swelling starts." },
                { title: "Cover the Burn", desc: "Use a sterile, non-fluffy dressing or cling film. Avoid ointments or butter." },
                { title: "Monitor", desc: "If burn is larger than hand-size or on face/joints, seek medical help." }
            ]
        },
        cut: {
            title: "Cuts & Bleeding",
            icon: "ph-drop",
            color: "var(--color-cut)",
            steps: [
                { title: "Apply Pressure", desc: "Press firmly on the wound with a clean cloth." },
                { title: "Elevate", desc: "Raise the injured area above the heart if possible." },
                { title: "Clean Wound", desc: "Once bleeding slows, gently clean the wound area with clean water." },
                { title: "Bandage", desc: "Apply sterile dressing. If blood soaks through, add another layer on top." }
            ]
        },
        fracture: {
            title: "Fractures",
            icon: "ph-bone",
            color: "var(--color-fracture)",
            steps: [
                { title: "Do NOT Move", desc: "Keep the injured limb entirely still. Don't try to realign it." },
                { title: "Stop Bleeding", desc: "If there's an open wound, apply gentle pressure around the bone." },
                { title: "Apply Splint", desc: "Use folded paper, wood, or pillows to restrict movement." },
                { title: "Ice Pack", desc: "Apply ice wrapped in cloth to reduce swelling." }
            ]
        }
    },

    openGuide(type) {
        const data = this.guidesData[type];
        if (!data) return;

        const modal = document.getElementById('guide-modal');
        const content = document.getElementById('guide-content');

        let stepsHTML = `<div style="text-align:center; color:${data.color}">
            <i class="ph ${data.icon} guide-icon"></i>
            <h2 style="margin-bottom: 2rem; color: white;">${data.title}</h2>
        </div>`;

        data.steps.forEach((step, index) => {
            stepsHTML += `
                <div class="guide-step">
                    <div class="step-number" style="background:${data.color}">${index + 1}</div>
                    <div class="step-content">
                        <h4>${step.title}</h4>
                        <p>${step.desc}</p>
                    </div>
                </div>
            `;
        });

        content.innerHTML = stepsHTML;
        modal.classList.remove('hidden');
    },

    closeModal() {
        const modal = document.getElementById('guide-modal');
        modal.classList.add('hidden');
    },

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(registration => {
                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    })
                    .catch(err => {
                        console.log('ServiceWorker registration failed: ', err);
                    });
            });
        }
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});