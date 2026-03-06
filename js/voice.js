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

window.speak = async function (text, overrideLang = null) {
    if (!window.voiceEnabled) { showToast(text); return; }
    synth.cancel();

    let textToSpeak = text;
    let speakLang = overrideLang || window.currentLangCode || 'en-IN';

    // If the language is not English, translate the text on-the-fly using Sarvam AI
    if (speakLang !== 'en-IN' && window.SARVAM_API_KEY && window.SARVAM_BASE_URL) {
        try {
            const response = await fetch(`${window.SARVAM_BASE_URL}/translate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-subscription-key': window.SARVAM_API_KEY
                },
                body: JSON.stringify({
                    input: text,
                    source_language_code: "en-IN",
                    target_language_code: speakLang,
                    speaker_gender: "Female",
                    model: "sarvam-translate:v1"
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data && data.translated_text) {
                    textToSpeak = data.translated_text;
                }
            } else {
                console.error("Voice translation API error:", await response.text());
            }
        } catch (error) {
            console.error("Voice translation exception:", error);
        }
    }

    const utter = new SpeechSynthesisUtterance(textToSpeak);
    // Best-effort mapping for standard HTML5 Voices to match the Indic scripts
    utter.lang = speakLang.split('-')[0] + '-IN';
    utter.rate = 0.9;
    utter.volume = 1;
    utter.pitch = 1;

    showToast(textToSpeak);
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
