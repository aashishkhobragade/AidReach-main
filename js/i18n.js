// ============================================================
// AidReach - Translations (English + Hindi)
// ============================================================

window.SARVAM_API_KEY = "sk_rnuhsra0_WoDmZSaksmdpMIeEwqwxeTQa"; // from language.html
window.SARVAM_BASE_URL = "https://api.sarvam.ai";

window.indicLanguages = [
    { code: "hi-IN", name: "Andaman and Nicobar Islands" },
    { code: "te-IN", name: "Andhra Pradesh" },
    { code: "hi-IN", name: "Arunachal Pradesh" },
    { code: "as-IN", name: "Assam" },
    { code: "hi-IN", name: "Bihar" },
    { code: "pa-IN", name: "Chandigarh" },
    { code: "hi-IN", name: "Chhattisgarh" },
    { code: "gu-IN", name: "Dadra and Nagar Haveli" },
    { code: "hi-IN", name: "Delhi" },
    { code: "kok-IN", name: "Goa" },
    { code: "gu-IN", name: "Gujarat" },
    { code: "hi-IN", name: "Haryana" },
    { code: "hi-IN", name: "Himachal Pradesh" },
    { code: "ks-IN", name: "Jammu and Kashmir" },
    { code: "hi-IN", name: "Jharkhand" },
    { code: "kn-IN", name: "Karnataka" },
    { code: "ml-IN", name: "Kerala" },
    { code: "ur-IN", name: "Ladakh" },
    { code: "ml-IN", name: "Lakshadweep" },
    { code: "hi-IN", name: "Madhya Pradesh" },
    { code: "mr-IN", name: "Maharashtra" },
    { code: "mni-IN", name: "Manipur" },
    { code: "hi-IN", name: "Meghalaya" },
    { code: "hi-IN", name: "Mizoram" },
    { code: "hi-IN", name: "Nagaland" },
    { code: "od-IN", name: "Odisha" },
    { code: "ta-IN", name: "Puducherry" },
    { code: "pa-IN", name: "Punjab" },
    { code: "hi-IN", name: "Rajasthan" },
    { code: "ne-IN", name: "Sikkim" },
    { code: "ta-IN", name: "Tamil Nadu" },
    { code: "te-IN", name: "Telangana" },
    { code: "bn-IN", name: "Tripura" },
    { code: "hi-IN", name: "Uttar Pradesh" },
    { code: "hi-IN", name: "Uttarakhand" },
    { code: "bn-IN", name: "West Bengal" },
    { code: "en-IN", name: "English (Default)" }
];

