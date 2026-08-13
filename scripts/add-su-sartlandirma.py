#!/usr/bin/env python3
# Tek seferlik: Su Şartlandırma ürün paketini (8 ürün) kataloğa ekler.
# Kaynak: scratchpad/paket/klimasun_paket/{urunler.json, urun-detaylari.html}
# Markalar ADEY / SVOD-AS / AQUABION. Fiyat yok (teklif). Belirtilenler 1 adet stoklu.
# Idempotent.

import json, os, re, html, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(ROOT, "klimasun-2026/data/products.json")
C = os.path.join(ROOT, "klimasun-2026/data/categories.json")
VB = os.path.join(ROOT, "lib/visible-brands.json")
SP = "/tmp/claude-0/-home-user-eeuek/86b0abf9-ed65-5404-b3fd-967d3aea420c/scratchpad/paket/klimasun_paket"
DRY = "--dry" in sys.argv

TOP = "su-sartlandirma"
TOP_NAME = "Su Şartlandırma"
TOP_INTRO = (
    "Su şartlandırma ürünleri; evaporatif soğutucu, chiller ve sıcak su hatlarında kireç "
    "kabuklaşmasını ve tortuyu kontrol altına alarak verimi ve ekipman ömrünü korur. Bu kategoride "
    "elektriksiz-kimyasalsız kireç önleme cihazları (ADEY Electroscale), kartuşlu kireç önleyici "
    "filtreler (SVOD-AS), galvanik su şartlandırıcılar (AQUABION), profesyonel kireç sökücü "
    "kimyasallar ve yedek kartuşlar yer alır. Doğru ürün; su sertliği, debi ve hat çapına göre "
    "seçilir — hızlı teklif formundan bu bilgileri iletmeniz yeterlidir."
)
SUBS = [
    ("su-sartlandirma--kirec-onleme-cihazlari", "Kireç Önleme Cihazları"),
    ("su-sartlandirma--kirec-sokucu-kimyasallar", "Kireç Sökücü Kimyasallar"),
    ("su-sartlandirma--yedek-kartuslar", "Yedek Kartuşlar"),
]
BRANDS = ["ADEY", "SVOD-AS", "AQUABION"]

IMG = "assets/products/su-sartlandirma/"
SEMA = "/gorseller/su-sartlandirma/semalar/"
DOC = "/belgeler/su-sartlandirma/"

# kod -> (görsel adı, şema dosyası|None, pdf dosyası, pc alt-kategori)
CFG = {
    "ADY-ES-DN15": ("electroscale", "electroscale_sema", "adey-electroscale-tds", "kirec-onleme-cihazlari"),
    "ADY-ES-DN22": ("electroscale", "electroscale_sema", "adey-electroscale-tds", "kirec-onleme-cihazlari"),
    "SVD-SF100B":  ("svod-sf100b", "svodfiltre_sema", "svod-sf100b-tds", "kirec-onleme-cihazlari"),
    "SVD-TVN":     ("svod-tvn", "tvn_sema", "svod-tvn-tds", "kirec-sokucu-kimyasallar"),
    "AQB-INLINE":  ("aquabion", "aquabion_sema", "aquabion-tds", "kirec-onleme-cihazlari"),
    "SVD-SC100":   ("svod-sc100", None, "svod-yedek-kartuslar-tds", "yedek-kartuslar"),
    "SVD-S250":    ("svod-s250", None, "svod-yedek-kartuslar-tds", "yedek-kartuslar"),
    "SVD-SC400":   ("svod-sc400", None, "svod-yedek-kartuslar-tds", "yedek-kartuslar"),
}
# İkincil kategori bağlama (Talimat: Evaporatif Soğutma / Yedek Parça)
SECOND = {
    "kirec-onleme-cihazlari": "evaporatif-sogutma--yedekparca-ve-bakim-urunleri",
    "kirec-sokucu-kimyasallar": "evaporatif-sogutma--yedekparca-ve-bakim-urunleri",
    "yedek-kartuslar": "yedek-parca--yedek-parca",
}

