// ============================================================
// AidReach - Voice Guidance Simulation
// ============================================================

let voiceEnabled = true;
let isSpeaking = false;
let utteranceQueue = [];
const synth = window.speechSynthesis;

export function setVoiceEnabled(val) {
    voiceEnabled = val;
    if (!val) { synth.cancel(); }
}

export function speak(text, lang = 'en') {
    if (!voiceEnabled) { showToast(text); return; }
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    utter.rate = 0.9;
    utter.volume = 1;
    utter.pitch = 1;
    showToast(text);
    synth.speak(utter);
}

function showToast(text) {
    const toast = document.getElementById('voice-toast');
    if (!toast) return;
    toast.querySelector('.voice-text').textContent = text;
    toast.classList.add('visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('visible'), 4000);
}

export function stopSpeaking() {
    synth.cancel();
}