window.translations = {
    en: {
        // Global
        app_name: 'AidReach',
        tagline: 'Works when the internet and doctors don\'t.',
        offline_active: 'OFFLINE MODE ACTIVE',
        // Login
        login_title: 'Enter Your PIN',
        login_sub: 'Your data stays on this device',
        login_trust: 'All data stored securely on device',
        login_first: 'Create a 4-digit PIN to get started',
        pin_error: 'Incorrect PIN. Try again.',
        // Dashboard
        greeting: 'Hello,',
        emergency_label: 'EMERGENCY',
        cpr: 'CPR',
        bleeding: 'Bleeding',
        burns: 'Burns',
        fracture: 'Fracture',
        choking: 'Choking',
        cpr_sub: 'Life-saving compressions',
        bleeding_sub: 'Control severe bleeding',
        burns_sub: '10-min cool water timer',
        fracture_sub: 'Immobilization steps',
        choking_sub: 'Adult & Child guidance',
        // CPR
        cpr_title: 'CPR Guide',
        cpr_start: 'START CPR',
        cpr_stop: 'STOP',
        cpr_instruction: 'Push HARD & FAST',
        cpr_sub_text: '2 inches deep · 110 BPM · Center of chest',
        cpr_count: 'Compression',
        cpr_breathe: 'Give 2 Rescue Breaths',
        cpr_breathe_sub: 'Tilt head back · Lift chin · Blow 1 second each',
        cpr_resume: 'Back to Compressions',
        // Bleeding
        bleeding_title: 'Bleeding Control',
        bleed_s1_title: 'Apply Direct Pressure',
        bleed_s1_sub: 'Use cloth, clothing or bandage. Press HARD with both hands.',
        bleed_s2_title: 'Do NOT Remove',
        bleed_s2_sub: 'Keep pressing. Add more cloth on top if it soaks through. Never remove.',
        bleed_s3_title: 'Elevate if Possible',
        bleed_s3_sub: 'Raise the injured limb above the heart to slow bleeding.',
        bleed_s4_title: 'Apply Tourniquet',
        bleed_s4_sub: 'If limb is bleeding: tie a strip 2 inches above wound. Twist until bleeding stops. Note the time.',
        bleed_s5_title: 'Call for Help',
        bleed_s5_sub: 'Keep pressure applied. Get emergency medical help immediately.',
        // Burns
        burns_title: 'Burns Treatment',
        burns_s1_title: 'Cool with Water',
        burns_s1_sub: 'Run cool (not cold) running water over burn for 10 minutes.',
        burns_s2_title: 'Remove Clothing',
        burns_s2_sub: 'Carefully remove clothing near burn. Do NOT remove if stuck to skin.',
        burns_s3_title: 'Cover Loosely',
        burns_s3_sub: 'Cover with clean cling film or non-fluffy material. Do NOT use ice or butter.',
        burns_s4_title: 'Seek Medical Help',
        burns_s4_sub: 'All burns larger than a palm or on face/hands/genitals need urgent care.',
        timer_label: 'minutes remaining',
        timer_start: 'START 10-MIN TIMER',
        timer_stop: 'Stop Timer',
        // Fracture
        fracture_title: 'Fracture Care',
        frac_s1_title: 'Do NOT Move',
        frac_s1_sub: 'Keep the person still. Do not straighten or reposition the injured limb.',
        frac_s2_title: 'Immobilize the Limb',
        frac_s2_sub: 'Pad and support with folded clothes, blanket, or makeshift splint.',
        frac_s3_title: 'Apply a Splint',
        frac_s3_sub: 'Tie rigid object (stick, board) alongside limb with cloth. Not too tight.',
        frac_s4_title: 'Manage Pain & Swelling',
        frac_s4_sub: 'Elevate injured area if possible. Apply wrapped ice pack for 20 min max.',
        frac_s5_title: 'Get Medical Help',
        frac_s5_sub: 'Do not give food or water (surgery may be needed). Transport carefully.',
        // Choking
        choking_title: 'Choking Relief',
        adult: 'Adult',
        child: 'Child (>1yr)',
        choke_a1_title: 'Ask: Are you choking?',
        choke_a1_sub: 'If cannot speak, cough or breathe — act immediately.',
        choke_a2_title: '5 Back Blows',
        choke_a2_sub: 'Lean them forward. Give 5 firm blows between shoulder blades with heel of hand.',
        choke_a3_title: '5 Abdominal Thrusts',
        choke_a3_sub: 'Stand behind, arms below ribs. Pull sharply inward and upward. Repeat 5 times.',
        choke_a4_title: 'Repeat Until Clear',
        choke_a4_sub: 'Alternate 5 back blows + 5 thrusts until food dislodges or person loses consciousness.',
        choke_c1_title: 'Check the Mouth',
        choke_c1_sub: 'Look inside mouth. Remove any visible object. Do NOT do a blind finger sweep.',
        choke_c2_title: '5 Back Blows',
        choke_c2_sub: 'Support chest. Give 5 firm back blows between shoulder blades.',
        choke_c3_title: '5 Chest Thrusts',
        choke_c3_sub: 'Place 2 fingers on breastbone (just below nipple line). Push inward and upward.',
        choke_c4_title: 'Repeat & Get Help',
        choke_c4_sub: 'For children over 1 year. If child loses consciousness, begin CPR.',
        // Settings
        settings_title: 'Settings',
        language: 'Language',
        voice_guidance: 'Voice Guidance',
        night_mode: 'High Contrast Mode',
        disaster_mode: 'Disaster Simulation Mode',
        about: 'About AidReach',
        logout: 'Lock App',
        profile: 'Medical Profile',
        // Disaster Mode
        disaster_title: 'DISASTER SIMULATION MODE',
        disaster_sub: 'This demo simulates a complete offline environment — no internet, no server, no cloud. All features are available 100% offline on this device.',
    },
    hi: {
        app_name: 'AidReach',
        tagline: 'जब इंटरनेट और डॉक्टर काम न करें, तब भी काम करता है।',
        offline_active: 'ऑफलाइन मोड सक्रिय',
        login_title: 'अपना PIN दर्ज करें',
        login_sub: 'आपका डेटा इस डिवाइस पर सुरक्षित है',
        login_trust: 'सभी डेटा डिवाइस पर सुरक्षित रूप से संग्रहीत है',
        login_first: 'शुरू करने के लिए 4 अंकों का PIN बनाएं',
        pin_error: 'गलत PIN। पुनः प्रयास करें।',
        greeting: 'नमस्ते,',
        emergency_label: 'आपातकाल',
        cpr: 'CPR',
        bleeding: 'रक्तस्राव',
        burns: 'जलना',
        fracture: 'फ्रैक्चर',
        choking: 'दम घुटना',
        cpr_sub: 'जीवन रक्षक दबाव',
        bleeding_sub: 'गंभीर रक्तस्राव नियंत्रण',
        burns_sub: '10 मिनट ठंडे पानी का टाइमर',
        fracture_sub: 'स्थिरीकरण के चरण',
        choking_sub: 'वयस्क और बच्चे के लिए',
        cpr_title: 'CPR मार्गदर्शिका',
        cpr_start: 'CPR शुरू करें',
        cpr_stop: 'रोकें',
        cpr_instruction: 'जोर से और तेज दबाएं',
        cpr_sub_text: '2 इंच गहरा · 110 BPM · छाती के बीच',
        cpr_count: 'संपीड़न',
        cpr_breathe: '2 बचाव सांसें दें',
        cpr_breathe_sub: 'सिर पीछे झुकाएं · ठुड्डी उठाएं · 1-1 सेकंड में फूंकें',
        cpr_resume: 'वापस दबाव पर',
        bleeding_title: 'रक्तस्राव नियंत्रण',
        bleed_s1_title: 'सीधा दबाव डालें',
        bleed_s1_sub: 'कपड़ा या पट्टी उपयोग करें। दोनों हाथों से जोर से दबाएं।',
        bleed_s2_title: 'न हटाएं',
        bleed_s2_sub: 'दबाते रहें। यदि कपड़ा भीग जाए तो ऊपर और कपड़ा जोड़ें।',
        bleed_s3_title: 'ऊपर उठाएं',
        bleed_s3_sub: 'यदि संभव हो तो घायल अंग को हृदय से ऊपर उठाएं।',
        bleed_s4_title: 'टूर्निकेट लगाएं',
        bleed_s4_sub: 'अंग से रक्तस्राव: घाव से 2 इंच ऊपर कपड़े की पट्टी बांधें। रक्त बंद होने तक मरोड़ें।',
        bleed_s5_title: 'मदद बुलाएं',
        bleed_s5_sub: 'दबाव बनाए रखें। तुरंत आपातकालीन चिकित्सा सहायता प्राप्त करें।',
        burns_title: 'जलने का उपचार',
        burns_s1_title: 'पानी से ठंडा करें',
        burns_s1_sub: 'जले हुए स्थान पर 10 मिनट तक ठंडा बहता पानी डालें।',
        burns_s2_title: 'कपड़ा हटाएं',
        burns_s2_sub: 'जले के पास का कपड़ा सावधानी से हटाएं। त्वचा से चिपका हो तो न हटाएं।',
        burns_s3_title: 'ढीला ढकें',
        burns_s3_sub: 'साफ क्लिंग फिल्म से ढकें। बर्फ या मक्खन का उपयोग न करें।',
        burns_s4_title: 'चिकित्सा सहायता लें',
        burns_s4_sub: 'हथेली से बड़े या चेहरे/हाथों पर जलने पर तुरंत चिकित्सा आवश्यक है।',
        timer_label: 'मिनट शेष',
        timer_start: '10 मिनट टाइमर शुरू करें',
        timer_stop: 'टाइमर रोकें',
        fracture_title: 'फ्रैक्चर देखभाल',
        frac_s1_title: 'हिलाएं नहीं',
        frac_s1_sub: 'व्यक्ति को स्थिर रखें। घायल अंग को सीधा या स्थानांतरित न करें।',
        frac_s2_title: 'अंग को स्थिर करें',
        frac_s2_sub: 'कपड़े, कंबल या अस्थायी स्प्लिंट से सहारा और गद्दी दें।',
        frac_s3_title: 'स्प्लिंट लगाएं',
        frac_s3_sub: 'अंग के साथ कठोर वस्तु (डंडा, बोर्ड) कपड़े से बांधें। बहुत कसकर नहीं।',
        frac_s4_title: 'दर्द और सूजन प्रबंधन',
        frac_s4_sub: 'यदि संभव हो तो घायल क्षेत्र ऊपर उठाएं। अधिकतम 20 मिनट के लिए बर्फ लगाएं।',
        frac_s5_title: 'चिकित्सा सहायता लें',
        frac_s5_sub: 'खाना या पानी न दें (सर्जरी हो सकती है)। सावधानी से ले जाएं।',
        choking_title: 'दम घुटने पर राहत',
        adult: 'वयस्क',
        child: 'बच्चा (>1 वर्ष)',
        choke_a1_title: 'पूछें: क्या दम घुट रहा है?',
        choke_a1_sub: 'यदि बोल, खांस या सांस नहीं ले सकते — तुरंत कार्य करें।',
        choke_a2_title: '5 पीठ पर थपकी',
        choke_a2_sub: 'आगे झुकाएं। हथेली से कंधों के बीच 5 जोरदार थपकी दें।',
        choke_a3_title: '5 पेट दबाव',
        choke_a3_sub: 'पीछे खड़े हों, पसलियों के नीचे हाथ रखें। अंदर और ऊपर खींचें। 5 बार दोहराएं।',
        choke_a4_title: 'जब तक साफ न हो दोहराएं',
        choke_a4_sub: '5 पीठ थपकी + 5 दबाव बारी-बारी करें जब तक खाना न निकले।',
        choke_c1_title: 'मुंह जांचें',
        choke_c1_sub: 'मुंह के अंदर देखें। दिखने वाली कोई वस्तु निकालें। अंधे उंगली से न खोजें।',
        choke_c2_title: '5 पीठ पर थपकी',
        choke_c2_sub: 'सीने को सहारा दें। कंधों के बीच 5 जोरदार थपकी दें।',
        choke_c3_title: '5 छाती दबाव',
        choke_c3_sub: 'छाती पर 2 उंगलियां रखें (निप्पल लाइन के नीचे)। अंदर और ऊपर दबाएं।',
        choke_c4_title: 'दोहराएं और मदद लें',
        choke_c4_sub: '1 वर्ष से बड़े बच्चों के लिए। यदि बेहोश हो जाए, CPR शुरू करें।',
        settings_title: 'सेटिंग्स',
        language: 'भाषा',
        voice_guidance: 'आवाज़ मार्गदर्शन',
        night_mode: 'उच्च कंट्रास्ट मोड',
        disaster_mode: 'आपदा सिमुलेशन मोड',
        about: 'AidReach के बारे में',
        logout: 'ऐप लॉक करें',
        profile: 'चिकित्सा प्रोफाइल',
        disaster_title: 'आपदा सिमुलेशन मोड',
        disaster_sub: 'यह डेमो पूर्ण ऑफलाइन वातावरण का अनुकरण करता है — कोई इंटरनेट नहीं, कोई सर्वर नहीं, कोई क्लाउड नहीं।',
    }
};

