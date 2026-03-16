var Le=Object.defineProperty;var _e=(y,g,C)=>g in y?Le(y,g,{enumerable:!0,configurable:!0,writable:!0,value:C}):y[g]=C;var l=(y,g,C)=>_e(y,typeof g!="symbol"?g+"":g,C);(function(){"use strict";const y={basedMax:35,mediumMax:65,intervention:80,cooldownMs:6e4},g={active:!1,mode:"items",limit:10,consumed:0,startedAt:0},C={active:!1,endsAt:0,bypassCount:0},ee=["[>] Step outside for 2 minutes","[~] Drink a glass of water","[o] Do 5 deep breaths","[!] Do 10 jumping jacks","[*] Look at something 20 feet away for 20 seconds","[♪] Put on your favorite song","[>] Text a friend something nice","[=] Open a window and feel the air"],D={based:{emoji:"( ._.)",label:"Based",hint:"Keep it chill, you're doing great."},medium:{emoji:"(-_-;)",label:"Medium Cooked",hint:"Maybe take a breather soon?"},cooked:{emoji:"(x_x) ",label:"Absolutely Cooked",hint:"Bro. Step away from the screen."}},te=[{id:"Chill",emoji:"~_~",label:"Just Vibing"},{id:"Learn",emoji:"o_O",label:"Learn Something"},{id:"Laugh",emoji:"xD",label:"Get Entertained"},{id:"Music",emoji:"♪♫",label:"Music / Audio"},{id:"JustHere",emoji:"...",label:"I'm Just Here"}],R=.3,se=15e3,ie=500,oe=3e3,re=2e3,V=4e3,ne=.35,ae=3,N={edge:"right",verticalOffset:20},de=1/30;function k(t){return Math.max(0,Math.min(100,t))}function F(t){return t==="Chill"||t==="Laugh"?15e3:t==="Learn"||t==="JustHere"?25e3:2e4}function ce(t,s,e,i){const o=Math.min(1,t/s),r=Math.min(1,e/150),n=Math.min(1,i/60),a=o*35+r*35+n*30;return Math.round(Math.min(100,a))}function le(t,s,e,i,o){const r=o==="Learn"?1.3:o==="JustHere"?1.1:o==="Laugh"?.8:o==="Chill"?.7:1;if(e){const a=s*r,d=t*(1-R)+a*R;return k(d)}if(i<se)return t;const n=i<45e3?1:i<9e4?2:4;return k(t-n)}function he(t,s,e,i){if(s>0)return k(t+s);const o=F(e);return i<o?t:i<6e4?k(t-1):k(t-3)}function H(t,s=y){return t<=s.basedMax?"Based":t<=s.mediumMax?"Medium Cooked":"Absolutely Cooked"}function j(t){return t==="Based"?D.based:t==="Medium Cooked"?D.medium:D.cooked}function B(t,s,e=y,i=Date.now()){return!(t<e.intervention||i-s<e.cooldownMs)}function W(t){return t>=100}function ue(t,s,e,i){if(s>0)return k(t+s);const o=F(e);return i<o?t:i<6e4?k(t-1):k(t-3)}function u(t){return new Promise(s=>{chrome.runtime.sendMessage(t,e=>{chrome.runtime.lastError?s({success:!1,error:chrome.runtime.lastError.message}):s(e??{success:!1,error:"No response"})})})}function q(t,s=1){return t.active?{...t,consumed:t.consumed+s}:t}function U(t,s=Date.now()){return t.active?t.mode==="items"?t.consumed>=t.limit:t.mode==="time"?(s-t.startedAt)/6e4>=t.limit:!1:!1}function pe(t,s=Date.now()){if(!t.active)return{current:0,total:0,percent:0};if(t.mode==="items")return{current:t.consumed,total:t.limit,percent:Math.min(100,Math.round(t.consumed/t.limit*100))};const e=(s-t.startedAt)/6e4,i=Math.max(0,t.limit-e),o=Math.floor(i),r=Math.floor((i-o)*60);return{current:Math.round(e),total:t.limit,percent:Math.min(100,Math.round(e/t.limit*100)),timeRemaining:`${String(o).padStart(2,"0")}:${String(r).padStart(2,"0")}`}}const $="brd_widget_positions";async function be(t,s){return(await chrome.storage.local.get(t))[t]??s}async function fe(t,s){await chrome.storage.local.set({[t]:s})}async function Y(){return be($,{})}async function me(t){return(await Y())[t]??N}async function ge(t,s){const e=await Y();e[t]=s,await fe($,e)}const O="brd-overlay-host",ve=8;let b=null,x={...N},m=null,E=null;function K(){if(b)return b;let t=document.getElementById(O);if(t||(t=document.createElement("div"),t.id=O,t.style.cssText="position:fixed;top:0;left:0;width:0;height:0;z-index:2147483647;pointer-events:none;",document.documentElement.appendChild(t)),t.shadowRoot)return b=t.shadowRoot,X(),b;b=t.attachShadow({mode:"open"});const s=document.createElement("style");s.textContent=Ce,b.appendChild(s);const e=document.createElement("link");return e.rel="stylesheet",e.href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap",b.appendChild(e),X(),b}function M(t,s){const e=K(),i=e.querySelector(`[data-overlay="${t}"]`);i&&i.remove();const o=document.createElement("div");return o.setAttribute("data-overlay",t),o.innerHTML=s,e.appendChild(o),o}function ye(t){const s=K();E=t.onActivate??null;let e=s.querySelector('[data-overlay="widget"]');if(!e){e=document.createElement("div"),e.setAttribute("data-overlay","widget"),e.innerHTML=`
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
    `,s.appendChild(e);const i=e.querySelector(".brd-widget");i&&(m==null||m(),m=Se(i,t.siteKey))}return we(e,t),A(),e}function p(t){const s=b;if(!s)return;const e=s.querySelector(`[data-overlay="${t}"]`);e&&(t==="widget"&&(m==null||m(),m=null,E=null),e.remove())}function ke(){const t=b;t&&(m==null||m(),m=null,E=null,t.querySelectorAll("[data-overlay]").forEach(s=>s.remove()))}async function xe(t){x=await me(t),A()}async function X(){var i;const t=await chrome.runtime.sendMessage({type:"GET_SETTINGS"}),s=t!=null&&t.success&&((i=t.data)!=null&&i.theme)?t.data.theme:"light",e=document.getElementById(O);e&&(s==="dark"?e.classList.add("brd-dark"):e.classList.remove("brd-dark"))}function we(t,s){const e=t.querySelector(".brd-widget");if(!e)return;e.dataset.score=s.score.toFixed(3),e.dataset.status=s.status;const i=j(s.status),o=s.status==="Based"?"brd-score-based":s.status==="Medium Cooked"?"brd-score-medium":"brd-score-cooked",r=e.querySelector(".brd-widget-emoji"),n=e.querySelector(".brd-widget-label"),a=e.querySelector(".brd-widget-score"),d=e.querySelector(".brd-widget-pack"),f=e.querySelector(".brd-widget-pack-label"),h=e.querySelector(".brd-pack-fill");r&&(r.textContent=i.emoji),n&&(n.textContent=i.label),a&&(a.textContent=String(Math.round(s.score)),a.className=`brd-widget-score ${o}`),d&&f&&h&&(s.pack?(d.hidden=!1,f.textContent=s.pack.label,h.style.width=`${Math.max(0,Math.min(100,s.pack.percent))}%`):(d.hidden=!0,f.textContent="",h.style.width="0%"))}function A(){const t=b==null?void 0:b.querySelector(".brd-widget");t&&(t.style.left=x.edge==="left"?"0px":"auto",t.style.right=x.edge==="right"?"0px":"auto",t.style.bottom=`${P(x.verticalOffset,t)}px`)}function Se(t,s){let e=null,i=!1,o=0,r=0,n=0;const a=()=>{e=null,i=!1,t.style.cursor="grab",t.style.transition="all 0.2s ease"},d=c=>{c.pointerType==="mouse"&&c.button!==0||c.target.closest("button, input, a")||(e=c.pointerId,i=!1,o=c.clientX,r=c.clientY,n=window.innerHeight-t.getBoundingClientRect().bottom,t.style.cursor="grabbing",t.style.transition="none",t.setPointerCapture(c.pointerId),c.preventDefault())},f=c=>{if(e!==c.pointerId)return;const T=c.clientX-o,S=r-c.clientY;if(!i&&Math.hypot(T,S)>=ve&&(i=!0),!i)return;const L=P(n+S,t);t.style.left=x.edge==="left"?"0px":"auto",t.style.right=x.edge==="right"?"0px":"auto",t.style.bottom=`${L}px`},h=async c=>{if(e!==c.pointerId)return;const T=i;if(t.hasPointerCapture(c.pointerId)&&t.releasePointerCapture(c.pointerId),T){const S=t.getBoundingClientRect();x={edge:c.clientX<window.innerWidth/2?"left":"right",verticalOffset:P(window.innerHeight-S.bottom,t)},A(),await ge(s,x)}else E==null||E();a()},w=c=>{e===c.pointerId&&(t.hasPointerCapture(c.pointerId)&&t.releasePointerCapture(c.pointerId),A(),a())};return t.addEventListener("pointerdown",d),t.addEventListener("pointermove",f),t.addEventListener("pointerup",h),t.addEventListener("pointercancel",w),t.style.cursor="grab",()=>{t.removeEventListener("pointerdown",d),t.removeEventListener("pointermove",f),t.removeEventListener("pointerup",h),t.removeEventListener("pointercancel",w)}}function P(t,s){const e=Math.max(0,window.innerHeight-s.getBoundingClientRect().height-8);return Math.max(0,Math.min(t,e))}const Ce=`
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
`,G="brd:locationchange";class Te{constructor(){l(this,"settings");l(this,"session");l(this,"enabled",!1);l(this,"lastSignalAt",0);l(this,"lastActivityAt",0);l(this,"scrollCount",0);l(this,"swipeCount",0);l(this,"maxCookedShown",!1);l(this,"builtDifferentDismissed",!1);l(this,"tickTimer",null);l(this,"cleanupFns",[]);l(this,"velocitySamples",[])}async init(){var s;this.enabled&&this.destroy();try{const e=await u({type:"GET_SETTINGS"});if(!e.success)return;if(this.settings=e.data,!this.settings.masterEnabled||!((s=this.settings.sites[this.site])!=null&&s.enabled)){console.log(`[brainrot detox] Disabled for ${this.site}`);return}const i=await this.getCurrentTabId(),o=await u({type:"GET_SESSION",payload:{tabId:i}});o.data?this.session=o.data:(this.session={site:this.site,tabId:i,startedAt:Date.now(),cookedScore:0,cookedStatus:"Based",lastInterventionAt:0,packState:{...g},touchGrass:{...C},vibeIntent:this.settings.vibeCheck.activeIntent,itemsConsumed:0,scrollEvents:0},await u({type:"UPDATE_SESSION",payload:{tabId:i,patch:this.session}})),this.enabled=!0,this.lastSignalAt=0,this.lastActivityAt=Date.now(),this.velocitySamples=[],await xe(this.site),this.mountCookedWidget(),this.setupObservers(),this.scheduleNextTick(),this.session.touchGrass.active&&this.session.touchGrass.endsAt>Date.now()&&this.showTouchGrassOverlay(),console.log(`[brainrot detox] ${this.site} adapter initialized`)}catch(e){console.error(`[brainrot detox] Init error for ${this.site}:`,e)}}destroy(){for(this.enabled=!1,this.tickTimer!==null&&(clearTimeout(this.tickTimer),this.tickTimer=null);this.cleanupFns.length>0;){const s=this.cleanupFns.pop();try{s==null||s()}catch(e){console.warn(`[brainrot detox] Cleanup error for ${this.site}:`,e)}}this.velocitySamples=[],this.removeAllOverlays()}scheduleNextTick(){if(!this.enabled)return;this.tickTimer!==null&&clearTimeout(this.tickTimer);const s=Date.now()-this.lastActivityAt<re?ie:oe;this.tickTimer=window.setTimeout(async()=>{await this.tick(),this.scheduleNextTick()},s)}recordActivity(s=Date.now()){this.lastActivityAt=s}recordSignalUnits(s,e=Date.now()){s<=0||(this.velocitySamples.push({at:e,units:s}),this.lastSignalAt=e,this.recordActivity(e),this.pruneVelocitySamples(e))}recordSuccessfulNavigation(s=1,e=Date.now()){s<=0||(this.swipeCount+=s,this.recordSignalUnits(s,e))}getVelocityMultiplier(s=Date.now()){this.pruneVelocitySamples(s);const i=this.velocitySamples.reduce((o,r)=>o+r.units,0)/(V/1e3);return Math.min(ae,1+ne*Math.pow(i,1.5))}addCleanup(s){this.cleanupFns.push(s)}registerEventListener(s,e,i,o){s.addEventListener(e,i,o),this.addCleanup(()=>s.removeEventListener(e,i,o))}registerMutationObserver(s,e,i){const o=new MutationObserver(i);return o.observe(s,e),this.addCleanup(()=>o.disconnect()),o}registerInterval(s,e){const i=window.setInterval(s,e);return this.addCleanup(()=>clearInterval(i)),i}registerRuntimeMessageListener(s){chrome.runtime.onMessage.addListener(s),this.addCleanup(()=>chrome.runtime.onMessage.removeListener(s))}registerLocationChangeListener(s){const e=window;let i=e.__brdLocationChangePatch;if(!i){const o=()=>window.dispatchEvent(new Event(G)),r=history.pushState,n=history.replaceState;history.pushState=function(...a){const d=r.apply(history,a);return o(),d},history.replaceState=function(...a){const d=n.apply(history,a);return o(),d},window.addEventListener("popstate",o),i={refCount:0,popstateListener:o,originalPushState:r,originalReplaceState:n},e.__brdLocationChangePatch=i}i.refCount++,window.addEventListener(G,s),this.addCleanup(()=>{window.removeEventListener(G,s);const o=e.__brdLocationChangePatch;o&&(o.refCount--,!(o.refCount>0)&&(history.pushState=o.originalPushState,history.replaceState=o.originalReplaceState,window.removeEventListener("popstate",o.popstateListener),delete e.__brdLocationChangePatch))})}buildPackDisplay(){if(!this.session.packState.active)return null;const s=pe(this.session.packState);return{label:this.session.packState.mode==="time"&&s.timeRemaining?`[#] Pack: ${s.timeRemaining}`:`[#] Pack: ${s.current}/${s.total}`,percent:s.percent}}renderCookedWidget(s,e){ye({siteKey:this.site,score:s,status:e,pack:this.buildPackDisplay(),onActivate:()=>this.showVibeCheckOverlay()})}getGeneralVelocityUnits(s){return s+this.scrollCount*.25}computeGeneralBurstBonus(s,e){return s<=0?0:Math.max(0,e-1)*Math.min(12,s)*.6}resetMomentum(){this.velocitySamples=[],this.lastSignalAt=0}async tick(){if(!this.enabled)return;const s=Date.now(),e=this.session.cookedScore,i=this.getNewItemsSinceLastTick();this.session.itemsConsumed+=i,this.session.scrollEvents+=this.scrollCount;const o=this.scrollCount>0||i>0||this.swipeCount>0,r=this.lastSignalAt===0?0:s-this.lastSignalAt;if(this.builtDifferentDismissed&&o){this.builtDifferentDismissed=!1,this.scrollCount=0,this.swipeCount=0,this.onBuiltDifferentDenied();return}let n=e;if(this.session.packState.active)n=e;else if(this.site==="shorts"){const a=i*this.getVelocityMultiplier(s);n=he(e,a,this.session.vibeIntent,r)}else{const a=this.getGeneralVelocityUnits(i);a>0&&this.recordSignalUnits(a,s);const d=(s-this.session.startedAt)/6e4,f=ce(d,this.settings.cooked.sessionCapMinutes,this.session.scrollEvents,this.session.itemsConsumed),h=this.getVelocityMultiplier(s),w=le(e,f,o,r,this.session.vibeIntent);n=Math.min(100,w+this.computeGeneralBurstBonus(a,h))}this.scrollCount=0,this.swipeCount=0,this.session.cookedScore=n,this.session.cookedStatus=H(n,this.settings.cooked.thresholds),this.session.packState.active&&(this.session.packState=q(this.session.packState,i),U(this.session.packState,s)&&this.onPackComplete()),this.session.packState.active||(W(n)?this.maxCookedShown||(this.maxCookedShown=!0,this.onMaxCooked()):(n<95&&(this.maxCookedShown=!1),n>=e&&B(n,this.session.lastInterventionAt,this.settings.cooked.thresholds,s)&&(this.session.lastInterventionAt=s,this.onIntervention()))),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus),await u({type:"UPDATE_SESSION",payload:{tabId:this.session.tabId,patch:this.session}})}onIntervention(){u({type:"LOG_EVENT",payload:{eventType:"intervention"}}),this.showInterventionOverlay()}onMaxCooked(){this.session.lastInterventionAt=Date.now(),u({type:"LOG_EVENT",payload:{eventType:"intervention"}}),this.showSkyrimOverlay("Your brain is absolutely cooked (x_x)")}onPackComplete(){this.session.packState={...g},this.maxCookedShown=!1,u({type:"END_PACK",payload:{tabId:this.session.tabId}}),this.showSkyrimOverlay("[#] Pack Complete! Time to touch grass."),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus)}onBuiltDifferentDenied(){this.showBuiltDifferentDeniedOverlay()}async startPack(s,e){await u({type:"START_PACK",payload:{tabId:this.session.tabId,mode:s,limit:e}}),this.session.packState={active:!0,mode:s,limit:e,consumed:0,startedAt:Date.now()},this.session.cookedScore=0,this.session.cookedStatus="Based",this.maxCookedShown=!1,this.builtDifferentDismissed=!1,this.resetMomentum(),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus)}async startTouchGrass(s){await u({type:"START_TOUCH_GRASS",payload:{tabId:this.session.tabId,minutes:s}}),this.session.touchGrass={active:!0,endsAt:Date.now()+s*6e4,bypassCount:0},this.showTouchGrassOverlay()}async endTouchGrass(){await u({type:"END_TOUCH_GRASS",payload:{tabId:this.session.tabId}}),this.session.touchGrass={...C},this.session.cookedScore=0,this.session.cookedStatus="Based",this.maxCookedShown=!1,this.resetMomentum(),this.removeAllOverlays(),this.mountCookedWidget()}async bypassTouchGrass(){this.session.touchGrass.bypassCount++,u({type:"LOG_EVENT",payload:{eventType:"bypass"}}),await this.endTouchGrass()}setVibeIntent(s){this.session.vibeIntent=s,u({type:"UPDATE_SESSION",payload:{tabId:this.session.tabId,patch:{vibeIntent:s}}}),u({type:"LOG_EVENT",payload:{eventType:"vibe_check"}})}pruneVelocitySamples(s=Date.now()){this.velocitySamples=this.velocitySamples.filter(e=>s-e.at<=V)}async getCurrentTabId(){return new Promise(s=>{const e=Math.floor(Math.random()*1e6);u({type:"GET_CURRENT_TAB"}).then(i=>{var o;s(((o=i.data)==null?void 0:o.id)??e)})})}}class Ee extends Te{constructor(){super(...arguments);l(this,"site","tiktok");l(this,"itemsSinceLastTick",0);l(this,"watchTimeSinceLastTick",0);l(this,"lastActiveVideoFingerprint","");l(this,"nodeIds",new WeakMap);l(this,"nextNodeId",1);l(this,"handleRuntimeMessage",(e,i,o)=>{var r,n,a;return e.type==="END_TOUCH_GRASS"?(this.session.touchGrass={active:!1,endsAt:0,bypassCount:0},p("skyrim"),p("touchgrass"),this.thawFeed(),o({success:!0}),!1):e.type==="TRIGGER_TOUCH_GRASS"?(this.startTouchGrass(((r=e.payload)==null?void 0:r.minutes)??5),o({success:!0}),!1):e.type==="TRIGGER_PACK"?(this.startPack(((n=e.payload)==null?void 0:n.mode)??"items",((a=e.payload)==null?void 0:a.limit)??10),o({success:!0}),!1):(e.type==="TRIGGER_VIBE_CHECK"&&(this.showVibeCheckOverlay(),o({success:!0})),!1)})}getActiveTikTokVideo(){const e=Array.from(document.querySelectorAll("video"));return e.find(i=>this.isVideoMostlyInViewport(i))??e[0]??null}getNodeId(e){const i=this.nodeIds.get(e);if(i)return i;const o=this.nextNodeId++;return this.nodeIds.set(e,o),o}getVideoFingerprint(e){return`${this.getNodeId(e)}:${e.currentSrc||e.src||e.poster||"no-src"}`}freezeFeed(){const e=this.getActiveTikTokVideo();e&&!e.paused&&e.pause()}thawFeed(){const e=this.getActiveTikTokVideo();e&&e.paused&&e.play().catch(()=>{})}setupObservers(){this.registerEventListener(window,"wheel",r=>{Math.abs(r.deltaY)>20&&(this.scrollCount++,this.recordActivity())},{passive:!0}),this.registerEventListener(window,"keydown",r=>{const n=r;(n.key==="ArrowDown"||n.key==="j")&&(this.scrollCount++,this.recordActivity())},{passive:!0});let e=0;this.registerEventListener(window,"touchstart",r=>{var n;e=((n=r.touches[0])==null?void 0:n.clientY)??0},{passive:!0}),this.registerEventListener(window,"touchend",r=>{var a;const n=e-(((a=r.changedTouches[0])==null?void 0:a.clientY)??0);Math.abs(n)>50&&(this.scrollCount++,this.recordActivity())},{passive:!0});const i=()=>{const r=this.getActiveTikTokVideo();if(!r)return;const n=this.getVideoFingerprint(r);if(!this.lastActiveVideoFingerprint){this.lastActiveVideoFingerprint=n;return}n!==this.lastActiveVideoFingerprint&&(this.lastActiveVideoFingerprint=n,this.itemsSinceLastTick++,this.recordSuccessfulNavigation())};this.registerInterval(i,250),this.registerInterval(()=>{const r=this.getActiveTikTokVideo();r&&!r.paused&&this.isVideoMostlyInViewport(r)&&(this.watchTimeSinceLastTick+=100)},100);const o=()=>{const r=document.querySelector("[data-e2e='recommend-list-item-container']")??document.querySelector(".tiktok-web-player")??document.body;this.registerMutationObserver(r,{childList:!0,subtree:!0},()=>i())};document.readyState==="complete"?o():this.registerEventListener(window,"load",o,{once:!0}),this.registerRuntimeMessageListener(this.handleRuntimeMessage)}getNewItemsSinceLastTick(){const e=this.itemsSinceLastTick;return this.itemsSinceLastTick=0,e}async tick(){if(!this.enabled)return;const e=Date.now(),i=this.session.cookedScore,o=this.getNewItemsSinceLastTick(),r=this.watchTimeSinceLastTick;this.watchTimeSinceLastTick=0,this.session.itemsConsumed+=o,this.session.scrollEvents+=this.scrollCount;const n=this.scrollCount>0||o>0||this.swipeCount>0||r>0,a=this.lastSignalAt===0?0:e-this.lastSignalAt;if(this.builtDifferentDismissed&&n){this.builtDifferentDismissed=!1,this.scrollCount=0,this.swipeCount=0,this.onBuiltDifferentDenied();return}let d=i;if(!this.session.packState.active){const h=(o+r/1e3*de)*this.getVelocityMultiplier(e);d=ue(i,h,this.session.vibeIntent,a)}this.scrollCount=0,this.swipeCount=0,this.session.cookedScore=d,this.session.cookedStatus=H(d,this.settings.cooked.thresholds),this.session.packState.active&&(this.session.packState=q(this.session.packState,o),U(this.session.packState,e)&&this.onPackComplete()),this.session.packState.active||(W(d)?this.maxCookedShown||(this.maxCookedShown=!0,this.onMaxCooked()):(d<95&&(this.maxCookedShown=!1),d>=i&&B(d,this.session.lastInterventionAt,this.settings.cooked.thresholds,e)&&(this.session.lastInterventionAt=e,this.onIntervention()))),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus),await u({type:"UPDATE_SESSION",payload:{tabId:this.session.tabId,patch:this.session}})}mountCookedWidget(){this.renderCookedWidget(this.session.cookedScore,this.session.cookedStatus)}updateCookedWidget(e,i){this.renderCookedWidget(e,i)}showInterventionOverlay(){var o,r,n;const e=j(this.session.cookedStatus),i=M("intervention",`
            <div class="brd-fullscreen">
                <div class="brd-card">
                    <h2>${e.emoji} ${e.label}!</h2>
                    <p>Your scrolling score just hit ${Math.round(this.session.cookedScore)}. Your brain is getting crispy. Time to make a choice:</p>
                    <div class="brd-btn-row">
                        <button class="brd-btn brd-btn-ghost" data-action="dismiss">Keep Going</button>
                        <button class="brd-btn brd-btn-primary" data-action="pack">Start Pack</button>
                        <button class="brd-btn brd-btn-success" data-action="grass">Touch Grass</button>
                    </div>
                </div>
            </div>
        `);(o=i.querySelector("[data-action='dismiss']"))==null||o.addEventListener("click",()=>p("intervention")),(r=i.querySelector("[data-action='pack']"))==null||r.addEventListener("click",()=>{p("intervention"),this.startPack("items",10)}),(n=i.querySelector("[data-action='grass']"))==null||n.addEventListener("click",()=>{p("intervention"),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)})}showBuiltDifferentDeniedOverlay(){var i,o,r;this.freezeFeed();const e=M("denied",`
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
        `);(i=e.querySelector("[data-action='grass']"))==null||i.addEventListener("click",()=>{p("denied"),this.thawFeed(),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)}),(o=e.querySelector("[data-action='pack']"))==null||o.addEventListener("click",()=>{p("denied"),this.thawFeed(),this.startPack("items",10)}),(r=e.querySelector("[data-action='vibe']"))==null||r.addEventListener("click",()=>{p("denied"),this.thawFeed(),this.showVibeCheckOverlay()})}showSkyrimOverlay(e){var n,a,d;const i=chrome.runtime.getURL("assets/skyrim-skeleton.mp4");this.freezeFeed();const o=M("skyrim",`
            <div class="brd-fullscreen">
                <div class="brd-video-wrap"><video playsinline></video></div>
                <div class="brd-message">${e}</div>
                <div class="brd-btn-row">
                    <button class="brd-btn brd-btn-success" data-action="grass">Touch Grass</button>
                    <button class="brd-btn brd-btn-primary" data-action="pack">Start Pack</button>
                    <button class="brd-btn brd-btn-ghost" data-action="dismiss">I'm Built Different</button>
                </div>
            </div>
        `),r=o.querySelector("video");r&&(r.src=i,r.load(),r.play().catch(()=>{})),(n=o.querySelector("[data-action='grass']"))==null||n.addEventListener("click",()=>{p("skyrim"),this.thawFeed(),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)}),(a=o.querySelector("[data-action='pack']"))==null||a.addEventListener("click",()=>{p("skyrim"),this.thawFeed(),this.startPack("items",10)}),(d=o.querySelector("[data-action='dismiss']"))==null||d.addEventListener("click",()=>{p("skyrim"),this.thawFeed(),this.builtDifferentDismissed=!0})}showTouchGrassOverlay(){var Z;const e=this.session.touchGrass.endsAt,i=ee.slice().sort(()=>Math.random()-.5).slice(0,3);this.freezeFeed();const r=[...["https://cataas.com/cat?width=900&height=700&t=1","https://cataas.com/cat?width=900&height=700&t=2","https://cataas.com/cat?width=900&height=700&t=3","https://cataas.com/cat?width=900&height=700&t=4","WEBCAM","https://cataas.com/cat?width=900&height=700&t=5","https://cataas.com/cat?width=900&height=700&t=6"]].sort(()=>Math.random()-.5),n=M("touchgrass",`
            <div class="brd-fullscreen brd-zen-bg">
                <div class="brd-zen-slide-wrap">
                    <img class="brd-zen-img" src="" alt="zen" />
                    <video class="brd-zen-webcam" autoplay muted playsinline style="display:none;"></video>
                    <div class="brd-zen-caption"></div>
                </div>
                <div class="brd-zen-card">
                    <div class="brd-zen-header">Touch Grass Mode</div>
                    <div class="brd-timer" id="brd-tg-timer">00:00</div>
                    <div class="brd-tips">${i.map(v=>`<div class="brd-tip">${v}</div>`).join("")}</div>
                    <div class="brd-btn-row" style="justify-content:center;">
                        <button class="brd-btn brd-btn-danger" data-action="bypass">Emergency Bypass</button>
                    </div>
                </div>
            </div>
        `),a=n.querySelector(".brd-zen-img"),d=n.querySelector(".brd-zen-webcam"),f=n.querySelector(".brd-zen-caption");let h=null,w=0;const c=["breathe.","you are here.","it's okay.","look at this.","touch grass.","be present.","slow down.","this is real life."],T=async v=>{const _=r[v%r.length];if(_==="WEBCAM"){if(a.style.display="none",d.style.display="block",f.textContent="hi. this is you.",!h)try{h=await navigator.mediaDevices.getUserMedia({video:!0,audio:!1}),d.srcObject=h}catch{await T(v+1)}return}d.style.display="none",a.style.display="block",a.src=_,f.textContent=c[Math.floor(Math.random()*c.length)]};T(w);const S=window.setInterval(()=>{w++,T(w)},4e3),L=n.querySelector("#brd-tg-timer"),z=window.setInterval(()=>{const v=Math.max(0,e-Date.now()),_=Math.floor(v/6e4),Me=Math.floor(v%6e4/1e3);L&&(L.textContent=`${String(_).padStart(2,"0")}:${String(Me).padStart(2,"0")}`),v<=0&&(clearInterval(z),clearInterval(S),h&&h.getTracks().forEach(Ae=>Ae.stop()),this.endTouchGrass(),this.thawFeed(),p("touchgrass"))},1e3);this.addCleanup(()=>clearInterval(S)),this.addCleanup(()=>clearInterval(z)),(Z=n.querySelector("[data-action='bypass']"))==null||Z.addEventListener("click",()=>{clearInterval(z),clearInterval(S),h&&h.getTracks().forEach(v=>v.stop()),this.bypassTouchGrass(),this.thawFeed(),p("touchgrass")})}showVibeCheckOverlay(){var o;const e=te.map(r=>`
            <div class="brd-vibe-card" data-vibe="${r.id}">
                <span class="brd-vibe-emoji">${r.emoji}</span>
                <span class="brd-vibe-label">${r.label}</span>
            </div>
        `).join(""),i=M("vibecheck",`
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
        `);i.querySelectorAll("[data-vibe]").forEach(r=>{r.addEventListener("click",()=>{this.setVibeIntent(r.dataset.vibe),p("vibecheck")})}),(o=i.querySelector("[data-action='skip']"))==null||o.addEventListener("click",()=>p("vibecheck"))}removeAllOverlays(){ke(),this.thawFeed()}isVideoMostlyInViewport(e){const i=e.getBoundingClientRect(),o=Math.min(i.bottom,window.innerHeight)-Math.max(i.top,0),r=Math.min(i.right,window.innerWidth)-Math.max(i.left,0);return o>i.height*.6&&r>i.width*.6}}console.log("[brainrot detox] TikTok content script loaded");let I=null,J=location.href;function Ie(){return location.pathname==="/"||location.pathname.startsWith("/foryou")||location.pathname.startsWith("/following")||location.pathname.includes("/video/")}function Q(){if(Ie()){I||(I=new Ee,I.init());return}I&&(I.destroy(),I=null)}Q(),new MutationObserver(()=>{location.href!==J&&(J=location.href,Q())}).observe(document.body,{subtree:!0,childList:!0})})();
