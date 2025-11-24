const L={USD:1,EUR:.92,BRL:5},k=/((R\$|€|\$)\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?|\d+))|(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?\s*(USD|EUR|BRL))/gi,B=1256.67,T=["google.com","amazon.com","amazon.com.br","amazon.co.uk","amazon.de","amazon.fr","amazon.it","amazon.es","amazon.ca","amazon.com.au","amazon.co.jp","ebay.com","ebay.co.uk","ebay.de","walmart.com","target.com","bestbuy.com","costco.com","alibaba.com","shopify.com","etsy.com","aliexpress.com"];function f(e){return e.replace(/^www\./,"").toLowerCase()}function R(e){try{const o=new URL(e).hostname;return f(o)}catch{const t=e.replace(/^https?:\/\//,"").split("/")[0];return f(t)}}function X(e,o){const t=f(e);if(o.includes(t))return!0;for(const n of o){const r=f(n);if(t===r||t.endsWith("."+r)||r.endsWith("."+t))return!0}return!1}function I(e){let o=e.parentElement;for(;o&&o!==document.body;){if(o.hasAttribute("data-timecost-trigger")||o.classList.contains("timecost-wrapper"))return!0;o=o.parentElement}return!1}function Y(e,o){if(document.getElementById("timecost-google-font"))return;const t=document.createElement("link");t.id="timecost-google-font",t.rel="stylesheet",t.href=`https://fonts.googleapis.com/css2?family=${e.replace(/\s+/g,"+")}:wght@${o}&display=swap`,document.head.appendChild(t)}function M(e,o){let t="USD";e.includes("R$")||e.includes("BRL")?t="BRL":(e.includes("€")||e.includes("EUR"))&&(t="EUR");let n=e.replace(/[^\d.,]/g,"").trim(),r=!1;const s=/,\d{3}\./,c=/\.\d{3},/;if(s.test(n))r=!0;else if(c.test(n))r=!1;else if(n.includes(".")&&n.includes(",")){const i=n.lastIndexOf("."),d=n.lastIndexOf(",");r=i>d}else if(n.includes(".")){const i=n.split("."),d=i[i.length-1];i.length===2&&d.length<=2?r=!0:i.length>2||d.length===3?r=!1:r=d.length<=2}else if(n.includes(",")){const i=n.split(",");r=i[i.length-1].length===3&&i.length>1}else r=t==="USD";if(r)n.includes(".")?n=n.replace(/,/g,""):n.includes(",")&&(n=n.replace(/,/g,""));else if(n.includes(","))n=n.replace(/\./g,"").replace(",",".");else if(n.includes(".")){const i=n.split("."),d=i[i.length-1];i.length>2?n=n.replace(/\./g,""):d.length===3?n=n.replace(/\./g,""):d.length<=2||(n=n.replace(/\./g,""))}const a=parseFloat(n);return{price:isNaN(a)||a===0?null:a,currency:t}}function _(e,o,t,n){const r=e/L[o],c=t/L[n]/22,i=r/c*8;return i<1?`${Math.round(i*60)}m`:`${Math.round(i*10)/10}h`}let y=null;function H(e){const o=e.currentTarget,t=o.getAttribute("data-timecost"),n=o.getAttribute("data-original-price");y&&y.remove();const r=document.createElement("div");r.className="timecost-hover-tooltip",r.setAttribute("data-timecost-tooltip","true"),r.innerHTML=`
    <div style="padding: 12px;">
      <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px; color: #000;">
        ${n}
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
        ${t}
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
  `,document.body.appendChild(r),y=r;const s=o.getBoundingClientRect(),c=r.getBoundingClientRect(),a=window.pageXOffset||document.documentElement.scrollLeft,i=window.pageYOffset||document.documentElement.scrollTop;let d=s.top+i-c.height-8,m=s.left+a+s.width/2-c.width/2;d<i&&(d=s.bottom+i+8),m<a?m=a+8:m+c.width>a+window.innerWidth&&(m=a+window.innerWidth-c.width-8),r.style.top=`${d}px`,r.style.left=`${m}px`,requestAnimationFrame(()=>{r.style.opacity="1"})}function W(e){y&&(y.style.opacity="0",setTimeout(()=>{y&&y.parentNode&&y.remove(),y=null},150))}const D=new WeakSet;function G(e){const o=e.querySelector(".a-offscreen");if(o){const t=o.textContent.trim();if(t&&/(R\$|€|\$)/.test(t)&&/\d/.test(t))return t}return null}function O(e,o,t,n){e.querySelectorAll(".a-price:not([data-timecost-processed])").forEach(s=>{if(D.has(s)||I(s))return;D.add(s),s.setAttribute("data-timecost-processed","true");const c=G(s);if(c)try{let i=new RegExp(k).exec(c),d=i?i[0]:c;const{price:m,currency:x}=M(d);if(!m||m===0)return;const u=_(m,x,o,t);if(n==="compact"){const l=document.createElement("span");l.textContent=u,l.style.cssText=`
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
        `,s.parentNode&&s.parentNode.replaceChild(l,s)}else if(n==="comfortable")s.style.cssText+="position: relative; display: inline-block; cursor: pointer;",s.setAttribute("data-timecost-trigger","true"),s.setAttribute("data-timecost",u),s.setAttribute("data-original-price",c),s.addEventListener("mouseenter",H),s.addEventListener("mouseleave",W);else{const l=document.createElement("span");l.textContent=` ${u}`,l.setAttribute("data-timecost-element","true"),l.style.cssText=`
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
        `;try{s.parentNode?s.insertAdjacentElement("afterend",l):s.appendChild(l)}catch(p){console.error("TimeCost: Error inserting time cost element:",p),s.parentNode&&s.parentNode.appendChild(l)}}}catch(a){console.error("TimeCost Error parsing Amazon price:",c,a)}})}function K(e,o,t,n,r){return O(e,o,t,n),!1}function J(e){let o=e.parentElement;for(;o&&o!==document.body;){if(o.classList.contains("a-price")&&o.hasAttribute("data-timecost-processed"))return!0;o=o.parentElement}return!1}const h=Object.freeze(Object.defineProperty({__proto__:null,isInProcessedAmazonPrice:J,processAmazonPrices:O,scanAndConvert:K},Symbol.toStringTag,{value:"Module"}));function Q(e,o,t,n){const r=e.nodeValue,s=[];let c;const a=new RegExp(k);for(;(c=a.exec(r))!==null;)s.push({match:c[0],index:c.index,length:c[0].length});if(s.length===0)return;const i=s.map(u=>{const l=u.match;try{const{price:p,currency:g}=M(l);if(!p||p===0)return null;const b=_(p,g,o,t);return{...u,timeCost:b}}catch(p){return console.error("TimeCost Error parsing:",l,p),null}}).filter(u=>u!==null);if(i.length===0)return;const d=document.createDocumentFragment();let m=0;i.forEach(u=>{if(u.index>m){const l=r.substring(m,u.index);d.appendChild(document.createTextNode(l))}if(n==="compact"){const l=document.createElement("span");l.textContent=u.timeCost,l.style.cssText=`
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
      `,d.appendChild(l)}else if(n==="comfortable"){const l=document.createElement("span");l.style.cssText="position: relative; display: inline-block;",l.setAttribute("data-timecost-trigger","true"),l.textContent=u.match,l.setAttribute("data-timecost",u.timeCost),l.setAttribute("data-original-price",u.match),l.addEventListener("mouseenter",H),l.addEventListener("mouseleave",W),d.appendChild(l)}else{const l=document.createElement("span");l.style.cssText="display: inline-flex; align-items: center; vertical-align: middle;";const p=document.createElement("span");p.textContent=u.match,l.appendChild(p);const g=document.createElement("span");g.textContent=` ${u.timeCost}`,g.style.cssText=`
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
      `,l.appendChild(g),d.appendChild(l)}m=u.index+u.length}),m<r.length&&d.appendChild(document.createTextNode(r.substring(m))),e.parentNode.replaceChild(d,e)}function F(e,o,t,n,r,s=null){if(!r)return console.warn("TimeCost: processedTextNodesSet not provided to generic handler"),!0;const c=document.createTreeWalker(e,NodeFilter.SHOW_TEXT,null,!1);let a;for(;a=c.nextNode();){if(!a.parentElement||a.parentElement.tagName.match(/SCRIPT|STYLE|TEXTAREA|INPUT/)||r.has(a)||I(a)||s&&s(a))continue;const i=a.nodeValue;i&&i.trim()&&new RegExp(k).test(i)&&(r.add(a),Q(a,o,t,n))}return!0}const U=Object.freeze(Object.defineProperty({__proto__:null,scanAndConvert:F},Symbol.toStringTag,{value:"Module"})),E={"amazon.com":h,"amazon.co.uk":h,"amazon.de":h,"amazon.fr":h,"amazon.it":h,"amazon.es":h,"amazon.ca":h,"amazon.com.au":h,"amazon.co.jp":h};function P(e){const o=f(e),t=o.split("."),n=["co.uk","com.au","co.jp","com.br"];for(const r of n)if(o.endsWith("."+r)){const s=o.replace("."+r,"");return s.split(".").pop()||s}return t.length===2?t[0]:t.length>=3?t[t.length-2]:t[0]}function j(e){const o=R(e),t=f(o);if(E[t])return E[t];const n=P(t),r=Object.keys(E).find(s=>P(s)===n);return r?E[r]:U}function Z(e){const o=R(e),t=f(o),n=P(t);return j(e)!==U?n:"generic"}let z=B,v="USD",N=[],S="default",C=null;const $=new WeakSet;chrome.storage.local.get(["userSalary","userCurrency","whitelist","spacingMode"],e=>{if(e.userSalary&&e.userCurrency?(z=parseFloat(e.userSalary),v=e.userCurrency):(z=B,v="USD"),e.spacingMode&&["default","comfortable","compact"].includes(e.spacingMode)&&(S=e.spacingMode),e.whitelist&&Array.isArray(e.whitelist)&&e.whitelist.length>0){const t=e.whitelist.map(r=>f(r)),n=T.map(r=>f(r));N=[...new Set([...n,...t])],chrome.storage.local.set({whitelist:[...new Set([...T,...e.whitelist])]})}else N=T.map(t=>f(t)),chrome.storage.local.set({whitelist:T});const o=R(window.location.href);X(o,N)?ee():console.log("TimeCost: Domain not whitelisted, skipping processing:",o)});function ee(){Y("Boldonse","700");const e=window.location.href;C=j(e);const o=Z(e);console.log(`TimeCost: Using handler for site: ${o}`),A(document.body);let t=null;const n=100;new MutationObserver(s=>{t&&clearTimeout(t);const c=[];s.forEach(a=>{a.addedNodes.forEach(i=>{i.nodeType===1&&i.tagName!=="SCRIPT"&&i.tagName!=="STYLE"&&(I(i)||c.push(i))})}),t=setTimeout(()=>{c.forEach(a=>{A(a)}),t=null},n)}).observe(document.body,{childList:!0,subtree:!0}),chrome.storage.onChanged.addListener((s,c)=>{c==="local"&&s.spacingMode&&(S=s.spacingMode.newValue||"default",requestAnimationFrame(()=>{const a=document.querySelectorAll("[data-timecost-trigger]"),i=document.querySelectorAll('span[style*="background-color: #dafaa2"]'),d=(x,u,l=50)=>{const p=Math.min(u+l,x.length);for(let g=u;g<p;g++){const b=x[g],w=b.parentNode;if(w)if(b.hasAttribute("data-timecost-trigger")){const q=b.getAttribute("data-original-price")||b.textContent,V=document.createTextNode(q);w.replaceChild(V,b),w.normalize()}else w.normalize()}p<x.length?setTimeout(()=>d(x,p,l),0):A(document.body)},m=Array.from(new Set([...a,...i]));m.length>0?d(m,0):A(document.body)}))})}function A(e){if(!C||!C.scanAndConvert){console.error("TimeCost: Site handler not available or missing scanAndConvert method");return}if(C.scanAndConvert(e,z,v,S,$)||C===U)return;const t=C.isInProcessedAmazonPrice?n=>C.isInProcessedAmazonPrice(n):null;F(e,z,v,S,$,t)}
