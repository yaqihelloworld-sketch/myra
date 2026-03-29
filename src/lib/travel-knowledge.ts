// Comprehensive travel knowledge base for auto-filling best times to visit
// This replaces the paid Claude API with free, instant lookups

type TravelInfo = {
  bestMonths: string;
  idealSeasons: string[];
  tip: string;
  estimatedDays?: number;
  estimatedBudget?: string;
};

// Major events/festivals with specific timing
const EVENTS: Record<string, TravelInfo> = {
  carnival: {
    bestMonths: "February to March",
    idealSeasons: ["summer"],
    tip: "Carnival dates shift yearly based on Easter — usually falls in February or early March.",
  },
  "rio carnival": {
    bestMonths: "February to March",
    idealSeasons: ["summer"],
    tip: "Rio's Carnival is the world's largest — book 6+ months ahead for Sambadrome tickets.",
  },
  oktoberfest: {
    bestMonths: "September to October",
    idealSeasons: ["autumn"],
    tip: "Despite the name, Oktoberfest mostly runs in September. Weekdays are less crowded.",
  },
  "cherry blossom": {
    bestMonths: "March to April",
    idealSeasons: ["spring"],
    tip: "Peak bloom lasts only 1-2 weeks. Tokyo blooms late March, Kyoto early April.",
  },
  hanami: {
    bestMonths: "March to April",
    idealSeasons: ["spring"],
    tip: "Cherry blossom viewing season — follow the sakura forecast for exact timing.",
  },
  "northern lights": {
    bestMonths: "September to March",
    idealSeasons: ["autumn", "winter"],
    tip: "Best visibility requires dark skies and clear weather. December–February has longest nights.",
  },
  aurora: {
    bestMonths: "September to March",
    idealSeasons: ["autumn", "winter"],
    tip: "The aurora oval is most active around the equinoxes (September and March).",
  },
  "holi festival": {
    bestMonths: "March",
    idealSeasons: ["spring"],
    tip: "Holi falls on the full moon in March. Mathura and Vrindavan celebrate for a full week.",
  },
  "day of the dead": {
    bestMonths: "October to November",
    idealSeasons: ["autumn"],
    tip: "Día de los Muertos peaks October 31–November 2. Oaxaca and Pátzcuaro are iconic spots.",
  },
  "lantern festival": {
    bestMonths: "February to March",
    idealSeasons: ["winter", "spring"],
    tip: "The Lantern Festival marks the end of Chinese New Year, 15 days after the lunar new year.",
  },
  "songkran": {
    bestMonths: "April",
    idealSeasons: ["spring"],
    tip: "Thailand's water festival runs April 13–15. Chiang Mai has the biggest celebrations.",
  },
  "la tomatina": {
    bestMonths: "August",
    idealSeasons: ["summer"],
    tip: "Held the last Wednesday of August in Buñol, Spain. Tickets sell out fast.",
  },
  "running of the bulls": {
    bestMonths: "July",
    idealSeasons: ["summer"],
    tip: "San Fermín runs July 6–14 in Pamplona. The encierro (bull run) happens each morning at 8am.",
  },
  "mardi gras": {
    bestMonths: "February to March",
    idealSeasons: ["winter", "spring"],
    tip: "New Orleans Mardi Gras date shifts yearly (46 days before Easter). Parades run for 2 weeks.",
  },
  diwali: {
    bestMonths: "October to November",
    idealSeasons: ["autumn"],
    tip: "The festival of lights falls between mid-October and mid-November. Jaipur and Varanasi are magical.",
  },
  "coachella": {
    bestMonths: "April",
    idealSeasons: ["spring"],
    tip: "Held over two weekends in April in Indio, California. Weekend 1 typically has surprise guests.",
  },
  "burning man": {
    bestMonths: "August to September",
    idealSeasons: ["summer"],
    tip: "Runs the week before and including Labor Day in Black Rock Desert, Nevada.",
  },
  "glastonbury": {
    bestMonths: "June",
    idealSeasons: ["summer"],
    tip: "Held late June in Somerset, England. Bring wellies — rain is tradition.",
  },
  "hogmanay": {
    bestMonths: "December to January",
    idealSeasons: ["winter"],
    tip: "Edinburgh's legendary New Year's celebration. The torchlight procession on Dec 30 is unforgettable.",
  },
  "carnevale": {
    bestMonths: "February",
    idealSeasons: ["winter"],
    tip: "Venice Carnival runs for 2-3 weeks before Lent. The masked balls are the highlight.",
  },
};

