/* ================= KLIMASUN AKILLI ASİSTAN =================
   Ana sayfadaki "ihtiyacını yaz, ürünü bul" kutusu.
   - Müşterinin serbest metnini analiz eder (Türkçe, niyet + anahtar kelime),
   - data/products.js kataloğunu İLK sorguda tembel (lazy) yükler,
   - En uygun ürünleri ve kategori kısayollarını gösterir.
   - Sunucu/AI anahtarı GEREKMEZ; ancak window.KS_AI_URL tanımlanırsa
     (örn. Vercel'deki /api/yonlendir) önce oradan cevap dener,
     hata/zaman aşımında yerel skorlamaya döner.
============================================================= */
(function(){
'use strict';

var LOADED=false, LOADING=null;

/* Türkçe küçük harf */
function tr(s){return (s==null?'':(''+s)).toLocaleLowerCase('tr');}
function esc(s){return (window.KS&&KS.esc)?KS.esc(s):(''+s);}

/* ---------- Niyet sözlüğü: kelime → alan(domain) desteği ---------- */
/* Her kural: kelime parçası → {dom: ağırlık} */
var INTENT=[
  [/\bpano|elektrik panosu|kumanda panosu|otomasyon panosu|panom\b/, {'pano-iklimlendirme':8,'rittal-yedek-parca':2,'sistem-aksesuarlari':2}],
  [/\bev\b|evim|konut|salon|yatak odas|oda(m|ya|da)?\b|daire/, {'klimalar':8,'vrf-klimalar':2}],
  [/ofis|mağaza|magaza|dükkan|dukkan|restoran|cafe|kafe|otel|işyeri|isyeri|ticari/, {'ticari-iklimlendirme':6,'fancoil':4,'chiller-sogutma':3,'vrf-klimalar':3,'klimalar':2}],
  [/fabrika|atölye|atolye|sanayi|endüstri|endustri|imalat|üretim|uretim|depo/, {'evaporatif-sogutma':6,'pano-iklimlendirme':5,'havalandirma':3,'chiller-sogutma':3}],
  [/chiller|su soğutma|su sogutma|soğutma grubu|sogutma grubu|proses|cnc|tezgah|lazer/, {'chiller-sogutma':9,'pano-iklimlendirme':2}],
  [/evaporatif|sulu soğutma|sulu sogutma/, {'evaporatif-sogutma':9}],
  [/sunucu|server|veri merkezi|data ?center|rack|sistem odas/, {'data-center':9,'pano-iklimlendirme':3}],
  [/nem alma|nem alıcı|nem alici|nemlendirme|rutubet|nem kontrol/, {'nem-kontrol':9}],
  [/havalandırma|havalandirma|fan(ı|i)?\b|aspiratör|aspirator|taze hava|egzoz/, {'havalandirma':7,'yedek-parca':2}],
  [/yedek|parça|parca|kompresör|kompresor|motor|kart|pcb|valf|vana|filtre|drayer|genleşme|genlesme/, {'yedek-parca':7,'rittal-yedek-parca':4}],
  [/rittal/, {'rittal-yedek-parca':5,'pano-iklimlendirme':4,'sistem-aksesuarlari':3,'rittal-el-aletleri':2}],
  [/aksesuar|montaj|sehpa|kumanda|termostat/, {'sistem-aksesuarlari':5,'aksesuarlar':5}],
  [/split|duvar tipi|inverter|klima\b/, {'klimalar':6,'vrf-klimalar':2}],
  [/vrf|multi split/, {'vrf-klimalar':8,'ticari-iklimlendirme':2}],
  [/fan ?coil|fancoil/, {'fancoil':9}],
  [/2\.? ?el|ikinci el|kullanılmış|kullanilmis/, {'2-el-urunler':8}],
  [/ısınıyor|isiniyor|aşırı ısı|asiri isi|soğutmuyor|sogutmuyor|ariza|arıza/, {'pano-iklimlendirme':3,'yedek-parca':3}],
  [/duman|tahliye/, {'duman-tahliye':9}],
  [/aydınlatma|aydinlatma|günışığı|gunisigi/, {'dogal-aydinlatma':9}]
];

var DOMLABEL={'yedek-parca':'Yedek Parça','pano-iklimlendirme':'Pano İklimlendirme','rittal-yedek-parca':'RITTAL Yedek Parça','sistem-aksesuarlari':'Rittal Sistem Aksesuarları','chiller-sogutma':'Chiller Soğutma','evaporatif-sogutma':'Evaporatif Soğutma','rittal-el-aletleri':'Rittal El Aletleri','fancoil':'FanCoil','data-center':'Rittal Data Center','diger-urunler':'Diğer Ürünler','aksesuarlar':'Aksesuarlar','havalandirma':'Havalandırma','nem-kontrol':'Nem Kontrol','2-el-urunler':'2.El Ürünler','otomasyon':'Otomasyon','klimalar':'Klimalar','ticari-iklimlendirme':'Ticari İklimlendirme','dogal-aydinlatma':'Doğal Aydınlatma','duman-tahliye':'Duman Tahliye','vrf-klimalar':'VRF Klimalar'};

/* Skorlamada anlam taşımayan dolgu kelimeleri */
var STOP=new Set(['için','icin','lazım','lazim','gerek','gerekiyor','istiyorum','arıyorum','ariyorum','bir','ve','ile','veya','ne','nasıl','nasil','önerirsiniz','onerirsiniz','var','mı','mi','bana','bize','alanı','uygun','olan','tipi','adet']);

function loadCatalog(){
  if(LOADED) return Promise.resolve();
  if(LOADING) return LOADING;
  LOADING=new Promise(function(res,rej){
    var done=0, need=['data/products.js','data/categories.js'];
    need.forEach(function(src){
      var sc=document.createElement('script');
      sc.src=src+'?v=asistan1';
      sc.onload=function(){ if(++done===need.length){LOADED=true;res();} };
      sc.onerror=function(){ rej(new Error('Katalog verisi yüklenemedi')); };
      document.head.appendChild(sc);
    });
  });
  return LOADING;
}

function intentDoms(qt){
  var w={};
  INTENT.forEach(function(rule){
    if(rule[0].test(qt)){ for(var d in rule[1]) w[d]=(w[d]||0)+rule[1][d]; }
  });
  return w;
}

function tokenize(qt){
  return qt.split(/[^a-zçğıöşü0-9.+-]+/).filter(function(t){
    return t.length>=2 && !STOP.has(t);
  });
}

function hay(p){
  if(!p._as){
    var f=p.f?Object.values(p.f).join(' '):'';
    var tg=(p.tg||[]).join(' ');
    p._as=tr((p.n||'')+' '+(p.c||'')+' '+(p.kw||'')+' '+(p.bn||'')+' '+tg+' '+f+' '+(p.dom||''));
  }
  return p._as;
}

function pdom(p){
  if(p.dom) return p.dom;
  var c=(p.cats&&p.cats[0])||p.pc||'';
  return c.split('--')[0];
}

var PARCA_RE=/yedek|parça|parca|bakım|bakim|temizle|kimyasal|filtre|kompresör|kompresor|motor|kart|valf|vana/;
var PARCA_CAT_RE=/yedek|bakim|temizle|kimyasal/;

function score(q){
  var qt=tr(q);
  var doms=intentDoms(qt);
  var toks=tokenize(qt);
  var parcaIstiyor=PARCA_RE.test(qt);
  var out=[];
  var P=window.KS_PRODUCTS||[];
  for(var i=0;i<P.length;i++){
    var p=P[i], s=0;
    var d=pdom(p);
    if(doms[d]) s+=doms[d];
    if(toks.length){
      var h=hay(p);
      if(!p._an) p._an=tr(p.n||'');
      for(var j=0;j<toks.length;j++){
        var t=toks[j];
        if(h.indexOf(t)>=0) s+=(t.length>=4?3:1.5);
        if(p._an.indexOf(t)>=0) s+=2; /* ürün adında geçiyorsa ekstra */
      }
    }
    if(s>0){
      if(p.st==='Stokta') s+=1.5;              /* stoktakiler öne */
      if(p.th||p.img) s+=0.5;                   /* görselli ürünler öne */
      /* Sorgu parça/bakım istemiyorsa, yedek parça & bakım ürünlerini geri it */
      if(!parcaIstiyor && PARCA_CAT_RE.test((p.pc||'')+' '+(p.tg||[]).join(' ').toLowerCase())) s*=0.45;
      out.push([s,p]);
    }
  }
  out.sort(function(a,b){return b[0]-a[0];});
  return {urunler:out.slice(0,5).map(function(x){return x[1];}), doms:doms};
}

function mesajYaz(q,r){
  if(!r.urunler.length)
    return 'Tam eşleşen ürün bulamadım. Aşağıdaki katalog bölümlerine göz atabilir ya da ihtiyacınızı biraz daha ayrıntılı yazabilirsiniz (örn. kapasite, kullanım yeri, marka).';
  var topDoms=Object.keys(r.doms).sort(function(a,b){return r.doms[b]-r.doms[a];});
  var alan=topDoms.length?(DOMLABEL[topDoms[0]]||topDoms[0]):null;
  return 'İhtiyacınıza göre '+(alan?('<b>'+esc(alan)+'</b> başta olmak üzere '):'')+'katalogdan şu ürünleri öne çıkardım. Detaya girip <b>sepete ekleyin</b> — tek tıkla WhatsApp/e-posta ile teklif isteyin.';
}

function kategoriLinkleri(r){
  var doms=Object.keys(r.doms).sort(function(a,b){return r.doms[b]-r.doms[a];}).slice(0,3);
  if(!doms.length && r.urunler.length){
    var seen={};
    r.urunler.forEach(function(p){var d=pdom(p);if(d&&!seen[d]){seen[d]=1;doms.push(d);}});
    doms=doms.slice(0,3);
  }
  return doms.map(function(d){
    return '<a class="ai-cat" href="urunler.html?alan='+encodeURIComponent(d)+'">'+esc(DOMLABEL[d]||d)+' →</a>';
  }).join('');
}

function urunKart(p){
  var img=(p.th||p.img)?esc(p.th||p.img):((window.KS&&KS.ph)||'');
  var payload=JSON.stringify({s:p.s,n:p.n,c:p.c,th:p.th||'',img:p.img||''}).replace(/"/g,'&quot;');
  return '<div class="ai-p">'+
    '<a href="urun/'+esc(p.s)+'.html"><img loading="lazy" src="'+img+'" onerror="this.src=KS.ph" alt="'+esc(p.n)+'"></a>'+
    '<div class="ai-p-body">'+
      '<a class="ai-p-n" href="urun/'+esc(p.s)+'.html">'+esc(p.n)+'</a>'+
      '<div class="ai-p-m">'+esc(p.bn||'')+(p.c?' · '+esc(p.c):'')+'</div>'+
      '<div class="ai-p-a">'+
        '<button class="btn btn-y btn-sm" onclick=\'KS.addToCart('+payload+')\'>+ Sepete Ekle</button>'+
        '<a class="btn btn-o btn-sm" href="urun/'+esc(p.s)+'.html">İncele</a>'+
      '</div>'+
    '</div></div>';
}

/* Opsiyonel uzak AI (Gemini destekli backend). 4 sn içinde dönmezse yerel devam. */
function remoteAI(q){
  if(!window.KS_AI_URL) return Promise.reject(new Error('yok'));
  var ctl=('AbortController' in window)?new AbortController():null;
  var t=setTimeout(function(){ if(ctl)ctl.abort(); },4000);
  return fetch(window.KS_AI_URL,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({ihtiyac:q}),
    signal:ctl?ctl.signal:undefined
  }).then(function(res){
    clearTimeout(t);
    if(!res.ok) throw new Error('AI servis hatası');
    return res.json();
  });
}

function goster(box,html){ box.innerHTML=html; box.style.display='block'; }

function calistir(q){
  var box=document.getElementById('ai-sonuc');
  var btn=document.getElementById('ai-btn');
  if(!q||q.trim().length<3){ if(window.KS&&KS.toast)KS.toast('Lütfen ihtiyacınızı birkaç kelimeyle yazın'); return; }
  q=q.trim().slice(0,300);
  btn.disabled=true; btn.textContent='Aranıyor…';
  goster(box,'<div class="ai-msg">Katalog taranıyor…</div>');

  var yerel=function(){
    return loadCatalog().then(function(){
      var r=score(q);
      var html='<div class="ai-msg"><span class="ai-rozet">🤖 KlimaSun Asistan</span> '+mesajYaz(q,r)+'</div>';
      if(r.urunler.length) html+='<div class="ai-plist">'+r.urunler.map(urunKart).join('')+'</div>';
      var kl=kategoriLinkleri(r);
      if(kl) html+='<div class="ai-cats">'+kl+'</div>';
      html+='<div class="ai-alt">Sonuçlar yeterli değilse: <a href="urunler.html?q='+encodeURIComponent(q)+'">detaylı filtreli aramayı açın</a> ya da <a href="https://wa.me/'+((window.KS_META||{}).whatsapp||'')+'?text='+encodeURIComponent('Merhaba, şunu arıyorum: '+q)+'" target="_blank" rel="noopener">WhatsApp\'tan uzmana sorun</a>.</div>';
      goster(box,html);
    });
  };

  remoteAI(q).then(function(data){
    /* Uzak AI cevabı: {mesaj, urunler:[{slug|s, ad|n, ...}]} biçimini esnek karşıla */
    var urunler=(data.urunler||[]).slice(0,5);
    var html='<div class="ai-msg"><span class="ai-rozet">🤖 KlimaSun Asistan</span> '+esc(data.mesaj||'')+'</div>';
    if(urunler.length){
      html+='<div class="ai-plist">'+urunler.map(function(u){
        return urunKart({s:u.s||u.slug,n:u.n||u.ad,c:u.c||u.kod||'',bn:u.bn||'',th:u.th||'',img:u.img||''});
      }).join('')+'</div>';
    }
    html+='<div class="ai-alt"><a href="urunler.html?q='+encodeURIComponent(q)+'">Detaylı filtreli arama →</a></div>';
    goster(box,html);
  }).catch(function(){
    yerel().catch(function(){
      goster(box,'<div class="ai-msg">Katalog verisi yüklenemedi. <a href="urunler.html?q='+encodeURIComponent(q)+'">Ürünler sayfasında aramayı deneyin →</a></div>');
    });
  }).finally?undefined:null;

  /* finally her tarayıcıda olmayabilir; buton durumunu ayrı sıfırla */
  Promise.resolve().then(function(){
    var iv=setInterval(function(){
      if(box.innerHTML.indexOf('taranıyor')<0){ btn.disabled=false; btn.textContent='Ürün Bul'; clearInterval(iv); }
    },300);
    setTimeout(function(){ btn.disabled=false; btn.textContent='Ürün Bul'; clearInterval(iv); },8000);
  });
}

window.KS_ASISTAN={
  sor:function(){ calistir((document.getElementById('ai-q')||{}).value||''); },
  ornek:function(el){ var i=document.getElementById('ai-q'); i.value=el.textContent; i.focus(); calistir(i.value); },
  _score:score /* test/teşhis için */
};

document.addEventListener('DOMContentLoaded',function(){
  var i=document.getElementById('ai-q');
  if(i) i.addEventListener('keydown',function(e){ if(e.key==='Enter'){ e.preventDefault(); calistir(i.value); } });
});
})();
