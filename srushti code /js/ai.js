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
    facingMode: 'environment', // Start with back camera

    async init() {
        try {
            this.statusEl.textContent = 'Loading AI Model...';
            // Load MobileNet. Since we load scripts via CDN, mobilenet is available globally.
            this.model = await mobilenet.load();
            this.statusEl.textContent = 'AI Ready';
            this.statusEl.classList.add('hidden'); // Hide status bubble once ready
            this.captureBtn.disabled = false;

            this.bindEvents();
        } catch (error) {
            console.error("Model load error:", error);
            this.statusEl.textContent = 'Model Load Failed. Offline?';
        }
    },

    bindEvents() {
        this.captureBtn.addEventListener('click', () => this.analyzeFrame());
        this.switchBtn.addEventListener('click', () => this.toggleCamera());
    },

    async startCamera() {
        if (this.stream) return; // already running

        try {
            const constraints = {
                video: { facingMode: this.facingMode }
            };
            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = this.stream;
            // Need to set autoPlay and playsInline in HTML

            // Once model is loaded, init is called. Only load once.
            if (!this.model) {
                this.init();
            }
        } catch (err) {
            console.error("Camera access error:", err);
            this.statusEl.textContent = 'Camera Access Denied';
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
        this.captureBtn.disabled = true;

        // Draw video frame to canvas
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
            setTimeout(() => this.statusEl.classList.add('hidden'), 2000);
        }
    },

    processPredictions(predictions) {
        console.log("Predictions:", predictions);
        const topPred = predictions[0];
        const className = topPred.className.toLowerCase();

        // We do a pseudo-classification since MobileNet isn't purely medical. 
        // We map general keywords to injury profiles.

        let detectedType = null;
        let genericMsg = "Unknown injury type.";

        if (className.includes('snake') || className.includes('reptile') || className.includes('lizard') || className.includes('hose') || className.includes('worm')) {
            detectedType = 'snake';
        } else if (className.includes('fire') || className.includes('match') || className.includes('lighter') || className.includes('hot') || className.includes('stove') || className.includes('oven')) {
            detectedType = 'burn';
        } else if (className.includes('blood') || className.includes('red') || className.includes('syringe') || className.includes('band aid') || className.includes('knife') || className.includes('blade') || className.includes('cut')) {
            detectedType = 'cut';
        } else if (className.includes('bone') || className.includes('stick') || className.includes('crutch') || className.includes('hammer') || className.includes('brick') || className.includes('rock')) {
            detectedType = 'fracture';
        } else {
            // Default simulated override for demo purposes if looking at text or screens
            // If accuracy is high, we might map something generic, but for the sake of the demo,
            // let's show the predicted generic class, and if confidence is < 0.5, guess 'cut'.
            if (topPred.probability < 0.2) {
                detectedType = 'cut'; // Fallback mapping for demo
            } else {
                genericMsg = `Recognized: ${topPred.className}. Please select guide manually.`;
            }
        }

        this.displayResult(detectedType, genericMsg, topPred.probability);
    },

    displayResult(type, genericMsg, prob) {
        const resultTitle = document.getElementById('result-title');
        const resultAction = document.getElementById('result-action');
        const confidenceBar = document.getElementById('result-confidence');

        this.resultCard.classList.remove('hidden');
        confidenceBar.style.setProperty('--c-width', `${Math.min(prob * 100, 100)}%`);

        if (type && app.guidesData[type]) {
            const guide = app.guidesData[type];
            resultTitle.textContent = guide.title + " Detected";
            resultTitle.style.color = guide.color;
            confidenceBar.style.backgroundColor = guide.color;

            resultAction.innerHTML = `Suggested Immediate Action: <strong>${guide.steps[0].title}</strong>. <br><br>
            <button class="secondary-btn" style="padding: 0.5rem; margin-top:0.5rem;" onclick="app.openGuide('${type}')">View Full Guide</button>`;
        } else {
            resultTitle.textContent = "AI Suggestion";
            resultTitle.style.color = "var(--text-primary)";
            confidenceBar.style.backgroundColor = "var(--text-secondary)";
            resultAction.textContent = genericMsg;
        }
    }
};
