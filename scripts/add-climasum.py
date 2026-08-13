#!/usr/bin/env python3
# Tek seferlik: Climasum evaporatif bakım ürünlerini + markasını kataloğa ekler.
# 4 SKU + 1 bakım seti. Fiyatlar TL (liste, +KDV). Her ürün 1 adet stoklu.
# TDS/SDS PDF'leri /belgeler/climasum altında. Adetli iskonto CTA'sı.
# Idempotent: var olan kod/slug tekrar eklenmez.

import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(ROOT, "klimasun-2026/data/products.json")
VB = os.path.join(ROOT, "lib/visible-brands.json")
DRY = "--dry" in sys.argv

BRAND, BSLUG = "Climasum", "climasum"
DOM = "evaporatif-sogutma"
PC = "evaporatif-sogutma--yedekparca-ve-bakim-urunleri"
IMG = "assets/products/climasum/"
DOC = "/belgeler/climasum/"
PHONE = "0505 959 87 70"
BULK = {"tiers": [["100 adet ve üzeri", "%5"], ["500 adet ve üzeri", "%10"], ["1.000 adet ve üzeri", "%30"]], "phone": PHONE}

def price(v):
    return {"cur": "TRY", "sale": v, "list": None, "kdv": True, "bulk": BULK}

def docs(slug):
    return [
        {"label": "Teknik Föy (TDS)", "href": f"{DOC}{slug}-tds.pdf"},
        {"label": "Güvenlik Bilgi Formu (SDS)", "href": f"{DOC}{slug}-sds.pdf"},
    ]

def prod(s, n, c, img, sd, ld, kw, f, prc, rich, mt, md):
    d = {"s": s, "n": n, "c": c, "b": BSLUG, "bn": BRAND,
         "img": f"{IMG}{img}.jpg" if img else "", "th": f"{IMG}{img}_min.jpg" if img else "",
         "cats": [PC], "sd": sd, "ld": ld, "kw": kw, "st": "Stokta", "pr": "", "tg": [],
         "dom": DOM, "f": f, "pc": PC, "prc": prc, "sq": 1}
    if rich: d["rich"] = rich
    if mt: d["mt"] = mt
    if md: d["md"] = md
    return d

