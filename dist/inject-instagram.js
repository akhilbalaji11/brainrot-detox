var ge=Object.defineProperty;var ve=(v,m,x)=>m in v?ge(v,m,{enumerable:!0,configurable:!0,writable:!0,value:x}):v[m]=x;var l=(v,m,x)=>ve(v,typeof m!="symbol"?m+"":m,x);(function(){"use strict";const v={basedMax:35,mediumMax:65,intervention:80,cooldownMs:6e4},m={active:!1,mode:"items",limit:10,consumed:0,startedAt:0},x={active:!1,endsAt:0,bypassCount:0},W=["[>] Step outside for 2 minutes","[~] Drink a glass of water","[o] Do 5 deep breaths","[!] Do 10 jumping jacks","[*] Look at something 20 feet away for 20 seconds","[♪] Put on your favorite song","[>] Text a friend something nice","[=] Open a window and feel the air"],I={based:{emoji:"( ._.)",label:"Based",hint:"Keep it chill, you're doing great."},medium:{emoji:"(-_-;)",label:"Medium Cooked",hint:"Maybe take a breather soon?"},cooked:{emoji:"(x_x) ",label:"Absolutely Cooked",hint:"Bro. Step away from the screen."}},U=[{id:"Chill",emoji:"~_~",label:"Just Vibing"},{id:"Learn",emoji:"o_O",label:"Learn Something"},{id:"Laugh",emoji:"xD",label:"Get Entertained"},{id:"Music",emoji:"♪♫",label:"Music / Audio"},{id:"JustHere",emoji:"...",label:"I'm Just Here"}],L=.3,V=15e3,Y=500,K=3e3,J=2e3,X={edge:"right",verticalOffset:20};function Z(e,o,t,s){const a=Math.min(1,e/o),i=Math.min(1,t/150),r=Math.min(1,s/60),d=a*35+i*35+r*30;return Math.round(Math.min(100,d))}function Q(e,o,t,s,a){const i=a==="Learn"?1.3:a==="JustHere"?1.1:a==="Laugh"?.8:a==="Chill"?.7:1;if(t){const d=o*i,n=e*(1-L)+d*L;return Math.max(0,Math.min(100,Math.round(n)))}if(s<V)return e;const r=s<45e3?1:s<9e4?2:4;return Math.max(0,e-r)}function ee(e,o,t,s){return o>0?Math.max(0,Math.min(100,e+o)):s<(t==="Chill"||t==="Laugh"?15e3:t==="Learn"||t==="JustHere"?25e3:2e4)?e:s<6e4?Math.max(0,e-1):Math.max(0,e-3)}function _(e,o=v){return e<=o.basedMax?"Based":e<=o.mediumMax?"Medium Cooked":"Absolutely Cooked"}function O(e){return e==="Based"?I.based:e==="Medium Cooked"?I.medium:I.cooked}function G(e,o,t=v,s=Date.now()){return!(e<t.intervention||s-o<t.cooldownMs)}function P(e){return e>=100}function te(e,o,t,s){return o>0?Math.max(0,Math.min(100,e+o)):s<(t==="Chill"||t==="Laugh"?15e3:t==="Learn"||t==="JustHere"?25e3:2e4)?e:s<6e4?Math.max(0,e-1):Math.max(0,e-3)}function h(e){return new Promise(o=>{chrome.runtime.sendMessage(e,t=>{chrome.runtime.lastError?o({success:!1,error:chrome.runtime.lastError.message}):o(t??{success:!1,error:"No response"})})})}function z(e,o=1){return e.active?{...e,consumed:e.consumed+o}:e}function R(e,o=Date.now()){return e.active?e.mode==="items"?e.consumed>=e.limit:e.mode==="time"?(o-e.startedAt)/6e4>=e.limit:!1:!1}function se(e,o=Date.now()){if(!e.active)return{current:0,total:0,percent:0};if(e.mode==="items")return{current:e.consumed,total:e.limit,percent:Math.min(100,Math.round(e.consumed/e.limit*100))};const t=(o-e.startedAt)/6e4,s=Math.max(0,e.limit-t),a=Math.floor(s),i=Math.floor((s-a)*60);return{current:Math.round(t),total:e.limit,percent:Math.min(100,Math.round(t/e.limit*100)),timeRemaining:`${String(a).padStart(2,"0")}:${String(i).padStart(2,"0")}`}}const j="brd_widget_positions";async function oe(e,o){return(await chrome.storage.local.get(e))[e]??o}async function ie(e,o){await chrome.storage.local.set({[e]:o})}async function H(){return oe(j,{})}async function ae(e){return(await H())[e]??X}async function re(e,o){const t=await H();t[e]=o,await ie(j,t)}const M="brd-overlay-host";let u=null,A=null,y={edge:"right",verticalOffset:20};function N(){if(u)return u;let e=document.getElementById(M);if(e||(e=document.createElement("div"),e.id=M,e.style.cssText="position:fixed;top:0;left:0;width:0;height:0;z-index:2147483647;pointer-events:none;",document.documentElement.appendChild(e)),e.shadowRoot)return u=e.shadowRoot,u;u=e.attachShadow({mode:"open"});const o=document.createElement("style");o.textContent=be,u.appendChild(o);const t=document.createElement("link");return t.rel="stylesheet",t.href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap",u.appendChild(t),le(),u}function S(e,o){const t=N(),s=t.querySelector(`[data-overlay="${e}"]`);s&&s.remove();const a=document.createElement("div");return a.setAttribute("data-overlay",e),a.innerHTML=o,t.appendChild(a),a}function ne(e,o,t){var k;const a=N().querySelector('[data-overlay="widget"]');if(!a)return;const i=a.querySelector(".brd-widget");if(!i)return;const d=(C=>{const T={Based:{emoji:"( ._.)",label:"Based"},"Medium Cooked":{emoji:"( ◕_◕)",label:"Medium"},"Absolutely Cooked":{emoji:"( x_x)",label:"Cooked"}};return T[C]||T.Based})(o),n=o==="Based"?"brd-score-based":o==="Medium Cooked"?"brd-score-medium":"brd-score-cooked",c=i.querySelector(".brd-widget-score");c&&(c.textContent=String(e),c.className=`brd-widget-score ${n}`);const p=i.querySelector(".brd-widget-emoji");p&&(p.textContent=d.emoji);const f=i.querySelector(".brd-widget-label");f&&(f.textContent=d.label);const w=(k=i.querySelector(".brd-pack-bar"))==null?void 0:k.parentElement;w&&w.remove(),t&&i.insertAdjacentHTML("beforeend",t)}function b(e){if(!u)return;const o=u.querySelector(`[data-overlay="${e}"]`);o&&o.remove()}function de(){u&&u.querySelectorAll("[data-overlay]").forEach(e=>e.remove())}async function ce(e){A=e,y=await ae(e),q()}function q(){if(!u)return;const e=u.querySelector(".brd-widget");e&&(e.style.right=y.edge==="right"?"0px":"auto",e.style.left=y.edge==="left"?"0px":"auto",e.style.bottom=`${y.verticalOffset}px`)}async function le(){var s;const e=await chrome.runtime.sendMessage({type:"GET_SETTINGS"}),o=e!=null&&e.success&&((s=e.data)!=null&&s.theme)?e.data.theme:"light",t=document.getElementById(M);t&&(o==="dark"?t.classList.add("brd-dark"):t.classList.remove("brd-dark"))}function he(e,o){let t=!1,s=0,a=0,i=y.edge;const r=c=>{c.target.closest("button, input, a")||(t=!0,s=c.clientY,a=window.innerHeight-e.getBoundingClientRect().bottom,i=y.edge,e.style.cursor="grabbing",e.style.transition="none",c.preventDefault())},d=c=>{if(!t)return;const p=s-c.clientY,f=a+p;e.style.left=i==="left"?"0px":"auto",e.style.right=i==="right"?"0px":"auto",e.style.bottom=`${Math.max(0,Math.min(f,window.innerHeight-100))}px`},n=async c=>{if(!t)return;t=!1,e.style.cursor="grab",e.style.transition="all 0.2s ease";const p=c.clientX,f=window.innerWidth/2,w=p<f?"left":"right",k=e.getBoundingClientRect(),C=Math.max(0,window.innerHeight-k.bottom);y={edge:w,verticalOffset:Math.max(0,C)},q(),A&&await re(A,y)};e.addEventListener("pointerdown",r),document.addEventListener("pointermove",d),document.addEventListener("pointerup",n),e.style.cursor="grab"}const be=`
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
`;class ue{constructor(){l(this,"settings");l(this,"session");l(this,"enabled",!1);l(this,"tickTimer",null);l(this,"lastSignalAt",0);l(this,"lastActivityAt",0);l(this,"scrollCount",0);l(this,"swipeCount",0);l(this,"maxCookedShown",!1);l(this,"builtDifferentDismissed",!1)}async init(){var o;try{const t=await h({type:"GET_SETTINGS"});if(!t.success)return;if(this.settings=t.data,!this.settings.masterEnabled||!((o=this.settings.sites[this.site])!=null&&o.enabled)){console.log(`[brainrot detox] Disabled for ${this.site}`);return}const s=await this.getCurrentTabId();let a=await h({type:"GET_SESSION",payload:{tabId:s}});a.data?this.session=a.data:(this.session={site:this.site,tabId:s,startedAt:Date.now(),cookedScore:0,cookedStatus:"Based",lastInterventionAt:0,packState:{...m},touchGrass:{...x},vibeIntent:this.settings.vibeCheck.activeIntent,itemsConsumed:0,scrollEvents:0},await h({type:"UPDATE_SESSION",payload:{tabId:s,patch:this.session}})),this.enabled=!0,console.log(`[brainrot detox] ${this.site} adapter initialized`),this.mountCookedWidget(),this.setupObservers(),this.lastActivityAt=Date.now(),this.scheduleNextTick(),this.session.touchGrass.active&&this.session.touchGrass.endsAt>Date.now()&&this.showTouchGrassOverlay()}catch(t){console.error(`[brainrot detox] Init error for ${this.site}:`,t)}}destroy(){this.enabled=!1,this.tickTimer&&clearTimeout(this.tickTimer),this.removeAllOverlays()}scheduleNextTick(){this.tickTimer&&clearTimeout(this.tickTimer);const a=Date.now()-this.lastActivityAt<J?Y:K;this.tickTimer=window.setTimeout(()=>{this.tick(),this.scheduleNextTick()},a)}recordActivity(){this.lastActivityAt=Date.now()}async tick(){if(!this.enabled)return;const o=Date.now(),t=this.getNewItemsSinceLastTick();this.session.itemsConsumed+=t,this.session.scrollEvents+=this.scrollCount;const s=this.scrollCount>0||t>0||this.swipeCount>0;s&&(this.lastSignalAt=o);const a=this.lastSignalAt===0?0:o-this.lastSignalAt;if(this.builtDifferentDismissed&&s){this.builtDifferentDismissed=!1,this.scrollCount=0,this.swipeCount=0,this.onBuiltDifferentDenied();return}let i;if(this.session.packState.active)i=this.session.cookedScore;else if(this.site==="shorts")i=ee(this.session.cookedScore,this.swipeCount,this.session.vibeIntent,a);else{const d=(o-this.session.startedAt)/6e4,n=Z(d,this.settings.cooked.sessionCapMinutes,this.session.scrollEvents,this.session.itemsConsumed);i=Q(this.session.cookedScore,n,s,a,this.session.vibeIntent)}this.scrollCount=0,this.swipeCount=0,this.session.cookedScore=i,this.session.cookedStatus=_(i,this.settings.cooked.thresholds),this.session.packState.active&&(this.session.packState=z(this.session.packState,t),R(this.session.packState,o)&&this.onPackComplete()),this.session.packState.active||(P(i)?this.maxCookedShown||(this.maxCookedShown=!0,this.onMaxCooked()):(i<95&&(this.maxCookedShown=!1),i>=this.session.cookedScore&&G(i,this.session.lastInterventionAt,this.settings.cooked.thresholds,o)&&(this.session.lastInterventionAt=o,this.onIntervention()))),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus);const r=this.session.tabId;await h({type:"UPDATE_SESSION",payload:{tabId:r,patch:this.session}})}async getCurrentTabId(){return new Promise(o=>{const t=Math.floor(Math.random()*1e6);h({type:"GET_CURRENT_TAB"}).then(s=>{var a;o(((a=s.data)==null?void 0:a.id)??t)})})}onIntervention(){h({type:"LOG_EVENT",payload:{eventType:"intervention"}}),this.showInterventionOverlay()}onMaxCooked(){this.session.lastInterventionAt=Date.now(),h({type:"LOG_EVENT",payload:{eventType:"intervention"}}),this.showSkyrimOverlay("Your brain is absolutely cooked (x_x)")}onPackComplete(){this.session.packState={...m},this.maxCookedShown=!1,h({type:"END_PACK",payload:{tabId:this.session.tabId}}),this.showSkyrimOverlay("[#] Pack Complete! Time to touch grass.")}onBuiltDifferentDenied(){this.showBuiltDifferentDeniedOverlay()}async startPack(o,t){await h({type:"START_PACK",payload:{tabId:this.session.tabId,mode:o,limit:t}}),this.session.packState={active:!0,mode:o,limit:t,consumed:0,startedAt:Date.now()},this.session.cookedScore=0,this.session.cookedStatus="Based",this.maxCookedShown=!1,this.builtDifferentDismissed=!1}async startTouchGrass(o){await h({type:"START_TOUCH_GRASS",payload:{tabId:this.session.tabId,minutes:o}}),this.session.touchGrass={active:!0,endsAt:Date.now()+o*6e4,bypassCount:0},this.showTouchGrassOverlay()}async endTouchGrass(){await h({type:"END_TOUCH_GRASS",payload:{tabId:this.session.tabId}}),this.session.touchGrass={...x},this.session.cookedScore=0,this.session.cookedStatus="Based",this.maxCookedShown=!1,this.removeAllOverlays()}async bypassTouchGrass(){this.session.touchGrass.bypassCount++,h({type:"LOG_EVENT",payload:{eventType:"bypass"}}),await this.endTouchGrass()}setVibeIntent(o){this.session.vibeIntent=o,h({type:"UPDATE_SESSION",payload:{tabId:this.session.tabId,patch:{vibeIntent:o}}}),h({type:"LOG_EVENT",payload:{eventType:"vibe_check"}})}}class pe extends ue{constructor(){super(...arguments);l(this,"site","instagram-reels");l(this,"itemsSinceLastTick",0);l(this,"lastReelId","");l(this,"urlObserver",null);l(this,"lastWheelTime",0);l(this,"WHEEL_DEBOUNCE_MS",500);l(this,"onWheel",t=>{const s=Date.now();Math.abs(t.deltaY)>20&&s-this.lastWheelTime>this.WHEEL_DEBOUNCE_MS&&(this.lastWheelTime=s,this.swipeCount++,this.itemsSinceLastTick++,this.recordActivity())});l(this,"onKeyDown",t=>{(t.key==="ArrowDown"||t.key==="j")&&(this.swipeCount++,this.itemsSinceLastTick++,this.recordActivity())})}getReelsVideo(){return document.querySelector("div[role='presentation'] video")??document.querySelector("._ac8m video")??document.querySelector("video")}freezeFeed(){const t=this.getReelsVideo();t&&!t.paused&&t.pause()}thawFeed(){const t=this.getReelsVideo();t&&t.paused&&t.play().catch(()=>{})}setupObservers(){window.addEventListener("wheel",this.onWheel,{passive:!0}),window.addEventListener("keydown",this.onKeyDown,{passive:!0});let t=0;window.addEventListener("touchstart",s=>{var a;t=((a=s.touches[0])==null?void 0:a.clientY)??0},{passive:!0}),window.addEventListener("touchend",s=>{var i;const a=t-(((i=s.changedTouches[0])==null?void 0:i.clientY)??0);Math.abs(a)>50&&(this.swipeCount++,this.itemsSinceLastTick++,this.recordActivity())},{passive:!0}),this.watchReelChanges(),chrome.runtime.onMessage.addListener((s,a,i)=>{var r,d,n;return s.type==="END_TOUCH_GRASS"?(this.session.touchGrass={active:!1,endsAt:0,bypassCount:0},b("skyrim"),b("touchgrass"),this.thawFeed(),i({success:!0}),!1):s.type==="TRIGGER_TOUCH_GRASS"?(this.startTouchGrass(((r=s.payload)==null?void 0:r.minutes)??5),i({success:!0}),!1):s.type==="TRIGGER_PACK"?(this.startPack(((d=s.payload)==null?void 0:d.mode)??"items",((n=s.payload)==null?void 0:n.limit)??10),i({success:!0}),!1):(s.type==="TRIGGER_VIBE_CHECK"&&(this.showVibeCheckOverlay(),i({success:!0})),!1)})}watchReelChanges(){const t=()=>{const i=window.location.pathname.match(/\/reel\/([^/?]+)/),r=(i==null?void 0:i[1])??"";r&&r!==this.lastReelId&&(this.lastReelId=r,this.itemsSinceLastTick++,this.swipeCount++)};setInterval(t,500);const s=new MutationObserver(()=>t()),a=()=>{const i=document.querySelector("div[role='presentation']")??document.querySelector("main")??document.body;s.observe(i,{childList:!0,subtree:!0})};document.readyState==="complete"?a():window.addEventListener("load",a),this.urlObserver=s}getNewItemsSinceLastTick(){const t=this.itemsSinceLastTick;return this.itemsSinceLastTick=0,t}async tick(){if(!this.enabled)return;const t=Date.now(),s=this.getNewItemsSinceLastTick();this.session.itemsConsumed+=s,this.session.scrollEvents+=this.scrollCount;const a=this.scrollCount>0||s>0||this.swipeCount>0;a&&(this.lastSignalAt=t);const i=this.lastSignalAt===0?0:t-this.lastSignalAt;if(this.builtDifferentDismissed&&a){this.builtDifferentDismissed=!1,this.scrollCount=0,this.swipeCount=0,this.onBuiltDifferentDenied();return}let r;this.session.packState.active?r=this.session.cookedScore:r=te(this.session.cookedScore,this.swipeCount,this.session.vibeIntent,i),this.scrollCount=0,this.swipeCount=0,this.session.cookedScore=r,this.session.cookedStatus=_(r,this.settings.cooked.thresholds),this.session.packState.active&&(this.session.packState=z(this.session.packState,s),R(this.session.packState,t)&&this.onPackComplete()),this.session.packState.active||(P(r)?this.maxCookedShown||(this.maxCookedShown=!0,this.onMaxCooked()):(r<95&&(this.maxCookedShown=!1),r>=this.session.cookedScore&&G(r,this.session.lastInterventionAt,this.settings.cooked.thresholds,t)&&(this.session.lastInterventionAt=t,this.onIntervention()))),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus),await h({type:"UPDATE_SESSION",payload:{tabId:this.session.tabId,patch:this.session}})}async mountCookedWidget(){await ce(this.site),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus)}updateCookedWidget(t,s){const a=O(s),i=s==="Based"?"brd-score-based":s==="Medium Cooked"?"brd-score-medium":"brd-score-cooked";let r="";if(this.session.packState.active){const n=se(this.session.packState);r=`
                <div style="width:100%;margin-top:6px;">
                    <div style="font-size:10px;color:#94a3b8;margin-bottom:3px;">${this.session.packState.mode==="time"&&n.timeRemaining?`[#] Pack: ${n.timeRemaining}`:`[#] Pack: ${n.current}/${n.total}`}</div>
                    <div class="brd-pack-bar"><div class="brd-pack-fill" style="width:${n.percent}%"></div></div>
                </div>
            `}if(document.querySelector('#brd-overlay-host [data-overlay="widget"] .brd-widget')){ne(t,s,r);const n=document.querySelector('#brd-overlay-host [data-overlay="widget"] .brd-widget');n&&(n.style.cursor="pointer",n.onclick=()=>this.showVibeCheckOverlay())}else{const c=S("widget",`
                <div class="brd-widget">
                    <span class="brd-widget-emoji">${a.emoji}</span>
                    <span class="brd-widget-label">${a.label}</span>
                    <span class="brd-widget-score ${i}">${t}</span>
                    ${r}
                </div>
            `).querySelector(".brd-widget");c&&(c.style.cursor="pointer",c.onclick=()=>this.showVibeCheckOverlay(),he(c,this.site))}}showInterventionOverlay(){var a,i,r;const t=O(this.session.cookedStatus),s=S("intervention",`
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
        `);(a=s.querySelector("[data-action='dismiss']"))==null||a.addEventListener("click",()=>b("intervention")),(i=s.querySelector("[data-action='pack']"))==null||i.addEventListener("click",()=>{b("intervention"),this.startPack("items",10)}),(r=s.querySelector("[data-action='grass']"))==null||r.addEventListener("click",()=>{b("intervention"),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)})}showBuiltDifferentDeniedOverlay(){var s,a,i;this.freezeFeed();const t=S("denied",`
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
        `);(s=t.querySelector("[data-action='grass']"))==null||s.addEventListener("click",()=>{b("denied"),this.thawFeed(),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)}),(a=t.querySelector("[data-action='pack']"))==null||a.addEventListener("click",()=>{b("denied"),this.thawFeed(),this.startPack("items",10)}),(i=t.querySelector("[data-action='vibe']"))==null||i.addEventListener("click",()=>{b("denied"),this.thawFeed(),this.showVibeCheckOverlay()})}showSkyrimOverlay(t){var r,d,n;const s=chrome.runtime.getURL("assets/skyrim-skeleton.mp4");this.freezeFeed();const a=S("skyrim",`
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
        `),i=a.querySelector("video");i&&(i.src=s,i.load(),i.play().catch(()=>{})),(r=a.querySelector("[data-action='grass']"))==null||r.addEventListener("click",()=>{b("skyrim"),this.thawFeed(),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)}),(d=a.querySelector("[data-action='pack']"))==null||d.addEventListener("click",()=>{b("skyrim"),this.thawFeed(),this.startPack("items",10)}),(n=a.querySelector("[data-action='dismiss']"))==null||n.addEventListener("click",()=>{b("skyrim"),this.thawFeed(),this.builtDifferentDismissed=!0})}showTouchGrassOverlay(){var F;const t=this.session.touchGrass.endsAt,s=W.sort(()=>Math.random()-.5).slice(0,3);this.freezeFeed();const i=[...["https://cataas.com/cat?width=900&height=700&t=1","https://cataas.com/cat?width=900&height=700&t=2","https://cataas.com/cat?width=900&height=700&t=3","https://cataas.com/cat?width=900&height=700&t=4","WEBCAM","https://cataas.com/cat?width=900&height=700&t=5","https://cataas.com/cat?width=900&height=700&t=6"]].sort(()=>Math.random()-.5),r=S("touchgrass",`
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
                        ${s.map(g=>`<div class="brd-tip">${g}</div>`).join("")}
                    </div>
                    <div class="brd-btn-row" style="justify-content:center;">
                        <button class="brd-btn brd-btn-danger" data-action="bypass">Emergency Bypass (will be logged)</button>
                    </div>
                </div>
            </div>
        `),d=r.querySelector(".brd-zen-img"),n=r.querySelector(".brd-zen-webcam"),c=r.querySelector(".brd-zen-caption");let p=null,f=0;const w=["breathe.","you are here.","it's okay.","look at this.","touch grass.","be present.","slow down.","this is real life."],k=async g=>{const E=i[g%i.length];if(E==="WEBCAM"){if(d.style.display="none",n.style.display="block",c.textContent="hi. this is you.",!p)try{p=await navigator.mediaDevices.getUserMedia({video:!0,audio:!1}),n.srcObject=p}catch{k(g+1)}}else n.style.display="none",d.style.display="block",d.src=E,c.textContent=w[Math.floor(Math.random()*w.length)]};k(f);const C=setInterval(()=>{f++,k(f)},4e3),T=r.querySelector("#brd-tg-timer"),$=setInterval(()=>{const g=Math.max(0,t-Date.now()),E=Math.floor(g/6e4),me=Math.floor(g%6e4/1e3);T&&(T.textContent=`${String(E).padStart(2,"0")}:${String(me).padStart(2,"0")}`),g<=0&&(clearInterval($),clearInterval(C),p&&p.getTracks().forEach(fe=>fe.stop()),this.endTouchGrass(),this.thawFeed(),b("touchgrass"))},1e3);(F=r.querySelector("[data-action='bypass']"))==null||F.addEventListener("click",()=>{clearInterval($),clearInterval(C),p&&p.getTracks().forEach(g=>g.stop()),this.bypassTouchGrass(),this.thawFeed(),b("touchgrass")})}showVibeCheckOverlay(){var a;const t=U.map(i=>`
            <div class="brd-vibe-card" data-vibe="${i.id}">
                <span class="brd-vibe-emoji">${i.emoji}</span>
                <span class="brd-vibe-label">${i.label}</span>
            </div>
        `).join(""),s=S("vibecheck",`
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
        `);s.querySelectorAll("[data-vibe]").forEach(i=>{i.addEventListener("click",()=>{const r=i.dataset.vibe;this.setVibeIntent(r),b("vibecheck")})}),(a=s.querySelector("[data-action='skip']"))==null||a.addEventListener("click",()=>{b("vibecheck")})}removeAllOverlays(){de(),this.thawFeed()}}console.log("[brainrot detox] Instagram Reels content script loaded");const D=new pe;D.init();let B=location.href;new MutationObserver(()=>{location.href!==B&&(B=location.href,(location.pathname.includes("/reels")||location.pathname.includes("/reel"))&&(D.destroy(),D.init()))}).observe(document.body,{subtree:!0,childList:!0})})();
