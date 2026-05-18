// =====================================================
// KONFIGURASI SUPABASE - UTARA GARAGE
// =====================================================

const SUPABASE_URL = 'https://ojucvgwlihlyqsmignvp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qdWN2Z3dsaWhseXFzbWlnbnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMzU2MTAsImV4cCI6MjA5NDYxMTYxMH0.39EXfkhVSYov2vKlreI-n_71FMOyQkFYlGuiLyHduLo';
const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qdWN2Z3dsaWhseXFzbWlnbnZwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTAzNTYxMCwiZXhwIjoyMDk0NjExNjEwfQ.Pm-PxXmwF8uQm5Ji_RByNcWjNr1Bq3PIeh59_Zo5WGk';

// =====================================================
// FUNGSI CHECK MAINTENANCE (PENTING!)
// =====================================================

async function checkMaintenanceAndRedirect() {
    console.log('🔍 Checking maintenance mode...');
    
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/settings?key=eq.maintenance_mode&select=value`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        
        const data = await response.json();
        console.log('📦 Maintenance data:', data);
        
        let isMaintenance = false;
        if (data && data.length > 0) {
            const value = data[0].value;
            isMaintenance = (value === 'true' || value === true);
        }
        
        console.log('🟢 Maintenance mode:', isMaintenance);
        
        if (isMaintenance) {
            console.log('⚠️ Redirecting to maintenance.html...');
            window.location.href = 'maintenance.html';
            return true;
        }
        return false;
        
    } catch (error) {
        console.error('❌ Error checking maintenance:', error);
        return false;
    }
}

// =====================================================
// FUNGSI FETCH SETTINGS
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
            maintenance_mode: result.maintenance_mode === 'true' || result.maintenance_mode === true,
            member_mode: result.member_mode === 'true' || result.member_mode === true,
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

// =====================================================
// FUNGSI FETCH PRODUCTS
// =====================================================

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

// =====================================================
// FUNGSI REGISTER MEMBER
// =====================================================

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

// =====================================================
// EXPORT KE WINDOW
// =====================================================

window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
window.SUPABASE_SERVICE_ROLE = SUPABASE_SERVICE_ROLE;
window.checkMaintenanceAndRedirect = checkMaintenanceAndRedirect;
window.fetchSettings = fetchSettings;
window.fetchProducts = fetchProducts;
window.registerMember = registerMember;

console.log('✅ Config.js loaded with Supabase');
console.log('📡 Supabase URL:', SUPABASE_URL);
