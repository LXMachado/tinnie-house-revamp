/* ============================================================
   TINNIE HOUSE RECORDS — catalog data
   ============================================================ */
window.THR = window.THR || {};

window.THR.GENRES = ["Techno","Melodic Techno","Prog House","Deep / Hypnotic","Ambient"];

window.THR.spotlight = {
  cat:"TH021", title:"CABARITA", artist:"Rafa Kao & Gabriel Samy",
  genres:["Melodic Techno","Maxi Single"], bpm:123, key:"F# min",
  released:"01 JUL 2026", tracks:2, seed:2107, style:"warp",
  beatport:"Beatport exclusive · 01–14 July, then all platforms",
  desc:"The label\u2019s flagship summer release. Rafa Kao and Gabriel Samy trade hypnotic, sun-bleached melodies over a relentless low-end \u2014 named for the headland where the Gold Coast underground breathes. Out exclusively on Beatport before hitting every platform."
};

/* style ∈ rings | warp | grid | ink | particles | scan */
window.THR.releases = [
  {cat:"TH018", title:"RITUAL",        artist:"Rafa Kao & Gabriel Samy",  genre:"Melodic Techno", bpm:122, tracks:1, seed:418,  style:"warp"},
  {cat:"TH017", title:"MORPHING",      artist:"DJ JRI",                   genre:"Melodic Techno", bpm:123, tracks:2, seed:317,  style:"ink"},
  {cat:"TH016", title:"AURORA",        artist:"DJ JRI",                   genre:"Prog House",     bpm:120, tracks:2, seed:216,  style:"rings"},
  {cat:"TH015", title:"NULL VECTOR",   artist:"Kvasir",                   genre:"Techno",         bpm:132, tracks:3, seed:915,  style:"grid"},
  {cat:"TH014", title:"OBSIDIAN",      artist:"Lena Frost",               genre:"Deep / Hypnotic",bpm:126, tracks:2, seed:614,  style:"scan"},
  {cat:"TH013", title:"DRIFT STATE",   artist:"Mira Volt",                genre:"Melodic Techno", bpm:121, tracks:4, seed:713,  style:"warp"},
  {cat:"TH012", title:"HALOGEN",       artist:"Kvasir",                   genre:"Techno",         bpm:134, tracks:2, seed:512,  style:"particles"},
  {cat:"TH011", title:"PALE FIRE",     artist:"Soren Ash",                genre:"Prog House",     bpm:119, tracks:3, seed:411,  style:"rings"},
  {cat:"TH010", title:"GRAVITY WELL",  artist:"Mira Volt",                genre:"Deep / Hypnotic",bpm:125, tracks:2, seed:310,  style:"ink"},
  {cat:"TH009", title:"COLD START",    artist:"Nyx Reactor",              genre:"Techno",         bpm:138, tracks:1, seed:209,  style:"grid"},
  {cat:"TH008", title:"SOLSTICE",      artist:"Lena Frost",               genre:"Ambient",        bpm:0,   tracks:5, seed:108,  style:"scan"},
  {cat:"TH007", title:"VORTEX 88",     artist:"Soren Ash",                genre:"Melodic Techno", bpm:123, tracks:2, seed:788,  style:"warp"},
  {cat:"TH006", title:"NEON DECAY",    artist:"Nyx Reactor",              genre:"Techno",         bpm:136, tracks:3, seed:606,  style:"particles"},
  {cat:"TH005", title:"TIDE LOCK",     artist:"Mira Volt",                genre:"Prog House",     bpm:118, tracks:2, seed:505,  style:"rings"},
  {cat:"TH004", title:"PHANTOM LIMB",  artist:"Kvasir",                   genre:"Deep / Hypnotic",bpm:127, tracks:2, seed:404,  style:"ink"},
  {cat:"TH003", title:"ASHFALL",       artist:"Soren Ash",                genre:"Ambient",        bpm:0,   tracks:4, seed:303,  style:"scan"},
  {cat:"TH002", title:"MAGNETO",       artist:"Nyx Reactor",              genre:"Techno",         bpm:140, tracks:2, seed:202,  style:"grid"},
  {cat:"TH001", title:"GENESIS",       artist:"Rafa Kao",                 genre:"Melodic Techno", bpm:122, tracks:3, seed:101,  style:"warp"},
];

window.THR.artists = [
  {name:"RAFA KAO",     role:"Melodic Techno · Founder", n:"A-01", seed:7711, releases:4},
  {name:"KVASIR",       role:"Hard Techno",              n:"A-02", seed:7722, releases:4},
  {name:"MIRA VOLT",    role:"Deep / Hypnotic",          n:"A-03", seed:7733, releases:3},
  {name:"NYX REACTOR",  role:"Industrial Techno",        n:"A-04", seed:7744, releases:4},
  {name:"SOREN ASH",    role:"Progressive House",        n:"A-05", seed:7755, releases:3},
  {name:"LENA FROST",   role:"Ambient / Drone",          n:"A-06", seed:7766, releases:2},
  {name:"DJ JRI",       role:"Melodic / Prog",           n:"A-07", seed:7777, releases:2},
  {name:"GABRIEL SAMY",role:"Melodic Techno",           n:"A-08", seed:7788, releases:1},
];
