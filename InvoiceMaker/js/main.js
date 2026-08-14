// ---------- shop details ----------
function loadShopDetails(){
  const s = loadJSON(LS.shop, {});
  document.getElementById('shopName').value = s.shopName || '';
  document.getElementById('invoicePrefix').value = s.invoicePrefix || 'INV-';
  document.getElementById('paymentInfo').value = s.paymentInfo || '';
  document.getElementById('shopHeaderImg').value = s.headerImage || '';
  updateHeaderPreview(s.headerImage || '');
  
  if (s.shopName) {
    const btn = document.getElementById('btnSaveShop');
    if (btn) {
      btn.textContent = t('shop_saved');
      btn.disabled = true;
      btn.classList.remove('dark');
      btn.classList.add('ghost');
    }
  }
}

function updateHeaderPreview(url){
  const preview = document.getElementById('headerImgPreview');
  if(url && url.trim()){
    preview.src = url.trim();
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
    preview.src = '';
  }
}
function saveShopDetails(){
  const s = loadJSON(LS.shop, {});
  s.shopName = document.getElementById('shopName').value.trim();
  s.invoicePrefix = document.getElementById('invoicePrefix').value.trim() || 'INV-';
  s.paymentInfo = document.getElementById('paymentInfo').value.trim();
  s.headerImage = document.getElementById('shopHeaderImg').value.trim();
  saveJSON(LS.shop, s);
  toast(t('shop_saved'));
  renderNav();
  renderStatusBar();

  const btn = document.getElementById('btnSaveShop');
  if (btn) {
    btn.textContent = t('shop_saved');
    btn.disabled = true;
    btn.classList.remove('dark');
    btn.classList.add('ghost');
  }
  const warn = document.getElementById('shopDirtyWarning');
  if (warn) warn.style.display = 'none';
}

function markShopDirty() {
  const btn = document.getElementById('btnSaveShop');
  if (btn) {
    btn.textContent = t('shop_save');
    btn.disabled = false;
    btn.classList.remove('ghost');
    btn.classList.add('dark');
  }
  const warn = document.getElementById('shopDirtyWarning');
  if (warn) warn.style.display = 'inline';
}

// ---------- Quick Check ----------
function checkEmailjsConfig() {
  const e = loadJSON(LS.emailjs, {});
  const statusEl = document.getElementById('ejsStatusDisplay');
  if(!statusEl) return;
  if(e.serviceId && e.templateIdInvoice && e.publicKey) {
    statusEl.textContent = t('emailjs_configured');
    statusEl.style.color = 'var(--ok)';
    try{ emailjs.init(e.publicKey); }catch(err){}
  } else {
    statusEl.textContent = t('emailjs_not_configured');
    statusEl.style.color = 'var(--warn)';
  }
}

function sendTestEmail(){
  const e = loadJSON(LS.emailjs, {});
  if(!e.serviceId || !e.templateIdInvoice || !e.publicKey){
    toast(t('emailjs_not_configured'));
    return;
  }
  const testEmail = prompt(t('test_email_prompt'));
  if(!testEmail) return;
  const s = loadJSON(LS.shop, {});
  toast('Sending test email...');
  
  const testOrder = {
    nama:'Pelanggan Test', invoiceNumber:(s.invoicePrefix||'INV-')+'TEST',
    mailOrder:'true', address:'Jl. Contoh No. 1',
    lines:[{itemLabel:'Item Contoh', qty:1, harga:10000, subtotal:10000, matched:true, qtyValid:true}],
    shippingFee: 0, total:10000
  };

  emailjs.send(e.serviceId, e.templateIdInvoice, {
    email: testEmail, 
    to_name: 'Pelanggan Test',
    invoice_number: (s.invoicePrefix||'INV-')+'TEST',
    invoice_date: new Date().toLocaleDateString('id-ID'),
    fulfillment: 'Contoh Pengiriman',
    items_html: generateItemsHtml(testOrder),
    total_formatted: formatMoney(10000),
    shop_name: s.shopName||'',
    payment_info: s.paymentInfo||'',
    header_html: generateHeaderHtml(s)
  }).then(()=>{ toast('Test email sent to '+testEmail); })
    .catch(err=>{ toast('Failed: '+(err&&err.text?err.text:JSON.stringify(err))); });
}

