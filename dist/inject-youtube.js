var ye=Object.defineProperty;var ve=(y,g,x)=>g in y?ye(y,g,{enumerable:!0,configurable:!0,writable:!0,value:x}):y[g]=x;var l=(y,g,x)=>ve(y,typeof g!="symbol"?g+"":g,x);(function(){"use strict";const y={basedMax:35,mediumMax:65,intervention:80,cooldownMs:6e4},g={active:!1,mode:"items",limit:10,consumed:0,startedAt:0},x={active:!1,endsAt:0,bypassCount:0},q=["[>] Step outside for 2 minutes","[~] Drink a glass of water","[o] Do 5 deep breaths","[!] Do 10 jumping jacks","[*] Look at something 20 feet away for 20 seconds","[♪] Put on your favorite song","[>] Text a friend something nice","[=] Open a window and feel the air"],I={based:{emoji:"( ._.)",label:"Based",hint:"Keep it chill, you're doing great."},medium:{emoji:"(-_-;)",label:"Medium Cooked",hint:"Maybe take a breather soon?"},cooked:{emoji:"(x_x) ",label:"Absolutely Cooked",hint:"Bro. Step away from the screen."}},N=[{id:"Chill",emoji:"~_~",label:"Just Vibing"},{id:"Learn",emoji:"o_O",label:"Learn Something"},{id:"Laugh",emoji:"xD",label:"Get Entertained"},{id:"Music",emoji:"♪♫",label:"Music / Audio"},{id:"JustHere",emoji:"...",label:"I'm Just Here"}],D=.3,B=15e3,U=500,V=3e3,$=2e3,O=4e3,W=.35,F=3,P={edge:"right",verticalOffset:20};function S(t){return Math.max(0,Math.min(100,t))}function Y(t){return t==="Chill"||t==="Laugh"?15e3:t==="Learn"||t==="JustHere"?25e3:2e4}function K(t,s,e,o){const r=Math.min(1,t/s),i=Math.min(1,e/150),n=Math.min(1,o/60),a=r*35+i*35+n*30;return Math.round(Math.min(100,a))}function X(t,s,e,o,r){const i=r==="Learn"?1.3:r==="JustHere"?1.1:r==="Laugh"?.8:r==="Chill"?.7:1;if(e){const a=s*i,c=t*(1-D)+a*D;return S(c)}if(o<B)return t;const n=o<45e3?1:o<9e4?2:4;return S(t-n)}function J(t,s,e,o){if(s>0)return S(t+s);const r=Y(e);return o<r?t:o<6e4?S(t-1):S(t-3)}function Q(t,s=y){return t<=s.basedMax?"Based":t<=s.mediumMax?"Medium Cooked":"Absolutely Cooked"}function G(t){return t==="Based"?I.based:t==="Medium Cooked"?I.medium:I.cooked}function Z(t,s,e=y,o=Date.now()){return!(t<e.intervention||o-s<e.cooldownMs)}function ee(t){return t>=100}const R="brd_widget_positions";async function te(t,s){return(await chrome.storage.local.get(t))[t]??s}async function se(t,s){await chrome.storage.local.set({[t]:s})}async function H(){return te(R,{})}async function oe(t){return(await H())[t]??P}async function re(t,s){const e=await H();e[t]=s,await se(R,e)}const L="brd-overlay-host",ie=8;let p=null,v={...P},m=null,k=null;function z(){if(p)return p;let t=document.getElementById(L);if(t||(t=document.createElement("div"),t.id=L,t.style.cssText="position:fixed;top:0;left:0;width:0;height:0;z-index:2147483647;pointer-events:none;",document.documentElement.appendChild(t)),t.shadowRoot)return p=t.shadowRoot,j(),p;p=t.attachShadow({mode:"open"});const s=document.createElement("style");s.textContent=ue,p.appendChild(s);const e=document.createElement("link");return e.rel="stylesheet",e.href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap",p.appendChild(e),j(),p}function C(t,s){const e=z(),o=e.querySelector(`[data-overlay="${t}"]`);o&&o.remove();const r=document.createElement("div");return r.setAttribute("data-overlay",t),r.innerHTML=s,e.appendChild(r),r}function ne(t){const s=z();k=t.onActivate??null;let e=s.querySelector('[data-overlay="widget"]');if(!e){e=document.createElement("div"),e.setAttribute("data-overlay","widget"),e.innerHTML=`
      <div class="brd-widget">
        <div class="brd-widget-main">
          <span class="brd-widget-emoji"></span>
          <span class="brd-widget-label"></span>
          <span class="brd-widget-score"></span>
        </div>
        <div class="brd-widget-pack" hidden>
          <div class="brd-widget-pack-label"></div>
          <div class="brd-pack-bar"><div class="brd-pack-fill"></div></div>
        </div>
      </div>
    `,s.appendChild(e);const o=e.querySelector(".brd-widget");o&&(m==null||m(),m=le(o,t.siteKey))}return ce(e,t),T(),e}function u(t){const s=p;if(!s)return;const e=s.querySelector(`[data-overlay="${t}"]`);e&&(t==="widget"&&(m==null||m(),m=null,k=null),e.remove())}function ae(){const t=p;t&&(m==null||m(),m=null,k=null,t.querySelectorAll("[data-overlay]").forEach(s=>s.remove()))}async function de(t){v=await oe(t),T()}async function j(){var o;const t=await chrome.runtime.sendMessage({type:"GET_SETTINGS"}),s=t!=null&&t.success&&((o=t.data)!=null&&o.theme)?t.data.theme:"light",e=document.getElementById(L);e&&(s==="dark"?e.classList.add("brd-dark"):e.classList.remove("brd-dark"))}function ce(t,s){const e=t.querySelector(".brd-widget");if(!e)return;e.dataset.score=s.score.toFixed(3),e.dataset.status=s.status;const o=G(s.status),r=s.status==="Based"?"brd-score-based":s.status==="Medium Cooked"?"brd-score-medium":"brd-score-cooked",i=e.querySelector(".brd-widget-emoji"),n=e.querySelector(".brd-widget-label"),a=e.querySelector(".brd-widget-score"),c=e.querySelector(".brd-widget-pack"),f=e.querySelector(".brd-widget-pack-label"),b=e.querySelector(".brd-pack-fill");i&&(i.textContent=o.emoji),n&&(n.textContent=o.label),a&&(a.textContent=String(Math.round(s.score)),a.className=`brd-widget-score ${r}`),c&&f&&b&&(s.pack?(c.hidden=!1,f.textContent=s.pack.label,b.style.width=`${Math.max(0,Math.min(100,s.pack.percent))}%`):(c.hidden=!0,f.textContent="",b.style.width="0%"))}function T(){const t=p==null?void 0:p.querySelector(".brd-widget");t&&(t.style.left=v.edge==="left"?"0px":"auto",t.style.right=v.edge==="right"?"0px":"auto",t.style.bottom=`${M(v.verticalOffset,t)}px`)}function le(t,s){let e=null,o=!1,r=0,i=0,n=0;const a=()=>{e=null,o=!1,t.style.cursor="grab",t.style.transition="all 0.2s ease"},c=d=>{d.pointerType==="mouse"&&d.button!==0||d.target.closest("button, input, a")||(e=d.pointerId,o=!1,r=d.clientX,i=d.clientY,n=window.innerHeight-t.getBoundingClientRect().bottom,t.style.cursor="grabbing",t.style.transition="none",t.setPointerCapture(d.pointerId),d.preventDefault())},f=d=>{if(e!==d.pointerId)return;const _=d.clientX-r,E=i-d.clientY;if(!o&&Math.hypot(_,E)>=ie&&(o=!0),!o)return;const ge=M(n+E,t);t.style.left=v.edge==="left"?"0px":"auto",t.style.right=v.edge==="right"?"0px":"auto",t.style.bottom=`${ge}px`},b=async d=>{if(e!==d.pointerId)return;const _=o;if(t.hasPointerCapture(d.pointerId)&&t.releasePointerCapture(d.pointerId),_){const E=t.getBoundingClientRect();v={edge:d.clientX<window.innerWidth/2?"left":"right",verticalOffset:M(window.innerHeight-E.bottom,t)},T(),await re(s,v)}else k==null||k();a()},w=d=>{e===d.pointerId&&(t.hasPointerCapture(d.pointerId)&&t.releasePointerCapture(d.pointerId),T(),a())};return t.addEventListener("pointerdown",c),t.addEventListener("pointermove",f),t.addEventListener("pointerup",b),t.addEventListener("pointercancel",w),t.style.cursor="grab",()=>{t.removeEventListener("pointerdown",c),t.removeEventListener("pointermove",f),t.removeEventListener("pointerup",b),t.removeEventListener("pointercancel",w)}}function M(t,s){const e=Math.max(0,window.innerHeight-s.getBoundingClientRect().height-8);return Math.max(0,Math.min(t,e))}const ue=`
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .brd-fullscreen {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(212, 201, 168, 0.92);
    backdrop-filter: blur(4px);
    pointer-events: all;
    z-index: 999999;
    animation: brd-fadeIn 0.25s ease-out;
    font-family: 'Patrick Hand', 'Caveat', cursive, sans-serif;
    color: #3a2e1e;
  }

  .brd-card {
    background: #fdf8ee;
    border: 3px solid #3a2e1e;
    border-radius: 6px;
    padding: 28px 32px;
    max-width: 420px;
    width: 90vw;
    box-shadow: 6px 6px 0 #3a2e1e;
    pointer-events: all;
    animation: brd-slideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    font-family: 'Patrick Hand', 'Caveat', cursive, sans-serif;
    background-image: repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 27px,
      #c8d8e8 27px,
      #c8d8e8 28px
    );
    background-position: 0 36px;
  }

  .brd-card h2 {
    font-family: 'Caveat', cursive;
    font-size: 26px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #3a2e1e;
    text-decoration: underline;
    text-decoration-style: wavy;
    text-decoration-color: #c0392b;
    text-underline-offset: 3px;
  }

  .brd-card p {
    font-family: 'Patrick Hand', cursive;
    font-size: 15px;
    color: #7a6a50;
    line-height: 1.5;
    margin-bottom: 16px;
  }

  .brd-btn-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 16px;
  }

  .brd-btn {
    padding: 9px 18px;
    border-radius: 5px;
    border: 2.5px solid #3a2e1e;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Caveat', cursive;
    background: #fdf8ee;
    color: #3a2e1e;
    box-shadow: 2px 2px 0 #3a2e1e;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .brd-btn:hover {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 #3a2e1e;
  }

  .brd-btn:active {
    transform: translate(1px, 1px);
    box-shadow: none;
  }

  .brd-btn-primary {
    background: #e8d5f5;
    border-color: #7b2d8b;
    color: #7b2d8b;
    box-shadow: 2px 2px 0 #7b2d8b;
  }

  .brd-btn-primary:hover { box-shadow: 3px 3px 0 #7b2d8b; }

  .brd-btn-success {
    background: #d5f0e0;
    border-color: #2e7d32;
    color: #2e7d32;
    box-shadow: 2px 2px 0 #2e7d32;
  }

  .brd-btn-success:hover { box-shadow: 3px 3px 0 #2e7d32; }

  .brd-btn-ghost {
    background: #fdf8ee;
    color: #7a6a50;
    border-color: #c8b89a;
    box-shadow: 2px 2px 0 #c8b89a;
  }

  .brd-btn-ghost:hover { box-shadow: 3px 3px 0 #c8b89a; }

  .brd-btn-danger {
    background: #fdecea;
    color: #c0392b;
    border-color: #c0392b;
    box-shadow: 2px 2px 0 #c0392b;
  }

  .brd-btn-danger:hover { box-shadow: 3px 3px 0 #c0392b; }

  .brd-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
    min-width: 132px;
    padding: 8px 14px;
    background: #fdf8ee;
    border: 2.5px solid #3a2e1e;
    border-radius: 8px;
    box-shadow: 3px 3px 0 #3a2e1e;
    pointer-events: all;
    z-index: 999998;
    font-family: 'Patrick Hand', 'Caveat', cursive, -apple-system, sans-serif;
    animation: brd-slideIn 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    user-select: none;
    transition: all 0.2s ease;
  }

  .brd-widget:hover {
    transform: translate(-1px, -1px);
    box-shadow: 4px 4px 0 #3a2e1e;
  }

  .brd-widget-main {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .brd-widget-pack {
    width: 100%;
  }

  .brd-widget-pack-label {
    font-size: 10px;
    color: #7a6a50;
    margin-bottom: 3px;
  }

  .brd-widget-emoji {
    font-size: 13px;
    font-family: 'Caveat', cursive;
    color: #3a2e1e;
    letter-spacing: -0.5px;
    white-space: pre;
  }

  .brd-widget-label {
    font-size: 13px;
    font-weight: 600;
    color: #3a2e1e;
    font-family: 'Patrick Hand', cursive;
  }

  .brd-widget-score {
    font-size: 12px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 4px;
    min-width: 28px;
    margin-left: auto;
    text-align: center;
    font-family: 'Caveat', cursive;
    border: 1.5px solid currentColor;
  }

  .brd-score-based  { background: #e8f5e9; color: #2e7d32; }
  .brd-score-medium { background: #fff3e0; color: #e65100; }
  .brd-score-cooked { background: #fdecea; color: #c0392b; }

  .brd-pack-bar {
    width: 100%;
    height: 8px;
    background: #e8dcc8;
    border-radius: 0;
    border: 1.5px solid #8a8060;
    margin-top: 8px;
    overflow: hidden;
  }

  .brd-pack-fill {
    height: 100%;
    background: #2e7d32;
    transition: width 0.5s ease;
  }

  .brd-timer {
    font-family: 'Caveat', cursive;
    font-size: 56px;
    font-weight: 700;
    color: #3a2e1e;
    letter-spacing: -2px;
    text-align: center;
    margin: 12px 0;
  }

  .brd-vibe-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin: 12px 0;
  }

  .brd-vibe-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 12px 8px;
    background: #fdf8ee;
    border: 2px solid #3a2e1e;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 2px 2px 0 #3a2e1e;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .brd-vibe-card:hover {
    background: #e8d5f5;
    border-color: #7b2d8b;
    box-shadow: 3px 3px 0 #7b2d8b;
    transform: translate(-1px, -1px);
  }

  .brd-vibe-emoji {
    font-family: 'Caveat', cursive;
    font-size: 18px;
    color: #3a2e1e;
  }

  .brd-vibe-label {
    font-family: 'Patrick Hand', cursive;
    font-size: 11px;
    font-weight: 600;
    color: #7a6a50;
  }

  .brd-tips {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 12px 0;
  }

  .brd-tip {
    padding: 7px 12px;
    background: #fffde7;
    border: 1.5px dashed #c8b89a;
    border-radius: 4px;
    font-family: 'Patrick Hand', cursive;
    font-size: 13px;
    color: #7a6a50;
  }

  .brd-video-wrap {
    width: 100%;
    max-width: 480px;
    border: 3px solid #3a2e1e;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 20px;
    box-shadow: 5px 5px 0 #3a2e1e;
  }

  .brd-video-wrap video {
    width: 100%;
    display: block;
  }

  .brd-message {
    font-family: 'Caveat', cursive;
    font-size: 26px;
    font-weight: 700;
    color: #3a2e1e;
    text-align: center;
    margin-bottom: 20px;
    line-height: 1.3;
    text-decoration: underline;
    text-decoration-style: wavy;
    text-decoration-color: #c0392b;
    text-underline-offset: 4px;
  }

  @keyframes brd-fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes brd-slideUp {
    from { opacity: 0; transform: translateY(20px) rotate(-0.5deg); }
    to   { opacity: 1; transform: translateY(0) rotate(0deg); }
  }

  @keyframes brd-slideIn {
    from { opacity: 0; transform: translateX(40px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  @keyframes brd-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .brd-zen-bg {
    background: #000;
    flex-direction: row;
    align-items: stretch;
    justify-content: flex-start;
  }

  .brd-zen-slide-wrap {
    position: relative;
    flex: 1;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
  }

  .brd-zen-img,
  .brd-zen-webcam {
    width: 100%;
    height: 100%;
    object-fit: cover;
    animation: brd-zenFade 0.8s ease-in-out;
  }

  .brd-zen-webcam {
    transform: scaleX(-1);
  }

  .brd-zen-caption {
    position: absolute;
    bottom: 24px;
    left: 0;
    right: 0;
    text-align: center;
    font-family: 'Caveat', cursive;
    font-size: 22px;
    font-weight: 700;
    color: rgba(255,255,255,0.95);
    letter-spacing: 0.05em;
    text-shadow: 0 2px 12px rgba(0,0,0,0.9);
    animation: brd-zenFade 0.8s ease-in-out;
    pointer-events: none;
  }

  .brd-zen-card {
    width: 260px;
    flex-shrink: 0;
    background: #fdf8ee;
    border-left: 3px solid #3a2e1e;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 28px 20px;
    gap: 12px;
    pointer-events: all;
    background-image: repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 27px,
      #c8d8e8 27px,
      #c8d8e8 28px
    );
    background-position: 0 20px;
  }

  .brd-zen-header {
    font-family: 'Caveat', cursive;
    font-size: 16px;
    font-weight: 700;
    color: #2e7d32;
    letter-spacing: 0.05em;
    text-align: center;
    text-decoration: underline;
    text-decoration-style: wavy;
    text-decoration-color: #2e7d32;
    text-underline-offset: 3px;
  }

  @keyframes brd-zenFade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  :host(.brd-dark) .brd-fullscreen {
    background: rgba(26, 26, 26, 0.95);
  }

  :host(.brd-dark) .brd-card,
  :host(.brd-dark) .brd-widget {
    background: #2d2d2d;
    border-color: #e8e0d0;
    box-shadow: 3px 3px 0 #000;
  }

  :host(.brd-dark) .brd-card h2,
  :host(.brd-dark) .brd-widget-emoji,
  :host(.brd-dark) .brd-widget-label,
  :host(.brd-dark) .brd-timer,
  :host(.brd-dark) .brd-message {
    color: #e8e0d0;
    text-decoration-color: #e74c3c;
  }

  :host(.brd-dark) .brd-card p,
  :host(.brd-dark) .brd-widget-pack-label {
    color: #a09080;
  }

  :host(.brd-dark) .brd-btn {
    background: #2d2d2d;
    border-color: #e8e0d0;
    color: #e8e0d0;
    box-shadow: 2px 2px 0 #000;
  }

  :host(.brd-dark) .brd-btn-primary {
    background: #3d2850;
    border-color: #a855f7;
    color: #a855f7;
    box-shadow: 2px 2px 0 #a855f7;
  }

  :host(.brd-dark) .brd-btn-success {
    background: #1a3d1a;
    border-color: #4ade80;
    color: #4ade80;
    box-shadow: 2px 2px 0 #4ade80;
  }

  :host(.brd-dark) .brd-btn-danger {
    background: #3d1a1a;
    border-color: #e74c3c;
    color: #e74c3c;
    box-shadow: 2px 2px 0 #e74c3c;
  }

  :host(.brd-dark) .brd-btn-ghost {
    background: #2d2d2d;
    border-color: #505050;
    color: #a09080;
    box-shadow: 2px 2px 0 #505050;
  }

  :host(.brd-dark) .brd-score-based { background: #1a3d1a; color: #4ade80; }
  :host(.brd-dark) .brd-score-medium { background: #3d2a1a; color: #f59e0b; }
  :host(.brd-dark) .brd-score-cooked { background: #3d1a1a; color: #e74c3c; }

  :host(.brd-dark) .brd-pack-bar {
    background: #383838;
    border-color: #505050;
  }

  :host(.brd-dark) .brd-vibe-card {
    background: #2d2d2d;
    border-color: #e8e0d0;
    box-shadow: 2px 2px 0 #000;
  }

  :host(.brd-dark) .brd-vibe-card:hover {
    background: #3d2850;
    border-color: #a855f7;
    box-shadow: 3px 3px 0 #a855f7;
  }

  :host(.brd-dark) .brd-vibe-emoji,
  :host(.brd-dark) .brd-vibe-label {
    color: #a09080;
  }

  :host(.brd-dark) .brd-tip {
    background: #383838;
    border-color: #505050;
    color: #a09080;
  }

  :host(.brd-dark) .brd-zen-card {
    background: #2d2d2d;
    border-left-color: #e8e0d0;
  }

  :host(.brd-dark) .brd-zen-header {
    color: #4ade80;
    text-decoration-color: #4ade80;
  }

  :host(.brd-dark) .brd-video-wrap {
    border-color: #e8e0d0;
    box-shadow: 5px 5px 0 #000;
  }
`;function h(t){return new Promise(s=>{chrome.runtime.sendMessage(t,e=>{chrome.runtime.lastError?s({success:!1,error:chrome.runtime.lastError.message}):s(e??{success:!1,error:"No response"})})})}function he(t,s=1){return t.active?{...t,consumed:t.consumed+s}:t}function be(t,s=Date.now()){return t.active?t.mode==="items"?t.consumed>=t.limit:t.mode==="time"?(s-t.startedAt)/6e4>=t.limit:!1:!1}function pe(t,s=Date.now()){if(!t.active)return{current:0,total:0,percent:0};if(t.mode==="items")return{current:t.consumed,total:t.limit,percent:Math.min(100,Math.round(t.consumed/t.limit*100))};const e=(s-t.startedAt)/6e4,o=Math.max(0,t.limit-e),r=Math.floor(o),i=Math.floor((o-r)*60);return{current:Math.round(e),total:t.limit,percent:Math.min(100,Math.round(e/t.limit*100)),timeRemaining:`${String(r).padStart(2,"0")}:${String(i).padStart(2,"0")}`}}const A="brd:locationchange";class me{constructor(){l(this,"settings");l(this,"session");l(this,"enabled",!1);l(this,"lastSignalAt",0);l(this,"lastActivityAt",0);l(this,"scrollCount",0);l(this,"swipeCount",0);l(this,"maxCookedShown",!1);l(this,"builtDifferentDismissed",!1);l(this,"tickTimer",null);l(this,"cleanupFns",[]);l(this,"velocitySamples",[])}async init(){var s;this.enabled&&this.destroy();try{const e=await h({type:"GET_SETTINGS"});if(!e.success)return;if(this.settings=e.data,!this.settings.masterEnabled||!((s=this.settings.sites[this.site])!=null&&s.enabled)){console.log(`[brainrot detox] Disabled for ${this.site}`);return}const o=await this.getCurrentTabId(),r=await h({type:"GET_SESSION",payload:{tabId:o}});r.data?this.session=r.data:(this.session={site:this.site,tabId:o,startedAt:Date.now(),cookedScore:0,cookedStatus:"Based",lastInterventionAt:0,packState:{...g},touchGrass:{...x},vibeIntent:this.settings.vibeCheck.activeIntent,itemsConsumed:0,scrollEvents:0},await h({type:"UPDATE_SESSION",payload:{tabId:o,patch:this.session}})),this.enabled=!0,this.lastSignalAt=0,this.lastActivityAt=Date.now(),this.velocitySamples=[],await de(this.site),this.mountCookedWidget(),this.setupObservers(),this.scheduleNextTick(),this.session.touchGrass.active&&this.session.touchGrass.endsAt>Date.now()&&this.showTouchGrassOverlay(),console.log(`[brainrot detox] ${this.site} adapter initialized`)}catch(e){console.error(`[brainrot detox] Init error for ${this.site}:`,e)}}destroy(){for(this.enabled=!1,this.tickTimer!==null&&(clearTimeout(this.tickTimer),this.tickTimer=null);this.cleanupFns.length>0;){const s=this.cleanupFns.pop();try{s==null||s()}catch(e){console.warn(`[brainrot detox] Cleanup error for ${this.site}:`,e)}}this.velocitySamples=[],this.removeAllOverlays()}scheduleNextTick(){if(!this.enabled)return;this.tickTimer!==null&&clearTimeout(this.tickTimer);const s=Date.now()-this.lastActivityAt<$?U:V;this.tickTimer=window.setTimeout(async()=>{await this.tick(),this.scheduleNextTick()},s)}recordActivity(s=Date.now()){this.lastActivityAt=s}recordSignalUnits(s,e=Date.now()){s<=0||(this.velocitySamples.push({at:e,units:s}),this.lastSignalAt=e,this.recordActivity(e),this.pruneVelocitySamples(e))}recordSuccessfulNavigation(s=1,e=Date.now()){s<=0||(this.swipeCount+=s,this.recordSignalUnits(s,e))}getVelocityMultiplier(s=Date.now()){this.pruneVelocitySamples(s);const o=this.velocitySamples.reduce((r,i)=>r+i.units,0)/(O/1e3);return Math.min(F,1+W*Math.pow(o,1.5))}addCleanup(s){this.cleanupFns.push(s)}registerEventListener(s,e,o,r){s.addEventListener(e,o,r),this.addCleanup(()=>s.removeEventListener(e,o,r))}registerMutationObserver(s,e,o){const r=new MutationObserver(o);return r.observe(s,e),this.addCleanup(()=>r.disconnect()),r}registerInterval(s,e){const o=window.setInterval(s,e);return this.addCleanup(()=>clearInterval(o)),o}registerRuntimeMessageListener(s){chrome.runtime.onMessage.addListener(s),this.addCleanup(()=>chrome.runtime.onMessage.removeListener(s))}registerLocationChangeListener(s){const e=window;let o=e.__brdLocationChangePatch;if(!o){const r=()=>window.dispatchEvent(new Event(A)),i=history.pushState,n=history.replaceState;history.pushState=function(...a){const c=i.apply(history,a);return r(),c},history.replaceState=function(...a){const c=n.apply(history,a);return r(),c},window.addEventListener("popstate",r),o={refCount:0,popstateListener:r,originalPushState:i,originalReplaceState:n},e.__brdLocationChangePatch=o}o.refCount++,window.addEventListener(A,s),this.addCleanup(()=>{window.removeEventListener(A,s);const r=e.__brdLocationChangePatch;r&&(r.refCount--,!(r.refCount>0)&&(history.pushState=r.originalPushState,history.replaceState=r.originalReplaceState,window.removeEventListener("popstate",r.popstateListener),delete e.__brdLocationChangePatch))})}buildPackDisplay(){if(!this.session.packState.active)return null;const s=pe(this.session.packState);return{label:this.session.packState.mode==="time"&&s.timeRemaining?`[#] Pack: ${s.timeRemaining}`:`[#] Pack: ${s.current}/${s.total}`,percent:s.percent}}renderCookedWidget(s,e){ne({siteKey:this.site,score:s,status:e,pack:this.buildPackDisplay(),onActivate:()=>this.showVibeCheckOverlay()})}getGeneralVelocityUnits(s){return s+this.scrollCount*.25}computeGeneralBurstBonus(s,e){return s<=0?0:Math.max(0,e-1)*Math.min(12,s)*.6}resetMomentum(){this.velocitySamples=[],this.lastSignalAt=0}async tick(){if(!this.enabled)return;const s=Date.now(),e=this.session.cookedScore,o=this.getNewItemsSinceLastTick();this.session.itemsConsumed+=o,this.session.scrollEvents+=this.scrollCount;const r=this.scrollCount>0||o>0||this.swipeCount>0,i=this.lastSignalAt===0?0:s-this.lastSignalAt;if(this.builtDifferentDismissed&&r){this.builtDifferentDismissed=!1,this.scrollCount=0,this.swipeCount=0,this.onBuiltDifferentDenied();return}let n=e;if(this.session.packState.active)n=e;else if(this.site==="shorts"){const a=o*this.getVelocityMultiplier(s);n=J(e,a,this.session.vibeIntent,i)}else{const a=this.getGeneralVelocityUnits(o);a>0&&this.recordSignalUnits(a,s);const c=(s-this.session.startedAt)/6e4,f=K(c,this.settings.cooked.sessionCapMinutes,this.session.scrollEvents,this.session.itemsConsumed),b=this.getVelocityMultiplier(s),w=X(e,f,r,i,this.session.vibeIntent);n=Math.min(100,w+this.computeGeneralBurstBonus(a,b))}this.scrollCount=0,this.swipeCount=0,this.session.cookedScore=n,this.session.cookedStatus=Q(n,this.settings.cooked.thresholds),this.session.packState.active&&(this.session.packState=he(this.session.packState,o),be(this.session.packState,s)&&this.onPackComplete()),this.session.packState.active||(ee(n)?this.maxCookedShown||(this.maxCookedShown=!0,this.onMaxCooked()):(n<95&&(this.maxCookedShown=!1),n>=e&&Z(n,this.session.lastInterventionAt,this.settings.cooked.thresholds,s)&&(this.session.lastInterventionAt=s,this.onIntervention()))),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus),await h({type:"UPDATE_SESSION",payload:{tabId:this.session.tabId,patch:this.session}})}onIntervention(){h({type:"LOG_EVENT",payload:{eventType:"intervention"}}),this.showInterventionOverlay()}onMaxCooked(){this.session.lastInterventionAt=Date.now(),h({type:"LOG_EVENT",payload:{eventType:"intervention"}}),this.showSkyrimOverlay("Your brain is absolutely cooked (x_x)")}onPackComplete(){this.session.packState={...g},this.maxCookedShown=!1,h({type:"END_PACK",payload:{tabId:this.session.tabId}}),this.showSkyrimOverlay("[#] Pack Complete! Time to touch grass."),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus)}onBuiltDifferentDenied(){this.showBuiltDifferentDeniedOverlay()}async startPack(s,e){await h({type:"START_PACK",payload:{tabId:this.session.tabId,mode:s,limit:e}}),this.session.packState={active:!0,mode:s,limit:e,consumed:0,startedAt:Date.now()},this.session.cookedScore=0,this.session.cookedStatus="Based",this.maxCookedShown=!1,this.builtDifferentDismissed=!1,this.resetMomentum(),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus)}async startTouchGrass(s){await h({type:"START_TOUCH_GRASS",payload:{tabId:this.session.tabId,minutes:s}}),this.session.touchGrass={active:!0,endsAt:Date.now()+s*6e4,bypassCount:0},this.showTouchGrassOverlay()}async endTouchGrass(){await h({type:"END_TOUCH_GRASS",payload:{tabId:this.session.tabId}}),this.session.touchGrass={...x},this.session.cookedScore=0,this.session.cookedStatus="Based",this.maxCookedShown=!1,this.resetMomentum(),this.removeAllOverlays(),this.mountCookedWidget()}async bypassTouchGrass(){this.session.touchGrass.bypassCount++,h({type:"LOG_EVENT",payload:{eventType:"bypass"}}),await this.endTouchGrass()}setVibeIntent(s){this.session.vibeIntent=s,h({type:"UPDATE_SESSION",payload:{tabId:this.session.tabId,patch:{vibeIntent:s}}}),h({type:"LOG_EVENT",payload:{eventType:"vibe_check"}})}pruneVelocitySamples(s=Date.now()){this.velocitySamples=this.velocitySamples.filter(e=>s-e.at<=O)}async getCurrentTabId(){return new Promise(s=>{const e=Math.floor(Math.random()*1e6);h({type:"GET_CURRENT_TAB"}).then(o=>{var r;s(((r=o.data)==null?void 0:r.id)??e)})})}}class fe extends me{constructor(){super(...arguments);l(this,"site","youtube");l(this,"itemsSinceLastTick",0);l(this,"lastSeenItems",0);l(this,"handleRuntimeMessage",(e,o,r)=>{var i,n,a;return e.type==="END_TOUCH_GRASS"?(this.session.touchGrass={active:!1,endsAt:0,bypassCount:0},u("skyrim"),u("touchgrass"),r({success:!0}),!1):e.type==="TRIGGER_TOUCH_GRASS"?(this.startTouchGrass(((i=e.payload)==null?void 0:i.minutes)??5),r({success:!0}),!1):e.type==="TRIGGER_PACK"?(this.startPack(((n=e.payload)==null?void 0:n.mode)??"items",((a=e.payload)==null?void 0:a.limit)??10),r({success:!0}),!1):(e.type==="TRIGGER_VIBE_CHECK"&&(this.showVibeCheckOverlay(),r({success:!0})),!1)})}setupObservers(){this.registerEventListener(window,"scroll",()=>{this.scrollCount++,this.recordActivity()},{passive:!0});const e=()=>{const o=document.querySelector("ytd-browse, ytd-search, ytd-watch-flexy, #content")||document.body;this.lastSeenItems=document.querySelectorAll("ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer").length,this.registerMutationObserver(o,{childList:!0,subtree:!0},()=>{const r=document.querySelectorAll("ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer");r.length>this.lastSeenItems&&(this.itemsSinceLastTick+=r.length-this.lastSeenItems,this.lastSeenItems=r.length)})};document.readyState==="complete"?e():this.registerEventListener(window,"load",e,{once:!0}),this.registerEventListener(window,"yt-navigate-finish",()=>{this.lastSeenItems=document.querySelectorAll("ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer").length}),this.registerRuntimeMessageListener(this.handleRuntimeMessage)}getNewItemsSinceLastTick(){const e=this.itemsSinceLastTick;return this.itemsSinceLastTick=0,e}mountCookedWidget(){this.renderCookedWidget(this.session.cookedScore,this.session.cookedStatus)}updateCookedWidget(e,o){this.renderCookedWidget(e,o)}showInterventionOverlay(){var r,i,n;const e=G(this.session.cookedStatus),o=C("intervention",`
            <div class="brd-fullscreen">
                <div class="brd-card">
                    <h2>${e.emoji} ${e.label}!</h2>
                    <p>Your scrolling score hit ${Math.round(this.session.cookedScore)}. Time to make a choice:</p>
                    <div class="brd-btn-row">
                        <button class="brd-btn brd-btn-ghost" data-action="dismiss">Keep Going</button>
                        <button class="brd-btn brd-btn-primary" data-action="pack">Start Pack</button>
                        <button class="brd-btn brd-btn-success" data-action="grass">Touch Grass</button>
                    </div>
                </div>
            </div>
        `);(r=o.querySelector("[data-action='dismiss']"))==null||r.addEventListener("click",()=>u("intervention")),(i=o.querySelector("[data-action='pack']"))==null||i.addEventListener("click",()=>{u("intervention"),this.startPack("items",10)}),(n=o.querySelector("[data-action='grass']"))==null||n.addEventListener("click",()=>{u("intervention"),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)})}showSkyrimOverlay(e){var i,n,a,c;const o=chrome.runtime.getURL("assets/skyrim-skeleton.mp4"),r=C("skyrim",`
            <div class="brd-fullscreen">
                <div class="brd-video-wrap">
                    <video autoplay muted playsinline>
                        <source src="${o}" type="video/mp4" />
                    </video>
                </div>
                <div class="brd-message">${e}</div>
                <div class="brd-btn-row">
                    <button class="brd-btn brd-btn-success" data-action="grass">Touch Grass</button>
                    <button class="brd-btn brd-btn-primary" data-action="pack">Start Pack</button>
                    <button class="brd-btn brd-btn-ghost" data-action="dismiss">I'm Built Different</button>
                </div>
            </div>
        `);(i=r.querySelector("video"))==null||i.play().catch(()=>{}),(n=r.querySelector("[data-action='grass']"))==null||n.addEventListener("click",()=>{u("skyrim"),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)}),(a=r.querySelector("[data-action='pack']"))==null||a.addEventListener("click",()=>{u("skyrim"),this.startPack("items",10)}),(c=r.querySelector("[data-action='dismiss']"))==null||c.addEventListener("click",()=>{u("skyrim"),this.builtDifferentDismissed=!0})}showTouchGrassOverlay(){var c,f;const e=this.session.touchGrass.endsAt,o=q.slice().sort(()=>Math.random()-.5).slice(0,3),r=chrome.runtime.getURL("assets/skyrim-skeleton.mp4"),i=C("touchgrass",`
            <div class="brd-fullscreen">
                <div class="brd-video-wrap">
                    <video autoplay loop muted playsinline>
                        <source src="${r}" type="video/mp4" />
                    </video>
                </div>
                <div class="brd-card">
                    <h2>Touch Grass Mode</h2>
                    <p>Feed locked. Time to go outside.</p>
                    <div class="brd-timer" id="brd-tg-timer">00:00</div>
                    <div class="brd-tips">${o.map(b=>`<div class="brd-tip">${b}</div>`).join("")}</div>
                    <div class="brd-btn-row" style="justify-content:center;">
                        <button class="brd-btn brd-btn-danger" data-action="bypass">Emergency Bypass</button>
                    </div>
                </div>
            </div>
        `),n=i.querySelector("#brd-tg-timer"),a=window.setInterval(()=>{const b=Math.max(0,e-Date.now()),w=Math.floor(b/6e4),d=Math.floor(b%6e4/1e3);n&&(n.textContent=`${String(w).padStart(2,"0")}:${String(d).padStart(2,"0")}`),b<=0&&(clearInterval(a),this.endTouchGrass(),u("touchgrass"))},1e3);this.addCleanup(()=>clearInterval(a)),(c=i.querySelector("[data-action='bypass']"))==null||c.addEventListener("click",()=>{clearInterval(a),this.bypassTouchGrass(),u("touchgrass")}),(f=i.querySelector("video"))==null||f.play().catch(()=>{})}showVibeCheckOverlay(){var r;const e=N.map(i=>`
            <div class="brd-vibe-card" data-vibe="${i.id}">
                <span class="brd-vibe-emoji">${i.emoji}</span>
                <span class="brd-vibe-label">${i.label}</span>
            </div>
        `).join(""),o=C("vibecheck",`
            <div class="brd-fullscreen">
                <div class="brd-card">
                    <h2>Vibe Check</h2>
                    <p>What are you here for?</p>
                    <div class="brd-vibe-grid">${e}</div>
                    <div class="brd-btn-row" style="justify-content:center;">
                        <button class="brd-btn brd-btn-ghost" data-action="skip">Skip</button>
                    </div>
                </div>
            </div>
        `);o.querySelectorAll("[data-vibe]").forEach(i=>{i.addEventListener("click",()=>{this.setVibeIntent(i.dataset.vibe),u("vibecheck")})}),(r=o.querySelector("[data-action='skip']"))==null||r.addEventListener("click",()=>u("vibecheck"))}showBuiltDifferentDeniedOverlay(){var o,r,i;const e=C("denied",`
            <div class="brd-fullscreen">
                <div class="brd-card">
                    <h2 style="font-size:28px;text-align:center;color:#f87171;">No you are not.</h2>
                    <p style="text-align:center;">You thought you could just scroll away? Pick one.</p>
                    <div class="brd-btn-row" style="justify-content:center;">
                        <button class="brd-btn brd-btn-success" data-action="grass">Touch Grass</button>
                        <button class="brd-btn brd-btn-primary" data-action="pack">Start Pack</button>
                        <button class="brd-btn brd-btn-ghost" data-action="vibe">Vibe Check</button>
                    </div>
                </div>
            </div>
        `);(o=e.querySelector("[data-action='grass']"))==null||o.addEventListener("click",()=>{u("denied"),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)}),(r=e.querySelector("[data-action='pack']"))==null||r.addEventListener("click",()=>{u("denied"),this.startPack("items",10)}),(i=e.querySelector("[data-action='vibe']"))==null||i.addEventListener("click",()=>{u("denied"),this.showVibeCheckOverlay()})}removeAllOverlays(){ae()}}console.log("[brainrot detox] YouTube content script loaded"),window.location.pathname.startsWith("/shorts")||new fe().init()})();