// Country/region-level best travel times
const DESTINATIONS: Record<string, TravelInfo> = {
  japan: {
    bestMonths: "March to May, October to November",
    idealSeasons: ["spring", "autumn"],
    tip: "Spring cherry blossoms and autumn foliage are Japan's most magical seasons.",
  },
  tokyo: {
    bestMonths: "March to May, October to November",
    idealSeasons: ["spring", "autumn"],
    tip: "Mild weather and cherry blossoms in spring; stunning autumn colors and clear skies in fall.",
  },
  kyoto: {
    bestMonths: "March to May, October to November",
    idealSeasons: ["spring", "autumn"],
    tip: "Kyoto's temples are breathtaking during cherry blossom and autumn foliage seasons.",
  },
  italy: {
    bestMonths: "April to June, September to October",
    idealSeasons: ["spring", "autumn"],
    tip: "Shoulder seasons offer pleasant weather without the crushing summer crowds.",
  },
  rome: {
    bestMonths: "April to June, September to October",
    idealSeasons: ["spring", "autumn"],
    tip: "Avoid July–August heat. Spring has perfect weather for walking the ancient city.",
  },
  florence: {
    bestMonths: "April to June, September to October",
    idealSeasons: ["spring", "autumn"],
    tip: "Tuscany is golden in autumn — perfect for wine harvest and quieter museums.",
  },
  venice: {
    bestMonths: "April to June, September to November",
    idealSeasons: ["spring", "autumn"],
    tip: "Summer is overcrowded and hot. Late autumn has fewer tourists but risk of acqua alta flooding.",
  },
  "amalfi coast": {
    bestMonths: "May to June, September to October",
    idealSeasons: ["spring", "autumn"],
    tip: "Beach weather without peak-season prices and crowds. Lemon season peaks in May.",
  },
  paris: {
    bestMonths: "April to June, September to October",
    idealSeasons: ["spring", "autumn"],
    tip: "Paris in spring is iconic. September brings la rentrée — the city buzzes back to life.",
  },
  france: {
    bestMonths: "May to June, September to October",
    idealSeasons: ["spring", "autumn"],
    tip: "Lavender blooms in Provence June–July. Wine harvest (vendange) starts in September.",
  },
  iceland: {
    bestMonths: "June to August",
    idealSeasons: ["summer"],
    tip: "Midnight sun in summer means endless daylight for exploration. Winter for northern lights.",
  },
  norway: {
    bestMonths: "June to August",
    idealSeasons: ["summer"],
    tip: "Fjords are best in summer with long days. Visit Tromsø in winter for aurora hunting.",
  },
  greece: {
    bestMonths: "May to June, September to October",
    idealSeasons: ["spring", "autumn"],
    tip: "Shoulder seasons have warm seas, cheaper flights, and no peak-season crowds on the islands.",
  },
  santorini: {
    bestMonths: "May to June, September to October",
    idealSeasons: ["spring", "autumn"],
    tip: "Caldera sunsets without the July–August cruise ship crowds. Water is still warm in October.",
  },
  bali: {
    bestMonths: "April to October",
    idealSeasons: ["spring", "summer", "autumn"],
    tip: "Dry season offers clear skies. May and September are sweet spots — dry but less touristy.",
  },
  thailand: {
    bestMonths: "November to February",
    idealSeasons: ["winter"],
    tip: "Cool, dry season is ideal. Avoid March–May (scorching) and monsoon months (June–October).",
  },
  "new zealand": {
    bestMonths: "December to March",
    idealSeasons: ["summer"],
    tip: "Southern hemisphere summer. February is driest. Great for hiking and road trips.",
  },
  australia: {
    bestMonths: "September to November, March to May",
    idealSeasons: ["spring", "autumn"],
    tip: "Avoid scorching summer (Dec–Feb) in the south. Northern tropics are best May–October.",
  },
  morocco: {
    bestMonths: "March to May, September to November",
    idealSeasons: ["spring", "autumn"],
    tip: "Desert heat is extreme in summer. Spring brings wildflowers in the Atlas Mountains.",
  },
  peru: {
    bestMonths: "May to September",
    idealSeasons: ["winter"],
    tip: "Dry season for Machu Picchu and the Inca Trail. June–August is busiest but driest.",
  },
  "machu picchu": {
    bestMonths: "May to September",
    idealSeasons: ["winter", "spring"],
    tip: "Dry season means clearer views. May and September are less crowded than peak months.",
  },
  brazil: {
    bestMonths: "March to May, September to November",
    idealSeasons: ["spring", "autumn"],
    tip: "Shoulder seasons avoid both rainy season and peak tourist prices.",
  },
  mexico: {
    bestMonths: "December to April",
    idealSeasons: ["winter", "spring"],
    tip: "Dry season with pleasant temperatures. Hurricane season runs June–November on the coasts.",
  },
  egypt: {
    bestMonths: "October to April",
    idealSeasons: ["autumn", "winter", "spring"],
    tip: "Summer heat at the pyramids exceeds 40°C. Winter is pleasantly warm and dry.",
  },
  india: {
    bestMonths: "October to March",
    idealSeasons: ["autumn", "winter"],
    tip: "Post-monsoon through winter offers clear skies and comfortable temperatures across most regions.",
  },
  spain: {
    bestMonths: "April to June, September to October",
    idealSeasons: ["spring", "autumn"],
    tip: "Southern Spain is scorching in summer. Spring festivals (Feria, Semana Santa) are incredible.",
  },
  barcelona: {
    bestMonths: "May to June, September to October",
    idealSeasons: ["spring", "autumn"],
    tip: "Beach weather without August heat and crowds. La Mercè festival in September is a highlight.",
  },
  portugal: {
    bestMonths: "May to October",
    idealSeasons: ["spring", "summer", "autumn"],
    tip: "Lisbon is lovely in spring. The Algarve has Europe's best beach weather May–October.",
  },
  croatia: {
    bestMonths: "May to June, September",
    idealSeasons: ["spring", "autumn"],
    tip: "Dubrovnik is overwhelmed in July–August. Late spring has warm seas and peaceful streets.",
  },
  switzerland: {
    bestMonths: "June to September, December to March",
    idealSeasons: ["summer", "winter"],
    tip: "Summer for hiking and lakes, winter for skiing. Shoulder months can be grey and rainy.",
  },
  maldives: {
    bestMonths: "November to April",
    idealSeasons: ["winter", "spring"],
    tip: "Dry northeast monsoon season. January–March is sunniest but priciest.",
  },
  "sri lanka": {
    bestMonths: "December to March (west coast), April to September (east coast)",
    idealSeasons: ["winter", "spring"],
    tip: "Two monsoon seasons mean there's always a dry coast. The west is best in winter.",
  },
  patagonia: {
    bestMonths: "November to March",
    idealSeasons: ["summer"],
    tip: "Southern hemisphere summer. January is warmest but windiest. December has longest days.",
  },
  colombia: {
    bestMonths: "December to March, July to August",
    idealSeasons: ["winter", "summer"],
    tip: "Dry seasons vary by region. Cartagena is best December–April. Coffee region is year-round.",
  },
  cuba: {
    bestMonths: "November to April",
    idealSeasons: ["winter", "spring"],
    tip: "Dry season with comfortable humidity. Hurricane risk runs June–November.",
  },
  "costa rica": {
    bestMonths: "December to April",
    idealSeasons: ["winter", "spring"],
    tip: "Dry season (verano). Green season (May–November) has fewer crowds and lush landscapes.",
  },
  turkey: {
    bestMonths: "April to June, September to November",
    idealSeasons: ["spring", "autumn"],
    tip: "Istanbul is magical in spring. Cappadocia's balloon rides are best in calm autumn air.",
  },
  "cappadocia": {
    bestMonths: "April to June, September to November",
    idealSeasons: ["spring", "autumn"],
    tip: "Hot air balloon flights are most reliable in calm spring and autumn weather.",
  },
  kenya: {
    bestMonths: "July to October",
    idealSeasons: ["summer", "autumn"],
    tip: "The Great Migration crosses the Mara River July–October. Book safari lodges a year ahead.",
  },
  "south africa": {
    bestMonths: "May to September",
    idealSeasons: ["autumn", "winter"],
    tip: "Dry winter is best for safari (animals gather at water sources). Cape Town is best Dec–Feb.",
  },
  vietnam: {
    bestMonths: "February to April, August to October",
    idealSeasons: ["spring", "autumn"],
    tip: "Climate varies hugely north to south. Central Vietnam is driest February–April.",
  },
  cambodia: {
    bestMonths: "November to February",
    idealSeasons: ["winter"],
    tip: "Cool, dry season. Angkor Wat is best at sunrise in December — fewer crowds than January.",
  },
  "south korea": {
    bestMonths: "April to May, September to November",
    idealSeasons: ["spring", "autumn"],
    tip: "Cherry blossom season rivals Japan. Autumn foliage in Seoraksan is spectacular.",
  },
  singapore: {
    bestMonths: "February to April",
    idealSeasons: ["spring"],
    tip: "Driest months with the least rainfall. Singapore is warm year-round (27–31°C).",
  },
  dubai: {
    bestMonths: "November to March",
    idealSeasons: ["winter"],
    tip: "Summer exceeds 45°C. Winter is pleasant (20–25°C) and coincides with shopping festivals.",
  },
  "hong kong": {
    bestMonths: "October to December",
    idealSeasons: ["autumn"],
    tip: "Clear skies, comfortable temperatures, and the start of festival season.",
  },
  argentina: {
    bestMonths: "October to April",
    idealSeasons: ["spring", "summer"],
    tip: "Buenos Aires is best in spring (Oct–Nov). Patagonia hiking season is December–March.",
  },
  chile: {
    bestMonths: "October to March",
    idealSeasons: ["spring", "summer"],
    tip: "Atacama Desert is clear year-round. Torres del Paine is best December–February.",
  },
  scotland: {
    bestMonths: "May to September",
    idealSeasons: ["spring", "summer"],
    tip: "Longest days are in June. Highlands midges are worst in July–August.",
  },
  ireland: {
    bestMonths: "May to September",
    idealSeasons: ["spring", "summer"],
    tip: "Ireland is green year-round, but summer has the most daylight and driest weather.",
  },
  amsterdam: {
    bestMonths: "April to May, September",
    idealSeasons: ["spring", "autumn"],
    tip: "Tulip season peaks mid-April at Keukenhof. King's Day (April 27) is legendary.",
  },
  london: {
    bestMonths: "May to September",
    idealSeasons: ["spring", "summer"],
    tip: "Long summer days are perfect for parks and outdoor events. June has the best weather odds.",
  },
  "new york": {
    bestMonths: "April to June, September to November",
    idealSeasons: ["spring", "autumn"],
    tip: "Fall foliage in Central Park is iconic. Spring has perfect walking weather.",
  },
  hawaii: {
    bestMonths: "April to October",
    idealSeasons: ["spring", "summer"],
    tip: "Dry season with calmer seas. Winter has bigger waves (great for surfing) and whale watching.",
  },
  alaska: {
    bestMonths: "June to August",
    idealSeasons: ["summer"],
    tip: "Midnight sun and wildlife are at their peak. September for northern lights and fall colors.",
  },
  canada: {
    bestMonths: "June to September",
    idealSeasons: ["summer"],
    tip: "Vast country — summer is universally pleasant. Fall foliage peaks in Quebec mid-October.",
  },
  finland: {
    bestMonths: "June to August, December to March",
    idealSeasons: ["summer", "winter"],
    tip: "Midnight sun in summer. Winter for northern lights, husky safaris, and Santa in Lapland.",
  },
  jordan: {
    bestMonths: "March to May, September to November",
    idealSeasons: ["spring", "autumn"],
    tip: "Petra and Wadi Rum are scorching in summer. Spring wildflowers are beautiful.",
  },
  tanzania: {
    bestMonths: "June to October",
    idealSeasons: ["summer", "autumn"],
    tip: "Dry season is ideal for Serengeti safaris. Wildebeest calving happens January–February.",
  },
  nepal: {
    bestMonths: "October to November, March to April",
    idealSeasons: ["autumn", "spring"],
    tip: "Clearest Himalayan views in autumn. Spring has rhododendron blooms on trekking trails.",
  },
  bhutan: {
    bestMonths: "March to May, September to November",
    idealSeasons: ["spring", "autumn"],
    tip: "Spring festivals and rhododendrons. Autumn has crystal-clear mountain views.",
  },
};

