var ne=Object.defineProperty;var de=(x,p,v)=>p in x?ne(x,p,{enumerable:!0,configurable:!0,writable:!0,value:v}):x[p]=v;var u=(x,p,v)=>de(x,typeof p!="symbol"?p+"":p,v);(function(){"use strict";const x={basedMax:35,mediumMax:65,intervention:80,cooldownMs:6e4},p={active:!1,mode:"items",limit:10,consumed:0,startedAt:0},v={active:!1,endsAt:0,bypassCount:0},O=["[>] Step outside for 2 minutes","[~] Drink a glass of water","[o] Do 5 deep breaths","[!] Do 10 jumping jacks","[*] Look at something 20 feet away for 20 seconds","[♪] Put on your favorite song","[>] Text a friend something nice","[=] Open a window and feel the air"],S={based:{emoji:"( ._.)",label:"Based",hint:"Keep it chill, you're doing great."},medium:{emoji:"(-_-;)",label:"Medium Cooked",hint:"Maybe take a breather soon?"},cooked:{emoji:"(x_x) ",label:"Absolutely Cooked",hint:"Bro. Step away from the screen."}},_=[{id:"Chill",emoji:"~_~",label:"Just Vibing"},{id:"Learn",emoji:"o_O",label:"Learn Something"},{id:"Laugh",emoji:"xD",label:"Get Entertained"},{id:"Music",emoji:"♪♫",label:"Music / Audio"},{id:"JustHere",emoji:"...",label:"I'm Just Here"}],I=.3,G=15e3,P=500,R=3e3,z=2e3,$={edge:"right",verticalOffset:20};function j(e,o,t,i){const s=Math.min(1,e/o),r=Math.min(1,t/150),a=Math.min(1,i/60),n=s*35+r*35+a*30;return Math.round(Math.min(100,n))}function H(e,o,t,i,s){const r=s==="Learn"?1.3:s==="JustHere"?1.1:s==="Laugh"?.8:s==="Chill"?.7:1;if(t){const n=o*r,c=e*(1-I)+n*I;return Math.max(0,Math.min(100,Math.round(c)))}if(i<G)return e;const a=i<45e3?1:i<9e4?2:4;return Math.max(0,e-a)}function B(e,o,t,i){return o>0?Math.max(0,Math.min(100,e+o)):i<(t==="Chill"||t==="Laugh"?15e3:t==="Learn"||t==="JustHere"?25e3:2e4)?e:i<6e4?Math.max(0,e-1):Math.max(0,e-3)}function N(e,o=x){return e<=o.basedMax?"Based":e<=o.mediumMax?"Medium Cooked":"Absolutely Cooked"}function A(e){return e==="Based"?S.based:e==="Medium Cooked"?S.medium:S.cooked}function q(e,o,t=x,i=Date.now()){return!(e<t.intervention||i-o<t.cooldownMs)}function U(e){return e>=100}function V(e,o=1){return e.active?{...e,consumed:e.consumed+o}:e}function W(e,o=Date.now()){return e.active?e.mode==="items"?e.consumed>=e.limit:e.mode==="time"?(o-e.startedAt)/6e4>=e.limit:!1:!1}function Y(e,o=Date.now()){if(!e.active)return{current:0,total:0,percent:0};if(e.mode==="items")return{current:e.consumed,total:e.limit,percent:Math.min(100,Math.round(e.consumed/e.limit*100))};const t=(o-e.startedAt)/6e4,i=Math.max(0,e.limit-t),s=Math.floor(i),r=Math.floor((i-s)*60);return{current:Math.round(t),total:e.limit,percent:Math.min(100,Math.round(t/e.limit*100)),timeRemaining:`${String(s).padStart(2,"0")}:${String(r).padStart(2,"0")}`}}const M="brd_widget_positions";async function F(e,o){return(await chrome.storage.local.get(e))[e]??o}async function K(e,o){await chrome.storage.local.set({[e]:o})}async function L(){return F(M,{})}async function X(e){return(await L())[e]??$}async function J(e,o){const t=await L();t[e]=o,await K(M,t)}const T="brd-overlay-host";let b=null,C=null,f={edge:"right",verticalOffset:20};function Z(){if(b)return b;let e=document.getElementById(T);if(e||(e=document.createElement("div"),e.id=T,e.style.cssText="position:fixed;top:0;left:0;width:0;height:0;z-index:2147483647;pointer-events:none;",document.documentElement.appendChild(e)),e.shadowRoot)return b=e.shadowRoot,b;b=e.attachShadow({mode:"open"});const o=document.createElement("style");o.textContent=oe,b.appendChild(o);const t=document.createElement("link");return t.rel="stylesheet",t.href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap",b.appendChild(t),te(),b}function y(e,o){const t=Z(),i=t.querySelector(`[data-overlay="${e}"]`);i&&i.remove();const s=document.createElement("div");return s.setAttribute("data-overlay",e),s.innerHTML=o,t.appendChild(s),s}function l(e){if(!b)return;const o=b.querySelector(`[data-overlay="${e}"]`);o&&o.remove()}function Q(){b&&b.querySelectorAll("[data-overlay]").forEach(e=>e.remove())}async function ee(e){C=e,f=await X(e),D()}function D(){if(!b)return;const e=b.querySelector(".brd-widget");e&&(e.style.right=f.edge==="right"?`${f.verticalOffset}px`:"auto",e.style.left=f.edge==="left"?`${f.verticalOffset}px`:"auto",e.style.bottom="20px")}async function te(){var i;const e=await chrome.runtime.sendMessage({type:"GET_SETTINGS"}),o=e!=null&&e.success&&((i=e.data)!=null&&i.theme)?e.data.theme:"light",t=document.getElementById(T);t&&(o==="dark"?t.classList.add("brd-dark"):t.classList.remove("brd-dark"))}function se(e,o){let t=!1,i=0,s=0,r=0,a=0;const n=d=>{d.target.closest("button, input, a")||(t=!0,i=d.clientX,s=d.clientY,r=f.edge==="right"?f.verticalOffset:window.innerWidth-e.getBoundingClientRect().right,a=window.innerHeight-e.getBoundingClientRect().bottom,e.style.cursor="grabbing",e.style.transition="none",d.preventDefault())},c=d=>{if(!t)return;const g=i-d.clientX,k=s-d.clientY,E=r+g,w=a+k;e.style.right=`${Math.max(0,E)}px`,e.style.left="auto",e.style.bottom=`${Math.max(0,w)}px`},m=async d=>{if(!t)return;t=!1,e.style.cursor="grab",e.style.transition="all 0.2s ease";const g=e.getBoundingClientRect(),k=g.left+g.width/2,E=window.innerWidth/2,w=k<E?"left":"right",ae=w==="right"?window.innerWidth-g.right:g.left;f={edge:w,verticalOffset:Math.max(0,ae)},D(),C&&await J(C,f)};e.addEventListener("pointerdown",n),document.addEventListener("pointermove",c),document.addEventListener("pointerup",m),e.style.cursor="grab"}const oe=`
  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Fullscreen backdrop ─────────────────────────── */
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

  /* ── Notebook card ───────────────────────────────── */
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
    /* Lined paper effect */
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

  /* ── Buttons ─────────────────────────────────────── */
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

  /* ── Floating widget (cooked meter pill) ─────── */
  .brd-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: #fdf8ee;
    border: 2.5px solid #3a2e1e;
    border-radius: 8px;
    box-shadow: 3px 3px 0 #3a2e1e;
    pointer-events: all;
    z-index: 999998;
    font-family: 'Patrick Hand', 'Caveat', cursive, -apple-system, sans-serif;
    animation: brd-slideIn 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    cursor: default;
    user-select: none;
    transition: all 0.2s ease;
  }

  .brd-widget:hover {
    transform: translate(-1px, -1px);
    box-shadow: 4px 4px 0 #3a2e1e;
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
    text-align: center;
    font-family: 'Caveat', cursive;
    border: 1.5px solid currentColor;
  }

  .brd-score-based  { background: #e8f5e9; color: #2e7d32; }
  .brd-score-medium { background: #fff3e0; color: #e65100; }
  .brd-score-cooked { background: #fdecea; color: #c0392b; }

  /* ── Pack progress bar ───────────────────────── */
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

  /* ── Timer ────────────────────────────────────── */
  .brd-timer {
    font-family: 'Caveat', cursive;
    font-size: 56px;
    font-weight: 700;
    color: #3a2e1e;
    letter-spacing: -2px;
    text-align: center;
    margin: 12px 0;
  }

  /* ── Vibe grid ───────────────────────────────── */
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

  /* ── Tips ─────────────────────────────────────── */
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

  /* ── Video container ─────────────────────────── */
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

  /* ── Animations ──────────────────────────────── */
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

  /* ── Zen / Touch Grass slideshow ─────────────────── */
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
    transform: scaleX(-1); /* mirror effect */
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

  /* Zen sidebar — keep dark so the cat photos pop */
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

  /* ── Dark mode ──────────────────────────────────── */
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

  :host(.brd-dark) .brd-card p {
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
`;function h(e){return new Promise(o=>{chrome.runtime.sendMessage(e,t=>{chrome.runtime.lastError?o({success:!1,error:chrome.runtime.lastError.message}):o(t??{success:!1,error:"No response"})})})}class ie{constructor(){u(this,"settings");u(this,"session");u(this,"enabled",!1);u(this,"tickTimer",null);u(this,"lastSignalAt",0);u(this,"lastActivityAt",0);u(this,"scrollCount",0);u(this,"swipeCount",0);u(this,"maxCookedShown",!1);u(this,"builtDifferentDismissed",!1)}async init(){var o;try{const t=await h({type:"GET_SETTINGS"});if(!t.success)return;if(this.settings=t.data,!this.settings.masterEnabled||!((o=this.settings.sites[this.site])!=null&&o.enabled)){console.log(`[brainrot detox] Disabled for ${this.site}`);return}const i=await this.getCurrentTabId();let s=await h({type:"GET_SESSION",payload:{tabId:i}});s.data?this.session=s.data:(this.session={site:this.site,tabId:i,startedAt:Date.now(),cookedScore:0,cookedStatus:"Based",lastInterventionAt:0,packState:{...p},touchGrass:{...v},vibeIntent:this.settings.vibeCheck.activeIntent,itemsConsumed:0,scrollEvents:0},await h({type:"UPDATE_SESSION",payload:{tabId:i,patch:this.session}})),this.enabled=!0,console.log(`[brainrot detox] ${this.site} adapter initialized`),this.mountCookedWidget(),this.setupObservers(),this.lastActivityAt=Date.now(),this.scheduleNextTick(),this.session.touchGrass.active&&this.session.touchGrass.endsAt>Date.now()&&this.showTouchGrassOverlay()}catch(t){console.error(`[brainrot detox] Init error for ${this.site}:`,t)}}destroy(){this.enabled=!1,this.tickTimer&&clearTimeout(this.tickTimer),this.removeAllOverlays()}scheduleNextTick(){this.tickTimer&&clearTimeout(this.tickTimer);const s=Date.now()-this.lastActivityAt<z?P:R;this.tickTimer=window.setTimeout(()=>{this.tick(),this.scheduleNextTick()},s)}recordActivity(){this.lastActivityAt=Date.now()}async tick(){if(!this.enabled)return;const o=Date.now(),t=this.getNewItemsSinceLastTick();this.session.itemsConsumed+=t,this.session.scrollEvents+=this.scrollCount;const i=this.scrollCount>0||t>0||this.swipeCount>0;i&&(this.lastSignalAt=o);const s=this.lastSignalAt===0?0:o-this.lastSignalAt;if(this.builtDifferentDismissed&&i){this.builtDifferentDismissed=!1,this.scrollCount=0,this.swipeCount=0,this.onBuiltDifferentDenied();return}let r;if(this.session.packState.active)r=this.session.cookedScore;else if(this.site==="shorts")r=B(this.session.cookedScore,this.swipeCount,this.session.vibeIntent,s);else{const n=(o-this.session.startedAt)/6e4,c=j(n,this.settings.cooked.sessionCapMinutes,this.session.scrollEvents,this.session.itemsConsumed);r=H(this.session.cookedScore,c,i,s,this.session.vibeIntent)}this.scrollCount=0,this.swipeCount=0,this.session.cookedScore=r,this.session.cookedStatus=N(r,this.settings.cooked.thresholds),this.session.packState.active&&(this.session.packState=V(this.session.packState,t),W(this.session.packState,o)&&this.onPackComplete()),this.session.packState.active||(U(r)?this.maxCookedShown||(this.maxCookedShown=!0,this.onMaxCooked()):(r<95&&(this.maxCookedShown=!1),r>=this.session.cookedScore&&q(r,this.session.lastInterventionAt,this.settings.cooked.thresholds,o)&&(this.session.lastInterventionAt=o,this.onIntervention()))),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus);const a=this.session.tabId;await h({type:"UPDATE_SESSION",payload:{tabId:a,patch:this.session}})}async getCurrentTabId(){return new Promise(o=>{const t=Math.floor(Math.random()*1e6);h({type:"GET_CURRENT_TAB"}).then(i=>{var s;o(((s=i.data)==null?void 0:s.id)??t)})})}onIntervention(){h({type:"LOG_EVENT",payload:{eventType:"intervention"}}),this.showInterventionOverlay()}onMaxCooked(){this.session.lastInterventionAt=Date.now(),h({type:"LOG_EVENT",payload:{eventType:"intervention"}}),this.showSkyrimOverlay("Your brain is absolutely cooked (x_x)")}onPackComplete(){this.session.packState={...p},this.maxCookedShown=!1,h({type:"END_PACK",payload:{tabId:this.session.tabId}}),this.showSkyrimOverlay("[#] Pack Complete! Time to touch grass.")}onBuiltDifferentDenied(){this.showBuiltDifferentDeniedOverlay()}async startPack(o,t){await h({type:"START_PACK",payload:{tabId:this.session.tabId,mode:o,limit:t}}),this.session.packState={active:!0,mode:o,limit:t,consumed:0,startedAt:Date.now()},this.session.cookedScore=0,this.session.cookedStatus="Based",this.maxCookedShown=!1,this.builtDifferentDismissed=!1}async startTouchGrass(o){await h({type:"START_TOUCH_GRASS",payload:{tabId:this.session.tabId,minutes:o}}),this.session.touchGrass={active:!0,endsAt:Date.now()+o*6e4,bypassCount:0},this.showTouchGrassOverlay()}async endTouchGrass(){await h({type:"END_TOUCH_GRASS",payload:{tabId:this.session.tabId}}),this.session.touchGrass={...v},this.session.cookedScore=0,this.session.cookedStatus="Based",this.maxCookedShown=!1,this.removeAllOverlays()}async bypassTouchGrass(){this.session.touchGrass.bypassCount++,h({type:"LOG_EVENT",payload:{eventType:"bypass"}}),await this.endTouchGrass()}setVibeIntent(o){this.session.vibeIntent=o,h({type:"UPDATE_SESSION",payload:{tabId:this.session.tabId,patch:{vibeIntent:o}}}),h({type:"LOG_EVENT",payload:{eventType:"vibe_check"}})}}class re extends ie{constructor(){super(...arguments);u(this,"site","youtube");u(this,"itemsSinceLastTick",0);u(this,"lastSeenItems",0)}setupObservers(){window.addEventListener("scroll",()=>{this.scrollCount++,this.recordActivity()},{passive:!0});const t=new MutationObserver(()=>{const s=document.querySelectorAll("ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer");s.length>this.lastSeenItems&&(this.itemsSinceLastTick+=s.length-this.lastSeenItems,this.lastSeenItems=s.length)}),i=()=>{const s=document.querySelector("ytd-browse, ytd-search, ytd-watch-flexy, #content")||document.body;t.observe(s,{childList:!0,subtree:!0})};document.readyState==="complete"?i():window.addEventListener("load",i),window.addEventListener("yt-navigate-finish",()=>{this.lastSeenItems=0}),chrome.runtime.onMessage.addListener((s,r,a)=>{var n,c,m;return s.type==="END_TOUCH_GRASS"?(this.session.touchGrass={active:!1,endsAt:0,bypassCount:0},l("skyrim"),l("touchgrass"),a({success:!0}),!1):s.type==="TRIGGER_TOUCH_GRASS"?(this.startTouchGrass(((n=s.payload)==null?void 0:n.minutes)??5),a({success:!0}),!1):s.type==="TRIGGER_PACK"?(this.startPack(((c=s.payload)==null?void 0:c.mode)??"items",((m=s.payload)==null?void 0:m.limit)??10),a({success:!0}),!1):(s.type==="TRIGGER_VIBE_CHECK"&&(this.showVibeCheckOverlay(),a({success:!0})),!1)})}getNewItemsSinceLastTick(){const t=this.itemsSinceLastTick;return this.itemsSinceLastTick=0,t}async mountCookedWidget(){await ee(this.site),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus)}updateCookedWidget(t,i){const s=A(i),r=i==="Based"?"brd-score-based":i==="Medium Cooked"?"brd-score-medium":"brd-score-cooked";let a="";if(this.session.packState.active){const d=Y(this.session.packState);a=`<div style="width:100%;margin-top:6px;"><div style="font-size:10px;color:#94a3b8;margin-bottom:3px;">${this.session.packState.mode==="time"&&d.timeRemaining?`[#] Pack: ${d.timeRemaining}`:`[#] Pack: ${d.current}/${d.total}`}</div><div class="brd-pack-bar"><div class="brd-pack-fill" style="width:${d.percent}%"></div></div></div>`}const n=y("widget",`<div class="brd-widget"><span class="brd-widget-emoji">${s.emoji}</span><span class="brd-widget-label">${s.label}</span><span class="brd-widget-score ${r}">${t}</span>${a}</div>`),c=n.querySelector(".brd-widget");c&&(c.style.cursor="pointer",c.onclick=()=>this.showVibeCheckOverlay());const m=n.querySelector(".brd-widget");m&&se(m,this.site)}showInterventionOverlay(){var s,r,a;const t=A(this.session.cookedStatus),i=y("intervention",`<div class="brd-fullscreen"><div class="brd-card"><h2>${t.emoji} ${t.label}!</h2><p>Your scrolling score hit ${this.session.cookedScore}. Time to make a choice:</p><div class="brd-btn-row"><button class="brd-btn brd-btn-ghost" data-action="dismiss">Keep Going 🤷</button><button class="brd-btn brd-btn-primary" data-action="pack">Start Pack 🍱</button><button class="brd-btn brd-btn-success" data-action="grass">Touch Grass 🌿</button></div></div></div>`);(s=i.querySelector("[data-action='dismiss']"))==null||s.addEventListener("click",()=>l("intervention")),(r=i.querySelector("[data-action='pack']"))==null||r.addEventListener("click",()=>{l("intervention"),this.startPack("items",10)}),(a=i.querySelector("[data-action='grass']"))==null||a.addEventListener("click",()=>{l("intervention"),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)})}showSkyrimOverlay(t){var r,a,n,c;const i=chrome.runtime.getURL("assets/skyrim-skeleton.mp4"),s=y("skyrim",`<div class="brd-fullscreen"><div class="brd-video-wrap"><video autoplay muted playsinline><source src="${i}" type="video/mp4"></video></div><div class="brd-message">${t}</div><div class="brd-btn-row"><button class="brd-btn brd-btn-success" data-action="grass">🌿 Touch Grass</button><button class="brd-btn brd-btn-primary" data-action="pack">🍱 Start Pack</button><button class="brd-btn brd-btn-ghost" data-action="dismiss">I'm Built Different 💪</button></div></div>`);(r=s.querySelector("video"))==null||r.play().catch(()=>{}),(a=s.querySelector("[data-action='grass']"))==null||a.addEventListener("click",()=>{l("skyrim"),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)}),(n=s.querySelector("[data-action='pack']"))==null||n.addEventListener("click",()=>{l("skyrim"),this.startPack("items",10)}),(c=s.querySelector("[data-action='dismiss']"))==null||c.addEventListener("click",()=>l("skyrim"))}showTouchGrassOverlay(){var c,m;const t=this.session.touchGrass.endsAt,i=O.sort(()=>Math.random()-.5).slice(0,3),s=chrome.runtime.getURL("assets/skyrim-skeleton.mp4"),r=y("touchgrass",`<div class="brd-fullscreen"><div class="brd-video-wrap"><video autoplay loop muted playsinline><source src="${s}" type="video/mp4"></video></div><div class="brd-card"><h2>🌿 Touch Grass Mode</h2><p>Feed locked. Time to go outside.</p><div class="brd-timer" id="brd-tg-timer">00:00</div><div class="brd-tips">${i.map(d=>`<div class="brd-tip">${d}</div>`).join("")}</div><div class="brd-btn-row" style="justify-content:center;"><button class="brd-btn brd-btn-danger" data-action="bypass">Emergency Bypass 😏</button></div></div></div>`),a=r.querySelector("#brd-tg-timer"),n=setInterval(()=>{const d=Math.max(0,t-Date.now()),g=Math.floor(d/6e4),k=Math.floor(d%6e4/1e3);a&&(a.textContent=`${String(g).padStart(2,"0")}:${String(k).padStart(2,"0")}`),d<=0&&(clearInterval(n),this.endTouchGrass(),l("touchgrass"))},1e3);(c=r.querySelector("[data-action='bypass']"))==null||c.addEventListener("click",()=>{clearInterval(n),this.bypassTouchGrass(),l("touchgrass")}),(m=r.querySelector("video"))==null||m.play().catch(()=>{})}showVibeCheckOverlay(){var s;const t=_.map(r=>`<div class="brd-vibe-card" data-vibe="${r.id}"><span class="brd-vibe-emoji">${r.emoji}</span><span class="brd-vibe-label">${r.label}</span></div>`).join(""),i=y("vibecheck",`<div class="brd-fullscreen"><div class="brd-card"><h2>✨ Vibe Check</h2><p>What are you here for?</p><div class="brd-vibe-grid">${t}</div><div class="brd-btn-row" style="justify-content:center;"><button class="brd-btn brd-btn-ghost" data-action="skip">Skip</button></div></div></div>`);i.querySelectorAll("[data-vibe]").forEach(r=>r.addEventListener("click",()=>{this.setVibeIntent(r.dataset.vibe),l("vibecheck")})),(s=i.querySelector("[data-action='skip']"))==null||s.addEventListener("click",()=>l("vibecheck"))}showBuiltDifferentDeniedOverlay(){var i,s,r;const t=y("denied",'<div class="brd-fullscreen"><div class="brd-card"><h2 style="font-size:28px;text-align:center;color:#f87171;">No you are not.</h2><p style="text-align:center;">You thought you could just scroll away? Pick one.</p><div class="brd-btn-row" style="justify-content:center;"><button class="brd-btn brd-btn-success" data-action="grass">🌿 Touch Grass (5 min)</button><button class="brd-btn brd-btn-primary" data-action="pack">🍱 Start Pack</button><button class="brd-btn brd-btn-ghost" data-action="vibe">✨ Vibe Check</button></div></div></div>');(i=t.querySelector("[data-action='grass']"))==null||i.addEventListener("click",()=>{l("denied"),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)}),(s=t.querySelector("[data-action='pack']"))==null||s.addEventListener("click",()=>{l("denied"),this.startPack("items",10)}),(r=t.querySelector("[data-action='vibe']"))==null||r.addEventListener("click",()=>{l("denied"),this.showVibeCheckOverlay()})}removeAllOverlays(){Q()}}console.log("[brainrot detox] YouTube content script loaded"),window.location.pathname.startsWith("/shorts")||new re().init()})();
