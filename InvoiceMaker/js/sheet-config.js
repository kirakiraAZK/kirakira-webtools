let currentRows = [];
let currentHeaders = [];

function restoreSheetCache(){
  const cache = loadJSON(LS.sheetCache, null);
  if(!cache || !cache.rows || cache.rows.length === 0) {
    document.getElementById('noSheetWarning').style.display = 'block';
    document.getElementById('sheetConfigContainer').style.display = 'none';
    return;
  }
  currentRows = cache.rows;
  currentHeaders = cache.headers;
  document.getElementById('noSheetWarning').style.display = 'none';
  document.getElementById('sheetConfigContainer').style.display = 'block';
  renderDataPreview(cache);
  fillMappingSelects();
}

function renderDataPreview(cache) {
  const hintEl = document.getElementById('dataPreviewHint');
  const wrapEl = document.getElementById('dataPreviewWrap');
  if(!hintEl || !wrapEl) return;

  hintEl.innerHTML = `<b>${t('sheet_file')}:</b> ${escapeHtml(cache.name)} — <b>${cache.rows.length}</b> ${t('sheet_rows')}. ${t('data_preview_hint')}`;

  const previewRows = cache.rows.slice(0, 3);
  let html = '<table><thead><tr>';
  cache.headers.forEach(h => { html += `<th>${escapeHtml(h)}</th>`; });
  html += '</tr></thead><tbody>';
  previewRows.forEach(row => {
    html += '<tr>';
    cache.headers.forEach(h => {
      html += `<td title="${escapeHtml(String(row[h]||''))}">${escapeHtml(String(row[h]||''))}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  wrapEl.innerHTML = html;
}

function itemOptionsFromManager(){
  const items = loadJSON(LS.items, []);
  const opts = [];
  items.forEach(it=>{
    if(!it.name) return;
    if(it.variations.length===0){
      opts.push({key: it.name.trim().toLowerCase(), label: it.name});
    } else {
      it.variations.forEach(v=>{
        if(!v.name) return;
        opts.push({key: (it.name.trim()+'|'+v.name.trim()).toLowerCase(), label: it.name+' - '+v.name});
      });
    }
  });
  return opts;
}

function fillMappingSelects(){
  const mapping = loadJSON(LS.mapping, {});
  const opts = currentHeaders.map(h=>`<option value="${escapeHtml(h)}">${escapeHtml(h)}</option>`).join('');
  const optsWithNone = `<option value="" disabled selected>${t('none_option')}</option>` + opts;
  ['mapNama','mapEmail'].forEach(id=>{ document.getElementById(id).innerHTML = optsWithNone; });
  ['mapMailOrder','mapAddress'].forEach(id=>{
    document.getElementById(id).innerHTML = `<option value="">${t('none_option')}</option>` + opts;
  });
  
  if (mapping.colNama && currentHeaders.includes(mapping.colNama)) document.getElementById('mapNama').value = mapping.colNama;
  if (mapping.colEmail && currentHeaders.includes(mapping.colEmail)) document.getElementById('mapEmail').value = mapping.colEmail;
  if (mapping.colMailOrder && currentHeaders.includes(mapping.colMailOrder)) document.getElementById('mapMailOrder').value = mapping.colMailOrder;
  if (mapping.colAddress && currentHeaders.includes(mapping.colAddress)) document.getElementById('mapAddress').value = mapping.colAddress;

  renderItemColumnMapping();
}

function guess(id, keywords){
  const m = currentHeaders.find(h=>keywords.some(k=>h.toLowerCase().includes(k)));
  if(m) document.getElementById(id).value = m;
}

function renderItemColumnMapping(){
  const used = [
    document.getElementById('mapNama').value, 
    document.getElementById('mapEmail').value,
    document.getElementById('mapMailOrder').value, 
    document.getElementById('mapAddress').value
  ].filter(Boolean);
  
  const remaining = currentHeaders.filter(h=>!used.includes(h));
  const itemOpts = itemOptionsFromManager();
  const optHtml = `<option value="">${t('not_item_column')}</option>` + itemOpts.map(o=>`<option value="${escapeHtml(o.key)}">${escapeHtml(o.label)}</option>`).join('');
  
  const body = document.getElementById('itemColumnMappingBody');
  body.innerHTML = '';
  
  if(remaining.length===0){
    body.innerHTML = `<tr><td colspan="2">${t('no_remaining')}</td></tr>`;
    return;
  }
  if(itemOpts.length===0){
    body.innerHTML = `<tr><td colspan="2">${t('item_manager_empty')}</td></tr>`;
    return;
  }
  
  const mapping = loadJSON(LS.mapping, {});
  const prevColMap = mapping.colMap || {};
  
  remaining.forEach(h=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${escapeHtml(h)}</td><td><select data-col="${escapeHtml(h)}" class="itemColSelect">${optHtml}</select></td>`;
    body.appendChild(tr);
    if(prevColMap[h]) {
      tr.querySelector('select').value = prevColMap[h];
    }
  });
}

function processOrders(){
  const colNama=document.getElementById('mapNama').value;
  const colEmail=document.getElementById('mapEmail').value;
  
  if (!colNama || !colEmail) {
    toast(t('map_required') || 'Please map both Name and Email columns');
    return;
  }
  
  const colMailOrder=document.getElementById('mapMailOrder').value;
  const colAddress=document.getElementById('mapAddress').value;
  
  const colMap = {};
  document.querySelectorAll('.itemColSelect').forEach(sel=>{
    if(sel.value) colMap[sel.dataset.col] = sel.value;
  });
  saveJSON(LS.mapping, {colNama,colEmail,colMailOrder,colAddress,colMap});

  const items = loadJSON(LS.items, []);
  const priceMap = {}, labelMap = {};
  items.forEach(it=>{
    if(it.variations.length===0){
      priceMap[it.name.trim().toLowerCase()] = it.price; labelMap[it.name.trim().toLowerCase()] = it.name;
    } else {
      it.variations.forEach(v=>{
        const k=(it.name.trim()+'|'+v.name.trim()).toLowerCase();
        priceMap[k]=v.price; labelMap[k]=it.name+' - '+v.name;
      });
    }
  });

  const shop = loadJSON(LS.shop, {});
  let seq = loadJSON(LS.seq, 1);
  const sentlog = loadJSON(LS.sentlog, {});
  let skippedNoItems = 0;

  const orders = [];
  currentRows.forEach(row=>{
    const nama = String(row[colNama]||'').trim();
    const email = String(row[colEmail]||'').trim();
    if(!nama || !email) return;
    const mailOrder = colMailOrder ? String(row[colMailOrder]||'').trim() : '';
    const address = colAddress ? String(row[colAddress]||'').trim() : '';

    const lines = [];
    Object.entries(colMap).forEach(([header, itemKey])=>{
      const raw = row[header];
      if(raw===''||raw===undefined||raw===null) return;
      const num = parseFloat(raw);
      if(isNaN(num) || num===0) return;
      const qtyValid = Number.isInteger(num) && num>0;
      const matched = priceMap.hasOwnProperty(itemKey);
      const harga = matched ? priceMap[itemKey] : 0;
      const qty = num;
      lines.push({
        itemLabel: labelMap[itemKey] || itemKey,
        qty, qtyValid, harga, matched,
        subtotal: matched ? harga*(qtyValid?qty:0) : 0
      });
    });
    if(lines.length===0){ skippedNoItems++; return; }

    const hasInvalid = lines.some(l=>!l.qtyValid || !l.matched);
    const total = lines.reduce((s,l)=>s+l.subtotal,0);
    const hash = nama.toLowerCase()+'|'+email.toLowerCase()+'|'+total;
    const already = sentlog[hash];
    const invoiceNumber = already ? already.invoiceNumber : (shop.invoicePrefix||'INV-')+new Date().getFullYear()+'-'+String(seq++).padStart(4,'0');
    orders.push({
      nama, email, mailOrder, address, lines, total, hash, invoiceNumber,
      shippingFee: 0,
      status: already ? 'SENT' : (hasInvalid ? 'NEEDS REVIEW' : 'WAITING'),
      paid:false, paidAt:null, paidEmailStatus:'—'
    });
  });
  
  saveJSON(LS.seq, seq);
  saveJSON(LS.orders, orders);
  if(skippedNoItems>0) toast(skippedNoItems+' rows skipped (no mapped items ordered)');
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  restoreSheetCache();
});
