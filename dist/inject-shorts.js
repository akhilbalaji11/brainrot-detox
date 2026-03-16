var Oe=Object.defineProperty;var De=(k,y,T)=>y in k?Oe(k,y,{enumerable:!0,configurable:!0,writable:!0,value:T}):k[y]=T;var u=(k,y,T)=>De(k,typeof y!="symbol"?y+"":y,T);(function(){"use strict";const k={basedMax:35,mediumMax:65,intervention:80,cooldownMs:6e4},y={active:!1,mode:"items",limit:10,consumed:0,startedAt:0},T={active:!1,endsAt:0,bypassCount:0},se=["[>] Step outside for 2 minutes","[~] Drink a glass of water","[o] Do 5 deep breaths","[!] Do 10 jumping jacks","[*] Look at something 20 feet away for 20 seconds","[~] Put on your favorite song","[>] Text a friend something nice","[=] Open a window and feel the air"],q={based:{emoji:"( ._.)",label:"Based",hint:"Keep it chill, you're doing great."},medium:{emoji:"(-_-;)",label:"Medium Cooked",hint:"Maybe take a breather soon?"},cooked:{emoji:"(x_x) ",label:"Absolutely Cooked",hint:"Bro. Step away from the screen."}},oe=12,G=[{id:"hydrate",icon:"[~]",title:"Hydration Hero",instruction:"Take a real sip of water. Yes, right now.",durationSec:8},{id:"stretch",icon:"[>]",title:"Stretch Goblin",instruction:"Stand up and stretch your arms overhead like you mean it.",durationSec:10},{id:"far-focus",icon:"[*]",title:"Far Away Focus",instruction:"Look at something far away until your eyeballs stop buzzing.",durationSec:8},{id:"jaw-reset",icon:"[=]",title:"Jaw Reset",instruction:"Unclench your jaw and roll your shoulders twice.",durationSec:6},{id:"breaths",icon:"[o]",title:"Five Deep Breaths",instruction:"Take 5 slow breaths. In. Out. Main character reset.",durationSec:10},{id:"window-patrol",icon:"[!]",title:"Window Patrol",instruction:"Look out a window or focus on something real-world for a moment.",durationSec:8}],V=.3,ie=15e3,re=500,ae=3e3,ne=2e3,W=4e3,de=.35,ce=3,le=2e4,$={edge:"right",verticalOffset:20};function L(s){return Math.max(0,Math.min(100,s))}function ue(s,t,e,o){const i=Math.min(1,s/t),r=Math.min(1,e/150),a=Math.min(1,o/60),n=i*35+r*35+a*30;return Math.round(Math.min(100,n))}function he(s,t,e,o){if(e){const r=s*(1-V)+t*V;return L(r)}if(o<ie)return s;const i=o<45e3?1:o<9e4?2:4;return L(s-i)}function pe(s,t,e){return t>0?L(s+t):e<le?s:e<6e4?L(s-1):L(s-3)}function j(s,t=k){return s<=t.basedMax?"Based":s<=t.mediumMax?"Medium Cooked":"Absolutely Cooked"}function Y(s){return s==="Based"?q.based:s==="Medium Cooked"?q.medium:q.cooked}function be(s,t,e=k,o=Date.now()){return!(s<e.intervention||o-t<e.cooldownMs)}function O(s){return s>=100}const K="brd_widget_positions";async function me(s,t){return(await chrome.storage.local.get(s))[s]??t}async function fe(s,t){await chrome.storage.local.set({[s]:t})}async function X(){return me(K,{})}async function ge(s){return(await X())[s]??$}async function ve(s,t){const e=await X();e[s]=t,await fe(K,e)}const z="brd-overlay-host",ye=8;let f=null,x={...$},g=null,A=null;function Q(){if(f)return f;let s=document.getElementById(z);if(s||(s=document.createElement("div"),s.id=z,s.style.cssText="position:fixed;top:0;left:0;width:0;height:0;z-index:2147483647;pointer-events:none;",document.documentElement.appendChild(s)),s.shadowRoot)return f=s.shadowRoot,J(),f;f=s.attachShadow({mode:"open"});const t=document.createElement("style");t.textContent=Te,f.appendChild(t);const e=document.createElement("link");return e.rel="stylesheet",e.href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&display=swap",f.appendChild(e),J(),f}function E(s,t){const e=Q(),o=e.querySelector(`[data-overlay="${s}"]`);o&&o.remove();const i=document.createElement("div");return i.setAttribute("data-overlay",s),i.innerHTML=t,e.appendChild(i),i}function ke(s){const t=Q();A=s.onActivate??null;let e=t.querySelector('[data-overlay="widget"]');if(!e){e=document.createElement("div"),e.setAttribute("data-overlay","widget"),e.innerHTML=`
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
    `,t.appendChild(e);const o=e.querySelector(".brd-widget");o&&(g==null||g(),g=Ce(o,s.siteKey))}return Se(e,s),D(),e}function l(s){const t=f;if(!t)return;const e=t.querySelector(`[data-overlay="${s}"]`);e&&(s==="widget"&&(g==null||g(),g=null,A=null),e.remove())}function xe(){const s=f;s&&(g==null||g(),g=null,A=null,s.querySelectorAll("[data-overlay]").forEach(t=>t.remove()))}function Z(){return Q()}async function we(s){x=await ge(s),D()}async function J(){var o;const s=await chrome.runtime.sendMessage({type:"GET_SETTINGS"}),t=s!=null&&s.success&&((o=s.data)!=null&&o.theme)?s.data.theme:"light",e=document.getElementById(z);e&&(t==="dark"?e.classList.add("brd-dark"):e.classList.remove("brd-dark"))}function Se(s,t){const e=s.querySelector(".brd-widget");if(!e)return;e.dataset.score=t.score.toFixed(3),e.dataset.status=t.status;const o=Y(t.status),i=t.status==="Based"?"brd-score-based":t.status==="Medium Cooked"?"brd-score-medium":"brd-score-cooked",r=e.querySelector(".brd-widget-emoji"),a=e.querySelector(".brd-widget-label"),n=e.querySelector(".brd-widget-score"),c=e.querySelector(".brd-widget-pack"),b=e.querySelector(".brd-widget-pack-label"),m=e.querySelector(".brd-pack-fill");r&&(r.textContent=o.emoji),a&&(a.textContent=o.label),n&&(n.textContent=String(Math.round(t.score)),n.className=`brd-widget-score ${i}`),c&&b&&m&&(t.pack?(c.hidden=!1,b.textContent=t.pack.label,m.style.width=`${Math.max(0,Math.min(100,t.pack.percent))}%`):(c.hidden=!0,b.textContent="",m.style.width="0%"))}function D(){const s=f==null?void 0:f.querySelector(".brd-widget");s&&(s.style.left=x.edge==="left"?"0px":"auto",s.style.right=x.edge==="right"?"0px":"auto",s.style.bottom=`${F(x.verticalOffset,s)}px`)}function Ce(s,t){let e=null,o=!1,i=0,r=0,a=0;const n=()=>{e=null,o=!1,s.style.cursor="grab",s.style.transition="all 0.2s ease"},c=d=>{d.pointerType==="mouse"&&d.button!==0||d.target.closest("button, input, a")||(e=d.pointerId,o=!1,i=d.clientX,r=d.clientY,a=window.innerHeight-s.getBoundingClientRect().bottom,s.style.cursor="grabbing",s.style.transition="none",s.setPointerCapture(d.pointerId),d.preventDefault())},b=d=>{if(e!==d.pointerId)return;const M=d.clientX-i,S=r-d.clientY;if(!o&&Math.hypot(M,S)>=ye&&(o=!0),!o)return;const h=F(a+S,s);s.style.left=x.edge==="left"?"0px":"auto",s.style.right=x.edge==="right"?"0px":"auto",s.style.bottom=`${h}px`},m=async d=>{if(e!==d.pointerId)return;const M=o;if(s.hasPointerCapture(d.pointerId)&&s.releasePointerCapture(d.pointerId),M){const S=s.getBoundingClientRect();x={edge:d.clientX<window.innerWidth/2?"left":"right",verticalOffset:F(window.innerHeight-S.bottom,s)},D(),await ve(t,x)}else A==null||A();n()},w=d=>{e===d.pointerId&&(s.hasPointerCapture(d.pointerId)&&s.releasePointerCapture(d.pointerId),D(),n())};return s.addEventListener("pointerdown",c),s.addEventListener("pointermove",b),s.addEventListener("pointerup",m),s.addEventListener("pointercancel",w),s.style.cursor="grab",()=>{s.removeEventListener("pointerdown",c),s.removeEventListener("pointermove",b),s.removeEventListener("pointerup",m),s.removeEventListener("pointercancel",w)}}function F(s,t){const e=Math.max(0,window.innerHeight-t.getBoundingClientRect().height-8);return Math.max(0,Math.min(s,e))}const Te=`
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
`;function p(s){return new Promise(t=>{chrome.runtime.sendMessage(s,e=>{chrome.runtime.lastError?t({success:!1,error:chrome.runtime.lastError.message}):t(e??{success:!1,error:"No response"})})})}function Ee(s,t=1){return s.active?{...s,consumed:s.consumed+t}:s}function Me(s,t=Date.now()){return s.active?s.mode==="items"?s.consumed>=s.limit:s.mode==="time"?(t-s.startedAt)/6e4>=s.limit:!1:!1}function Ae(s,t=Date.now()){if(!s.active)return{current:0,total:0,percent:0};if(s.mode==="items")return{current:s.consumed,total:s.limit,percent:Math.min(100,Math.round(s.consumed/s.limit*100))};const e=(t-s.startedAt)/6e4,o=Math.max(0,s.limit-e),i=Math.floor(o),r=Math.floor((o-i)*60);return{current:Math.round(e),total:s.limit,percent:Math.min(100,Math.round(e/s.limit*100)),timeRemaining:`${String(i).padStart(2,"0")}:${String(r).padStart(2,"0")}`}}const R="brd:locationchange";class Ie{constructor(){u(this,"settings");u(this,"session");u(this,"enabled",!1);u(this,"lastSignalAt",0);u(this,"lastActivityAt",0);u(this,"scrollCount",0);u(this,"swipeCount",0);u(this,"maxCookedShown",!1);u(this,"builtDifferentDismissed",!1);u(this,"tickTimer",null);u(this,"cleanupFns",[]);u(this,"velocitySamples",[]);u(this,"sideQuestSeed",Math.floor(Math.random()*G.length));u(this,"maxCookedChoiceLocked",!1);u(this,"reopenForcedChoiceAfterSideQuest",!1)}async init(){var t;this.enabled&&this.destroy();try{const e=await p({type:"GET_SETTINGS"});if(!e.success)return;if(this.settings=e.data,!this.settings.masterEnabled||!((t=this.settings.sites[this.site])!=null&&t.enabled)){console.log(`[brainrot detox] Disabled for ${this.site}`);return}const o=await this.getCurrentTabId(),i=await p({type:"GET_SESSION",payload:{tabId:o}});i.data?this.session=i.data:(this.session={site:this.site,tabId:o,startedAt:Date.now(),cookedScore:0,cookedStatus:"Based",lastInterventionAt:0,packState:{...y},touchGrass:{...T},itemsConsumed:0,scrollEvents:0},await p({type:"UPDATE_SESSION",payload:{tabId:o,patch:this.session}})),this.enabled=!0,this.lastSignalAt=0,this.lastActivityAt=Date.now(),this.velocitySamples=[],await we(this.site),this.mountCookedWidget(),this.setupObservers(),this.scheduleNextTick(),this.isTouchGrassActive()&&this.showTouchGrassOverlay(),console.log(`[brainrot detox] ${this.site} adapter initialized`)}catch(e){console.error(`[brainrot detox] Init error for ${this.site}:`,e)}}destroy(){for(this.enabled=!1,this.tickTimer!==null&&(clearTimeout(this.tickTimer),this.tickTimer=null);this.cleanupFns.length>0;){const t=this.cleanupFns.pop();try{t==null||t()}catch(e){console.warn(`[brainrot detox] Cleanup error for ${this.site}:`,e)}}this.velocitySamples=[],this.removeAllOverlays()}scheduleNextTick(){if(!this.enabled)return;this.tickTimer!==null&&clearTimeout(this.tickTimer);const t=Date.now()-this.lastActivityAt<ne?re:ae;this.tickTimer=window.setTimeout(async()=>{await this.tick(),this.scheduleNextTick()},t)}recordActivity(t=Date.now()){this.lastActivityAt=t}recordSignalUnits(t,e=Date.now()){t<=0||(this.velocitySamples.push({at:e,units:t}),this.lastSignalAt=e,this.recordActivity(e),this.pruneVelocitySamples(e))}recordSuccessfulNavigation(t=1,e=Date.now()){t<=0||(this.swipeCount+=t,this.recordSignalUnits(t,e))}getVelocityMultiplier(t=Date.now()){this.pruneVelocitySamples(t);const o=this.velocitySamples.reduce((i,r)=>i+r.units,0)/(W/1e3);return Math.min(ce,1+de*Math.pow(o,1.5))}addCleanup(t){this.cleanupFns.push(t)}registerEventListener(t,e,o,i){t.addEventListener(e,o,i),this.addCleanup(()=>t.removeEventListener(e,o,i))}registerMutationObserver(t,e,o){const i=new MutationObserver(o);return i.observe(t,e),this.addCleanup(()=>i.disconnect()),i}registerInterval(t,e){const o=window.setInterval(t,e);return this.addCleanup(()=>clearInterval(o)),o}registerRuntimeMessageListener(t){chrome.runtime.onMessage.addListener(t),this.addCleanup(()=>chrome.runtime.onMessage.removeListener(t))}registerLocationChangeListener(t){const e=window;let o=e.__brdLocationChangePatch;if(!o){const i=()=>window.dispatchEvent(new Event(R)),r=history.pushState,a=history.replaceState;history.pushState=function(...n){const c=r.apply(history,n);return i(),c},history.replaceState=function(...n){const c=a.apply(history,n);return i(),c},window.addEventListener("popstate",i),o={refCount:0,popstateListener:i,originalPushState:r,originalReplaceState:a},e.__brdLocationChangePatch=o}o.refCount++,window.addEventListener(R,t),this.addCleanup(()=>{window.removeEventListener(R,t);const i=e.__brdLocationChangePatch;i&&(i.refCount--,!(i.refCount>0)&&(history.pushState=i.originalPushState,history.replaceState=i.originalReplaceState,window.removeEventListener("popstate",i.popstateListener),delete e.__brdLocationChangePatch))})}buildPackDisplay(){if(!this.session.packState.active)return null;const t=Ae(this.session.packState);return{label:this.session.packState.mode==="time"&&t.timeRemaining?`[#] Pack: ${t.timeRemaining}`:`[#] Pack: ${t.current}/${t.total}`,percent:t.percent}}renderCookedWidget(t,e){ke({siteKey:this.site,score:t,status:e,pack:this.buildPackDisplay(),onActivate:()=>{this.openSideQuest("manual")}})}getGeneralVelocityUnits(t){return t+this.scrollCount*.25}computeGeneralBurstBonus(t,e){return t<=0?0:Math.max(0,e-1)*Math.min(12,t)*.6}resetMomentum(){this.velocitySamples=[],this.lastSignalAt=0}isSideQuestOpen(){return!!Z().querySelector('[data-overlay="sidequest"]')}hasBlockingOverlayOpen(t=[]){const e=new Set(["widget",...t]);return Array.from(Z().querySelectorAll("[data-overlay]")).some(o=>!e.has(o.dataset.overlay??""))}canOpenSideQuest(t,e=Date.now()){var o,i;return!(!((i=(o=this.settings)==null?void 0:o.sites[this.site])!=null&&i.sideQuest)||this.isTouchGrassActive()||this.isSideQuestOpen()||this.hasBlockingOverlayOpen()||t==="auto"&&this.session.packState.active||t==="auto"&&e<this.settings.sideQuest.nextPromptAfterMs)}async openSideQuest(t="manual",e){if(!this.enabled||!this.canOpenSideQuest(t))return!1;this.reopenForcedChoiceAfterSideQuest=(e==null?void 0:e.returnToForcedChoice)??!1;const o=this.pickSideQuest();return this.onSideQuestOpened(),this.renderSideQuestPrompt(o,t),!0}async tick(){if(!this.enabled)return;const t=Date.now(),e=this.session.cookedScore,o=this.session.cookedStatus,i=this.getNewItemsSinceLastTick();this.session.itemsConsumed+=i,this.session.scrollEvents+=this.scrollCount;const r=this.scrollCount>0||i>0||this.swipeCount>0,a=this.lastSignalAt===0?0:t-this.lastSignalAt;if(this.builtDifferentDismissed&&r){this.builtDifferentDismissed=!1,this.scrollCount=0,this.swipeCount=0,this.onBuiltDifferentDenied();return}let n=e;if(this.session.packState.active)n=e;else if(this.site==="shorts"){const c=i*this.getVelocityMultiplier(t);n=pe(e,c,a)}else{const c=this.getGeneralVelocityUnits(i);c>0&&this.recordSignalUnits(c,t);const b=(t-this.session.startedAt)/6e4,m=ue(b,this.settings.cooked.sessionCapMinutes,this.session.scrollEvents,this.session.itemsConsumed),w=this.getVelocityMultiplier(t),d=he(e,m,r,a);n=Math.min(100,d+this.computeGeneralBurstBonus(c,w))}await this.completeTick(e,o,n,i,t)}async completeTick(t,e,o,i,r){this.scrollCount=0,this.swipeCount=0,this.session.cookedScore=o;const a=j(o,this.settings.cooked.thresholds);if(this.session.cookedStatus=a,this.session.packState.active&&(this.session.packState=Ee(this.session.packState,i),Me(this.session.packState,r)&&this.onPackComplete()),O(o)||this.clearForcedMaxCookedChoice(),!this.session.packState.active&&!this.isSideQuestOpen()){const n=o>t;n&&await this.maybeAutoPrompt(e,a,r),this.isSideQuestOpen()||(this.maxCookedChoiceLocked&&O(o)&&!this.builtDifferentDismissed&&!this.hasBlockingOverlayOpen()&&this.showLockedMaxCookedOverlay(),O(o)?this.maxCookedShown||(this.maxCookedShown=!0,this.onMaxCooked()):(o<95&&(this.maxCookedShown=!1),n&&!this.hasBlockingOverlayOpen()&&be(o,this.session.lastInterventionAt,this.settings.cooked.thresholds,r)&&(this.session.lastInterventionAt=r,this.onIntervention())))}this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus),await p({type:"UPDATE_SESSION",payload:{tabId:this.session.tabId,patch:this.session}})}onIntervention(){p({type:"LOG_EVENT",payload:{eventType:"intervention"}}),this.showInterventionOverlay()}onMaxCooked(){this.session.lastInterventionAt=Date.now(),l("intervention"),p({type:"LOG_EVENT",payload:{eventType:"intervention"}}),this.showSkyrimOverlay("Your brain is absolutely cooked (x_x)")}onPackComplete(){this.session.packState={...y},this.maxCookedShown=!1,p({type:"END_PACK",payload:{tabId:this.session.tabId}}),this.showSkyrimOverlay("[#] Pack Complete! Time to touch grass."),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus)}onBuiltDifferentDenied(){l("intervention"),this.showBuiltDifferentDeniedOverlay()}onSideQuestOpened(){}onSideQuestClosed(){}onLockedMaxCookedOverlayOpened(){}onLockedMaxCookedOverlayClosed(){}async startPack(t,e){await p({type:"START_PACK",payload:{tabId:this.session.tabId,mode:t,limit:e}}),this.session.packState={active:!0,mode:t,limit:e,consumed:0,startedAt:Date.now()},this.session.cookedScore=0,this.session.cookedStatus="Based",this.maxCookedShown=!1,this.clearForcedMaxCookedChoice(),this.resetMomentum(),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus)}async startTouchGrass(t){await p({type:"START_TOUCH_GRASS",payload:{tabId:this.session.tabId,minutes:t}}),this.session.touchGrass={active:!0,endsAt:Date.now()+t*6e4,bypassCount:0},this.clearForcedMaxCookedChoice(),this.showTouchGrassOverlay()}async endTouchGrass(){await p({type:"END_TOUCH_GRASS",payload:{tabId:this.session.tabId}}),this.session.touchGrass={...T},this.session.cookedScore=0,this.session.cookedStatus="Based",this.maxCookedShown=!1,this.clearForcedMaxCookedChoice(),this.resetMomentum(),this.removeAllOverlays(),this.mountCookedWidget()}async bypassTouchGrass(){this.session.touchGrass.bypassCount++,p({type:"LOG_EVENT",payload:{eventType:"bypass"}}),await this.endTouchGrass()}armBuiltDifferentFollowUp(){this.builtDifferentDismissed=!0,this.maxCookedChoiceLocked=!0}isTouchGrassActive(t=Date.now()){return this.session.touchGrass.active&&this.session.touchGrass.endsAt>t}pickSideQuest(t){const e=G.filter(o=>o.id!==t);return this.sideQuestSeed=(this.sideQuestSeed+1)%Math.max(1,e.length),e[this.sideQuestSeed]??G[0]}renderSideQuestPrompt(t,e){var i,r,a;const o=E("sidequest",`
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
        `);(i=o.querySelector("[data-action='accept']"))==null||i.addEventListener("click",()=>{this.renderActiveSideQuest(t)}),(r=o.querySelector("[data-action='reroll']"))==null||r.addEventListener("click",()=>{this.renderSideQuestPrompt(this.pickSideQuest(t.id),e)}),(a=o.querySelector("[data-action='skip']"))==null||a.addEventListener("click",()=>{this.closeSideQuest("skip")})}renderActiveSideQuest(t){var n;const e=E("sidequest",`
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
        `),o=e.querySelector("[data-role='countdown']"),i=e.querySelector("[data-action='done']"),r=Date.now(),a=window.setInterval(()=>{const c=Math.floor((Date.now()-r)/1e3),b=Math.max(0,t.durationSec-c);o&&(o.textContent=String(b)),b===0&&(clearInterval(a),i&&(i.disabled=!1))},200);i==null||i.addEventListener("click",()=>{clearInterval(a),this.completeSideQuest()}),(n=e.querySelector("[data-action='bail']"))==null||n.addEventListener("click",()=>{clearInterval(a),this.closeSideQuest("bail")})}closeSideQuest(t){if(!this.isSideQuestOpen())return;l("sidequest");const e=t!=="complete"&&this.reopenForcedChoiceAfterSideQuest&&this.maxCookedChoiceLocked&&O(this.session.cookedScore);this.reopenForcedChoiceAfterSideQuest=!1,this.onSideQuestClosed(),e&&this.showLockedMaxCookedOverlay()}async completeSideQuest(){const t=Date.now(),e=t+this.settings.sideQuest.promptCooldownMinutes*6e4;this.session.cookedScore=Math.max(0,this.session.cookedScore-oe),this.session.cookedStatus=j(this.session.cookedScore,this.settings.cooked.thresholds),this.session.lastInterventionAt=t,this.maxCookedShown=this.session.cookedScore>=100,this.clearForcedMaxCookedChoice(),this.closeSideQuest("complete"),this.updateCookedWidget(this.session.cookedScore,this.session.cookedStatus);const o=await p({type:"UPDATE_SETTINGS",payload:{sideQuest:{promptCooldownMinutes:this.settings.sideQuest.promptCooldownMinutes,nextPromptAfterMs:e}}});o!=null&&o.success?this.settings=o.data:this.settings.sideQuest.nextPromptAfterMs=e,await p({type:"UPDATE_SESSION",payload:{tabId:this.session.tabId,patch:this.session}}),await p({type:"LOG_EVENT",payload:{eventType:"side_quest_completed"}})}async maybeAutoPrompt(t,e,o){t!=="Based"||e!=="Medium Cooked"||this.canOpenSideQuest("auto",o)&&await this.openSideQuest("auto")}clearForcedMaxCookedChoice(){this.builtDifferentDismissed=!1,this.maxCookedChoiceLocked=!1,this.reopenForcedChoiceAfterSideQuest=!1}showLockedMaxCookedOverlay(){var e,o,i;l("intervention"),this.onLockedMaxCookedOverlayOpened();const t=E("denied",`
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
        `);(e=t.querySelector("[data-action='pack']"))==null||e.addEventListener("click",()=>{l("denied"),this.onLockedMaxCookedOverlayClosed(),this.startPack("items",10)}),(o=t.querySelector("[data-action='grass']"))==null||o.addEventListener("click",()=>{l("denied"),this.onLockedMaxCookedOverlayClosed(),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)}),(i=t.querySelector("[data-action='sidequest']"))==null||i.addEventListener("click",()=>{l("denied"),this.onLockedMaxCookedOverlayClosed(),this.openSideQuest("manual",{returnToForcedChoice:!0})})}pruneVelocitySamples(t=Date.now()){this.velocitySamples=this.velocitySamples.filter(e=>t-e.at<=W)}async getCurrentTabId(){return new Promise(t=>{const e=Math.floor(Math.random()*1e6);p({type:"GET_CURRENT_TAB"}).then(o=>{var i;t(((i=o.data)==null?void 0:i.id)??e)})})}}class Le extends Ie{constructor(){super(...arguments);u(this,"site","shorts");u(this,"itemsSinceLastTick",0);u(this,"lastVideoId","");u(this,"handleRuntimeMessage",(e,o,i)=>{var r,a,n;return e.type==="END_TOUCH_GRASS"?(this.session.touchGrass={active:!1,endsAt:0,bypassCount:0},l("skyrim"),l("touchgrass"),this.thawFeed(),i({success:!0}),!1):e.type==="TRIGGER_TOUCH_GRASS"?(this.startTouchGrass(((r=e.payload)==null?void 0:r.minutes)??5),i({success:!0}),!1):e.type==="TRIGGER_PACK"?(this.startPack(((a=e.payload)==null?void 0:a.mode)??"items",((n=e.payload)==null?void 0:n.limit)??10),i({success:!0}),!1):(e.type==="TRIGGER_SIDE_QUEST"&&(this.openSideQuest("manual"),i({success:!0})),!1)})}getShortsVideo(){return document.querySelector("ytd-shorts video")??document.querySelector(".html5-main-video")??document.querySelector("video.video-stream")??null}freezeFeed(){const e=this.getShortsVideo();e&&!e.paused&&e.pause()}thawFeed(){const e=this.getShortsVideo();e&&e.paused&&e.play().catch(()=>{})}onSideQuestOpened(){this.freezeFeed()}onSideQuestClosed(){this.thawFeed()}onLockedMaxCookedOverlayOpened(){this.freezeFeed()}onLockedMaxCookedOverlayClosed(){this.thawFeed()}setupObservers(){this.registerEventListener(window,"scroll",()=>{this.scrollCount++,this.recordActivity()},{passive:!0}),this.registerEventListener(window,"wheel",r=>{Math.abs(r.deltaY)>20&&(this.scrollCount++,this.recordActivity())},{passive:!0}),this.registerEventListener(window,"keydown",r=>{const a=r;(a.key==="ArrowDown"||a.key==="j")&&(this.scrollCount++,this.recordActivity())},{passive:!0});let e=0;this.registerEventListener(window,"touchstart",r=>{var a;e=((a=r.touches[0])==null?void 0:a.clientY)??0},{passive:!0}),this.registerEventListener(window,"touchend",r=>{var n;const a=e-(((n=r.changedTouches[0])==null?void 0:n.clientY)??0);Math.abs(a)>50&&(this.scrollCount++,this.recordActivity())},{passive:!0});const o=()=>{const r=window.location.pathname.match(/\/shorts\/([^/?]+)/),a=(r==null?void 0:r[1])??"";if(a){if(!this.lastVideoId){this.lastVideoId=a;return}a!==this.lastVideoId&&(this.lastVideoId=a,this.itemsSinceLastTick++,this.recordSuccessfulNavigation())}};this.registerLocationChangeListener(o),this.registerInterval(o,250),o();const i=()=>{const r=document.body??document.documentElement;this.registerMutationObserver(r,{childList:!0,subtree:!0},()=>o())};document.readyState==="complete"?i():this.registerEventListener(window,"load",i,{once:!0}),this.registerRuntimeMessageListener(this.handleRuntimeMessage)}getNewItemsSinceLastTick(){const e=this.itemsSinceLastTick;return this.itemsSinceLastTick=0,e}mountCookedWidget(){this.renderCookedWidget(this.session.cookedScore,this.session.cookedStatus)}updateCookedWidget(e,o){this.renderCookedWidget(e,o)}showInterventionOverlay(){var i,r,a;const e=Y(this.session.cookedStatus),o=E("intervention",`
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
    `);(i=o.querySelector("[data-action='dismiss']"))==null||i.addEventListener("click",()=>l("intervention")),(r=o.querySelector("[data-action='pack']"))==null||r.addEventListener("click",()=>{l("intervention"),this.startPack("items",10)}),(a=o.querySelector("[data-action='sidequest']"))==null||a.addEventListener("click",()=>{l("intervention"),this.openSideQuest("manual")})}showBuiltDifferentDeniedOverlay(){var o,i,r;this.freezeFeed();const e=E("denied",`
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
    `);(o=e.querySelector("[data-action='grass']"))==null||o.addEventListener("click",()=>{l("denied"),this.thawFeed(),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)}),(i=e.querySelector("[data-action='pack']"))==null||i.addEventListener("click",()=>{l("denied"),this.thawFeed(),this.startPack("items",10)}),(r=e.querySelector("[data-action='sidequest']"))==null||r.addEventListener("click",()=>{l("denied"),this.openSideQuest("manual",{returnToForcedChoice:!0})})}showSkyrimOverlay(e){var a,n,c;const o=chrome.runtime.getURL("assets/skyrim-skeleton.mp4");this.freezeFeed();const i=E("skyrim",`
      <div class="brd-fullscreen">
        <div class="brd-video-wrap"><video playsinline></video></div>
        <div class="brd-message">${e}</div>
        <div class="brd-btn-row">
          <button class="brd-btn brd-btn-success" data-action="grass">Touch Grass</button>
          <button class="brd-btn brd-btn-primary" data-action="pack">Start Pack</button>
          <button class="brd-btn brd-btn-ghost" data-action="dismiss">I'm Built Different</button>
        </div>
      </div>
    `),r=i.querySelector("video");r&&(r.src=o,r.load(),r.play().catch(()=>{})),(a=i.querySelector("[data-action='grass']"))==null||a.addEventListener("click",()=>{l("skyrim"),this.thawFeed(),this.startTouchGrass(this.settings.touchGrass.defaultMinutes)}),(n=i.querySelector("[data-action='pack']"))==null||n.addEventListener("click",()=>{l("skyrim"),this.thawFeed(),this.startPack("items",10)}),(c=i.querySelector("[data-action='dismiss']"))==null||c.addEventListener("click",()=>{l("skyrim"),this.thawFeed(),this.armBuiltDifferentFollowUp()})}showTouchGrassOverlay(){var te;const e=this.session.touchGrass.endsAt,o=se.slice().sort(()=>Math.random()-.5).slice(0,3);this.freezeFeed();const r=[...["https://cataas.com/cat?width=900&height=700&t=1","https://cataas.com/cat?width=900&height=700&t=2","https://cataas.com/cat?width=900&height=700&t=3","https://cataas.com/cat?width=900&height=700&t=4","https://cataas.com/cat?width=900&height=700&t=5","https://cataas.com/cat?width=900&height=700&t=6","https://cataas.com/cat?width=900&height=700&t=7","https://cataas.com/cat?width=900&height=700&t=8","https://cataas.com/cat?width=900&height=700&t=9","https://cataas.com/cat?width=900&height=700&t=10","WEBCAM","https://cataas.com/cat?width=900&height=700&t=11","https://cataas.com/cat?width=900&height=700&t=12","https://cataas.com/cat?width=900&height=700&t=13","https://cataas.com/cat?width=900&height=700&t=14","https://cataas.com/cat?width=900&height=700&t=15","WEBCAM"]].sort(()=>Math.random()-.5),a=E("touchgrass",`
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
    `),n=a.querySelector(".brd-zen-img"),c=a.querySelector(".brd-zen-webcam"),b=a.querySelector(".brd-zen-caption");let m=null,w=0;const d=["breathe.","you are here.","it's okay.","look at this.","touch grass.","be present.","slow down.","this is real life.","you look great btw.","hi.","go outside.","drink water."],M=async v=>{const I=r[v%r.length];if(I==="WEBCAM"){if(n.style.display="none",c.style.display="block",b.textContent="hi. this is you. say hi.",!m)try{m=await navigator.mediaDevices.getUserMedia({video:!0,audio:!1}),c.srcObject=m}catch{await M(v+1)}return}c.style.display="none",n.style.display="block",n.src=I,b.textContent=d[Math.floor(Math.random()*d.length)]};M(w);const S=window.setInterval(()=>{w++,M(w)},4e3);let h=null,C=null;try{h=new AudioContext,C=h.createGain(),C.gain.setValueAtTime(0,h.currentTime),C.gain.linearRampToValueAtTime(.06,h.currentTime+2),C.connect(h.destination);const v=[110,165,220];v.forEach((I,N)=>{const _=h.createOscillator(),P=h.createGain();_.type="sine",_.frequency.setValueAtTime(I,h.currentTime),P.gain.setValueAtTime(1/v.length,h.currentTime),_.connect(P),P.connect(C),_.start();const U=h.createOscillator(),H=h.createGain();U.frequency.setValueAtTime(.15+N*.05,h.currentTime),H.gain.setValueAtTime(.015,h.currentTime),U.connect(H),H.connect(P.gain),U.start()})}catch{h=null,C=null}const ee=a.querySelector("#brd-tg-timer"),B=window.setInterval(()=>{const v=Math.max(0,e-Date.now()),I=Math.floor(v/6e4),N=Math.floor(v%6e4/1e3);ee&&(ee.textContent=`${String(I).padStart(2,"0")}:${String(N).padStart(2,"0")}`),v<=0&&(clearInterval(B),clearInterval(S),this.stopZenAudio(h,C),this.stopWebcam(m),this.endTouchGrass(),this.thawFeed(),l("touchgrass"))},1e3);this.addCleanup(()=>clearInterval(S)),this.addCleanup(()=>clearInterval(B)),(te=a.querySelector("[data-action='bypass']"))==null||te.addEventListener("click",()=>{clearInterval(B),clearInterval(S),this.stopZenAudio(h,C),this.stopWebcam(m),this.bypassTouchGrass(),this.thawFeed(),l("touchgrass")})}removeAllOverlays(){xe(),this.thawFeed()}stopZenAudio(e,o){if(!(!e||!o))try{o.gain.linearRampToValueAtTime(0,e.currentTime+.5),window.setTimeout(()=>{e.close()},600)}catch{}}stopWebcam(e){e&&e.getTracks().forEach(o=>o.stop())}}console.log("[brainrot detox] Shorts content script loaded"),new Le().init()})();
