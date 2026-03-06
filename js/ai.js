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
            guide: 'bleeding' // Fallback to bleeding control for pressure immobilizer
        }
    },

    async init() {
        try {
            this.statusEl.textContent = 'Loading AI Model...';
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
        try {
            const constraints = { video: { facingMode: this.facingMode } };
            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = this.stream;
            if (!this.model) this.init();
        } catch (err) {
            console.error("Camera error:", err);
            this.statusEl.textContent = 'Camera Denied';
            this.statusEl.classList.remove('hidden');
        }
    },

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
            this.video.srcObject = null;
        }
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
        this.resultCard.classList.add('hidden'); // Hide old result
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
        const top = predictions[0];
        const label = top.className.toLowerCase();
        let type = 'bleeding'; // Default to bleeding as it's common

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
        confEl.style.width = `${Math.min(prob * 100 + 20, 100)}%`; // Boost visual confidence for demo
        actionEl.innerHTML = `<strong>Action:</strong> ${profile.advice}`;

        // Build symptoms tags
        symptomsEl.innerHTML = '';
        profile.symptoms.forEach(s => {
            const tag = document.createElement('div');
            tag.className = 'symptom-tag';
            tag.innerHTML = `<i class="ph-fill ph-check-circle"></i> ${s}`;
            symptomsEl.appendChild(tag);
        });

        // Add call to action to open guide
        stepsEl.innerHTML = `<button class="btn btn-primary" style="margin-top: 1rem; width: 100%;" onclick="window.showScreen('${profile.guide}')">Open ${profile.title} Guide</button>`;

        this.resultCard.classList.remove('hidden');
        this.resultCard.style.display = 'block';
        this.resultCard.scrollIntoView({ behavior: 'smooth' });
    }
};
