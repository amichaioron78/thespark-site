# one-off patch: add the Webflow works-categories/all ordering to lib/content.ts
import re, sys
p = 'lib/content.ts'; s = open(p).read()
if 'WORKS_ALL_ORDER' not in s:
    add = '''
/** Order of the Webflow /works-categories/all listing (collection list sort), captured 2026-10-08. */
export const WORKS_ALL_ORDER = [
  "suridata", "virdix", "marketman", "brain-buzz", "healtop", "hermes", "deepkeep", "innovesta", "aeye", "evrideo",
  "sonol", "nym", "qsee-carbon", "uturn", "identimedical", "insfocus", "breeze", "trinity-audio", "pomicell", "bariks",
];
export function getWorksAllOrdered(): WorkListItem[] {
  const all = getWorks();
  const byslug = new Map(all.map((w) => [w.slug, w]));
  const ordered = WORKS_ALL_ORDER.map((s) => byslug.get(s)).filter(Boolean) as WorkListItem[];
  for (const w of all) if (!WORKS_ALL_ORDER.includes(w.slug)) ordered.push(w);
  return ordered;
}
'''
    s = s.replace('\nexport const SITE = {', add + '\nexport const SITE = {', 1)
    open(p, 'w').write(s); print('patched')
else:
    print('already')
