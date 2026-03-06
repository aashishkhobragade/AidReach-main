// ============================================================
// AidReach - Offline Auth (Registration + Email/PIN Login)
// ============================================================
import { saveSetting, getSetting, saveUser, getUser } from './db.js';

// ---- Registration ----
export async function registerUser({ name, email, phone, pin }) {
    await saveUser({ name, email, phone, pin, bloodGroup: 'A+', allergies: '', contact: phone });
    await saveSetting('registered', true);
    await saveSetting('session_email', email);
    await saveSetting('session_active', true);
}

export async function isRegistered() {
    return (await getSetting('registered', false)) === true;
}

// ---- Login ----
export async function loginWithEmailPin(email, pin) {
    const user = await getUser();
    if (!user) return { ok: false, msg: 'No account found. Please register.' };
    if (user.email.toLowerCase() !== email.toLowerCase()) return { ok: false, msg: 'Email not found.' };
    if (user.pin !== pin) return { ok: false, msg: 'Incorrect PIN.' };
    await saveSetting('session_active', true);
    await saveSetting('session_email', email);
    return { ok: true, user };
}

export async function isLoggedIn() {
    return (await getSetting('session_active', false)) === true;
}

export async function setLoggedIn(val) {
    await saveSetting('session_active', val);
}

export async function getCurrentUser() {
    return await getUser();
}
