/* Klimasun 2026 - shared cart + helpers + talep referansı */
(function(){
const M = window.KS_META || {};
const PRICES = window.KS_PRICES || {};
const TAGS = window.KS_TAGS || {};
const PH = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><rect width="600" height="600" fill="#141414"/><g transform="translate(205,120)"><rect x="0" y="0" width="190" height="250" rx="14" fill="#1c1c1c" stroke="#F4C20D" stroke-width="5"/><g stroke="#3a3a3a" stroke-width="6" stroke-linecap="round"><line x1="26" y1="34" x2="164" y2="34"/><line x1="26" y1="54" x2="164" y2="54"/><line x1="26" y1="74" x2="164" y2="74"/></g><circle cx="95" cy="160" r="52" fill="none" stroke="#4a4a4a" stroke-width="5"/><circle cx="95" cy="160" r="10" fill="#111" stroke="#F4C20D" stroke-width="3"/></g><text x="300" y="452" text-anchor="middle" font-family="Arial" font-size="52" font-weight="800" fill="#fff">KLIMA<tspan fill="#F4C20D">SUN</tspan></text><text x="300" y="486" text-anchor="middle" font-family="Arial" font-size="17" fill="#8a8a8a">ENDÜSTRİYEL İKLİMLENDİRME</text></svg>');
window.KS = {
  M, ph:PH, PRICES, TAGS,
  esc(s){return (s==null?'':(''+s)).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));},
  img(p){return (p && p.length) ? p : PH;},
  qp(k){return new URLSearchParams(location.search).get(k)||'';},
  priceOf(slug){return PRICES[slug]||'';},
  tagsOf(p){return (p.tg||[]).concat(TAGS[p.s]||[]);},
  badge(p){return p.sold?'<span class="badge sold">Satıldı</span>':((p.st==='Stokta')?'<span class="badge stok">Stoktan Teslim</span>':'<span class="badge tem">Temin Edilebilir</span>');}
};
// ---- Talep / Referans numarası ----
KS.newRef=function(){const d=new Date(),p=n=>('0'+n).slice(-2);
  const s=(''+d.getFullYear()).slice(2)+p(d.getMonth()+1)+p(d.getDate());
  const A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let r='';for(let i=0;i<4;i++)r+=A[Math.floor(Math.random()*A.length)];
  return 'KLS-'+s+'-'+r;};
KS.getRef=function(){if(!KS.cart.length)return '';let r;try{r=localStorage.getItem('ks_ref');}catch(e){r=window.__ref;}
  if(!r){r=KS.newRef();try{localStorage.setItem('ks_ref',r);}catch(e){window.__ref=r;}}return r;};
function clearRef(){try{localStorage.removeItem('ks_ref');}catch(e){}window.__ref=null;}
// ---- cart ----
function loadCart(){try{return JSON.parse(localStorage.getItem('ks_cart')||'[]');}catch(e){return window.__cart||[];}}
function saveCart(c){window.__cart=c;try{localStorage.setItem('ks_cart',JSON.stringify(c));}catch(e){}}
KS.cart = loadCart();
KS.cartCount=()=>KS.cart.reduce((a,i)=>a+(i.qty||1),0);
KS.addToCart=function(p){let it=KS.cart.find(x=>x.s===p.s);if(it)it.qty++;else KS.cart.push({s:p.s,n:p.n,c:p.c,img:p.th||p.img||'',qty:1});
  saveCart(KS.cart);updateCartUI();toast('Teklif sepetine eklendi');};
KS.setQty=function(s,d){let it=KS.cart.find(x=>x.s===s);if(!it)return;it.qty=Math.max(1,it.qty+d);saveCart(KS.cart);updateCartUI();};
KS.removeCart=function(s){KS.cart=KS.cart.filter(x=>x.s!==s);saveCart(KS.cart);if(!KS.cart.length)clearRef();updateCartUI();};
KS.clearCart=function(){KS.cart=[];saveCart(KS.cart);clearRef();updateCartUI();};
function cartMessage(){const ref=KS.getRef();let L=['Talep No: '+ref,'','Merhaba, asagidaki urunler icin teklif almak istiyorum:',''];
  KS.cart.forEach((i,n)=>L.push((n+1)+') '+i.n+(i.c?' ['+i.c+']':'')+' x '+i.qty));
  L.push('','Lutfen bu talebi '+ref+' referansiyla degerlendirin.','— Klimasun katalog talebi');return L.join('\n');}