window.currentLangCode = 'en-IN'; // Sarvam standard
window.isTranslatingUI = false;

window.setLanguage = function (langCode) {
    window.currentLangCode = langCode;
    console.log("Language changed to:", langCode);

    // After setting the global code, iterate through UI elements to live-translate them via Sarvam
    window.translateAppUI();
}

window.getLang = function () {
    return window.currentLangCode;
}

window.translateAppUI = async function () {
    if (window.currentLangCode === 'en-IN') {
        // Just reload the page or revert nodes if returning to english - simpler for offline demo 
        location.reload();
        return;
    }

    window.isTranslatingUI = true;
    const elementsToTranslate = document.querySelectorAll('[data-i18n], .emg-title, .feature-title, .feature-sub, .section-title');

    // We batch requests lightly so we don't overload, but for this demo fire them
    // Note: To avoid rate limits in a real app, you'd send an array of strings to translate.
    for (const el of elementsToTranslate) {
        if (!el.dataset.originalText) {
            el.dataset.originalText = el.innerText;
        }

        try {
            const response = await fetch(`${window.SARVAM_BASE_URL}/translate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-subscription-key': window.SARVAM_API_KEY
                },
                body: JSON.stringify({
                    input: el.dataset.originalText,
                    source_language_code: "en-IN",
                    target_language_code: window.currentLangCode,
                    speaker_gender: "Neutral",
                    model: "sarvam-translate:v1"
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data && data.translated_text) {
                    el.innerText = data.translated_text; // Swap the DOM text
                }
            }
        } catch (e) {
            console.error("UI Translation error:", e);
        }
    }
    window.isTranslatingUI = false;
}
