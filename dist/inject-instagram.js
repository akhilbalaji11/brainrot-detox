var Oe=Object.defineProperty;var De=(y,g,C)=>g in y?Oe(y,g,{enumerable:!0,configurable:!0,writable:!0,value:C}):y[g]=C;var l=(y,g,C)=>De(y,typeof g!="symbol"?g+"":g,C);(function(){"use strict";const y={basedMax:35,mediumMax:65,intervention:80,cooldownMs:6e4},g={active:!1,mode:"items",limit:10,consumed:0,startedAt:0},C={active:!1,endsAt:0,bypassCount:0},Z=["[>] Step outside for 2 minutes","[~] Drink a glass of water","[o] Do 5 deep breaths","[!] Do 10 jumping jacks","[*] Look at something 20 feet away for 20 seconds","[~] Put on your favorite song","[>] Text a friend something nice","[=] Open a window and feel the air"],_={based:{emoji:"( ._.)",label:"Based",hint:"Keep it chill, you're doing great."},medium:{emoji:"(-_-;)",label:"Medium Cooked",hint:"Maybe take a breather soon?"},cooked:{emoji:"(x_x) ",label:"Absolutely Cooked",hint:"Bro. Step away from the screen."}},ee=12,P=[{id:"hydrate",icon:"[~]",title:"Hydration Hero",instruction:"Take a real sip of water. Yes, right now.",durationSec:8},{id:"stretch",icon:"[>]",title:"Stretch Goblin",instruction:"Stand up and stretch your arms overhead like you mean it.",durationSec:10},{id:"far-focus",icon:"[*]",title:"Far Away Focus",instruction:"Look at something far away until your eyeballs stop buzzing.",durationSec:8},{id:"jaw-reset",icon:"[=]",title:"Jaw Reset",instruction:"Unclench your jaw and roll your shoulders twice.",durationSec:6},{id:"breaths",icon:"[o]",title:"Five Deep Breaths",instruction:"Take 5 slow breaths. In. Out. Main character reset.",durationSec:10},{id:"window-patrol",icon:"[!]",title:"Window Patrol",instruction:"Look out a window or focus on something real-world for a moment.",durationSec:8}],F=.3,te=15e3,se=500,oe=3e3,ie=2e3,B=4e3,re=.35,ne=3,N=2e4,U={edge:"right",verticalOffset:20};function k(s){return Math.max(0,Math.min(100,s))}function ae(s,t,e,o){const i=Math.min(1,s/t),r=Math.min(1,e/150),n=Math.min(1,o/60),a=i*35+r*35+n*30;return Math.round(Math.min(100,a))}function de(s,t,e,o){if(e){const r=s*(1-F)+t*F;return k(r)}if(o<te)return s;const i=o<45e3?1:o<9e4?2:4;return k(s-i)}function ce(s,t,e){return t>0?k(s+t):e<N?s:e<6e4?k(s-1):k(s-3)}function H(s,t=y){return s<=t.basedMax?"Based":s<=t.mediumMax?"Medium Cooked":"Absolutely Cooked"}function W(s){return s==="Based"?_.based:s==="Medium Cooked"?_.medium:_.cooked}function le(s,t,e=y,o=Date.now()){return!(s<e.intervention||o-t<e.cooldownMs)}function L(s){return s>=100}function ue(s,t,e){return t>0?k(s+t):e<N?s:e<6e4?k(s-1):k(s-3)}const $="brd_widget_positions";async function he(s,t){return(await chrome.storage.local.get(s))[s]??t}async function pe(s,t){await chrome.storage.local.set({[s]:t})}async function j(){return he($,{})}async function be(s){return(await j())[s]??U}async function fe(s,t){const e=await j();e[s]=t,await pe($,e)}const q="brd-overlay-host",me=8;let f=null,x={...U},m=null,M=null;function G(){if(f)return f;let s=document.getElementById(q);if(s||(s=document.createElement("div"),s.id=q,s.style.cssText="position:fixed;top:0;left:0;width:0;height:0;z-index:2147483647;pointer-events:none;",document.documentElement.appendChild(s)),s.shadowRoot)return f=s.shadowRoot,V(),f;f=s.attachShadow({mode:"open"});const t=document.createElement("style");t.textContent=we,f.appendChild(t);const e=document.createElement("link");return e.rel="stylesheet",e.href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap",f.appendChild(e),V(),f}function E(s,t){const e=G(),o=e.querySelector(`[data-overlay="${s}"]`);o&&o.remove();const i=document.createElement("div");return i.setAttribute("data-overlay",s),i.innerHTML=t,e.appendChild(i),i}function ge(s){const t=G();M=s.onActivate??null;let e=t.querySelector('[data-overlay="widget"]');if(!e){e=document.createElement("div"),e.setAttribute("data-overlay","widget"),e.innerHTML=`
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
    `,t.appendChild(e);const o=e.querySelector(".brd-widget");o&&(m==null||m(),m=xe(o,s.siteKey))}return ke(e,s),A(),e}function u(s){const t=f;if(!t)return;const e=t.querySelector(`[data-overlay="${s}"]`);e&&(s==="widget"&&(m==null||m(),m=null,M=null),e.remove())}function ve(){const s=f;s&&(m==null||m(),m=null,M=null,s.querySelectorAll("[data-overlay]").forEach(t=>t.remove()))}function Y(){return G()}async function ye(s){x=await be(s),A()}async function V(){var o;const s=await chrome.runtime.sendMessage({type:"GET_SETTINGS"}),t=s!=null&&s.success&&((o=s.data)!=null&&o.theme)?s.data.theme:"light",e=document.getElementById(q);e&&(t==="dark"?e.classList.add("brd-dark"):e.classList.remove("brd-dark"))}function ke(s,t){const e=s.querySelector(".brd-widget");if(!e)return;e.dataset.score=t.score.toFixed(3),e.dataset.status=t.status;const o=W(t.status),i=t.status==="Based"?"brd-score-based":t.status==="Medium Cooked"?"brd-score-medium":"brd-score-cooked",r=e.querySelector(".brd-widget-emoji"),n=e.querySelector(".brd-widget-label"),a=e.querySelector(".brd-widget-score"),d=e.querySelector(".brd-widget-pack"),h=e.querySelector(".brd-widget-pack-label"),p=e.querySelector(".brd-pack-fill");r&&(r.textContent=o.emoji),n&&(n.textContent=o.label),a&&(a.textContent=String(Math.round(t.score)),a.className=`brd-widget-score ${i}`),d&&h&&p&&(t.pack?(d.hidden=!1,h.textContent=t.pack.label,p.style.width=`${Math.max(0,Math.min(100,t.pack.percent))}%`):(d.hidden=!0,h.textContent="",p.style.width="0%"))}function A(){const s=f==null?void 0:f.querySelector(".brd-widget");s&&(s.style.left=x.edge==="left"?"0px":"auto",s.style.right=x.edge==="right"?"0px":"auto",s.style.bottom=`${R(x.verticalOffset,s)}px`)}function xe(s,t){let e=null,o=!1,i=0,r=0,n=0;const a=()=>{e=null,o=!1,s.style.cursor="grab",s.style.transition="all 0.2s ease"},d=c=>{c.pointerType==="mouse"&&c.button!==0||c.target.closest("button, input, a")||(e=c.pointerId,o=!1,i=c.clientX,r=c.clientY,n=window.innerHeight-s.getBoundingClientRect().bottom,s.style.cursor="grabbing",s.style.transition="none",s.setPointerCapture(c.pointerId),c.preventDefault())},h=c=>{if(e!==c.pointerId)return;const T=c.clientX-i,S=r-c.clientY;if(!o&&Math.hypot(T,S)>=me&&(o=!0),!o)return;const O=R(n+S,s);s.style.left=x.edge==="left"?"0px":"auto",s.style.right=x.edge==="right"?"0px":"auto",s.style.bottom=`${O}px`},p=async c=>{if(e!==c.pointerId)return;const T=o;if(s.hasPointerCapture(c.pointerId)&&s.releasePointerCapture(c.pointerId),T){const S=s.getBoundingClientRect();x={edge:c.clientX<window.innerWidth/2?"left":"right",verticalOffset:R(window.innerHeight-S.bottom,s)},A(),await fe(t,x)}else M==null||M();a()},w=c=>{e===c.pointerId&&(s.hasPointerCapture(c.pointerId)&&s.releasePointerCapture(c.pointerId),A(),a())};return s.addEventListener("pointerdown",d),s.addEventListener("pointermove",h),s.addEventListener("pointerup",p),s.addEventListener("pointercancel",w),s.style.cursor="grab",()=>{s.removeEventListener("pointerdown",d),s.removeEventListener("pointermove",h),s.removeEventListener("pointerup",p),s.removeEventListener("pointercancel",w)}}function R(s,t){const e=Math.max(0,window.innerHeight-t.getBoundingClientRect().height-8);return Math.max(0,Math.min(s,e))}const we=`
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

  .brd-btn:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    transform: none;
    box-shadow: 2px 2px 0 rgba(58, 46, 30, 0.45);
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

  .brd-sidequest-card {
    text-align: center;
  }

  .brd-sidequest-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px 10px;
    margin-bottom: 10px;
    border: 2px dashed #3a2e1e;
    border-radius: 999px;
    background: #fff7d1;
    color: #7a5c11;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .brd-sidequest-icon {
    font-family: 'Caveat', cursive;
    font-size: 28px;
    font-weight: 700;
    color: #2d6a4f;
    margin-bottom: 4px;
  }

  .brd-sidequest-instruction {
    font-size: 17px;
    color: #3a2e1e;
    margin-bottom: 12px;
  }

  .brd-sidequest-meta {
    font-size: 13px;
    color: #7a6a50;
  }

  .brd-sidequest-countdown {
    margin: 10px auto 12px;
    width: 94px;
    height: 94px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid #2d6a4f;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #f6fff2, #d5f0e0);
    box-shadow: 4px 4px 0 #2d6a4f;
    font-family: 'Caveat', cursive;
    font-size: 44px;
    font-weight: 700;
    color: #2d6a4f;
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

  :host(.brd-dark) .brd-sidequest-badge {
    background: #43320f;
    border-color: #e8e0d0;
    color: #facc15;
  }

  :host(.brd-dark) .brd-sidequest-icon,
  :host(.brd-dark) .brd-sidequest-instruction {
    color: #d5f0e0;
  }

  :host(.brd-dark) .brd-sidequest-meta {
    color: #b8aa96;
  }

  :host(.brd-dark) .brd-sidequest-countdown {
    background: radial-gradient(circle at 30% 30%, #193126, #10221a);
    border-color: #4ade80;
    box-shadow: 4px 4px 0 #4ade80;
    color: #4ade80;
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
`;function b(s){return new Promise(t=>{chrome.runtime.sendMessage(s,e=>{chrome.runtime.lastError?t({success:!1,error:chrome.runtime.lastError.message}):t(e??{success:!1,error:"No response"})})})}function Se(s,t=1){return s.active?{...s,consumed:s.consumed+t}:s}function Ce(s,t=Date.now()){return s.active?s.mode==="items"?s.consumed>=s.limit:s.mode==="time"?(t-s.startedAt)/6e4>=s.limit:!1:!1}function Ee(s,t=Date.now()){if(!s.active)return{current:0,total:0,percent:0};if(s.mode==="items")return{current:s.consumed,total:s.limit,percent:Math.min(100,Math.round(s.consumed/s.limit*100))};const e=(t-s.startedAt)/6e4,o=Math.max(0,s.limit-e),i=Math.floor(o),r=Math.floor((o-i)*60);return{current:Math.round(e),total:s.limit,percent:Math.min(100,Math.round(e/s.limit*100)),timeRemaining:`${String(i).padStart(2,"0")}:${String(r).padStart(2,"0")}`}}const z="brd:locationchange";class Te{constructor(){l(this,"settings");l(this,"session");l(this,"enabled",!1);l(this,"lastSignalAt",0);l(this,"lastActivityAt",0);l(this,"scrollCount",0);l(this,"swipeCount",0);l(this,"maxCookedShown",!1);l(this,"builtDifferentDismissed",!1);l(this,"tickTimer",null);l(this,"cleanupFns",[]);l(this,"velocitySamples",[]);l(this,"sideQuestSeed",Math.floor(Math.random()*P.length));l(this,"maxCookedChoiceLocked",!1);l(this,"reopenForcedChoiceAfterSideQuest",!1)}async init(){var t;this.enabled&&this.destroy();try{const e=await b({type:"GET_SETTINGS"});if(!e.success)return;if(this.settings=e.data,!this.settings.masterEnabled||!((t=this.settings.sites[this.site])!=null&&t.enabled)){console.log(`[brainrot detox] Disabled for ${this.site}`);return}const o=await this.getCurrentTabId(),i=await b({type:"GET_SESSION",payload:{tabId:o}});i.data?this.session=i.data:(this.session={site:this.site,tabId:o,startedAt:Date.now(),cookedScore:0,cookedStatus:"Based",lastInterventionAt:0,packState:{...g},touchGrass:{...C},itemsConsumed:0,scrollEvents:0},await b({type:"UPDATE_SESSION",payload:{tabId:o,patch:this.session}})),this.enabled=!0,this.lastSignalAt=0,this.lastActivityAt=Date.now(),this.velocitySamples=[],await ye(this.site),this.mountCookedWidget(),this.setupObservers(),this.scheduleNextTick(),this.isTouchGrassActive()&&this.showTouchGrassOverlay(),console.log(`[brainrot detox] ${this.site} adapter initialized`)}catch(e){console.error(`[brainrot detox] Init error for ${this.site}:`,e)}}destroy(){for(this.enabled=!1,this.tickTimer!==null&&(clearTimeout(this.tickTimer),this.tickTimer=null);this.cleanupFns.length>0;){const t=this.cleanupFns.pop();try{t==null||t()}catch(e){console.warn(`[brainrot detox] Cleanup error for ${this.site}:`,e)}}this.velocitySamples=[],this.removeAllOverlays()}scheduleNextTick(){if(!this.enabled)return;this.tickTimer!==null&&clearTimeout(this.tickTimer);const t=Date.now()-this.lastActivityAt<ie?se:oe;this.tickTimer=window.setTimeout(async()=>{await this.tick(),this.scheduleNextTick()},t)}recordActivity(t=Date.now()){this.lastActivityAt=t}recordSignalUnits(t,e=Date.now()){t<=0||(this.velocitySamples.push({at:e,units:t}),this.lastSignalAt=e,this.recordActivity(e),this.pruneVelocitySamples(e))}recordSuccessfulNavigation(t=1,e=Date.now()){t<=0||(this.swipeCount+=t,this.recordSignalUnits(t,e))}getVelocityMultiplier(t=Date.now()){this.pruneVelocitySamples(t);const o=this.velocitySamples.reduce((i,r)=>i+r.units,0)/(B/1e3);return Math.min(ne,1+re*Math.pow(o,1.5))}addCleanup(t){this.cleanupFns.push(t)}registerEventListener(t,e,o,i){t.addEventListener(e,o,i),this.addCleanup(()=>t.removeEventListener(e,o,i))}registerMutationObserver(t,e,o){const i=new MutationObserver(o);return i.observe(t,e),this.addCleanup(()=>i.disconnect()),i}registerInterval(t,e){const o=window.setInterval(t,e);return this.addCleanup(()=>clearInterval(o)),o}registerRuntimeMessageListener(t){chrome.runtime.onMessage.addListener(t),this.addCleanup(()=>chrome.runtime.onMessage.removeListener(t))}registerLocationChangeListener(t){const e=window;let o=e.__brdLocationChangePatch;if(!o){const i=()=>window.dispatchEvent(new Event(z)),r=history.pushState,n=history.replaceState;history.pushState=function(...a){const d=r.apply(history,a);return i(),d},history.replaceState=function(...a){const d=n.apply(history,a);return i(),d},window.addEventListener("popstate",i),o={refCount:0,popstateListener:i,originalPushState:r,originalReplaceState:n},e.__brdLocationChangePatch=o}o.refCount++,window.addEventListener(z,t),this.addCleanup(()=>{window.removeEventListener(z,t);const i=e.__brdLocationChangePatch;i&&(i.refCount--,!(i.refCount>0)&&(history.pushState=i.originalPushState,history.replaceState=i.originalReplaceState,window.removeEventListener("popstate",i.popstateListener),delete e.__brdLocationChangePatch))})}buildPackDisplay(){if(!this.session.packState.active)return null;const t=Ee(this.session.packState);return{label:this.session.packState.mode==="time"&&t.timeRemaining?`[#] Pack: ${t.timeRemaining}`:`[#] Pack: ${t.current}/${t.total}`,percent:t.percent}}renderCookedWidget(t,e){ge({siteKey:this.site,score:t,status:e,pack:this.buildPackDisplay(),onActivate:()=>{this.openSideQuest("manual")}})}getGeneralVelocityUnits(t){return t+this.scrollCount*.25}computeGeneralBurstBonus(t,e){return t<=0?0:Math.max(0,e-1)*Math.min(12,t)*.6}resetMomentum(){this.velocitySamples=[],this.lastSignalAt=0}isSideQuestOpen(){return!!Y().querySelector('[data-overlay="sidequest"]')}hasBlockingOverlayOpen(t=[]){const e=new Set(["widget",...t]);return Array.from(Y().querySelectorAll("[data-overlay]")).some(o=>!e.has(o.dataset.overlay??""))}canOpenSideQuest(t,e=Date.now()){var o,i;return!(!((i=(o=this.settings)==null?void 0:o.sites[this.site])!=null&&i.sideQuest)||this.isTouchGrassActive()||this.isSideQuestOpen()||this.hasBlockingOverlayOpen()||t==="auto"&&this.session.packState.active||t==="auto"&&e<this.settings.sideQuest.nextPromptAfterMs)}async openSideQuest(t="manual",e){if(!this.enabled||!this.canOpenSideQuest(t))return!1;this.reopenForcedChoiceAfterSideQuest=(e==null?void 0:e.returnToForcedChoice)??!1;const o=this.pickSideQuest();return this.onSideQuestOpened(),this.renderSideQuestPrompt(o,t),!0}async tick(){if(!this.enabled)return;const t=Date.now(),e=this.session.cookedScore,o=this.session.cookedStatus,i=this.getNewItemsSinceLastTick();this.session.itemsConsumed+=i,this.session.scrollEvents+=this.scrollCount;const r=this.scrollCount>0||i>0||this.swipeCount>0,n=this.lastSignalAt===0?0:t-this.lastSignalAt;if(this.builtDifferentDismissed&&r){this.builtDifferentDismissed=!1,this.scrollCount=0,this.swipeCount=0,this.onBuiltDifferentDenied();return}let a=e;if(this.session.packState.active)a=e;else if(this.site==="shorts"){const d=i*this.getVelocityMultiplier(t);a=ce(e,d,n)}else{const d=this.getGeneralVelocityUnits(i);d>0&&this.recordSignalUnits(d,t);const h=(t-this.session.startedAt)/6e4,p=ae(h,this.settings.cooked.sessionCapMinutes,this.session.scrollEvents,this.session.itemsConsumed),w=this.getVelocityMultiplier(t),c=de(e,p,r,n);a=Math.min(100,c+this.computeGeneralBurstBonus(d,w))}await this.completeTick(e,o,a,i,t)}async completeTick(t,e,o,i,r){this.scrollCount=0,this.swipeCount=0,this.session.cookedScore=o;const n=H(o,this.settings.cooked.thresholds);if(this.session.cookedStatus=n,this.session.packState.active&&(this.session.packState=Se(this.session.packState,i),Ce(this.session.packState,r)&&this.onPackComplete()),L(o)||this.clearForcedMaxCookedChoice(),!this.session.packState.active&&!this.isSideQuestOpen()){const a=o>t;a&&await this.maybeAutoPrompt(e,n,r),this.isSideQuestOpen()||(this.maxCookedChoiceLocked&&L(o)&&!this.builtDifferentDismissed&&!this.hasBlockingOverlayOpen()&&this.showLockedMaxCookedOverlay(),L(o)?this.maxCookedShown||(this.maxCookedShown=!0,this.onMaxCooked()):(o<95&&(this.maxCookedShown=!1),a&&!this.hasBlockingOverlayOpen()&&le(o,this.session.lastInterventionAt,this.settings.cooked.thresholds,r)&&(this.session.lastInterventionAt=r,this.onIntervention())))}this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus),await b({type:"UPDATE_SESSION",payload:{tabId:this.session.tabId,patch:this.session}})}onIntervention(){b({type:"LOG_EVENT",payload:{eventType:"intervention"}}),this.showInterventionOverlay()}onMaxCooked(){this.session.lastInterventionAt=Date.now(),u("intervention"),b({type:"LOG_EVENT",payload:{eventType:"intervention"}}),this.showSkyrimOverlay("Your brain is absolutely cooked (x_x)")}onPackComplete(){this.session.packState={...g},this.maxCookedShown=!1,b({type:"END_PACK",payload:{tabId:this.session.tabId}}),this.showSkyrimOverlay("[#] Pack Complete! Time to touch grass."),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus)}onBuiltDifferentDenied(){u("intervention"),this.showBuiltDifferentDeniedOverlay()}onSideQuestOpened(){}onSideQuestClosed(){}onLockedMaxCookedOverlayOpened(){}onLockedMaxCookedOverlayClosed(){}async startPack(t,e){await b({type:"START_PACK",payload:{tabId:this.session.tabId,mode:t,limit:e}}),this.session.packState={active:!0,mode:t,limit:e,consumed:0,startedAt:Date.now()},this.session.cookedScore=0,this.session.cookedStatus="Based",this.maxCookedShown=!1,this.clearForcedMaxCookedChoice(),this.resetMomentum(),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus)}async startTouchGrass(t){await b({type:"START_TOUCH_GRASS",payload:{tabId:this.session.tabId,minutes:t}}),this.session.touchGrass={active:!0,endsAt:Date.now()+t*6e4,bypassCount:0},this.clearForcedMaxCookedChoice(),this.showTouchGrassOverlay()}async endTouchGrass(){await b({type:"END_TOUCH_GRASS",payload:{tabId:this.session.tabId}}),this.session.touchGrass={...C},this.session.cookedScore=0,this.session.cookedStatus="Based",this.maxCookedShown=!1,this.clearForcedMaxCookedChoice(),this.resetMomentum(),this.removeAllOverlays(),this.mountCookedWidget()}async bypassTouchGrass(){this.session.touchGrass.bypassCount++,b({type:"LOG_EVENT",payload:{eventType:"bypass"}}),await this.endTouchGrass()}armBuiltDifferentFollowUp(){this.builtDifferentDismissed=!0,this.maxCookedChoiceLocked=!0}isTouchGrassActive(t=Date.now()){return this.session.touchGrass.active&&this.session.touchGrass.endsAt>t}pickSideQuest(t){const e=P.filter(o=>o.id!==t);return this.sideQuestSeed=(this.sideQuestSeed+1)%Math.max(1,e.length),e[this.sideQuestSeed]??P[0]}renderSideQuestPrompt(t,e){var i,r,n;const o=E("sidequest",`
            <div class="brd-fullscreen">
                <div class="brd-card brd-sidequest-card">
                    <div class="brd-sidequest-badge">${e==="auto"?"Mini reset unlocked":"Manual Side Quest"}</div>
                    <div class="brd-sidequest-icon">${t.icon}</div>
                    <h2>${t.title}</h2>
                    <p>${t.instruction}</p>
                    <p class="brd-sidequest-meta">${t.durationSec}s timer. Finish it and shave 12 points off the cooked meter.</p>
                    <div class="brd-btn-row">
                        <button class="brd-btn brd-btn-success" data-action="accept">Accept Quest</button>
                        <button class="brd-btn brd-btn-primary" data-action="reroll">Reroll</button>
                        <button class="brd-btn brd-btn-ghost" data-action="skip">Not Now</button>
                    </div>
                </div>
            </div>
        `);(i=o.querySelector("[data-action='accept']"))==null||i.addEventListener("click",()=>{this.renderActiveSideQuest(t)}),(r=o.querySelector("[data-action='reroll']"))==null||r.addEventListener("click",()=>{this.renderSideQuestPrompt(this.pickSideQuest(t.id),e)}),(n=o.querySelector("[data-action='skip']"))==null||n.addEventListener("click",()=>{this.closeSideQuest("skip")})}renderActiveSideQuest(t){var a;const e=E("sidequest",`
            <div class="brd-fullscreen">
                <div class="brd-card brd-sidequest-card">
                    <div class="brd-sidequest-badge">Side Quest Active</div>
                    <div class="brd-sidequest-icon">${t.icon}</div>
                    <h2>${t.title}</h2>
                    <p class="brd-sidequest-instruction">${t.instruction}</p>
                    <div class="brd-sidequest-countdown" data-role="countdown">${t.durationSec}</div>
                    <p class="brd-sidequest-meta">Done unlocks when the timer hits zero.</p>
                    <div class="brd-btn-row">
                        <button class="brd-btn brd-btn-success" data-action="done" disabled>Done</button>
                        <button class="brd-btn brd-btn-ghost" data-action="bail">Bail</button>
                    </div>
                </div>
            </div>
        `),o=e.querySelector("[data-role='countdown']"),i=e.querySelector("[data-action='done']"),r=Date.now(),n=window.setInterval(()=>{const d=Math.floor((Date.now()-r)/1e3),h=Math.max(0,t.durationSec-d);o&&(o.textContent=String(h)),h===0&&(clearInterval(n),i&&(i.disabled=!1))},200);i==null||i.addEventListener("click",()=>{clearInterval(n),this.completeSideQuest()}),(a=e.querySelector("[data-action='bail']"))==null||a.addEventListener("click",()=>{clearInterval(n),this.closeSideQuest("bail")})}closeSideQuest(t){if(!this.isSideQuestOpen())return;u("sidequest");const e=t!=="complete"&&this.reopenForcedChoiceAfterSideQuest&&this.maxCookedChoiceLocked&&L(this.session.cookedScore);this.reopenForcedChoiceAfterSideQuest=!1,this.onSideQuestClosed(),e&&this.showLockedMaxCookedOverlay()}async completeSideQuest(){const t=Date.now(),e=t+this.settings.sideQuest.promptCooldownMinutes*6e4;this.session.cookedScore=Math.max(0,this.session.cookedScore-ee),this.session.cookedStatus=H(this.session.cookedScore,this.settings.cooked.thresholds),this.session.lastInterventionAt=t,this.maxCookedShown=this.session.cookedScore>=100,this.clearForcedMaxCookedChoice(),this.closeSideQuest("complete"),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus);const o=await b({type:"UPDATE_SETTINGS",payload:{sideQuest:{promptCooldownMinutes:this.settings.sideQuest.promptCooldownMinutes,nextPromptAfterMs:e}}});o!=null&&o.success?this.settings=o.data:this.settings.sideQuest.nextPromptAfterMs=e,await b({type:"UPDATE_SESSION",payload:{tabId:this.session.tabId,patch:this.session}}),await b({type:"LOG_EVENT",payload:{eventType:"side_quest_completed"}})}async maybeAutoPrompt(t,e,o){t!=="Based"||e!=="Medium Cooked"||this.canOpenSideQuest("auto",o)&&await this.openSideQuest("auto")}clearForcedMaxCookedChoice(){this.builtDifferentDismissed=!1,this.maxCookedChoiceLocked=!1,this.reopenForcedChoiceAfterSideQuest=!1}showLockedMaxCookedOverlay(){var e,o,i;u("intervention"),this.onLockedMaxCookedOverlayOpened();const t=E("denied",`
            <div class="brd-fullscreen">
                <div class="brd-card">
                    <h2 style="font-size:28px;text-align:center;color:#f87171;">You cannot keep doomscrolling man.</h2>
                    <p style="text-align:center;">Score is still maxed. Pick something that actually breaks the loop.</p>
                    <div class="brd-btn-row" style="justify-content:center;">
                        <button class="brd-btn brd-btn-primary" data-action="pack">Start Pack</button>
                        <button class="brd-btn brd-btn-success" data-action="grass">Touch Grass</button>
                        <button class="brd-btn brd-btn-ghost" data-action="sidequest">Side Quest</button>
                    </div>
                </div>
            </div>
        `);(e=t.querySelector("[data-action='pack']"))==null||e.addEventListener("click",()=>{u("denied"),this.onLockedMaxCookedOverlayClosed(),this.startPack("items",10)}),(o=t.querySelector("[data-action='grass']"))==null||o.addEventListener("click",()=>{u("denied"),this.onLockedMaxCookedOverlayClosed(),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)}),(i=t.querySelector("[data-action='sidequest']"))==null||i.addEventListener("click",()=>{u("denied"),this.onLockedMaxCookedOverlayClosed(),this.openSideQuest("manual",{returnToForcedChoice:!0})})}pruneVelocitySamples(t=Date.now()){this.velocitySamples=this.velocitySamples.filter(e=>t-e.at<=B)}async getCurrentTabId(){return new Promise(t=>{const e=Math.floor(Math.random()*1e6);b({type:"GET_CURRENT_TAB"}).then(o=>{var i;t(((i=o.data)==null?void 0:i.id)??e)})})}}class Me extends Te{constructor(){super(...arguments);l(this,"site","instagram-reels");l(this,"itemsSinceLastTick",0);l(this,"lastReelId","");l(this,"lastWheelTime",0);l(this,"wheelDebounceMs",500);l(this,"handleRuntimeMessage",(e,o,i)=>{var r,n,a;return e.type==="END_TOUCH_GRASS"?(this.session.touchGrass={active:!1,endsAt:0,bypassCount:0},u("skyrim"),u("touchgrass"),this.thawFeed(),i({success:!0}),!1):e.type==="TRIGGER_TOUCH_GRASS"?(this.startTouchGrass(((r=e.payload)==null?void 0:r.minutes)??5),i({success:!0}),!1):e.type==="TRIGGER_PACK"?(this.startPack(((n=e.payload)==null?void 0:n.mode)??"items",((a=e.payload)==null?void 0:a.limit)??10),i({success:!0}),!1):(e.type==="TRIGGER_SIDE_QUEST"&&(this.openSideQuest("manual"),i({success:!0})),!1)})}getReelsVideo(){return document.querySelector("div[role='presentation'] video")??document.querySelector("._ac8m video")??document.querySelector("video")}freezeFeed(){const e=this.getReelsVideo();e&&!e.paused&&e.pause()}thawFeed(){const e=this.getReelsVideo();e&&e.paused&&e.play().catch(()=>{})}onSideQuestOpened(){this.freezeFeed()}onSideQuestClosed(){this.thawFeed()}onLockedMaxCookedOverlayOpened(){this.freezeFeed()}onLockedMaxCookedOverlayClosed(){this.thawFeed()}setupObservers(){this.registerEventListener(window,"wheel",r=>{const n=r,a=Date.now();Math.abs(n.deltaY)>20&&a-this.lastWheelTime>=this.wheelDebounceMs&&(this.lastWheelTime=a,this.scrollCount++,this.recordActivity(a))},{passive:!0}),this.registerEventListener(window,"keydown",r=>{const n=r;(n.key==="ArrowDown"||n.key==="j")&&(this.scrollCount++,this.recordActivity())},{passive:!0});let e=0;this.registerEventListener(window,"touchstart",r=>{var n;e=((n=r.touches[0])==null?void 0:n.clientY)??0},{passive:!0}),this.registerEventListener(window,"touchend",r=>{var a;const n=e-(((a=r.changedTouches[0])==null?void 0:a.clientY)??0);Math.abs(n)>50&&(this.scrollCount++,this.recordActivity())},{passive:!0});const o=()=>{const r=window.location.pathname.match(/\/reel\/([^/?]+)/),n=(r==null?void 0:r[1])??"";if(n){if(!this.lastReelId){this.lastReelId=n;return}n!==this.lastReelId&&(this.lastReelId=n,this.itemsSinceLastTick++,this.recordSuccessfulNavigation())}};this.registerLocationChangeListener(o),this.registerInterval(o,250),o();const i=()=>{const r=document.body??document.documentElement;this.registerMutationObserver(r,{childList:!0,subtree:!0},()=>o())};document.readyState==="complete"?i():this.registerEventListener(window,"load",i,{once:!0}),this.registerRuntimeMessageListener(this.handleRuntimeMessage)}getNewItemsSinceLastTick(){const e=this.itemsSinceLastTick;return this.itemsSinceLastTick=0,e}async tick(){if(!this.enabled)return;const e=Date.now(),o=this.session.cookedScore,i=this.session.cookedStatus,r=this.getNewItemsSinceLastTick();this.session.itemsConsumed+=r,this.session.scrollEvents+=this.scrollCount;const n=this.scrollCount>0||r>0||this.swipeCount>0,a=this.lastSignalAt===0?0:e-this.lastSignalAt;if(this.builtDifferentDismissed&&n){this.builtDifferentDismissed=!1,this.scrollCount=0,this.swipeCount=0,this.onBuiltDifferentDenied();return}let d=o;if(!this.session.packState.active){const h=r*this.getVelocityMultiplier(e);d=ue(o,h,a)}await this.completeTick(o,i,d,r,e)}mountCookedWidget(){this.renderCookedWidget(this.session.cookedScore,this.session.cookedStatus)}updateCookedWidget(e,o){this.renderCookedWidget(e,o)}showInterventionOverlay(){var i,r,n;const e=W(this.session.cookedStatus),o=E("intervention",`
            <div class="brd-fullscreen">
                <div class="brd-card">
                    <h2>${e.emoji} ${e.label}!</h2>
                    <p>Your scrolling score just hit ${Math.round(this.session.cookedScore)}. Your brain is getting crispy. Time to make a choice:</p>
                    <div class="brd-btn-row">
                        <button class="brd-btn brd-btn-ghost" data-action="dismiss">Keep Going</button>
                        <button class="brd-btn brd-btn-primary" data-action="pack">Start Pack</button>
                        <button class="brd-btn brd-btn-success" data-action="sidequest">Side Quest</button>
                    </div>
                </div>
            </div>
        `);(i=o.querySelector("[data-action='dismiss']"))==null||i.addEventListener("click",()=>u("intervention")),(r=o.querySelector("[data-action='pack']"))==null||r.addEventListener("click",()=>{u("intervention"),this.startPack("items",10)}),(n=o.querySelector("[data-action='sidequest']"))==null||n.addEventListener("click",()=>{u("intervention"),this.openSideQuest("manual")})}showBuiltDifferentDeniedOverlay(){var o,i,r;this.freezeFeed();const e=E("denied",`
            <div class="brd-fullscreen">
                <div class="brd-card">
                    <h2 style="font-size:28px;text-align:center;color:#f87171;">No you are not.</h2>
                    <p style="text-align:center;">You thought you could just scroll away? Pick one.</p>
                    <div class="brd-btn-row" style="justify-content:center;">
                        <button class="brd-btn brd-btn-success" data-action="grass">Touch Grass</button>
                        <button class="brd-btn brd-btn-primary" data-action="pack">Start Pack</button>
                        <button class="brd-btn brd-btn-ghost" data-action="sidequest">Side Quest</button>
                    </div>
                </div>
            </div>
        `);(o=e.querySelector("[data-action='grass']"))==null||o.addEventListener("click",()=>{u("denied"),this.thawFeed(),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)}),(i=e.querySelector("[data-action='pack']"))==null||i.addEventListener("click",()=>{u("denied"),this.thawFeed(),this.startPack("items",10)}),(r=e.querySelector("[data-action='sidequest']"))==null||r.addEventListener("click",()=>{u("denied"),this.openSideQuest("manual",{returnToForcedChoice:!0})})}showSkyrimOverlay(e){var n,a,d;const o=chrome.runtime.getURL("assets/skyrim-skeleton.mp4");this.freezeFeed();const i=E("skyrim",`
            <div class="brd-fullscreen">
                <div class="brd-video-wrap"><video playsinline></video></div>
                <div class="brd-message">${e}</div>
                <div class="brd-btn-row">
                    <button class="brd-btn brd-btn-success" data-action="grass">Touch Grass</button>
                    <button class="brd-btn brd-btn-primary" data-action="pack">Start Pack</button>
                    <button class="brd-btn brd-btn-ghost" data-action="dismiss">I'm Built Different</button>
                </div>
            </div>
        `),r=i.querySelector("video");r&&(r.src=o,r.load(),r.play().catch(()=>{})),(n=i.querySelector("[data-action='grass']"))==null||n.addEventListener("click",()=>{u("skyrim"),this.thawFeed(),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)}),(a=i.querySelector("[data-action='pack']"))==null||a.addEventListener("click",()=>{u("skyrim"),this.thawFeed(),this.startPack("items",10)}),(d=i.querySelector("[data-action='dismiss']"))==null||d.addEventListener("click",()=>{u("skyrim"),this.thawFeed(),this.armBuiltDifferentFollowUp()})}showTouchGrassOverlay(){var J;const e=this.session.touchGrass.endsAt,o=Z.slice().sort(()=>Math.random()-.5).slice(0,3);this.freezeFeed();const r=[...["https://cataas.com/cat?width=900&height=700&t=1","https://cataas.com/cat?width=900&height=700&t=2","https://cataas.com/cat?width=900&height=700&t=3","https://cataas.com/cat?width=900&height=700&t=4","WEBCAM","https://cataas.com/cat?width=900&height=700&t=5","https://cataas.com/cat?width=900&height=700&t=6"]].sort(()=>Math.random()-.5),n=E("touchgrass",`
            <div class="brd-fullscreen brd-zen-bg">
                <div class="brd-zen-slide-wrap">
                    <img class="brd-zen-img" src="" alt="zen" />
                    <video class="brd-zen-webcam" autoplay muted playsinline style="display:none;"></video>
                    <div class="brd-zen-caption"></div>
                </div>
                <div class="brd-zen-card">
                    <div class="brd-zen-header">Touch Grass Mode</div>
                    <div class="brd-timer" id="brd-tg-timer">00:00</div>
                    <div class="brd-tips">${o.map(v=>`<div class="brd-tip">${v}</div>`).join("")}</div>
                    <div class="brd-btn-row" style="justify-content:center;">
                        <button class="brd-btn brd-btn-danger" data-action="bypass">Emergency Bypass</button>
                    </div>
                </div>
            </div>
        `),a=n.querySelector(".brd-zen-img"),d=n.querySelector(".brd-zen-webcam"),h=n.querySelector(".brd-zen-caption");let p=null,w=0;const c=["breathe.","you are here.","it's okay.","look at this.","touch grass.","be present.","slow down.","this is real life."],T=async v=>{const D=r[v%r.length];if(D==="WEBCAM"){if(a.style.display="none",d.style.display="block",h.textContent="hi. this is you.",!p)try{p=await navigator.mediaDevices.getUserMedia({video:!0,audio:!1}),d.srcObject=p}catch{await T(v+1)}return}d.style.display="none",a.style.display="block",a.src=D,h.textContent=c[Math.floor(Math.random()*c.length)]};T(w);const S=window.setInterval(()=>{w++,T(w)},4e3),O=n.querySelector("#brd-tg-timer"),Q=window.setInterval(()=>{const v=Math.max(0,e-Date.now()),D=Math.floor(v/6e4),Le=Math.floor(v%6e4/1e3);O&&(O.textContent=`${String(D).padStart(2,"0")}:${String(Le).padStart(2,"0")}`),v<=0&&(clearInterval(Q),clearInterval(S),p&&p.getTracks().forEach(Ae=>Ae.stop()),this.endTouchGrass(),this.thawFeed(),u("touchgrass"))},1e3);this.addCleanup(()=>clearInterval(S)),this.addCleanup(()=>clearInterval(Q)),(J=n.querySelector("[data-action='bypass']"))==null||J.addEventListener("click",()=>{clearInterval(Q),clearInterval(S),p&&p.getTracks().forEach(v=>v.stop()),this.bypassTouchGrass(),this.thawFeed(),u("touchgrass")})}removeAllOverlays(){ve(),this.thawFeed()}}console.log("[brainrot detox] Instagram Reels content script loaded");let I=null,K=location.href;function Ie(){return/^\/(reel|reels)\//.test(location.pathname)||location.pathname.startsWith("/explore/reels")}function X(){if(Ie()){I||(I=new Me,I.init());return}I&&(I.destroy(),I=null)}X(),new MutationObserver(()=>{location.href!==K&&(K=location.href,X())}).observe(document.body,{subtree:!0,childList:!0})})();
