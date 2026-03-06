// ============================================================
// AidReach - Voice Guidance Simulation
// ============================================================

window.voiceEnabled = true;
window.isSpeaking = false;
window.utteranceQueue = [];
const synth = window.speechSynthesis;

window.setVoiceEnabled = function (val) {
    window.voiceEnabled = val;
    if (!val) { synth.cancel(); }
}

window.speak = function (text, lang = 'en') {
    if (!window.voiceEnabled) { showToast(text); return; }
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

window.stopSpeaking = function () {
    synth.cancel();
}
