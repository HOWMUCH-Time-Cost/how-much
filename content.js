const I={USD:1,EUR:.92,BRL:5},N=/((R\$|€|\$)\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?|\d+))|(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?\s*(USD|EUR|BRL))/gi,W=1256.67,T=["google.com","amazon.com","amazon.com.br","amazon.co.uk","amazon.de","amazon.fr","amazon.it","amazon.es","amazon.ca","amazon.com.au","amazon.co.jp","ebay.com","ebay.co.uk","ebay.de","walmart.com","target.com","bestbuy.com","costco.com","alibaba.com","shopify.com","etsy.com","aliexpress.com"];function g(t){return t.replace(/^www\./,"").toLowerCase()}function k(t){try{const e=new URL(t).hostname;return g(e)}catch{const n=t.replace(/^https?:\/\//,"").split("/")[0];return g(n)}}function M(t){const e=g(t),n=e.split("."),o=["co.uk","com.au","co.jp","com.br"];for(const r of o)if(e.endsWith("."+r)){const i=e.replace("."+r,"");return i.split(".").pop()||i}return n.length===2?n[0]:n.length>=3?n[n.length-2]:n[0]}function G(t,e){const n=g(t),o=M(n);if(e.includes(n))return!0;for(const r of e){const i=g(r),c=M(i);if(n===i||o===c&&o||n.endsWith("."+i)||i.endsWith("."+n))return!0}return!1}function L(t){let e=t.parentElement;for(;e&&e!==document.body;){if(e.hasAttribute("data-timecost-trigger")||e.hasAttribute("data-timecost-wrapper")||e.hasAttribute("data-timecost-element")||e.classList.contains("timecost-wrapper"))return!0;e=e.parentElement}return!1}function R(t){let e=t.nodeType===Node.TEXT_NODE?t.parentElement:t;if(!e)return!1;for(;e&&e!==document.body;){const n=e.tagName?.toLowerCase();if(n==="s"||n==="strike"||n==="del")return!0;const o=window.getComputedStyle(e),r=o.textDecoration||o.textDecorationLine;if(r&&r.includes("line-through")||e.style.textDecoration&&e.style.textDecoration.includes("line-through")||e.style.textDecorationLine&&e.style.textDecorationLine.includes("line-through"))return!0;e=e.parentElement}return!1}function H(t,e){let n="USD";t.includes("R$")||t.includes("BRL")?n="BRL":(t.includes("€")||t.includes("EUR"))&&(n="EUR");let o=t.replace(/[^\d.,]/g,"").trim(),r=!1;const i=/,\d{3}\./,c=/\.\d{3},/;if(i.test(o))r=!0;else if(c.test(o))r=!1;else if(o.includes(".")&&o.includes(",")){const s=o.lastIndexOf("."),d=o.lastIndexOf(",");r=s>d}else if(o.includes(".")){const s=o.split("."),d=s[s.length-1];s.length===2&&d.length<=2?r=!0:s.length>2||d.length===3?r=!1:r=d.length<=2}else if(o.includes(",")){const s=o.split(",");r=s[s.length-1].length===3&&s.length>1}else r=n==="USD";if(r)o.includes(".")?o=o.replace(/,/g,""):o.includes(",")&&(o=o.replace(/,/g,""));else if(o.includes(","))o=o.replace(/\./g,"").replace(",",".");else if(o.includes(".")){const s=o.split("."),d=s[s.length-1];s.length>2?o=o.replace(/\./g,""):d.length===3?o=o.replace(/\./g,""):d.length<=2||(o=o.replace(/\./g,""))}const l=parseFloat(o);return{price:isNaN(l)||l===0?null:l,currency:n}}function B(t,e,n,o){const r=t/I[e],c=n/I[o]/22,s=r/c*8;return s<1?`${Math.round(s*60)}m`:`${Math.round(s*10)/10}h`}let x=null;function O(t){const e=t.currentTarget,n=e.getAttribute("data-timecost"),o=e.getAttribute("data-original-price");x&&x.remove();const r=document.createElement("div");r.className="timecost-hover-tooltip",r.setAttribute("data-timecost-tooltip","true"),r.innerHTML=`
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
  `,document.body.appendChild(r),x=r;const i=e.getBoundingClientRect(),c=r.getBoundingClientRect(),l=window.pageXOffset||document.documentElement.scrollLeft,s=window.pageYOffset||document.documentElement.scrollTop;let d=i.top+s-c.height-8,m=i.left+l+i.width/2-c.width/2;d<s&&(d=i.bottom+s+8),m<l?m=l+8:m+c.width>l+window.innerWidth&&(m=l+window.innerWidth-c.width-8),r.style.top=`${d}px`,r.style.left=`${m}px`,requestAnimationFrame(()=>{r.style.opacity="1"})}function j(t){x&&(x.style.opacity="0",setTimeout(()=>{x&&x.parentNode&&x.remove(),x=null},150))}const _=new WeakSet;function K(t){const e=t.querySelector(".a-offscreen");if(e){const n=e.textContent.trim();if(n&&/(R\$|€|\$)/.test(n)&&/\d/.test(n))return n}return null}function J(t){let e=t;for(;e&&e!==document.body;){if(e.hasAttribute&&e.hasAttribute("data-a-strike")&&e.getAttribute("data-a-strike")==="true")return!0;e=e.parentElement}return!1}function F(t,e,n,o){t.querySelectorAll(".a-price:not([data-timecost-processed])").forEach(i=>{if(_.has(i)||L(i)||J(i)||R(i))return;_.add(i),i.setAttribute("data-timecost-processed","true");const c=K(i);if(c)try{let s=new RegExp(N).exec(c),d=s?s[0]:c;const{price:m,currency:y}=H(d);if(!m||m===0)return;const u=B(m,y,e,n);if(o==="compact"){const a=document.createElement("span");a.textContent=u,a.style.cssText=`
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
        `,i.parentNode&&i.parentNode.replaceChild(a,i)}else if(o==="comfortable")i.style.cssText+="position: relative; display: inline-block; cursor: pointer;",i.setAttribute("data-timecost-trigger","true"),i.setAttribute("data-timecost",u),i.setAttribute("data-original-price",c),i.addEventListener("mouseenter",O),i.addEventListener("mouseleave",j);else{const a=document.createElement("span");a.style.cssText="display: inline-flex; align-items: center; vertical-align: middle;",a.setAttribute("data-timecost-wrapper","true");const p=i.parentNode;p?(p.insertBefore(a,i),a.appendChild(i)):i.appendChild(a);const f=document.createElement("span");f.textContent=` ${u}`,f.setAttribute("data-timecost-element","true"),f.style.cssText=`
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
        `,a.appendChild(f)}}catch(l){console.error("TimeCost Error parsing Amazon price:",c,l)}})}function Q(t,e,n,o,r){return F(t,e,n,o),!1}function Z(t){let e=t.parentElement;for(;e&&e!==document.body;){if(e.classList.contains("a-price")&&e.hasAttribute("data-timecost-processed"))return!0;e=e.parentElement}return!1}const h=Object.freeze(Object.defineProperty({__proto__:null,isInProcessedAmazonPrice:Z,processAmazonPrices:F,scanAndConvert:Q},Symbol.toStringTag,{value:"Module"}));function ee(t,e,n,o){const r=t.nodeValue,i=[];let c;const l=new RegExp(N);for(;(c=l.exec(r))!==null;)i.push({match:c[0],index:c.index,length:c[0].length});if(i.length===0)return;const s=i.map(u=>{const a=u.match;try{const{price:p,currency:f}=H(a);if(!p||p===0)return null;const b=B(p,f,e,n);return{...u,timeCost:b}}catch(p){return console.error("TimeCost Error parsing:",a,p),null}}).filter(u=>u!==null);if(s.length===0||R(t))return;const d=document.createDocumentFragment();let m=0;s.forEach(u=>{if(u.index>m){const a=r.substring(m,u.index);d.appendChild(document.createTextNode(a))}if(o==="compact"){const a=document.createElement("span");a.textContent=u.timeCost,a.style.cssText=`
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
      `,d.appendChild(a)}else if(o==="comfortable"){const a=document.createElement("span");a.style.cssText="position: relative; display: inline-block;",a.setAttribute("data-timecost-trigger","true"),a.textContent=u.match,a.setAttribute("data-timecost",u.timeCost),a.setAttribute("data-original-price",u.match),a.addEventListener("mouseenter",O),a.addEventListener("mouseleave",j),d.appendChild(a)}else{const a=document.createElement("span");a.style.cssText="display: inline-flex; align-items: center; vertical-align: middle;";const p=document.createElement("span");p.textContent=u.match,a.appendChild(p);const f=document.createElement("span");f.textContent=` ${u.timeCost}`,f.style.cssText=`
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
      `,a.appendChild(f),d.appendChild(a)}m=u.index+u.length}),m<r.length&&d.appendChild(document.createTextNode(r.substring(m))),t.parentNode.replaceChild(d,t)}function X(t,e,n,o,r,i=null){if(!r)return console.warn("TimeCost: processedTextNodesSet not provided to generic handler"),!0;const c=document.createTreeWalker(t,NodeFilter.SHOW_TEXT,null,!1);let l;for(;l=c.nextNode();){if(!l.parentElement||l.parentElement.tagName.match(/SCRIPT|STYLE|TEXTAREA|INPUT/)||r.has(l)||L(l)||R(l)||i&&i(l))continue;const s=l.nodeValue;s&&s.trim()&&new RegExp(N).test(s)&&(r.add(l),ee(l,e,n,o))}return!0}const U=Object.freeze(Object.defineProperty({__proto__:null,scanAndConvert:X},Symbol.toStringTag,{value:"Module"})),E={"amazon.com":h,"amazon.co.uk":h,"amazon.de":h,"amazon.fr":h,"amazon.it":h,"amazon.es":h,"amazon.ca":h,"amazon.com.au":h,"amazon.co.jp":h};function D(t){const e=g(t),n=e.split("."),o=["co.uk","com.au","co.jp","com.br"];for(const r of o)if(e.endsWith("."+r)){const i=e.replace("."+r,"");return i.split(".").pop()||i}return n.length===2?n[0]:n.length>=3?n[n.length-2]:n[0]}function q(t){const e=k(t),n=g(e);if(E[n])return E[n];const o=D(n),r=Object.keys(E).find(i=>D(i)===o);return r?E[r]:U}function te(t){const e=k(t),n=g(e),o=D(n);return q(t)!==U?o:"generic"}let z=W,S="USD",P=[],v="default",w=null;const $=new WeakSet;chrome.storage.local.get(["userSalary","userCurrency","whitelist","spacingMode"],t=>{if(t.userSalary&&t.userCurrency?(z=parseFloat(t.userSalary),S=t.userCurrency):(z=W,S="USD"),t.spacingMode&&["default","comfortable","compact"].includes(t.spacingMode)&&(v=t.spacingMode),t.whitelist&&Array.isArray(t.whitelist)&&t.whitelist.length>0){const n=t.whitelist.map(r=>g(r)),o=T.map(r=>g(r));P=[...new Set([...o,...n])],chrome.storage.local.set({whitelist:[...new Set([...T,...t.whitelist])]})}else P=T.map(n=>g(n)),chrome.storage.local.set({whitelist:T});const e=k(window.location.href);G(e,P)?ne():console.log("TimeCost: Domain not whitelisted, skipping processing:",e)});function ne(){const t=window.location.href;w=q(t);const e=te(t);console.log(`TimeCost: Using handler for site: ${e}`),A(document.body);let n=null;const o=100;new MutationObserver(i=>{n&&clearTimeout(n);const c=[];i.forEach(l=>{l.addedNodes.forEach(s=>{s.nodeType===1&&s.tagName!=="SCRIPT"&&s.tagName!=="STYLE"&&(L(s)||c.push(s))})}),n=setTimeout(()=>{c.forEach(l=>{A(l)}),n=null},o)}).observe(document.body,{childList:!0,subtree:!0}),chrome.storage.onChanged.addListener((i,c)=>{c==="local"&&i.spacingMode&&(v=i.spacingMode.newValue||"default",requestAnimationFrame(()=>{const l=document.querySelectorAll("[data-timecost-trigger]"),s=document.querySelectorAll('span[style*="background-color: #dafaa2"]'),d=(y,u,a=50)=>{const p=Math.min(u+a,y.length);for(let f=u;f<p;f++){const b=y[f],C=b.parentNode;if(C)if(b.hasAttribute("data-timecost-trigger")){const V=b.getAttribute("data-original-price")||b.textContent,Y=document.createTextNode(V);C.replaceChild(Y,b),C.normalize()}else C.normalize()}p<y.length?setTimeout(()=>d(y,p,a),0):A(document.body)},m=Array.from(new Set([...l,...s]));m.length>0?d(m,0):A(document.body)}))})}function A(t){if(!w||!w.scanAndConvert){console.error("TimeCost: Site handler not available or missing scanAndConvert method");return}if(w.scanAndConvert(t,z,S,v,$)||w===U)return;const n=w.isInProcessedAmazonPrice?o=>w.isInProcessedAmazonPrice(o):null;X(t,z,S,v,$,n)}
