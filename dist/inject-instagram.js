var te=Object.defineProperty;var se=(f,u,m)=>u in f?te(f,u,{enumerable:!0,configurable:!0,writable:!0,value:m}):f[u]=m;var h=(f,u,m)=>se(f,typeof u!="symbol"?u+"":u,m);(function(){"use strict";const f={basedMax:35,mediumMax:65,intervention:80,cooldownMs:6e4},u={active:!1,mode:"items",limit:10,consumed:0,startedAt:0},m={active:!1,endsAt:0,bypassCount:0},H=["[>] Step outside for 2 minutes","[~] Drink a glass of water","[o] Do 5 deep breaths","[!] Do 10 jumping jacks","[*] Look at something 20 feet away for 20 seconds","[♪] Put on your favorite song","[>] Text a friend something nice","[=] Open a window and feel the air"],k={based:{emoji:"( ._.)",label:"Based",hint:"Keep it chill, you're doing great."},medium:{emoji:"(-_-;)",label:"Medium Cooked",hint:"Maybe take a breather soon?"},cooked:{emoji:"(x_x) ",label:"Absolutely Cooked",hint:"Bro. Step away from the screen."}},N=[{id:"Chill",emoji:"~_~",label:"Just Vibing"},{id:"Learn",emoji:"o_O",label:"Learn Something"},{id:"Laugh",emoji:"xD",label:"Get Entertained"},{id:"Music",emoji:"♪♫",label:"Music / Audio"},{id:"JustHere",emoji:"...",label:"I'm Just Here"}],T=.3,q=3e3,$=15e3;function B(t,i,e,s){const o=Math.min(1,t/i),a=Math.min(1,e/150),n=Math.min(1,s/60),r=o*35+a*35+n*30;return Math.round(Math.min(100,r))}function F(t,i,e,s,o){const a=o==="Learn"?1.3:o==="JustHere"?1.1:o==="Laugh"?.8:o==="Chill"?.7:1;if(e){const r=i*a,d=t*(1-T)+r*T;return Math.max(0,Math.min(100,Math.round(d)))}if(s<$)return t;const n=s<45e3?1:s<9e4?2:4;return Math.max(0,t-n)}function V(t,i,e,s){return i>0?Math.max(0,Math.min(100,t+i)):s<(e==="Chill"||e==="Laugh"?15e3:e==="Learn"||e==="JustHere"?25e3:2e4)?t:s<6e4?Math.max(0,t-1):Math.max(0,t-3)}function E(t,i=f){return t<=i.basedMax?"Based":t<=i.mediumMax?"Medium Cooked":"Absolutely Cooked"}function I(t){return t==="Based"?k.based:t==="Medium Cooked"?k.medium:k.cooked}function A(t,i,e=f,s=Date.now()){return!(t<e.intervention||s-i<e.cooldownMs)}function M(t){return t>=100}function U(t,i,e,s){return i>0?Math.max(0,Math.min(100,t+i)):s<(e==="Chill"||e==="Laugh"?15e3:e==="Learn"||e==="JustHere"?25e3:2e4)?t:s<6e4?Math.max(0,t-1):Math.max(0,t-3)}function c(t){return new Promise(i=>{chrome.runtime.sendMessage(t,e=>{chrome.runtime.lastError?i({success:!1,error:chrome.runtime.lastError.message}):i(e??{success:!1,error:"No response"})})})}function D(t,i=1){return t.active?{...t,consumed:t.consumed+i}:t}function L(t,i=Date.now()){return t.active?t.mode==="items"?t.consumed>=t.limit:t.mode==="time"?(i-t.startedAt)/6e4>=t.limit:!1:!1}function Y(t,i=Date.now()){if(!t.active)return{current:0,total:0,percent:0};if(t.mode==="items")return{current:t.consumed,total:t.limit,percent:Math.min(100,Math.round(t.consumed/t.limit*100))};const e=(i-t.startedAt)/6e4;return{current:Math.round(e),total:t.limit,percent:Math.min(100,Math.round(e/t.limit*100))}}const O="brd-overlay-host";let b=null;function W(){if(b)return b;let t=document.getElementById(O);if(t||(t=document.createElement("div"),t.id=O,t.style.cssText="position:fixed;top:0;left:0;width:0;height:0;z-index:2147483647;pointer-events:none;",document.documentElement.appendChild(t)),t.shadowRoot)return b=t.shadowRoot,b;b=t.attachShadow({mode:"open"});const i=document.createElement("style");i.textContent=J,b.appendChild(i);const e=document.createElement("link");return e.rel="stylesheet",e.href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap",b.appendChild(e),b}function g(t,i){const e=W(),s=e.querySelector(`[data-overlay="${t}"]`);s&&s.remove();const o=document.createElement("div");return o.setAttribute("data-overlay",t),o.innerHTML=i,e.appendChild(o),o}function l(t){if(!b)return;const i=b.querySelector(`[data-overlay="${t}"]`);i&&i.remove()}function K(){b&&b.querySelectorAll("[data-overlay]").forEach(t=>t.remove())}const J=`
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
`;class Z{constructor(){h(this,"settings");h(this,"session");h(this,"enabled",!1);h(this,"tickTimer",null);h(this,"lastSignalAt",0);h(this,"scrollCount",0);h(this,"swipeCount",0);h(this,"maxCookedShown",!1);h(this,"builtDifferentDismissed",!1)}async init(){var i;try{const e=await c({type:"GET_SETTINGS"});if(!e.success)return;if(this.settings=e.data,!this.settings.masterEnabled||!((i=this.settings.sites[this.site])!=null&&i.enabled)){console.log(`[brainrot detox] Disabled for ${this.site}`);return}const s=await this.getCurrentTabId();let o=await c({type:"GET_SESSION",payload:{tabId:s}});o.data?this.session=o.data:(this.session={site:this.site,tabId:s,startedAt:Date.now(),cookedScore:0,cookedStatus:"Based",lastInterventionAt:0,packState:{...u},touchGrass:{...m},vibeIntent:this.settings.vibeCheck.activeIntent,itemsConsumed:0,scrollEvents:0},await c({type:"UPDATE_SESSION",payload:{tabId:s,patch:this.session}})),this.enabled=!0,console.log(`[brainrot detox] ${this.site} adapter initialized`),this.mountCookedWidget(),this.setupObservers(),this.tickTimer=window.setInterval(()=>this.tick(),q),this.session.touchGrass.active&&this.session.touchGrass.endsAt>Date.now()&&this.showTouchGrassOverlay()}catch(e){console.error(`[brainrot detox] Init error for ${this.site}:`,e)}}destroy(){this.enabled=!1,this.tickTimer&&clearInterval(this.tickTimer),this.removeAllOverlays()}async tick(){if(!this.enabled)return;const i=Date.now(),e=this.getNewItemsSinceLastTick();this.session.itemsConsumed+=e,this.session.scrollEvents+=this.scrollCount;const s=this.scrollCount>0||e>0||this.swipeCount>0;s&&(this.lastSignalAt=i);const o=this.lastSignalAt===0?0:i-this.lastSignalAt;if(this.builtDifferentDismissed&&s){this.builtDifferentDismissed=!1,this.scrollCount=0,this.swipeCount=0,this.onBuiltDifferentDenied();return}let a;if(this.session.packState.active)a=this.session.cookedScore;else if(this.site==="shorts")a=V(this.session.cookedScore,this.swipeCount,this.session.vibeIntent,o);else{const r=(i-this.session.startedAt)/6e4,d=B(r,this.settings.cooked.sessionCapMinutes,this.session.scrollEvents,this.session.itemsConsumed);a=F(this.session.cookedScore,d,s,o,this.session.vibeIntent)}this.scrollCount=0,this.swipeCount=0,this.session.cookedScore=a,this.session.cookedStatus=E(a,this.settings.cooked.thresholds),this.session.packState.active&&(this.session.packState=D(this.session.packState,e),L(this.session.packState,i)&&this.onPackComplete()),this.session.packState.active||(M(a)?this.maxCookedShown||(this.maxCookedShown=!0,this.onMaxCooked()):(a<95&&(this.maxCookedShown=!1),a>=this.session.cookedScore&&A(a,this.session.lastInterventionAt,this.settings.cooked.thresholds,i)&&(this.session.lastInterventionAt=i,this.onIntervention()))),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus);const n=this.session.tabId;await c({type:"UPDATE_SESSION",payload:{tabId:n,patch:this.session}})}async getCurrentTabId(){return new Promise(i=>{const e=Math.floor(Math.random()*1e6);c({type:"GET_CURRENT_TAB"}).then(s=>{var o;i(((o=s.data)==null?void 0:o.id)??e)})})}onIntervention(){c({type:"LOG_EVENT",payload:{eventType:"intervention"}}),this.showInterventionOverlay()}onMaxCooked(){this.session.lastInterventionAt=Date.now(),c({type:"LOG_EVENT",payload:{eventType:"intervention"}}),this.showSkyrimOverlay("Your brain is absolutely cooked (x_x)")}onPackComplete(){this.session.packState={...u},this.maxCookedShown=!1,c({type:"END_PACK",payload:{tabId:this.session.tabId}}),this.showSkyrimOverlay("[#] Pack Complete! Time to touch grass.")}onBuiltDifferentDenied(){this.showBuiltDifferentDeniedOverlay()}async startPack(i,e){await c({type:"START_PACK",payload:{tabId:this.session.tabId,mode:i,limit:e}}),this.session.packState={active:!0,mode:i,limit:e,consumed:0,startedAt:Date.now()},this.session.cookedScore=0,this.session.cookedStatus="Based",this.maxCookedShown=!1,this.builtDifferentDismissed=!1}async startTouchGrass(i){await c({type:"START_TOUCH_GRASS",payload:{tabId:this.session.tabId,minutes:i}}),this.session.touchGrass={active:!0,endsAt:Date.now()+i*6e4,bypassCount:0},this.showTouchGrassOverlay()}async endTouchGrass(){await c({type:"END_TOUCH_GRASS",payload:{tabId:this.session.tabId}}),this.session.touchGrass={...m},this.removeAllOverlays()}async bypassTouchGrass(){this.session.touchGrass.bypassCount++,c({type:"LOG_EVENT",payload:{eventType:"bypass"}}),await this.endTouchGrass()}setVibeIntent(i){this.session.vibeIntent=i,c({type:"UPDATE_SESSION",payload:{tabId:this.session.tabId,patch:{vibeIntent:i}}}),c({type:"LOG_EVENT",payload:{eventType:"vibe_check"}})}}class X extends Z{constructor(){super(...arguments);h(this,"site","instagram-reels");h(this,"itemsSinceLastTick",0);h(this,"lastReelId","");h(this,"urlObserver",null);h(this,"onWheel",e=>{Math.abs(e.deltaY)>20&&this.swipeCount++})}getReelsVideo(){return document.querySelector("div[role='presentation'] video")??document.querySelector("._ac8m video")??document.querySelector("video")}freezeFeed(){const e=this.getReelsVideo();e&&!e.paused&&e.pause()}thawFeed(){const e=this.getReelsVideo();e&&e.paused&&e.play().catch(()=>{})}setupObservers(){window.addEventListener("wheel",this.onWheel,{passive:!0});let e=0;window.addEventListener("touchstart",s=>{var o;e=((o=s.touches[0])==null?void 0:o.clientY)??0},{passive:!0}),window.addEventListener("touchend",s=>{var a;const o=e-(((a=s.changedTouches[0])==null?void 0:a.clientY)??0);Math.abs(o)>50&&(this.swipeCount++,this.itemsSinceLastTick++)},{passive:!0}),this.watchReelChanges(),chrome.runtime.onMessage.addListener((s,o,a)=>{var n,r,d;return s.type==="END_TOUCH_GRASS"?(this.session.touchGrass={active:!1,endsAt:0,bypassCount:0},l("skyrim"),l("touchgrass"),this.thawFeed(),a({success:!0}),!1):s.type==="TRIGGER_TOUCH_GRASS"?(this.startTouchGrass(((n=s.payload)==null?void 0:n.minutes)??5),a({success:!0}),!1):s.type==="TRIGGER_PACK"?(this.startPack(((r=s.payload)==null?void 0:r.mode)??"items",((d=s.payload)==null?void 0:d.limit)??10),a({success:!0}),!1):(s.type==="TRIGGER_VIBE_CHECK"&&(this.showVibeCheckOverlay(),a({success:!0})),!1)})}watchReelChanges(){const e=()=>{const a=window.location.pathname.match(/\/reel\/([^/?]+)/),n=(a==null?void 0:a[1])??"";n&&n!==this.lastReelId&&(this.lastReelId=n,this.itemsSinceLastTick++,this.swipeCount++)};setInterval(e,500);const s=new MutationObserver(()=>e()),o=()=>{const a=document.querySelector("div[role='presentation']")??document.querySelector("main")??document.body;s.observe(a,{childList:!0,subtree:!0})};document.readyState==="complete"?o():window.addEventListener("load",o),this.urlObserver=s}getNewItemsSinceLastTick(){const e=this.itemsSinceLastTick;return this.itemsSinceLastTick=0,e}async tick(){if(!this.enabled)return;const e=Date.now(),s=this.getNewItemsSinceLastTick();this.session.itemsConsumed+=s,this.session.scrollEvents+=this.scrollCount;const o=this.scrollCount>0||s>0||this.swipeCount>0;o&&(this.lastSignalAt=e);const a=this.lastSignalAt===0?0:e-this.lastSignalAt;if(this.builtDifferentDismissed&&o){this.builtDifferentDismissed=!1,this.scrollCount=0,this.swipeCount=0,this.onBuiltDifferentDenied();return}let n;this.session.packState.active?n=this.session.cookedScore:n=U(this.session.cookedScore,this.swipeCount,this.session.vibeIntent,a),this.scrollCount=0,this.swipeCount=0,this.session.cookedScore=n,this.session.cookedStatus=E(n,this.settings.cooked.thresholds),this.session.packState.active&&(this.session.packState=D(this.session.packState,s),L(this.session.packState,e)&&this.onPackComplete()),this.session.packState.active||(M(n)?this.maxCookedShown||(this.maxCookedShown=!0,this.onMaxCooked()):(n<95&&(this.maxCookedShown=!1),n>=this.session.cookedScore&&A(n,this.session.lastInterventionAt,this.settings.cooked.thresholds,e)&&(this.session.lastInterventionAt=e,this.onIntervention()))),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus),await c({type:"UPDATE_SESSION",payload:{tabId:this.session.tabId,patch:this.session}})}mountCookedWidget(){this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus)}updateCookedWidget(e,s){const o=I(s),a=s==="Based"?"brd-score-based":s==="Medium Cooked"?"brd-score-medium":"brd-score-cooked";let n="";if(this.session.packState.active){const y=Y(this.session.packState);n=`
                <div style="width:100%;margin-top:6px;">
                    <div style="font-size:10px;color:#94a3b8;margin-bottom:3px;">[#] Pack: ${y.current}/${y.total}</div>
                    <div class="brd-pack-bar"><div class="brd-pack-fill" style="width:${y.percent}%"></div></div>
                </div>
            `}const d=g("widget",`
            <div class="brd-widget">
                <span class="brd-widget-emoji">${o.emoji}</span>
                <span class="brd-widget-label">${o.label}</span>
                <span class="brd-widget-score ${a}">${e}</span>
                ${n}
            </div>
        `).querySelector(".brd-widget");d&&(d.style.cursor="pointer",d.onclick=()=>this.showVibeCheckOverlay())}showInterventionOverlay(){var o,a,n;const e=I(this.session.cookedStatus),s=g("intervention",`
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
        `);(o=s.querySelector("[data-action='dismiss']"))==null||o.addEventListener("click",()=>l("intervention")),(a=s.querySelector("[data-action='pack']"))==null||a.addEventListener("click",()=>{l("intervention"),this.startPack("items",10)}),(n=s.querySelector("[data-action='grass']"))==null||n.addEventListener("click",()=>{l("intervention"),this.startTouchGrass(5)})}showBuiltDifferentDeniedOverlay(){var s,o,a;this.freezeFeed();const e=g("denied",`
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
        `);(s=e.querySelector("[data-action='grass']"))==null||s.addEventListener("click",()=>{l("denied"),this.thawFeed(),this.startTouchGrass(5)}),(o=e.querySelector("[data-action='pack']"))==null||o.addEventListener("click",()=>{l("denied"),this.thawFeed(),this.startPack("items",10)}),(a=e.querySelector("[data-action='vibe']"))==null||a.addEventListener("click",()=>{l("denied"),this.thawFeed(),this.showVibeCheckOverlay()})}showSkyrimOverlay(e){var n,r,d;const s=chrome.runtime.getURL("assets/skyrim-skeleton.mp4");this.freezeFeed();const o=g("skyrim",`
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
        `),a=o.querySelector("video");a&&(a.src=s,a.load(),a.play().catch(()=>{})),(n=o.querySelector("[data-action='grass']"))==null||n.addEventListener("click",()=>{l("skyrim"),this.thawFeed(),this.startTouchGrass(5)}),(r=o.querySelector("[data-action='pack']"))==null||r.addEventListener("click",()=>{l("skyrim"),this.thawFeed(),this.startPack("items",10)}),(d=o.querySelector("[data-action='dismiss']"))==null||d.addEventListener("click",()=>{l("skyrim"),this.thawFeed(),this.builtDifferentDismissed=!0})}showTouchGrassOverlay(){var j;const e=this.session.touchGrass.endsAt,s=H.sort(()=>Math.random()-.5).slice(0,3);this.freezeFeed();const a=[...["https://cataas.com/cat?width=900&height=700&t=1","https://cataas.com/cat?width=900&height=700&t=2","https://cataas.com/cat?width=900&height=700&t=3","https://cataas.com/cat?width=900&height=700&t=4","WEBCAM","https://cataas.com/cat?width=900&height=700&t=5","https://cataas.com/cat?width=900&height=700&t=6"]].sort(()=>Math.random()-.5),n=g("touchgrass",`
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
                        ${s.map(p=>`<div class="brd-tip">${p}</div>`).join("")}
                    </div>
                    <div class="brd-btn-row" style="justify-content:center;">
                        <button class="brd-btn brd-btn-danger" data-action="bypass">Emergency Bypass (will be logged)</button>
                    </div>
                </div>
            </div>
        `),r=n.querySelector(".brd-zen-img"),d=n.querySelector(".brd-zen-webcam"),y=n.querySelector(".brd-zen-caption");let v=null,S=0;const G=["breathe.","you are here.","it's okay.","look at this.","touch grass.","be present.","slow down.","this is real life."],C=async p=>{const x=a[p%a.length];if(x==="WEBCAM"){if(r.style.display="none",d.style.display="block",y.textContent="hi. this is you.",!v)try{v=await navigator.mediaDevices.getUserMedia({video:!0,audio:!1}),d.srcObject=v}catch{C(p+1)}}else d.style.display="none",r.style.display="block",r.src=x,y.textContent=G[Math.floor(Math.random()*G.length)]};C(S);const z=setInterval(()=>{S++,C(S)},4e3),P=n.querySelector("#brd-tg-timer"),R=setInterval(()=>{const p=Math.max(0,e-Date.now()),x=Math.floor(p/6e4),Q=Math.floor(p%6e4/1e3);P&&(P.textContent=`${String(x).padStart(2,"0")}:${String(Q).padStart(2,"0")}`),p<=0&&(clearInterval(R),clearInterval(z),v&&v.getTracks().forEach(ee=>ee.stop()),this.endTouchGrass(),this.thawFeed(),l("touchgrass"))},1e3);(j=n.querySelector("[data-action='bypass']"))==null||j.addEventListener("click",()=>{clearInterval(R),clearInterval(z),v&&v.getTracks().forEach(p=>p.stop()),this.bypassTouchGrass(),this.thawFeed(),l("touchgrass")})}showVibeCheckOverlay(){var o;const e=N.map(a=>`
            <div class="brd-vibe-card" data-vibe="${a.id}">
                <span class="brd-vibe-emoji">${a.emoji}</span>
                <span class="brd-vibe-label">${a.label}</span>
            </div>
        `).join(""),s=g("vibecheck",`
            <div class="brd-fullscreen">
                <div class="brd-card">
                    <h2>[?] Vibe Check</h2>
                    <p>What are you here for?</p>
                    <div class="brd-vibe-grid">
                        ${e}
                    </div>
                    <div class="brd-btn-row" style="justify-content:center;">
                        <button class="brd-btn brd-btn-ghost" data-action="skip">Skip</button>
                    </div>
                </div>
            </div>
        `);s.querySelectorAll("[data-vibe]").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.vibe;this.setVibeIntent(n),l("vibecheck")})}),(o=s.querySelector("[data-action='skip']"))==null||o.addEventListener("click",()=>{l("vibecheck")})}removeAllOverlays(){K(),this.thawFeed()}}console.log("[brainrot detox] Instagram Reels content script loaded");const w=new X;w.init();let _=location.href;new MutationObserver(()=>{location.href!==_&&(_=location.href,(location.pathname.includes("/reels")||location.pathname.includes("/reel"))&&(w.destroy(),w.init()))}).observe(document.body,{subtree:!0,childList:!0})})();