// ---------- spreadsheet upload & redirect ----------
function handleSheetUpload(evt){
  const file = evt.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e=>{
    const data = new Uint8Array(e.target.result);
    const wb = XLSX.read(data, {type:'array'});
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const currentRows = XLSX.utils.sheet_to_json(sheet, {defval:''});
    if(currentRows.length===0){ toast('File is empty/unrecognized'); return; }
    const currentHeaders = Object.keys(currentRows[0]);
    try {
      saveJSON(LS.sheetCache, {
        name: file.name,
        rows: currentRows,
        headers: currentHeaders
      });
    } catch(err) {
      toast('File is too large to cache in browser.');
      return;
    }
    window.location.href = 'sheet-config.html';
  };
  reader.readAsArrayBuffer(file);
}
function updateSheetSummary(){
  const cache = loadJSON(LS.sheetCache, null);
  const el = document.getElementById('sheetSummary');
  if(!el) return;
  if(cache && cache.rows) {
    el.textContent = `${cache.name} — ${cache.rows.length} ${t('sheet_rows')}`;
  } else {
    el.textContent = t('no_file');
  }
}

// ---------- shipping fee ----------
function updateShippingFee(idx, val){
  const orders = loadJSON(LS.orders, []);
  orders[idx].shippingFee = Math.round(parseFloat(val))||0;
  saveJSON(LS.orders, orders);
  renderOrders();
}

