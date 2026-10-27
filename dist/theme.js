(()=>{
 const root=document.documentElement,storageKey='car-pocket-theme',system=window.matchMedia('(prefers-color-scheme: dark)');
 let preference;try{preference=localStorage.getItem(storageKey)}catch{}
 function apply(theme){root.dataset.theme=theme;root.style.colorScheme=theme;const dark=theme==='dark';document.querySelector('meta[name="theme-color"]')?.setAttribute('content',dark?'#14151d':'#f6f5f1');document.querySelector('#themeToggle')?.setAttribute('aria-checked',String(dark));}
 apply(preference==='dark'||preference==='light'?preference:system.matches?'dark':'light');
 document.addEventListener('DOMContentLoaded',()=>{apply(root.dataset.theme);document.querySelector('#themeToggle').onclick=()=>{preference=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem(storageKey,preference)}catch{}apply(preference)};});
 system.addEventListener('change',()=>{if(preference!=='dark'&&preference!=='light')apply(system.matches?'dark':'light')});
 window.addEventListener('storage',e=>{if(e.key===storageKey){preference=e.newValue;apply(preference==='dark'||preference==='light'?preference:system.matches?'dark':'light')}});
})();
