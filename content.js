const U={USD:1,EUR:.92,BRL:5},P=/((R\$|€|\$)\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?|\d+))|(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?\s*(USD|EUR|BRL))/gi,B=1256.67,L=["google.com","amazon.com","amazon.co.uk","amazon.de","amazon.fr","amazon.it","amazon.es","amazon.ca","amazon.com.au","amazon.co.jp","ebay.com","ebay.co.uk","ebay.de","walmart.com","target.com","bestbuy.com","costco.com","alibaba.com","shopify.com","etsy.com","aliexpress.com"];function y(e){return e.replace(/^www\./,"").toLowerCase()}function k(e){try{const o=new URL(e).hostname;return y(o)}catch{const n=e.replace(/^https?:\/\//,"").split("/")[0];return y(n)}}function X(e,o){const n=y(e);if(o.includes(n))return!0;for(const t of o){const r=y(t);if(n===r||n.endsWith("."+r)||r.endsWith("."+n))return!0}return!1}function R(e){let o=e.parentElement;for(;o&&o!==document.body;){if(o.hasAttribute("data-timecost-trigger")||o.classList.contains("timecost-wrapper"))return!0;o=o.parentElement}return!1}function Y(e,o){if(document.getElementById("timecost-google-font"))return;const n=document.createElement("link");n.id="timecost-google-font",n.rel="stylesheet",n.href=`https://fonts.googleapis.com/css2?family=${e.replace(/\s+/g,"+")}:wght@${o}&display=swap`,document.head.appendChild(n)}function M(e,o){let n="USD";e.includes("R$")||e.includes("BRL")?n="BRL":(e.includes("€")||e.includes("EUR"))&&(n="EUR");let t=e.replace(/[^\d.,]/g,"").trim(),r=!1;const s=/,\d{3}\./,i=/\.\d{3},/;if(s.test(t))r=!0;else if(i.test(t))r=!1;else if(t.includes(".")&&t.includes(",")){const l=t.lastIndexOf("."),d=t.lastIndexOf(",");r=l>d}else if(t.includes(".")){const l=t.split("."),d=l[l.length-1];l.length===2&&d.length<=2?r=!0:l.length>2||d.length===3?r=!1:r=d.length<=2}else if(t.includes(",")){const l=t.split(",");r=l[l.length-1].length===3&&l.length>1}else r=n==="USD";if(r)t.includes(".")?t=t.replace(/,/g,""):t.includes(",")&&(t=t.replace(/,/g,""));else if(t.includes(","))t=t.replace(/\./g,"").replace(",",".");else if(t.includes(".")){const l=t.split("."),d=l[l.length-1];l.length>2?t=t.replace(/\./g,""):d.length===3?t=t.replace(/\./g,""):d.length<=2||(t=t.replace(/\./g,""))}const c=parseFloat(t);return{price:isNaN(c)||c===0?null:c,currency:n}}function _(e,o,n,t){const r=e/U[o],i=n/U[t]/22,l=r/i*8;return l<1?`${Math.round(l*60)}m`:`${Math.round(l*10)/10}h`}let h=null;function H(e){const o=e.currentTarget,n=o.getAttribute("data-timecost"),t=o.getAttribute("data-original-price");h&&h.remove();const r=document.createElement("div");r.className="timecost-hover-tooltip",r.setAttribute("data-timecost-tooltip","true"),r.innerHTML=`
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
  `,r.style.cssText=`
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
  `,document.body.appendChild(r),h=r;const s=o.getBoundingClientRect(),i=r.getBoundingClientRect(),c=window.pageXOffset||document.documentElement.scrollLeft,l=window.pageYOffset||document.documentElement.scrollTop;let d=s.top+l-i.height-8,m=s.left+c+s.width/2-i.width/2;d<l&&(d=s.bottom+l+8),m<c?m=c+8:m+i.width>c+window.innerWidth&&(m=c+window.innerWidth-i.width-8),r.style.top=`${d}px`,r.style.left=`${m}px`,requestAnimationFrame(()=>{r.style.opacity="1"})}function W(e){h&&(h.style.opacity="0",setTimeout(()=>{h&&h.parentNode&&h.remove(),h=null},150))}const $=new WeakSet;function G(e){const o=e.querySelector(".a-offscreen");if(o){const i=o.textContent.trim();if(i&&/(R\$|€|\$)/.test(i)&&/\d/.test(i))return i}const n=e.querySelector(".a-price-symbol"),t=e.querySelector(".a-price-whole"),r=e.querySelector(".a-price-decimal"),s=e.querySelector(".a-price-fraction");if(n&&t){let i=n.textContent.trim();if(i+=t.textContent.trim(),r&&(i+=r.textContent.trim()),s&&(i+=s.textContent.trim()),i&&/(R\$|€|\$)/.test(i)&&/\d/.test(i))return i}return null}function O(e,o,n,t){e.querySelectorAll(".a-price:not([data-timecost-processed])").forEach(s=>{if($.has(s)||R(s))return;$.add(s),s.setAttribute("data-timecost-processed","true");const i=G(s);if(i)try{let l=new RegExp(P).exec(i),d=l?l[0]:i;const{price:m,currency:x}=M(d);if(!m||m===0)return;const u=_(m,x,o,n);if(t==="compact"){const a=document.createElement("span");a.textContent=u,a.style.cssText=`
          display: inline-block;
          vertical-align: middle;
          padding: 2px 6px;
          border-radius: 100px;
          background-color: #dafaa2;
          color: #000;
          font-size: 16px;
          font-family: 'Boldonse', sans-serif;
          font-weight: 700;
          line-height: 1.2;
        `,s.parentNode&&s.parentNode.replaceChild(a,s)}else if(t==="comfortable")s.style.cssText+="position: relative; display: inline-block; cursor: pointer;",s.setAttribute("data-timecost-trigger","true"),s.setAttribute("data-timecost",u),s.setAttribute("data-original-price",i),s.addEventListener("mouseenter",H),s.addEventListener("mouseleave",W);else{const a=document.createElement("span");a.textContent=` ${u}`,a.setAttribute("data-timecost-element","true"),a.style.cssText=`
          display: inline-block;
          margin-left: 4px;
          padding: 2px 6px;
          border-radius: 100px;
          background-color: #dafaa2;
          color: #000;
          font-size: 16px;
          font-family: 'Boldonse', sans-serif;
          font-weight: 700;
          line-height: 1.2;
          vertical-align: middle;
        `;try{s.parentNode?s.insertAdjacentElement("afterend",a):s.appendChild(a)}catch(p){console.error("TimeCost: Error inserting time cost element:",p),s.parentNode&&s.parentNode.appendChild(a)}}}catch(c){console.error("TimeCost Error parsing Amazon price:",i,c)}})}function K(e,o,n,t,r){return O(e,o,n,t),!1}function J(e){let o=e.parentElement;for(;o&&o!==document.body;){if(o.classList.contains("a-price")&&o.hasAttribute("data-timecost-processed"))return!0;o=o.parentElement}return!1}const g=Object.freeze(Object.defineProperty({__proto__:null,isInProcessedAmazonPrice:J,processAmazonPrices:O,scanAndConvert:K},Symbol.toStringTag,{value:"Module"}));function Q(e,o,n,t){const r=e.nodeValue,s=[];let i;const c=new RegExp(P);for(;(i=c.exec(r))!==null;)s.push({match:i[0],index:i.index,length:i[0].length});if(s.length===0)return;const l=s.map(u=>{const a=u.match;try{const{price:p,currency:f}=M(a);if(!p||p===0)return null;const b=_(p,f,o,n);return{...u,timeCost:b}}catch(p){return console.error("TimeCost Error parsing:",a,p),null}}).filter(u=>u!==null);if(l.length===0)return;const d=document.createDocumentFragment();let m=0;l.forEach(u=>{if(u.index>m){const a=r.substring(m,u.index);d.appendChild(document.createTextNode(a))}if(t==="compact"){const a=document.createElement("span");a.textContent=u.timeCost,a.style.cssText=`
        display: inline-block;
        vertical-align: middle;
        padding: 2px 6px;
        border-radius: 100px;
        background-color: #dafaa2;
        color: #000;
        font-size: 16px;
        font-family: 'Boldonse', sans-serif;
        font-weight: 700;
        line-height: 1.2;
      `,d.appendChild(a)}else if(t==="comfortable"){const a=document.createElement("span");a.style.cssText="position: relative; display: inline-block;",a.setAttribute("data-timecost-trigger","true"),a.textContent=u.match,a.setAttribute("data-timecost",u.timeCost),a.setAttribute("data-original-price",u.match),a.addEventListener("mouseenter",H),a.addEventListener("mouseleave",W),d.appendChild(a)}else{const a=document.createElement("span");a.style.cssText="display: inline-flex; align-items: center; vertical-align: middle;";const p=document.createElement("span");p.textContent=u.match,a.appendChild(p);const f=document.createElement("span");f.textContent=` ${u.timeCost}`,f.style.cssText=`
        display: inline-block;
        margin-left: 4px;
        padding: 2px 6px;
        border-radius: 100px;
        background-color: #dafaa2;
        color: #000;
        font-size: 16px;
        font-family: 'Boldonse', sans-serif;
        font-weight: 700;
        line-height: 1.2;
      `,a.appendChild(f),d.appendChild(a)}m=u.index+u.length}),m<r.length&&d.appendChild(document.createTextNode(r.substring(m))),e.parentNode.replaceChild(d,e)}function q(e,o,n,t,r,s=null){if(!r)return console.warn("TimeCost: processedTextNodesSet not provided to generic handler"),!0;const i=document.createTreeWalker(e,NodeFilter.SHOW_TEXT,null,!1);let c;for(;c=i.nextNode();){if(!c.parentElement||c.parentElement.tagName.match(/SCRIPT|STYLE|TEXTAREA|INPUT/)||r.has(c)||R(c)||s&&s(c))continue;const l=c.nodeValue;l&&l.trim()&&new RegExp(P).test(l)&&(r.add(c),Q(c,o,n,t))}return!0}const I=Object.freeze(Object.defineProperty({__proto__:null,scanAndConvert:q},Symbol.toStringTag,{value:"Module"})),w={"amazon.com":g,"amazon.co.uk":g,"amazon.de":g,"amazon.fr":g,"amazon.it":g,"amazon.es":g,"amazon.ca":g,"amazon.com.au":g,"amazon.co.jp":g};function N(e){const o=y(e),n=o.split("."),t=["co.uk","com.au","co.jp","com.br"];for(const r of t)if(o.endsWith("."+r)){const s=o.replace("."+r,"");return s.split(".").pop()||s}return n.length===2?n[0]:n.length>=3?n[n.length-2]:n[0]}function F(e){const o=k(e),n=y(o);if(w[n])return w[n];const t=N(n),r=Object.keys(w).find(s=>N(s)===t);return r?w[r]:I}function Z(e){const o=k(e),n=y(o),t=N(n);return F(e)!==I?t:"generic"}let S=B,A="USD",z=[],v="default",C=null;const D=new WeakSet;chrome.storage.local.get(["userSalary","userCurrency","whitelist","spacingMode"],e=>{e.userSalary&&e.userCurrency?(S=parseFloat(e.userSalary),A=e.userCurrency):(S=B,A="USD"),e.spacingMode&&["default","comfortable","compact"].includes(e.spacingMode)&&(v=e.spacingMode),e.whitelist&&Array.isArray(e.whitelist)&&e.whitelist.length>0?z=e.whitelist.map(n=>y(n)):(z=L.map(n=>y(n)),chrome.storage.local.set({whitelist:L}));const o=k(window.location.href);X(o,z)?ee():console.log("TimeCost: Domain not whitelisted, skipping processing:",o)});function ee(){Y("Boldonse","700");const e=window.location.href;C=F(e);const o=Z(e);console.log(`TimeCost: Using handler for site: ${o}`),E(document.body);let n=null;const t=100;new MutationObserver(s=>{n&&clearTimeout(n);const i=[];s.forEach(c=>{c.addedNodes.forEach(l=>{l.nodeType===1&&l.tagName!=="SCRIPT"&&l.tagName!=="STYLE"&&(R(l)||i.push(l))})}),n=setTimeout(()=>{i.forEach(c=>{E(c)}),n=null},t)}).observe(document.body,{childList:!0,subtree:!0}),chrome.storage.onChanged.addListener((s,i)=>{i==="local"&&s.spacingMode&&(v=s.spacingMode.newValue||"default",requestAnimationFrame(()=>{const c=document.querySelectorAll("[data-timecost-trigger]"),l=document.querySelectorAll('span[style*="background-color: #dafaa2"]'),d=(x,u,a=50)=>{const p=Math.min(u+a,x.length);for(let f=u;f<p;f++){const b=x[f],T=b.parentNode;if(T)if(b.hasAttribute("data-timecost-trigger")){const j=b.getAttribute("data-original-price")||b.textContent,V=document.createTextNode(j);T.replaceChild(V,b),T.normalize()}else T.normalize()}p<x.length?setTimeout(()=>d(x,p,a),0):E(document.body)},m=Array.from(new Set([...c,...l]));m.length>0?d(m,0):E(document.body)}))})}function E(e){if(!C||!C.scanAndConvert){console.error("TimeCost: Site handler not available or missing scanAndConvert method");return}if(C.scanAndConvert(e,S,A,v,D)||C===I)return;const n=C.isInProcessedAmazonPrice?t=>C.isInProcessedAmazonPrice(t):null;q(e,S,A,v,D,n)}
