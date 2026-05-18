// =====================================================
// KONFIGURASI SUPABASE - GANTI DENGAN API KEYS ANDA!
// =====================================================

// 🔴 WAJIB GANTI: Ambil dari Supabase Dashboard > Project Settings > API
const SUPABASE_URL = 'https://ojucvgwlihlyqsmignvp.supabase.co';  // GANTI INI!
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qdWN2Z3dsaWhseXFzbWlnbnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMzU2MTAsImV4cCI6MjA5NDYxMTYxMH0.39EXfkhVSYov2vKlreI-n_71FMOyQkFYlGuiLyHduLo';  // GANTI INI!

// =====================================================
// FUNGSI SUPABASE CLIENT
// =====================================================

async function supabaseFetch(endpoint, options = {}) {
    const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
    const headers = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
    };
    
    const response = await fetch(url, { ...options, headers });
    return response;
}

async function supabaseGet(endpoint) {
    const response = await supabaseFetch(endpoint);
    return response.json();
}

async function supabasePost(endpoint, data) {
    const response = await supabaseFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    });
    return response.json();
}

// =====================================================
// FUNGSI UNTUK WEBSITE
// =====================================================

async function fetchSettings() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/settings`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        const settings = await response.json();
        
        const result = {};
        settings.forEach(s => {
            result[s.key] = s.value;
        });
        
        return {
            maintenance_mode: result.maintenance_mode === 'true',
            member_mode: result.member_mode === 'true',
            admin_email: result.admin_email || 'utaragarageofficial@gmail.com',
            min_age: parseInt(result.min_age) || 15,
            event_whatsapp: result.event_whatsapp || '6281234567890',
            event_message: result.event_message || 'Assalamualaikum Bang Saya Mau Daftar Event'
        };
    } catch (error) {
        console.error('Gagal fetch settings:', error);
        return {
            maintenance_mode: false,
            member_mode: true,
            admin_email: 'utaragarageofficial@gmail.com',
            min_age: 15,
            event_whatsapp: '6281234567890',
            event_message: 'Assalamualaikum Bang Saya Mau Daftar Event'
        };
    }
}

async function fetchProducts() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&is_active=eq.true&order=created_at.desc`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Gagal fetch products:', error);
        return [];
    }
}

async function registerMember(memberData) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/members`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(memberData)
        });
        const result = await response.json();
        return { success: response.ok, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// EXPORT KE WINDOW
window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
window.fetchSettings = fetchSettings;
window.fetchProducts = fetchProducts;
window.registerMember = registerMember;
window.supabaseFetch = supabaseFetch;

console.log('✅ Config.js loaded with Supabase');
