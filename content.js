const U={USD:1,EUR:.92,BRL:5},P=/((R\$|€|\$)\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?|\d+))|(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?\s*(USD|EUR|BRL))/gi,M=1256.67,T=["google.com","amazon.com","amazon.com.br","amazon.co.uk","amazon.de","amazon.fr","amazon.it","amazon.es","amazon.ca","amazon.com.au","amazon.co.jp","ebay.com","ebay.co.uk","ebay.de","walmart.com","target.com","bestbuy.com","costco.com","alibaba.com","shopify.com","etsy.com","aliexpress.com"];function g(t){return t.replace(/^www\./,"").toLowerCase()}function $(t){try{const e=new URL(t).hostname;return g(e)}catch{const o=t.replace(/^https?:\/\//,"").split("/")[0];return g(o)}}function Y(t,e){const o=g(t);if(e.includes(o))return!0;for(const n of e){const r=g(n);if(o===r||o.endsWith("."+r)||r.endsWith("."+o))return!0}return!1}function D(t){let e=t.parentElement;for(;e&&e!==document.body;){if(e.hasAttribute("data-timecost-trigger")||e.hasAttribute("data-timecost-wrapper")||e.hasAttribute("data-timecost-element")||e.classList.contains("timecost-wrapper"))return!0;e=e.parentElement}return!1}function L(t){let e=t.nodeType===Node.TEXT_NODE?t.parentElement:t;if(!e)return!1;for(;e&&e!==document.body;){const o=e.tagName?.toLowerCase();if(o==="s"||o==="strike"||o==="del")return!0;const n=window.getComputedStyle(e),r=n.textDecoration||n.textDecorationLine;if(r&&r.includes("line-through")||e.style.textDecoration&&e.style.textDecoration.includes("line-through")||e.style.textDecorationLine&&e.style.textDecorationLine.includes("line-through"))return!0;e=e.parentElement}return!1}function G(t,e){if(document.getElementById("timecost-google-font"))return;const o=`https://fonts.googleapis.com/css2?family=${t.replace(/\s+/g,"+")}:wght@${e}&display=swap`;fetch(o).then(n=>n.text()).then(n=>{const r=n.match(/url\(([^)]+\.woff2[^)]*)\)/);if(r){const s=r[1].replace(/['"]/g,""),a=document.createElement("style");if(a.id="timecost-google-font",a.textContent=`
          @font-face {
            font-family: '${t}';
            font-style: normal;
            font-weight: ${e};
            font-display: swap;
            src: url('${s}') format('woff2');
          }
          [data-timecost-element] {
            font-family: '${t}', sans-serif !important;
            font-weight: ${e} !important;
          }
        `,document.head.appendChild(a),document.fonts){const c=`${e} 1em "${t}"`;document.fonts.ready.then(()=>{document.fonts.check(c)&&console.log("TimeCost: Boldonse font loaded successfully")})}}else{console.warn("TimeCost: Could not parse font CSS, using link tag fallback");const s=document.createElement("link");s.id="timecost-google-font-link",s.rel="stylesheet",s.href=o,document.head.appendChild(s);const a=document.createElement("style");a.id="timecost-google-font",a.textContent=`
          [data-timecost-element] {
            font-family: '${t}', sans-serif !important;
            font-weight: ${e} !important;
          }
        `,document.head.appendChild(a)}}).catch(n=>{console.error("TimeCost: Failed to fetch font CSS:",n);const r=document.createElement("link");r.id="timecost-google-font-link",r.rel="stylesheet",r.href=o,document.head.appendChild(r);const s=document.createElement("style");s.id="timecost-google-font",s.textContent=`
        [data-timecost-element] {
          font-family: '${t}', sans-serif !important;
          font-weight: ${e} !important;
        }
      `,document.head.appendChild(s)})}function _(t,e){let o="USD";t.includes("R$")||t.includes("BRL")?o="BRL":(t.includes("€")||t.includes("EUR"))&&(o="EUR");let n=t.replace(/[^\d.,]/g,"").trim(),r=!1;const s=/,\d{3}\./,a=/\.\d{3},/;if(s.test(n))r=!0;else if(a.test(n))r=!1;else if(n.includes(".")&&n.includes(",")){const i=n.lastIndexOf("."),d=n.lastIndexOf(",");r=i>d}else if(n.includes(".")){const i=n.split("."),d=i[i.length-1];i.length===2&&d.length<=2?r=!0:i.length>2||d.length===3?r=!1:r=d.length<=2}else if(n.includes(",")){const i=n.split(",");r=i[i.length-1].length===3&&i.length>1}else r=o==="USD";if(r)n.includes(".")?n=n.replace(/,/g,""):n.includes(",")&&(n=n.replace(/,/g,""));else if(n.includes(","))n=n.replace(/\./g,"").replace(",",".");else if(n.includes(".")){const i=n.split("."),d=i[i.length-1];i.length>2?n=n.replace(/\./g,""):d.length===3?n=n.replace(/\./g,""):d.length<=2||(n=n.replace(/\./g,""))}const c=parseFloat(n);return{price:isNaN(c)||c===0?null:c,currency:o}}function H(t,e,o,n){const r=t/U[e],a=o/U[n]/22,i=r/a*8;return i<1?`${Math.round(i*60)}m`:`${Math.round(i*10)/10}h`}let y=null;function O(t){const e=t.currentTarget,o=e.getAttribute("data-timecost"),n=e.getAttribute("data-original-price");y&&y.remove();const r=document.createElement("div");r.className="timecost-hover-tooltip",r.setAttribute("data-timecost-tooltip","true"),r.innerHTML=`
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
        ${o}
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
  `,document.body.appendChild(r),y=r;const s=e.getBoundingClientRect(),a=r.getBoundingClientRect(),c=window.pageXOffset||document.documentElement.scrollLeft,i=window.pageYOffset||document.documentElement.scrollTop;let d=s.top+i-a.height-8,m=s.left+c+s.width/2-a.width/2;d<i&&(d=s.bottom+i+8),m<c?m=c+8:m+a.width>c+window.innerWidth&&(m=c+window.innerWidth-a.width-8),r.style.top=`${d}px`,r.style.left=`${m}px`,requestAnimationFrame(()=>{r.style.opacity="1"})}function j(t){y&&(y.style.opacity="0",setTimeout(()=>{y&&y.parentNode&&y.remove(),y=null},150))}const I=new WeakSet;function K(t){const e=t.querySelector(".a-offscreen");if(e){const o=e.textContent.trim();if(o&&/(R\$|€|\$)/.test(o)&&/\d/.test(o))return o}return null}function J(t){let e=t;for(;e&&e!==document.body;){if(e.hasAttribute&&e.hasAttribute("data-a-strike")&&e.getAttribute("data-a-strike")==="true")return!0;e=e.parentElement}return!1}function W(t,e,o,n){t.querySelectorAll(".a-price:not([data-timecost-processed])").forEach(s=>{if(I.has(s)||D(s)||J(s)||L(s))return;I.add(s),s.setAttribute("data-timecost-processed","true");const a=K(s);if(a)try{let i=new RegExp(P).exec(a),d=i?i[0]:a;const{price:m,currency:x}=_(d);if(!m||m===0)return;const u=H(m,x,e,o);if(n==="compact"){const l=document.createElement("span");l.textContent=u,l.style.cssText=`
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
        `,s.parentNode&&s.parentNode.replaceChild(l,s)}else if(n==="comfortable")s.style.cssText+="position: relative; display: inline-block; cursor: pointer;",s.setAttribute("data-timecost-trigger","true"),s.setAttribute("data-timecost",u),s.setAttribute("data-original-price",a),s.addEventListener("mouseenter",O),s.addEventListener("mouseleave",j);else{const l=document.createElement("span");l.style.cssText="display: inline-flex; align-items: center; vertical-align: middle;",l.setAttribute("data-timecost-wrapper","true");const p=s.parentNode;p?(p.insertBefore(l,s),l.appendChild(s)):s.appendChild(l);const f=document.createElement("span");f.textContent=` ${u}`,f.setAttribute("data-timecost-element","true"),f.style.cssText=`
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
        `,l.appendChild(f)}}catch(c){console.error("TimeCost Error parsing Amazon price:",a,c)}})}function Q(t,e,o,n,r){return W(t,e,o,n),!1}function Z(t){let e=t.parentElement;for(;e&&e!==document.body;){if(e.classList.contains("a-price")&&e.hasAttribute("data-timecost-processed"))return!0;e=e.parentElement}return!1}const h=Object.freeze(Object.defineProperty({__proto__:null,isInProcessedAmazonPrice:Z,processAmazonPrices:W,scanAndConvert:Q},Symbol.toStringTag,{value:"Module"}));function ee(t,e,o,n){const r=t.nodeValue,s=[];let a;const c=new RegExp(P);for(;(a=c.exec(r))!==null;)s.push({match:a[0],index:a.index,length:a[0].length});if(s.length===0)return;const i=s.map(u=>{const l=u.match;try{const{price:p,currency:f}=_(l);if(!p||p===0)return null;const b=H(p,f,e,o);return{...u,timeCost:b}}catch(p){return console.error("TimeCost Error parsing:",l,p),null}}).filter(u=>u!==null);if(i.length===0||L(t))return;const d=document.createDocumentFragment();let m=0;i.forEach(u=>{if(u.index>m){const l=r.substring(m,u.index);d.appendChild(document.createTextNode(l))}if(n==="compact"){const l=document.createElement("span");l.textContent=u.timeCost,l.style.cssText=`
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
      `,d.appendChild(l)}else if(n==="comfortable"){const l=document.createElement("span");l.style.cssText="position: relative; display: inline-block;",l.setAttribute("data-timecost-trigger","true"),l.textContent=u.match,l.setAttribute("data-timecost",u.timeCost),l.setAttribute("data-original-price",u.match),l.addEventListener("mouseenter",O),l.addEventListener("mouseleave",j),d.appendChild(l)}else{const l=document.createElement("span");l.style.cssText="display: inline-flex; align-items: center; vertical-align: middle;";const p=document.createElement("span");p.textContent=u.match,l.appendChild(p);const f=document.createElement("span");f.textContent=` ${u.timeCost}`,f.style.cssText=`
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
      `,l.appendChild(f),d.appendChild(l)}m=u.index+u.length}),m<r.length&&d.appendChild(document.createTextNode(r.substring(m))),t.parentNode.replaceChild(d,t)}function F(t,e,o,n,r,s=null){if(!r)return console.warn("TimeCost: processedTextNodesSet not provided to generic handler"),!0;const a=document.createTreeWalker(t,NodeFilter.SHOW_TEXT,null,!1);let c;for(;c=a.nextNode();){if(!c.parentElement||c.parentElement.tagName.match(/SCRIPT|STYLE|TEXTAREA|INPUT/)||r.has(c)||D(c)||L(c)||s&&s(c))continue;const i=c.nodeValue;i&&i.trim()&&new RegExp(P).test(i)&&(r.add(c),ee(c,e,o,n))}return!0}const R=Object.freeze(Object.defineProperty({__proto__:null,scanAndConvert:F},Symbol.toStringTag,{value:"Module"})),E={"amazon.com":h,"amazon.co.uk":h,"amazon.de":h,"amazon.fr":h,"amazon.it":h,"amazon.es":h,"amazon.ca":h,"amazon.com.au":h,"amazon.co.jp":h};function N(t){const e=g(t),o=e.split("."),n=["co.uk","com.au","co.jp","com.br"];for(const r of n)if(e.endsWith("."+r)){const s=e.replace("."+r,"");return s.split(".").pop()||s}return o.length===2?o[0]:o.length>=3?o[o.length-2]:o[0]}function X(t){const e=$(t),o=g(e);if(E[o])return E[o];const n=N(o),r=Object.keys(E).find(s=>N(s)===n);return r?E[r]:R}function te(t){const e=$(t),o=g(e),n=N(o);return X(t)!==R?n:"generic"}let S=M,z="USD",k=[],v="default",C=null;const B=new WeakSet;chrome.storage.local.get(["userSalary","userCurrency","whitelist","spacingMode"],t=>{if(t.userSalary&&t.userCurrency?(S=parseFloat(t.userSalary),z=t.userCurrency):(S=M,z="USD"),t.spacingMode&&["default","comfortable","compact"].includes(t.spacingMode)&&(v=t.spacingMode),t.whitelist&&Array.isArray(t.whitelist)&&t.whitelist.length>0){const o=t.whitelist.map(r=>g(r)),n=T.map(r=>g(r));k=[...new Set([...n,...o])],chrome.storage.local.set({whitelist:[...new Set([...T,...t.whitelist])]})}else k=T.map(o=>g(o)),chrome.storage.local.set({whitelist:T});const e=$(window.location.href);Y(e,k)?ne():console.log("TimeCost: Domain not whitelisted, skipping processing:",e)});function ne(){G("Boldonse","700");const t=window.location.href;C=X(t);const e=te(t);console.log(`TimeCost: Using handler for site: ${e}`),A(document.body);let o=null;const n=100;new MutationObserver(s=>{o&&clearTimeout(o);const a=[];s.forEach(c=>{c.addedNodes.forEach(i=>{i.nodeType===1&&i.tagName!=="SCRIPT"&&i.tagName!=="STYLE"&&(D(i)||a.push(i))})}),o=setTimeout(()=>{a.forEach(c=>{A(c)}),o=null},n)}).observe(document.body,{childList:!0,subtree:!0}),chrome.storage.onChanged.addListener((s,a)=>{a==="local"&&s.spacingMode&&(v=s.spacingMode.newValue||"default",requestAnimationFrame(()=>{const c=document.querySelectorAll("[data-timecost-trigger]"),i=document.querySelectorAll('span[style*="background-color: #dafaa2"]'),d=(x,u,l=50)=>{const p=Math.min(u+l,x.length);for(let f=u;f<p;f++){const b=x[f],w=b.parentNode;if(w)if(b.hasAttribute("data-timecost-trigger")){const q=b.getAttribute("data-original-price")||b.textContent,V=document.createTextNode(q);w.replaceChild(V,b),w.normalize()}else w.normalize()}p<x.length?setTimeout(()=>d(x,p,l),0):A(document.body)},m=Array.from(new Set([...c,...i]));m.length>0?d(m,0):A(document.body)}))})}function A(t){if(!C||!C.scanAndConvert){console.error("TimeCost: Site handler not available or missing scanAndConvert method");return}if(C.scanAndConvert(t,S,z,v,B)||C===R)return;const o=C.isInProcessedAmazonPrice?n=>C.isInProcessedAmazonPrice(n):null;F(t,S,z,v,B,o)}
