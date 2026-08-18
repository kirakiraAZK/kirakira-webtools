/* ============================================================
   i18n — Internationalization for Invoice Maker
   Supports: English (en) and Bahasa Indonesia (id)
   ============================================================ */

const TRANSLATIONS = {
  en: {
    // Navigation
    nav_dashboard: 'Dashboard',
    nav_items: 'Item Manager',
    nav_sheet: 'Spreadsheet Config',
    nav_emailjs: 'EmailJS Config',

    // Status bar
    status_shop: 'Shop',
    status_items: 'Items',
    status_emailjs: 'EmailJS',
    status_ready: 'Ready',
    status_not_set: 'Not Set',

    // Dashboard — Shop Details
    shop_details: 'Shop Details',
    shop_header_label: 'Custom Header (Image URL)',
    shop_header_hint: 'Paste direct link from Imgur, Discord, etc.',
    shop_header_min: 'Min 800×200px',
    shop_name: 'Shop Name',
    shop_prefix: 'Invoice Prefix',
    shop_payment: 'Payment Info (Text)',
    shop_qris_section: 'QRIS / Payment QR Codes',
    shop_qris_add: '+ Add QRIS',
    shop_qris_label_placeholder: 'Label (e.g. QRIS BCA, QRIS GoPay)',
    shop_qris_url_placeholder: 'Image URL (https://...)',
    shop_qris_hint: 'Add one or more direct image links for your QRIS codes.',
    shop_save: 'Save Details',
    shop_saved: 'Saved ✓',
    reset_all: 'Reset All Data',
    reset_confirm: 'Are you sure you want to delete ALL data (shop details, items, config, and orders)? This cannot be undone.',

    // Dashboard — Workflow
    workflow_title: 'Workflow',
    upload_spreadsheet: 'Upload Spreadsheet',
    upload_hint: 'Upload .xlsx file to process orders',
    no_file: 'No file uploaded yet.',
    manage_items: 'Manage Items',
    google_form_template: 'Google Form Template ↗',
    emailjs_check: 'EmailJS Status',
    emailjs_configured: 'Configured and ready.',
    emailjs_not_configured: 'Not fully configured. Setup EmailJS Config first.',
    test_email: 'Test Email',
    test_email_prompt: 'Send test email to which address?',

    // Dashboard — Orders
    orders_title: 'Orders',
    needs_review_warning: 'There are rows with "NEEDS REVIEW" status. Please fix them or change their status before using SEND ALL.',
    col_no: '#',
    col_name: 'Name',
    col_email: 'Email',
    col_mail_order: 'Mail Order',
    col_address: 'Address',
    col_shipping: 'Shipping',
    col_total: 'Grand Total',
    col_detail: 'Detail',
    col_invoice: 'Invoice',
    col_status: 'Status',
    col_payment: 'Payment',
    col_paid_email: 'Paid Email',
    no_orders: 'No orders yet. Upload a spreadsheet first.',
    send_all: 'SEND ALL',

    // Currency
    currency: 'Currency',

    // Item Manager
    item_manager_title: 'Item Manager',
    add_item: '+ Add Item',
    item_name: 'Item Name',
    price: 'Price',
    add_variation: '+ Variation',
    delete: 'Delete',
    price_per_variation: 'Price per variation ↓',
    items_registered: '{n} items registered.',
    no_items: 'No items registered yet. Add your first item below.',
    back_to_dashboard: 'Back to Dashboard',

    // Spreadsheet Config
    sheet_config_title: 'Spreadsheet Config',
    sheet_hint: 'Step 1: Map customer data columns. Step 2: Map remaining columns to registered items.',
    no_sheet_warning: 'No spreadsheet uploaded yet.',
    no_sheet_hint: 'Go to Dashboard and upload an .xlsx file first.',
    go_to_dashboard: 'Go to Dashboard',
    name_column: 'Name Column',
    email_column: 'Email Column',
    mail_order_column: 'Mail Order / Delivery Column (Optional)',
    address_column: 'Address Column (Optional)',
    none_option: '— None —',
    shipping_value_label: 'Which value means Shipping / Delivery?',
    shipping_value_hint: 'Orders with this value will show address & shipping fee. All other values will be treated as Event / Venue Pickup.',
    upload_direct_hint: 'Or upload directly here:',
    change_spreadsheet: 'Change Spreadsheet (.xlsx)',
    item_mapping: 'Item Mapping',
    item_mapping_hint: 'The remaining columns are shown below. Map them to the correct items in your Item Manager.',
    spreadsheet_column: 'Spreadsheet Column',
    mapped_to: 'Mapped To Item',
    not_item_column: '— Not an item column —',
    no_remaining: 'No remaining columns to map.',
    item_manager_empty: 'Item Manager is empty. Add items first.',
    process_invoices: 'Process Invoices',
    data_preview: 'Data Preview',
    data_preview_hint: 'First 3 rows from your spreadsheet:',
    sheet_file: 'File',
    sheet_rows: 'rows detected',

    // EmailJS Config
    emailjs_config_title: 'EmailJS Config',
    emailjs_hint: 'Follow the steps below one by one — fill in the fields that appear after each step.',
    step1_title: '1. Register at emailjs.com',
    step1_body: 'Create a free account on EmailJS using your shop\'s email.',
    step1_link: 'Open EmailJS →',
    step1_img: '📸 Screenshot: EmailJS registration page',
    step2_title: '2. Add Email Service',
    step2_body: 'Go to <b>Email Services</b> → Add New Service → choose Gmail/Outlook → grant access. Copy the <b>Service ID</b> and paste it below.',
    step2_img: '📸 Screenshot: Email Services → provider selection → Service ID',
    service_id: 'Service ID',
    step3_title: '3. Create Invoice Template',
    step3_body: 'Menu <b>Email Templates</b> → Create New Template → in the Content box, click <b>Source Code / HTML mode <code>&lt;/&gt;</code></b>, then paste the code below.',
    step3_important: 'Fill in these fields in the template settings panel:<br><br><table style="font-size:13px;border-collapse:collapse;width:100%;"><tr><td style="padding:5px 10px 5px 0;font-weight:700;white-space:nowrap;">To Email</td><td><code style="background:#f0f0f0;padding:2px 6px;">{{email}}</code></td></tr><tr><td style="padding:5px 10px 5px 0;font-weight:700;white-space:nowrap;">Subject</td><td><code style="background:#f0f0f0;padding:2px 6px;">Invoice {{invoice_number}} - {{shop_name}}</code></td></tr></table><br><b style="color:#e44;">⚠ Do NOT leave the default Subject: <code>Contact Us: {{title}}</code></b>',
    step3_img: '📸 Screenshot: Template editor right panel — fill "To Email" with {{email}} & "Subject" with invoice title',
    template_invoice_label: 'HTML Template Invoice (copy into EmailJS HTML mode)',
    template_id_invoice: 'Template ID (Invoice)',
    step4_title: '4. Create Paid Template',
    step4_body: 'Create a second template for payment confirmation. Paste the HTML below into the Content (HTML mode).',
    step4_important: 'Fill in these fields in the template settings panel:<br><br><table style="font-size:13px;border-collapse:collapse;width:100%;"><tr><td style="padding:5px 10px 5px 0;font-weight:700;white-space:nowrap;">To Email</td><td><code style="background:#f0f0f0;padding:2px 6px;">{{email}}</code></td></tr><tr><td style="padding:5px 10px 5px 0;font-weight:700;white-space:nowrap;">Subject</td><td><code style="background:#f0f0f0;padding:2px 6px;">[PAID] Payment Confirmation — {{invoice_number}}</code></td></tr></table><br><b style="color:#e44;">⚠ Do NOT leave the default Subject: <code>Contact Us: {{title}}</code></b>',
    step4_img: '📸 Screenshot: Paid confirmation template editor — set "To Email" & "Subject"',
    template_paid_label: 'HTML Template Paid (copy into EmailJS HTML mode)',
    template_id_paid: 'Template ID (Paid)',
    step5_title: '5. Get Public Key',
    step5_body: 'Go to <b>Account → General</b>, and copy your Public Key.',
    step5_img: '📸 Screenshot: Account → General → Public Key',
    public_key: 'Public Key',
    save_go_dashboard: 'Save & Go to Dashboard',
    cancel: 'Cancel',

    // Misc
    close: 'Close',
    copy: 'COPY',
    copied: 'COPIED!',
    language: 'Language',
    preview_email: 'Preview Email (HTML)',
    preview_hint: 'Preview of the email sent to customer.',
    method: 'Method',
    support_me: 'Support my work! ☕',
  },

  id: {
    // Navigation
    nav_dashboard: 'Dasbor',
    nav_items: 'Kelola Item',
    nav_sheet: 'Konfigurasi Spreadsheet',
    nav_emailjs: 'Konfigurasi EmailJS',

    // Status bar
    status_shop: 'Toko',
    status_items: 'Item',
    status_emailjs: 'EmailJS',
    status_ready: 'Siap',
    status_not_set: 'Belum',

    // Dashboard — Shop Details
    shop_details: 'Detail Toko',
    shop_header_label: 'Header Kustom (URL Gambar)',
    shop_header_hint: 'Tempel link langsung dari Imgur, Discord, dll.',
    shop_header_min: 'Min 800×200px',
    shop_name: 'Nama Toko',
    shop_prefix: 'Prefix Invoice',
    shop_payment: 'Info Pembayaran (Teks)',
    shop_qris_section: 'QRIS / QR Pembayaran',
    shop_qris_add: '+ Tambah QRIS',
    shop_qris_label_placeholder: 'Label (contoh: QRIS BCA, QRIS GoPay)',
    shop_qris_url_placeholder: 'URL Gambar (https://...)',
    shop_qris_hint: 'Tambahkan satu atau lebih link gambar langsung untuk kode QRIS Anda.',
    shop_save: 'Simpan Detail',
    shop_saved: 'Tersimpan ✓',
    reset_all: 'Reset Semua Data',
    reset_confirm: 'Apakah Anda yakin ingin menghapus SEMUA data (detail toko, item, konfigurasi, dan pesanan)? Tindakan ini tidak dapat dibatalkan.',

    // Dashboard — Workflow
    workflow_title: 'Alur Kerja',
    upload_spreadsheet: 'Unggah Spreadsheet',
    upload_hint: 'Unggah file .xlsx untuk memproses pesanan',
    no_file: 'Belum ada file diunggah.',
    manage_items: 'Kelola Item',
    google_form_template: 'Template Google Form ↗',
    emailjs_check: 'Status EmailJS',
    emailjs_configured: 'Terkonfigurasi dan siap.',
    emailjs_not_configured: 'Belum lengkap. Atur Konfigurasi EmailJS dulu.',
    test_email: 'Test Email',
    test_email_prompt: 'Kirim test email ke alamat?',

    // Dashboard — Orders
    orders_title: 'Pesanan',
    needs_review_warning: 'Ada pesanan dengan status "NEEDS REVIEW". Harap perbaiki atau ubah statusnya sebelum menggunakan KIRIM SEMUA.',
    col_no: '#',
    col_name: 'Nama',
    col_email: 'Email',
    col_mail_order: 'Kirim',
    col_address: 'Alamat',
    col_shipping: 'Ongkir',
    col_total: 'Total',
    col_detail: 'Detail',
    col_invoice: 'Invoice',
    col_status: 'Status',
    col_payment: 'Bayar',
    col_paid_email: 'Email Lunas',
    no_orders: 'Belum ada pesanan. Unggah spreadsheet dulu.',
    send_all: 'KIRIM SEMUA',

    // Currency
    currency: 'Mata Uang',

    // Item Manager
    item_manager_title: 'Kelola Item',
    add_item: '+ Tambah Item',
    item_name: 'Nama Item',
    price: 'Harga',
    add_variation: '+ Variasi',
    delete: 'Hapus',
    price_per_variation: 'Harga per variasi ↓',
    items_registered: '{n} item terdaftar.',
    no_items: 'Belum ada item. Tambahkan item pertama Anda.',
    back_to_dashboard: 'Kembali ke Dasbor',

    // Spreadsheet Config
    sheet_config_title: 'Konfigurasi Spreadsheet',
    sheet_hint: 'Langkah 1: Petakan kolom data pelanggan. Langkah 2: Petakan kolom lain ke item terdaftar.',
    no_sheet_warning: 'Belum ada spreadsheet diunggah.',
    no_sheet_hint: 'Pergi ke Dasbor dan unggah file .xlsx terlebih dahulu.',
    go_to_dashboard: 'Ke Dasbor',
    name_column: 'Kolom Nama',
    email_column: 'Kolom Email',
    mail_order_column: 'Kolom Kirim / Pengiriman (Opsional)',
    address_column: 'Kolom Alamat (Opsional)',
    none_option: '— Tidak Ada —',
    shipping_value_label: 'Nilai mana yang berarti Pengiriman / Kirim?',
    shipping_value_hint: 'Pesanan dengan nilai ini akan membutuhkan alamat & ongkir. Nilai lainnya dianggap Ambil di Event / Venue.',
    upload_direct_hint: 'Atau unggah langsung di sini:',
    change_spreadsheet: 'Ganti Spreadsheet (.xlsx)',
    item_mapping: 'Pemetaan Item',
    item_mapping_hint: 'Kolom yang tersisa ditampilkan di bawah. Petakan ke item yang benar di Kelola Item.',
    spreadsheet_column: 'Kolom Spreadsheet',
    mapped_to: 'Dipetakan ke Item',
    not_item_column: '— Bukan kolom item —',
    no_remaining: 'Tidak ada kolom tersisa untuk dipetakan.',
    item_manager_empty: 'Kelola Item kosong. Tambahkan item dulu.',
    process_invoices: 'Proses Invoice',
    data_preview: 'Pratinjau Data',
    data_preview_hint: '3 baris pertama dari spreadsheet Anda:',
    sheet_file: 'File',
    sheet_rows: 'baris terdeteksi',

    // EmailJS Config
    emailjs_config_title: 'Konfigurasi EmailJS',
    emailjs_hint: 'Ikuti langkah di bawah satu per satu — isi kolom yang muncul setelah setiap langkah.',
    step1_title: '1. Daftar di emailjs.com',
    step1_body: 'Buat akun gratis di EmailJS menggunakan email toko Anda.',
    step1_link: 'Buka EmailJS →',
    step1_img: '📸 Screenshot: Halaman registrasi EmailJS',
    step2_title: '2. Tambah Email Service',
    step2_body: 'Ke <b>Email Services</b> → Add New Service → pilih Gmail/Outlook → berikan akses. Salin <b>Service ID</b> dan tempel di bawah.',
    step2_img: '📸 Screenshot: Email Services → pemilihan provider → Service ID',
    service_id: 'Service ID',
    step3_title: '3. Buat Template Invoice',
    step3_body: 'Menu <b>Email Templates</b> → Create New Template → di kotak Content, klik <b>Source Code / HTML mode <code>&lt;/&gt;</code></b>, lalu tempel kode di bawah.',
    step3_important: 'Isi kolom-kolom berikut di panel pengaturan template:<br><br><table style="font-size:13px;border-collapse:collapse;width:100%;"><tr><td style="padding:5px 10px 5px 0;font-weight:700;white-space:nowrap;">To Email</td><td><code style="background:#f0f0f0;padding:2px 6px;">{{email}}</code></td></tr><tr><td style="padding:5px 10px 5px 0;font-weight:700;white-space:nowrap;">Subject</td><td><code style="background:#f0f0f0;padding:2px 6px;">Invoice {{invoice_number}} - {{shop_name}}</code></td></tr></table><br><b style="color:#e44;">⚠ JANGAN biarkan Subject default: <code>Contact Us: {{title}}</code></b>',
    step3_img: '📸 Screenshot: Panel kanan editor template — isi "To Email" dengan {{email}} & "Subject" dengan judul invoice',
    template_invoice_label: 'HTML Template Invoice (salin ke mode HTML EmailJS)',
    template_id_invoice: 'Template ID (Invoice)',
    step4_title: '4. Buat Template Lunas',
    step4_body: 'Buat template kedua untuk konfirmasi pembayaran. Tempel HTML di bawah ke Content (mode HTML).',
    step4_important: 'Isi kolom-kolom berikut di panel pengaturan template:<br><br><table style="font-size:13px;border-collapse:collapse;width:100%;"><tr><td style="padding:5px 10px 5px 0;font-weight:700;white-space:nowrap;">To Email</td><td><code style="background:#f0f0f0;padding:2px 6px;">{{email}}</code></td></tr><tr><td style="padding:5px 10px 5px 0;font-weight:700;white-space:nowrap;">Subject</td><td><code style="background:#f0f0f0;padding:2px 6px;">[LUNAS] Konfirmasi Pembayaran — {{invoice_number}}</code></td></tr></table><br><b style="color:#e44;">⚠ JANGAN biarkan Subject default: <code>Contact Us: {{title}}</code></b>',
    step4_img: '📸 Screenshot: Editor template konfirmasi pembayaran — isi "To Email" & "Subject"',
    template_paid_label: 'HTML Template Lunas (salin ke mode HTML EmailJS)',
    template_id_paid: 'Template ID (Lunas)',
    step5_title: '5. Ambil Public Key',
    step5_body: 'Ke <b>Account → General</b>, dan salin Public Key Anda.',
    step5_img: '📸 Screenshot: Account → General → Public Key',
    public_key: 'Public Key',
    save_go_dashboard: 'Simpan & Ke Dasbor',
    cancel: 'Batal',

    // Misc
    close: 'Tutup',
    copy: 'SALIN',
    copied: 'TERSALIN!',
    language: 'Bahasa',
    preview_email: 'Pratinjau Email (HTML)',
    preview_hint: 'Pratinjau email yang dikirim ke pelanggan.',
    method: 'Metode',
    support_me: 'Dukung karya saya! ☕',
  }
};

