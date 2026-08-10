// Curated stock photography (Unsplash). Swap these for your own product
// photography before launch.
//
// Every image ID below was verified two ways before being added: (1) an
// independent research pass fetched the actual Unsplash photo page and
// confirmed the photographer's caption/location/tags genuinely match the
// theme (not just a plausible-sounding search result), and (2) every CDN
// URL was curl-checked for a 200 response. An earlier pass that picked IDs
// from memory without verification produced real mismatches — e.g. an
// assumed "jewelry box" image that was actually a bronze Lady Justice
// statue, and a "festive lights" image that was actually Christmas tree
// ornaments — so nothing here is unverified guesswork.
//
// Some very specific searches (potli bags, meenakari enamel boxes, golu
// dolls, thamboolam pouches, nilavilakku standing lamps, toran door
// hangings) simply don't exist as tagged content on Unsplash — verified by
// direct search, not assumed. Those categories use the closest authentic
// substitute (e.g. general brass lamps, deity/puja imagery, bangles) rather
// than a mismatched forced result.
function unsplash(id: string, w = 900) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
}

export const categoryImageIds: Record<string, string[]> = {
  "haldi-kumkum": [
    "photo-1605292356183-a77d0a9c9d1d", // hands cupping a lit clay diya
    "photo-1546833998-b3dc34af4f57", // vivid red kumkum powder on a white plate
    "photo-1755798320739-ebf99af9cfe6", // ornate brass diya with peacock motif
    "photo-1652960018678-1f19799996c5", // table of traditional brass vessels
    "photo-1783255166346-b7c82195ba34", // brass pot with coconut, banana, lit lamps
  ],
  "varalakshmi-vratham": [
    "photo-1764304589223-30bfbfdaa9ef", // silver Ganesha idol beside a decorated kalash
    "photo-1742984039016-4b34a90a0fe6", // brass pooja thali with fruits, coconut, jaggery
    "photo-1627419375575-6cb2faa849b3", // hands holding a plate of puja fruits and flowers
    "photo-1754276747848-fed9fe91d806", // ceremonial pot decorated with flowers and leaves
  ],
  gruhapravesam: [
    "photo-1757308530438-4e2340a6475f", // multi-tier brass aarti lamp, rose petal offering
    "photo-1783255571174-d329a3895407", // hands cradling a multi-flame brass diya
    "photo-1761295908075-065ac2db0f5c", // hand lighting a row of oil lamps on a brass plate
    "photo-1778488028462-85ab3b83d39c", // lit clay diya with flower petals and rice
    "photo-1775427527606-5b317b5e6a96", // person lighting a tall standing brass lamp
  ],
  "baby-shower": [
    "photo-1570102881689-c04ab4cf1f4c", // pastel teal, white and pink balloons flat lay
    "photo-1587160728015-924483626a1a", // soft purple and pink balloon cluster
    "photo-1574130931363-ad25bede1b08", // pink wrapped gift box on peach textile
    "photo-1761721133695-e7558dce99c4", // wall of colorful glass bangles, retail display
    "photo-1762342345465-d021b8491309", // hand-painted floral wooden bangles
  ],
  wedding: [
    "photo-1763184176470-2115508594d3", // vibrant multicolor flower garlands at a market
    "photo-1699764681875-dd04ce36b1c3", // close-up cluster of orange marigold blooms
    "photo-1758995116383-f51775896add", // stack of ornate gold bangles
    "photo-1728381031272-ba3f537feadd", // gold kada bracelets on a velvet cushion
    "photo-1633168850968-76be3bb0a2fc", // dried fruits and nuts on wooden spoons
  ],
  navaratri: [
    "photo-1629641565651-3cda28627570", // deity statue at a Durga temple, Navratri
    "photo-1759463191632-90844233c9ea", // multi-armed Durga idol, festival preparations
    "photo-1593847794002-a67998d742fc", // Durga idol on a wooden surface
    "photo-1771091054077-5f28f540f074", // lit diya with offerings and green leaves
    "photo-1760786933013-dbfe8ce220d3", // rows of colorful bangles at a market stall
  ],
  diwali: [
    "photo-1635192592106-77a5aacbe1a3", // circular arrangement of lit diyas
    "photo-1605292356183-a77d0a9c9d1d", // hands cupping a lit clay diya
    "photo-1635186769388-b537282188b0", // lit diya on red festive fabric
    "photo-1700993714468-408700d3599e", // hand resting on a colorful rangoli pattern
    "photo-1666244453401-43a8c15b5640", // warm decorative Diwali string lights
    "photo-1695568181558-034b7d3e49eb", // plate of traditional Indian sweets (mithai)
  ],
  "corporate-gifts": [
    "photo-1773450970959-cef81e9b1053", // styled wooden crate gift hamper
    "photo-1762504634376-740d95eec2e4", // corporate gift handover in an office setting
    "photo-1545844568-98bb15133ec0", // elegant white gift box with crimson ribbon
    "photo-1590052210004-8935aa660ff2", // premium watch presented in its gift box
    "photo-1595412017587-b7f3117dff54", // close-up of almonds on a wooden surface
  ],
};

export function categoryHero(categorySlug: string, w = 1400): string {
  const ids = categoryImageIds[categorySlug];
  return unsplash(ids[0], w);
}

/** Deterministic 3-image gallery for a product, rotating through its
 * category's verified image pool so consecutive products don't all show
 * the exact same three photos. */
export function productGallery(categorySlug: string, offset: number): string[] {
  const ids = categoryImageIds[categorySlug];
  return [0, 1, 2].map((i) => unsplash(ids[(offset + i) % ids.length]));
}

export const heroImage = unsplash(categoryImageIds["haldi-kumkum"][0], 1400);
