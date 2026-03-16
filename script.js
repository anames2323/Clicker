const tg = window.Telegram.WebApp; tg.expand();
const user = tg.initDataUnsafe?.user;
const username = user?.first_name || "Player";
document.getElementById("username").innerText = username;

let coins=0, perClick=1, energy=100, maxEnergy=100, autoClick=0, upgradePrice=10;

const ranks=[{name:"Beginner",coins:0},{name:"Bronze",coins:200},{name:"Silver",coins:800},{name:"Gold",coins:2000},{name:"Diamond",coins:5000},{name:"Legend",coins:15000}];

const achievements=[{id:1,coins:100,name:"Starter"},{id:2,coins:1000,name:"Click Master"},{id:3,coins:5000,name:"Rich Player"}];

const missions=[{goal:500,reward:100},{goal:2000,reward:500}];

const leaderboard=[{name:"Alex",coins:15000},{name:"Luna",coins:8000},{name:"Max",coins:5000}];

function clickCoin(){
if(energy<=0)return;
coins+=perClick; energy--;
clickEffect(); playClick(); navigator.vibrate?.(30);
updateUI(); save();
}
document.getElementById("clickBtn").onclick=clickCoin;

function buyUpgrade(){ if(coins>=upgradePrice){ coins-=upgradePrice; perClick++; upgradePrice=Math.floor(upgradePrice*1.7);} }
function buyAuto(){ if(coins>=200){ coins-=200; autoClick++; } }

setInterval(()=>{ coins+=autoClick; updateUI(); },1000);
setInterval(()=>{ if(energy<maxEnergy){ energy++; updateUI(); } },1000);

function updateRank(){
let rank=ranks[0];
for(let r of ranks){ if(coins>=r.coins){ rank=r; } }
document.getElementById("rank").innerText="Rank: "+rank.name;
}

function rankProgress(){
let current=0,next=0;
for(let i=0;i<ranks.length;i++){
if(coins>=ranks[i].coins){ current=ranks[i].coins; next=ranks[i+1]?.coins||current; }
}
let progress=(coins-current)/(next-current)*100;
document.getElementById("rankBar").style.width=progress+"%";
}

function checkAchievements(){
achievements.forEach(a=>{
if(coins>=a.coins&&!localStorage.getItem("ach"+a.id)){
showAchievement(a.name);
localStorage.setItem("ach"+a.id,true);
}});
}

function showAchievement(name){
const box=document.createElement("div");
box.className="achievement";
box.innerText="🏆 "+name;
document.body.appendChild(box);
setTimeout(()=>box.remove(),3000);
}

function clickEffect(){
const el=document.createElement("div");
el.className="clickFx";
el.innerText="+"+perClick;
document.body.appendChild(el);
setTimeout(()=>el.remove(),1000);
}

function playClick(){ new Audio("assets/click.wav").play(); }

function share(){
const text="Я играю в этот кликер!";
tg.openTelegramLink(`https://t.me/share/url?url=https://t.me/YOURBOT&text=${text}`);
}

function renderLeaderboard(){
const list=document.getElementById("top");
leaderboard.forEach(p=>{
const div=document.createElement("div");
div.className="leader";
div.innerHTML=`<span>${p.name}</span><span>${p.coins}</span>`;
list.appendChild(div);
});
}

function renderMissions(){
const list=document.getElementById("missions");
missions.forEach((m)=>{
const div=document.createElement("div");
div.className="upgrade";
div.innerHTML=`<span>Earn ${m.goal}</span><span>Reward ${m.reward}</span>`;
list.appendChild(div);
});
}

function openPage(page){
document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
document.getElementById(page).classList.add("active");
}

function updateUI(){
document.getElementById("coins").innerText=coins;
document.getElementById("profileCoins").innerText=coins;
document.getElementById("energy").innerText=energy;
document.getElementById("perClick").innerText=perClick;
document.getElementById("upgradePrice").innerText=upgradePrice;
updateRank(); rankProgress(); checkAchievements();
}

function save(){ localStorage.setItem("coins",coins); localStorage.setItem("perClick",perClick); }
function load(){ coins=Number(localStorage.getItem("coins"))||0; perClick=Number(localStorage.getItem("perClick"))||1; }

load(); renderLeaderboard(); renderMissions(); updateUI();
