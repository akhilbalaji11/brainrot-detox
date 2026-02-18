var N=Object.defineProperty;var U=(f,h,m)=>h in f?N(f,h,{enumerable:!0,configurable:!0,writable:!0,value:m}):f[h]=m;var b=(f,h,m)=>U(f,typeof h!="symbol"?h+"":h,m);(function(){"use strict";const f={basedMax:35,mediumMax:65,intervention:80,cooldownMs:6e4},h={active:!1,mode:"items",limit:10,consumed:0,startedAt:0},m={active:!1,endsAt:0,bypassCount:0},S=["[>] Step outside for 2 minutes","[~] Drink a glass of water","[o] Do 5 deep breaths","[!] Do 10 jumping jacks","[*] Look at something 20 feet away for 20 seconds","[♪] Put on your favorite song","[>] Text a friend something nice","[=] Open a window and feel the air"],y={based:{emoji:"( ._.)",label:"Based",hint:"Keep it chill, you're doing great."},medium:{emoji:"(-_-;)",label:"Medium Cooked",hint:"Maybe take a breather soon?"},cooked:{emoji:"(x_x) ",label:"Absolutely Cooked",hint:"Bro. Step away from the screen."}},C=[{id:"Chill",emoji:"~_~",label:"Just Vibing"},{id:"Learn",emoji:"o_O",label:"Learn Something"},{id:"Laugh",emoji:"xD",label:"Get Entertained"},{id:"Music",emoji:"♪♫",label:"Music / Audio"},{id:"JustHere",emoji:"...",label:"I'm Just Here"}],g=.3,T=3e3,E=15e3;function I(e,i,t,o){const s=Math.min(1,e/i),a=Math.min(1,t/150),n=Math.min(1,o/60),r=s*35+a*35+n*30;return Math.round(Math.min(100,r))}function A(e,i,t,o,s){const a=s==="Learn"?1.3:s==="JustHere"?1.1:s==="Laugh"?.8:s==="Chill"?.7:1;if(t){const r=i*a,d=e*(1-g)+r*g;return Math.max(0,Math.min(100,Math.round(d)))}if(o<E)return e;const n=o<45e3?1:o<9e4?2:4;return Math.max(0,e-n)}function L(e,i,t,o){return i>0?Math.max(0,Math.min(100,e+i)):o<(t==="Chill"||t==="Laugh"?15e3:t==="Learn"||t==="JustHere"?25e3:2e4)?e:o<6e4?Math.max(0,e-1):Math.max(0,e-3)}function M(e,i=f){return e<=i.basedMax?"Based":e<=i.mediumMax?"Medium Cooked":"Absolutely Cooked"}function k(e){return e==="Based"?y.based:e==="Medium Cooked"?y.medium:y.cooked}function D(e,i,t=f,o=Date.now()){return!(e<t.intervention||o-i<t.cooldownMs)}function _(e){return e>=100}function G(e,i=1){return e.active?{...e,consumed:e.consumed+i}:e}function O(e,i=Date.now()){return e.active?e.mode==="items"?e.consumed>=e.limit:e.mode==="time"?(i-e.startedAt)/6e4>=e.limit:!1:!1}function P(e,i=Date.now()){if(!e.active)return{current:0,total:0,percent:0};if(e.mode==="items")return{current:e.consumed,total:e.limit,percent:Math.min(100,Math.round(e.consumed/e.limit*100))};const t=(i-e.startedAt)/6e4;return{current:Math.round(t),total:e.limit,percent:Math.min(100,Math.round(t/e.limit*100))}}const w="brd-overlay-host";let p=null;function z(){if(p)return p;let e=document.getElementById(w);if(e||(e=document.createElement("div"),e.id=w,e.style.cssText="position:fixed;top:0;left:0;width:0;height:0;z-index:2147483647;pointer-events:none;",document.documentElement.appendChild(e)),e.shadowRoot)return p=e.shadowRoot,p;p=e.attachShadow({mode:"open"});const i=document.createElement("style");i.textContent=j,p.appendChild(i);const t=document.createElement("link");return t.rel="stylesheet",t.href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap",p.appendChild(t),p}function v(e,i){const t=z(),o=t.querySelector(`[data-overlay="${e}"]`);o&&o.remove();const s=document.createElement("div");return s.setAttribute("data-overlay",e),s.innerHTML=i,t.appendChild(s),s}function c(e){if(!p)return;const i=p.querySelector(`[data-overlay="${e}"]`);i&&i.remove()}function R(){p&&p.querySelectorAll("[data-overlay]").forEach(e=>e.remove())}const j=`
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
`;function l(e){return new Promise(i=>{chrome.runtime.sendMessage(e,t=>{chrome.runtime.lastError?i({success:!1,error:chrome.runtime.lastError.message}):i(t??{success:!1,error:"No response"})})})}class H{constructor(){b(this,"settings");b(this,"session");b(this,"enabled",!1);b(this,"tickTimer",null);b(this,"lastSignalAt",0);b(this,"scrollCount",0);b(this,"swipeCount",0);b(this,"maxCookedShown",!1);b(this,"builtDifferentDismissed",!1)}async init(){var i;try{const t=await l({type:"GET_SETTINGS"});if(!t.success)return;if(this.settings=t.data,!this.settings.masterEnabled||!((i=this.settings.sites[this.site])!=null&&i.enabled)){console.log(`[brainrot detox] Disabled for ${this.site}`);return}const o=await this.getCurrentTabId();let s=await l({type:"GET_SESSION",payload:{tabId:o}});s.data?this.session=s.data:(this.session={site:this.site,tabId:o,startedAt:Date.now(),cookedScore:0,cookedStatus:"Based",lastInterventionAt:0,packState:{...h},touchGrass:{...m},vibeIntent:this.settings.vibeCheck.activeIntent,itemsConsumed:0,scrollEvents:0},await l({type:"UPDATE_SESSION",payload:{tabId:o,patch:this.session}})),this.enabled=!0,console.log(`[brainrot detox] ${this.site} adapter initialized`),this.mountCookedWidget(),this.setupObservers(),this.tickTimer=window.setInterval(()=>this.tick(),T),this.session.touchGrass.active&&this.session.touchGrass.endsAt>Date.now()&&this.showTouchGrassOverlay()}catch(t){console.error(`[brainrot detox] Init error for ${this.site}:`,t)}}destroy(){this.enabled=!1,this.tickTimer&&clearInterval(this.tickTimer),this.removeAllOverlays()}async tick(){if(!this.enabled)return;const i=Date.now(),t=this.getNewItemsSinceLastTick();this.session.itemsConsumed+=t,this.session.scrollEvents+=this.scrollCount;const o=this.scrollCount>0||t>0||this.swipeCount>0;o&&(this.lastSignalAt=i);const s=this.lastSignalAt===0?0:i-this.lastSignalAt;if(this.builtDifferentDismissed&&o){this.builtDifferentDismissed=!1,this.scrollCount=0,this.swipeCount=0,this.onBuiltDifferentDenied();return}let a;if(this.session.packState.active)a=this.session.cookedScore;else if(this.site==="shorts")a=L(this.session.cookedScore,this.swipeCount,this.session.vibeIntent,s);else{const r=(i-this.session.startedAt)/6e4,d=I(r,this.settings.cooked.sessionCapMinutes,this.session.scrollEvents,this.session.itemsConsumed);a=A(this.session.cookedScore,d,o,s,this.session.vibeIntent)}this.scrollCount=0,this.swipeCount=0,this.session.cookedScore=a,this.session.cookedStatus=M(a,this.settings.cooked.thresholds),this.session.packState.active&&(this.session.packState=G(this.session.packState,t),O(this.session.packState,i)&&this.onPackComplete()),this.session.packState.active||(_(a)?this.maxCookedShown||(this.maxCookedShown=!0,this.onMaxCooked()):(a<95&&(this.maxCookedShown=!1),a>=this.session.cookedScore&&D(a,this.session.lastInterventionAt,this.settings.cooked.thresholds,i)&&(this.session.lastInterventionAt=i,this.onIntervention()))),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus);const n=this.session.tabId;await l({type:"UPDATE_SESSION",payload:{tabId:n,patch:this.session}})}async getCurrentTabId(){return new Promise(i=>{const t=Math.floor(Math.random()*1e6);l({type:"GET_CURRENT_TAB"}).then(o=>{var s;i(((s=o.data)==null?void 0:s.id)??t)})})}onIntervention(){l({type:"LOG_EVENT",payload:{eventType:"intervention"}}),this.showInterventionOverlay()}onMaxCooked(){this.session.lastInterventionAt=Date.now(),l({type:"LOG_EVENT",payload:{eventType:"intervention"}}),this.showSkyrimOverlay("Your brain is absolutely cooked (x_x)")}onPackComplete(){this.session.packState={...h},this.maxCookedShown=!1,l({type:"END_PACK",payload:{tabId:this.session.tabId}}),this.showSkyrimOverlay("[#] Pack Complete! Time to touch grass.")}onBuiltDifferentDenied(){this.showBuiltDifferentDeniedOverlay()}async startPack(i,t){await l({type:"START_PACK",payload:{tabId:this.session.tabId,mode:i,limit:t}}),this.session.packState={active:!0,mode:i,limit:t,consumed:0,startedAt:Date.now()},this.session.cookedScore=0,this.session.cookedStatus="Based",this.maxCookedShown=!1,this.builtDifferentDismissed=!1}async startTouchGrass(i){await l({type:"START_TOUCH_GRASS",payload:{tabId:this.session.tabId,minutes:i}}),this.session.touchGrass={active:!0,endsAt:Date.now()+i*6e4,bypassCount:0},this.showTouchGrassOverlay()}async endTouchGrass(){await l({type:"END_TOUCH_GRASS",payload:{tabId:this.session.tabId}}),this.session.touchGrass={...m},this.removeAllOverlays()}async bypassTouchGrass(){this.session.touchGrass.bypassCount++,l({type:"LOG_EVENT",payload:{eventType:"bypass"}}),await this.endTouchGrass()}setVibeIntent(i){this.session.vibeIntent=i,l({type:"UPDATE_SESSION",payload:{tabId:this.session.tabId,patch:{vibeIntent:i}}}),l({type:"LOG_EVENT",payload:{eventType:"vibe_check"}})}}class $ extends H{constructor(){super(...arguments);b(this,"site","reddit");b(this,"itemsSinceLastTick",0);b(this,"lastSeenItems",0)}setupObservers(){window.addEventListener("scroll",()=>{this.scrollCount++},{passive:!0});const t=new MutationObserver(()=>{const s=document.querySelectorAll("shreddit-post, [data-testid='post-container'], .Post, article");s.length>this.lastSeenItems&&(this.itemsSinceLastTick+=s.length-this.lastSeenItems,this.lastSeenItems=s.length)}),o=()=>{const s=document.querySelector("#main-content, [data-testid='posts-list'], .ListingLayout-outerContainer")||document.body;t.observe(s,{childList:!0,subtree:!0})};document.readyState==="complete"?o():window.addEventListener("load",o),chrome.runtime.onMessage.addListener((s,a,n)=>{var r,d,u;return s.type==="END_TOUCH_GRASS"?(this.session.touchGrass={active:!1,endsAt:0,bypassCount:0},c("skyrim"),c("touchgrass"),n({success:!0}),!1):s.type==="TRIGGER_TOUCH_GRASS"?(this.startTouchGrass(((r=s.payload)==null?void 0:r.minutes)??5),n({success:!0}),!1):s.type==="TRIGGER_PACK"?(this.startPack(((d=s.payload)==null?void 0:d.mode)??"items",((u=s.payload)==null?void 0:u.limit)??10),n({success:!0}),!1):(s.type==="TRIGGER_VIBE_CHECK"&&(this.showVibeCheckOverlay(),n({success:!0})),!1)})}getNewItemsSinceLastTick(){const t=this.itemsSinceLastTick;return this.itemsSinceLastTick=0,t}mountCookedWidget(){this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus)}updateCookedWidget(t,o){const s=k(o),a=o==="Based"?"brd-score-based":o==="Medium Cooked"?"brd-score-medium":"brd-score-cooked";let n="";if(this.session.packState.active){const u=P(this.session.packState);n=`<div style="width:100%;margin-top:6px;"><div style="font-size:10px;color:#94a3b8;margin-bottom:3px;">🍱 Pack: ${u.current}/${u.total}</div><div class="brd-pack-bar"><div class="brd-pack-fill" style="width:${u.percent}%"></div></div></div>`}const d=v("widget",`<div class="brd-widget"><span class="brd-widget-emoji">${s.emoji}</span><span class="brd-widget-label">${s.label}</span><span class="brd-widget-score ${a}">${t}</span>${n}</div>`).querySelector(".brd-widget");d&&(d.style.cursor="pointer",d.onclick=()=>this.showVibeCheckOverlay())}showInterventionOverlay(){var s,a,n;const t=k(this.session.cookedStatus),o=v("intervention",`<div class="brd-fullscreen"><div class="brd-card"><h2>${t.emoji} ${t.label}!</h2><p>Score: ${this.session.cookedScore}. Brain is getting crispy.</p><div class="brd-btn-row"><button class="brd-btn brd-btn-ghost" data-action="dismiss">Keep Going 🤷</button><button class="brd-btn brd-btn-primary" data-action="pack">Start Pack 🍱</button><button class="brd-btn brd-btn-success" data-action="grass">Touch Grass 🌿</button></div></div></div>`);(s=o.querySelector("[data-action='dismiss']"))==null||s.addEventListener("click",()=>c("intervention")),(a=o.querySelector("[data-action='pack']"))==null||a.addEventListener("click",()=>{c("intervention"),this.startPack("items",10)}),(n=o.querySelector("[data-action='grass']"))==null||n.addEventListener("click",()=>{c("intervention"),this.startTouchGrass(5)})}showSkyrimOverlay(t){var n,r,d;const o=chrome.runtime.getURL("assets/skyrim-skeleton.mp4"),s=v("skyrim",`<div class="brd-fullscreen"><div class="brd-video-wrap"><video playsinline></video></div><div class="brd-message">${t}</div><div class="brd-btn-row"><button class="brd-btn brd-btn-success" data-action="grass">[*] Touch Grass</button><button class="brd-btn brd-btn-primary" data-action="pack">[#] Start Pack</button><button class="brd-btn brd-btn-ghost" data-action="dismiss">I'm Built Different [+]</button></div></div>`),a=s.querySelector("video");a&&(a.src=o,a.load(),a.play().catch(()=>{})),(n=s.querySelector("[data-action='grass']"))==null||n.addEventListener("click",()=>{c("skyrim"),this.startTouchGrass(5)}),(r=s.querySelector("[data-action='pack']"))==null||r.addEventListener("click",()=>{c("skyrim"),this.startPack("items",10)}),(d=s.querySelector("[data-action='dismiss']"))==null||d.addEventListener("click",()=>{c("skyrim"),this.builtDifferentDismissed=!0})}showTouchGrassOverlay(){var u;const t=this.session.touchGrass.endsAt,o=S.sort(()=>Math.random()-.5).slice(0,3),s=chrome.runtime.getURL("assets/skyrim-skeleton.mp4"),a=v("touchgrass",`<div class="brd-fullscreen"><div class="brd-video-wrap"><video loop playsinline></video></div><div class="brd-card"><h2>[*] Touch Grass Mode</h2><p>Feed locked.</p><div class="brd-timer" id="brd-tg-timer">00:00</div><div class="brd-tips">${o.map(x=>`<div class="brd-tip">${x}</div>`).join("")}</div><div class="brd-btn-row" style="justify-content:center;"><button class="brd-btn brd-btn-danger" data-action="bypass">Emergency Bypass (will be logged)</button></div></div></div>`),n=a.querySelector("video");n&&(n.src=s,n.load(),n.play().catch(()=>{}));const r=a.querySelector("#brd-tg-timer"),d=setInterval(()=>{const x=Math.max(0,t-Date.now()),q=Math.floor(x/6e4),B=Math.floor(x%6e4/1e3);r&&(r.textContent=`${String(q).padStart(2,"0")}:${String(B).padStart(2,"0")}`),x<=0&&(clearInterval(d),this.endTouchGrass(),c("touchgrass"))},1e3);(u=a.querySelector("[data-action='bypass']"))==null||u.addEventListener("click",()=>{clearInterval(d),this.bypassTouchGrass(),c("touchgrass")})}showVibeCheckOverlay(){var s;const t=C.map(a=>`<div class="brd-vibe-card" data-vibe="${a.id}"><span class="brd-vibe-emoji">${a.emoji}</span><span class="brd-vibe-label">${a.label}</span></div>`).join(""),o=v("vibecheck",`<div class="brd-fullscreen"><div class="brd-card"><h2>✨ Vibe Check</h2><p>What are you here for?</p><div class="brd-vibe-grid">${t}</div><div class="brd-btn-row" style="justify-content:center;"><button class="brd-btn brd-btn-ghost" data-action="skip">Skip</button></div></div></div>`);o.querySelectorAll("[data-vibe]").forEach(a=>a.addEventListener("click",()=>{this.setVibeIntent(a.dataset.vibe),c("vibecheck")})),(s=o.querySelector("[data-action='skip']"))==null||s.addEventListener("click",()=>c("vibecheck"))}showBuiltDifferentDeniedOverlay(){var o,s,a;const t=v("denied",'<div class="brd-fullscreen"><div class="brd-card"><h2 style="font-size:28px;text-align:center;color:#f87171;">No you are not.</h2><p style="text-align:center;">Pick one.</p><div class="brd-btn-row" style="justify-content:center;"><button class="brd-btn brd-btn-success" data-action="grass">[*] Touch Grass</button><button class="brd-btn brd-btn-primary" data-action="pack">[#] Start Pack</button><button class="brd-btn brd-btn-ghost" data-action="vibe">[?] Vibe Check</button></div></div></div>');(o=t.querySelector("[data-action='grass']"))==null||o.addEventListener("click",()=>{c("denied"),this.startTouchGrass(5)}),(s=t.querySelector("[data-action='pack']"))==null||s.addEventListener("click",()=>{c("denied"),this.startPack("items",10)}),(a=t.querySelector("[data-action='vibe']"))==null||a.addEventListener("click",()=>{c("denied"),this.showVibeCheckOverlay()})}removeAllOverlays(){R()}}console.log("[brainrot detox] Reddit content script loaded"),new $().init()})();
