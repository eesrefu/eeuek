/* Klimasun 2026 - shared app logic (no server needed) */
(function(){
const M = window.KS_META || {};
const PH = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#f2f3f5"/><g fill="none" stroke="#c7ccd4" stroke-width="6"><rect x="52" y="60" width="96" height="80" rx="6"/><path d="M52 118l28-26 24 20 20-16 24 22"/></g><text x="100" y="170" font-family="Arial" font-size="14" fill="#9aa1ab" text-anchor="middle">Görsel yok</text></svg>');

window.KS = {
  M,
  esc(s){return (s==null?'':(''+s)).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));},
  img(p){return (p && p.length) ? p : PH;},
  ph:PH
};

/* ---------- cart ---------- */
function loadCart(){try{return JSON.parse(localStorage.getItem('ks_cart')||'[]');}catch(e){return window.__cart||[];}}
function saveCart(c){window.__cart=c;try{localStorage.setItem('ks_cart',JSON.stringify(c));}catch(e){}}
KS.cart = loadCart();
KS.cartCount=()=>KS.cart.reduce((a,i)=>a+(i.qty||1),0);
KS.addToCart=function(p){
  let it=KS.cart.find(x=>x.s===p.s);
  if(it) it.qty++; else KS.cart.push({s:p.s,n:p.n,c:p.c,img:p.th||p.img||'',qty:1});
  saveCart(KS.cart); updateCartUI(); toast('Teklif sepetine eklendi');
};
KS.setQty=function(s,d){let it=KS.cart.find(x=>x.s===s);if(!it)return;it.qty=Math.max(1,it.qty+d);saveCart(KS.cart);updateCartUI();};
KS.removeCart=function(s){KS.cart=KS.cart.filter(x=>x.s!==s);saveCart(KS.cart);updateCartUI();};
KS.clearCart=function(){KS.cart=[];saveCart(KS.cart);updateCartUI();};

function cartMessage(){
  let L=['Merhaba, asagidaki urunler icin teklif almak istiyorum:',''];
  KS.cart.forEach((i,n)=>{L.push((n+1)+') '+i.n+(i.c?' ['+i.c+']':'')+' x '+i.qty);});
  L.push('','— Klimasun katalog talebi');
  return L.join('\n');
}
KS.sendWhatsApp=function(){
  if(!KS.cart.length){toast('Sepet boş');return;}
  window.open('https://wa.me/'+M.whatsapp+'?text='+encodeURIComponent(cartMessage()),'_blank');
};
KS.sendEmail=function(){
  if(!KS.cart.length){toast('Sepet boş');return;}
  window.location.href='mailto:'+M.email+'?subject='+encodeURIComponent('Teklif Talebi - Klimasun')+'&body='+encodeURIComponent(cartMessage());
};

/* ---------- toast ---------- */
let toEl;
function toast(t){if(!toEl){toEl=document.createElement('div');toEl.className='toast';document.body.appendChild(toEl);}
  toEl.textContent=t;toEl.classList.add('show');clearTimeout(toEl._t);toEl._t=setTimeout(()=>toEl.classList.remove('show'),1800);}
KS.toast=toast;

