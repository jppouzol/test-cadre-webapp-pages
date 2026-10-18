# Génère public/icon-192.png et public/icon-512.png à partir de public/icon.svg.
# Usage : python3 outils/icones.py <dossier du dépôt>
import sys, pathlib, glob
from playwright.sync_api import sync_playwright
racine = pathlib.Path(sys.argv[1])
svg = (racine / 'public/icon.svg').read_text(encoding='utf-8')
chrome = glob.glob('/opt/pw-browsers/chromium-*/chrome-linux/chrome')[0]
with sync_playwright() as p:
    navigateur = p.chromium.launch(executable_path=chrome)
    for taille in (192, 512):
        page = navigateur.new_page(viewport={'width': taille, 'height': taille})
        page.set_content(f'<style>html,body{{margin:0}}svg{{width:{taille}px;height:{taille}px;display:block}}</style>{svg}')
        page.screenshot(path=str(racine / f'public/icon-{taille}.png'), omit_background=True)
    navigateur.close()