PRODUCTS = [
    prod("padclean-15-evaporatif-ped-kirec-cozucu",
         "PadClean 1,5 L — Evaporatif Ped Kireç Çözücü", "CLS-PADCLEAN-1.5",
         "padclean-15",
         "Selülozik ped ve su tankındaki kireci çözen ped dostu bakım kimyasalı. 1,5 L.",
         "Selülozik evaporatif ped, su tankı ve dağıtım hattındaki kireç ve mineral birikintisini çözer. Pedin reçine bağlayıcısına ve galvanizli yüzeye zarar vermeyen, ped dostu formül. Tehlikesiz sınıf, parfümlü.",
         "padclean evaporatif ped kireç çözücü bakım kimyasalı climasum 1.5 l fes ped temizleme",
         {"Tip": "Kireç çözücü (asidik bakım)", "Ambalaj": "1,5 L şişe", "Uyumluluk": "Selülozik ped, galvanizli yüzey", "Sınıf": "Tehlikesiz sınıf · parfümlü"},
         price(550),
         {"badges": ["Ped dostu", "Tehlikesiz sınıf", "Parfümlü"], "docs": docs("padclean"),
          "faq": [
              {"q": "PadClean pede zarar verir mi?", "a": "Hayır. PadClean, selülozik pedin reçine bağlayıcısına ve galvanizli yüzeylere zarar vermeyecek şekilde formüle edilmiştir; agresif mineral asitlerin aksine pedin ömrünü kısaltmaz."},
              {"q": "Ne sıklıkla kullanılır?", "a": "Kireç birikimine ve su sertliğine göre değişir; genellikle sezon başında ve periyodik bakımda uygulanır. Sisteminize uygun program için bize ulaşın."},
          ]},
         "PadClean 1,5 L Evaporatif Ped Kireç Çözücü | Klimasun",
         "Selülozik ped ve su tankındaki kireci çözen ped dostu bakım kimyasalı — 1,5 L, tehlikesiz sınıf, parfümlü. Adetli alımda iskonto için arayın."),

    prod("padclean-10-evaporatif-ped-kirec-cozucu-bidon",
         "PadClean 10 L — Evaporatif Ped Kireç Çözücü (Servis Bidonu)", "CLS-PADCLEAN-10",
         "padclean-10",
         "Servis ve çoklu ünite bakımı için 10 L ekonomik bidon. 1:1 seyreltmeyle ≈20 L çözelti.",
         "Servis ekipleri ve çoklu ünite bakımı için ekonomik 10 L bidon. 1:1 seyreltmeyle yaklaşık 20 litre kullanıma hazır çözelti verir. ADR kapsamı dışı, piktogramsız taşıma.",
         "padclean 10 l bidon evaporatif ped kireç çözücü servis climasum toplu bakım",
         {"Tip": "Kireç çözücü (asidik bakım)", "Ambalaj": "10 L bidon", "Verim": "1:1 seyreltme ≈ 20 L çözelti", "Taşıma": "ADR kapsamı dışı · piktogram yok"},
         price(5000),
         {"badges": ["ADR kapsamı dışı", "Piktogram yok", "Servis boyu"], "docs": docs("padclean"),
          "faq": [
              {"q": "10 L bidon ne kadar çözelti verir?", "a": "1:1 seyreltmeyle yaklaşık 20 litre kullanıma hazır çözelti elde edilir; servis ekipleri ve çoklu ünite bakımı için ekonomiktir."},
          ]},
         "PadClean 10 L Evaporatif Ped Kireç Çözücü Servis Bidonu | Klimasun",
         "Servis ve çoklu ünite bakımı için 10 L kireç çözücü bidon; 1:1 seyreltmeyle ≈20 L çözelti, ADR kapsamı dışı. Adetli alımda iskonto için arayın."),

    prod("scaleguard-500g-kirec-onleyici-file",
         "ScaleGuard 500 g — Kireç Önleyici (Mineral Küre File)", "CLS-SCALEGUARD-500",
         "scaleguard",
         "Tanka bırakılan file içindeki mineral küreler kabuklaşmayı ve korozyonu önler. 3–6 ay etkili.",
         "Tanka bırakılan file içindeki mineral küreler sertlik minerallerini askıda tutar; kireç kabuklaşmasını ve korozyonu önler. Tek dozaj 3–6 ay dayanır — sezon boyu koruma, kokusuz.",
         "scaleguard kireç önleyici mineral küre file evaporatif tank climasum kabuklaşma korozyon",
         {"Tip": "Kireç önleyici (mineral küre file)", "Ambalaj": "500 g · 5 × 100 g file", "Dozaj ömrü": "3–6 ay", "Etki": "Kabuklaşma ve korozyon önleme"},
         price(2300),
         {"badges": ["Sezon boyu", "5 × 100 g file", "Kokusuz"], "docs": docs("scaleguard"),
          "faq": [
              {"q": "Bir file ne kadar dayanır?", "a": "Tek dozaj su sertliği ve kullanım yoğunluğuna göre 3–6 ay etkilidir; genellikle bir sezon boyunca koruma sağlar."},
              {"q": "Kimyasal katkı bırakır mı?", "a": "Mineral küreler sertlik minerallerini fiziksel olarak askıda tutar; kokusuz çalışır ve suya renk/koku bırakmaz."},
          ]},
         "ScaleGuard 500 g Evaporatif Kireç Önleyici Mineral File | Klimasun",
         "Tanka bırakılan mineral küre file ile kabuklaşma ve korozyonu önleyin — 3–6 ay etkili, kokusuz. Adetli alımda iskonto için arayın."),

    prod("biotab-200-yosun-koku-kontrol-tableti",
         "BioTab 200 Adet — Yosun & Koku Kontrol Tableti", "CLS-BIOTAB-200",
         "biotab",
         "Yavaş çözünen tablet; yosun, biyofilm ve kokuyu kontrol eder, Legionella riskini azaltmaya katkı sağlar.",
         "Rezervuara ve drenaj tavasına atılan yavaş çözünen tablet; yosun, biyofilm ve kokuyu kontrol altında tutar, Legionella riskinin azaltılmasına katkı sağlar. %100 çözünür, kalıntısız. Biyosidal ürün — kullanmadan önce etiketi ve ürün bilgilerini okuyun.",
         "biotab yosun koku kontrol tableti legionella biyosidal evaporatif rezervuar climasum biyofilm",
         {"Tip": "Yosun & koku kontrol tableti (biyosidal)", "Ambalaj": "200 adet tablet", "Kullanım": "Rezervuar / drenaj tavası", "Çözünürlük": "%100 çözünür · kalıntısız"},
         price(10250),
         {"badges": ["Legionella kontrolü", "%100 çözünür", "Kalıntısız"], "docs": docs("biotab"),
          "note": "BioTab™ biyosidal ürün mevzuatı kapsamındadır. Biyosidal ürünleri güvenli kullanın; kullanmadan önce etiketi ve ürün bilgilerini okuyun.",
          "faq": [
              {"q": "BioTab Legionella'yı önler mi?", "a": "BioTab yosun, biyofilm ve kokuyu kontrol altında tutarak Legionella riskinin azaltılmasına katkı sağlar. Tam koruma; doğru dozaj, düzenli bakım ve su yönetimi ile birlikte sağlanır."},
              {"q": "Tablet kalıntı bırakır mı?", "a": "Tabletler %100 çözünür ve kalıntısızdır; rezervuar ve drenaj tavasında iz bırakmadan çözünür."},
          ]},
         "BioTab 200 Adet Yosun & Koku Kontrol Tableti (Legionella) | Klimasun",
         "Rezervuar ve drenaj tavası için yavaş çözünen tablet — yosun, koku ve biyofilm kontrolü, Legionella riskini azaltmaya katkı. Adetli alımda iskonto için arayın."),

    prod("climasum-bakim-seti-evaporatif",
         "Climasum Bakım Seti — Evaporatif Soğutma (Temizle · Önle · Koru)", "CLS-SET",
         "",  # sete özel görsel yok — placeholder
         "PadClean 1,5 L + ScaleGuard 500 g + BioTab 200'lü komple sezonluk bakım programı.",
         "Evaporatif soğutma sisteminiz için komple bakım programı tek pakette: PadClean 1,5 L kireci çözer, ScaleGuard 500 g oluşumunu önler, BioTab 200'lü suyu temiz tutar. Temizle, önle, koru.",
         "climasum bakım seti evaporatif soğutma padclean scaleguard biotab program sezonluk",
         {"İçerik": "PadClean 1,5 L + ScaleGuard 500 g + BioTab 200 adet", "Program": "Temizle · Önle · Koru", "Uygulama": "Evaporatif soğutma / FES sistemleri"},
         price(13100),
         {"badges": ["Komple program", "Sezonluk", "3'lü set"],
          "faq": [
              {"q": "Set neleri içerir?", "a": "PadClean 1,5 L (kireç çözücü), ScaleGuard 500 g (kireç önleyici) ve BioTab 200'lü (yosun & koku kontrolü). Üçü birbirini tamamlayan komple sezonluk bakım programı sunar."},
              {"q": "Kendi markamızla üretim mümkün mü?", "a": "Evet, ürünler kendi markanız ve etiketinizle de üretilebilir. Detaylar için bize ulaşın."},
          ]},
         "Climasum Evaporatif Bakım Seti — PadClean + ScaleGuard + BioTab | Klimasun",
         "Evaporatif soğutma için komple bakım seti: kireci çözer, oluşumunu önler, suyu temiz tutar. Adetli alımda iskonto için arayın."),
]

def main():
    d = json.load(open(P, encoding="utf-8"))
    try:
        vb = json.load(open(VB, encoding="utf-8"))
    except FileNotFoundError:
        vb = []
    existing = {str(p["c"]).strip().lower() for p in d}
    slugs = {p["s"] for p in d}
    if BRAND not in vb:
        vb.append(BRAND)
    added = 0
    for np in PRODUCTS:
        if np["c"].lower() in existing or np["s"] in slugs:
            print("  atlandı (var):", np["c"]); continue
        d.append(np); added += 1
    print(f"Eklenen: {added} | toplam: {len(d)} | marka {BRAND} beyaz listede")
    if DRY:
        print("[DRY]"); return
    json.dump(d, open(P, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    json.dump(vb, open(VB, "w", encoding="utf-8"), ensure_ascii=False)
    print("Yazıldı.")

if __name__ == "__main__":
    main()
