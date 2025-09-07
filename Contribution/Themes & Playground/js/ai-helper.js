// ai-helper.js - heuristic 'AI' suggesters (no API needed)
const AI = {
  suggestPalette(keyword){
    const k = (keyword||'').toLowerCase();
    if(k.includes('ocean')) return ['#0ea5e9','#0369a1','#22d3ee','#67e8f9','#082f49'];
    if(k.includes('sunset')) return ['#fb923c','#f97316','#ef4444','#f59e0b','#fde047'];
    if(k.includes('forest')) return ['#065f46','#10b981','#84cc16','#14532d','#064e3b'];
    if(k.includes('pastel')) return ['#ffd6e7','#ffedd5','#dbeafe','#e9d5ff','#dcfce7'];
    // default complementary-ish based on hash
    return null;
  },
  suggestTheme(keyword){
    const k = (keyword||'').toLowerCase();
    if(k.includes('dark')||k.includes('midnight')) return 'dark';
    if(k.includes('light')||k.includes('clean')) return 'light';
    if(k.includes('solar')) return 'solarized';
    if(k.includes('pastel')) return 'pastel';
    return 'midnight';
  }
};
