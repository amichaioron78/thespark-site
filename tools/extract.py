#!/usr/bin/env python3
"""Convert the crawled Webflow HTML of thespark.ai into structured content JSON
for the Next.js rebuild. Run from anywhere; paths are absolute."""
import os, re, json, html as htmlmod
from urllib.parse import unquote, urlparse
from bs4 import BeautifulSoup, NavigableString, Tag

REF = '/home/claude/ref/www.thespark.ai'
OUT = '/home/claude/thespark-site/content'
IMG_MANIFEST = {}  # local path -> original absolute CDN url

CDN_HOSTS = ('cdn.prod.website-files.com', 'uploads-ssl.webflow.com',
             'assets.website-files.com', 'assets-global.website-files.com')

def local_image(src, base_dir):
    """Map a crawled/CDN image reference to /images/<name> and record it."""
    if not src or src.startswith('data:'): return src
    s = src
    # relative crawl paths like ../cdn.prod.website-files.com/<id>/<file>
    m = re.search(r'(?:^|/)((?:cdn\.prod\.website-files\.com|uploads-ssl\.webflow\.com|assets(?:-global)?\.website-files\.com)/[^?#]+)', s)
    if m:
        rel = m.group(1)
        host, rest = rel.split('/', 1)
        original = f'https://{host}/{rest}'
        name = unquote(rest.split('/')[-1])
        name = re.sub(r'[^A-Za-z0-9._-]+', '-', name).strip('-')
        local = f'/images/{name}'
        IMG_MANIFEST[local] = {'url': original, 'crawl': rel}
        return local
    if s.startswith('http'):
        return s  # external (wistia swatch etc.)
    return s

def fix_href(href):
    if not href: return href
    h = href.strip()
    if h.startswith(('mailto:', 'tel:', '#')): return h
    for pre in ('http://www.thespark.ai', 'https://www.thespark.ai', 'https://thespark.ai', 'http://thespark.ai'):
        if h.startswith(pre):
            h = h[len(pre):] or '/'
    if h.startswith('http'): return h
    # crawled relative links: ../works/nym.html, index.html, aeye.html#, etc.
    h = re.sub(r'#$', '', h)
    if h.endswith('.html') or '.html#' in h:
        # resolve relative to site root using known sections
        path = h.split('#')[0]
        frag = ('#' + h.split('#',1)[1]) if '#' in h else ''
        path = path.replace('../', '')
        if path == 'index.html': return '/' + frag
        path = path[:-5]
        # single-segment pages under works/ services/ blog/ are referenced relatively from siblings
        return '/' + path + frag
    if not h.startswith('/'): h = '/' + h
    return h

ALLOWED = {'p','h1','h2','h3','h4','h5','h6','ul','ol','li','strong','b','em','i','a','img','br','blockquote','figure','figcaption','span','u','sub','sup','table','thead','tbody','tr','td','th','hr','code','pre','video','source'}

def clean_rich(el, base_dir=''):
    """Return cleaned inner HTML of a rich-text element."""
    if el is None: return ''
    el = BeautifulSoup(str(el), 'html.parser')
    root = el.contents[0] if el.contents else el
    for t in list(root.find_all(True)):
        if t.name not in ALLOWED:
            t.unwrap(); continue
        attrs = {}
        if t.name == 'a':
            attrs['href'] = fix_href(t.get('href'))
            if t.get('target') == '_blank': attrs['target'] = '_blank'; attrs['rel'] = 'noopener'
        elif t.name in ('img','source'):
            attrs['src'] = local_image(t.get('src'), base_dir)
            if t.get('alt'): attrs['alt'] = t.get('alt')
        elif t.name == 'video':
            attrs['controls'] = ''
        if t.get('dir'): attrs['dir'] = t['dir']
        if t.get('style') and 'text-align' in t['style']:
            attrs['style'] = re.sub(r'(?!text-align)[a-z-]+:[^;]+;?', '', t['style']).strip()
        t.attrs = attrs
    out = root.decode_contents() if isinstance(root, Tag) else str(root)
    # drop empty paragraphs / zero-width joiners
    out = re.sub(r'<p>\s*(?:&zwj;|‍|&nbsp;|\s|<br\s*/?>)*\s*</p>', '', out)
    out = out.replace('‍', '')
    out = re.sub(r'\n\s*\n', '\n', out).strip()
    return out

