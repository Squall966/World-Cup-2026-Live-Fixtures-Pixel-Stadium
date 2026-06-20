// All kick-off times are UTC.
// Source: Official 2026 FIFA World Cup schedule (verified June 2026).
// Round of 32 bracket pairings are approximate stubs — update with confirmed bracket once all groups complete.
const FIXTURES = [

  // ── GROUP A ── Mexico · South Africa · South Korea · Czechia
  // Venues: Estadio Azteca (Mexico City) · Estadio Akron (Guadalajara) · Estadio BBVA (Monterrey) · Mercedes-Benz (Atlanta)
  { id:"gA1", date:"2026-06-11", time:"19:00", homeTeam:"Mexico",       homeFlag:"🇲🇽", awayTeam:"South Africa",  awayFlag:"🇿🇦", stage:"Group A", venue:"Estadio Azteca, Mexico City" },
  { id:"gA2", date:"2026-06-12", time:"02:00", homeTeam:"South Korea",  homeFlag:"🇰🇷", awayTeam:"Czechia",       awayFlag:"🇨🇿", stage:"Group A", venue:"Estadio Akron, Guadalajara" },
  { id:"gA3", date:"2026-06-18", time:"16:00", homeTeam:"Czechia",      homeFlag:"🇨🇿", awayTeam:"South Africa",  awayFlag:"🇿🇦", stage:"Group A", venue:"Mercedes-Benz Stadium, Atlanta" },
  { id:"gA4", date:"2026-06-19", time:"01:00", homeTeam:"Mexico",       homeFlag:"🇲🇽", awayTeam:"South Korea",   awayFlag:"🇰🇷", stage:"Group A", venue:"Estadio Akron, Guadalajara" },
  { id:"gA5", date:"2026-06-25", time:"01:00", homeTeam:"Czechia",      homeFlag:"🇨🇿", awayTeam:"Mexico",        awayFlag:"🇲🇽", stage:"Group A", venue:"Estadio Azteca, Mexico City" },
  { id:"gA6", date:"2026-06-25", time:"01:00", homeTeam:"South Africa", homeFlag:"🇿🇦", awayTeam:"South Korea",   awayFlag:"🇰🇷", stage:"Group A", venue:"Estadio BBVA, Monterrey" },

  // ── GROUP B ── Canada · Bosnia & Herzegovina · Switzerland · Qatar
  // Venues: BMO Field (Toronto) · Levi's Stadium (Santa Clara) · SoFi Stadium (Inglewood) · BC Place (Vancouver) · Lumen Field (Seattle)
  { id:"gB1", date:"2026-06-12", time:"19:00", homeTeam:"Canada",       homeFlag:"🇨🇦", awayTeam:"Bosnia & Herzegovina", awayFlag:"🇧🇦", stage:"Group B", venue:"BMO Field, Toronto" },
  { id:"gB2", date:"2026-06-13", time:"19:00", homeTeam:"Qatar",        homeFlag:"🇶🇦", awayTeam:"Switzerland",   awayFlag:"🇨🇭", stage:"Group B", venue:"Levi's Stadium, Santa Clara" },
  { id:"gB3", date:"2026-06-18", time:"19:00", homeTeam:"Switzerland",  homeFlag:"🇨🇭", awayTeam:"Bosnia & Herzegovina", awayFlag:"🇧🇦", stage:"Group B", venue:"SoFi Stadium, Inglewood" },
  { id:"gB4", date:"2026-06-18", time:"22:00", homeTeam:"Canada",       homeFlag:"🇨🇦", awayTeam:"Qatar",         awayFlag:"🇶🇦", stage:"Group B", venue:"BC Place, Vancouver" },
  { id:"gB5", date:"2026-06-24", time:"19:00", homeTeam:"Switzerland",  homeFlag:"🇨🇭", awayTeam:"Canada",        awayFlag:"🇨🇦", stage:"Group B", venue:"BC Place, Vancouver" },
  { id:"gB6", date:"2026-06-24", time:"19:00", homeTeam:"Bosnia & Herzegovina", homeFlag:"🇧🇦", awayTeam:"Qatar", awayFlag:"🇶🇦", stage:"Group B", venue:"Lumen Field, Seattle" },

  // ── GROUP C ── Brazil · Morocco · Haiti · Scotland
  // Venues: MetLife Stadium (East Rutherford) · Gillette Stadium (Foxborough) · Lincoln Financial (Philadelphia) · Hard Rock Stadium (Miami Gardens) · Mercedes-Benz (Atlanta)
  { id:"gC1", date:"2026-06-13", time:"22:00", homeTeam:"Brazil",       homeFlag:"🇧🇷", awayTeam:"Morocco",       awayFlag:"🇲🇦", stage:"Group C", venue:"MetLife Stadium, East Rutherford" },
  { id:"gC2", date:"2026-06-14", time:"01:00", homeTeam:"Haiti",        homeFlag:"🇭🇹", awayTeam:"Scotland",      awayFlag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", stage:"Group C", venue:"Gillette Stadium, Foxborough" },
  { id:"gC3", date:"2026-06-19", time:"22:00", homeTeam:"Scotland",     homeFlag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", awayTeam:"Morocco",    awayFlag:"🇲🇦", stage:"Group C", venue:"Gillette Stadium, Foxborough" },
  { id:"gC4", date:"2026-06-20", time:"00:30", homeTeam:"Brazil",       homeFlag:"🇧🇷", awayTeam:"Haiti",         awayFlag:"🇭🇹", stage:"Group C", venue:"Lincoln Financial Field, Philadelphia" },
  { id:"gC5", date:"2026-06-24", time:"22:00", homeTeam:"Scotland",     homeFlag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", awayTeam:"Brazil",     awayFlag:"🇧🇷", stage:"Group C", venue:"Hard Rock Stadium, Miami Gardens" },
  { id:"gC6", date:"2026-06-24", time:"22:00", homeTeam:"Morocco",      homeFlag:"🇲🇦", awayTeam:"Haiti",         awayFlag:"🇭🇹", stage:"Group C", venue:"Mercedes-Benz Stadium, Atlanta" },

  // ── GROUP D ── USA · Paraguay · Australia · Türkiye
  // Venues: SoFi Stadium (Inglewood) · BC Place (Vancouver) · Lumen Field (Seattle) · Levi's Stadium (Santa Clara)
  { id:"gD1", date:"2026-06-13", time:"01:00", homeTeam:"USA",          homeFlag:"🇺🇸", awayTeam:"Paraguay",      awayFlag:"🇵🇾", stage:"Group D", venue:"SoFi Stadium, Inglewood" },
  { id:"gD2", date:"2026-06-14", time:"04:00", homeTeam:"Australia",    homeFlag:"🇦🇺", awayTeam:"Türkiye",       awayFlag:"🇹🇷", stage:"Group D", venue:"BC Place, Vancouver" },
  { id:"gD3", date:"2026-06-19", time:"19:00", homeTeam:"USA",          homeFlag:"🇺🇸", awayTeam:"Australia",     awayFlag:"🇦🇺", stage:"Group D", venue:"Lumen Field, Seattle" },
  { id:"gD4", date:"2026-06-20", time:"03:00", homeTeam:"Türkiye",      homeFlag:"🇹🇷", awayTeam:"Paraguay",      awayFlag:"🇵🇾", stage:"Group D", venue:"Levi's Stadium, Santa Clara" },
  { id:"gD5", date:"2026-06-26", time:"02:00", homeTeam:"Türkiye",      homeFlag:"🇹🇷", awayTeam:"USA",           awayFlag:"🇺🇸", stage:"Group D", venue:"SoFi Stadium, Inglewood" },
  { id:"gD6", date:"2026-06-26", time:"02:00", homeTeam:"Paraguay",     homeFlag:"🇵🇾", awayTeam:"Australia",     awayFlag:"🇦🇺", stage:"Group D", venue:"Levi's Stadium, Santa Clara" },

  // ── GROUP E ── Germany · Curaçao · Ivory Coast · Ecuador
  // Venues: NRG Stadium (Houston) · Lincoln Financial (Philadelphia) · BMO Field (Toronto) · Arrowhead Stadium (Kansas City) · MetLife Stadium (East Rutherford)
  { id:"gE1", date:"2026-06-14", time:"17:00", homeTeam:"Germany",      homeFlag:"🇩🇪", awayTeam:"Curaçao",       awayFlag:"🇨🇼", stage:"Group E", venue:"NRG Stadium, Houston" },
  { id:"gE2", date:"2026-06-14", time:"21:00", homeTeam:"Ivory Coast",  homeFlag:"🇨🇮", awayTeam:"Ecuador",       awayFlag:"🇪🇨", stage:"Group E", venue:"Lincoln Financial Field, Philadelphia" },
  { id:"gE3", date:"2026-06-20", time:"20:00", homeTeam:"Germany",      homeFlag:"🇩🇪", awayTeam:"Ivory Coast",   awayFlag:"🇨🇮", stage:"Group E", venue:"BMO Field, Toronto" },
  { id:"gE4", date:"2026-06-21", time:"00:00", homeTeam:"Ecuador",      homeFlag:"🇪🇨", awayTeam:"Curaçao",       awayFlag:"🇨🇼", stage:"Group E", venue:"Arrowhead Stadium, Kansas City" },
  { id:"gE5", date:"2026-06-25", time:"20:00", homeTeam:"Ecuador",      homeFlag:"🇪🇨", awayTeam:"Germany",       awayFlag:"🇩🇪", stage:"Group E", venue:"MetLife Stadium, East Rutherford" },
  { id:"gE6", date:"2026-06-25", time:"20:00", homeTeam:"Curaçao",      homeFlag:"🇨🇼", awayTeam:"Ivory Coast",   awayFlag:"🇨🇮", stage:"Group E", venue:"Lincoln Financial Field, Philadelphia" },

  // ── GROUP F ── Netherlands · Japan · Sweden · Tunisia
  // Venues: AT&T Stadium (Arlington) · Estadio BBVA (Monterrey) · NRG Stadium (Houston) · Arrowhead Stadium (Kansas City)
  { id:"gF1", date:"2026-06-14", time:"20:00", homeTeam:"Netherlands",  homeFlag:"🇳🇱", awayTeam:"Japan",         awayFlag:"🇯🇵", stage:"Group F", venue:"AT&T Stadium, Arlington" },
  { id:"gF2", date:"2026-06-15", time:"02:00", homeTeam:"Sweden",       homeFlag:"🇸🇪", awayTeam:"Tunisia",       awayFlag:"🇹🇳", stage:"Group F", venue:"Estadio BBVA, Monterrey" },
  { id:"gF3", date:"2026-06-20", time:"17:00", homeTeam:"Netherlands",  homeFlag:"🇳🇱", awayTeam:"Sweden",        awayFlag:"🇸🇪", stage:"Group F", venue:"NRG Stadium, Houston" },
  { id:"gF4", date:"2026-06-21", time:"04:00", homeTeam:"Tunisia",      homeFlag:"🇹🇳", awayTeam:"Japan",         awayFlag:"🇯🇵", stage:"Group F", venue:"Estadio BBVA, Monterrey" },
  { id:"gF5", date:"2026-06-25", time:"23:00", homeTeam:"Japan",        homeFlag:"🇯🇵", awayTeam:"Sweden",        awayFlag:"🇸🇪", stage:"Group F", venue:"AT&T Stadium, Arlington" },
  { id:"gF6", date:"2026-06-25", time:"23:00", homeTeam:"Tunisia",      homeFlag:"🇹🇳", awayTeam:"Netherlands",   awayFlag:"🇳🇱", stage:"Group F", venue:"Arrowhead Stadium, Kansas City" },

  // ── GROUP G ── Belgium · Egypt · Iran · New Zealand
  // Venues: Lumen Field (Seattle) · SoFi Stadium (Inglewood) · BC Place (Vancouver)
  { id:"gG1", date:"2026-06-15", time:"19:00", homeTeam:"Belgium",      homeFlag:"🇧🇪", awayTeam:"Egypt",         awayFlag:"🇪🇬", stage:"Group G", venue:"Lumen Field, Seattle" },
  { id:"gG2", date:"2026-06-16", time:"01:00", homeTeam:"Iran",         homeFlag:"🇮🇷", awayTeam:"New Zealand",   awayFlag:"🇳🇿", stage:"Group G", venue:"SoFi Stadium, Inglewood" },
  { id:"gG3", date:"2026-06-21", time:"19:00", homeTeam:"Belgium",      homeFlag:"🇧🇪", awayTeam:"Iran",          awayFlag:"🇮🇷", stage:"Group G", venue:"SoFi Stadium, Inglewood" },
  { id:"gG4", date:"2026-06-22", time:"01:00", homeTeam:"New Zealand",  homeFlag:"🇳🇿", awayTeam:"Egypt",         awayFlag:"🇪🇬", stage:"Group G", venue:"BC Place, Vancouver" },
  { id:"gG5", date:"2026-06-27", time:"03:00", homeTeam:"Egypt",        homeFlag:"🇪🇬", awayTeam:"Iran",          awayFlag:"🇮🇷", stage:"Group G", venue:"Lumen Field, Seattle" },
  { id:"gG6", date:"2026-06-27", time:"03:00", homeTeam:"New Zealand",  homeFlag:"🇳🇿", awayTeam:"Belgium",       awayFlag:"🇧🇪", stage:"Group G", venue:"BC Place, Vancouver" },

  // ── GROUP H ── Spain · Cape Verde · Saudi Arabia · Uruguay
  // Venues: Mercedes-Benz Stadium (Atlanta) · Hard Rock Stadium (Miami Gardens) · NRG Stadium (Houston) · Estadio Akron (Guadalajara)
  { id:"gH1", date:"2026-06-15", time:"16:00", homeTeam:"Spain",        homeFlag:"🇪🇸", awayTeam:"Cape Verde",    awayFlag:"🇨🇻", stage:"Group H", venue:"Mercedes-Benz Stadium, Atlanta" },
  { id:"gH2", date:"2026-06-15", time:"22:00", homeTeam:"Saudi Arabia", homeFlag:"🇸🇦", awayTeam:"Uruguay",       awayFlag:"🇺🇾", stage:"Group H", venue:"Hard Rock Stadium, Miami Gardens" },
  { id:"gH3", date:"2026-06-21", time:"16:00", homeTeam:"Spain",        homeFlag:"🇪🇸", awayTeam:"Saudi Arabia",  awayFlag:"🇸🇦", stage:"Group H", venue:"Mercedes-Benz Stadium, Atlanta" },
  { id:"gH4", date:"2026-06-21", time:"22:00", homeTeam:"Uruguay",      homeFlag:"🇺🇾", awayTeam:"Cape Verde",    awayFlag:"🇨🇻", stage:"Group H", venue:"Hard Rock Stadium, Miami Gardens" },
  { id:"gH5", date:"2026-06-27", time:"00:00", homeTeam:"Cape Verde",   homeFlag:"🇨🇻", awayTeam:"Saudi Arabia",  awayFlag:"🇸🇦", stage:"Group H", venue:"NRG Stadium, Houston" },
  { id:"gH6", date:"2026-06-27", time:"00:00", homeTeam:"Uruguay",      homeFlag:"🇺🇾", awayTeam:"Spain",         awayFlag:"🇪🇸", stage:"Group H", venue:"Estadio Akron, Guadalajara" },

  // ── GROUP I ── France · Senegal · Iraq · Norway
  // Venues: MetLife Stadium (East Rutherford) · Gillette Stadium (Foxborough) · Lincoln Financial (Philadelphia) · BMO Field (Toronto)
  { id:"gI1", date:"2026-06-16", time:"19:00", homeTeam:"France",       homeFlag:"🇫🇷", awayTeam:"Senegal",       awayFlag:"🇸🇳", stage:"Group I", venue:"MetLife Stadium, East Rutherford" },
  { id:"gI2", date:"2026-06-16", time:"22:00", homeTeam:"Iraq",         homeFlag:"🇮🇶", awayTeam:"Norway",        awayFlag:"🇳🇴", stage:"Group I", venue:"Gillette Stadium, Foxborough" },
  { id:"gI3", date:"2026-06-22", time:"21:00", homeTeam:"France",       homeFlag:"🇫🇷", awayTeam:"Iraq",          awayFlag:"🇮🇶", stage:"Group I", venue:"Lincoln Financial Field, Philadelphia" },
  { id:"gI4", date:"2026-06-23", time:"00:00", homeTeam:"Norway",       homeFlag:"🇳🇴", awayTeam:"Senegal",       awayFlag:"🇸🇳", stage:"Group I", venue:"MetLife Stadium, East Rutherford" },
  { id:"gI5", date:"2026-06-26", time:"19:00", homeTeam:"Norway",       homeFlag:"🇳🇴", awayTeam:"France",        awayFlag:"🇫🇷", stage:"Group I", venue:"Gillette Stadium, Foxborough" },
  { id:"gI6", date:"2026-06-26", time:"19:00", homeTeam:"Senegal",      homeFlag:"🇸🇳", awayTeam:"Iraq",          awayFlag:"🇮🇶", stage:"Group I", venue:"BMO Field, Toronto" },

  // ── GROUP J ── Argentina · Algeria · Austria · Jordan
  // Venues: Arrowhead Stadium (Kansas City) · Levi's Stadium (Santa Clara) · AT&T Stadium (Arlington)
  { id:"gJ1", date:"2026-06-17", time:"01:00", homeTeam:"Argentina",    homeFlag:"🇦🇷", awayTeam:"Algeria",       awayFlag:"🇩🇿", stage:"Group J", venue:"Arrowhead Stadium, Kansas City" },
  { id:"gJ2", date:"2026-06-17", time:"04:00", homeTeam:"Austria",      homeFlag:"🇦🇹", awayTeam:"Jordan",        awayFlag:"🇯🇴", stage:"Group J", venue:"Levi's Stadium, Santa Clara" },
  { id:"gJ3", date:"2026-06-22", time:"17:00", homeTeam:"Argentina",    homeFlag:"🇦🇷", awayTeam:"Austria",       awayFlag:"🇦🇹", stage:"Group J", venue:"AT&T Stadium, Arlington" },
  { id:"gJ4", date:"2026-06-23", time:"03:00", homeTeam:"Jordan",       homeFlag:"🇯🇴", awayTeam:"Algeria",       awayFlag:"🇩🇿", stage:"Group J", venue:"Levi's Stadium, Santa Clara" },
  { id:"gJ5", date:"2026-06-28", time:"02:00", homeTeam:"Algeria",      homeFlag:"🇩🇿", awayTeam:"Austria",       awayFlag:"🇦🇹", stage:"Group J", venue:"Arrowhead Stadium, Kansas City" },
  { id:"gJ6", date:"2026-06-28", time:"02:00", homeTeam:"Jordan",       homeFlag:"🇯🇴", awayTeam:"Argentina",     awayFlag:"🇦🇷", stage:"Group J", venue:"AT&T Stadium, Arlington" },

  // ── GROUP K ── Portugal · DR Congo · Uzbekistan · Colombia
  // Venues: NRG Stadium (Houston) · Estadio Azteca (Mexico City) · Estadio Akron (Guadalajara) · Hard Rock Stadium (Miami Gardens) · Mercedes-Benz (Atlanta)
  { id:"gK1", date:"2026-06-17", time:"17:00", homeTeam:"Portugal",     homeFlag:"🇵🇹", awayTeam:"DR Congo",      awayFlag:"🇨🇩", stage:"Group K", venue:"NRG Stadium, Houston" },
  { id:"gK2", date:"2026-06-18", time:"02:00", homeTeam:"Uzbekistan",   homeFlag:"🇺🇿", awayTeam:"Colombia",      awayFlag:"🇨🇴", stage:"Group K", venue:"Estadio Azteca, Mexico City" },
  { id:"gK3", date:"2026-06-23", time:"17:00", homeTeam:"Portugal",     homeFlag:"🇵🇹", awayTeam:"Uzbekistan",    awayFlag:"🇺🇿", stage:"Group K", venue:"NRG Stadium, Houston" },
  { id:"gK4", date:"2026-06-24", time:"02:00", homeTeam:"Colombia",     homeFlag:"🇨🇴", awayTeam:"DR Congo",      awayFlag:"🇨🇩", stage:"Group K", venue:"Estadio Akron, Guadalajara" },
  { id:"gK5", date:"2026-06-27", time:"23:30", homeTeam:"Colombia",     homeFlag:"🇨🇴", awayTeam:"Portugal",      awayFlag:"🇵🇹", stage:"Group K", venue:"Hard Rock Stadium, Miami Gardens" },
  { id:"gK6", date:"2026-06-27", time:"23:30", homeTeam:"DR Congo",     homeFlag:"🇨🇩", awayTeam:"Uzbekistan",    awayFlag:"🇺🇿", stage:"Group K", venue:"Mercedes-Benz Stadium, Atlanta" },

  // ── GROUP L ── England · Croatia · Ghana · Panama
  // Venues: AT&T Stadium (Arlington) · BMO Field (Toronto) · Gillette Stadium (Foxborough) · MetLife Stadium (East Rutherford) · Lincoln Financial (Philadelphia)
  { id:"gL1", date:"2026-06-17", time:"20:00", homeTeam:"England",      homeFlag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", awayTeam:"Croatia",     awayFlag:"🇭🇷", stage:"Group L", venue:"AT&T Stadium, Arlington" },
  { id:"gL2", date:"2026-06-17", time:"23:00", homeTeam:"Ghana",        homeFlag:"🇬🇭", awayTeam:"Panama",        awayFlag:"🇵🇦", stage:"Group L", venue:"BMO Field, Toronto" },
  { id:"gL3", date:"2026-06-23", time:"20:00", homeTeam:"England",      homeFlag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", awayTeam:"Ghana",       awayFlag:"🇬🇭", stage:"Group L", venue:"Gillette Stadium, Foxborough" },
  { id:"gL4", date:"2026-06-23", time:"23:00", homeTeam:"Panama",       homeFlag:"🇵🇦", awayTeam:"Croatia",       awayFlag:"🇭🇷", stage:"Group L", venue:"BMO Field, Toronto" },
  { id:"gL5", date:"2026-06-27", time:"21:00", homeTeam:"Panama",       homeFlag:"🇵🇦", awayTeam:"England",       awayFlag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", stage:"Group L", venue:"MetLife Stadium, East Rutherford" },
  { id:"gL6", date:"2026-06-27", time:"21:00", homeTeam:"Croatia",      homeFlag:"🇭🇷", awayTeam:"Ghana",         awayFlag:"🇬🇭", stage:"Group L", venue:"Lincoln Financial Field, Philadelphia" },

  // ── ROUND OF 32 stubs (June 28 – July 3) ─────────────────────────────────
  // Bracket pairings are approximate — update once all group stage results are confirmed.
  { id:"r32-1",  date:"2026-06-28", time:"18:00", homeTeam:"1A", homeFlag:"🏳️", awayTeam:"2C", awayFlag:"🏳️", stage:"Round of 32", venue:"MetLife Stadium, East Rutherford" },
  { id:"r32-2",  date:"2026-06-28", time:"22:00", homeTeam:"1B", homeFlag:"🏳️", awayTeam:"2D", awayFlag:"🏳️", stage:"Round of 32", venue:"SoFi Stadium, Inglewood" },
  { id:"r32-3",  date:"2026-06-28", time:"02:00", homeTeam:"1C", homeFlag:"🏳️", awayTeam:"2A", awayFlag:"🏳️", stage:"Round of 32", venue:"AT&T Stadium, Arlington" },
  { id:"r32-4",  date:"2026-06-29", time:"18:00", homeTeam:"1D", homeFlag:"🏳️", awayTeam:"2B", awayFlag:"🏳️", stage:"Round of 32", venue:"Levi's Stadium, Santa Clara" },
  { id:"r32-5",  date:"2026-06-29", time:"22:00", homeTeam:"1E", homeFlag:"🏳️", awayTeam:"2G", awayFlag:"🏳️", stage:"Round of 32", venue:"Gillette Stadium, Foxborough" },
  { id:"r32-6",  date:"2026-06-29", time:"02:00", homeTeam:"1F", homeFlag:"🏳️", awayTeam:"2H", awayFlag:"🏳️", stage:"Round of 32", venue:"Arrowhead Stadium, Kansas City" },
  { id:"r32-7",  date:"2026-06-30", time:"18:00", homeTeam:"1G", homeFlag:"🏳️", awayTeam:"2E", awayFlag:"🏳️", stage:"Round of 32", venue:"Lincoln Financial Field, Philadelphia" },
  { id:"r32-8",  date:"2026-06-30", time:"22:00", homeTeam:"1H", homeFlag:"🏳️", awayTeam:"2F", awayFlag:"🏳️", stage:"Round of 32", venue:"Mercedes-Benz Stadium, Atlanta" },
  { id:"r32-9",  date:"2026-06-30", time:"02:00", homeTeam:"1I", homeFlag:"🏳️", awayTeam:"2L", awayFlag:"🏳️", stage:"Round of 32", venue:"NRG Stadium, Houston" },
  { id:"r32-10", date:"2026-07-01", time:"18:00", homeTeam:"1J", homeFlag:"🏳️", awayTeam:"2K", awayFlag:"🏳️", stage:"Round of 32", venue:"BC Place, Vancouver" },
  { id:"r32-11", date:"2026-07-01", time:"22:00", homeTeam:"1K", homeFlag:"🏳️", awayTeam:"2J", awayFlag:"🏳️", stage:"Round of 32", venue:"BMO Field, Toronto" },
  { id:"r32-12", date:"2026-07-01", time:"02:00", homeTeam:"1L", homeFlag:"🏳️", awayTeam:"2I", awayFlag:"🏳️", stage:"Round of 32", venue:"Lumen Field, Seattle" },
  { id:"r32-13", date:"2026-07-02", time:"18:00", homeTeam:"3rd", homeFlag:"🏳️", awayTeam:"3rd", awayFlag:"🏳️", stage:"Round of 32", venue:"Hard Rock Stadium, Miami Gardens" },
  { id:"r32-14", date:"2026-07-02", time:"22:00", homeTeam:"3rd", homeFlag:"🏳️", awayTeam:"3rd", awayFlag:"🏳️", stage:"Round of 32", venue:"Estadio Azteca, Mexico City" },
  { id:"r32-15", date:"2026-07-03", time:"18:00", homeTeam:"3rd", homeFlag:"🏳️", awayTeam:"3rd", awayFlag:"🏳️", stage:"Round of 32", venue:"Estadio Akron, Guadalajara" },
  { id:"r32-16", date:"2026-07-03", time:"22:00", homeTeam:"3rd", homeFlag:"🏳️", awayTeam:"3rd", awayFlag:"🏳️", stage:"Round of 32", venue:"Estadio BBVA, Monterrey" },

  // ── ROUND OF 16 stubs (July 4 – 7) ───────────────────────────────────────
  { id:"r16-1", date:"2026-07-04", time:"18:00", homeTeam:"W-r32-1",  homeFlag:"🏳️", awayTeam:"W-r32-2",  awayFlag:"🏳️", stage:"Round of 16", venue:"MetLife Stadium, East Rutherford" },
  { id:"r16-2", date:"2026-07-04", time:"22:00", homeTeam:"W-r32-3",  homeFlag:"🏳️", awayTeam:"W-r32-4",  awayFlag:"🏳️", stage:"Round of 16", venue:"SoFi Stadium, Inglewood" },
  { id:"r16-3", date:"2026-07-05", time:"18:00", homeTeam:"W-r32-5",  homeFlag:"🏳️", awayTeam:"W-r32-6",  awayFlag:"🏳️", stage:"Round of 16", venue:"AT&T Stadium, Arlington" },
  { id:"r16-4", date:"2026-07-05", time:"22:00", homeTeam:"W-r32-7",  homeFlag:"🏳️", awayTeam:"W-r32-8",  awayFlag:"🏳️", stage:"Round of 16", venue:"Levi's Stadium, Santa Clara" },
  { id:"r16-5", date:"2026-07-06", time:"18:00", homeTeam:"W-r32-9",  homeFlag:"🏳️", awayTeam:"W-r32-10", awayFlag:"🏳️", stage:"Round of 16", venue:"Gillette Stadium, Foxborough" },
  { id:"r16-6", date:"2026-07-06", time:"22:00", homeTeam:"W-r32-11", homeFlag:"🏳️", awayTeam:"W-r32-12", awayFlag:"🏳️", stage:"Round of 16", venue:"Mercedes-Benz Stadium, Atlanta" },
  { id:"r16-7", date:"2026-07-07", time:"18:00", homeTeam:"W-r32-13", homeFlag:"🏳️", awayTeam:"W-r32-14", awayFlag:"🏳️", stage:"Round of 16", venue:"Arrowhead Stadium, Kansas City" },
  { id:"r16-8", date:"2026-07-07", time:"22:00", homeTeam:"W-r32-15", homeFlag:"🏳️", awayTeam:"W-r32-16", awayFlag:"🏳️", stage:"Round of 16", venue:"NRG Stadium, Houston" },

  // ── QUARTER-FINALS stubs (July 9 – 10) ───────────────────────────────────
  { id:"qf-1", date:"2026-07-09", time:"18:00", homeTeam:"W-r16-1", homeFlag:"🏳️", awayTeam:"W-r16-2", awayFlag:"🏳️", stage:"Quarter-final", venue:"MetLife Stadium, East Rutherford" },
  { id:"qf-2", date:"2026-07-09", time:"22:00", homeTeam:"W-r16-3", homeFlag:"🏳️", awayTeam:"W-r16-4", awayFlag:"🏳️", stage:"Quarter-final", venue:"SoFi Stadium, Inglewood" },
  { id:"qf-3", date:"2026-07-10", time:"18:00", homeTeam:"W-r16-5", homeFlag:"🏳️", awayTeam:"W-r16-6", awayFlag:"🏳️", stage:"Quarter-final", venue:"AT&T Stadium, Arlington" },
  { id:"qf-4", date:"2026-07-10", time:"22:00", homeTeam:"W-r16-7", homeFlag:"🏳️", awayTeam:"W-r16-8", awayFlag:"🏳️", stage:"Quarter-final", venue:"MetLife Stadium, East Rutherford" },

  // ── SEMI-FINALS stubs (July 14 – 15) ─────────────────────────────────────
  { id:"sf-1", date:"2026-07-14", time:"22:00", homeTeam:"W-qf-1", homeFlag:"🏳️", awayTeam:"W-qf-2", awayFlag:"🏳️", stage:"Semi-final", venue:"MetLife Stadium, East Rutherford" },
  { id:"sf-2", date:"2026-07-15", time:"22:00", homeTeam:"W-qf-3", homeFlag:"🏳️", awayTeam:"W-qf-4", awayFlag:"🏳️", stage:"Semi-final", venue:"SoFi Stadium, Inglewood" },

  // ── THIRD PLACE + FINAL stubs ─────────────────────────────────────────────
  { id:"3rd",   date:"2026-07-18", time:"22:00", homeTeam:"L-sf-1", homeFlag:"🏳️", awayTeam:"L-sf-2", awayFlag:"🏳️", stage:"Third Place", venue:"AT&T Stadium, Arlington" },
  { id:"final", date:"2026-07-19", time:"22:00", homeTeam:"W-sf-1", homeFlag:"🏳️", awayTeam:"W-sf-2", awayFlag:"🏳️", stage:"Final",       venue:"MetLife Stadium, East Rutherford" }

];
