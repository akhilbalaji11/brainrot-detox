var ve=Object.defineProperty;var ye=(v,f,x)=>f in v?ve(v,f,{enumerable:!0,configurable:!0,writable:!0,value:x}):v[f]=x;var c=(v,f,x)=>ye(v,typeof f!="symbol"?f+"":f,x);(function(){"use strict";const v={basedMax:35,mediumMax:65,intervention:80,cooldownMs:6e4},f={active:!1,mode:"items",limit:10,consumed:0,startedAt:0},x={active:!1,endsAt:0,bypassCount:0},B=["[>] Step outside for 2 minutes","[~] Drink a glass of water","[o] Do 5 deep breaths","[!] Do 10 jumping jacks","[*] Look at something 20 feet away for 20 seconds","[♪] Put on your favorite song","[>] Text a friend something nice","[=] Open a window and feel the air"],D={based:{emoji:"( ._.)",label:"Based",hint:"Keep it chill, you're doing great."},medium:{emoji:"(-_-;)",label:"Medium Cooked",hint:"Maybe take a breather soon?"},cooked:{emoji:"(x_x) ",label:"Absolutely Cooked",hint:"Bro. Step away from the screen."}},F=[{id:"Chill",emoji:"~_~",label:"Just Vibing"},{id:"Learn",emoji:"o_O",label:"Learn Something"},{id:"Laugh",emoji:"xD",label:"Get Entertained"},{id:"Music",emoji:"♪♫",label:"Music / Audio"},{id:"JustHere",emoji:"...",label:"I'm Just Here"}],z=.3,W=15e3,U=500,Y=3e3,K=2e3,Z={edge:"right",verticalOffset:20};function X(t,o,e,s){const i=Math.min(1,t/o),a=Math.min(1,e/150),r=Math.min(1,s/60),n=i*35+a*35+r*30;return Math.round(Math.min(100,n))}function J(t,o,e,s,i){const a=i==="Learn"?1.3:i==="JustHere"?1.1:i==="Laugh"?.8:i==="Chill"?.7:1;if(e){const n=o*a,d=t*(1-z)+n*z;return Math.max(0,Math.min(100,Math.round(d)))}if(s<W)return t;const r=s<45e3?1:s<9e4?2:4;return Math.max(0,t-r)}function Q(t,o,e,s){return o>0?Math.max(0,Math.min(100,t+o)):s<(e==="Chill"||e==="Laugh"?15e3:e==="Learn"||e==="JustHere"?25e3:2e4)?t:s<6e4?Math.max(0,t-1):Math.max(0,t-3)}function ee(t,o=v){return t<=o.basedMax?"Based":t<=o.mediumMax?"Medium Cooked":"Absolutely Cooked"}function R(t){return t==="Based"?D.based:t==="Medium Cooked"?D.medium:D.cooked}function te(t,o,e=v,s=Date.now()){return!(t<e.intervention||s-o<e.cooldownMs)}function se(t){return t>=100}function oe(t,o=1){return t.active?{...t,consumed:t.consumed+o}:t}function ie(t,o=Date.now()){return t.active?t.mode==="items"?t.consumed>=t.limit:t.mode==="time"?(o-t.startedAt)/6e4>=t.limit:!1:!1}function ae(t,o=Date.now()){if(!t.active)return{current:0,total:0,percent:0};if(t.mode==="items")return{current:t.consumed,total:t.limit,percent:Math.min(100,Math.round(t.consumed/t.limit*100))};const e=(o-t.startedAt)/6e4,s=Math.max(0,t.limit-e),i=Math.floor(s),a=Math.floor((s-i)*60);return{current:Math.round(e),total:t.limit,percent:Math.min(100,Math.round(e/t.limit*100)),timeRemaining:`${String(i).padStart(2,"0")}:${String(a).padStart(2,"0")}`}}const j="brd_widget_positions";async function re(t,o){return(await chrome.storage.local.get(t))[t]??o}async function ne(t,o){await chrome.storage.local.set({[t]:o})}async function H(){return re(j,{})}async function de(t){return(await H())[t]??Z}async function ce(t,o){const e=await H();e[t]=o,await ne(j,e)}const L="brd-overlay-host";let u=null,O=null,y={edge:"right",verticalOffset:20};function le(){if(u)return u;let t=document.getElementById(L);if(t||(t=document.createElement("div"),t.id=L,t.style.cssText="position:fixed;top:0;left:0;width:0;height:0;z-index:2147483647;pointer-events:none;",document.documentElement.appendChild(t)),t.shadowRoot)return u=t.shadowRoot,u;u=t.attachShadow({mode:"open"});const o=document.createElement("style");o.textContent=me,u.appendChild(o);const e=document.createElement("link");return e.rel="stylesheet",e.href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap",u.appendChild(e),ue(),u}function S(t,o){const e=le(),s=e.querySelector(`[data-overlay="${t}"]`);s&&s.remove();const i=document.createElement("div");return i.setAttribute("data-overlay",t),i.innerHTML=o,e.appendChild(i),i}function h(t){if(!u)return;const o=u.querySelector(`[data-overlay="${t}"]`);o&&o.remove()}function he(){u&&u.querySelectorAll("[data-overlay]").forEach(t=>t.remove())}async function be(t){O=t,y=await de(t),V()}function V(){if(!u)return;const t=u.querySelector(".brd-widget");t&&(t.style.right=y.edge==="right"?"0px":"auto",t.style.left=y.edge==="left"?"0px":"auto",t.style.bottom=`${y.verticalOffset}px`)}async function ue(){var s;const t=await chrome.runtime.sendMessage({type:"GET_SETTINGS"}),o=t!=null&&t.success&&((s=t.data)!=null&&s.theme)?t.data.theme:"light",e=document.getElementById(L);e&&(o==="dark"?e.classList.add("brd-dark"):e.classList.remove("brd-dark"))}function pe(t,o){let e=!1,s=0,i=0,a=y.edge;const r=l=>{l.target.closest("button, input, a")||(e=!0,s=l.clientY,i=window.innerHeight-t.getBoundingClientRect().bottom,a=y.edge,t.style.cursor="grabbing",t.style.transition="none",l.preventDefault())},n=l=>{if(!e)return;const g=s-l.clientY,w=i+g;t.style.left=a==="left"?"0px":"auto",t.style.right=a==="right"?"0px":"auto",t.style.bottom=`${Math.max(0,Math.min(w,window.innerHeight-100))}px`},d=async l=>{if(!e)return;e=!1,t.style.cursor="grab",t.style.transition="all 0.2s ease";const g=l.clientX,w=window.innerWidth/2,E=g<w?"left":"right",C=t.getBoundingClientRect(),A=Math.max(0,window.innerHeight-C.bottom);y={edge:E,verticalOffset:Math.max(0,A)},V(),O&&await ce(O,y)};t.addEventListener("pointerdown",r),document.addEventListener("pointermove",n),document.addEventListener("pointerup",d),t.style.cursor="grab"}const me=`
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
`;function p(t){return new Promise(o=>{chrome.runtime.sendMessage(t,e=>{chrome.runtime.lastError?o({success:!1,error:chrome.runtime.lastError.message}):o(e??{success:!1,error:"No response"})})})}class fe{constructor(){c(this,"settings");c(this,"session");c(this,"enabled",!1);c(this,"tickTimer",null);c(this,"lastSignalAt",0);c(this,"lastActivityAt",0);c(this,"scrollCount",0);c(this,"swipeCount",0);c(this,"maxCookedShown",!1);c(this,"builtDifferentDismissed",!1)}async init(){var o;try{const e=await p({type:"GET_SETTINGS"});if(!e.success)return;if(this.settings=e.data,!this.settings.masterEnabled||!((o=this.settings.sites[this.site])!=null&&o.enabled)){console.log(`[brainrot detox] Disabled for ${this.site}`);return}const s=await this.getCurrentTabId();let i=await p({type:"GET_SESSION",payload:{tabId:s}});i.data?this.session=i.data:(this.session={site:this.site,tabId:s,startedAt:Date.now(),cookedScore:0,cookedStatus:"Based",lastInterventionAt:0,packState:{...f},touchGrass:{...x},vibeIntent:this.settings.vibeCheck.activeIntent,itemsConsumed:0,scrollEvents:0},await p({type:"UPDATE_SESSION",payload:{tabId:s,patch:this.session}})),this.enabled=!0,console.log(`[brainrot detox] ${this.site} adapter initialized`),this.mountCookedWidget(),this.setupObservers(),this.lastActivityAt=Date.now(),this.scheduleNextTick(),this.session.touchGrass.active&&this.session.touchGrass.endsAt>Date.now()&&this.showTouchGrassOverlay()}catch(e){console.error(`[brainrot detox] Init error for ${this.site}:`,e)}}destroy(){this.enabled=!1,this.tickTimer&&clearTimeout(this.tickTimer),this.removeAllOverlays()}scheduleNextTick(){this.tickTimer&&clearTimeout(this.tickTimer);const i=Date.now()-this.lastActivityAt<K?U:Y;this.tickTimer=window.setTimeout(()=>{this.tick(),this.scheduleNextTick()},i)}recordActivity(){this.lastActivityAt=Date.now()}async tick(){if(!this.enabled)return;const o=Date.now(),e=this.getNewItemsSinceLastTick();this.session.itemsConsumed+=e,this.session.scrollEvents+=this.scrollCount;const s=this.scrollCount>0||e>0||this.swipeCount>0;s&&(this.lastSignalAt=o);const i=this.lastSignalAt===0?0:o-this.lastSignalAt;if(this.builtDifferentDismissed&&s){this.builtDifferentDismissed=!1,this.scrollCount=0,this.swipeCount=0,this.onBuiltDifferentDenied();return}let a;if(this.session.packState.active)a=this.session.cookedScore;else if(this.site==="shorts")a=Q(this.session.cookedScore,this.swipeCount,this.session.vibeIntent,i);else{const n=(o-this.session.startedAt)/6e4,d=X(n,this.settings.cooked.sessionCapMinutes,this.session.scrollEvents,this.session.itemsConsumed);a=J(this.session.cookedScore,d,s,i,this.session.vibeIntent)}this.scrollCount=0,this.swipeCount=0,this.session.cookedScore=a,this.session.cookedStatus=ee(a,this.settings.cooked.thresholds),this.session.packState.active&&(this.session.packState=oe(this.session.packState,e),ie(this.session.packState,o)&&this.onPackComplete()),this.session.packState.active||(se(a)?this.maxCookedShown||(this.maxCookedShown=!0,this.onMaxCooked()):(a<95&&(this.maxCookedShown=!1),a>=this.session.cookedScore&&te(a,this.session.lastInterventionAt,this.settings.cooked.thresholds,o)&&(this.session.lastInterventionAt=o,this.onIntervention()))),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus);const r=this.session.tabId;await p({type:"UPDATE_SESSION",payload:{tabId:r,patch:this.session}})}async getCurrentTabId(){return new Promise(o=>{const e=Math.floor(Math.random()*1e6);p({type:"GET_CURRENT_TAB"}).then(s=>{var i;o(((i=s.data)==null?void 0:i.id)??e)})})}onIntervention(){p({type:"LOG_EVENT",payload:{eventType:"intervention"}}),this.showInterventionOverlay()}onMaxCooked(){this.session.lastInterventionAt=Date.now(),p({type:"LOG_EVENT",payload:{eventType:"intervention"}}),this.showSkyrimOverlay("Your brain is absolutely cooked (x_x)")}onPackComplete(){this.session.packState={...f},this.maxCookedShown=!1,p({type:"END_PACK",payload:{tabId:this.session.tabId}}),this.showSkyrimOverlay("[#] Pack Complete! Time to touch grass.")}onBuiltDifferentDenied(){this.showBuiltDifferentDeniedOverlay()}async startPack(o,e){await p({type:"START_PACK",payload:{tabId:this.session.tabId,mode:o,limit:e}}),this.session.packState={active:!0,mode:o,limit:e,consumed:0,startedAt:Date.now()},this.session.cookedScore=0,this.session.cookedStatus="Based",this.maxCookedShown=!1,this.builtDifferentDismissed=!1}async startTouchGrass(o){await p({type:"START_TOUCH_GRASS",payload:{tabId:this.session.tabId,minutes:o}}),this.session.touchGrass={active:!0,endsAt:Date.now()+o*6e4,bypassCount:0},this.showTouchGrassOverlay()}async endTouchGrass(){await p({type:"END_TOUCH_GRASS",payload:{tabId:this.session.tabId}}),this.session.touchGrass={...x},this.session.cookedScore=0,this.session.cookedStatus="Based",this.maxCookedShown=!1,this.removeAllOverlays()}async bypassTouchGrass(){this.session.touchGrass.bypassCount++,p({type:"LOG_EVENT",payload:{eventType:"bypass"}}),await this.endTouchGrass()}setVibeIntent(o){this.session.vibeIntent=o,p({type:"UPDATE_SESSION",payload:{tabId:this.session.tabId,patch:{vibeIntent:o}}}),p({type:"LOG_EVENT",payload:{eventType:"vibe_check"}})}}class ge extends fe{constructor(){super(...arguments);c(this,"site","shorts");c(this,"itemsSinceLastTick",0);c(this,"lastVideoId","");c(this,"urlObserver",null);c(this,"onScroll",()=>{this.scrollCount++,this.recordActivity()});c(this,"onWheel",e=>{Math.abs(e.deltaY)>20&&(this.swipeCount++,this.recordActivity())});c(this,"onKeyDown",e=>{(e.key==="ArrowDown"||e.key==="j")&&(this.swipeCount++,this.itemsSinceLastTick++,this.recordActivity())})}getShortsVideo(){return document.querySelector("ytd-shorts video")??document.querySelector(".html5-main-video")??document.querySelector("video.video-stream")??null}freezeFeed(){const e=this.getShortsVideo();e&&!e.paused&&e.pause()}thawFeed(){const e=this.getShortsVideo();e&&e.paused&&e.play().catch(()=>{})}setupObservers(){window.addEventListener("scroll",this.onScroll,{passive:!0}),window.addEventListener("wheel",this.onWheel,{passive:!0}),window.addEventListener("keydown",this.onKeyDown,{passive:!0}),this.watchUrlChanges(),this.watchShortsContainer();let e=0;window.addEventListener("touchstart",s=>{var i;e=((i=s.touches[0])==null?void 0:i.clientY)??0},{passive:!0}),window.addEventListener("touchend",s=>{var a;const i=e-(((a=s.changedTouches[0])==null?void 0:a.clientY)??0);Math.abs(i)>50&&(this.swipeCount++,this.itemsSinceLastTick++,this.recordActivity())},{passive:!0}),chrome.runtime.onMessage.addListener((s,i,a)=>{var r,n,d;return s.type==="END_TOUCH_GRASS"?(this.session.touchGrass={active:!1,endsAt:0,bypassCount:0},h("skyrim"),h("touchgrass"),this.thawFeed(),a({success:!0}),!1):s.type==="TRIGGER_TOUCH_GRASS"?(this.startTouchGrass(((r=s.payload)==null?void 0:r.minutes)??5),a({success:!0}),!1):s.type==="TRIGGER_PACK"?(this.startPack(((n=s.payload)==null?void 0:n.mode)??"items",((d=s.payload)==null?void 0:d.limit)??10),a({success:!0}),!1):(s.type==="TRIGGER_VIBE_CHECK"&&(this.showVibeCheckOverlay(),a({success:!0})),!1)})}watchUrlChanges(){setInterval(()=>{const e=window.location.pathname.match(/\/shorts\/([^/?]+)/),s=(e==null?void 0:e[1])??"";s&&s!==this.lastVideoId&&(this.lastVideoId=s,this.itemsSinceLastTick++,this.swipeCount++,this.recordActivity())},500)}watchShortsContainer(){const e=new MutationObserver(()=>{const i=window.location.pathname.match(/\/shorts\/([^/?]+)/),a=(i==null?void 0:i[1])??"";a&&a!==this.lastVideoId&&(this.lastVideoId=a,this.itemsSinceLastTick++)}),s=()=>{const i=document.querySelector("ytd-shorts")||document.querySelector("#shorts-container")||document.body;e.observe(i,{childList:!0,subtree:!0})};document.readyState==="complete"?s():window.addEventListener("load",s),this.urlObserver=e}getNewItemsSinceLastTick(){const e=this.itemsSinceLastTick;return this.itemsSinceLastTick=0,e}async mountCookedWidget(){await be(this.site),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus)}updateCookedWidget(e,s){const i=R(s),a=s==="Based"?"brd-score-based":s==="Medium Cooked"?"brd-score-medium":"brd-score-cooked";let r="";if(this.session.packState.active){const l=ae(this.session.packState);r=`
        <div style="width:100%;margin-top:6px;">
          <div style="font-size:10px;color:#94a3b8;margin-bottom:3px;">${this.session.packState.mode==="time"&&l.timeRemaining?`[#] Pack: ${l.timeRemaining}`:`[#] Pack: ${l.current}/${l.total}`}</div>
          <div class="brd-pack-bar"><div class="brd-pack-fill" style="width:${l.percent}%"></div></div>
        </div>
      `}const d=S("widget",`
      <div class="brd-widget">
        <span class="brd-widget-emoji">${i.emoji}</span>
        <span class="brd-widget-label">${i.label}</span>
        <span class="brd-widget-score ${a}">${e}</span>
        ${r}
      </div>
    `).querySelector(".brd-widget");d&&pe(d,this.site)}showInterventionOverlay(){var i,a,r;const e=R(this.session.cookedStatus),s=S("intervention",`
      <div class="brd-fullscreen">
        <div class="brd-card">
          <h2>${e.emoji} ${e.label}!</h2>
          <p>Your scrolling score just hit ${this.session.cookedScore}. Your brain is getting crispy. Time to make a choice:</p>
          <div class="brd-btn-row">
            <button class="brd-btn brd-btn-ghost" data-action="dismiss">Keep Going [->]</button>
            <button class="brd-btn brd-btn-primary" data-action="pack">[#] Start Pack</button>
            <button class="brd-btn brd-btn-success" data-action="grass">[*] Touch Grass</button>
          </div>
        </div>
      </div>
    `);(i=s.querySelector("[data-action='dismiss']"))==null||i.addEventListener("click",()=>h("intervention")),(a=s.querySelector("[data-action='pack']"))==null||a.addEventListener("click",()=>{h("intervention"),this.startPack("items",10)}),(r=s.querySelector("[data-action='grass']"))==null||r.addEventListener("click",()=>{h("intervention"),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)})}showBuiltDifferentDeniedOverlay(){var s,i,a;this.freezeFeed();const e=S("denied",`
      <div class="brd-fullscreen">
        <div class="brd-card">
          <h2 style="font-size:28px;text-align:center;color:#f87171;">No you are not.</h2>
          <p style="text-align:center;">You thought you could just scroll away? Pick one.</p>
          <div class="brd-btn-row" style="justify-content:center;">
            <button class="brd-btn brd-btn-success" data-action="grass">[*] Touch Grass (5 min)</button>
            <button class="brd-btn brd-btn-primary" data-action="pack">[#] Start Pack</button>
            <button class="brd-btn brd-btn-ghost" data-action="vibe">[?] Vibe Check</button>
          </div>
        </div>
      </div>
    `);(s=e.querySelector("[data-action='grass']"))==null||s.addEventListener("click",()=>{h("denied"),this.thawFeed(),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)}),(i=e.querySelector("[data-action='pack']"))==null||i.addEventListener("click",()=>{h("denied"),this.thawFeed(),this.startPack("items",10)}),(a=e.querySelector("[data-action='vibe']"))==null||a.addEventListener("click",()=>{h("denied"),this.thawFeed(),this.showVibeCheckOverlay()})}showSkyrimOverlay(e){var r,n,d;const s=chrome.runtime.getURL("assets/skyrim-skeleton.mp4");this.freezeFeed();const i=S("skyrim",`
      <div class="brd-fullscreen">
        <div class="brd-video-wrap">
          <video playsinline></video>
        </div>
        <div class="brd-message">${e}</div>
        <div class="brd-btn-row">
          <button class="brd-btn brd-btn-success" data-action="grass">[*] Touch Grass (5 min)</button>
          <button class="brd-btn brd-btn-primary" data-action="pack">[#] Start Pack</button>
          <button class="brd-btn brd-btn-ghost" data-action="dismiss">I'm Built Different [+]</button>
        </div>
      </div>
    `),a=i.querySelector("video");a&&(a.src=s,a.load(),a.play().catch(()=>{})),(r=i.querySelector("[data-action='grass']"))==null||r.addEventListener("click",()=>{h("skyrim"),this.thawFeed(),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)}),(n=i.querySelector("[data-action='pack']"))==null||n.addEventListener("click",()=>{h("skyrim"),this.thawFeed(),this.startPack("items",10)}),(d=i.querySelector("[data-action='dismiss']"))==null||d.addEventListener("click",()=>{h("skyrim"),this.thawFeed(),this.builtDifferentDismissed=!0})}showTouchGrassOverlay(){var q;const e=this.session.touchGrass.endsAt,s=B.sort(()=>Math.random()-.5).slice(0,3);this.freezeFeed();const a=[...["https://cataas.com/cat?width=900&height=700&t=1","https://cataas.com/cat?width=900&height=700&t=2","https://cataas.com/cat?width=900&height=700&t=3","https://cataas.com/cat?width=900&height=700&t=4","https://cataas.com/cat?width=900&height=700&t=5","https://cataas.com/cat?width=900&height=700&t=6","https://cataas.com/cat?width=900&height=700&t=7","https://cataas.com/cat?width=900&height=700&t=8","https://cataas.com/cat?width=900&height=700&t=9","https://cataas.com/cat?width=900&height=700&t=10","WEBCAM","https://cataas.com/cat?width=900&height=700&t=11","https://cataas.com/cat?width=900&height=700&t=12","https://cataas.com/cat?width=900&height=700&t=13","https://cataas.com/cat?width=900&height=700&t=14","https://cataas.com/cat?width=900&height=700&t=15","WEBCAM"]].sort(()=>Math.random()-.5),r=S("touchgrass",`
      <div class="brd-fullscreen brd-zen-bg">
        <div class="brd-zen-slide-wrap">
          <img class="brd-zen-img" src="" alt="zen" />
          <video class="brd-zen-webcam" autoplay muted playsinline style="display:none;"></video>
          <div class="brd-zen-caption"></div>
        </div>
        <div class="brd-zen-card">
          <div class="brd-zen-header">[*] Touch Grass Mode</div>
          <div class="brd-timer" id="brd-tg-timer">00:00</div>
          <div class="brd-tips">
            ${s.map(m=>`<div class="brd-tip">${m}</div>`).join("")}
          </div>
          <div class="brd-btn-row" style="justify-content:center;">
            <button class="brd-btn brd-btn-danger" data-action="bypass">Emergency Bypass (will be logged)</button>
          </div>
        </div>
      </div>
    `),n=r.querySelector(".brd-zen-img"),d=r.querySelector(".brd-zen-webcam"),l=r.querySelector(".brd-zen-caption");let g=null,w=0;const E=["breathe.","you are here.","it's okay.","look at this.","touch grass.","be present.","slow down.","this is real life.","you look great btw.","hi.","go outside.","drink water."],C=async m=>{const T=a[m%a.length];if(T==="WEBCAM"){if(n.style.display="none",d.style.display="block",l.textContent="hi. this is you. say hi.",!g)try{g=await navigator.mediaDevices.getUserMedia({video:!0,audio:!1}),d.srcObject=g}catch{C(m+1);return}}else d.style.display="none",n.style.display="block",n.src=T,l.textContent=E[Math.floor(Math.random()*E.length)]};C(w);const A=setInterval(()=>{w++,C(w)},4e3);let b=null,k=null;try{b=new AudioContext,k=b.createGain(),k.gain.setValueAtTime(0,b.currentTime),k.gain.linearRampToValueAtTime(.06,b.currentTime+2),k.connect(b.destination);const m=[110,165,220];m.forEach((T,_)=>{const I=b.createOscillator(),M=b.createGain();I.type="sine",I.frequency.setValueAtTime(T,b.currentTime),M.gain.setValueAtTime(1/m.length,b.currentTime),I.connect(M),M.connect(k),I.start();const G=b.createOscillator(),P=b.createGain();G.frequency.setValueAtTime(.15+_*.05,b.currentTime),P.gain.setValueAtTime(.015,b.currentTime),G.connect(P),P.connect(M.gain),G.start()})}catch{}const N=r.querySelector("#brd-tg-timer"),$=setInterval(()=>{const m=Math.max(0,e-Date.now()),T=Math.floor(m/6e4),_=Math.floor(m%6e4/1e3);N&&(N.textContent=`${String(T).padStart(2,"0")}:${String(_).padStart(2,"0")}`),m<=0&&(clearInterval($),clearInterval(A),this.stopZenAudio(b,k),this.stopWebcam(g),this.endTouchGrass(),this.thawFeed(),h("touchgrass"))},1e3);(q=r.querySelector("[data-action='bypass']"))==null||q.addEventListener("click",()=>{clearInterval($),clearInterval(A),this.stopZenAudio(b,k),this.stopWebcam(g),this.bypassTouchGrass(),this.thawFeed(),h("touchgrass")})}stopZenAudio(e,s){if(!(!e||!s))try{s.gain.linearRampToValueAtTime(0,e.currentTime+.5),setTimeout(()=>e.close(),600)}catch{}}stopWebcam(e){e&&e.getTracks().forEach(s=>s.stop())}showVibeCheckOverlay(){var i;const e=F.map(a=>`
      <div class="brd-vibe-card" data-vibe="${a.id}">
        <span class="brd-vibe-emoji">${a.emoji}</span>
        <span class="brd-vibe-label">${a.label}</span>
      </div>
    `).join(""),s=S("vibecheck",`
      <div class="brd-fullscreen">
        <div class="brd-card">
          <h2>[?] Vibe Check</h2>
          <p>What are you here for? This adjusts how strict the cooked meter is.</p>
          <div class="brd-vibe-grid">
            ${e}
          </div>
          <div class="brd-btn-row" style="justify-content:center;">
            <button class="brd-btn brd-btn-ghost" data-action="skip">Skip</button>
          </div>
        </div>
      </div>
    `);s.querySelectorAll("[data-vibe]").forEach(a=>{a.addEventListener("click",()=>{const r=a.dataset.vibe;this.setVibeIntent(r),h("vibecheck")})}),(i=s.querySelector("[data-action='skip']"))==null||i.addEventListener("click",()=>{h("vibecheck")})}removeAllOverlays(){he(),this.thawFeed()}}console.log("[brainrot detox] Shorts content script loaded"),new ge().init()})();
