const v={USD:1,EUR:.92,BRL:5,JPY:150},N=/((R\$|€|\$)\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?|\d+))|(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?\s*(USD|EUR|BRL))/gi,j=1256.67,z=["google.com","amazon.com","amazon.com.br","amazon.co.uk","amazon.de","amazon.fr","amazon.it","amazon.es","amazon.ca","amazon.com.au","amazon.co.jp","ebay.com","ebay.co.uk","ebay.de","walmart.com","target.com","bestbuy.com","costco.com","alibaba.com","shopify.com","etsy.com","aliexpress.com"];function h(t){return t.replace(/^www\./,"").toLowerCase()}function I(t){try{const e=new URL(t).hostname;return h(e)}catch{const n=t.replace(/^https?:\/\//,"").split("/")[0];return h(n)}}function F(t){const e=h(t),n=e.split("."),o=["co.uk","com.au","co.jp","com.br"];for(const s of o)if(e.endsWith("."+s)){const i=e.replace("."+s,"");return i.split(".").pop()||i}return n.length===2?n[0]:n.length>=3?n[n.length-2]:n[0]}function Q(t,e){const n=h(t),o=F(n);if(e.includes(n))return!0;for(const s of e){const i=h(s),d=F(i);if(n===i||o===d&&o||n.endsWith("."+i)||i.endsWith("."+n))return!0}return!1}function M(t){let e=t.parentElement;for(;e&&e!==document.body;){if(e.hasAttribute("data-timecost-trigger")||e.hasAttribute("data-timecost-wrapper")||e.hasAttribute("data-timecost-element")||e.classList.contains("timecost-wrapper"))return!0;e=e.parentElement}return!1}function B(t){let e=t.nodeType===Node.TEXT_NODE?t.parentElement:t;if(!e)return!1;for(;e&&e!==document.body;){const n=e.tagName?.toLowerCase();if(n==="s"||n==="strike"||n==="del")return!0;const o=window.getComputedStyle(e),s=o.textDecoration||o.textDecorationLine;if(s&&s.includes("line-through")||e.style.textDecoration&&e.style.textDecoration.includes("line-through")||e.style.textDecorationLine&&e.style.textDecorationLine.includes("line-through"))return!0;e=e.parentElement}return!1}function H(t,e){let n="USD";t.includes("R$")||t.includes("BRL")?n="BRL":(t.includes("€")||t.includes("EUR"))&&(n="EUR");let o=t.replace(/[^\d.,]/g,"").trim(),s=!1;const i=/,\d{3}\./,d=/\.\d{3},/;if(i.test(o))s=!0;else if(d.test(o))s=!1;else if(o.includes(".")&&o.includes(",")){const a=o.lastIndexOf("."),u=o.lastIndexOf(",");s=a>u}else if(o.includes(".")){const a=o.split("."),u=a[a.length-1];a.length===2&&u.length<=2?s=!0:a.length>2||u.length===3?s=!1:s=u.length<=2}else if(o.includes(",")){const a=o.split(",");s=a[a.length-1].length===3&&a.length>1}else s=n==="USD";if(s)o.includes(".")?o=o.replace(/,/g,""):o.includes(",")&&(o=o.replace(/,/g,""));else if(o.includes(","))o=o.replace(/\./g,"").replace(",",".");else if(o.includes(".")){const a=o.split("."),u=a[a.length-1];a.length>2?o=o.replace(/\./g,""):u.length===3?o=o.replace(/\./g,""):u.length<=2||(o=o.replace(/\./g,""))}const l=parseFloat(o);return{price:isNaN(l)||l===0?null:l,currency:n}}function O(t,e,n,o){const s=t/v[e],d=n/v[o]/22,a=s/d*8;return a<1?`${Math.round(a*60)}m`:`${Math.round(a*10)/10}h`}let b=null,V=null;function Y(t,e){V=t}function k(t,e){return e==="JPY"?Math.round(t).toLocaleString("en-US").replace(/,/g,"."):e==="BRL"||e==="EUR"?t.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}):t.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}function X(t){const e=t.currentTarget,n=e.getAttribute("data-timecost"),o=e.getAttribute("data-original-price"),{price:s,currency:i}=H(o);if(!s||!V)return;const d=s/v[i],l=d*v.JPY,a=d*v.BRL,u=d*v.EUR,f=k(l,"JPY"),x=k(a,"BRL"),p=k(u,"EUR");b&&b.remove();const r=document.createElement("div");r.className="timecost-hover-tooltip",r.setAttribute("data-timecost-tooltip","true"),r.innerHTML=`
    <div style="padding: 16px;">
      <div style="font-size: 18px; font-weight: 700; margin-bottom: 12px; color: #000; font-family: sans-serif;">
        ${n.toUpperCase()}
      </div>
      <div style="height: 1px; background-color: rgba(0, 0, 0, 0.1); margin-bottom: 12px;"></div>
      <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: #000;">
          <span style="font-size: 16px;">🇯🇵</span>
          <span>JPY</span>
          <span style="margin-left: auto;">${f}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: #000;">
          <span style="font-size: 16px;">🇧🇷</span>
          <span>BRL</span>
          <span style="margin-left: auto;">${x}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: #000;">
          <span style="font-size: 16px;">🇪🇺</span>
          <span>EUR</span>
          <span style="margin-left: auto;">${p}</span>
        </div>
      </div>
      <div style="text-align: center; margin-top: 8px;">
        <span style="font-size: 12px; font-weight: 700; color: #a8d87a; font-family: 'Boldonse', sans-serif;">HOWMUCH?</span>
      </div>
    </div>
  `,r.style.cssText=`
    position: absolute;
    z-index: 999999;
    width: 200px;
    border-radius: 12px;
    background-color: #dafaa2;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s ease-in-out;
  `,document.body.appendChild(r),b=r;const c=e.getBoundingClientRect(),m=r.getBoundingClientRect(),g=window.pageXOffset||document.documentElement.scrollLeft,w=window.pageYOffset||document.documentElement.scrollTop;let A=c.top+w-m.height-8,T=c.left+g+c.width/2-m.width/2;A<w&&(A=c.bottom+w+8),T<g?T=g+8:T+m.width>g+window.innerWidth&&(T=g+window.innerWidth-m.width-8),r.style.top=`${A}px`,r.style.left=`${T}px`,requestAnimationFrame(()=>{r.style.opacity="1"})}function q(t){b&&(b.style.opacity="0",setTimeout(()=>{b&&b.parentNode&&b.remove(),b=null},150))}const W=new WeakSet;function Z(t){const e=t.querySelector(".a-offscreen");if(e){const n=e.textContent.trim();if(n&&/(R\$|€|\$)/.test(n)&&/\d/.test(n))return n}return null}function ee(t){let e=t;for(;e&&e!==document.body;){if(e.hasAttribute&&e.hasAttribute("data-a-strike")&&e.getAttribute("data-a-strike")==="true")return!0;e=e.parentElement}return!1}function J(t,e,n,o){t.querySelectorAll(".a-price:not([data-timecost-processed])").forEach(i=>{if(W.has(i)||M(i)||ee(i)||B(i))return;W.add(i),i.setAttribute("data-timecost-processed","true");const d=Z(i);if(d)try{let a=new RegExp(N).exec(d),u=a?a[0]:d;const{price:f,currency:x}=H(u);if(!f||f===0)return;const p=O(f,x,e,n);if(o==="compact"){const r=document.createElement("span");r.textContent=p,r.style.cssText=`
          display: inline-flex;
          align-items: center;
          justify-content: center;
          vertical-align: middle;
          padding: 2px 6px;
          border-radius: 100px;
          background-color: #dafaa2;
          color: #000;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.2;
        `,i.parentNode&&i.parentNode.replaceChild(r,i)}else if(o==="comfortable"){const r=document.createElement("span");r.style.cssText="display: inline-flex; align-items: center; gap: 4px; position: relative; cursor: pointer;",r.setAttribute("data-timecost-trigger","true"),r.setAttribute("data-timecost",p),r.setAttribute("data-original-price",d);const c=document.createElement("span");c.innerHTML=`
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b9e3e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle;">
            <circle cx="12" cy="12" r="10"/>
            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
            <path d="M12 18V6"/>
          </svg>
        `,c.style.cssText="display: inline-flex; align-items: center; line-height: 1; flex-shrink: 0;";const m=i.parentNode;m?(m.insertBefore(r,i),r.appendChild(i),r.appendChild(c)):(i.appendChild(c),i.style.cssText+="position: relative; display: inline-flex; align-items: center; gap: 4px; cursor: pointer;"),r.addEventListener("mouseenter",X),r.addEventListener("mouseleave",q)}else{const r=document.createElement("span");r.style.cssText="display: inline-flex; align-items: center; vertical-align: middle;",r.setAttribute("data-timecost-wrapper","true");const c=i.parentNode;c?(c.insertBefore(r,i),r.appendChild(i)):i.appendChild(r);const m=document.createElement("span");m.textContent=` ${p}`,m.setAttribute("data-timecost-element","true"),m.style.cssText=`
          display: inline-flex;
          align-items: center;
          margin-left: 4px;
          padding: 2px 6px;
          border-radius: 100px;
          background-color: #dafaa2;
          color: #000;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.2;
        `,r.appendChild(m)}}catch(l){console.error("TimeCost Error parsing Amazon price:",d,l)}})}function te(t,e,n,o,s){return J(t,e,n,o),!1}function ne(t){let e=t.parentElement;for(;e&&e!==document.body;){if(e.classList.contains("a-price")&&e.hasAttribute("data-timecost-processed"))return!0;e=e.parentElement}return!1}const y=Object.freeze(Object.defineProperty({__proto__:null,isInProcessedAmazonPrice:ne,processAmazonPrices:J,scanAndConvert:te},Symbol.toStringTag,{value:"Module"}));function oe(t,e,n,o){const s=t.nodeValue,i=[];let d;const l=new RegExp(N);for(;(d=l.exec(s))!==null;)i.push({match:d[0],index:d.index,length:d[0].length});if(i.length===0)return;const a=i.map(p=>{const r=p.match;try{const{price:c,currency:m}=H(r);if(!c||c===0)return null;const g=O(c,m,e,n);return{...p,timeCost:g}}catch(c){return console.error("TimeCost Error parsing:",r,c),null}}).filter(p=>p!==null);if(a.length===0||B(t))return;const u=document.createDocumentFragment();let f=0;a.forEach(p=>{if(p.index>f){const r=s.substring(f,p.index);u.appendChild(document.createTextNode(r))}if(o==="compact"){const r=document.createElement("span");r.textContent=p.timeCost,r.style.cssText=`
        display: inline-flex;
        align-items: center;
        justify-content: center;
        vertical-align: middle;
        padding: 2px 6px;
        border-radius: 100px;
        background-color: #dafaa2;
        color: #000;
        font-size: 16px;
        font-weight: 700;
        line-height: 1.2;
      `,u.appendChild(r)}else if(o==="comfortable"){const r=document.createElement("span");r.style.cssText="position: relative; display: inline-flex; align-items: center; gap: 4px;",r.setAttribute("data-timecost-trigger","true");const c=document.createElement("span");c.innerHTML=`
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b9e3e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle;">
          <circle cx="12" cy="12" r="10"/>
          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
          <path d="M12 18V6"/>
        </svg>
      `,c.style.cssText="display: inline-flex; align-items: center; line-height: 1;";const m=document.createTextNode(p.match);r.appendChild(m),r.appendChild(c),r.setAttribute("data-timecost",p.timeCost),r.setAttribute("data-original-price",p.match),r.addEventListener("mouseenter",X),r.addEventListener("mouseleave",q),u.appendChild(r)}else{const r=document.createElement("span");r.style.cssText="display: inline-flex; align-items: center; vertical-align: middle;";const c=document.createElement("span");c.textContent=p.match,r.appendChild(c);const m=document.createElement("span");m.textContent=` ${p.timeCost}`,m.style.cssText=`
        display: inline-flex;
        align-items: center;
        margin-left: 4px;
        padding: 2px 6px;
        border-radius: 100px;
        background-color: #dafaa2;
        color: #000;
        font-size: 16px;
        font-weight: 700;
        line-height: 1.2;
      `,r.appendChild(m),u.appendChild(r)}f=p.index+p.length}),f<s.length&&u.appendChild(document.createTextNode(s.substring(f))),t.parentNode.replaceChild(u,t)}function G(t,e,n,o,s,i=null){if(!s)return console.warn("TimeCost: processedTextNodesSet not provided to generic handler"),!0;const d=document.createTreeWalker(t,NodeFilter.SHOW_TEXT,null,!1);let l;for(;l=d.nextNode();){if(!l.parentElement||l.parentElement.tagName.match(/SCRIPT|STYLE|TEXTAREA|INPUT/)||s.has(l)||M(l)||B(l)||i&&i(l))continue;const a=l.nodeValue;a&&a.trim()&&new RegExp(N).test(a)&&(s.add(l),oe(l,e,n,o))}return!0}const $=Object.freeze(Object.defineProperty({__proto__:null,scanAndConvert:G},Symbol.toStringTag,{value:"Module"})),D={"amazon.com":y,"amazon.co.uk":y,"amazon.de":y,"amazon.fr":y,"amazon.it":y,"amazon.es":y,"amazon.ca":y,"amazon.com.au":y,"amazon.co.jp":y};function U(t){const e=h(t),n=e.split("."),o=["co.uk","com.au","co.jp","com.br"];for(const s of o)if(e.endsWith("."+s)){const i=e.replace("."+s,"");return i.split(".").pop()||i}return n.length===2?n[0]:n.length>=3?n[n.length-2]:n[0]}function K(t){const e=I(t),n=h(e);if(D[n])return D[n];const o=U(n),s=Object.keys(D).find(i=>U(i)===o);return s?D[s]:$}function re(t){const e=I(t),n=h(e),o=U(n);return K(t)!==$?o:"generic"}let C=j,S="USD",R=[],L="default",E=null;const _=new WeakSet;chrome.storage.local.get(["userSalary","userCurrency","whitelist","spacingMode"],t=>{if(t.userSalary&&t.userCurrency?(C=parseFloat(t.userSalary),S=t.userCurrency):(C=j,S="USD"),Y(C),t.spacingMode&&["default","comfortable","compact"].includes(t.spacingMode)&&(L=t.spacingMode),t.whitelist&&Array.isArray(t.whitelist)&&t.whitelist.length>0){const n=t.whitelist.map(s=>h(s)),o=z.map(s=>h(s));R=[...new Set([...o,...n])],chrome.storage.local.set({whitelist:[...new Set([...z,...t.whitelist])]})}else R=z.map(n=>h(n)),chrome.storage.local.set({whitelist:z});const e=I(window.location.href);Q(e,R)?ie():console.log("TimeCost: Domain not whitelisted, skipping processing:",e)});function ie(){const t=window.location.href;E=K(t);const e=re(t);console.log(`TimeCost: Using handler for site: ${e}`),P(document.body);let n=null;const o=100;new MutationObserver(i=>{n&&clearTimeout(n);const d=[];i.forEach(l=>{l.addedNodes.forEach(a=>{a.nodeType===1&&a.tagName!=="SCRIPT"&&a.tagName!=="STYLE"&&(M(a)||d.push(a))})}),n=setTimeout(()=>{d.forEach(l=>{P(l)}),n=null},o)}).observe(document.body,{childList:!0,subtree:!0}),chrome.storage.onChanged.addListener((i,d)=>{if(d==="local"){if(i.userSalary||i.userCurrency){const l=i.userSalary?parseFloat(i.userSalary.newValue):C,a=i.userCurrency?i.userCurrency.newValue:S;C=l,S=a,Y(C)}i.spacingMode&&(L=i.spacingMode.newValue||"default",requestAnimationFrame(()=>{const l=document.querySelectorAll("[data-timecost-trigger]"),a=document.querySelectorAll('span[style*="background-color: #dafaa2"]'),u=(x,p,r=50)=>{const c=Math.min(p+r,x.length);for(let m=p;m<c;m++){const g=x[m],w=g.parentNode;if(w)if(g.hasAttribute("data-timecost-trigger")){const A=g.getAttribute("data-original-price")||g.textContent,T=document.createTextNode(A);w.replaceChild(T,g),w.normalize()}else w.normalize()}c<x.length?setTimeout(()=>u(x,c,r),0):P(document.body)},f=Array.from(new Set([...l,...a]));f.length>0?u(f,0):P(document.body)}))}})}function P(t){if(!E||!E.scanAndConvert){console.error("TimeCost: Site handler not available or missing scanAndConvert method");return}if(E.scanAndConvert(t,C,S,L,_)||E===$)return;const n=E.isInProcessedAmazonPrice?o=>E.isInProcessedAmazonPrice(o):null;G(t,C,S,L,_,n)}
