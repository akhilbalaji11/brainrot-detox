var ie=Object.defineProperty;var oe=(f,b,v)=>b in f?ie(f,b,{enumerable:!0,configurable:!0,writable:!0,value:v}):f[b]=v;var c=(f,b,v)=>oe(f,typeof b!="symbol"?b+"":b,v);(function(){"use strict";const f={basedMax:35,mediumMax:65,intervention:80,cooldownMs:6e4},b={active:!1,mode:"items",limit:10,consumed:0,startedAt:0},v={active:!1,endsAt:0,bypassCount:0},j=["[>] Step outside for 2 minutes","[~] Drink a glass of water","[o] Do 5 deep breaths","[!] Do 10 jumping jacks","[*] Look at something 20 feet away for 20 seconds","[♪] Put on your favorite song","[>] Text a friend something nice","[=] Open a window and feel the air"],x={based:{emoji:"( ._.)",label:"Based",hint:"Keep it chill, you're doing great."},medium:{emoji:"(-_-;)",label:"Medium Cooked",hint:"Maybe take a breather soon?"},cooked:{emoji:"(x_x) ",label:"Absolutely Cooked",hint:"Bro. Step away from the screen."}},H=[{id:"Chill",emoji:"~_~",label:"Just Vibing"},{id:"Learn",emoji:"o_O",label:"Learn Something"},{id:"Laugh",emoji:"xD",label:"Get Entertained"},{id:"Music",emoji:"♪♫",label:"Music / Audio"},{id:"JustHere",emoji:"...",label:"I'm Just Here"}],C=.3,N=3e3,q=15e3,$=1/30,B=1;function F(s,a,e,t){const o=Math.min(1,s/a),i=Math.min(1,e/150),n=Math.min(1,t/60),r=o*35+i*35+n*30;return Math.round(Math.min(100,r))}function U(s,a,e,t,o){const i=o==="Learn"?1.3:o==="JustHere"?1.1:o==="Laugh"?.8:o==="Chill"?.7:1;if(e){const r=a*i,d=s*(1-C)+r*C;return Math.max(0,Math.min(100,Math.round(d)))}if(t<q)return s;const n=t<45e3?1:t<9e4?2:4;return Math.max(0,s-n)}function W(s,a,e,t){return a>0?Math.max(0,Math.min(100,s+a)):t<(e==="Chill"||e==="Laugh"?15e3:e==="Learn"||e==="JustHere"?25e3:2e4)?s:t<6e4?Math.max(0,s-1):Math.max(0,s-3)}function E(s,a=f){return s<=a.basedMax?"Based":s<=a.mediumMax?"Medium Cooked":"Absolutely Cooked"}function I(s){return s==="Based"?x.based:s==="Medium Cooked"?x.medium:x.cooked}function M(s,a,e=f,t=Date.now()){return!(s<e.intervention||t-a<e.cooldownMs)}function A(s){return s>=100}function K(s,a,e,t,o){const n=Math.min(a/1e3,3)*$,r=e*B,d=n+r,p=s+d;return o<15e3?Math.min(100,Math.round(p)):o<6e4?Math.max(0,Math.round(p-1)):Math.max(0,Math.round(p-3))}function l(s){return new Promise(a=>{chrome.runtime.sendMessage(s,e=>{chrome.runtime.lastError?a({success:!1,error:chrome.runtime.lastError.message}):a(e??{success:!1,error:"No response"})})})}function L(s,a=1){return s.active?{...s,consumed:s.consumed+a}:s}function D(s,a=Date.now()){return s.active?s.mode==="items"?s.consumed>=s.limit:s.mode==="time"?(a-s.startedAt)/6e4>=s.limit:!1:!1}function Y(s,a=Date.now()){if(!s.active)return{current:0,total:0,percent:0};if(s.mode==="items")return{current:s.consumed,total:s.limit,percent:Math.min(100,Math.round(s.consumed/s.limit*100))};const e=(a-s.startedAt)/6e4;return{current:Math.round(e),total:s.limit,percent:Math.min(100,Math.round(e/s.limit*100))}}const O="brd-overlay-host";let u=null;function J(){if(u)return u;let s=document.getElementById(O);if(s||(s=document.createElement("div"),s.id=O,s.style.cssText="position:fixed;top:0;left:0;width:0;height:0;z-index:2147483647;pointer-events:none;",document.documentElement.appendChild(s)),s.shadowRoot)return u=s.shadowRoot,u;u=s.attachShadow({mode:"open"});const a=document.createElement("style");a.textContent=X,u.appendChild(a);const e=document.createElement("link");return e.rel="stylesheet",e.href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap",u.appendChild(e),u}function g(s,a){const e=J(),t=e.querySelector(`[data-overlay="${s}"]`);t&&t.remove();const o=document.createElement("div");return o.setAttribute("data-overlay",s),o.innerHTML=a,e.appendChild(o),o}function h(s){if(!u)return;const a=u.querySelector(`[data-overlay="${s}"]`);a&&a.remove()}function Z(){u&&u.querySelectorAll("[data-overlay]").forEach(s=>s.remove())}const X=`
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
`;class Q{constructor(){c(this,"settings");c(this,"session");c(this,"enabled",!1);c(this,"tickTimer",null);c(this,"lastSignalAt",0);c(this,"scrollCount",0);c(this,"swipeCount",0);c(this,"maxCookedShown",!1);c(this,"builtDifferentDismissed",!1)}async init(){var a;try{const e=await l({type:"GET_SETTINGS"});if(!e.success)return;if(this.settings=e.data,!this.settings.masterEnabled||!((a=this.settings.sites[this.site])!=null&&a.enabled)){console.log(`[brainrot detox] Disabled for ${this.site}`);return}const t=await this.getCurrentTabId();let o=await l({type:"GET_SESSION",payload:{tabId:t}});o.data?this.session=o.data:(this.session={site:this.site,tabId:t,startedAt:Date.now(),cookedScore:0,cookedStatus:"Based",lastInterventionAt:0,packState:{...b},touchGrass:{...v},vibeIntent:this.settings.vibeCheck.activeIntent,itemsConsumed:0,scrollEvents:0},await l({type:"UPDATE_SESSION",payload:{tabId:t,patch:this.session}})),this.enabled=!0,console.log(`[brainrot detox] ${this.site} adapter initialized`),this.mountCookedWidget(),this.setupObservers(),this.tickTimer=window.setInterval(()=>this.tick(),N),this.session.touchGrass.active&&this.session.touchGrass.endsAt>Date.now()&&this.showTouchGrassOverlay()}catch(e){console.error(`[brainrot detox] Init error for ${this.site}:`,e)}}destroy(){this.enabled=!1,this.tickTimer&&clearInterval(this.tickTimer),this.removeAllOverlays()}async tick(){if(!this.enabled)return;const a=Date.now(),e=this.getNewItemsSinceLastTick();this.session.itemsConsumed+=e,this.session.scrollEvents+=this.scrollCount;const t=this.scrollCount>0||e>0||this.swipeCount>0;t&&(this.lastSignalAt=a);const o=this.lastSignalAt===0?0:a-this.lastSignalAt;if(this.builtDifferentDismissed&&t){this.builtDifferentDismissed=!1,this.scrollCount=0,this.swipeCount=0,this.onBuiltDifferentDenied();return}let i;if(this.session.packState.active)i=this.session.cookedScore;else if(this.site==="shorts")i=W(this.session.cookedScore,this.swipeCount,this.session.vibeIntent,o);else{const r=(a-this.session.startedAt)/6e4,d=F(r,this.settings.cooked.sessionCapMinutes,this.session.scrollEvents,this.session.itemsConsumed);i=U(this.session.cookedScore,d,t,o,this.session.vibeIntent)}this.scrollCount=0,this.swipeCount=0,this.session.cookedScore=i,this.session.cookedStatus=E(i,this.settings.cooked.thresholds),this.session.packState.active&&(this.session.packState=L(this.session.packState,e),D(this.session.packState,a)&&this.onPackComplete()),this.session.packState.active||(A(i)?this.maxCookedShown||(this.maxCookedShown=!0,this.onMaxCooked()):(i<95&&(this.maxCookedShown=!1),i>=this.session.cookedScore&&M(i,this.session.lastInterventionAt,this.settings.cooked.thresholds,a)&&(this.session.lastInterventionAt=a,this.onIntervention()))),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus);const n=this.session.tabId;await l({type:"UPDATE_SESSION",payload:{tabId:n,patch:this.session}})}async getCurrentTabId(){return new Promise(a=>{const e=Math.floor(Math.random()*1e6);l({type:"GET_CURRENT_TAB"}).then(t=>{var o;a(((o=t.data)==null?void 0:o.id)??e)})})}onIntervention(){l({type:"LOG_EVENT",payload:{eventType:"intervention"}}),this.showInterventionOverlay()}onMaxCooked(){this.session.lastInterventionAt=Date.now(),l({type:"LOG_EVENT",payload:{eventType:"intervention"}}),this.showSkyrimOverlay("Your brain is absolutely cooked (x_x)")}onPackComplete(){this.session.packState={...b},this.maxCookedShown=!1,l({type:"END_PACK",payload:{tabId:this.session.tabId}}),this.showSkyrimOverlay("[#] Pack Complete! Time to touch grass.")}onBuiltDifferentDenied(){this.showBuiltDifferentDeniedOverlay()}async startPack(a,e){await l({type:"START_PACK",payload:{tabId:this.session.tabId,mode:a,limit:e}}),this.session.packState={active:!0,mode:a,limit:e,consumed:0,startedAt:Date.now()},this.session.cookedScore=0,this.session.cookedStatus="Based",this.maxCookedShown=!1,this.builtDifferentDismissed=!1}async startTouchGrass(a){await l({type:"START_TOUCH_GRASS",payload:{tabId:this.session.tabId,minutes:a}}),this.session.touchGrass={active:!0,endsAt:Date.now()+a*6e4,bypassCount:0},this.showTouchGrassOverlay()}async endTouchGrass(){await l({type:"END_TOUCH_GRASS",payload:{tabId:this.session.tabId}}),this.session.touchGrass={...v},this.removeAllOverlays()}async bypassTouchGrass(){this.session.touchGrass.bypassCount++,l({type:"LOG_EVENT",payload:{eventType:"bypass"}}),await this.endTouchGrass()}setVibeIntent(a){this.session.vibeIntent=a,l({type:"UPDATE_SESSION",payload:{tabId:this.session.tabId,patch:{vibeIntent:a}}}),l({type:"LOG_EVENT",payload:{eventType:"vibe_check"}})}}class ee extends Q{constructor(){super(...arguments);c(this,"site","tiktok");c(this,"itemsSinceLastTick",0);c(this,"watchTimeSinceLastTick",0);c(this,"lastVideoId","");c(this,"videoObserver",null);c(this,"currentVideo",null);c(this,"onWheel",e=>{Math.abs(e.deltaY)>20&&this.swipeCount++})}getTikTokVideo(){return document.querySelector("[data-e2e='recommend-list-item-container'] video")??document.querySelector(".tiktok-web-player video")??document.querySelector("video")}freezeFeed(){const e=this.getTikTokVideo();e&&!e.paused&&e.pause()}thawFeed(){const e=this.getTikTokVideo();e&&e.paused&&e.play().catch(()=>{})}setupObservers(){window.addEventListener("wheel",this.onWheel,{passive:!0});let e=0;window.addEventListener("touchstart",t=>{var o;e=((o=t.touches[0])==null?void 0:o.clientY)??0},{passive:!0}),window.addEventListener("touchend",t=>{var i;const o=e-(((i=t.changedTouches[0])==null?void 0:i.clientY)??0);Math.abs(o)>50&&(this.swipeCount++,this.itemsSinceLastTick++)},{passive:!0}),this.watchVideoChanges(),this.trackWatchTime(),chrome.runtime.onMessage.addListener((t,o,i)=>{var n,r,d;return t.type==="END_TOUCH_GRASS"?(this.session.touchGrass={active:!1,endsAt:0,bypassCount:0},h("skyrim"),h("touchgrass"),this.thawFeed(),i({success:!0}),!1):t.type==="TRIGGER_TOUCH_GRASS"?(this.startTouchGrass(((n=t.payload)==null?void 0:n.minutes)??5),i({success:!0}),!1):t.type==="TRIGGER_PACK"?(this.startPack(((r=t.payload)==null?void 0:r.mode)??"items",((d=t.payload)==null?void 0:d.limit)??10),i({success:!0}),!1):(t.type==="TRIGGER_VIBE_CHECK"&&(this.showVibeCheckOverlay(),i({success:!0})),!1)})}watchVideoChanges(){const e=()=>{const i=this.getTikTokVideo();if(i&&i!==this.currentVideo){this.currentVideo=i;const n=i.src||i.currentSrc||String(Date.now());n!==this.lastVideoId&&(this.lastVideoId=n,this.itemsSinceLastTick++)}};setInterval(e,500);const t=new MutationObserver(()=>e()),o=()=>{const i=document.querySelector("[data-e2e='recommend-list-item-container']")??document.querySelector(".tiktok-web-player")??document.body;t.observe(i,{childList:!0,subtree:!0})};document.readyState==="complete"?o():window.addEventListener("load",o),this.videoObserver=t}trackWatchTime(){setInterval(()=>{const t=this.getTikTokVideo();t&&!t.paused&&this.isVideoInViewport(t)&&(this.watchTimeSinceLastTick+=100)},100)}isVideoInViewport(e){const t=e.getBoundingClientRect();return t.top>=0&&t.left>=0&&t.bottom<=(window.innerHeight||document.documentElement.clientHeight)&&t.right<=(window.innerWidth||document.documentElement.clientWidth)}getNewItemsSinceLastTick(){const e=this.itemsSinceLastTick;return this.itemsSinceLastTick=0,e}getWatchTimeSinceLastTick(){const e=this.watchTimeSinceLastTick;return this.watchTimeSinceLastTick=0,e}mountCookedWidget(){this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus)}updateCookedWidget(e,t){const o=I(t),i=t==="Based"?"brd-score-based":t==="Medium Cooked"?"brd-score-medium":"brd-score-cooked";let n="";if(this.session.packState.active){const p=Y(this.session.packState);n=`
                <div style="width:100%;margin-top:6px;">
                    <div style="font-size:10px;color:#94a3b8;margin-bottom:3px;">[#] Pack: ${p.current}/${p.total}</div>
                    <div class="brd-pack-bar"><div class="brd-pack-fill" style="width:${p.percent}%"></div></div>
                </div>
            `}const d=g("widget",`
            <div class="brd-widget">
                <span class="brd-widget-emoji">${o.emoji}</span>
                <span class="brd-widget-label">${o.label}</span>
                <span class="brd-widget-score ${i}">${e}</span>
                ${n}
            </div>
        `).querySelector(".brd-widget");d&&(d.style.cursor="pointer",d.onclick=()=>this.showVibeCheckOverlay())}showInterventionOverlay(){var o,i,n;const e=I(this.session.cookedStatus),t=g("intervention",`
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
        `);(o=t.querySelector("[data-action='dismiss']"))==null||o.addEventListener("click",()=>h("intervention")),(i=t.querySelector("[data-action='pack']"))==null||i.addEventListener("click",()=>{h("intervention"),this.startPack("items",10)}),(n=t.querySelector("[data-action='grass']"))==null||n.addEventListener("click",()=>{h("intervention"),this.startTouchGrass(5)})}showBuiltDifferentDeniedOverlay(){var t,o,i;this.freezeFeed();const e=g("denied",`
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
        `);(t=e.querySelector("[data-action='grass']"))==null||t.addEventListener("click",()=>{h("denied"),this.thawFeed(),this.startTouchGrass(5)}),(o=e.querySelector("[data-action='pack']"))==null||o.addEventListener("click",()=>{h("denied"),this.thawFeed(),this.startPack("items",10)}),(i=e.querySelector("[data-action='vibe']"))==null||i.addEventListener("click",()=>{h("denied"),this.thawFeed(),this.showVibeCheckOverlay()})}showSkyrimOverlay(e){var n,r,d;const t=chrome.runtime.getURL("assets/skyrim-skeleton.mp4");this.freezeFeed();const o=g("skyrim",`
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
        `),i=o.querySelector("video");i&&(i.src=t,i.load(),i.play().catch(()=>{})),(n=o.querySelector("[data-action='grass']"))==null||n.addEventListener("click",()=>{h("skyrim"),this.thawFeed(),this.startTouchGrass(5)}),(r=o.querySelector("[data-action='pack']"))==null||r.addEventListener("click",()=>{h("skyrim"),this.thawFeed(),this.startPack("items",10)}),(d=o.querySelector("[data-action='dismiss']"))==null||d.addEventListener("click",()=>{h("skyrim"),this.thawFeed(),this.builtDifferentDismissed=!0})}showTouchGrassOverlay(){var R;const e=this.session.touchGrass.endsAt,t=j.sort(()=>Math.random()-.5).slice(0,3);this.freezeFeed();const i=[...["https://cataas.com/cat?width=900&height=700&t=1","https://cataas.com/cat?width=900&height=700&t=2","https://cataas.com/cat?width=900&height=700&t=3","https://cataas.com/cat?width=900&height=700&t=4","WEBCAM","https://cataas.com/cat?width=900&height=700&t=5","https://cataas.com/cat?width=900&height=700&t=6"]].sort(()=>Math.random()-.5),n=g("touchgrass",`
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
                        ${t.map(m=>`<div class="brd-tip">${m}</div>`).join("")}
                    </div>
                    <div class="brd-btn-row" style="justify-content:center;">
                        <button class="brd-btn brd-btn-danger" data-action="bypass">Emergency Bypass (will be logged)</button>
                    </div>
                </div>
            </div>
        `),r=n.querySelector(".brd-zen-img"),d=n.querySelector(".brd-zen-webcam"),p=n.querySelector(".brd-zen-caption");let k=null,S=0;const G=["breathe.","you are here.","it's okay.","look at this.","touch grass.","be present.","slow down.","this is real life."],T=async m=>{const y=i[m%i.length];if(y==="WEBCAM"){if(r.style.display="none",d.style.display="block",p.textContent="hi. this is you.",!k)try{k=await navigator.mediaDevices.getUserMedia({video:!0,audio:!1}),d.srcObject=k}catch{T(m+1)}}else d.style.display="none",r.style.display="block",r.src=y,p.textContent=G[Math.floor(Math.random()*G.length)]};T(S);const z=setInterval(()=>{S++,T(S)},4e3),P=n.querySelector("#brd-tg-timer"),V=setInterval(()=>{const m=Math.max(0,e-Date.now()),y=Math.floor(m/6e4),te=Math.floor(m%6e4/1e3);P&&(P.textContent=`${String(y).padStart(2,"0")}:${String(te).padStart(2,"0")}`),m<=0&&(clearInterval(V),clearInterval(z),k&&k.getTracks().forEach(se=>se.stop()),this.endTouchGrass(),this.thawFeed(),h("touchgrass"))},1e3);(R=n.querySelector("[data-action='bypass']"))==null||R.addEventListener("click",()=>{clearInterval(V),clearInterval(z),k&&k.getTracks().forEach(m=>m.stop()),this.bypassTouchGrass(),this.thawFeed(),h("touchgrass")})}showVibeCheckOverlay(){var o;const e=H.map(i=>`
            <div class="brd-vibe-card" data-vibe="${i.id}">
                <span class="brd-vibe-emoji">${i.emoji}</span>
                <span class="brd-vibe-label">${i.label}</span>
            </div>
        `).join(""),t=g("vibecheck",`
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
        `);t.querySelectorAll("[data-vibe]").forEach(i=>{i.addEventListener("click",()=>{const n=i.dataset.vibe;this.setVibeIntent(n),h("vibecheck")})}),(o=t.querySelector("[data-action='skip']"))==null||o.addEventListener("click",()=>{h("vibecheck")})}async tick(){if(!this.enabled)return;const e=Date.now(),t=this.getNewItemsSinceLastTick();this.session.itemsConsumed+=t,this.session.scrollEvents+=this.scrollCount;const o=this.scrollCount>0||t>0||this.swipeCount>0;o&&(this.lastSignalAt=e);const i=this.lastSignalAt===0?0:e-this.lastSignalAt;if(this.builtDifferentDismissed&&o){this.builtDifferentDismissed=!1,this.scrollCount=0,this.swipeCount=0,this.onBuiltDifferentDenied();return}const n=this.getWatchTimeSinceLastTick();let r;this.session.packState.active?r=this.session.cookedScore:r=K(this.session.cookedScore,n,this.swipeCount,this.session.vibeIntent,i),this.scrollCount=0,this.swipeCount=0,this.session.cookedScore=r,this.session.cookedStatus=E(r,this.settings.cooked.thresholds),this.session.packState.active&&(this.session.packState=L(this.session.packState,t),D(this.session.packState,e)&&this.onPackComplete()),this.session.packState.active||(A(r)?this.maxCookedShown||(this.maxCookedShown=!0,this.onMaxCooked()):(r<95&&(this.maxCookedShown=!1),r>=this.session.cookedScore&&M(r,this.session.lastInterventionAt,this.settings.cooked.thresholds,e)&&(this.session.lastInterventionAt=e,this.onIntervention()))),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus),await l({type:"UPDATE_SESSION",payload:{tabId:this.session.tabId,patch:this.session}})}removeAllOverlays(){Z(),this.thawFeed()}}console.log("[brainrot detox] TikTok content script loaded");const w=new ee;w.init();let _=location.href;new MutationObserver(()=>{location.href!==_&&(_=location.href,(location.pathname.includes("/foryou")||location.pathname.includes("/following")||location.pathname==="/")&&(w.destroy(),w.init()))}).observe(document.body,{subtree:!0,childList:!0})})();
