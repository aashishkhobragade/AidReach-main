// AI Scanner Logic using TensorFlow.js and MobileNet
window.aiScanner = {
    model: null,
    video: document.getElementById('camera-feed'),
    canvas: document.getElementById('camera-canvas'),
    statusEl: document.getElementById('ai-status'),
    captureBtn: document.getElementById('capture-btn'),
    switchBtn: document.getElementById('switch-camera-btn'),
    resultCard: document.getElementById('ai-result'),
    stream: null,
    facingMode: 'environment',

    // Mapping of predicted classes to Symptoms and Advice
    injuryProfiles: {
        'bleeding': {
            title: 'Active Bleeding',
            symptoms: ['Open wound', 'Red fluid discharge', 'Skin break'],
            advice: 'Apply direct pressure with a clean cloth immediately.',
            icon: '🩸',
            guide: 'bleeding'
        },
        'burn': {
            title: 'Skin Burn',
            symptoms: ['Redness', 'Blistering', 'Skin irritation'],
            advice: 'Run cool (not cold) water over the area for 10 minutes.',
            icon: '🔥',
            guide: 'burns'
        },
        'fracture': {
            title: 'Possible Fracture',
            symptoms: ['Deformity', 'Swelling', 'Inability to move limb'],
            advice: 'Do not move the limb. Immobilize it as found.',
            icon: '🦴',
            guide: 'fracture'
        },
        'snake': {
            title: 'Snake Bite',
            symptoms: ['Puncture marks', 'Swelling', 'Pain'],
            advice: 'Keep the limb still and below heart level. Seek help.',
            icon: '🐍',
            guide: 'bleeding' // Fallback to bleeding control
        }
    },

    async init() {
        // First check if we are in a secure context (HTTPS/localhost)
        // Camera access is blocked by browsers on non-secure origins
        if (!window.isSecureContext && location.protocol !== 'file:') {
            this.statusEl.textContent = '❌ HTTPS Required for Camera';
            this.statusEl.classList.remove('hidden');
            this.statusEl.style.background = 'rgba(229, 57, 53, 0.9)';
            return;
        }

        try {
            this.statusEl.textContent = 'Loading AI Model...';
            this.statusEl.classList.remove('hidden');

            // MobileNet is loaded via CDN in index.html, available globally
            this.model = await mobilenet.load();
            this.statusEl.textContent = 'AI Ready';
            setTimeout(() => this.statusEl.classList.add('hidden'), 2000);
            this.captureBtn.disabled = false;
            this.bindEvents();
        } catch (error) {
            console.error("Model load error:", error);
            this.statusEl.textContent = 'Model Load Failed';
        }
    },

    bindEvents() {
        if (this.captureBtn) this.captureBtn.onclick = () => this.analyzeFrame();
        if (this.switchBtn) this.switchBtn.onclick = () => this.toggleCamera();
    },

    async startCamera() {
        if (this.stream) return;

        this.statusEl.textContent = 'Starting Camera...';
        this.statusEl.classList.remove('hidden');

        try {
            // Robust constraints for mobile devices
            const constraints = {
                video: {
                    facingMode: this.facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = this.stream;

            // Wait for video to be ready
            this.video.onloadedmetadata = () => {
                this.video.play();
                this.statusEl.classList.add('hidden');
            };

            if (!this.model) this.init();
        } catch (err) {
            console.error("Camera error:", err);
            if (err.name === 'NotAllowedError') {
                this.statusEl.textContent = '❌ Camera Permission Denied';
            } else if (err.name === 'NotFoundError') {
                this.statusEl.textContent = '❌ No Camera Found';
            } else {
                this.statusEl.textContent = '❌ Camera Error: ' + err.name;
            }
            this.statusEl.classList.remove('hidden');
            this.statusEl.style.background = 'rgba(229, 57, 53, 0.9)';
        }
    },

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
            this.video.srcObject = null;
        }
        this.statusEl.classList.add('hidden');
    },

    toggleCamera() {
        this.facingMode = this.facingMode === 'environment' ? 'user' : 'environment';
        this.stopCamera();
        this.startCamera();
    },

    async analyzeFrame() {
        if (!this.model) return;
        this.statusEl.textContent = 'Analyzing...';
        this.statusEl.classList.remove('hidden');
        this.resultCard.classList.add('hidden');
        this.captureBtn.disabled = true;

        const context = this.canvas.getContext('2d');
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

        try {
            const predictions = await this.model.classify(this.canvas);
            this.processPredictions(predictions);
        } catch (err) {
            console.error(err);
            this.statusEl.textContent = 'Analysis Failed';
        } finally {
            this.captureBtn.disabled = false;
            setTimeout(() => this.statusEl.classList.add('hidden'), 1000);
        }
    },

    processPredictions(predictions) {
        if (!predictions || predictions.length === 0) return;

        const top = predictions[0];
        const label = top.className.toLowerCase();
        let type = 'bleeding';

        if (label.includes('fire') || label.includes('burn') || label.includes('hot')) type = 'burn';
        if (label.includes('bone') || label.includes('stick') || label.includes('crack')) type = 'fracture';
        if (label.includes('snake') || label.includes('reptile')) type = 'snake';
        if (label.includes('blood') || label.includes('cut') || label.includes('knife')) type = 'bleeding';

        this.displayResult(type, top.probability);
    },

    displayResult(type, prob) {
        const profile = this.injuryProfiles[type];
        const titleEl = document.getElementById('result-title');
        const confEl = document.getElementById('result-confidence');
        const actionEl = document.getElementById('result-action');
        const symptomsEl = document.getElementById('result-symptoms');
        const stepsEl = document.getElementById('result-steps');

        titleEl.textContent = `${profile.icon} ${profile.title}`;
        confEl.style.width = `${Math.min(prob * 100 + 20, 100)}%`;
        actionEl.innerHTML = `<strong>Immediate Action:</strong> ${profile.advice}`;

        symptomsEl.innerHTML = '';
        profile.symptoms.forEach(s => {
            const tag = document.createElement('div');
            tag.className = 'symptom-tag';
            tag.innerHTML = `<i class="ph-fill ph-check-circle"></i> ${s}`;
            symptomsEl.appendChild(tag);
        });

        stepsEl.innerHTML = `<button class="btn btn-primary" style="margin-top: 1.5rem; width: 100%; height: 50px; font-weight: 700;" onclick="window.showScreen('${profile.guide}')">OPEN FIRST AID GUIDE</button>`;

        this.resultCard.classList.remove('hidden');
        this.resultCard.style.display = 'block';

        // Ensure result is visible on smaller screens
        setTimeout(() => {
            this.resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
};
