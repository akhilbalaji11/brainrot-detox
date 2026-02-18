import"./chunks/modulepreload-polyfill-B5Qt9EMX.js";async function a(){const e=await chrome.runtime.sendMessage({type:"GET_STATS"});if(!(e!=null&&e.success))return;const t=e.data;document.getElementById("statPacks").textContent=String(t.totalPacksCompleted),document.getElementById("statGrass").textContent=String(t.totalTouchGrassSessions),document.getElementById("statInterventions").textContent=String(t.totalInterventions),document.getElementById("statVibes").textContent=String(t.totalVibeChecks),document.getElementById("statBypasses").textContent=String(t.totalBypassCount),document.getElementById("sharePacks").textContent=String(t.totalPacksCompleted),document.getElementById("shareGrass").textContent=String(t.totalTouchGrassSessions),document.getElementById("shareInterventions").textContent=String(t.totalInterventions)}document.getElementById("btnCopy").addEventListener("click",async()=>{const e=document.getElementById("sharePacks").textContent,t=document.getElementById("shareGrass").textContent,o=document.getElementById("shareInterventions").textContent,s=`My Brainrot Detox Week

${e} Packs completed
${t} Touch Grass sessions
${o} Interventions

no cap, I'm getting better

#BrainrotDetox`;await navigator.clipboard.writeText(s);const n=document.getElementById("btnCopy");n.textContent="✅ Copied!",setTimeout(()=>{n.textContent="📋 Copy Recap"},2e3)});document.getElementById("linkOptions").addEventListener("click",e=>{e.preventDefault(),chrome.runtime.openOptionsPage()});document.addEventListener("DOMContentLoaded",a);