/* ---------- i18n Engine ---------- */

function getLang() {
  const saved = localStorage.getItem('im_lang');
  if (saved) return saved;
  // Auto-detect from browser
  const browserLang = (navigator.language || 'en').slice(0, 2);
  return browserLang === 'id' ? 'id' : 'en';
}

let _currentLang = getLang();

function t(key) {
  return (TRANSLATIONS[_currentLang] && TRANSLATIONS[_currentLang][key]) || 
         (TRANSLATIONS.en[key]) || 
         key;
}

function switchLang(lang) {
  _currentLang = lang;
  localStorage.setItem('im_lang', lang);
  applyI18n();
  // Re-render dynamic content if functions exist
  if (typeof renderOrders === 'function') renderOrders();
  if (typeof renderItemManager === 'function') renderItemManager();
  if (typeof checkEmailjsConfig === 'function') checkEmailjsConfig();
  if (typeof updateSheetSummary === 'function') updateSheetSummary();
  if (typeof renderNav === 'function') renderNav();
}

function applyI18n() {
  // Replace text content for elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = val;
    } else {
      el.textContent = val;
    }
  });
  // Replace innerHTML for elements that need rich content (e.g. with <b>, <code>)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    el.innerHTML = t(key);
  });
  // Update language selector value
  const langSel = document.getElementById('langSelect');
  if (langSel) langSel.value = _currentLang;
}
