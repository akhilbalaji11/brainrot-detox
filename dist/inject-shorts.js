var Ae=Object.defineProperty;var Le=(x,y,T)=>y in x?Ae(x,y,{enumerable:!0,configurable:!0,writable:!0,value:T}):x[y]=T;var h=(x,y,T)=>Le(x,typeof y!="symbol"?y+"":y,T);(function(){"use strict";const x={basedMax:35,mediumMax:65,intervention:80,cooldownMs:6e4},y={active:!1,mode:"items",limit:10,consumed:0,startedAt:0},T={active:!1,endsAt:0,bypassCount:0},Z=["[>] Step outside for 2 minutes","[~] Drink a glass of water","[o] Do 5 deep breaths","[!] Do 10 jumping jacks","[*] Look at something 20 feet away for 20 seconds","[♪] Put on your favorite song","[>] Text a friend something nice","[=] Open a window and feel the air"],P={based:{emoji:"( ._.)",label:"Based",hint:"Keep it chill, you're doing great."},medium:{emoji:"(-_-;)",label:"Medium Cooked",hint:"Maybe take a breather soon?"},cooked:{emoji:"(x_x) ",label:"Absolutely Cooked",hint:"Bro. Step away from the screen."}},Q=[{id:"Chill",emoji:"~_~",label:"Just Vibing"},{id:"Learn",emoji:"o_O",label:"Learn Something"},{id:"Laugh",emoji:"xD",label:"Get Entertained"},{id:"Music",emoji:"♪♫",label:"Music / Audio"},{id:"JustHere",emoji:"...",label:"I'm Just Here"}],B=.3,ee=15e3,te=500,se=3e3,ie=2e3,N=4e3,oe=.35,re=3,W={edge:"right",verticalOffset:20};function A(t){return Math.max(0,Math.min(100,t))}function ae(t){return t==="Chill"||t==="Laugh"?15e3:t==="Learn"||t==="JustHere"?25e3:2e4}function ne(t,s,e,i){const o=Math.min(1,t/s),r=Math.min(1,e/150),a=Math.min(1,i/60),n=o*35+r*35+a*30;return Math.round(Math.min(100,n))}function de(t,s,e,i,o){const r=o==="Learn"?1.3:o==="JustHere"?1.1:o==="Laugh"?.8:o==="Chill"?.7:1;if(e){const n=s*r,c=t*(1-B)+n*B;return A(c)}if(i<ee)return t;const a=i<45e3?1:i<9e4?2:4;return A(t-a)}function ce(t,s,e,i){if(s>0)return A(t+s);const o=ae(e);return i<o?t:i<6e4?A(t-1):A(t-3)}function le(t,s=x){return t<=s.basedMax?"Based":t<=s.mediumMax?"Medium Cooked":"Absolutely Cooked"}function F(t){return t==="Based"?P.based:t==="Medium Cooked"?P.medium:P.cooked}function he(t,s,e=x,i=Date.now()){return!(t<e.intervention||i-s<e.cooldownMs)}function ue(t){return t>=100}const U="brd_widget_positions";async function be(t,s){return(await chrome.storage.local.get(t))[t]??s}async function pe(t,s){await chrome.storage.local.set({[t]:s})}async function $(){return be(U,{})}async function me(t){return(await $())[t]??W}async function fe(t,s){const e=await $();e[t]=s,await pe(U,e)}const G="brd-overlay-host",ge=8;let m=null,w={...W},f=null,I=null;function Y(){if(m)return m;let t=document.getElementById(G);if(t||(t=document.createElement("div"),t.id=G,t.style.cssText="position:fixed;top:0;left:0;width:0;height:0;z-index:2147483647;pointer-events:none;",document.documentElement.appendChild(t)),t.shadowRoot)return m=t.shadowRoot,K(),m;m=t.attachShadow({mode:"open"});const s=document.createElement("style");s.textContent=Se,m.appendChild(s);const e=document.createElement("link");return e.rel="stylesheet",e.href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap",m.appendChild(e),K(),m}function L(t,s){const e=Y(),i=e.querySelector(`[data-overlay="${t}"]`);i&&i.remove();const o=document.createElement("div");return o.setAttribute("data-overlay",t),o.innerHTML=s,e.appendChild(o),o}function ve(t){const s=Y();I=t.onActivate??null;let e=s.querySelector('[data-overlay="widget"]');if(!e){e=document.createElement("div"),e.setAttribute("data-overlay","widget"),e.innerHTML=`
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
    `,s.appendChild(e);const i=e.querySelector(".brd-widget");i&&(f==null||f(),f=ke(i,t.siteKey))}return we(e,t),_(),e}function u(t){const s=m;if(!s)return;const e=s.querySelector(`[data-overlay="${t}"]`);e&&(t==="widget"&&(f==null||f(),f=null,I=null),e.remove())}function ye(){const t=m;t&&(f==null||f(),f=null,I=null,t.querySelectorAll("[data-overlay]").forEach(s=>s.remove()))}async function xe(t){w=await me(t),_()}async function K(){var i;const t=await chrome.runtime.sendMessage({type:"GET_SETTINGS"}),s=t!=null&&t.success&&((i=t.data)!=null&&i.theme)?t.data.theme:"light",e=document.getElementById(G);e&&(s==="dark"?e.classList.add("brd-dark"):e.classList.remove("brd-dark"))}function we(t,s){const e=t.querySelector(".brd-widget");if(!e)return;const i=F(s.status),o=s.status==="Based"?"brd-score-based":s.status==="Medium Cooked"?"brd-score-medium":"brd-score-cooked",r=e.querySelector(".brd-widget-emoji"),a=e.querySelector(".brd-widget-label"),n=e.querySelector(".brd-widget-score"),c=e.querySelector(".brd-widget-pack"),g=e.querySelector(".brd-widget-pack-label"),p=e.querySelector(".brd-pack-fill");r&&(r.textContent=i.emoji),a&&(a.textContent=i.label),n&&(n.textContent=String(Math.round(s.score)),n.className=`brd-widget-score ${o}`),c&&g&&p&&(s.pack?(c.hidden=!1,g.textContent=s.pack.label,p.style.width=`${Math.max(0,Math.min(100,s.pack.percent))}%`):(c.hidden=!0,g.textContent="",p.style.width="0%"))}function _(){const t=m==null?void 0:m.querySelector(".brd-widget");t&&(t.style.left=w.edge==="left"?"0px":"auto",t.style.right=w.edge==="right"?"0px":"auto",t.style.bottom=`${z(w.verticalOffset,t)}px`)}function ke(t,s){let e=null,i=!1,o=0,r=0,a=0;const n=()=>{e=null,i=!1,t.style.cursor="grab",t.style.transition="all 0.2s ease"},c=d=>{d.pointerType==="mouse"&&d.button!==0||d.target.closest("button, input, a")||(e=d.pointerId,i=!1,o=d.clientX,r=d.clientY,a=window.innerHeight-t.getBoundingClientRect().bottom,t.style.cursor="grabbing",t.style.transition="none",t.setPointerCapture(d.pointerId),d.preventDefault())},g=d=>{if(e!==d.pointerId)return;const E=d.clientX-o,S=r-d.clientY;if(!i&&Math.hypot(E,S)>=ge&&(i=!0),!i)return;const l=z(a+S,t);t.style.left=w.edge==="left"?"0px":"auto",t.style.right=w.edge==="right"?"0px":"auto",t.style.bottom=`${l}px`},p=async d=>{if(e!==d.pointerId)return;const E=i;if(t.hasPointerCapture(d.pointerId)&&t.releasePointerCapture(d.pointerId),E){const S=t.getBoundingClientRect();w={edge:d.clientX<window.innerWidth/2?"left":"right",verticalOffset:z(window.innerHeight-S.bottom,t)},_(),await fe(s,w)}else I==null||I();n()},k=d=>{e===d.pointerId&&(t.hasPointerCapture(d.pointerId)&&t.releasePointerCapture(d.pointerId),_(),n())};return t.addEventListener("pointerdown",c),t.addEventListener("pointermove",g),t.addEventListener("pointerup",p),t.addEventListener("pointercancel",k),t.style.cursor="grab",()=>{t.removeEventListener("pointerdown",c),t.removeEventListener("pointermove",g),t.removeEventListener("pointerup",p),t.removeEventListener("pointercancel",k)}}function z(t,s){const e=Math.max(0,window.innerHeight-s.getBoundingClientRect().height-8);return Math.max(0,Math.min(t,e))}const Se=`
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
`;function b(t){return new Promise(s=>{chrome.runtime.sendMessage(t,e=>{chrome.runtime.lastError?s({success:!1,error:chrome.runtime.lastError.message}):s(e??{success:!1,error:"No response"})})})}function Ce(t,s=1){return t.active?{...t,consumed:t.consumed+s}:t}function Te(t,s=Date.now()){return t.active?t.mode==="items"?t.consumed>=t.limit:t.mode==="time"?(s-t.startedAt)/6e4>=t.limit:!1:!1}function Ee(t,s=Date.now()){if(!t.active)return{current:0,total:0,percent:0};if(t.mode==="items")return{current:t.consumed,total:t.limit,percent:Math.min(100,Math.round(t.consumed/t.limit*100))};const e=(s-t.startedAt)/6e4,i=Math.max(0,t.limit-e),o=Math.floor(i),r=Math.floor((i-o)*60);return{current:Math.round(e),total:t.limit,percent:Math.min(100,Math.round(e/t.limit*100)),timeRemaining:`${String(o).padStart(2,"0")}:${String(r).padStart(2,"0")}`}}const R="brd:locationchange";class Ie{constructor(){h(this,"settings");h(this,"session");h(this,"enabled",!1);h(this,"lastSignalAt",0);h(this,"lastActivityAt",0);h(this,"scrollCount",0);h(this,"swipeCount",0);h(this,"maxCookedShown",!1);h(this,"builtDifferentDismissed",!1);h(this,"tickTimer",null);h(this,"cleanupFns",[]);h(this,"velocitySamples",[])}async init(){var s;this.enabled&&this.destroy();try{const e=await b({type:"GET_SETTINGS"});if(!e.success)return;if(this.settings=e.data,!this.settings.masterEnabled||!((s=this.settings.sites[this.site])!=null&&s.enabled)){console.log(`[brainrot detox] Disabled for ${this.site}`);return}const i=await this.getCurrentTabId(),o=await b({type:"GET_SESSION",payload:{tabId:i}});o.data?this.session=o.data:(this.session={site:this.site,tabId:i,startedAt:Date.now(),cookedScore:0,cookedStatus:"Based",lastInterventionAt:0,packState:{...y},touchGrass:{...T},vibeIntent:this.settings.vibeCheck.activeIntent,itemsConsumed:0,scrollEvents:0},await b({type:"UPDATE_SESSION",payload:{tabId:i,patch:this.session}})),this.enabled=!0,this.lastSignalAt=0,this.lastActivityAt=Date.now(),this.velocitySamples=[],await xe(this.site),this.mountCookedWidget(),this.setupObservers(),this.scheduleNextTick(),this.session.touchGrass.active&&this.session.touchGrass.endsAt>Date.now()&&this.showTouchGrassOverlay(),console.log(`[brainrot detox] ${this.site} adapter initialized`)}catch(e){console.error(`[brainrot detox] Init error for ${this.site}:`,e)}}destroy(){for(this.enabled=!1,this.tickTimer!==null&&(clearTimeout(this.tickTimer),this.tickTimer=null);this.cleanupFns.length>0;){const s=this.cleanupFns.pop();try{s==null||s()}catch(e){console.warn(`[brainrot detox] Cleanup error for ${this.site}:`,e)}}this.velocitySamples=[],this.removeAllOverlays()}scheduleNextTick(){if(!this.enabled)return;this.tickTimer!==null&&clearTimeout(this.tickTimer);const s=Date.now()-this.lastActivityAt<ie?te:se;this.tickTimer=window.setTimeout(async()=>{await this.tick(),this.scheduleNextTick()},s)}recordActivity(s=Date.now()){this.lastActivityAt=s}recordSignalUnits(s,e=Date.now()){s<=0||(this.velocitySamples.push({at:e,units:s}),this.lastSignalAt=e,this.recordActivity(e),this.pruneVelocitySamples(e))}recordSuccessfulNavigation(s=1,e=Date.now()){s<=0||(this.swipeCount+=s,this.recordSignalUnits(s,e))}getVelocityMultiplier(s=Date.now()){this.pruneVelocitySamples(s);const i=this.velocitySamples.reduce((o,r)=>o+r.units,0)/(N/1e3);return Math.min(re,1+oe*Math.pow(i,1.5))}addCleanup(s){this.cleanupFns.push(s)}registerEventListener(s,e,i,o){s.addEventListener(e,i,o),this.addCleanup(()=>s.removeEventListener(e,i,o))}registerMutationObserver(s,e,i){const o=new MutationObserver(i);return o.observe(s,e),this.addCleanup(()=>o.disconnect()),o}registerInterval(s,e){const i=window.setInterval(s,e);return this.addCleanup(()=>clearInterval(i)),i}registerRuntimeMessageListener(s){chrome.runtime.onMessage.addListener(s),this.addCleanup(()=>chrome.runtime.onMessage.removeListener(s))}registerLocationChangeListener(s){const e=window;let i=e.__brdLocationChangePatch;if(!i){const o=()=>window.dispatchEvent(new Event(R)),r=history.pushState,a=history.replaceState;history.pushState=function(...n){const c=r.apply(history,n);return o(),c},history.replaceState=function(...n){const c=a.apply(history,n);return o(),c},window.addEventListener("popstate",o),i={refCount:0,popstateListener:o,originalPushState:r,originalReplaceState:a},e.__brdLocationChangePatch=i}i.refCount++,window.addEventListener(R,s),this.addCleanup(()=>{window.removeEventListener(R,s);const o=e.__brdLocationChangePatch;o&&(o.refCount--,!(o.refCount>0)&&(history.pushState=o.originalPushState,history.replaceState=o.originalReplaceState,window.removeEventListener("popstate",o.popstateListener),delete e.__brdLocationChangePatch))})}buildPackDisplay(){if(!this.session.packState.active)return null;const s=Ee(this.session.packState);return{label:this.session.packState.mode==="time"&&s.timeRemaining?`[#] Pack: ${s.timeRemaining}`:`[#] Pack: ${s.current}/${s.total}`,percent:s.percent}}renderCookedWidget(s,e){ve({siteKey:this.site,score:s,status:e,pack:this.buildPackDisplay(),onActivate:()=>this.showVibeCheckOverlay()})}getGeneralVelocityUnits(s){return s+this.scrollCount*.25}computeGeneralBurstBonus(s,e){return s<=0?0:Math.max(0,e-1)*Math.min(12,s)*.6}resetMomentum(){this.velocitySamples=[],this.lastSignalAt=0}async tick(){if(!this.enabled)return;const s=Date.now(),e=this.session.cookedScore,i=this.getNewItemsSinceLastTick();this.session.itemsConsumed+=i,this.session.scrollEvents+=this.scrollCount;const o=this.scrollCount>0||i>0||this.swipeCount>0,r=this.lastSignalAt===0?0:s-this.lastSignalAt;if(this.builtDifferentDismissed&&o){this.builtDifferentDismissed=!1,this.scrollCount=0,this.swipeCount=0,this.onBuiltDifferentDenied();return}let a=e;if(this.session.packState.active)a=e;else if(this.site==="shorts"){const n=i*this.getVelocityMultiplier(s);a=ce(e,n,this.session.vibeIntent,r)}else{const n=this.getGeneralVelocityUnits(i);n>0&&this.recordSignalUnits(n,s);const c=(s-this.session.startedAt)/6e4,g=ne(c,this.settings.cooked.sessionCapMinutes,this.session.scrollEvents,this.session.itemsConsumed),p=this.getVelocityMultiplier(s),k=de(e,g,o,r,this.session.vibeIntent);a=Math.min(100,k+this.computeGeneralBurstBonus(n,p))}this.scrollCount=0,this.swipeCount=0,this.session.cookedScore=a,this.session.cookedStatus=le(a,this.settings.cooked.thresholds),this.session.packState.active&&(this.session.packState=Ce(this.session.packState,i),Te(this.session.packState,s)&&this.onPackComplete()),this.session.packState.active||(ue(a)?this.maxCookedShown||(this.maxCookedShown=!0,this.onMaxCooked()):(a<95&&(this.maxCookedShown=!1),a>=e&&he(a,this.session.lastInterventionAt,this.settings.cooked.thresholds,s)&&(this.session.lastInterventionAt=s,this.onIntervention()))),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus),await b({type:"UPDATE_SESSION",payload:{tabId:this.session.tabId,patch:this.session}})}onIntervention(){b({type:"LOG_EVENT",payload:{eventType:"intervention"}}),this.showInterventionOverlay()}onMaxCooked(){this.session.lastInterventionAt=Date.now(),b({type:"LOG_EVENT",payload:{eventType:"intervention"}}),this.showSkyrimOverlay("Your brain is absolutely cooked (x_x)")}onPackComplete(){this.session.packState={...y},this.maxCookedShown=!1,b({type:"END_PACK",payload:{tabId:this.session.tabId}}),this.showSkyrimOverlay("[#] Pack Complete! Time to touch grass."),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus)}onBuiltDifferentDenied(){this.showBuiltDifferentDeniedOverlay()}async startPack(s,e){await b({type:"START_PACK",payload:{tabId:this.session.tabId,mode:s,limit:e}}),this.session.packState={active:!0,mode:s,limit:e,consumed:0,startedAt:Date.now()},this.session.cookedScore=0,this.session.cookedStatus="Based",this.maxCookedShown=!1,this.builtDifferentDismissed=!1,this.resetMomentum(),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus)}async startTouchGrass(s){await b({type:"START_TOUCH_GRASS",payload:{tabId:this.session.tabId,minutes:s}}),this.session.touchGrass={active:!0,endsAt:Date.now()+s*6e4,bypassCount:0},this.showTouchGrassOverlay()}async endTouchGrass(){await b({type:"END_TOUCH_GRASS",payload:{tabId:this.session.tabId}}),this.session.touchGrass={...T},this.session.cookedScore=0,this.session.cookedStatus="Based",this.maxCookedShown=!1,this.resetMomentum(),this.removeAllOverlays(),this.mountCookedWidget()}async bypassTouchGrass(){this.session.touchGrass.bypassCount++,b({type:"LOG_EVENT",payload:{eventType:"bypass"}}),await this.endTouchGrass()}setVibeIntent(s){this.session.vibeIntent=s,b({type:"UPDATE_SESSION",payload:{tabId:this.session.tabId,patch:{vibeIntent:s}}}),b({type:"LOG_EVENT",payload:{eventType:"vibe_check"}})}pruneVelocitySamples(s=Date.now()){this.velocitySamples=this.velocitySamples.filter(e=>s-e.at<=N)}async getCurrentTabId(){return new Promise(s=>{const e=Math.floor(Math.random()*1e6);b({type:"GET_CURRENT_TAB"}).then(i=>{var o;s(((o=i.data)==null?void 0:o.id)??e)})})}}class Me extends Ie{constructor(){super(...arguments);h(this,"site","shorts");h(this,"itemsSinceLastTick",0);h(this,"lastVideoId","");h(this,"handleRuntimeMessage",(e,i,o)=>{var r,a,n;return e.type==="END_TOUCH_GRASS"?(this.session.touchGrass={active:!1,endsAt:0,bypassCount:0},u("skyrim"),u("touchgrass"),this.thawFeed(),o({success:!0}),!1):e.type==="TRIGGER_TOUCH_GRASS"?(this.startTouchGrass(((r=e.payload)==null?void 0:r.minutes)??5),o({success:!0}),!1):e.type==="TRIGGER_PACK"?(this.startPack(((a=e.payload)==null?void 0:a.mode)??"items",((n=e.payload)==null?void 0:n.limit)??10),o({success:!0}),!1):(e.type==="TRIGGER_VIBE_CHECK"&&(this.showVibeCheckOverlay(),o({success:!0})),!1)})}getShortsVideo(){return document.querySelector("ytd-shorts video")??document.querySelector(".html5-main-video")??document.querySelector("video.video-stream")??null}freezeFeed(){const e=this.getShortsVideo();e&&!e.paused&&e.pause()}thawFeed(){const e=this.getShortsVideo();e&&e.paused&&e.play().catch(()=>{})}setupObservers(){this.registerEventListener(window,"scroll",()=>{this.scrollCount++,this.recordActivity()},{passive:!0}),this.registerEventListener(window,"wheel",r=>{Math.abs(r.deltaY)>20&&(this.scrollCount++,this.recordActivity())},{passive:!0}),this.registerEventListener(window,"keydown",r=>{const a=r;(a.key==="ArrowDown"||a.key==="j")&&(this.scrollCount++,this.recordActivity())},{passive:!0});let e=0;this.registerEventListener(window,"touchstart",r=>{var a;e=((a=r.touches[0])==null?void 0:a.clientY)??0},{passive:!0}),this.registerEventListener(window,"touchend",r=>{var n;const a=e-(((n=r.changedTouches[0])==null?void 0:n.clientY)??0);Math.abs(a)>50&&(this.scrollCount++,this.recordActivity())},{passive:!0});const i=()=>{const r=window.location.pathname.match(/\/shorts\/([^/?]+)/),a=(r==null?void 0:r[1])??"";if(a){if(!this.lastVideoId){this.lastVideoId=a;return}a!==this.lastVideoId&&(this.lastVideoId=a,this.itemsSinceLastTick++,this.recordSuccessfulNavigation())}};this.registerLocationChangeListener(i),this.registerInterval(i,250),i();const o=()=>{const r=document.body??document.documentElement;this.registerMutationObserver(r,{childList:!0,subtree:!0},()=>i())};document.readyState==="complete"?o():this.registerEventListener(window,"load",o,{once:!0}),this.registerRuntimeMessageListener(this.handleRuntimeMessage)}getNewItemsSinceLastTick(){const e=this.itemsSinceLastTick;return this.itemsSinceLastTick=0,e}mountCookedWidget(){this.renderCookedWidget(this.session.cookedScore,this.session.cookedStatus)}updateCookedWidget(e,i){this.renderCookedWidget(e,i)}showInterventionOverlay(){var o,r,a;const e=F(this.session.cookedStatus),i=L("intervention",`
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
    `);(o=i.querySelector("[data-action='dismiss']"))==null||o.addEventListener("click",()=>u("intervention")),(r=i.querySelector("[data-action='pack']"))==null||r.addEventListener("click",()=>{u("intervention"),this.startPack("items",10)}),(a=i.querySelector("[data-action='grass']"))==null||a.addEventListener("click",()=>{u("intervention"),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)})}showBuiltDifferentDeniedOverlay(){var i,o,r;this.freezeFeed();const e=L("denied",`
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
    `);(i=e.querySelector("[data-action='grass']"))==null||i.addEventListener("click",()=>{u("denied"),this.thawFeed(),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)}),(o=e.querySelector("[data-action='pack']"))==null||o.addEventListener("click",()=>{u("denied"),this.thawFeed(),this.startPack("items",10)}),(r=e.querySelector("[data-action='vibe']"))==null||r.addEventListener("click",()=>{u("denied"),this.thawFeed(),this.showVibeCheckOverlay()})}showSkyrimOverlay(e){var a,n,c;const i=chrome.runtime.getURL("assets/skyrim-skeleton.mp4");this.freezeFeed();const o=L("skyrim",`
      <div class="brd-fullscreen">
        <div class="brd-video-wrap"><video playsinline></video></div>
        <div class="brd-message">${e}</div>
        <div class="brd-btn-row">
          <button class="brd-btn brd-btn-success" data-action="grass">Touch Grass</button>
          <button class="brd-btn brd-btn-primary" data-action="pack">Start Pack</button>
          <button class="brd-btn brd-btn-ghost" data-action="dismiss">I'm Built Different</button>
        </div>
      </div>
    `),r=o.querySelector("video");r&&(r.src=i,r.load(),r.play().catch(()=>{})),(a=o.querySelector("[data-action='grass']"))==null||a.addEventListener("click",()=>{u("skyrim"),this.thawFeed(),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)}),(n=o.querySelector("[data-action='pack']"))==null||n.addEventListener("click",()=>{u("skyrim"),this.thawFeed(),this.startPack("items",10)}),(c=o.querySelector("[data-action='dismiss']"))==null||c.addEventListener("click",()=>{u("skyrim"),this.thawFeed(),this.builtDifferentDismissed=!0})}showTouchGrassOverlay(){var J;const e=this.session.touchGrass.endsAt,i=Z.slice().sort(()=>Math.random()-.5).slice(0,3);this.freezeFeed();const r=[...["https://cataas.com/cat?width=900&height=700&t=1","https://cataas.com/cat?width=900&height=700&t=2","https://cataas.com/cat?width=900&height=700&t=3","https://cataas.com/cat?width=900&height=700&t=4","https://cataas.com/cat?width=900&height=700&t=5","https://cataas.com/cat?width=900&height=700&t=6","https://cataas.com/cat?width=900&height=700&t=7","https://cataas.com/cat?width=900&height=700&t=8","https://cataas.com/cat?width=900&height=700&t=9","https://cataas.com/cat?width=900&height=700&t=10","WEBCAM","https://cataas.com/cat?width=900&height=700&t=11","https://cataas.com/cat?width=900&height=700&t=12","https://cataas.com/cat?width=900&height=700&t=13","https://cataas.com/cat?width=900&height=700&t=14","https://cataas.com/cat?width=900&height=700&t=15","WEBCAM"]].sort(()=>Math.random()-.5),a=L("touchgrass",`
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
    `),n=a.querySelector(".brd-zen-img"),c=a.querySelector(".brd-zen-webcam"),g=a.querySelector(".brd-zen-caption");let p=null,k=0;const d=["breathe.","you are here.","it's okay.","look at this.","touch grass.","be present.","slow down.","this is real life.","you look great btw.","hi.","go outside.","drink water."],E=async v=>{const M=r[v%r.length];if(M==="WEBCAM"){if(n.style.display="none",c.style.display="block",g.textContent="hi. this is you. say hi.",!p)try{p=await navigator.mediaDevices.getUserMedia({video:!0,audio:!1}),c.srcObject=p}catch{await E(v+1)}return}c.style.display="none",n.style.display="block",n.src=M,g.textContent=d[Math.floor(Math.random()*d.length)]};E(k);const S=window.setInterval(()=>{k++,E(k)},4e3);let l=null,C=null;try{l=new AudioContext,C=l.createGain(),C.gain.setValueAtTime(0,l.currentTime),C.gain.linearRampToValueAtTime(.06,l.currentTime+2),C.connect(l.destination);const v=[110,165,220];v.forEach((M,j)=>{const D=l.createOscillator(),O=l.createGain();D.type="sine",D.frequency.setValueAtTime(M,l.currentTime),O.gain.setValueAtTime(1/v.length,l.currentTime),D.connect(O),O.connect(C),D.start();const q=l.createOscillator(),H=l.createGain();q.frequency.setValueAtTime(.15+j*.05,l.currentTime),H.gain.setValueAtTime(.015,l.currentTime),q.connect(H),H.connect(O.gain),q.start()})}catch{l=null,C=null}const X=a.querySelector("#brd-tg-timer"),V=window.setInterval(()=>{const v=Math.max(0,e-Date.now()),M=Math.floor(v/6e4),j=Math.floor(v%6e4/1e3);X&&(X.textContent=`${String(M).padStart(2,"0")}:${String(j).padStart(2,"0")}`),v<=0&&(clearInterval(V),clearInterval(S),this.stopZenAudio(l,C),this.stopWebcam(p),this.endTouchGrass(),this.thawFeed(),u("touchgrass"))},1e3);this.addCleanup(()=>clearInterval(S)),this.addCleanup(()=>clearInterval(V)),(J=a.querySelector("[data-action='bypass']"))==null||J.addEventListener("click",()=>{clearInterval(V),clearInterval(S),this.stopZenAudio(l,C),this.stopWebcam(p),this.bypassTouchGrass(),this.thawFeed(),u("touchgrass")})}showVibeCheckOverlay(){var o;const e=Q.map(r=>`
      <div class="brd-vibe-card" data-vibe="${r.id}">
        <span class="brd-vibe-emoji">${r.emoji}</span>
        <span class="brd-vibe-label">${r.label}</span>
      </div>
    `).join(""),i=L("vibecheck",`
      <div class="brd-fullscreen">
        <div class="brd-card">
          <h2>Vibe Check</h2>
          <p>What are you here for? This adjusts how strict the cooked meter is.</p>
          <div class="brd-vibe-grid">${e}</div>
          <div class="brd-btn-row" style="justify-content:center;">
            <button class="brd-btn brd-btn-ghost" data-action="skip">Skip</button>
          </div>
        </div>
      </div>
    `);i.querySelectorAll("[data-vibe]").forEach(r=>{r.addEventListener("click",()=>{this.setVibeIntent(r.dataset.vibe),u("vibecheck")})}),(o=i.querySelector("[data-action='skip']"))==null||o.addEventListener("click",()=>u("vibecheck"))}removeAllOverlays(){ye(),this.thawFeed()}stopZenAudio(e,i){if(!(!e||!i))try{i.gain.linearRampToValueAtTime(0,e.currentTime+.5),window.setTimeout(()=>{e.close()},600)}catch{}}stopWebcam(e){e&&e.getTracks().forEach(i=>i.stop())}}console.log("[brainrot detox] Shorts content script loaded"),new Me().init()})();
