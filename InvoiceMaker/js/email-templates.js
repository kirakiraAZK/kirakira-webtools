// For Guided Config: Returns the static template with EmailJS variables for the user to copy.
function getInvoiceEmailJSTemplate() {
  return `<!DOCTYPE html>
<html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Invoice {{invoice_number}}</title></head>
<body style="margin:0;padding:0;background:#F2EFE4;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F2EFE4;padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:3px solid #0F0F0F;box-shadow:6px 6px 0 #0F0F0F;">
  <!-- HEADER -->
  <tr><td style="padding:0;overflow:hidden;background:#0F0F0F;">
    {{{header_html}}}
  </td></tr>
  <!-- TITLE BAR -->
  <tr><td style="background:#FF5CA8;padding:12px 24px;border-top:3px solid #0F0F0F;border-bottom:3px solid #0F0F0F;">
    <span style="font-size:20px;font-weight:800;color:#0F0F0F;font-family:Arial,sans-serif;">INVOICE PESANAN</span>
  </td></tr>
  <!-- INFO -->
  <tr><td style="padding:24px 24px 0;">
    <p style="margin:0 0 6px;font-size:14px;">Halo <b>{{to_name}}</b>,</p>
    <p style="margin:0 0 16px;font-size:13px;color:#555;">Berikut adalah detail pesanan Anda. Terima kasih telah berbelanja!</p>
    <table cellpadding="0" cellspacing="0" style="font-size:13px;margin-bottom:20px;">
      <tr><td style="padding:3px 16px 3px 0;color:#888;font-weight:700;white-space:nowrap;">No. Invoice</td><td style="padding:3px 0;font-weight:700;">{{invoice_number}}</td></tr>
      <tr><td style="padding:3px 16px 3px 0;color:#888;font-weight:700;white-space:nowrap;">Tanggal</td><td style="padding:3px 0;">{{invoice_date}}</td></tr>
      <tr><td style="padding:3px 16px 3px 0;color:#888;font-weight:700;white-space:nowrap;">Metode</td><td style="padding:3px 0;">{{fulfillment}}</td></tr>
    </table>
  </td></tr>
  <!-- ITEMS TABLE -->
  <tr><td style="padding:0 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;border:2px solid #0F0F0F;">
      <thead>
        <tr style="background:#0F0F0F;">
          <th style="padding:10px 12px;text-align:left;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Item</th>
          <th style="padding:10px 12px;text-align:center;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>
          <th style="padding:10px 12px;text-align:right;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Harga</th>
          <th style="padding:10px 12px;text-align:right;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {{{items_html}}}
      </tbody>
      <tfoot>
        <tr style="background:#FFD400;">
          <td colspan="3" style="padding:12px;font-weight:800;font-size:14px;border-top:2px solid #0F0F0F;">TOTAL</td>
          <td style="padding:12px;text-align:right;font-weight:800;font-size:14px;border-top:2px solid #0F0F0F;">{{total_formatted}}</td>
        </tr>
      </tfoot>
    </table>
  </td></tr>
  <!-- PAYMENT INFO -->
  <tr><td style="padding:20px 24px;">
    <div style="background:#F9F7EE;border:2px solid #0F0F0F;padding:14px 16px;">
      <p style="margin:0 0 6px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:#888;">Informasi Pembayaran</p>
      <div>{{{payment_info}}}</div>
    </div>
  </td></tr>
  <!-- FOOTER -->
  <tr><td style="padding:16px 24px;border-top:3px solid #0F0F0F;background:#0F0F0F;text-align:center;">
    <p style="margin:0;font-size:12px;color:#aaa;">Terima kasih, <b style="color:#FFD400;">{{shop_name}}</b></p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function getPaidEmailJSTemplate() {
  return `<!DOCTYPE html>
<html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Pembayaran Dikonfirmasi — {{invoice_number}}</title></head>
<body style="margin:0;padding:0;background:#F2EFE4;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F2EFE4;padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:3px solid #0F0F0F;box-shadow:6px 6px 0 #0F0F0F;">
  <!-- HEADER -->
  <tr><td style="padding:0;overflow:hidden;background:#0F0F0F;">
    {{{header_html}}}
  </td></tr>
  <!-- TITLE BAR -->
  <tr><td style="background:#B6FF3B;padding:12px 24px;border-top:3px solid #0F0F0F;border-bottom:3px solid #0F0F0F;">
    <span style="font-size:20px;font-weight:800;color:#0F0F0F;font-family:Arial,sans-serif;">✓ PEMBAYARAN DIKONFIRMASI</span>
  </td></tr>
  <!-- BODY -->
  <tr><td style="padding:28px 24px;">
    <p style="margin:0 0 10px;font-size:14px;">Halo <b>{{to_name}}</b>,</p>
    <p style="margin:0 0 20px;font-size:13px;color:#555;">Pembayaran Anda telah kami terima dan dikonfirmasi. Berikut ringkasannya:</p>
    <table cellpadding="0" cellspacing="0" style="font-size:13px;margin-bottom:24px;">
      <tr><td style="padding:4px 18px 4px 0;color:#888;font-weight:700;">No. Invoice</td><td style="padding:4px 0;font-weight:700;">{{invoice_number}}</td></tr>
      <tr><td style="padding:4px 18px 4px 0;color:#888;font-weight:700;">Tanggal Bayar</td><td style="padding:4px 0;">{{paid_date}}</td></tr>
      <tr><td style="padding:4px 18px 4px 0;color:#888;font-weight:700;">Total</td><td style="padding:4px 0;font-weight:800;font-size:15px;">{{total_formatted}}</td></tr>
    </table>
    <div style="background:#B6FF3B;border:2px solid #0F0F0F;padding:14px 18px;font-weight:700;font-size:13px;">
      Pesanan Anda sedang kami proses. Kami akan segera menghubungi Anda jika ada informasi lebih lanjut.
    </div>
  </td></tr>
  <!-- FOOTER -->
  <tr><td style="padding:16px 24px;border-top:3px solid #0F0F0F;background:#0F0F0F;text-align:center;">
    <p style="margin:0;font-size:12px;color:#aaa;">Terima kasih, <b style="color:#B6FF3B;">{{shop_name}}</b></p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

// For rendering the Dashboard Preview
function generateHeaderHtml(shop) {
  if(shop.headerImage) {
    return `<img src="${escapeHtml(shop.headerImage)}" alt="${escapeHtml(shop.shopName || 'Header')}" width="600" height="150" style="width:100%;height:150px;object-fit:cover;object-position:center;display:block;border:none;outline:none;">`;
  }
  return `<div style="padding:24px 32px;"><span style="color:#FFD400;font-size:22px;font-weight:800;font-family:Arial,sans-serif;">${escapeHtml(shop.shopName || 'INVOICE')}</span></div>`;
}

function generateItemsHtml(o) {
  const rows = o.lines.map(l => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;">${escapeHtml(l.itemLabel)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;text-align:center;">${l.qty}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;text-align:right;">${formatMoney(l.harga)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;text-align:right;font-weight:700;">${formatMoney(l.subtotal)}</td>
    </tr>`).join('');
    
  const shippingRow = (o.shippingFee && o.shippingFee > 0) ? `
    <tr>
      <td colspan="3" style="padding:8px 12px;border-bottom:1px solid #e5e5e5;font-style:italic;">Biaya Pengiriman</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;text-align:right;font-weight:700;">${formatMoney(o.shippingFee)}</td>
    </tr>` : '';
    
  return rows + shippingRow;
}

function generatePaymentInfoHtml(shop) {
  let html = '';
  const textInfo = (shop.paymentInfo || '').trim();
  if (textInfo) {
    const safeText = escapeHtml(textInfo).replace(/\n/g, '<br>');
    html += `<div style="font-family:Arial,sans-serif;font-size:13px;line-height:1.5;">${safeText}</div>`;
  }

  const qrisList = shop.qrisList || [];
  if (qrisList.length > 0) {
    html += `<div style="text-align:center; margin-top:16px;">`;
    qrisList.forEach(q => {
      if (!q.url) return;
      html += `<div style="margin-bottom:16px;">`;
      if (q.label) {
        html += `<div style="font-size:12px; font-weight:800; margin-bottom:6px; color:#333;">${escapeHtml(q.label)}</div>`;
      }
      html += `<img src="${escapeHtml(q.url)}" alt="QRIS" width="200" style="width:200px; max-width:100%; height:auto; border:2px solid #0F0F0F; display:inline-block;" />`;
      html += `</div>`;
    });
    html += `</div>`;
  }
  
  if (!html) return `—`;
  return html;
}

function buildInvoicePreview(o) {
  const shop = loadJSON(LS.shop, {});
  const isMailOrder = o.mailOrder && o.mailOrder.toString().toLowerCase() === 'true';
  const fulfillmentText = isMailOrder ? 'Dikirim ke ' + o.address : 'Diambil di venue';
  
  let html = getInvoiceEmailJSTemplate();
  html = html.replace('{{{header_html}}}', generateHeaderHtml(shop));
  html = html.replace('{{to_name}}', escapeHtml(o.nama));
  html = html.replace(/{{invoice_number}}/g, escapeHtml(o.invoiceNumber));
  html = html.replace('{{invoice_date}}', new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}));
  html = html.replace('{{fulfillment}}', escapeHtml(fulfillmentText));
  html = html.replace('{{{items_html}}}', generateItemsHtml(o));
  html = html.replace('{{total_formatted}}', formatMoney((o.total||0)+(o.shippingFee||0)));
  html = html.replace('{{{payment_info}}}', generatePaymentInfoHtml(shop));
  html = html.replace('{{shop_name}}', escapeHtml(shop.shopName||''));
  return html;
}