def text(el):
    return el.get_text(' ', strip=True) if el else ''

def load(path):
    s = open(os.path.join(REF, path), encoding='utf-8').read()
    soup = BeautifulSoup(s, 'html.parser')
    seo = {
        'title': text(soup.title),
        'description': (soup.find('meta', attrs={'name':'description'}) or {}).get('content'),
        'ogImage': local_image((soup.find('meta', property='og:image') or {}).get('content'), ''),
    }
    for t in soup(['script','style','noscript']): t.decompose()
    nav = soup.find('div', class_='navbar')
    if nav: nav.decompose()
    foot = soup.find('footer', class_='footer')
    if foot: foot.decompose()
    return soup, seo

def write(rel, data):
    p = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    json.dump(data, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

# ---------------------------------------------------------------- works
def img_variant(img):
    cls = img.get('class', [])
    v = 'web'
    if 'works_image_full' in cls or 'work_image_responsive_100' in cls: v = 'full'
    elif 'works_image_mobile' in cls: v = 'mobile'
    elif 'small_630w' in cls: v = 'small'
    return {'type':'image','src': local_image(img.get('src'),''), 'alt': img.get('alt',''),
            'variant': v, 'rounded': 'round_corners' in cls, 'hidden': 'hide' in cls}

FRAME_BG_IMAGES = {
    'virdix': '/images/6458f0cdf0622124dcf9730b_Virdix_bg.webp',
    'identimedica_gray_img_bg': '/images/66409e7503a77bdd4a2a96d8_Identimedical_card_bg.svg',
    'green_bg_image': '/images/66409cee04bb5b35604d1d48_Identimedical_bg_green.svg',
}
FRAME_BG_COLORS = {'identimedica_gray_img_bg': '#f5f6f7', 'green_bg_image': '#aadb91', 'white': '#ffffff', 'no_top_space_gray': '#f5f6f7'}

def hex_from_classes(cls):
    for c in cls:
        if re.fullmatch(r'_?[0-9a-f]{6}', c): return '#' + c.lstrip('_')
        if re.fullmatch(r'_?[0-9a-f]{3}', c): return '#' + c.lstrip('_')
    return None

def work_blocks(container):
    """Walk the main content of a work page producing blocks."""
    blocks = []
    def handle(el, sink):
        if not isinstance(el, Tag): return
        cls = el.get('class', [])
        if el.name == 'img':
            b = img_variant(el)
            if 'image_element_full' in cls: b['variant'] = 'full'
            if 'smaller' in cls: b['variant'] = 'smaller'
            if '_520px' in cls: b['variant'] = 'small'
            if 'contain_suridata' in cls: b['fit'] = 'contain'; b['bg'] = '#efedf0'
            if not b['hidden']: sink.append(b)
            return
        if el.name == 'video':
            src = el.find('source')
            sink.append({'type':'video','src': local_image((src or el).get('src'),''), 'poster': local_image(el.get('poster'),'')}); return
        if el.name == 'iframe':
            sink.append({'type':'embed','src': el.get('src')}); return
        if 'wistia_responsive_wrapper' in cls or any(c.startswith('wistia_async_') for c in cls):
            m = next((c.split('wistia_async_')[1] for c in cls if c.startswith('wistia_async_')), None) or (re.search(r'medias/([a-z0-9]+)', str(el)) or [None,None])[1]
            sink.append({'type':'wistia','id': m}); return
        if 'work_section_txt' in cls or 'work_rich_text' in cls or 'w-richtext' in cls or 'works_full_layout_t' in cls:
            inner = el.find(class_='w-richtext') if 'works_full_layout_t' in cls and el.find(class_='w-richtext') else el
            h = clean_rich(inner)
            if h: sink.append({'type':'text','html': h, 'noPadding': 'no-padding' in cls,
                               'centered': 'works_full_layout_t' in cls or 'white-text' in cls, 'white': 'white-text' in cls})
            return
        if 'works_image_passparto' in cls:
            bg = hex_from_classes(cls) or next((FRAME_BG_COLORS[c] for c in cls if c in FRAME_BG_COLORS), None)
            if 'no_bg' in cls: bg = 'transparent'
            if bg is None: bg = '#ebe3da'
            bgimg = next((FRAME_BG_IMAGES[c] for c in cls if c in FRAME_BG_IMAGES), None)
            if bgimg: IMG_MANIFEST.setdefault(bgimg, {'url': 'https://cdn.prod.website-files.com/643bfb5eaa88cb841d411dab/' + bgimg.split('/')[-1], 'crawl': 'cdn.prod.website-files.com/643bfb5eaa88cb841d411dab/' + bgimg.split('/')[-1]})
            kids = []
            for k in el.children: handle(k, kids)
            sink.append({'type':'frame','bg': bg, 'bgImage': bgimg, 'noPaddingTop': 'p-t-0' in cls, 'children': kids})
            return
        if 'works_grid_of_3_images' in cls:
            kids = []
            for k in el.children: handle(k, kids)
            sink.append({'type':'gallery','columns': 3, 'children': kids}); return
        if 'grid_col_left_text_right_image' in cls or 'grid_two_image_and_right_col_text' in cls:
            textel = el.find(class_='work_section_txt') or el.find(class_='w-richtext')
            media = []
            for k in el.children:
                if isinstance(k, Tag) and k is not textel and not (textel is not None and textel in k.descendants):
                    handle(k, media)
            kids = [k for k in el.children if isinstance(k, Tag)]
            image_first = bool(kids) and (kids[0].name == 'img' or (kids[0].find('img') is not None and kids[0].find(class_='w-richtext') is None))
            sink.append({'type':'split','html': clean_rich(textel), 'images': media,
                         'imageFirst': image_first or 'flip' in cls, 'wide': 'grid_two_image_and_right_col_text' in cls})
            return
        if 'w-embed' in cls and not el.find(['img','iframe','video']):
            return  # custom css/script embeds
        for k in el.children: handle(k, sink)
    for k in container.children: handle(k, blocks)
    out = []
    for b in blocks:
        if out and b == out[-1]: continue
        out.append(b)
    return out

def extract_work(slug):
    soup, seo = load(f'works/{slug}.html')
    body = soup.body
    herowrap = body.find('div', class_='work_hero_img_wrapper')
    hero = {}
    if herowrap:
        bg = herowrap.find('img', class_='work_hero_img_element')
        logo = herowrap.find('img', class_='works_her_logo')
        hero['bgImage'] = local_image(bg.get('src'),'') if bg else None
        hero['bgAlt'] = bg.get('alt','') if bg else ''
        hero['logo'] = local_image(logo.get('src'),'') if logo else None
        hero['logoAlt'] = logo.get('alt','') if logo else ''
    hb = body.find('div', class_=re.compile(r'^work_hero_block'))
    if hb:
        hero['color'] = next((('#'+c[1:]) for c in hb.get('class',[]) if re.fullmatch(r'_[0-9a-f]{6}', c)), None) or hb.get('bg_color')
        hero['heroBg'] = next((('#'+c[1:]) for c in (herowrap.get('class',[]) if herowrap else []) if re.fullmatch(r'_[0-9a-f]{6}', c)), None)
        meta = []
        for card in hb.find_all('div', class_='work_meta_card'):
            k = card.find(class_='title'); vals = [d for d in card.find_all(class_='meta_txt') if 'title' not in d.get('class',[])]
            if k and vals: meta.append({'label': text(k).rstrip(':').strip(), 'value': text(vals[0])})
        hero['meta'] = meta
        h1 = hb.find('h1'); hero['title'] = text(h1)
        rt = hb.find(class_='w-richtext'); hero['introHtml'] = clean_rich(rt)
    # main content: siblings after the hero's top-level wrapper inside the smooth-content root
    root = body.find('div', class_='smooth-content') or body.find('div', class_='data-barba-container') or body
    barba = body.find('div', class_='data-barba-container')
    hero['pageBg'] = next((('#'+c) for c in (barba.get('class',[]) if barba else []) if re.fullmatch(r'[0-9a-f]{6}', c)), None)
    top = hb
    while top is not None and top.parent is not root: top = top.parent
    node = top.next_sibling if top is not None else None
    region = BeautifulSoup('<div id="region"></div>', 'html.parser').div
    while node is not None:
        nxt = node.next_sibling
        if isinstance(node, Tag):
            cls = node.get('class', [])
            if '_4_home_works' in cls or node.find(class_='_4_home_works') is not None: break
            region.append(node.extract())
        node = nxt
    blocks = work_blocks(region)
    return {'slug': slug, 'seo': seo, 'hero': hero, 'blocks': blocks}

# ---------------------------------------------------------------- services
def extract_service(slug):
    soup, seo = load(f'services/{slug}.html')
    body = soup.body
    header = body.find('header')
    d = {'slug': slug, 'seo': seo,
         'title': text(header.find('h1')), 'subtitle': text(header.find('h2')),
         'introHtml': clean_rich(header.find(class_='w-richtext')), 'sections': [], 'related': []}
    for sec in body.find_all('section', class_='about-section'):
        grid = sec.find(class_='w-layout-grid')
        if not grid: continue
        kids = [k for k in grid.children if isinstance(k, Tag)]
        img = grid.find('img', class_='service_image')
        h2 = grid.find('h2'); rt = grid.find(class_='w-richtext')
        image_first = bool(kids) and kids[0].name == 'img'
        d['sections'].append({'heading': text(h2), 'html': clean_rich(rt),
                              'image': local_image(img.get('src'),'') if img else None,
                              'imageAlt': img.get('alt','') if img else '', 'imageFirst': image_first})
    rel = body.find(string=re.compile('Related Services'))
    if rel:
        box = rel.find_parent(class_='about-section')
        for a in box.find_all('a', class_='services_service_card'):
            d['related'].append(fix_href(a.get('href')).split('/')[-1])
    return d

def extract_services_index():
    soup, seo = load('services.html')
    cards = []
    for a in soup.find_all('a', class_='services_service_card'):
        cards.append({'slug': fix_href(a.get('href')).split('/')[-1], 'title': text(a.find('h2')), 'description': text(a.find('p'))})
    return {'seo': seo, 'title': text(soup.find('h1')), 'services': cards}

# ---------------------------------------------------------------- blog
def extract_blog(slug):
    soup, seo = load(f'blog/{slug}.html')
    body = soup.body
    h1 = body.find('h1')
    img = body.find('img', class_='blog_pagelist_img_element')
    image = None
    if img and 'w-dyn-bind-empty' not in img.get('class', []):
        image = local_image(img.get('src'),'')
    rt = body.find(class_='blog_rich_text')
    rtl = bool(re.search(r'[\u0590-\u05FF]', text(h1) + text(rt)[:400]))
    # category: find "back to all" / category link if present
    cat = None
    for a in body.find_all('a'):
        h = fix_href(a.get('href') or '')
        if h.startswith('/spark-blog/') and h != '/spark-blog/main': cat = h.split('/')[-1]; break
    return {'slug': slug, 'seo': seo, 'title': text(h1), 'image': image, 'category': cat, 'rtl': rtl, 'bodyHtml': clean_rich(rt)}

def blog_index_order():
    """Order + category of posts as listed on /spark-blog/<cat> pages."""
    soup, _ = load('spark-blog/main.html')
    order = []
    for a in soup.find_all('a', href=re.compile(r'blog/')):
        slug = fix_href(a['href']).split('/')[-1]
        if slug and slug not in order: order.append(slug)
    cats = {}
    for c in ['design-process','design-for-business','design-trends']:
        s, _ = load(f'spark-blog/{c}.html')
        for a in s.find_all('a', href=re.compile(r'blog/')):
            hidden = 'w-condition-invisible' in a.get('class', []) or a.find_parent(class_='w-condition-invisible') is not None
            if not hidden: cats.setdefault(fix_href(a['href']).split('/')[-1], c)
    return order, cats

# ---------------------------------------------------------------- simple pages
def extract_about():
    soup, seo = load('about.html')
    b = soup.body
    img = b.find('img', class_='about_header_image')
    return {'seo': seo, 'title': text(b.find('h1')), 'html': clean_rich(b.find(class_='about_txt')),
            'image': local_image(img.get('src'),'') if img else None,
            'teamHeading': text(b.find('h2'))}

def extract_contact():
    soup, seo = load('contact.html')
    b = soup.body
    form = b.find('form')
    fields = []
    for f in form.find_all(['input','select','textarea']):
        if f.get('type') in ('submit','hidden'): continue
        fld = {'name': f.get('name'), 'type': f.name if f.name!='input' else f.get('type','text'),
               'placeholder': f.get('placeholder'), 'required': f.has_attr('required')}
        if f.name == 'select':
            fld['options'] = [text(o) for o in f.find_all('option') if o.get('value')]
            ph = f.find('option', value='')
            if ph: fld['placeholder'] = text(ph)
        fields.append(fld)
    submit = form.find('input', type='submit')
    return {'seo': seo, 'title': text(b.find('h1')), 'subtitle': text(b.find('p')),
            'fields': fields, 'submitLabel': submit.get('value') if submit else 'Submit',
            'successMessage': text(b.find(class_='w-form-done')), 'phone': '+972 54777 5609', 'email': 'info@thespark.ai'}

def extract_home():
    soup, seo = load('index.html')
    b = soup.body
    h1 = text(b.find('h1'))
    h2s = [text(h) for h in b.find_all('h2')]
    wist = b.find(class_=re.compile('wistia'))
    m = re.search(r'medias/([a-z0-9]+)', str(wist)) if wist else None
    face = b.find('img', alt='SPARK Design')
    return {'seo': seo, 'heroTitle': h1, 'heroImage': local_image(face.get('src'),'') if face else None,
            'servicesIntro': h2s[0] if h2s else '', 'experienceLine': h2s[1] if len(h2s)>1 else '',
            'worksHeading': 'Works', 'wistiaId': m.group(1) if m else None,
            'footerCta': 'Empower your business with our strategic design methodology'}

def extract_agency_page():
    soup, seo = load('ux-ui-design-agency-israel.html')
    b = soup.body
    pillar = b.find(class_='spark-seo-pillar')
    return {'seo': seo, 'title': text(b.find('h1')), 'pillarHtml': clean_rich(pillar)}

def extract_lp_start_selling():
    soup, seo = load('lp/start-selling.html')
    b = soup.body
    hero = b.find('header', class_='lp-hero')
    d = {'seo': seo, 'heroTitle': text(hero.find('h1')), 'heroText': text(hero.find('p')),
         'trustedHeading': 'Trusted by',
         'logos': [{'src': local_image(i.get('src'),''), 'alt': i.get('alt','')} for i in hero.select('.lp-logos-list img')],
         'featuresHeading': text(hero.select_one('.lp-hero-features h2')),
         'features': [{'icon': local_image(c.find('img').get('src'),''), 'title': text(c.find('h3')), 'text': text(c.find('p'))} for c in hero.select('.lp-features-card')],
         'stepsHeading': None, 'steps': [], 'ctaHeading': None}
    for sec in b.find_all('section', class_='about-section'):
        if 'blue' in sec.get('class', []):
            d['ctaHeading'] = text(sec.find('h2')); continue
        grid = sec.find(class_='w-layout-grid')
        if grid:
            img = grid.find('img'); kids = [k for k in grid.children if isinstance(k, Tag)]
            d['steps'].append({'heading': text(grid.find('h2')), 'html': clean_rich(grid.find(class_='w-richtext')),
                               'image': local_image(img.get('src'),'') if img else None, 'imageAlt': img.get('alt','') if img else '',
                               'imageFirst': bool(kids) and kids[0].name=='img'})
        elif sec.find('h2') and not d['stepsHeading']:
            d['stepsHeading'] = text(sec.find('h2'))
    return d

def extract_lp_contact():
    soup, seo = load('lp/contact.html')
    b = soup.body
    form = b.find('form')
    fields = []
    for f in form.find_all(['input','select','textarea']):
        if f.get('type') in ('submit','hidden'): continue
        fields.append({'name': f.get('name'), 'type': f.name if f.name!='input' else f.get('type','text'), 'placeholder': f.get('placeholder'), 'required': f.has_attr('required')})
    return {'seo': seo, 'title': text(b.find(['h1','h2'])), 'fields': fields, 'successMessage': text(b.find(class_='w-form-done'))}

def extract_lp_schedule():
    soup, seo = load('lp/schedule-a-call.html')
    raw = open(os.path.join(REF,'lp/schedule-a-call.html'),encoding='utf-8').read()
    m = re.search(r'(https://calendly\.com/[^"\'\s]+)', raw)
    return {'seo': seo, 'title': 'Schedule a call', 'calendly': m.group(1) if m else None}

def extract_404():
    soup, seo = load('404.html')
    b = soup.body
    return {'seo': seo, 'title': '404', 'subtitle': 'Ooops!', 'text': text(b.find(class_='_404_text_w')), 'linkLabel': 'Go to the home page'}

def main():
    works = [f[:-5] for f in sorted(os.listdir(os.path.join(REF,'works'))) if f.endswith('.html')]
    for w in works: write(f'works/{w}.json', extract_work(w))
    services = [f[:-5] for f in sorted(os.listdir(os.path.join(REF,'services'))) if f.endswith('.html')]
    for s in services: write(f'services/{s}.json', extract_service(s))
    write('pages/services-index.json', extract_services_index())
    order, cats = blog_index_order()
    posts = [f[:-5] for f in sorted(os.listdir(os.path.join(REF,'blog'))) if f.endswith('.html')]
    for i, p in enumerate(posts):
        d = extract_blog(p); d['category'] = cats.get(p, d['category']) or 'design-process'
        d['order'] = order.index(p) if p in order else 999
        write(f'blog/{p}.json', d)
    write('pages/about.json', extract_about())
    write('pages/contact.json', extract_contact())
    write('pages/home.json', extract_home())
    write('pages/ux-ui-design-agency-israel.json', extract_agency_page())
    write('pages/lp-start-selling.json', extract_lp_start_selling())
    write('pages/lp-contact.json', extract_lp_contact())
    write('pages/lp-schedule-a-call.json', extract_lp_schedule())
    write('pages/not-found.json', extract_404())
    # also map images referenced by the CMS json files
    for f in ['works.json','clients.json','testimonials.json','team.json']:
        data = json.load(open(os.path.join(OUT,f)))
        def remap(o):
            if isinstance(o, dict):
                return {k: (local_image(v,'') if isinstance(v,str) and any(h in v for h in CDN_HOSTS) else remap(v)) for k,v in o.items()}
            if isinstance(o, list): return [remap(x) for x in o]
            return o
        json.dump(remap(data), open(os.path.join(OUT,f),'w'), ensure_ascii=False, indent=2)
    write('images-manifest.json', IMG_MANIFEST)
    print('works', len(works), 'services', len(services), 'posts', len(posts), 'images', len(IMG_MANIFEST))

if __name__ == '__main__':
    main()
