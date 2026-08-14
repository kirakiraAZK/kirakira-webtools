function renderItemManager(){
  const items = loadJSON(LS.items, []);
  const wrap = document.getElementById('itemsContainer');
  wrap.innerHTML = '';

  if(items.length === 0) {
    wrap.innerHTML = `<div style="text-align:center;padding:30px;border:3px dashed var(--ink);background:#fffbe6;margin-bottom:16px;">
      <p style="font-weight:700;font-size:13px;">${t('no_items')}</p>
    </div>`;
  }

  items.forEach((it, idx)=>{
    const block = document.createElement('div');
    block.className = 'item-block';
    block.innerHTML = `
      <div class="item-head">
        <input type="text" value="${escapeHtml(it.name)}" placeholder="${t('item_name')}" onchange="updateItemName(${idx}, this.value)">
        ${it.variations.length===0 ? `<input type="number" step="1" min="0" class="price" value="${it.price||0}" placeholder="${t('price')}" onchange="updateItemPrice(${idx}, this.value)">` : `<span class="hint" style="margin:0;">${t('price_per_variation')}</span>`}
        <button class="btn small ghost" onclick="addVariation(${idx})">${t('add_variation')}</button>
        <button class="btn small" style="background:var(--warn);" onclick="deleteItem(${idx})">${t('delete')}</button>
      </div>
      ${it.variations.map((v,vidx)=>`
        <div class="variation-row">
          <input type="text" value="${escapeHtml(v.name)}" placeholder="Variation Name (e.g. XL)" onchange="updateVariation(${idx},${vidx},'name',this.value)">
          <input type="number" step="1" min="0" class="price" value="${v.price}" placeholder="${t('price')}" onchange="updateVariation(${idx},${vidx},'price',this.value)">
          <button class="icon-btn" onclick="deleteVariation(${idx},${vidx})">✕</button>
        </div>
      `).join('')}
    `;
    wrap.appendChild(block);
  });
  const summaryEl = document.getElementById('itemManagerSummary');
  if(summaryEl) {
    summaryEl.textContent = items.length ? t('items_registered').replace('{n}', items.length) : t('no_items');
  }
}
function addItem(){
  const items = loadJSON(LS.items, []);
  items.push({name:'', price:0, variations:[]});
  saveJSON(LS.items, items);
  renderItemManager();
  renderNav(); // update step indicator
}
function deleteItem(idx){
  const items = loadJSON(LS.items, []);
  items.splice(idx,1);
  saveJSON(LS.items, items);
  renderItemManager();
  renderNav();
}
function updateItemName(idx, val){
  const items = loadJSON(LS.items, []);
  items[idx].name = val.trim();
  saveJSON(LS.items, items);
}
function updateItemPrice(idx, val){
  const items = loadJSON(LS.items, []);
  items[idx].price = Math.round(parseFloat(val))||0;
  saveJSON(LS.items, items);
}
function addVariation(idx){
  const items = loadJSON(LS.items, []);
  items[idx].variations.push({name:'', price: items[idx].price||0});
  saveJSON(LS.items, items);
  renderItemManager();
}
function deleteVariation(idx, vidx){
  const items = loadJSON(LS.items, []);
  items[idx].variations.splice(vidx,1);
  saveJSON(LS.items, items);
  renderItemManager();
}
function updateVariation(idx, vidx, field, val){
  const items = loadJSON(LS.items, []);
  items[idx].variations[vidx][field] = field==='price' ? (Math.round(parseFloat(val))||0) : val.trim();
  saveJSON(LS.items, items);
}

document.addEventListener('DOMContentLoaded', () => {
  renderItemManager();
});