def parse_specs():
    t = open(os.path.join(SP, "urun-detaylari.html"), encoding="utf-8", errors="ignore").read()
    out = {}
    for c in CFG:
        m = re.search(r'id="' + re.escape(c) + r'".*?(?=<section id=|\Z)', t, flags=re.S)
        seg = m.group(0) if m else ""
        tbl = re.search(r"<table.*?</table>", seg, flags=re.S)
        rows = {}
        if tbl:
            for tr in re.findall(r"<tr.*?</tr>", tbl.group(0), flags=re.S):
                cells = [html.unescape(re.sub(r"<[^>]+>", "", x)).strip()
                         for x in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", tr, flags=re.S)]
                if len(cells) >= 2:
                    rows[cells[0]] = cells[1]
        out[c] = rows
    return out

def href_for(code, data):
    u = next(x for x in data if x["kod"] == code)
    sub = CFG[code][3]
    return f"/urun/{TOP}/{sub}/{u['slug']}"

def main():
    d = json.load(open(P, encoding="utf-8"))
    cats = json.load(open(C, encoding="utf-8"))
    try:
        vb = json.load(open(VB, encoding="utf-8"))
    except FileNotFoundError:
        vb = []
    pkg = json.load(open(os.path.join(SP, "urunler.json"), encoding="utf-8"))["urunler"]
    specs = parse_specs()

    # Kategori (flat + tree)
    flat = {c["slug"] for c in cats["flat"]}
    if TOP not in flat:
        cats["flat"].append({"slug": TOP, "name": TOP_NAME, "count": 0, "intro": TOP_INTRO})
    for slug, name in SUBS:
        if slug not in flat:
            cats["flat"].append({"slug": slug, "name": name, "count": 0})
    if not any(t["slug"] == TOP for t in cats["tree"]):
        cats["tree"].append({"slug": TOP, "name": TOP_NAME, "count": 0, "intro": TOP_INTRO,
                             "children": [{"slug": s, "name": n, "count": 0} for s, n in SUBS]})

    for b in BRANDS:
        if b not in vb:
            vb.append(b)

    existing = {str(p["c"]).strip().lower() for p in d}
    slugs = {p["s"] for p in d}
    added = 0
    for u in pkg:
        code = u["kod"]
        if code.lower() in existing or u["slug"] in slugs:
            print("  atlandı:", code); continue
        imgname, sema, pdf, sub = CFG[code]
        pc = f"{TOP}--{sub}"
        cats_list = [pc, SECOND[sub]]
        in_stock = code != "AQB-INLINE"  # AQUABION: model seçimi -> tedarik/teklif
        rich = {
            "features": u["ozellikler"],
            "docs": [{"label": "Teknik Föy (TDS)", "href": f"{DOC}{pdf}.pdf"}],
        }
        if sema:
            rich["schema"] = f"{SEMA}{sema}.jpg"
        if u.get("uyari"):
            rich["warn"] = u["uyari"]
        if u.get("capraz_satis"):
            rich["crosssell"] = u["capraz_satis"]
        if u.get("iliskili"):
            rel = []
            for rc in u["iliskili"]:
                ru = next((x for x in pkg if x["kod"] == rc), None)
                if ru:
                    rel.append({"label": ru["ad"], "href": href_for(rc, pkg)})
            if rel:
                rich["related"] = rel
        np = {
            "s": u["slug"], "n": u["ad"], "c": code, "b": u["marka"].lower(), "bn": u["marka"],
            "img": f"{IMG}{imgname}.jpg", "th": f"{IMG}{imgname}_min.jpg",
            "cats": cats_list, "sd": u["kisa_aciklama"], "ld": u["kisa_aciklama"],
            "kw": f"{u['ad']} {code} {u['marka']} su şartlandırma kireç önleme".lower(),
            "st": "Stokta" if in_stock else "Stokta Yok", "pr": "", "tg": [],
            "dom": TOP, "f": specs.get(code, {}), "pc": pc, "rich": rich,
            "mt": u["seo_title"], "md": u["meta_description"],
        }
        if in_stock:
            np["sq"] = 1
        d.append(np); added += 1

    print(f"Eklenen: {added} | toplam: {len(d)} | markalar: {BRANDS} | kategori: {TOP_NAME}")
    if DRY:
        print("[DRY]"); return
    json.dump(d, open(P, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    json.dump(cats, open(C, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    json.dump(vb, open(VB, "w", encoding="utf-8"), ensure_ascii=False)
    print("Yazıldı.")

if __name__ == "__main__":
    main()
