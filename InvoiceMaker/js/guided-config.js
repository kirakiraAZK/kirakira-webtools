function renderGuidedTemplates(){
  document.getElementById('tmplInvoice').textContent = getInvoiceEmailJSTemplate();
  document.getElementById('tmplPaid').textContent = getPaidEmailJSTemplate();
}

function loadEmailjsToForm(){
  const e = loadJSON(LS.emailjs, {});
  document.getElementById('gcService').value = e.serviceId || '';
  document.getElementById('gcTemplateInvoice').value = e.templateIdInvoice || '';
  document.getElementById('gcTemplatePaid').value = e.templateIdPaid || '';
  document.getElementById('gcPublicKey').value = e.publicKey || '';
  ['gcService', 'gcTemplateInvoice', 'gcTemplatePaid', 'gcPublicKey'].forEach(id => {
    markStepDone(document.getElementById(id));
  });
}

function copyTmpl(id, btn){
  const text = document.getElementById(id).textContent;
  navigator.clipboard.writeText(text).then(()=>{
    const orig = btn.textContent;
    btn.textContent = t('copied');
    setTimeout(()=> btn.textContent = orig, 1800);
  });
}

function markStepDone(el){ 
  if(el && el.value.trim()) el.classList.add('field-ok'); 
  else if(el) el.classList.remove('field-ok'); 
}

function saveGuidedConfig(){
  const conf = {
    serviceId: document.getElementById('gcService').value.trim(),
    templateIdInvoice: document.getElementById('gcTemplateInvoice').value.trim(),
    templateIdPaid: document.getElementById('gcTemplatePaid').value.trim(),
    publicKey: document.getElementById('gcPublicKey').value.trim(),
  };
  saveJSON(LS.emailjs, conf);
  toast('EmailJS Config saved');
  setTimeout(() => window.location.href = 'index.html', 1000);
}

document.addEventListener('DOMContentLoaded', () => {
  renderGuidedTemplates();
  loadEmailjsToForm();
});
