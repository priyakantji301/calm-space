const home=document.getElementById("home");
const meditation=document.getElementById("meditation");
const cards=document.querySelectorAll(".card");
const backBtn=document.querySelector(".back");
const startBtn=document.getElementById("startBtn");
const stopBtn=document.getElementById("stopBtn");
const themeToggle=document.getElementById("themeToggle");

const medTitle=document.querySelector(".med-title");
const breathInfo=document.querySelector(".breath-info");
const scienceText=document.querySelector(".science-text");
const instruction=document.querySelector(".instruction");
const countdown=document.querySelector(".countdown");
const circle=document.querySelector(".circle");
const ring=document.querySelector(".ring-progress");
const stopMessage=document.getElementById("stopMessage");
const errorMsg=document.getElementById("errorMsg");

let interval, sessionInterval;
let sessionTime=0, elapsed=0;
let currentRoutine=null;

let stats=JSON.parse(localStorage.getItem("stats"))||{sessions:0,minutes:0};
document.getElementById("totalSessions").innerText=stats.sessions;
document.getElementById("totalMinutes").innerText=stats.minutes;

/* THEME */
themeToggle.onclick=()=>{
  if(document.body.classList.contains("dark")){
    document.body.classList.remove("dark");
    document.body.classList.add("light");
    themeToggle.innerText="Toggle Dark Mode";
  }else{
    document.body.classList.remove("light");
    document.body.classList.add("dark");
    themeToggle.innerText="Toggle Light Mode";
  }
};

const routines={
  morning:{inhale:4,hold:4,exhale:4,science:"4-4-4 box breathing improves oxygen balance and focus."},
  night:{inhale:4,hold:7,exhale:8,science:"4-7-8 breathing activates parasympathetic nervous system."},
  stress:{inhale:4,hold:4,exhale:4,science:"Rhythmic breathing reduces stress hormones."},
  exam:{inhale:5,hold:0,exhale:5,science:"Equal rhythm enhances heart rate variability."},
  custom:{inhale:4,hold:4,exhale:4,science:"Custom breathing enhances body awareness."}
};

cards.forEach(card=>{
  card.onclick=()=>openMeditation(card.dataset.type);
});

function openMeditation(type){
  currentRoutine=routines[type];

  home.classList.remove("active");
  meditation.classList.add("active");

  medTitle.innerText=type.charAt(0).toUpperCase()+type.slice(1);
  breathInfo.innerText=`Inhale ${currentRoutine.inhale}s | Hold ${currentRoutine.hold}s | Exhale ${currentRoutine.exhale}s`;
  scienceText.innerText=currentRoutine.science;

  document.getElementById("builder").classList.toggle("hidden",type!=="custom");
  stopMessage.innerText="";
}

backBtn.onclick=()=>{
  stopBreathing();
  meditation.classList.remove("active");
  home.classList.add("active");
};

function setSession(min){
  sessionTime=min*60;
  elapsed=0;
}

function applyCustom(){
  let inhale=parseInt(document.getElementById("inhaleInput").value);
  let hold=parseInt(document.getElementById("holdInput").value);
  let exhale=parseInt(document.getElementById("exhaleInput").value);

  if(isNaN(inhale)||isNaN(exhale)||inhale<=0||exhale<=0||hold<0){
    errorMsg.innerText="Enter valid numbers. Inhale/Exhale > 0, Hold ≥ 0.";
    return;
  }

  errorMsg.innerText="";
  currentRoutine.inhale=inhale;
  currentRoutine.hold=hold;
  currentRoutine.exhale=exhale;

  breathInfo.innerText=`Inhale ${inhale}s | Hold ${hold}s | Exhale ${exhale}s`;
}

startBtn.onclick=startBreathing;
stopBtn.onclick=stopBreathing;

function startBreathing(){
  if(!currentRoutine||sessionTime===0)return;

  stopMessage.innerText="";
  stopBreathing();

  sessionInterval=setInterval(()=>{
    elapsed++;
    updateRing();
    if(elapsed>=sessionTime){
      completeSession();
      stopBreathing();
    }
  },1000);

  inhale(currentRoutine.inhale);
}

function stopBreathing(){
  clearInterval(interval);
  clearInterval(sessionInterval);
  ring.style.strokeDashoffset=565;
  circle.style.transform="scale(1)";
  instruction.innerText="Ready";
  countdown.innerText="";

  if(elapsed>0){
    stopMessage.innerText=`You completed ${elapsed} seconds of breathing 🌿`;
  }
}

function completeSession(){
  stats.sessions++;
  stats.minutes+=sessionTime/60;
  localStorage.setItem("stats",JSON.stringify(stats));
  document.getElementById("totalSessions").innerText=stats.sessions;
  document.getElementById("totalMinutes").innerText=stats.minutes;
}

function updateRing(){
  const percent=elapsed/sessionTime;
  ring.style.strokeDashoffset=565-(565*percent);
}

function inhale(sec){
  instruction.innerText="Inhale";
  circle.style.transform="scale(1.4)";
  runCountdown(sec,()=>hold(currentRoutine.hold));
}

function hold(sec){
  if(sec===0){exhale(currentRoutine.exhale);return;}
  instruction.innerText="Hold";
  runCountdown(sec,()=>exhale(currentRoutine.exhale));
}

function exhale(sec){
  instruction.innerText="Exhale";
  circle.style.transform="scale(1)";
  runCountdown(sec,()=>inhale(currentRoutine.inhale));
}

function runCountdown(sec,next){
  let time=sec;
  countdown.innerText=time;
  interval=setInterval(()=>{
    time--;
    countdown.innerText=time>0?time:"";
    if(time<=0){
      clearInterval(interval);
      next();
    }
  },1000);
}