// ---------- render orders table ----------
function renderOrders(){
  const orders = loadJSON(LS.orders, []);
  const body = document.getElementById('orderTableBody');
  if(!body) return;
  body.innerHTML = '';

  // Update order count badge
  const countEl = document.getElementById('orderCount');
  if(countEl) countEl.textContent = orders.length;

  // Show/hide Send All row
  const sendAllRow = document.getElementById('sendAllRow');
  const hasPending = orders.some(o=>o.status==='WAITING'||o.status==='FAILED');
  if(sendAllRow) {
    if(hasPending && orders.length > 0) {
      sendAllRow.classList.add('visible');
    } else {
      sendAllRow.classList.remove('visible');
    }
  }
  const sendAllBtn = document.getElementById('sendAllBtn');
  if(sendAllBtn) sendAllBtn.disabled = !hasPending;

  if(orders.length===0){
    body.innerHTML = `<tr><td colspan="12" style="text-align:center;padding:22px;font-weight:600;">${t('no_orders')}</td></tr>`;
    return;
  }

  orders.forEach((o, idx)=>{
    const statusClass = o.status==='SENT'?'ok':(o.status==='WAITING'?'wait':(o.status==='NEEDS REVIEW'?'review':'warn'));
    const paidStatusClass = o.paid ? 'ok' : 'wait';
    const paidEmailClass = o.paidEmailStatus==='SENT'?'ok':(o.paidEmailStatus==='FAILED'?'warn':'wait');
    const isMailOrder = o.mailOrder && o.mailOrder.toString().toLowerCase()==='true';
    const shippingCell = isMailOrder
      ? `<div class="shipping-fee-row">
           <span style="font-size:10px;font-weight:700;white-space:nowrap;">+ Fee</span>
           <input type="number" min="0" step="1" value="${o.shippingFee||0}" placeholder="0"
             onchange="updateShippingFee(${idx},this.value)">
         </div>`
      : `<span style="font-size:11px;color:#aaa;">—</span>`;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx+1}</td>
      <td>${escapeHtml(o.nama)}<div class="hint" style="margin:0;">${o.invoiceNumber}</div></td>
      <td><a href="mailto:${o.email}">${escapeHtml(o.email)}</a></td>
      <td>${escapeHtml(o.mailOrder)}</td>
      <td>${escapeHtml(o.address)}</td>
      <td>${shippingCell}</td>
      <td class="num">${formatMoney((o.total||0)+(o.shippingFee||0))}</td>
      <td><button class="icon-btn" onclick="previewOrder(${idx})">👁</button></td>
      <td><button class="icon-btn" ${o.status==='SENT' || o.status==='NEEDS REVIEW'?'disabled':''} onclick="sendInvoice(${idx})">➤</button></td>
      <td>
        <select class="status-pill ${statusClass}" onchange="changeOrderStatus(${idx}, this.value)" style="cursor:pointer; outline:none;">
          <option value="WAITING" ${o.status==='WAITING'?'selected':''}>WAITING</option>
          <option value="SENT" ${o.status==='SENT'?'selected':''}>SENT</option>
          <option value="NEEDS REVIEW" ${o.status==='NEEDS REVIEW'?'selected':''}>NEEDS REVIEW</option>
          <option value="FAILED" ${o.status==='FAILED'?'selected':''}>FAILED</option>
        </select>
      </td>
      <td>
        <span class="status-pill ${paidStatusClass}" style="cursor:pointer;" onclick="togglePaid(${idx})">${o.paid?'PAID':'UNPAID'}</span>
      </td>
      <td>
        ${o.paid ? `<button class="icon-btn" ${o.paidEmailStatus==='SENT'?'disabled':''} onclick="sendPaidEmail(${idx})">➤</button> 
          <select class="status-pill ${paidEmailClass}" onchange="changePaidEmailStatus(${idx}, this.value)" style="cursor:pointer; outline:none;">
            <option value="WAITING" ${o.paidEmailStatus==='WAITING'?'selected':''}>WAITING</option>
            <option value="SENT" ${o.paidEmailStatus==='SENT'?'selected':''}>SENT</option>
            <option value="FAILED" ${o.paidEmailStatus==='FAILED'?'selected':''}>FAILED</option>
          </select>` : '—'}
      </td>
    `;
    body.appendChild(tr);
  });
}

function changeOrderStatus(idx, newStatus) {
  const orders = loadJSON(LS.orders, []);
  orders[idx].status = newStatus;
  saveJSON(LS.orders, orders);
  renderOrders();
}

function changePaidEmailStatus(idx, newStatus) {
  const orders = loadJSON(LS.orders, []);
  orders[idx].paidEmailStatus = newStatus;
  saveJSON(LS.orders, orders);
  renderOrders();
}

function previewOrder(idx){
  const orders = loadJSON(LS.orders, []);
  const o = orders[idx];
  const fulfillmentText = o.mailOrder && o.mailOrder.toString().toLowerCase()==='true' ? 'Dikirim ke '+o.address : 'Diambil di venue';
  document.getElementById('previewTitle').textContent = o.invoiceNumber+' — '+o.nama;
  document.getElementById('previewBody').innerHTML = `
    <table>
      <thead><tr><th>Item</th><th class="num">Qty</th><th class="num">Harga</th><th class="num">Subtotal</th></tr></thead>
      <tbody>
        ${o.lines.map((l, lineIdx)=>`<tr>
          <td>${escapeHtml(l.itemLabel)} ${!l.matched?'<div class="hint" style="margin:0;color:var(--warn);">item not found in Item Manager</div>':''} ${!l.qtyValid?'<div class="hint" style="margin:0;color:var(--warn);">qty invalid</div>':''}</td>
          <td class="num"><input type="number" min="0" step="1" value="${l.qty}" style="width:50px; text-align:right;" onchange="updateLineQty(${idx}, ${lineIdx}, this.value)"></td>
          <td class="num"><input type="number" min="0" step="1" value="${l.harga}" style="width:80px; text-align:right;" onchange="updateLineHarga(${idx}, ${lineIdx}, this.value)"></td>
          <td class="num">${formatMoney(l.subtotal)}</td>
        </tr>`).join('')}
        ${(o.shippingFee && o.shippingFee>0) ? `<tr><td colspan="3" style="font-style:italic;">Shipping Fee</td><td class="num">${formatMoney(o.shippingFee)}</td></tr>` : ''}
      </tbody>
    </table>
    <p style="text-align:right;font-weight:800;margin-top:10px;">TOTAL: ${formatMoney((o.total||0)+(o.shippingFee||0))}</p>
    <p><b>${t('method')}:</b> ${escapeHtml(fulfillmentText)}</p>
    <h2 class="section" style="margin-top:16px;">${t('preview_email')}</h2>
    <p class="hint">${t('preview_hint')}</p>
    <iframe srcdoc="${escapeHtml(buildInvoicePreview(o))}" style="width:100%;height:340px;border:2px solid var(--ink);border-radius:0;" sandbox="allow-same-origin"></iframe>
  `;
  document.getElementById('previewModal').classList.add('active');
}
function closePreview(){ document.getElementById('previewModal').classList.remove('active'); }

function updateLineQty(orderIdx, lineIdx, val) {
  const orders = loadJSON(LS.orders, []);
  const o = orders[orderIdx];
  const l = o.lines[lineIdx];
  l.qty = Math.max(0, parseInt(val) || 0);
  l.qtyValid = l.qty > 0;
  l.subtotal = l.qty * l.harga;
  recalcOrder(o);
  saveJSON(LS.orders, orders);
  previewOrder(orderIdx);
  renderOrders();
}

function updateLineHarga(orderIdx, lineIdx, val) {
  const orders = loadJSON(LS.orders, []);
  const o = orders[orderIdx];
  const l = o.lines[lineIdx];
  l.harga = Math.max(0, parseFloat(val) || 0);
  l.matched = true; 
  l.subtotal = l.qty * l.harga;
  recalcOrder(o);
  saveJSON(LS.orders, orders);
  previewOrder(orderIdx);
  renderOrders();
}

function recalcOrder(o) {
  o.total = o.lines.reduce((s,l)=>s+l.subtotal,0);
  const hasInvalid = o.lines.some(l=>!l.qtyValid || !l.matched);
  if (o.status === 'NEEDS REVIEW' && !hasInvalid) {
    o.status = 'WAITING';
  } else if (hasInvalid && o.status === 'WAITING') {
    o.status = 'NEEDS REVIEW';
  }
}

function sendInvoice(idx){
  const orders = loadJSON(LS.orders, []);
  const o = orders[idx];
  const e = loadJSON(LS.emailjs, {});
  const shop = loadJSON(LS.shop, {});
  if(!e.serviceId || !e.templateIdInvoice || !e.publicKey){ toast(t('emailjs_not_configured')); return; }
  const isMailOrder = o.mailOrder && o.mailOrder.toString().toLowerCase()==='true';
  const fulfillmentText = isMailOrder ? 'Dikirim ke '+o.address : 'Diambil di venue';
  
  emailjs.send(e.serviceId, e.templateIdInvoice, {
    email: o.email, to_name: o.nama, invoice_number: o.invoiceNumber,
    invoice_date: new Date().toLocaleDateString('id-ID'),
    fulfillment: fulfillmentText,
    items_html: generateItemsHtml(o),
    total_formatted: formatMoney((o.total||0)+(o.shippingFee||0)),
    shop_name: shop.shopName||'',
    payment_info: shop.paymentInfo||'',
    header_html: generateHeaderHtml(shop)
  }).then(()=>{
    const freshOrders = loadJSON(LS.orders, []);
    freshOrders[idx].status = 'SENT';
    const sentlog = loadJSON(LS.sentlog, {});
    sentlog[freshOrders[idx].hash] = {invoiceNumber:freshOrders[idx].invoiceNumber, sentAt:new Date().toISOString()};
    saveJSON(LS.sentlog, sentlog);
    saveJSON(LS.orders, freshOrders);
    renderOrders();
    toast('Sent to '+freshOrders[idx].email);
  }).catch(err=>{
    const freshOrders = loadJSON(LS.orders, []);
    freshOrders[idx].status = 'FAILED';
    saveJSON(LS.orders, freshOrders);
    renderOrders();
    toast('Failed to send: '+(err&&err.text?err.text:'check console'));
  });
}
function sendAllPending(){
  const orders = loadJSON(LS.orders, []);
  const hasNeedsReview = orders.some(o => o.status === 'NEEDS REVIEW');
  if (hasNeedsReview) {
    alert(t('needs_review_warning'));
    return;
  }
  orders.forEach((o, idx)=>{ if(o.status==='WAITING'||o.status==='FAILED') setTimeout(()=>sendInvoice(idx), idx*1200); });
}

function togglePaid(idx){
  const orders = loadJSON(LS.orders, []);
  const o = orders[idx];
  o.paid = !o.paid;
  o.paidAt = o.paid ? new Date().toISOString() : null;
  if(!o.paid) o.paidEmailStatus = '—';
  else if(o.paidEmailStatus==='—') o.paidEmailStatus='WAITING';
  saveJSON(LS.orders, orders);
  renderOrders();
}
function sendPaidEmail(idx){
  const orders = loadJSON(LS.orders, []);
  const o = orders[idx];
  const e = loadJSON(LS.emailjs, {});
  const shop = loadJSON(LS.shop, {});
  if(!e.serviceId || !e.templateIdPaid || !e.publicKey){ toast('Setup Template ID (Paid) in EmailJS Config first'); return; }
  
  emailjs.send(e.serviceId, e.templateIdPaid, {
    email: o.email, to_name: o.nama, invoice_number: o.invoiceNumber,
    paid_date: new Date(o.paidAt).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}),
    total_formatted: formatMoney((o.total||0)+(o.shippingFee||0)),
    shop_name: shop.shopName||'',
    header_html: generateHeaderHtml(shop)
  }).then(()=>{
    const freshOrders = loadJSON(LS.orders, []);
    freshOrders[idx].paidEmailStatus='SENT';
    saveJSON(LS.orders, freshOrders);
    renderOrders();
    toast('PAID Email sent to '+freshOrders[idx].email);
  }).catch(err=>{
    const freshOrders = loadJSON(LS.orders, []);
    freshOrders[idx].paidEmailStatus='FAILED';
    saveJSON(LS.orders, freshOrders);
    renderOrders();
    toast('Failed to send PAID email');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadShopDetails();
  checkEmailjsConfig();
  updateSheetSummary();
  renderOrders();
});

function resetAllData() {
  if (confirm(t('reset_confirm'))) {
    localStorage.clear();
    window.location.reload();
  }
}
