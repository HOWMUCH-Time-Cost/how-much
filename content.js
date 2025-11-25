const L={USD:1,EUR:.92,BRL:5},R=/((R\$|€|\$)\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?|\d+))|(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?\s*(USD|EUR|BRL))/gi,$=1256.67,T=["google.com","amazon.com","amazon.com.br","amazon.co.uk","amazon.de","amazon.fr","amazon.it","amazon.es","amazon.ca","amazon.com.au","amazon.co.jp","ebay.com","ebay.co.uk","ebay.de","walmart.com","target.com","bestbuy.com","costco.com","alibaba.com","shopify.com","etsy.com","aliexpress.com"];function g(e){return e.replace(/^www\./,"").toLowerCase()}function k(e){try{const o=new URL(e).hostname;return g(o)}catch{const n=e.replace(/^https?:\/\//,"").split("/")[0];return g(n)}}function V(e,o){const n=g(e);if(o.includes(n))return!0;for(const t of o){const s=g(t);if(n===s||n.endsWith("."+s)||s.endsWith("."+n))return!0}return!1}function I(e){let o=e.parentElement;for(;o&&o!==document.body;){if(o.hasAttribute("data-timecost-trigger")||o.hasAttribute("data-timecost-wrapper")||o.hasAttribute("data-timecost-element")||o.classList.contains("timecost-wrapper"))return!0;o=o.parentElement}return!1}function X(e,o){if(document.getElementById("timecost-google-font"))return;const n=document.createElement("link");n.rel="preconnect",n.href="https://fonts.googleapis.com",document.head.appendChild(n);const t=document.createElement("link");t.rel="preconnect",t.href="https://fonts.gstatic.com",t.crossOrigin="anonymous",document.head.appendChild(t);const s=document.createElement("link");s.id="timecost-google-font",s.rel="stylesheet",s.href=`https://fonts.googleapis.com/css2?family=${e.replace(/\s+/g,"+")}:wght@${o}&display=swap`,document.head.appendChild(s)}function Y(){if(document.getElementById("timecost-global-styles"))return;const e=document.createElement("style");e.id="timecost-global-styles",e.textContent=`
    [data-timecost-element] {
      font-family: 'Boldonse', sans-serif !important;
      font-weight: 700 !important;
    }
  `,document.head.appendChild(e)}function M(e,o){let n="USD";e.includes("R$")||e.includes("BRL")?n="BRL":(e.includes("€")||e.includes("EUR"))&&(n="EUR");let t=e.replace(/[^\d.,]/g,"").trim(),s=!1;const i=/,\d{3}\./,c=/\.\d{3},/;if(i.test(t))s=!0;else if(c.test(t))s=!1;else if(t.includes(".")&&t.includes(",")){const r=t.lastIndexOf("."),d=t.lastIndexOf(",");s=r>d}else if(t.includes(".")){const r=t.split("."),d=r[r.length-1];r.length===2&&d.length<=2?s=!0:r.length>2||d.length===3?s=!1:s=d.length<=2}else if(t.includes(",")){const r=t.split(",");s=r[r.length-1].length===3&&r.length>1}else s=n==="USD";if(s)t.includes(".")?t=t.replace(/,/g,""):t.includes(",")&&(t=t.replace(/,/g,""));else if(t.includes(","))t=t.replace(/\./g,"").replace(",",".");else if(t.includes(".")){const r=t.split("."),d=r[r.length-1];r.length>2?t=t.replace(/\./g,""):d.length===3?t=t.replace(/\./g,""):d.length<=2||(t=t.replace(/\./g,""))}const a=parseFloat(t);return{price:isNaN(a)||a===0?null:a,currency:n}}function _(e,o,n,t){const s=e/L[o],c=n/L[t]/22,r=s/c*8;return r<1?`${Math.round(r*60)}m`:`${Math.round(r*10)/10}h`}let y=null;function H(e){const o=e.currentTarget,n=o.getAttribute("data-timecost"),t=o.getAttribute("data-original-price");y&&y.remove();const s=document.createElement("div");s.className="timecost-hover-tooltip",s.setAttribute("data-timecost-tooltip","true"),s.innerHTML=`
    <div style="padding: 12px;">
      <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px; color: #000;">
        ${t}
      </div>
      <div style="font-size: 12px; color: #000; margin-bottom: 8px;">
        Time cost
      </div>
      <div style="
        display: inline-block;
        padding: 4px 8px;
        border-radius: 100px;
        background-color: #dafaa2;
        color: #000;
        font-size: 14px;
        font-family: 'Boldonse', sans-serif;
        font-weight: 700;
        line-height: 1.2;
      ">
        ${n}
      </div>
    </div>
  `,s.style.cssText=`
    position: absolute;
    z-index: 999999;
    width: 280px;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background-color: #dafaa2;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s ease-in-out;
  `,document.body.appendChild(s),y=s;const i=o.getBoundingClientRect(),c=s.getBoundingClientRect(),a=window.pageXOffset||document.documentElement.scrollLeft,r=window.pageYOffset||document.documentElement.scrollTop;let d=i.top+r-c.height-8,m=i.left+a+i.width/2-c.width/2;d<r&&(d=i.bottom+r+8),m<a?m=a+8:m+c.width>a+window.innerWidth&&(m=a+window.innerWidth-c.width-8),s.style.top=`${d}px`,s.style.left=`${m}px`,requestAnimationFrame(()=>{s.style.opacity="1"})}function W(e){y&&(y.style.opacity="0",setTimeout(()=>{y&&y.parentNode&&y.remove(),y=null},150))}const B=new WeakSet;function K(e){const o=e.querySelector(".a-offscreen");if(o){const n=o.textContent.trim();if(n&&/(R\$|€|\$)/.test(n)&&/\d/.test(n))return n}return null}function O(e,o,n,t){e.querySelectorAll(".a-price:not([data-timecost-processed])").forEach(i=>{if(B.has(i)||I(i))return;B.add(i),i.setAttribute("data-timecost-processed","true");const c=K(i);if(c)try{let r=new RegExp(R).exec(c),d=r?r[0]:c;const{price:m,currency:x}=M(d);if(!m||m===0)return;const u=_(m,x,o,n);if(t==="compact"){const l=document.createElement("span");l.textContent=u,l.style.cssText=`
          display: inline-flex;
          align-items: center;
          justify-content: center;
          vertical-align: middle;
          padding: 2px 6px;
          border-radius: 100px;
          background-color: #dafaa2;
          color: #000;
          font-size: 16px;
          font-family: 'Boldonse', sans-serif;
          font-weight: 700;
          line-height: 1.2;
        `,i.parentNode&&i.parentNode.replaceChild(l,i)}else if(t==="comfortable")i.style.cssText+="position: relative; display: inline-block; cursor: pointer;",i.setAttribute("data-timecost-trigger","true"),i.setAttribute("data-timecost",u),i.setAttribute("data-original-price",c),i.addEventListener("mouseenter",H),i.addEventListener("mouseleave",W);else{const l=document.createElement("span");l.style.cssText="display: inline-flex; align-items: center; vertical-align: middle;",l.setAttribute("data-timecost-wrapper","true");const p=i.parentNode;p?(p.insertBefore(l,i),l.appendChild(i)):i.appendChild(l);const f=document.createElement("span");f.textContent=` ${u}`,f.setAttribute("data-timecost-element","true"),f.style.cssText=`
          display: inline-flex;
          align-items: center;
          margin-left: 4px;
          padding: 2px 6px;
          border-radius: 100px;
          background-color: #dafaa2;
          color: #000;
          font-size: 16px;
          font-family: 'Boldonse', sans-serif;
          font-weight: 700;
          line-height: 1.2;
        `,l.appendChild(f)}}catch(a){console.error("TimeCost Error parsing Amazon price:",c,a)}})}function J(e,o,n,t,s){return O(e,o,n,t),!1}function Q(e){let o=e.parentElement;for(;o&&o!==document.body;){if(o.classList.contains("a-price")&&o.hasAttribute("data-timecost-processed"))return!0;o=o.parentElement}return!1}const h=Object.freeze(Object.defineProperty({__proto__:null,isInProcessedAmazonPrice:Q,processAmazonPrices:O,scanAndConvert:J},Symbol.toStringTag,{value:"Module"}));function Z(e,o,n,t){const s=e.nodeValue,i=[];let c;const a=new RegExp(R);for(;(c=a.exec(s))!==null;)i.push({match:c[0],index:c.index,length:c[0].length});if(i.length===0)return;const r=i.map(u=>{const l=u.match;try{const{price:p,currency:f}=M(l);if(!p||p===0)return null;const b=_(p,f,o,n);return{...u,timeCost:b}}catch(p){return console.error("TimeCost Error parsing:",l,p),null}}).filter(u=>u!==null);if(r.length===0)return;const d=document.createDocumentFragment();let m=0;r.forEach(u=>{if(u.index>m){const l=s.substring(m,u.index);d.appendChild(document.createTextNode(l))}if(t==="compact"){const l=document.createElement("span");l.textContent=u.timeCost,l.style.cssText=`
        display: inline-flex;
        align-items: center;
        justify-content: center;
        vertical-align: middle;
        padding: 2px 6px;
        border-radius: 100px;
        background-color: #dafaa2;
        color: #000;
        font-size: 16px;
        font-family: 'Boldonse', sans-serif;
        font-weight: 700;
        line-height: 1.2;
      `,d.appendChild(l)}else if(t==="comfortable"){const l=document.createElement("span");l.style.cssText="position: relative; display: inline-block;",l.setAttribute("data-timecost-trigger","true"),l.textContent=u.match,l.setAttribute("data-timecost",u.timeCost),l.setAttribute("data-original-price",u.match),l.addEventListener("mouseenter",H),l.addEventListener("mouseleave",W),d.appendChild(l)}else{const l=document.createElement("span");l.style.cssText="display: inline-flex; align-items: center; vertical-align: middle;";const p=document.createElement("span");p.textContent=u.match,l.appendChild(p);const f=document.createElement("span");f.textContent=` ${u.timeCost}`,f.style.cssText=`
        display: inline-flex;
        align-items: center;
        margin-left: 4px;
        padding: 2px 6px;
        border-radius: 100px;
        background-color: #dafaa2;
        color: #000;
        font-size: 16px;
        font-family: 'Boldonse', sans-serif;
        font-weight: 700;
        line-height: 1.2;
      `,l.appendChild(f),d.appendChild(l)}m=u.index+u.length}),m<s.length&&d.appendChild(document.createTextNode(s.substring(m))),e.parentNode.replaceChild(d,e)}function j(e,o,n,t,s,i=null){if(!s)return console.warn("TimeCost: processedTextNodesSet not provided to generic handler"),!0;const c=document.createTreeWalker(e,NodeFilter.SHOW_TEXT,null,!1);let a;for(;a=c.nextNode();){if(!a.parentElement||a.parentElement.tagName.match(/SCRIPT|STYLE|TEXTAREA|INPUT/)||s.has(a)||I(a)||i&&i(a))continue;const r=a.nodeValue;r&&r.trim()&&new RegExp(R).test(r)&&(s.add(a),Z(a,o,n,t))}return!0}const U=Object.freeze(Object.defineProperty({__proto__:null,scanAndConvert:j},Symbol.toStringTag,{value:"Module"})),E={"amazon.com":h,"amazon.co.uk":h,"amazon.de":h,"amazon.fr":h,"amazon.it":h,"amazon.es":h,"amazon.ca":h,"amazon.com.au":h,"amazon.co.jp":h};function N(e){const o=g(e),n=o.split("."),t=["co.uk","com.au","co.jp","com.br"];for(const s of t)if(o.endsWith("."+s)){const i=o.replace("."+s,"");return i.split(".").pop()||i}return n.length===2?n[0]:n.length>=3?n[n.length-2]:n[0]}function F(e){const o=k(e),n=g(o);if(E[n])return E[n];const t=N(n),s=Object.keys(E).find(i=>N(i)===t);return s?E[s]:U}function ee(e){const o=k(e),n=g(o),t=N(n);return F(e)!==U?t:"generic"}let z=$,S="USD",P=[],v="default",C=null;const D=new WeakSet;chrome.storage.local.get(["userSalary","userCurrency","whitelist","spacingMode"],e=>{if(e.userSalary&&e.userCurrency?(z=parseFloat(e.userSalary),S=e.userCurrency):(z=$,S="USD"),e.spacingMode&&["default","comfortable","compact"].includes(e.spacingMode)&&(v=e.spacingMode),e.whitelist&&Array.isArray(e.whitelist)&&e.whitelist.length>0){const n=e.whitelist.map(s=>g(s)),t=T.map(s=>g(s));P=[...new Set([...t,...n])],chrome.storage.local.set({whitelist:[...new Set([...T,...e.whitelist])]})}else P=T.map(n=>g(n)),chrome.storage.local.set({whitelist:T});const o=k(window.location.href);V(o,P)?te():console.log("TimeCost: Domain not whitelisted, skipping processing:",o)});function te(){X("Boldonse","700"),Y();const e=window.location.href;C=F(e);const o=ee(e);console.log(`TimeCost: Using handler for site: ${o}`),A(document.body);let n=null;const t=100;new MutationObserver(i=>{n&&clearTimeout(n);const c=[];i.forEach(a=>{a.addedNodes.forEach(r=>{r.nodeType===1&&r.tagName!=="SCRIPT"&&r.tagName!=="STYLE"&&(I(r)||c.push(r))})}),n=setTimeout(()=>{c.forEach(a=>{A(a)}),n=null},t)}).observe(document.body,{childList:!0,subtree:!0}),chrome.storage.onChanged.addListener((i,c)=>{c==="local"&&i.spacingMode&&(v=i.spacingMode.newValue||"default",requestAnimationFrame(()=>{const a=document.querySelectorAll("[data-timecost-trigger]"),r=document.querySelectorAll('span[style*="background-color: #dafaa2"]'),d=(x,u,l=50)=>{const p=Math.min(u+l,x.length);for(let f=u;f<p;f++){const b=x[f],w=b.parentNode;if(w)if(b.hasAttribute("data-timecost-trigger")){const q=b.getAttribute("data-original-price")||b.textContent,G=document.createTextNode(q);w.replaceChild(G,b),w.normalize()}else w.normalize()}p<x.length?setTimeout(()=>d(x,p,l),0):A(document.body)},m=Array.from(new Set([...a,...r]));m.length>0?d(m,0):A(document.body)}))})}function A(e){if(!C||!C.scanAndConvert){console.error("TimeCost: Site handler not available or missing scanAndConvert method");return}if(C.scanAndConvert(e,z,S,v,D)||C===U)return;const n=C.isInProcessedAmazonPrice?t=>C.isInProcessedAmazonPrice(t):null;j(e,z,S,v,D,n)}