// Hemisphere lookup for general season inference
const SOUTHERN_HEMISPHERE_COUNTRIES = new Set([
  "australia", "new zealand", "argentina", "chile", "south africa",
  "brazil", "uruguay", "paraguay", "bolivia", "madagascar",
  "mozambique", "namibia", "botswana", "zimbabwe", "zambia",
  "malawi", "tanzania", "indonesia", "fiji", "peru",
]);

function normalizeQuery(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

function findEventMatch(query: string): TravelInfo | null {
  const normalized = normalizeQuery(query);

  // Direct match
  for (const [key, info] of Object.entries(EVENTS)) {
    if (normalized.includes(key)) return info;
  }

  return null;
}

function findDestinationMatch(query: string): TravelInfo | null {
  const normalized = normalizeQuery(query);
  const words = normalized.split(/\s+/);

  // Try full query first, then individual words
  if (DESTINATIONS[normalized]) return DESTINATIONS[normalized];

  for (const word of words) {
    if (DESTINATIONS[word]) return DESTINATIONS[word];
  }

  // Try partial match
  for (const [key, info] of Object.entries(DESTINATIONS)) {
    if (normalized.includes(key) || key.includes(normalized)) return info;
  }

  return null;
}

export function lookupTravelInfo(name: string): TravelInfo | null {
  // First try event/festival match (more specific)
  const eventMatch = findEventMatch(name);
  if (eventMatch) return eventMatch;

  // Then try destination match
  const destMatch = findDestinationMatch(name);
  if (destMatch) return destMatch;

  return null;
}

// Fallback: try to fetch from Wikipedia API
export async function fetchWikipediaInfo(query: string): Promise<TravelInfo | null> {
  try {
    const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    const res = await fetch(searchUrl, {
      headers: { "User-Agent": "TravelPlanner/1.0" },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const extract = (data.extract || "").toLowerCase();

    // Try to infer seasons from the Wikipedia extract
    const seasons: string[] = [];
    const monthMentions: string[] = [];

    const monthPatterns: Record<string, string> = {
      january: "winter", february: "winter", march: "spring",
      april: "spring", may: "spring", june: "summer",
      july: "summer", august: "summer", september: "autumn",
      october: "autumn", november: "autumn", december: "winter",
    };

    for (const [month, season] of Object.entries(monthPatterns)) {
      if (extract.includes(month)) {
        monthMentions.push(month.charAt(0).toUpperCase() + month.slice(1));
        if (!seasons.includes(season)) seasons.push(season);
      }
    }

    if (monthMentions.length > 0) {
      return {
        bestMonths: monthMentions.slice(0, 4).join(", "),
        idealSeasons: seasons.length > 0 ? seasons : ["spring", "autumn"],
        tip: data.extract ? data.extract.slice(0, 120) + "..." : "Check local sources for the latest travel advice.",
      };
    }

    return null;
  } catch {
    return null;
  }
}
