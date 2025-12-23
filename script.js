// -------------------- SCREENS --------------------
const home = document.getElementById("home");
const meditation = document.getElementById("meditation");

// -------------------- TEXT ELEMENTS --------------------
const medTitle = document.querySelector(".med-title");
const medDesc = document.querySelector(".med-desc");
const instruction = document.querySelector(".instruction");
const countdown = document.querySelector(".countdown");

// -------------------- UI ELEMENTS --------------------
const circle = document.querySelector(".circle");
const backBtn = document.querySelector(".back");
const startBtn = document.querySelector(".controls button:nth-child(1)");
const stopBtn = document.querySelector(".controls button:nth-child(2)");

// -------------------- CARDS --------------------
const cards = document.querySelectorAll(".card");

// -------------------- TIMERS --------------------
let interval = null;
let timeout = null;
let sessionTimeout = null;
let sessionTime = 0;

// -------------------- BREATHING DATA (YOUR TABLE) --------------------
const routines = {
  morning: {
    title: "🌅 Morning Calm",
    desc: "Energy & focus through balanced breathing.",
    inhale: 4,
    hold: 4,
    exhale: 4,
    postHold: 0,
    color: "#ffd59e"
  },
  exam: {
    title: "📘 Before Exam",
    desc: "Improve performance and steady the mind.",
    inhale: 5,
    hold: 0,
    exhale: 5,
    postHold: 0,
    color: "#6ee7b7"
  },
  stress: {
    title: "🔥 Stress Relief",
    desc: "Immediate calm using rhythmic breathing.",
    inhale: 4,
    hold: 4,
    exhale: 4,
    postHold: 4,
    color: "#ff9a9a"
  },
  night: {
    title: "🌙 Night Relaxation",
    desc: "Prepare the body for deep sleep.",
    inhale: 4,
    hold: 7,
    exhale: 8,
    postHold: 0,
    color: "#a5b4fc"
  }
};

let currentRoutine = null;

// -------------------- CARD CLICK --------------------
cards.forEach(card => {
  card.addEventListener("click", () => {
    const type = card.dataset.type;
    openMeditation(type);
  });
});

// -------------------- BACK BUTTON --------------------
backBtn.addEventListener("click", () => {
  stopBreathing();
  meditation.classList.remove("active");
  home.classList.add("active");
  document.body.style.background =
    "linear-gradient(to bottom, #d9a7c7, #fffcdc)";
});

// -------------------- OPEN MEDITATION --------------------
function openMeditation(type) {
  currentRoutine = routines[type];

  home.classList.remove("active");
  meditation.classList.add("active");

  medTitle.innerText = currentRoutine.title;
  medDesc.innerText = currentRoutine.desc;

  document.body.style.background =
    `linear-gradient(to bottom, ${currentRoutine.color}, #ffffff)`;

  resetText();
}

// -------------------- BUTTON EVENTS --------------------
startBtn.addEventListener("click", startBreathing);
stopBtn.addEventListener("click", stopBreathing);

// -------------------- SESSION TIMER --------------------
function setSession(minutes) {
  sessionTime = minutes * 60;
  alert(`Session set for ${minutes} minutes`);
}

// -------------------- BREATHING CONTROL --------------------
function startBreathing() {
  if (!currentRoutine) return;

  stopBreathing();

  if (sessionTime > 0) {
    sessionTimeout = setTimeout(() => {
      stopBreathing();
      instruction.innerText = "Session Complete 🌿";
    }, sessionTime * 1000);
  }

  inhale(currentRoutine.inhale);
}

function stopBreathing() {
  clearInterval(interval);
  clearTimeout(timeout);
  clearTimeout(sessionTimeout);

  interval = null;
  timeout = null;
  sessionTimeout = null;

  resetText();
  circle.style.transform = "scale(1)";
}

function resetText() {
  instruction.innerText = "Take a deep breath";
  countdown.innerText = "";
}

// -------------------- BREATHING PHASES --------------------
function inhale(seconds) {
  instruction.innerText = "Inhale";
  animateCircle(1.4, seconds);
  runCountdown(seconds, () => hold(currentRoutine.hold));
}

function hold(seconds) {
  if (seconds === 0) {
    exhale(currentRoutine.exhale);
    return;
  }
  instruction.innerText = "Hold";
  animateCircle(1.4, seconds);
  runCountdown(seconds, () => exhale(currentRoutine.exhale));
}

function exhale(seconds) {
  instruction.innerText = "Exhale";
  animateCircle(1.0, seconds);

  if (currentRoutine.postHold > 0) {
    runCountdown(seconds, () => postHold(currentRoutine.postHold));
  } else {
    runCountdown(seconds, () => inhale(currentRoutine.inhale));
  }
}

function postHold(seconds) {
  instruction.innerText = "Hold";
  animateCircle(1.0, seconds);
  runCountdown(seconds, () => inhale(currentRoutine.inhale));
}

// -------------------- COUNTDOWN LOGIC --------------------
function runCountdown(seconds, next) {
  let time = seconds;
  countdown.innerText = time;

  interval = setInterval(() => {
    time--;
    countdown.innerText = time > 0 ? time : "";

    if (time <= 0) {
      clearInterval(interval);
      interval = null;
      timeout = setTimeout(next, 400);
    }
  }, 1000);
}

// -------------------- ANIMATION --------------------
function animateCircle(scale, duration) {
  circle.style.transition = `transform ${duration}s ease-in-out`;
  circle.style.transform = `scale(${scale})`;
}
