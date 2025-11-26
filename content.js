const M={USD:1,EUR:.92,BRL:5},P=/((R\$|€|\$)\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?|\d+))|(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?\s*(USD|EUR|BRL))/gi,_=1256.67,T=["google.com","amazon.com","amazon.com.br","amazon.co.uk","amazon.de","amazon.fr","amazon.it","amazon.es","amazon.ca","amazon.com.au","amazon.co.jp","ebay.com","ebay.co.uk","ebay.de","walmart.com","target.com","bestbuy.com","costco.com","alibaba.com","shopify.com","etsy.com","aliexpress.com"];function g(t){return t.replace(/^www\./,"").toLowerCase()}function D(t){try{const e=new URL(t).hostname;return g(e)}catch{const n=t.replace(/^https?:\/\//,"").split("/")[0];return g(n)}}function U(t){const e=g(t),n=e.split("."),o=["co.uk","com.au","co.jp","com.br"];for(const r of o)if(e.endsWith("."+r)){const i=e.replace("."+r,"");return i.split(".").pop()||i}return n.length===2?n[0]:n.length>=3?n[n.length-2]:n[0]}function G(t,e){const n=g(t),o=U(n);if(e.includes(n))return!0;for(const r of e){const i=g(r),c=U(i);if(n===i||o===c&&o||n.endsWith("."+i)||i.endsWith("."+n))return!0}return!1}function L(t){let e=t.parentElement;for(;e&&e!==document.body;){if(e.hasAttribute("data-timecost-trigger")||e.hasAttribute("data-timecost-wrapper")||e.hasAttribute("data-timecost-element")||e.classList.contains("timecost-wrapper"))return!0;e=e.parentElement}return!1}function R(t){let e=t.nodeType===Node.TEXT_NODE?t.parentElement:t;if(!e)return!1;for(;e&&e!==document.body;){const n=e.tagName?.toLowerCase();if(n==="s"||n==="strike"||n==="del")return!0;const o=window.getComputedStyle(e),r=o.textDecoration||o.textDecorationLine;if(r&&r.includes("line-through")||e.style.textDecoration&&e.style.textDecoration.includes("line-through")||e.style.textDecorationLine&&e.style.textDecorationLine.includes("line-through"))return!0;e=e.parentElement}return!1}function $(t,e){let n="USD";t.includes("R$")||t.includes("BRL")?n="BRL":(t.includes("€")||t.includes("EUR"))&&(n="EUR");let o=t.replace(/[^\d.,]/g,"").trim(),r=!1;const i=/,\d{3}\./,c=/\.\d{3},/;if(i.test(o))r=!0;else if(c.test(o))r=!1;else if(o.includes(".")&&o.includes(",")){const a=o.lastIndexOf("."),d=o.lastIndexOf(",");r=a>d}else if(o.includes(".")){const a=o.split("."),d=a[a.length-1];a.length===2&&d.length<=2?r=!0:a.length>2||d.length===3?r=!1:r=d.length<=2}else if(o.includes(",")){const a=o.split(",");r=a[a.length-1].length===3&&a.length>1}else r=n==="USD";if(r)o.includes(".")?o=o.replace(/,/g,""):o.includes(",")&&(o=o.replace(/,/g,""));else if(o.includes(","))o=o.replace(/\./g,"").replace(",",".");else if(o.includes(".")){const a=o.split("."),d=a[a.length-1];a.length>2?o=o.replace(/\./g,""):d.length===3?o=o.replace(/\./g,""):d.length<=2||(o=o.replace(/\./g,""))}const l=parseFloat(o);return{price:isNaN(l)||l===0?null:l,currency:n}}function W(t,e,n,o){const r=t/M[e],c=n/M[o]/22,a=r/c*8;return a<1?`${Math.round(a*60)}m`:`${Math.round(a*10)/10}h`}let x=null;function j(t){const e=t.currentTarget,n=e.getAttribute("data-timecost"),o=e.getAttribute("data-original-price");x&&x.remove();const r=document.createElement("div");r.className="timecost-hover-tooltip",r.setAttribute("data-timecost-tooltip","true"),r.innerHTML=`
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
  `,document.body.appendChild(r),x=r;const i=e.getBoundingClientRect(),c=r.getBoundingClientRect(),l=window.pageXOffset||document.documentElement.scrollLeft,a=window.pageYOffset||document.documentElement.scrollTop;let d=i.top+a-c.height-8,f=i.left+l+i.width/2-c.width/2;d<a&&(d=i.bottom+a+8),f<l?f=l+8:f+c.width>l+window.innerWidth&&(f=l+window.innerWidth-c.width-8),r.style.top=`${d}px`,r.style.left=`${f}px`,requestAnimationFrame(()=>{r.style.opacity="1"})}function O(t){x&&(x.style.opacity="0",setTimeout(()=>{x&&x.parentNode&&x.remove(),x=null},150))}const B=new WeakSet;function K(t){const e=t.querySelector(".a-offscreen");if(e){const n=e.textContent.trim();if(n&&/(R\$|€|\$)/.test(n)&&/\d/.test(n))return n}return null}function J(t){let e=t;for(;e&&e!==document.body;){if(e.hasAttribute&&e.hasAttribute("data-a-strike")&&e.getAttribute("data-a-strike")==="true")return!0;e=e.parentElement}return!1}function F(t,e,n,o){t.querySelectorAll(".a-price:not([data-timecost-processed])").forEach(i=>{if(B.has(i)||L(i)||J(i)||R(i))return;B.add(i),i.setAttribute("data-timecost-processed","true");const c=K(i);if(c)try{let a=new RegExp(P).exec(c),d=a?a[0]:c;const{price:f,currency:y}=$(d);if(!f||f===0)return;const p=W(f,y,e,n);if(o==="compact"){const s=document.createElement("span");s.textContent=p,s.style.cssText=`
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
        `,i.parentNode&&i.parentNode.replaceChild(s,i)}else if(o==="comfortable"){const s=document.createElement("span");s.style.cssText="display: inline-flex; align-items: center; gap: 4px; position: relative; cursor: pointer;",s.setAttribute("data-timecost-trigger","true"),s.setAttribute("data-timecost",p),s.setAttribute("data-original-price",c);const u=document.createElement("span");u.innerHTML=`
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dafaa2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle;">
            <circle cx="12" cy="12" r="10"/>
            <path d="M16 10c0 .465 0 .697-.051.888a1.5 1.5 0 0 1-1.06 1.06C14.697 12 14.465 12 14 12h-4c-.465 0-.697 0-.888.051a1.5 1.5 0 0 0-1.06 1.06C8 13.303 8 13.535 8 14s0 .697.052.888a1.5 1.5 0 0 0 1.06 1.06c.19.052.423.052.888.052h4c.465 0 .697 0 .888-.052a1.5 1.5 0 0 0 1.06-1.06C16 14.697 16 14.465 16 14"/>
            <path d="M12 6v12"/>
          </svg>
        `,u.style.cssText="display: inline-flex; align-items: center; line-height: 1; flex-shrink: 0;";const m=i.parentNode;m?(m.insertBefore(s,i),s.appendChild(i),s.appendChild(u)):(i.appendChild(u),i.style.cssText+="position: relative; display: inline-flex; align-items: center; gap: 4px; cursor: pointer;"),s.addEventListener("mouseenter",j),s.addEventListener("mouseleave",O)}else{const s=document.createElement("span");s.style.cssText="display: inline-flex; align-items: center; vertical-align: middle;",s.setAttribute("data-timecost-wrapper","true");const u=i.parentNode;u?(u.insertBefore(s,i),s.appendChild(i)):i.appendChild(s);const m=document.createElement("span");m.textContent=` ${p}`,m.setAttribute("data-timecost-element","true"),m.style.cssText=`
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
        `,s.appendChild(m)}}catch(l){console.error("TimeCost Error parsing Amazon price:",c,l)}})}function Q(t,e,n,o,r){return F(t,e,n,o),!1}function Z(t){let e=t.parentElement;for(;e&&e!==document.body;){if(e.classList.contains("a-price")&&e.hasAttribute("data-timecost-processed"))return!0;e=e.parentElement}return!1}const h=Object.freeze(Object.defineProperty({__proto__:null,isInProcessedAmazonPrice:Z,processAmazonPrices:F,scanAndConvert:Q},Symbol.toStringTag,{value:"Module"}));function ee(t,e,n,o){const r=t.nodeValue,i=[];let c;const l=new RegExp(P);for(;(c=l.exec(r))!==null;)i.push({match:c[0],index:c.index,length:c[0].length});if(i.length===0)return;const a=i.map(p=>{const s=p.match;try{const{price:u,currency:m}=$(s);if(!u||u===0)return null;const b=W(u,m,e,n);return{...p,timeCost:b}}catch(u){return console.error("TimeCost Error parsing:",s,u),null}}).filter(p=>p!==null);if(a.length===0||R(t))return;const d=document.createDocumentFragment();let f=0;a.forEach(p=>{if(p.index>f){const s=r.substring(f,p.index);d.appendChild(document.createTextNode(s))}if(o==="compact"){const s=document.createElement("span");s.textContent=p.timeCost,s.style.cssText=`
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
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dafaa2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle;">
          <circle cx="12" cy="12" r="10"/>
          <path d="M16 10c0 .465 0 .697-.051.888a1.5 1.5 0 0 1-1.06 1.06C14.697 12 14.465 12 14 12h-4c-.465 0-.697 0-.888.051a1.5 1.5 0 0 0-1.06 1.06C8 13.303 8 13.535 8 14s0 .697.052.888a1.5 1.5 0 0 0 1.06 1.06c.19.052.423.052.888.052h4c.465 0 .697 0 .888-.052a1.5 1.5 0 0 0 1.06-1.06C16 14.697 16 14.465 16 14"/>
          <path d="M12 6v12"/>
        </svg>
      `,u.style.cssText="display: inline-flex; align-items: center; line-height: 1;";const m=document.createTextNode(p.match);s.appendChild(m),s.appendChild(u),s.setAttribute("data-timecost",p.timeCost),s.setAttribute("data-original-price",p.match),s.addEventListener("mouseenter",j),s.addEventListener("mouseleave",O),d.appendChild(s)}else{const s=document.createElement("span");s.style.cssText="display: inline-flex; align-items: center; vertical-align: middle;";const u=document.createElement("span");u.textContent=p.match,s.appendChild(u);const m=document.createElement("span");m.textContent=` ${p.timeCost}`,m.style.cssText=`
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
      `,s.appendChild(m),d.appendChild(s)}f=p.index+p.length}),f<r.length&&d.appendChild(document.createTextNode(r.substring(f))),t.parentNode.replaceChild(d,t)}function X(t,e,n,o,r,i=null){if(!r)return console.warn("TimeCost: processedTextNodesSet not provided to generic handler"),!0;const c=document.createTreeWalker(t,NodeFilter.SHOW_TEXT,null,!1);let l;for(;l=c.nextNode();){if(!l.parentElement||l.parentElement.tagName.match(/SCRIPT|STYLE|TEXTAREA|INPUT/)||r.has(l)||L(l)||R(l)||i&&i(l))continue;const a=l.nodeValue;a&&a.trim()&&new RegExp(P).test(a)&&(r.add(l),ee(l,e,n,o))}return!0}const I=Object.freeze(Object.defineProperty({__proto__:null,scanAndConvert:X},Symbol.toStringTag,{value:"Module"})),E={"amazon.com":h,"amazon.co.uk":h,"amazon.de":h,"amazon.fr":h,"amazon.it":h,"amazon.es":h,"amazon.ca":h,"amazon.com.au":h,"amazon.co.jp":h};function N(t){const e=g(t),n=e.split("."),o=["co.uk","com.au","co.jp","com.br"];for(const r of o)if(e.endsWith("."+r)){const i=e.replace("."+r,"");return i.split(".").pop()||i}return n.length===2?n[0]:n.length>=3?n[n.length-2]:n[0]}function q(t){const e=D(t),n=g(e);if(E[n])return E[n];const o=N(n),r=Object.keys(E).find(i=>N(i)===o);return r?E[r]:I}function te(t){const e=D(t),n=g(e),o=N(n);return q(t)!==I?o:"generic"}let A=_,z="USD",k=[],S="default",w=null;const H=new WeakSet;chrome.storage.local.get(["userSalary","userCurrency","whitelist","spacingMode"],t=>{if(t.userSalary&&t.userCurrency?(A=parseFloat(t.userSalary),z=t.userCurrency):(A=_,z="USD"),t.spacingMode&&["default","comfortable","compact"].includes(t.spacingMode)&&(S=t.spacingMode),t.whitelist&&Array.isArray(t.whitelist)&&t.whitelist.length>0){const n=t.whitelist.map(r=>g(r)),o=T.map(r=>g(r));k=[...new Set([...o,...n])],chrome.storage.local.set({whitelist:[...new Set([...T,...t.whitelist])]})}else k=T.map(n=>g(n)),chrome.storage.local.set({whitelist:T});const e=D(window.location.href);G(e,k)?ne():console.log("TimeCost: Domain not whitelisted, skipping processing:",e)});function ne(){const t=window.location.href;w=q(t);const e=te(t);console.log(`TimeCost: Using handler for site: ${e}`),v(document.body);let n=null;const o=100;new MutationObserver(i=>{n&&clearTimeout(n);const c=[];i.forEach(l=>{l.addedNodes.forEach(a=>{a.nodeType===1&&a.tagName!=="SCRIPT"&&a.tagName!=="STYLE"&&(L(a)||c.push(a))})}),n=setTimeout(()=>{c.forEach(l=>{v(l)}),n=null},o)}).observe(document.body,{childList:!0,subtree:!0}),chrome.storage.onChanged.addListener((i,c)=>{c==="local"&&i.spacingMode&&(S=i.spacingMode.newValue||"default",requestAnimationFrame(()=>{const l=document.querySelectorAll("[data-timecost-trigger]"),a=document.querySelectorAll('span[style*="background-color: #dafaa2"]'),d=(y,p,s=50)=>{const u=Math.min(p+s,y.length);for(let m=p;m<u;m++){const b=y[m],C=b.parentNode;if(C)if(b.hasAttribute("data-timecost-trigger")){const V=b.getAttribute("data-original-price")||b.textContent,Y=document.createTextNode(V);C.replaceChild(Y,b),C.normalize()}else C.normalize()}u<y.length?setTimeout(()=>d(y,u,s),0):v(document.body)},f=Array.from(new Set([...l,...a]));f.length>0?d(f,0):v(document.body)}))})}function v(t){if(!w||!w.scanAndConvert){console.error("TimeCost: Site handler not available or missing scanAndConvert method");return}if(w.scanAndConvert(t,A,z,S,H)||w===I)return;const n=w.isInProcessedAmazonPrice?o=>w.isInProcessedAmazonPrice(o):null;X(t,A,z,S,H,n)}
