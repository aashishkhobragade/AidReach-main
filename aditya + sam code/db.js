// ============================================================
// AidReach - IndexedDB Wrapper
// ============================================================

const DB_NAME = 'aidreach_db';
const DB_VERSION = 1;

let db = null;

export function openDB() {
    return new Promise((resolve, reject) => {
        if (db) { resolve(db); return; }
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
            const d = e.target.result;
            if (!d.objectStoreNames.contains('users')) {
                d.createObjectStore('users', { keyPath: 'id' });
            }
            if (!d.objectStoreNames.contains('settings')) {
                d.createObjectStore('settings', { keyPath: 'key' });
            }
        };
        req.onsuccess = (e) => { db = e.target.result; resolve(db); };
        req.onerror = (e) => reject(e.target.error);
    });
}

export async function saveUser(user) {
    const d = await openDB();
    return new Promise((resolve, reject) => {
        const tx = d.transaction('users', 'readwrite');
        tx.objectStore('users').put({ ...user, id: 'primary' });
        tx.oncomplete = resolve;
        tx.onerror = (e) => reject(e.target.error);
    });
}

export async function getUser() {
    const d = await openDB();
    return new Promise((resolve) => {
        const tx = d.transaction('users', 'readonly');
        const req = tx.objectStore('users').get('primary');
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
    });
}

export async function saveSetting(key, value) {
    const d = await openDB();
    return new Promise((resolve, reject) => {
        const tx = d.transaction('settings', 'readwrite');
        tx.objectStore('settings').put({ key, value });
        tx.oncomplete = resolve;
        tx.onerror = (e) => reject(e.target.error);
    });
}

export async function getSetting(key, defaultVal = null) {
    const d = await openDB();
    return new Promise((resolve) => {
        const tx = d.transaction('settings', 'readonly');
        const req = tx.objectStore('settings').get(key);
        req.onsuccess = () => resolve(req.result ? req.result.value : defaultVal);
        req.onerror = () => resolve(defaultVal);
    });
}