KS.sendWhatsApp=function(){if(!KS.cart.length){toast('Sepet boş');return;}window.open('https://wa.me/'+M.whatsapp+'?text='+encodeURIComponent(cartMessage()),'_blank');};
KS.sendEmail=function(){if(!KS.cart.length){toast('Sepet boş');return;}const ref=KS.getRef();
  window.location.href='mailto:'+M.email+'?subject='+encodeURIComponent('Teklif Talebi ['+ref+'] - Klimasun')+'&body='+encodeURIComponent(cartMessage());};
// ---- tek ürün için hızlı teklif (referanslı) ----
KS.askProduct=function(o){const ref=KS.newRef();
  const msg='Talep No: '+ref+'\n\nMerhaba, "'+o.n+'"'+(o.c?' ['+o.c+']':'')+' urunu icin teklif almak istiyorum.\nLutfen bu talebi '+ref+' referansiyla degerlendirin.';
  window.open('https://wa.me/'+M.whatsapp+'?text='+encodeURIComponent(msg),'_blank');
  toast('Talep No: '+ref+' — WhatsApp açılıyor');};
let toEl;function toast(t){if(!toEl){toEl=document.createElement('div');toEl.className='toast';document.body.appendChild(toEl);}
  toEl.textContent=t;toEl.classList.add('show');clearTimeout(toEl._t);toEl._t=setTimeout(()=>toEl.classList.remove('show'),2600);}
KS.toast=toast;
KS.openCart=function(open){var d=document.getElementById('drawer');if(!d)return;
  if(open===undefined)open=!d.classList.contains('show');
  d.classList.toggle('show',open);document.getElementById('dbg').classList.toggle('show',open);};
function updateCartUI(){const b=document.getElementById('cart-badge');if(b)b.textContent=KS.cartCount();
  const box=document.getElementById('cart-items');if(!box)return;
  if(!KS.cart.length){box.innerHTML='<div class="empty">Sepetiniz boş.<br>Ürünlerdeki "Sepete Ekle" ile teklif listesi oluşturun.</div>';return;}
  const ref=KS.getRef();
  box.innerHTML='<div class="refbox">Talep No: <b>'+ref+'</b><br><span>Bu numarayı e-posta/WhatsApp mesajında ve telefonla ararken belirtin — talebinizi bu referansla takip ederiz.</span></div>'+
    KS.cart.map(i=>`<div class="qitem"><img src="${KS.img(i.img)}" onerror="this.src=KS.ph">
    <div style="flex:1"><div class="qc">${KS.esc(i.c||'')}</div><div class="qn">${KS.esc(i.n)}</div>
    <div class="qty"><button onclick="KS.setQty('${i.s}',-1)">−</button><b>${i.qty}</b><button onclick="KS.setQty('${i.s}',1)">+</button>
    <span class="rm" onclick="KS.removeCart('${i.s}')" style="margin-left:auto">Kaldır</span></div></div></div>`).join('');}
KS.updateCartUI=updateCartUI;
KS.applyPrices=function(root){(root||document).querySelectorAll('[data-pslug]').forEach(el=>{
  const pr=PRICES[el.getAttribute('data-pslug')];
  if(pr){el.textContent=pr;el.style.display='';}else{el.style.display='none';}});};
KS.card=function(p){const u='urun/'+encodeURIComponent(p.s)+'.html';
  const tags=KS.tagsOf(p).slice(0,3).map(t=>`<span class="tg">${KS.esc(t)}</span>`).join('');
  return `<div class="pcard"><a class="imgbox" href="${u}"><img loading="lazy" src="${KS.img(p.th||p.img)}" onerror="this.src=KS.ph" alt="${KS.esc(p.n)}"></a>
    <div class="body"><div class="code">${KS.esc(p.c||'')}</div>
      <a class="pn" href="${u}">${KS.esc(p.n)}</a>
      ${tags?`<div class="tags">${tags}</div>`:''}
      <div class="meta"><span class="brand">${KS.esc(p.bn||'')}</span>${KS.badge(p)}</div>
      <div class="price" data-pslug="${KS.esc(p.s)}" style="display:none"></div>
      <div class="acts"><button class="btn btn-y btn-sm" onclick='KS.addToCart(${JSON.stringify({s:p.s,n:p.n,c:p.c,th:p.th,img:p.img})})'>+ Sepete Ekle</button>
      <a class="btn btn-o btn-sm" href="${u}">İncele</a></div></div></div>`;};
document.addEventListener('DOMContentLoaded',function(){updateCartUI();KS.applyPrices();});
})();

function ksMore(id,btn){var el=document.getElementById(id);if(!el)return;if(el.hasAttribute('hidden')){el.removeAttribute('hidden');btn.textContent='− Daha az';}else{el.setAttribute('hidden','');btn.textContent=btn.getAttribute('data-more');}}
