var me=Object.defineProperty;var ge=(g,f,k)=>f in g?me(g,f,{enumerable:!0,configurable:!0,writable:!0,value:k}):g[f]=k;var c=(g,f,k)=>ge(g,typeof f!="symbol"?f+"":f,k);(function(){"use strict";const g={basedMax:35,mediumMax:65,intervention:80,cooldownMs:6e4},f={active:!1,mode:"items",limit:10,consumed:0,startedAt:0},k={active:!1,endsAt:0,bypassCount:0},F=["[>] Step outside for 2 minutes","[~] Drink a glass of water","[o] Do 5 deep breaths","[!] Do 10 jumping jacks","[*] Look at something 20 feet away for 20 seconds","[♪] Put on your favorite song","[>] Text a friend something nice","[=] Open a window and feel the air"],E={based:{emoji:"( ._.)",label:"Based",hint:"Keep it chill, you're doing great."},medium:{emoji:"(-_-;)",label:"Medium Cooked",hint:"Maybe take a breather soon?"},cooked:{emoji:"(x_x) ",label:"Absolutely Cooked",hint:"Bro. Step away from the screen."}},W=[{id:"Chill",emoji:"~_~",label:"Just Vibing"},{id:"Learn",emoji:"o_O",label:"Learn Something"},{id:"Laugh",emoji:"xD",label:"Get Entertained"},{id:"Music",emoji:"♪♫",label:"Music / Audio"},{id:"JustHere",emoji:"...",label:"I'm Just Here"}],D=.3,U=15e3,V=500,Y=3e3,K=2e3,J={edge:"right",verticalOffset:20};function X(e,o,t,s){const i=Math.min(1,e/o),a=Math.min(1,t/150),r=Math.min(1,s/60),n=i*35+a*35+r*30;return Math.round(Math.min(100,n))}function Z(e,o,t,s,i){const a=i==="Learn"?1.3:i==="JustHere"?1.1:i==="Laugh"?.8:i==="Chill"?.7:1;if(t){const n=o*a,d=e*(1-D)+n*D;return Math.max(0,Math.min(100,Math.round(d)))}if(s<U)return e;const r=s<45e3?1:s<9e4?2:4;return Math.max(0,e-r)}function Q(e,o,t,s){return o>0?Math.max(0,Math.min(100,e+o)):s<(t==="Chill"||t==="Laugh"?15e3:t==="Learn"||t==="JustHere"?25e3:2e4)?e:s<6e4?Math.max(0,e-1):Math.max(0,e-3)}function L(e,o=g){return e<=o.basedMax?"Based":e<=o.mediumMax?"Medium Cooked":"Absolutely Cooked"}function _(e){return e==="Based"?E.based:e==="Medium Cooked"?E.medium:E.cooked}function O(e,o,t=g,s=Date.now()){return!(e<t.intervention||s-o<t.cooldownMs)}function G(e){return e>=100}function ee(e,o,t,s){return o>0?Math.max(0,Math.min(100,e+o)):s<(t==="Chill"||t==="Laugh"?15e3:t==="Learn"||t==="JustHere"?25e3:2e4)?e:s<6e4?Math.max(0,e-1):Math.max(0,e-3)}function h(e){return new Promise(o=>{chrome.runtime.sendMessage(e,t=>{chrome.runtime.lastError?o({success:!1,error:chrome.runtime.lastError.message}):o(t??{success:!1,error:"No response"})})})}function P(e,o=1){return e.active?{...e,consumed:e.consumed+o}:e}function z(e,o=Date.now()){return e.active?e.mode==="items"?e.consumed>=e.limit:e.mode==="time"?(o-e.startedAt)/6e4>=e.limit:!1:!1}function te(e,o=Date.now()){if(!e.active)return{current:0,total:0,percent:0};if(e.mode==="items")return{current:e.consumed,total:e.limit,percent:Math.min(100,Math.round(e.consumed/e.limit*100))};const t=(o-e.startedAt)/6e4,s=Math.max(0,e.limit-t),i=Math.floor(s),a=Math.floor((s-i)*60);return{current:Math.round(t),total:e.limit,percent:Math.min(100,Math.round(t/e.limit*100)),timeRemaining:`${String(i).padStart(2,"0")}:${String(a).padStart(2,"0")}`}}const R="brd_widget_positions";async function se(e,o){return(await chrome.storage.local.get(e))[e]??o}async function oe(e,o){await chrome.storage.local.set({[e]:o})}async function H(){return se(R,{})}async function ie(e){return(await H())[e]??J}async function ae(e,o){const t=await H();t[e]=o,await oe(R,t)}const I="brd-overlay-host";let u=null,A=null,v={edge:"right",verticalOffset:20};function re(){if(u)return u;let e=document.getElementById(I);if(e||(e=document.createElement("div"),e.id=I,e.style.cssText="position:fixed;top:0;left:0;width:0;height:0;z-index:2147483647;pointer-events:none;",document.documentElement.appendChild(e)),e.shadowRoot)return u=e.shadowRoot,u;u=e.attachShadow({mode:"open"});const o=document.createElement("style");o.textContent=he,u.appendChild(o);const t=document.createElement("link");return t.rel="stylesheet",t.href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap",u.appendChild(t),ce(),u}function x(e,o){const t=re(),s=t.querySelector(`[data-overlay="${e}"]`);s&&s.remove();const i=document.createElement("div");return i.setAttribute("data-overlay",e),i.innerHTML=o,t.appendChild(i),i}function b(e){if(!u)return;const o=u.querySelector(`[data-overlay="${e}"]`);o&&o.remove()}function ne(){u&&u.querySelectorAll("[data-overlay]").forEach(e=>e.remove())}async function de(e){A=e,v=await ie(e),N()}function N(){if(!u)return;const e=u.querySelector(".brd-widget");e&&(e.style.right=v.edge==="right"?"0px":"auto",e.style.left=v.edge==="left"?"0px":"auto",e.style.bottom=`${v.verticalOffset}px`)}async function ce(){var s;const e=await chrome.runtime.sendMessage({type:"GET_SETTINGS"}),o=e!=null&&e.success&&((s=e.data)!=null&&s.theme)?e.data.theme:"light",t=document.getElementById(I);t&&(o==="dark"?t.classList.add("brd-dark"):t.classList.remove("brd-dark"))}function le(e,o){let t=!1,s=0,i=0,a=v.edge;const r=l=>{l.target.closest("button, input, a")||(t=!0,s=l.clientY,i=window.innerHeight-e.getBoundingClientRect().bottom,a=v.edge,e.style.cursor="grabbing",e.style.transition="none",l.preventDefault())},n=l=>{if(!t)return;const p=s-l.clientY,y=i+p;e.style.left=a==="left"?"0px":"auto",e.style.right=a==="right"?"0px":"auto",e.style.bottom=`${Math.max(0,Math.min(y,window.innerHeight-100))}px`},d=async l=>{if(!t)return;t=!1,e.style.cursor="grab",e.style.transition="all 0.2s ease";const p=l.clientX,y=window.innerWidth/2,S=p<y?"left":"right",w=e.getBoundingClientRect(),C=Math.max(0,window.innerHeight-w.bottom);v={edge:S,verticalOffset:Math.max(0,C)},N(),A&&await ae(A,v)};e.addEventListener("pointerdown",r),document.addEventListener("pointermove",n),document.addEventListener("pointerup",d),e.style.cursor="grab"}const he=`
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
`;class be{constructor(){c(this,"settings");c(this,"session");c(this,"enabled",!1);c(this,"tickTimer",null);c(this,"lastSignalAt",0);c(this,"lastActivityAt",0);c(this,"scrollCount",0);c(this,"swipeCount",0);c(this,"maxCookedShown",!1);c(this,"builtDifferentDismissed",!1)}async init(){var o;try{const t=await h({type:"GET_SETTINGS"});if(!t.success)return;if(this.settings=t.data,!this.settings.masterEnabled||!((o=this.settings.sites[this.site])!=null&&o.enabled)){console.log(`[brainrot detox] Disabled for ${this.site}`);return}const s=await this.getCurrentTabId();let i=await h({type:"GET_SESSION",payload:{tabId:s}});i.data?this.session=i.data:(this.session={site:this.site,tabId:s,startedAt:Date.now(),cookedScore:0,cookedStatus:"Based",lastInterventionAt:0,packState:{...f},touchGrass:{...k},vibeIntent:this.settings.vibeCheck.activeIntent,itemsConsumed:0,scrollEvents:0},await h({type:"UPDATE_SESSION",payload:{tabId:s,patch:this.session}})),this.enabled=!0,console.log(`[brainrot detox] ${this.site} adapter initialized`),this.mountCookedWidget(),this.setupObservers(),this.lastActivityAt=Date.now(),this.scheduleNextTick(),this.session.touchGrass.active&&this.session.touchGrass.endsAt>Date.now()&&this.showTouchGrassOverlay()}catch(t){console.error(`[brainrot detox] Init error for ${this.site}:`,t)}}destroy(){this.enabled=!1,this.tickTimer&&clearTimeout(this.tickTimer),this.removeAllOverlays()}scheduleNextTick(){this.tickTimer&&clearTimeout(this.tickTimer);const i=Date.now()-this.lastActivityAt<K?V:Y;this.tickTimer=window.setTimeout(()=>{this.tick(),this.scheduleNextTick()},i)}recordActivity(){this.lastActivityAt=Date.now()}async tick(){if(!this.enabled)return;const o=Date.now(),t=this.getNewItemsSinceLastTick();this.session.itemsConsumed+=t,this.session.scrollEvents+=this.scrollCount;const s=this.scrollCount>0||t>0||this.swipeCount>0;s&&(this.lastSignalAt=o);const i=this.lastSignalAt===0?0:o-this.lastSignalAt;if(this.builtDifferentDismissed&&s){this.builtDifferentDismissed=!1,this.scrollCount=0,this.swipeCount=0,this.onBuiltDifferentDenied();return}let a;if(this.session.packState.active)a=this.session.cookedScore;else if(this.site==="shorts")a=Q(this.session.cookedScore,this.swipeCount,this.session.vibeIntent,i);else{const n=(o-this.session.startedAt)/6e4,d=X(n,this.settings.cooked.sessionCapMinutes,this.session.scrollEvents,this.session.itemsConsumed);a=Z(this.session.cookedScore,d,s,i,this.session.vibeIntent)}this.scrollCount=0,this.swipeCount=0,this.session.cookedScore=a,this.session.cookedStatus=L(a,this.settings.cooked.thresholds),this.session.packState.active&&(this.session.packState=P(this.session.packState,t),z(this.session.packState,o)&&this.onPackComplete()),this.session.packState.active||(G(a)?this.maxCookedShown||(this.maxCookedShown=!0,this.onMaxCooked()):(a<95&&(this.maxCookedShown=!1),a>=this.session.cookedScore&&O(a,this.session.lastInterventionAt,this.settings.cooked.thresholds,o)&&(this.session.lastInterventionAt=o,this.onIntervention()))),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus);const r=this.session.tabId;await h({type:"UPDATE_SESSION",payload:{tabId:r,patch:this.session}})}async getCurrentTabId(){return new Promise(o=>{const t=Math.floor(Math.random()*1e6);h({type:"GET_CURRENT_TAB"}).then(s=>{var i;o(((i=s.data)==null?void 0:i.id)??t)})})}onIntervention(){h({type:"LOG_EVENT",payload:{eventType:"intervention"}}),this.showInterventionOverlay()}onMaxCooked(){this.session.lastInterventionAt=Date.now(),h({type:"LOG_EVENT",payload:{eventType:"intervention"}}),this.showSkyrimOverlay("Your brain is absolutely cooked (x_x)")}onPackComplete(){this.session.packState={...f},this.maxCookedShown=!1,h({type:"END_PACK",payload:{tabId:this.session.tabId}}),this.showSkyrimOverlay("[#] Pack Complete! Time to touch grass.")}onBuiltDifferentDenied(){this.showBuiltDifferentDeniedOverlay()}async startPack(o,t){await h({type:"START_PACK",payload:{tabId:this.session.tabId,mode:o,limit:t}}),this.session.packState={active:!0,mode:o,limit:t,consumed:0,startedAt:Date.now()},this.session.cookedScore=0,this.session.cookedStatus="Based",this.maxCookedShown=!1,this.builtDifferentDismissed=!1}async startTouchGrass(o){await h({type:"START_TOUCH_GRASS",payload:{tabId:this.session.tabId,minutes:o}}),this.session.touchGrass={active:!0,endsAt:Date.now()+o*6e4,bypassCount:0},this.showTouchGrassOverlay()}async endTouchGrass(){await h({type:"END_TOUCH_GRASS",payload:{tabId:this.session.tabId}}),this.session.touchGrass={...k},this.session.cookedScore=0,this.session.cookedStatus="Based",this.maxCookedShown=!1,this.removeAllOverlays()}async bypassTouchGrass(){this.session.touchGrass.bypassCount++,h({type:"LOG_EVENT",payload:{eventType:"bypass"}}),await this.endTouchGrass()}setVibeIntent(o){this.session.vibeIntent=o,h({type:"UPDATE_SESSION",payload:{tabId:this.session.tabId,patch:{vibeIntent:o}}}),h({type:"LOG_EVENT",payload:{eventType:"vibe_check"}})}}class ue extends be{constructor(){super(...arguments);c(this,"site","instagram-reels");c(this,"itemsSinceLastTick",0);c(this,"lastReelId","");c(this,"urlObserver",null);c(this,"lastWheelTime",0);c(this,"WHEEL_DEBOUNCE_MS",500);c(this,"onWheel",t=>{const s=Date.now();Math.abs(t.deltaY)>20&&s-this.lastWheelTime>this.WHEEL_DEBOUNCE_MS&&(this.lastWheelTime=s,this.swipeCount++,this.itemsSinceLastTick++,this.recordActivity())});c(this,"onKeyDown",t=>{(t.key==="ArrowDown"||t.key==="j")&&(this.swipeCount++,this.itemsSinceLastTick++,this.recordActivity())})}getReelsVideo(){return document.querySelector("div[role='presentation'] video")??document.querySelector("._ac8m video")??document.querySelector("video")}freezeFeed(){const t=this.getReelsVideo();t&&!t.paused&&t.pause()}thawFeed(){const t=this.getReelsVideo();t&&t.paused&&t.play().catch(()=>{})}setupObservers(){window.addEventListener("wheel",this.onWheel,{passive:!0}),window.addEventListener("keydown",this.onKeyDown,{passive:!0});let t=0;window.addEventListener("touchstart",s=>{var i;t=((i=s.touches[0])==null?void 0:i.clientY)??0},{passive:!0}),window.addEventListener("touchend",s=>{var a;const i=t-(((a=s.changedTouches[0])==null?void 0:a.clientY)??0);Math.abs(i)>50&&(this.swipeCount++,this.itemsSinceLastTick++,this.recordActivity())},{passive:!0}),this.watchReelChanges(),chrome.runtime.onMessage.addListener((s,i,a)=>{var r,n,d;return s.type==="END_TOUCH_GRASS"?(this.session.touchGrass={active:!1,endsAt:0,bypassCount:0},b("skyrim"),b("touchgrass"),this.thawFeed(),a({success:!0}),!1):s.type==="TRIGGER_TOUCH_GRASS"?(this.startTouchGrass(((r=s.payload)==null?void 0:r.minutes)??5),a({success:!0}),!1):s.type==="TRIGGER_PACK"?(this.startPack(((n=s.payload)==null?void 0:n.mode)??"items",((d=s.payload)==null?void 0:d.limit)??10),a({success:!0}),!1):(s.type==="TRIGGER_VIBE_CHECK"&&(this.showVibeCheckOverlay(),a({success:!0})),!1)})}watchReelChanges(){const t=()=>{const a=window.location.pathname.match(/\/reel\/([^/?]+)/),r=(a==null?void 0:a[1])??"";r&&r!==this.lastReelId&&(this.lastReelId=r,this.itemsSinceLastTick++,this.swipeCount++)};setInterval(t,500);const s=new MutationObserver(()=>t()),i=()=>{const a=document.querySelector("div[role='presentation']")??document.querySelector("main")??document.body;s.observe(a,{childList:!0,subtree:!0})};document.readyState==="complete"?i():window.addEventListener("load",i),this.urlObserver=s}getNewItemsSinceLastTick(){const t=this.itemsSinceLastTick;return this.itemsSinceLastTick=0,t}async tick(){if(!this.enabled)return;const t=Date.now(),s=this.getNewItemsSinceLastTick();this.session.itemsConsumed+=s,this.session.scrollEvents+=this.scrollCount;const i=this.scrollCount>0||s>0||this.swipeCount>0;i&&(this.lastSignalAt=t);const a=this.lastSignalAt===0?0:t-this.lastSignalAt;if(this.builtDifferentDismissed&&i){this.builtDifferentDismissed=!1,this.scrollCount=0,this.swipeCount=0,this.onBuiltDifferentDenied();return}let r;this.session.packState.active?r=this.session.cookedScore:r=ee(this.session.cookedScore,this.swipeCount,this.session.vibeIntent,a),this.scrollCount=0,this.swipeCount=0,this.session.cookedScore=r,this.session.cookedStatus=L(r,this.settings.cooked.thresholds),this.session.packState.active&&(this.session.packState=P(this.session.packState,s),z(this.session.packState,t)&&this.onPackComplete()),this.session.packState.active||(G(r)?this.maxCookedShown||(this.maxCookedShown=!0,this.onMaxCooked()):(r<95&&(this.maxCookedShown=!1),r>=this.session.cookedScore&&O(r,this.session.lastInterventionAt,this.settings.cooked.thresholds,t)&&(this.session.lastInterventionAt=t,this.onIntervention()))),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus),await h({type:"UPDATE_SESSION",payload:{tabId:this.session.tabId,patch:this.session}})}async mountCookedWidget(){await de(this.site),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus)}updateCookedWidget(t,s){const i=_(s),a=s==="Based"?"brd-score-based":s==="Medium Cooked"?"brd-score-medium":"brd-score-cooked";let r="";if(this.session.packState.active){const l=te(this.session.packState);r=`
                <div style="width:100%;margin-top:6px;">
                    <div style="font-size:10px;color:#94a3b8;margin-bottom:3px;">${this.session.packState.mode==="time"&&l.timeRemaining?`[#] Pack: ${l.timeRemaining}`:`[#] Pack: ${l.current}/${l.total}`}</div>
                    <div class="brd-pack-bar"><div class="brd-pack-fill" style="width:${l.percent}%"></div></div>
                </div>
            `}const d=x("widget",`
            <div class="brd-widget">
                <span class="brd-widget-emoji">${i.emoji}</span>
                <span class="brd-widget-label">${i.label}</span>
                <span class="brd-widget-score ${a}">${t}</span>
                ${r}
            </div>
        `).querySelector(".brd-widget");d&&(d.style.cursor="pointer",d.onclick=()=>this.showVibeCheckOverlay(),le(d,this.site))}showInterventionOverlay(){var i,a,r;const t=_(this.session.cookedStatus),s=x("intervention",`
            <div class="brd-fullscreen">
                <div class="brd-card">
                    <h2>${t.emoji} ${t.label}!</h2>
                    <p>Your scrolling score just hit ${this.session.cookedScore}. Your brain is getting crispy. Time to make a choice:</p>
                    <div class="brd-btn-row">
                        <button class="brd-btn brd-btn-ghost" data-action="dismiss">Keep Going [->]</button>
                        <button class="brd-btn brd-btn-primary" data-action="pack">[#] Start Pack</button>
                        <button class="brd-btn brd-btn-success" data-action="grass">[*] Touch Grass</button>
                    </div>
                </div>
            </div>
        `);(i=s.querySelector("[data-action='dismiss']"))==null||i.addEventListener("click",()=>b("intervention")),(a=s.querySelector("[data-action='pack']"))==null||a.addEventListener("click",()=>{b("intervention"),this.startPack("items",10)}),(r=s.querySelector("[data-action='grass']"))==null||r.addEventListener("click",()=>{b("intervention"),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)})}showBuiltDifferentDeniedOverlay(){var s,i,a;this.freezeFeed();const t=x("denied",`
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
        `);(s=t.querySelector("[data-action='grass']"))==null||s.addEventListener("click",()=>{b("denied"),this.thawFeed(),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)}),(i=t.querySelector("[data-action='pack']"))==null||i.addEventListener("click",()=>{b("denied"),this.thawFeed(),this.startPack("items",10)}),(a=t.querySelector("[data-action='vibe']"))==null||a.addEventListener("click",()=>{b("denied"),this.thawFeed(),this.showVibeCheckOverlay()})}showSkyrimOverlay(t){var r,n,d;const s=chrome.runtime.getURL("assets/skyrim-skeleton.mp4");this.freezeFeed();const i=x("skyrim",`
            <div class="brd-fullscreen">
                <div class="brd-video-wrap">
                    <video playsinline></video>
                </div>
                <div class="brd-message">${t}</div>
                <div class="brd-btn-row">
                    <button class="brd-btn brd-btn-success" data-action="grass">[*] Touch Grass (5 min)</button>
                    <button class="brd-btn brd-btn-primary" data-action="pack">[#] Start Pack</button>
                    <button class="brd-btn brd-btn-ghost" data-action="dismiss">I'm Built Different [+]</button>
                </div>
            </div>
        `),a=i.querySelector("video");a&&(a.src=s,a.load(),a.play().catch(()=>{})),(r=i.querySelector("[data-action='grass']"))==null||r.addEventListener("click",()=>{b("skyrim"),this.thawFeed(),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)}),(n=i.querySelector("[data-action='pack']"))==null||n.addEventListener("click",()=>{b("skyrim"),this.thawFeed(),this.startPack("items",10)}),(d=i.querySelector("[data-action='dismiss']"))==null||d.addEventListener("click",()=>{b("skyrim"),this.thawFeed(),this.builtDifferentDismissed=!0})}showTouchGrassOverlay(){var q;const t=this.session.touchGrass.endsAt,s=F.sort(()=>Math.random()-.5).slice(0,3);this.freezeFeed();const a=[...["https://cataas.com/cat?width=900&height=700&t=1","https://cataas.com/cat?width=900&height=700&t=2","https://cataas.com/cat?width=900&height=700&t=3","https://cataas.com/cat?width=900&height=700&t=4","WEBCAM","https://cataas.com/cat?width=900&height=700&t=5","https://cataas.com/cat?width=900&height=700&t=6"]].sort(()=>Math.random()-.5),r=x("touchgrass",`
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
        `),n=r.querySelector(".brd-zen-img"),d=r.querySelector(".brd-zen-webcam"),l=r.querySelector(".brd-zen-caption");let p=null,y=0;const S=["breathe.","you are here.","it's okay.","look at this.","touch grass.","be present.","slow down.","this is real life."],w=async m=>{const T=a[m%a.length];if(T==="WEBCAM"){if(n.style.display="none",d.style.display="block",l.textContent="hi. this is you.",!p)try{p=await navigator.mediaDevices.getUserMedia({video:!0,audio:!1}),d.srcObject=p}catch{w(m+1)}}else d.style.display="none",n.style.display="block",n.src=T,l.textContent=S[Math.floor(Math.random()*S.length)]};w(y);const C=setInterval(()=>{y++,w(y)},4e3),B=r.querySelector("#brd-tg-timer"),$=setInterval(()=>{const m=Math.max(0,t-Date.now()),T=Math.floor(m/6e4),pe=Math.floor(m%6e4/1e3);B&&(B.textContent=`${String(T).padStart(2,"0")}:${String(pe).padStart(2,"0")}`),m<=0&&(clearInterval($),clearInterval(C),p&&p.getTracks().forEach(fe=>fe.stop()),this.endTouchGrass(),this.thawFeed(),b("touchgrass"))},1e3);(q=r.querySelector("[data-action='bypass']"))==null||q.addEventListener("click",()=>{clearInterval($),clearInterval(C),p&&p.getTracks().forEach(m=>m.stop()),this.bypassTouchGrass(),this.thawFeed(),b("touchgrass")})}showVibeCheckOverlay(){var i;const t=W.map(a=>`
            <div class="brd-vibe-card" data-vibe="${a.id}">
                <span class="brd-vibe-emoji">${a.emoji}</span>
                <span class="brd-vibe-label">${a.label}</span>
            </div>
        `).join(""),s=x("vibecheck",`
            <div class="brd-fullscreen">
                <div class="brd-card">
                    <h2>[?] Vibe Check</h2>
                    <p>What are you here for?</p>
                    <div class="brd-vibe-grid">
                        ${t}
                    </div>
                    <div class="brd-btn-row" style="justify-content:center;">
                        <button class="brd-btn brd-btn-ghost" data-action="skip">Skip</button>
                    </div>
                </div>
            </div>
        `);s.querySelectorAll("[data-vibe]").forEach(a=>{a.addEventListener("click",()=>{const r=a.dataset.vibe;this.setVibeIntent(r),b("vibecheck")})}),(i=s.querySelector("[data-action='skip']"))==null||i.addEventListener("click",()=>{b("vibecheck")})}removeAllOverlays(){ne(),this.thawFeed()}}console.log("[brainrot detox] Instagram Reels content script loaded");const M=new ue;M.init();let j=location.href;new MutationObserver(()=>{location.href!==j&&(j=location.href,(location.pathname.includes("/reels")||location.pathname.includes("/reel"))&&(M.destroy(),M.init()))}).observe(document.body,{subtree:!0,childList:!0})})();
