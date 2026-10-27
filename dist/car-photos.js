/* Public vehicle reference photos from Wikimedia Commons. No wallet identifiers are sent. */
const CarPhotos=(()=>{
 const normalize=s=>String(s||'').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 const signature=v=>[v.year,v.make,v.model,v.color,v.trim,v.body].map(normalize).join('|');
 const clean=s=>String(s||'').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&[^;]+;/g,' ').replace(/\s+/g,' ').trim().slice(0,600);
 function trustedURL(value,host){try{const u=new URL(value);return u.protocol==='https:'&&(u.hostname===host||u.hostname.endsWith('.'+host))?u.href:null}catch{return null}}
 function rank(page,v){const title=clean(page.title).replace(/^File:/i,''),text=normalize(title),prefix=title.match(/^(\d{4})(?:\s*[-–—]\s*(\d{4}))?\s+/)||((normalize(title.replace(/\([^)]*\)/g,''))).startsWith(normalize(v.make+' '+v.model)+' ')?title.replace(/\([^)]*\)/g,'').match(/\b(\d{4})(?:\s*[-–—]\s*(\d{4}))?\b/):null),info=page.imageinfo?.[0],meta=info?.extmetadata||{};
  if(!prefix||!info?.thumburl||!/^image\/(jpeg|png|webp)$/.test(info.mime||''))return null;
  const year=Number(v.year),start=Number(prefix[1]),end=Number(prefix[2]||prefix[1]);if(year<start||year>end||end-start>15)return null;
  const words=normalize(v.make+' '+v.model).split(' ').filter(Boolean);if(!words.length||!words.every(w=>text.split(' ').includes(w)))return null;
  if(/\b(interior|engine|dashboard|steering|wheel|badge|logo|crash|wreck|diecast|toy|model car)\b/i.test(title))return null;
  const license=clean(meta.LicenseShortName?.value);if(!/^(CC0|CC BY(?:-SA)?\b|Public domain)/i.test(license))return null;
  const url=trustedURL(info.thumburl,'upload.wikimedia.org')||trustedURL(info.thumburl,'thumb.wikimedia.org'),source=trustedURL(info.descriptionurl,'commons.wikimedia.org');if(!url||!source)return null;
  let score=prefix[2]?20:40;if(/\b(front|side|sedan|hatchback|suv|coupe|wagon)\b/i.test(title))score+=8;if(/\b(rear|back)\b/i.test(title))score-=8;
  for(const w of normalize(v.color+' '+v.trim+' '+v.body).split(' ').filter(Boolean))if(text.split(' ').includes(w))score+=4;
  return {url,source,title,artist:clean(meta.Artist?.value)||'Wikimedia Commons contributor',license,licenseUrl:trustedURL(meta.LicenseUrl?.value,'creativecommons.org'),score};
 }
 async function get(url,timeout=18000){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);try{const response=await fetch(url,{signal:controller.signal,credentials:'omit',referrerPolicy:'no-referrer'});if(!response.ok)throw Error('Photo service is unavailable.');return response}finally{clearTimeout(timer)}}
 async function search(v){if(!/^\d{4}$/.test(String(v.year))||!normalize(v.make)||!normalize(v.model))return [];
  const term=s=>normalize(s).split(' ').filter(Boolean).map(x=>'"'+x+'"').join(' '),base=term(v.make)+' '+term(v.model)+' filetype:bitmap';
  async function query(q){const params=new URLSearchParams({action:'query',format:'json',origin:'*',generator:'search',gsrnamespace:'6',gsrsearch:q,gsrlimit:'30',prop:'imageinfo',iiprop:'url|mime|extmetadata',iiurlwidth:'960',iiextmetadatafilter:'Artist|LicenseShortName|LicenseUrl',iiextmetadatalanguage:'en'});const json=await (await get('https://commons.wikimedia.org/w/api.php?'+params)).json();if(json.error)throw Error('Photo service is unavailable.');return Object.values(json.query?.pages||{}).map(p=>rank(p,v)).filter(Boolean)}
  let matches=await query('"'+v.year+'" '+base);if(!matches.length)matches=await query(base);return matches.sort((a,b)=>b.score-a.score);
 }
 async function resize(blob){if(!['image/jpeg','image/png','image/webp'].includes(blob.type))throw Error('Please use a JPEG, PNG, or WebP photo.');if(blob.size>15*1024*1024)throw Error('Choose a photo smaller than 15 MB.');const url=URL.createObjectURL(blob);try{const img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(Error('Could not open this photo. Try a JPEG or PNG.'));img.src=url});const ratio=Math.min(1,1200/Math.max(img.naturalWidth,img.naturalHeight)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*ratio));canvas.height=Math.max(1,Math.round(img.naturalHeight*ratio));const context=canvas.getContext('2d');context.fillStyle='#ffffff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(img,0,0,canvas.width,canvas.height);return canvas.toDataURL('image/jpeg',.85)}finally{URL.revokeObjectURL(url)}}
 async function download(match){const blob=await (await get(match.url)).blob(),data=await resize(blob);return {kind:'web',data,title:match.title,source:match.source,artist:match.artist,license:match.license,licenseUrl:match.licenseUrl}}
 async function fromUpload(file){return {kind:'custom',data:await resize(file),title:'Your vehicle photo'}}
 return {normalize,signature,rank,search,download,fromUpload,trustedURL};
})();