/* ---------- header / footer / drawer injection ---------- */
KS.initChrome=function(active){
  const wa=M.whatsapp, waD=M.waDisplay, ph=M.phone, phD=M.phoneDisplay;
  const nav=[['index.html','Ana Sayfa','home'],['urunler.html','Ürünler','urunler'],
    ['markalar.html','Markalar','markalar'],['kategoriler.html','Kategoriler','kategoriler'],
    ['iletisim.html','İletişim','iletisim']];
  const h=document.getElementById('app-header');
  if(h){h.outerHTML=`<header class="top"><div class="wrap">
    <a class="brand" href="index.html"><img class="logo" src="assets/logo.png" alt="Klimasun" onerror="this.style.display='none'">
      <span>KLIMASUN<small>ENDÜSTRİYEL İKLİMLENDİRME</small></span></a>
    <nav class="main">${nav.map(n=>`<a href="${n[0]}" class="${active===n[2]?'active':''}">${n[1]}</a>`).join('')}</nav>
    <div class="sp"></div>
    <div class="hphone">☎ <b>${phD}</b></div>
    <button class="btn btn-y cartbtn" onclick="KS.openCart()">🧾 Teklif Sepeti<span class="badge" id="cart-badge">0</span></button>
    <button class="burger" onclick="document.querySelector('nav.main').style.display=(getComputedStyle(document.querySelector('nav.main')).display==='none'?'flex':'none')">☰</button>
  </div></header>`;}
  const f=document.getElementById('app-footer');
  if(f){f.outerHTML=`<footer class="foot"><div class="wrap"><div class="cols">
    <div class="fbrand"><b>KLIMA<span class="y">SUN</span></b>
      <p style="max-width:340px;margin:12px 0 0;font-size:14px">RITTAL, Cosmotec, Stulz pano klimaları, FORM FES evaporatif soğutma cihazları ve endüstriyel yedek parça tedariki. Kurumsal satış, stoktan hızlı sevkiyat.</p></div>
    <div><h5>Katalog</h5><a href="urunler.html">Tüm Ürünler</a><a href="kategoriler.html">Kategoriler</a><a href="markalar.html">Markalar</a></div>
    <div><h5>Kurumsal</h5><a href="iletisim.html">İletişim</a><a href="https://wa.me/${wa}" target="_blank">WhatsApp</a><a href="tel:${ph}">Telefon</a></div>
    <div><h5>İletişim</h5><a href="tel:${ph}">☎ ${phD}</a><a href="https://wa.me/${wa}" target="_blank">💬 ${waD}</a><a href="mailto:${M.email}">✉ ${M.email}</a></div>
  </div><div class="fbot"><span>© ${new Date().getFullYear()} Klimasun — Endüstriyel İklimlendirme Kataloğu</span><span>${M.productCount} ürün · ${M.brandCount} marka</span></div></div></footer>`;}
  // drawer
  const d=document.createElement('div');
  d.innerHTML=`<div class="drawer-bg" id="dbg" onclick="KS.openCart(false)"></div>
    <aside class="drawer" id="drawer"><div class="dh"><b>Teklif Sepeti</b><span onclick="KS.openCart(false)">✕</span></div>
    <div class="items" id="cart-items"></div>
    <div class="df">
      <button class="btn btn-y" onclick="KS.sendWhatsApp()">💬 WhatsApp ile Teklif İste</button>
      <button class="btn btn-d" onclick="KS.sendEmail()">✉ E-posta ile Gönder</button>
      <button class="btn btn-o btn-sm" onclick="KS.clearCart()">Sepeti Temizle</button>
    </div></aside>`;
  document.body.appendChild(d);
  updateCartUI();
};
KS.openCart=function(open){if(open===undefined)open=!document.getElementById('drawer').classList.contains('show');
  document.getElementById('drawer').classList.toggle('show',open);
  document.getElementById('dbg').classList.toggle('show',open);};
function updateCartUI(){
  const b=document.getElementById('cart-badge');if(b)b.textContent=KS.cartCount();
  const box=document.getElementById('cart-items');if(!box)return;
  if(!KS.cart.length){box.innerHTML='<div class="empty">Sepetiniz boş.<br>Ürünlerdeki "Sepete Ekle" ile teklif listesi oluşturun.</div>';return;}
  box.innerHTML=KS.cart.map(i=>`<div class="qitem"><img src="${KS.img(i.img)}" onerror="this.src=KS.ph">
    <div style="flex:1"><div class="qc">${KS.esc(i.c||'')}</div><div class="qn">${KS.esc(i.n)}</div>
    <div class="qty"><button onclick="KS.setQty('${i.s}',-1)">−</button><b>${i.qty}</b><button onclick="KS.setQty('${i.s}',1)">+</button>
    <span class="rm" onclick="KS.removeCart('${i.s}')" style="margin-left:auto">Kaldır</span></div></div></div>`).join('');
}
KS.updateCartUI=updateCartUI;

/* ---------- product card ---------- */
KS.card=function(p){
  const st=p.st&&p.st.indexOf('Stok')===0?'<span class="badge stok">Stokta</span>':'<span class="badge tedarik">Tedarik</span>';
  const u=(p.pc&&p.pc.indexOf('--')>0)?('/urun/'+p.pc.replace('--','/')+'/'+encodeURIComponent(p.s)+'.html'):('urun.html?u='+encodeURIComponent(p.s));
  return `<div class="pcard">
    <a class="imgbox" href="${u}"><img loading="lazy" src="${KS.img(p.th||p.img)}" onerror="this.src=KS.ph" alt="${KS.esc(p.n)}"></a>
    <div class="body">
      <div class="code">${KS.esc(p.c||'')}</div>
      <a class="pn" href="${u}">${KS.esc(p.n)}</a>
      <div class="meta"><span class="brand">${KS.esc(p.bn||'')}</span>${st}</div>
      <div class="acts"><button class="btn btn-y btn-sm" onclick='KS.addToCart(${JSON.stringify({s:p.s,n:p.n,c:p.c,th:p.th,img:p.img})})'>+ Sepete Ekle</button>
      <a class="btn btn-o btn-sm" href="${u}">İncele</a></div>
    </div></div>`;
};
KS.qp=function(k){return new URLSearchParams(location.search).get(k)||'';};
})();
