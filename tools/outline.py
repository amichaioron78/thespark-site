import sys,re
from bs4 import BeautifulSoup
path=sys.argv[1]; maxp=int(sys.argv[2]) if len(sys.argv)>2 else 200
s=open(path,encoding='utf-8').read()
soup=BeautifulSoup(s,'html.parser')
for t in soup(['script','style','noscript']): t.decompose()
body=soup.body
nav=body.find('div',class_='navbar'); 
if nav: nav.decompose()
foot=body.find('footer'); 
if foot: foot.decompose()
def walk(el,depth=0):
    for c in el.children:
        if getattr(c,'name',None) is None: continue
        if c.name in ('h1','h2','h3','h4','h5','h6'):
            print('  '*depth+f'[{c.name}] '+c.get_text(' ',strip=True)[:300])
        elif c.name in ('p','li','blockquote'):
            t=c.get_text(' ',strip=True)
            if t: print('  '*depth+c.name+': '+t[:maxp])
            if c.name=='li': walk(c,depth+1)
        elif c.name=='a':
            t=c.get_text(' ',strip=True)
            print('  '*depth+f'a({c.get("href")}): {t[:60]}')
            walk(c,depth+1)
        elif c.name=='img':
            print('  '*depth+f'img {c.get("src","")[-70:]} alt={c.get("alt","")[:40]} {c.get("class","")}')
        elif c.name=='video' or c.name=='iframe':
            print('  '*depth+f'{c.name} {c.get("src","")}')
        elif c.name in ('section','header','footer','nav','div','ul','form','span'):
            cls=' '.join(c.get('class',[]))
            if c.name in ('section','header','form') or re.search(r'hero|section|wrapper|grid|list|card|swiper|tab|accordion|cta|text|col|block|embed|rich',cls):
                t=c.get_text(' ',strip=True) if c.name=='div' and 'text' in cls and not c.find(['p','h1','h2','h3','h4','a']) else ''
                print('  '*depth+f'<{c.name} .{cls[:60]}>'+(' '+t[:maxp] if t else ''))
                if not t: walk(c,depth+1)
            else: walk(c,depth)
        else: walk(c,depth)
walk(body)
