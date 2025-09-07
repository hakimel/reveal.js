// utils.js - helpers
function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
function hslToHex(h,s,l){
  h = h%360; s = clamp(s,0,100); l = clamp(l,0,100);
  s/=100; l/=100;
  const C = (1 - Math.abs(2*l - 1))*s;
  const X = C*(1 - Math.abs((h/60)%2 - 1));
  const m = l - C/2;
  let r=0,g=0,b=0;
  if(0<=h && h<60){r=C; g=X}
  else if(60<=h && h<120){r=X; g=C}
  else if(120<=h && h<180){g=C; b=X}
  else if(180<=h && h<240){g=X; b=C}
  else if(240<=h && h<300){r=X; b=C}
  else{r=C; b=X}
  const toHex = x => ('0'+Math.round((x+m)*255).toString(16)).slice(-2);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
function hexToHsl(hex){
  hex = hex.replace('#','');
  const r = parseInt(hex.slice(0,2),16)/255;
  const g = parseInt(hex.slice(2,4),16)/255;
  const b = parseInt(hex.slice(4,6),16)/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h,s,l = (max+min)/2;
  if(max===min){h=0;s=0}
  else{
    const d = max-min;
    s = l>0.5 ? d/(2-max-min) : d/(max+min);
    switch(max){
      case r: h = (g-b)/d + (g<b?6:0); break;
      case g: h = (b-r)/d + 2; break;
      case b: h = (r-g)/d + 4; break;
    }
    h*=60;
  }
  s = s*100; l = l*100;
  return {h,s,l};
}
function download(filename, text){
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], {type:'application/json'}));
  a.download = filename;
  a.click();
}
