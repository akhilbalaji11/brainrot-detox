var ie=Object.defineProperty;var oe=(f,m,v)=>m in f?ie(f,m,{enumerable:!0,configurable:!0,writable:!0,value:v}):f[m]=v;var c=(f,m,v)=>oe(f,typeof m!="symbol"?m+"":m,v);(function(){"use strict";const f={basedMax:35,mediumMax:65,intervention:80,cooldownMs:6e4},m={active:!1,mode:"items",limit:10,consumed:0,startedAt:0},v={active:!1,endsAt:0,bypassCount:0},R=["[>] Step outside for 2 minutes","[~] Drink a glass of water","[o] Do 5 deep breaths","[!] Do 10 jumping jacks","[*] Look at something 20 feet away for 20 seconds","[♪] Put on your favorite song","[>] Text a friend something nice","[=] Open a window and feel the air"],T={based:{emoji:"( ._.)",label:"Based",hint:"Keep it chill, you're doing great."},medium:{emoji:"(-_-;)",label:"Medium Cooked",hint:"Maybe take a breather soon?"},cooked:{emoji:"(x_x) ",label:"Absolutely Cooked",hint:"Bro. Step away from the screen."}},q=[{id:"Chill",emoji:"~_~",label:"Just Vibing"},{id:"Learn",emoji:"o_O",label:"Learn Something"},{id:"Laugh",emoji:"xD",label:"Get Entertained"},{id:"Music",emoji:"♪♫",label:"Music / Audio"},{id:"JustHere",emoji:"...",label:"I'm Just Here"}],L=.3,H=3e3,N=15e3;function $(s,o,e,t){const i=Math.min(1,s/o),a=Math.min(1,e/150),n=Math.min(1,t/60),r=i*35+a*35+n*30;return Math.round(Math.min(100,r))}function B(s,o,e,t,i){const a=i==="Learn"?1.3:i==="JustHere"?1.1:i==="Laugh"?.8:i==="Chill"?.7:1;if(e){const r=o*a,d=s*(1-L)+r*L;return Math.max(0,Math.min(100,Math.round(d)))}if(t<N)return s;const n=t<45e3?1:t<9e4?2:4;return Math.max(0,s-n)}function F(s,o,e,t){return o>0?Math.max(0,Math.min(100,s+o)):t<(e==="Chill"||e==="Laugh"?15e3:e==="Learn"||e==="JustHere"?25e3:2e4)?s:t<6e4?Math.max(0,s-1):Math.max(0,s-3)}function U(s,o=f){return s<=o.basedMax?"Based":s<=o.mediumMax?"Medium Cooked":"Absolutely Cooked"}function O(s){return s==="Based"?T.based:s==="Medium Cooked"?T.medium:T.cooked}function W(s,o,e=f,t=Date.now()){return!(s<e.intervention||t-o<e.cooldownMs)}function Y(s){return s>=100}function K(s,o=1){return s.active?{...s,consumed:s.consumed+o}:s}function Z(s,o=Date.now()){return s.active?s.mode==="items"?s.consumed>=s.limit:s.mode==="time"?(o-s.startedAt)/6e4>=s.limit:!1:!1}function J(s,o=Date.now()){if(!s.active)return{current:0,total:0,percent:0};if(s.mode==="items")return{current:s.consumed,total:s.limit,percent:Math.min(100,Math.round(s.consumed/s.limit*100))};const e=(o-s.startedAt)/6e4;return{current:Math.round(e),total:s.limit,percent:Math.min(100,Math.round(e/s.limit*100))}}const _="brd-overlay-host";let p=null;function X(){if(p)return p;let s=document.getElementById(_);if(s||(s=document.createElement("div"),s.id=_,s.style.cssText="position:fixed;top:0;left:0;width:0;height:0;z-index:2147483647;pointer-events:none;",document.documentElement.appendChild(s)),s.shadowRoot)return p=s.shadowRoot,p;p=s.attachShadow({mode:"open"});const o=document.createElement("style");o.textContent=ee,p.appendChild(o);const e=document.createElement("link");return e.rel="stylesheet",e.href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap",p.appendChild(e),p}function y(s,o){const e=X(),t=e.querySelector(`[data-overlay="${s}"]`);t&&t.remove();const i=document.createElement("div");return i.setAttribute("data-overlay",s),i.innerHTML=o,e.appendChild(i),i}function l(s){if(!p)return;const o=p.querySelector(`[data-overlay="${s}"]`);o&&o.remove()}function Q(){p&&p.querySelectorAll("[data-overlay]").forEach(s=>s.remove())}const ee=`
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
`;function u(s){return new Promise(o=>{chrome.runtime.sendMessage(s,e=>{chrome.runtime.lastError?o({success:!1,error:chrome.runtime.lastError.message}):o(e??{success:!1,error:"No response"})})})}class te{constructor(){c(this,"settings");c(this,"session");c(this,"enabled",!1);c(this,"tickTimer",null);c(this,"lastSignalAt",0);c(this,"scrollCount",0);c(this,"swipeCount",0);c(this,"maxCookedShown",!1);c(this,"builtDifferentDismissed",!1)}async init(){var o;try{const e=await u({type:"GET_SETTINGS"});if(!e.success)return;if(this.settings=e.data,!this.settings.masterEnabled||!((o=this.settings.sites[this.site])!=null&&o.enabled)){console.log(`[brainrot detox] Disabled for ${this.site}`);return}const t=await this.getCurrentTabId();let i=await u({type:"GET_SESSION",payload:{tabId:t}});i.data?this.session=i.data:(this.session={site:this.site,tabId:t,startedAt:Date.now(),cookedScore:0,cookedStatus:"Based",lastInterventionAt:0,packState:{...m},touchGrass:{...v},vibeIntent:this.settings.vibeCheck.activeIntent,itemsConsumed:0,scrollEvents:0},await u({type:"UPDATE_SESSION",payload:{tabId:t,patch:this.session}})),this.enabled=!0,console.log(`[brainrot detox] ${this.site} adapter initialized`),this.mountCookedWidget(),this.setupObservers(),this.tickTimer=window.setInterval(()=>this.tick(),H),this.session.touchGrass.active&&this.session.touchGrass.endsAt>Date.now()&&this.showTouchGrassOverlay()}catch(e){console.error(`[brainrot detox] Init error for ${this.site}:`,e)}}destroy(){this.enabled=!1,this.tickTimer&&clearInterval(this.tickTimer),this.removeAllOverlays()}async tick(){if(!this.enabled)return;const o=Date.now(),e=this.getNewItemsSinceLastTick();this.session.itemsConsumed+=e,this.session.scrollEvents+=this.scrollCount;const t=this.scrollCount>0||e>0||this.swipeCount>0;t&&(this.lastSignalAt=o);const i=this.lastSignalAt===0?0:o-this.lastSignalAt;if(this.builtDifferentDismissed&&t){this.builtDifferentDismissed=!1,this.scrollCount=0,this.swipeCount=0,this.onBuiltDifferentDenied();return}let a;if(this.session.packState.active)a=this.session.cookedScore;else if(this.site==="shorts")a=F(this.session.cookedScore,this.swipeCount,this.session.vibeIntent,i);else{const r=(o-this.session.startedAt)/6e4,d=$(r,this.settings.cooked.sessionCapMinutes,this.session.scrollEvents,this.session.itemsConsumed);a=B(this.session.cookedScore,d,t,i,this.session.vibeIntent)}this.scrollCount=0,this.swipeCount=0,this.session.cookedScore=a,this.session.cookedStatus=U(a,this.settings.cooked.thresholds),this.session.packState.active&&(this.session.packState=K(this.session.packState,e),Z(this.session.packState,o)&&this.onPackComplete()),this.session.packState.active||(Y(a)?this.maxCookedShown||(this.maxCookedShown=!0,this.onMaxCooked()):(a<95&&(this.maxCookedShown=!1),a>=this.session.cookedScore&&W(a,this.session.lastInterventionAt,this.settings.cooked.thresholds,o)&&(this.session.lastInterventionAt=o,this.onIntervention()))),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus);const n=this.session.tabId;await u({type:"UPDATE_SESSION",payload:{tabId:n,patch:this.session}})}async getCurrentTabId(){return new Promise(o=>{const e=Math.floor(Math.random()*1e6);u({type:"GET_CURRENT_TAB"}).then(t=>{var i;o(((i=t.data)==null?void 0:i.id)??e)})})}onIntervention(){u({type:"LOG_EVENT",payload:{eventType:"intervention"}}),this.showInterventionOverlay()}onMaxCooked(){this.session.lastInterventionAt=Date.now(),u({type:"LOG_EVENT",payload:{eventType:"intervention"}}),this.showSkyrimOverlay("Your brain is absolutely cooked (x_x)")}onPackComplete(){this.session.packState={...m},this.maxCookedShown=!1,u({type:"END_PACK",payload:{tabId:this.session.tabId}}),this.showSkyrimOverlay("[#] Pack Complete! Time to touch grass.")}onBuiltDifferentDenied(){this.showBuiltDifferentDeniedOverlay()}async startPack(o,e){await u({type:"START_PACK",payload:{tabId:this.session.tabId,mode:o,limit:e}}),this.session.packState={active:!0,mode:o,limit:e,consumed:0,startedAt:Date.now()},this.session.cookedScore=0,this.session.cookedStatus="Based",this.maxCookedShown=!1,this.builtDifferentDismissed=!1}async startTouchGrass(o){await u({type:"START_TOUCH_GRASS",payload:{tabId:this.session.tabId,minutes:o}}),this.session.touchGrass={active:!0,endsAt:Date.now()+o*6e4,bypassCount:0},this.showTouchGrassOverlay()}async endTouchGrass(){await u({type:"END_TOUCH_GRASS",payload:{tabId:this.session.tabId}}),this.session.touchGrass={...v},this.removeAllOverlays()}async bypassTouchGrass(){this.session.touchGrass.bypassCount++,u({type:"LOG_EVENT",payload:{eventType:"bypass"}}),await this.endTouchGrass()}setVibeIntent(o){this.session.vibeIntent=o,u({type:"UPDATE_SESSION",payload:{tabId:this.session.tabId,patch:{vibeIntent:o}}}),u({type:"LOG_EVENT",payload:{eventType:"vibe_check"}})}}class se extends te{constructor(){super(...arguments);c(this,"site","shorts");c(this,"itemsSinceLastTick",0);c(this,"lastVideoId","");c(this,"urlObserver",null);c(this,"onScroll",()=>{this.scrollCount++});c(this,"onWheel",e=>{Math.abs(e.deltaY)>20&&this.swipeCount++})}getShortsVideo(){return document.querySelector("ytd-shorts video")??document.querySelector(".html5-main-video")??document.querySelector("video.video-stream")??null}freezeFeed(){const e=this.getShortsVideo();e&&!e.paused&&e.pause()}thawFeed(){const e=this.getShortsVideo();e&&e.paused&&e.play().catch(()=>{})}setupObservers(){window.addEventListener("scroll",this.onScroll,{passive:!0}),window.addEventListener("wheel",this.onWheel,{passive:!0}),this.watchUrlChanges(),this.watchShortsContainer();let e=0;window.addEventListener("touchstart",t=>{var i;e=((i=t.touches[0])==null?void 0:i.clientY)??0},{passive:!0}),window.addEventListener("touchend",t=>{var a;const i=e-(((a=t.changedTouches[0])==null?void 0:a.clientY)??0);Math.abs(i)>50&&(this.swipeCount++,this.itemsSinceLastTick++)},{passive:!0}),chrome.runtime.onMessage.addListener((t,i,a)=>{var n,r,d;return t.type==="END_TOUCH_GRASS"?(this.session.touchGrass={active:!1,endsAt:0,bypassCount:0},l("skyrim"),l("touchgrass"),this.thawFeed(),a({success:!0}),!1):t.type==="TRIGGER_TOUCH_GRASS"?(this.startTouchGrass(((n=t.payload)==null?void 0:n.minutes)??5),a({success:!0}),!1):t.type==="TRIGGER_PACK"?(this.startPack(((r=t.payload)==null?void 0:r.mode)??"items",((d=t.payload)==null?void 0:d.limit)??10),a({success:!0}),!1):(t.type==="TRIGGER_VIBE_CHECK"&&(this.showVibeCheckOverlay(),a({success:!0})),!1)})}watchUrlChanges(){setInterval(()=>{const e=window.location.pathname.match(/\/shorts\/([^/?]+)/),t=(e==null?void 0:e[1])??"";t&&t!==this.lastVideoId&&(this.lastVideoId=t,this.itemsSinceLastTick++,this.swipeCount++)},500)}watchShortsContainer(){const e=new MutationObserver(()=>{const i=window.location.pathname.match(/\/shorts\/([^/?]+)/),a=(i==null?void 0:i[1])??"";a&&a!==this.lastVideoId&&(this.lastVideoId=a,this.itemsSinceLastTick++)}),t=()=>{const i=document.querySelector("ytd-shorts")||document.querySelector("#shorts-container")||document.body;e.observe(i,{childList:!0,subtree:!0})};document.readyState==="complete"?t():window.addEventListener("load",t),this.urlObserver=e}getNewItemsSinceLastTick(){const e=this.itemsSinceLastTick;return this.itemsSinceLastTick=0,e}mountCookedWidget(){this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus)}updateCookedWidget(e,t){const i=O(t),a=t==="Based"?"brd-score-based":t==="Medium Cooked"?"brd-score-medium":"brd-score-cooked";let n="";if(this.session.packState.active){const x=J(this.session.packState);n=`
        <div style="width:100%;margin-top:6px;">
          <div style="font-size:10px;color:#94a3b8;margin-bottom:3px;">[#] Pack: ${x.current}/${x.total}</div>
          <div class="brd-pack-bar"><div class="brd-pack-fill" style="width:${x.percent}%"></div></div>
        </div>
      `}const d=y("widget",`
      <div class="brd-widget">
        <span class="brd-widget-emoji">${i.emoji}</span>
        <span class="brd-widget-label">${i.label}</span>
        <span class="brd-widget-score ${a}">${e}</span>
        ${n}
      </div>
    `).querySelector(".brd-widget");d&&(d.style.cursor="pointer",d.onclick=()=>this.showVibeCheckOverlay())}showInterventionOverlay(){var i,a,n;const e=O(this.session.cookedStatus),t=y("intervention",`
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
    `);(i=t.querySelector("[data-action='dismiss']"))==null||i.addEventListener("click",()=>l("intervention")),(a=t.querySelector("[data-action='pack']"))==null||a.addEventListener("click",()=>{l("intervention"),this.startPack("items",10)}),(n=t.querySelector("[data-action='grass']"))==null||n.addEventListener("click",()=>{l("intervention"),this.startTouchGrass(5)})}showBuiltDifferentDeniedOverlay(){var t,i,a;this.freezeFeed();const e=y("denied",`
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
    `);(t=e.querySelector("[data-action='grass']"))==null||t.addEventListener("click",()=>{l("denied"),this.thawFeed(),this.startTouchGrass(5)}),(i=e.querySelector("[data-action='pack']"))==null||i.addEventListener("click",()=>{l("denied"),this.thawFeed(),this.startPack("items",10)}),(a=e.querySelector("[data-action='vibe']"))==null||a.addEventListener("click",()=>{l("denied"),this.thawFeed(),this.showVibeCheckOverlay()})}showSkyrimOverlay(e){var n,r,d;const t=chrome.runtime.getURL("assets/skyrim-skeleton.mp4");this.freezeFeed();const i=y("skyrim",`
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
    `),a=i.querySelector("video");a&&(a.src=t,a.load(),a.play().catch(()=>{})),(n=i.querySelector("[data-action='grass']"))==null||n.addEventListener("click",()=>{l("skyrim"),this.thawFeed(),this.startTouchGrass(5)}),(r=i.querySelector("[data-action='pack']"))==null||r.addEventListener("click",()=>{l("skyrim"),this.thawFeed(),this.startPack("items",10)}),(d=i.querySelector("[data-action='dismiss']"))==null||d.addEventListener("click",()=>{l("skyrim"),this.thawFeed(),this.builtDifferentDismissed=!0})}showTouchGrassOverlay(){var j;const e=this.session.touchGrass.endsAt,t=R.sort(()=>Math.random()-.5).slice(0,3);this.freezeFeed();const a=[...["https://cataas.com/cat?width=900&height=700&t=1","https://cataas.com/cat?width=900&height=700&t=2","https://cataas.com/cat?width=900&height=700&t=3","https://cataas.com/cat?width=900&height=700&t=4","https://cataas.com/cat?width=900&height=700&t=5","https://cataas.com/cat?width=900&height=700&t=6","https://cataas.com/cat?width=900&height=700&t=7","https://cataas.com/cat?width=900&height=700&t=8","https://cataas.com/cat?width=900&height=700&t=9","https://cataas.com/cat?width=900&height=700&t=10","WEBCAM","https://cataas.com/cat?width=900&height=700&t=11","https://cataas.com/cat?width=900&height=700&t=12","https://cataas.com/cat?width=900&height=700&t=13","https://cataas.com/cat?width=900&height=700&t=14","https://cataas.com/cat?width=900&height=700&t=15","WEBCAM"]].sort(()=>Math.random()-.5),n=y("touchgrass",`
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
            ${t.map(b=>`<div class="brd-tip">${b}</div>`).join("")}
          </div>
          <div class="brd-btn-row" style="justify-content:center;">
            <button class="brd-btn brd-btn-danger" data-action="bypass">Emergency Bypass (will be logged)</button>
          </div>
        </div>
      </div>
    `),r=n.querySelector(".brd-zen-img"),d=n.querySelector(".brd-zen-webcam"),x=n.querySelector(".brd-zen-caption");let k=null,E=0;const D=["breathe.","you are here.","it's okay.","look at this.","touch grass.","be present.","slow down.","this is real life.","you look great btw.","hi.","go outside.","drink water."],I=async b=>{const w=a[b%a.length];if(w==="WEBCAM"){if(r.style.display="none",d.style.display="block",x.textContent="hi. this is you. say hi.",!k)try{k=await navigator.mediaDevices.getUserMedia({video:!0,audio:!1}),d.srcObject=k}catch{I(b+1);return}}else d.style.display="none",r.style.display="block",r.src=w,x.textContent=D[Math.floor(Math.random()*D.length)]};I(E);const z=setInterval(()=>{E++,I(E)},4e3);let h=null,g=null;try{h=new AudioContext,g=h.createGain(),g.gain.setValueAtTime(0,h.currentTime),g.gain.linearRampToValueAtTime(.06,h.currentTime+2),g.connect(h.destination);const b=[110,165,220];b.forEach((w,A)=>{const S=h.createOscillator(),C=h.createGain();S.type="sine",S.frequency.setValueAtTime(w,h.currentTime),C.gain.setValueAtTime(1/b.length,h.currentTime),S.connect(C),C.connect(g),S.start();const M=h.createOscillator(),G=h.createGain();M.frequency.setValueAtTime(.15+A*.05,h.currentTime),G.gain.setValueAtTime(.015,h.currentTime),M.connect(G),G.connect(C.gain),M.start()})}catch{}const P=n.querySelector("#brd-tg-timer"),V=setInterval(()=>{const b=Math.max(0,e-Date.now()),w=Math.floor(b/6e4),A=Math.floor(b%6e4/1e3);P&&(P.textContent=`${String(w).padStart(2,"0")}:${String(A).padStart(2,"0")}`),b<=0&&(clearInterval(V),clearInterval(z),this.stopZenAudio(h,g),this.stopWebcam(k),this.endTouchGrass(),this.thawFeed(),l("touchgrass"))},1e3);(j=n.querySelector("[data-action='bypass']"))==null||j.addEventListener("click",()=>{clearInterval(V),clearInterval(z),this.stopZenAudio(h,g),this.stopWebcam(k),this.bypassTouchGrass(),this.thawFeed(),l("touchgrass")})}stopZenAudio(e,t){if(!(!e||!t))try{t.gain.linearRampToValueAtTime(0,e.currentTime+.5),setTimeout(()=>e.close(),600)}catch{}}stopWebcam(e){e&&e.getTracks().forEach(t=>t.stop())}showVibeCheckOverlay(){var i;const e=q.map(a=>`
      <div class="brd-vibe-card" data-vibe="${a.id}">
        <span class="brd-vibe-emoji">${a.emoji}</span>
        <span class="brd-vibe-label">${a.label}</span>
      </div>
    `).join(""),t=y("vibecheck",`
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
    `);t.querySelectorAll("[data-vibe]").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.vibe;this.setVibeIntent(n),l("vibecheck")})}),(i=t.querySelector("[data-action='skip']"))==null||i.addEventListener("click",()=>{l("vibecheck")})}removeAllOverlays(){Q(),this.thawFeed()}}console.log("[brainrot detox] Shorts content script loaded"),new se().init()})();
