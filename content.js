const U={USD:1,EUR:.92,BRL:5},N=/((R\$|€|\$)\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?|\d+))|(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?\s*(USD|EUR|BRL))/gi,_=1256.67,T=["google.com","amazon.com","amazon.com.br","amazon.co.uk","amazon.de","amazon.fr","amazon.it","amazon.es","amazon.ca","amazon.com.au","amazon.co.jp","ebay.com","ebay.co.uk","ebay.de","walmart.com","target.com","bestbuy.com","costco.com","alibaba.com","shopify.com","etsy.com","aliexpress.com"];function g(t){return t.replace(/^www\./,"").toLowerCase()}function P(t){try{const e=new URL(t).hostname;return g(e)}catch{const n=t.replace(/^https?:\/\//,"").split("/")[0];return g(n)}}function M(t){const e=g(t),n=e.split("."),o=["co.uk","com.au","co.jp","com.br"];for(const i of o)if(e.endsWith("."+i)){const r=e.replace("."+i,"");return r.split(".").pop()||r}return n.length===2?n[0]:n.length>=3?n[n.length-2]:n[0]}function G(t,e){const n=g(t),o=M(n);if(e.includes(n))return!0;for(const i of e){const r=g(i),c=M(r);if(n===r||o===c&&o||n.endsWith("."+r)||r.endsWith("."+n))return!0}return!1}function D(t){let e=t.parentElement;for(;e&&e!==document.body;){if(e.hasAttribute("data-timecost-trigger")||e.hasAttribute("data-timecost-wrapper")||e.hasAttribute("data-timecost-element")||e.classList.contains("timecost-wrapper"))return!0;e=e.parentElement}return!1}function R(t){let e=t.nodeType===Node.TEXT_NODE?t.parentElement:t;if(!e)return!1;for(;e&&e!==document.body;){const n=e.tagName?.toLowerCase();if(n==="s"||n==="strike"||n==="del")return!0;const o=window.getComputedStyle(e),i=o.textDecoration||o.textDecorationLine;if(i&&i.includes("line-through")||e.style.textDecoration&&e.style.textDecoration.includes("line-through")||e.style.textDecorationLine&&e.style.textDecorationLine.includes("line-through"))return!0;e=e.parentElement}return!1}function $(t,e){let n="USD";t.includes("R$")||t.includes("BRL")?n="BRL":(t.includes("€")||t.includes("EUR"))&&(n="EUR");let o=t.replace(/[^\d.,]/g,"").trim(),i=!1;const r=/,\d{3}\./,c=/\.\d{3},/;if(r.test(o))i=!0;else if(c.test(o))i=!1;else if(o.includes(".")&&o.includes(",")){const l=o.lastIndexOf("."),d=o.lastIndexOf(",");i=l>d}else if(o.includes(".")){const l=o.split("."),d=l[l.length-1];l.length===2&&d.length<=2?i=!0:l.length>2||d.length===3?i=!1:i=d.length<=2}else if(o.includes(",")){const l=o.split(",");i=l[l.length-1].length===3&&l.length>1}else i=n==="USD";if(i)o.includes(".")?o=o.replace(/,/g,""):o.includes(",")&&(o=o.replace(/,/g,""));else if(o.includes(","))o=o.replace(/\./g,"").replace(",",".");else if(o.includes(".")){const l=o.split("."),d=l[l.length-1];l.length>2?o=o.replace(/\./g,""):d.length===3?o=o.replace(/\./g,""):d.length<=2||(o=o.replace(/\./g,""))}const a=parseFloat(o);return{price:isNaN(a)||a===0?null:a,currency:n}}function W(t,e,n,o){const i=t/U[e],c=n/U[o]/22,l=i/c*8;return l<1?`${Math.round(l*60)}m`:`${Math.round(l*10)/10}h`}let x=null;function O(t){const e=t.currentTarget,n=e.getAttribute("data-timecost"),o=e.getAttribute("data-original-price");x&&x.remove();const i=document.createElement("div");i.className="timecost-hover-tooltip",i.setAttribute("data-timecost-tooltip","true"),i.innerHTML=`
    <div style="padding: 12px;">
      <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px; color: #000;">
        ${o}
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
        font-weight: 700;
        line-height: 1.2;
      ">
        ${n}
      </div>
    </div>
  `,i.style.cssText=`
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
  `,document.body.appendChild(i),x=i;const r=e.getBoundingClientRect(),c=i.getBoundingClientRect(),a=window.pageXOffset||document.documentElement.scrollLeft,l=window.pageYOffset||document.documentElement.scrollTop;let d=r.top+l-c.height-8,f=r.left+a+r.width/2-c.width/2;d<l&&(d=r.bottom+l+8),f<a?f=a+8:f+c.width>a+window.innerWidth&&(f=a+window.innerWidth-c.width-8),i.style.top=`${d}px`,i.style.left=`${f}px`,requestAnimationFrame(()=>{i.style.opacity="1"})}function j(t){x&&(x.style.opacity="0",setTimeout(()=>{x&&x.parentNode&&x.remove(),x=null},150))}const B=new WeakSet;function Z(t){const e=t.querySelector(".a-offscreen");if(e){const n=e.textContent.trim();if(n&&/(R\$|€|\$)/.test(n)&&/\d/.test(n))return n}return null}function K(t){let e=t;for(;e&&e!==document.body;){if(e.hasAttribute&&e.hasAttribute("data-a-strike")&&e.getAttribute("data-a-strike")==="true")return!0;e=e.parentElement}return!1}function F(t,e,n,o){t.querySelectorAll(".a-price:not([data-timecost-processed])").forEach(r=>{if(B.has(r)||D(r)||K(r)||R(r))return;B.add(r),r.setAttribute("data-timecost-processed","true");const c=Z(r);if(c)try{let l=new RegExp(N).exec(c),d=l?l[0]:c;const{price:f,currency:y}=$(d);if(!f||f===0)return;const p=W(f,y,e,n);if(o==="compact"){const s=document.createElement("span");s.textContent=p,s.style.cssText=`
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
        `,r.parentNode&&r.parentNode.replaceChild(s,r)}else if(o==="comfortable"){const s=document.createElement("span");s.style.cssText="display: inline-flex; align-items: center; gap: 4px; position: relative; cursor: pointer;",s.setAttribute("data-timecost-trigger","true"),s.setAttribute("data-timecost",p),s.setAttribute("data-original-price",c);const u=document.createElement("span");u.innerHTML=`
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle;">
            <circle cx="12" cy="12" r="10" fill="#dafaa2" stroke="#a8d87a" stroke-width="1.5"/>
            <circle cx="12" cy="12" r="6" fill="none" stroke="#6b9e3e" stroke-width="1" opacity="0.6"/>
            <path d="M8 12 L12 8 L16 12 L12 16 Z" fill="#6b9e3e" opacity="0.8"/>
          </svg>
        `,u.style.cssText="display: inline-flex; align-items: center; line-height: 1; flex-shrink: 0;";const m=r.parentNode;m?(m.insertBefore(s,r),s.appendChild(u),s.appendChild(r)):(r.insertBefore(u,r.firstChild),r.style.cssText+="position: relative; display: inline-flex; align-items: center; gap: 4px; cursor: pointer;"),s.addEventListener("mouseenter",O),s.addEventListener("mouseleave",j)}else{const s=document.createElement("span");s.style.cssText="display: inline-flex; align-items: center; vertical-align: middle;",s.setAttribute("data-timecost-wrapper","true");const u=r.parentNode;u?(u.insertBefore(s,r),s.appendChild(r)):r.appendChild(s);const m=document.createElement("span");m.textContent=` ${p}`,m.setAttribute("data-timecost-element","true"),m.style.cssText=`
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
        `,s.appendChild(m)}}catch(a){console.error("TimeCost Error parsing Amazon price:",c,a)}})}function J(t,e,n,o,i){return F(t,e,n,o),!1}function Q(t){let e=t.parentElement;for(;e&&e!==document.body;){if(e.classList.contains("a-price")&&e.hasAttribute("data-timecost-processed"))return!0;e=e.parentElement}return!1}const h=Object.freeze(Object.defineProperty({__proto__:null,isInProcessedAmazonPrice:Q,processAmazonPrices:F,scanAndConvert:J},Symbol.toStringTag,{value:"Module"}));function ee(t,e,n,o){const i=t.nodeValue,r=[];let c;const a=new RegExp(N);for(;(c=a.exec(i))!==null;)r.push({match:c[0],index:c.index,length:c[0].length});if(r.length===0)return;const l=r.map(p=>{const s=p.match;try{const{price:u,currency:m}=$(s);if(!u||u===0)return null;const b=W(u,m,e,n);return{...p,timeCost:b}}catch(u){return console.error("TimeCost Error parsing:",s,u),null}}).filter(p=>p!==null);if(l.length===0||R(t))return;const d=document.createDocumentFragment();let f=0;l.forEach(p=>{if(p.index>f){const s=i.substring(f,p.index);d.appendChild(document.createTextNode(s))}if(o==="compact"){const s=document.createElement("span");s.textContent=p.timeCost,s.style.cssText=`
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
      `,d.appendChild(s)}else if(o==="comfortable"){const s=document.createElement("span");s.style.cssText="position: relative; display: inline-flex; align-items: center; gap: 4px;",s.setAttribute("data-timecost-trigger","true");const u=document.createElement("span");u.innerHTML=`
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle;">
          <circle cx="12" cy="12" r="10" fill="#dafaa2" stroke="#a8d87a" stroke-width="1.5"/>
          <circle cx="12" cy="12" r="6" fill="none" stroke="#6b9e3e" stroke-width="1" opacity="0.6"/>
          <path d="M8 12 L12 8 L16 12 L12 16 Z" fill="#6b9e3e" opacity="0.8"/>
        </svg>
      `,u.style.cssText="display: inline-flex; align-items: center; line-height: 1;";const m=document.createTextNode(p.match);s.appendChild(u),s.appendChild(m),s.setAttribute("data-timecost",p.timeCost),s.setAttribute("data-original-price",p.match),s.addEventListener("mouseenter",O),s.addEventListener("mouseleave",j),d.appendChild(s)}else{const s=document.createElement("span");s.style.cssText="display: inline-flex; align-items: center; vertical-align: middle;";const u=document.createElement("span");u.textContent=p.match,s.appendChild(u);const m=document.createElement("span");m.textContent=` ${p.timeCost}`,m.style.cssText=`
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
      `,s.appendChild(m),d.appendChild(s)}f=p.index+p.length}),f<i.length&&d.appendChild(document.createTextNode(i.substring(f))),t.parentNode.replaceChild(d,t)}function X(t,e,n,o,i,r=null){if(!i)return console.warn("TimeCost: processedTextNodesSet not provided to generic handler"),!0;const c=document.createTreeWalker(t,NodeFilter.SHOW_TEXT,null,!1);let a;for(;a=c.nextNode();){if(!a.parentElement||a.parentElement.tagName.match(/SCRIPT|STYLE|TEXTAREA|INPUT/)||i.has(a)||D(a)||R(a)||r&&r(a))continue;const l=a.nodeValue;l&&l.trim()&&new RegExp(N).test(l)&&(i.add(a),ee(a,e,n,o))}return!0}const I=Object.freeze(Object.defineProperty({__proto__:null,scanAndConvert:X},Symbol.toStringTag,{value:"Module"})),E={"amazon.com":h,"amazon.co.uk":h,"amazon.de":h,"amazon.fr":h,"amazon.it":h,"amazon.es":h,"amazon.ca":h,"amazon.com.au":h,"amazon.co.jp":h};function L(t){const e=g(t),n=e.split("."),o=["co.uk","com.au","co.jp","com.br"];for(const i of o)if(e.endsWith("."+i)){const r=e.replace("."+i,"");return r.split(".").pop()||r}return n.length===2?n[0]:n.length>=3?n[n.length-2]:n[0]}function q(t){const e=P(t),n=g(e);if(E[n])return E[n];const o=L(n),i=Object.keys(E).find(r=>L(r)===o);return i?E[i]:I}function te(t){const e=P(t),n=g(e),o=L(n);return q(t)!==I?o:"generic"}let A=_,z="USD",k=[],S="default",w=null;const H=new WeakSet;chrome.storage.local.get(["userSalary","userCurrency","whitelist","spacingMode"],t=>{if(t.userSalary&&t.userCurrency?(A=parseFloat(t.userSalary),z=t.userCurrency):(A=_,z="USD"),t.spacingMode&&["default","comfortable","compact"].includes(t.spacingMode)&&(S=t.spacingMode),t.whitelist&&Array.isArray(t.whitelist)&&t.whitelist.length>0){const n=t.whitelist.map(i=>g(i)),o=T.map(i=>g(i));k=[...new Set([...o,...n])],chrome.storage.local.set({whitelist:[...new Set([...T,...t.whitelist])]})}else k=T.map(n=>g(n)),chrome.storage.local.set({whitelist:T});const e=P(window.location.href);G(e,k)?ne():console.log("TimeCost: Domain not whitelisted, skipping processing:",e)});function ne(){const t=window.location.href;w=q(t);const e=te(t);console.log(`TimeCost: Using handler for site: ${e}`),v(document.body);let n=null;const o=100;new MutationObserver(r=>{n&&clearTimeout(n);const c=[];r.forEach(a=>{a.addedNodes.forEach(l=>{l.nodeType===1&&l.tagName!=="SCRIPT"&&l.tagName!=="STYLE"&&(D(l)||c.push(l))})}),n=setTimeout(()=>{c.forEach(a=>{v(a)}),n=null},o)}).observe(document.body,{childList:!0,subtree:!0}),chrome.storage.onChanged.addListener((r,c)=>{c==="local"&&r.spacingMode&&(S=r.spacingMode.newValue||"default",requestAnimationFrame(()=>{const a=document.querySelectorAll("[data-timecost-trigger]"),l=document.querySelectorAll('span[style*="background-color: #dafaa2"]'),d=(y,p,s=50)=>{const u=Math.min(p+s,y.length);for(let m=p;m<u;m++){const b=y[m],C=b.parentNode;if(C)if(b.hasAttribute("data-timecost-trigger")){const V=b.getAttribute("data-original-price")||b.textContent,Y=document.createTextNode(V);C.replaceChild(Y,b),C.normalize()}else C.normalize()}u<y.length?setTimeout(()=>d(y,u,s),0):v(document.body)},f=Array.from(new Set([...a,...l]));f.length>0?d(f,0):v(document.body)}))})}function v(t){if(!w||!w.scanAndConvert){console.error("TimeCost: Site handler not available or missing scanAndConvert method");return}if(w.scanAndConvert(t,A,z,S,H)||w===I)return;const n=w.isInProcessedAmazonPrice?o=>w.isInProcessedAmazonPrice(o):null;X(t,A,z,S,H,n)}
