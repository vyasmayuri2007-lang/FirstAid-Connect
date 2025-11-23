document.addEventListener("DOMContentLoaded", () => {

  const EMERGENCIES = [
  {
    id: "cuts-bleeding",
    name: "Cuts & Bleeding",
    description: "Trauma to the skin causing blood loss.",
    severity: "Medium",
    steps: [
      "Wash your hands or use gloves if available.",
      "Apply firm, direct pressure with a clean cloth or gauze.",
      "Raise the injured area above the level of the heart if possible.",
      "Once bleeding slows, gently rinse the wound with clean water.",
      "Cover with a sterile bandage or clean dressing."
    ],
    dos: [
      "Keep the person calm and still.",
      "Use a tourniquet only if bleeding is life-threatening and you are trained.",
    ],
    donts: [
      "Do not remove large objects stuck in the wound.",
      "Do not apply direct heat to the wound.",
    ],
  },
  {
    id: "burns",
    name: "Burns (Minor)",
    description: "Damage to skin caused by heat, chemicals, or electricity.",
    severity: "Medium",
    steps: [
      "Cool the burn under cool running water for 10–20 minutes.",
      "Remove rings, watches, or tight items near the burn before swelling starts.",
      "Cover loosely with a sterile, non-stick bandage or clean cloth."
    ],
    dos: [
      "Use cool (not icy) water.",
      "Take an over-the-counter pain reliever if needed and appropriate.",
    ],
    donts: [
      "Do not apply ice, butter, oil, or toothpaste.",
      "Do not break blisters.",
    ],
  },
  {
    id: "choking",
    name: "Choking",
    description: "Blockage of the airway that makes breathing difficult or impossible.",
    severity: "Critical",
    steps: [
      "Ask, “Are you choking?” If they can speak or cough, encourage them to keep coughing.",
      "If they cannot speak, cough, or breathe, stand behind them.",
      "Wrap your arms around their waist and make a fist above their navel.",
      "Grasp your fist with the other hand and pull sharply inward and upward.",
      "Repeat thrusts until the object is expelled or the person becomes unresponsive."
    ],
    dos: [
      "Call emergency services if the obstruction does not clear quickly.",
      "Start CPR if the person becomes unresponsive.",
    ],
    donts: [
      "Do not give them food or drink.",
      "Do not hit a choking person on the back while they are standing if you are not trained.",
    ],
  },
  {
    id: "sprain",
    name: "Sprains & Strains",
    description: "Injury to ligaments or muscles, often from twisting or overuse.",
    severity: "Low",
    steps: [
      "Rest the injured limb and avoid putting weight on it.",
      "Apply ice wrapped in a cloth for 15–20 minutes every 2–3 hours.",
      "Wrap with an elastic bandage to compress (not too tight).",
      "Elevate the limb above heart level to help reduce swelling."
    ],
    dos: [
      "Follow the R.I.C.E. method: Rest, Ice, Compression, Elevation.",
      "Seek medical help if you cannot move the joint or put weight on it.",
    ],
    donts: [
      "Do not apply heat during the first 48 hours.",
      "Do not massage the injured area vigorously.",
    ],
  },
  {
    id: "nosebleed",
    name: "Nosebleed",
    description: "Bleeding from the blood vessels inside the nose.",
    severity: "Low",
    steps: [
      "Sit up straight and lean slightly forward.",
      "Pinch the soft part of the nose just below the bridge.",
      "Maintain pressure for 10 minutes without checking.",
      "Spit out any blood in the mouth instead of swallowing it."
    ],
    dos: [
      "Apply a cool compress to the bridge of the nose.",
      "Stay calm and breathe through your mouth.",
    ],
    donts: [
      "Do not tilt your head back.",
      "Do not lie flat.",
      "Do not blow or pick the nose immediately after the bleeding stops.",
    ],
  },
  {
    id: "fracture",
    name: "Fracture",
    description: "A suspected or confirmed broken bone.",
    severity: "High",
    steps: [
      "Keep the injured area still and supported.",
      "Control any bleeding with gentle pressure around (not directly on) open fractures.",
      "Apply cold packs wrapped in cloth to reduce swelling.",
      "Seek urgent medical attention."
    ],
    dos: [
      "Call emergency services if the bone is visibly deformed or the person cannot move.",
      "Support the limb in the position found until help arrives.",
    ],
    donts: [
      "Do not push a bone back into place.",
      "Do not allow the person to walk on a suspected broken leg.",
      "Do not move the person unless necessary for safety.",
    ],
  },
];

// ------- global state -------
let currentView = "home";
let selectedEmergency = null;
let selectedOption = null;
let quizData = null;

// ------- view switching -------
const views = {
  home: document.getElementById("view-home"),
  guide: document.getElementById("view-guide"),
  detail: document.getElementById("view-detail"),
  ai: document.getElementById("view-ai"),
  quiz: document.getElementById("view-quiz"),
};
function showView(view) {
  currentView = view;
  Object.entries(views).forEach(([key, el]) => {
    if (el) el.classList.toggle("active", key === view);
  });
  updateActiveNav(view);
}


const navLinks = document.querySelectorAll(".nav-link");

function updateActiveNav(view) {
  navLinks.forEach(link => {
    const linkView = link.getAttribute("data-view");

    // Remove all active states first
    link.classList.remove("active", "text-red-600");
    link.classList.add("text-slate-600");

    // Apply only to the selected one
    if (linkView === view) {
      link.classList.add("active", "text-red-600");
      link.classList.remove("text-slate-600");
    }
  });
}


navLinks.forEach(btn => {
  btn.addEventListener("click", () => {
    const view = btn.getAttribute("data-view");
    if (view) {
      showView(view);
      updateActiveNav(view);
    }
  });
});


const brandHome = document.getElementById("brand-home");
if (brandHome) {
  brandHome.addEventListener("click", () => showView("home"));
}

// Footer year
document.getElementById("year").textContent = String(new Date().getFullYear());

// ------- Home: quick access -------
const quickAccess = document.getElementById("quick-access");
if (quickAccess) {
  EMERGENCIES.slice(0, 4).forEach((e) => {
    const card = document.createElement("div");
    card.className =
      "bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md cursor-pointer transition-shadow";
    card.innerHTML = `
      <div class="flex justify-between items-start mb-2">
        <div class="font-semibold text-sm text-slate-900">${e.name}</div>
        <span class="text-[10px] px-2 py-1 rounded-full ${
          e.severity === "Critical"
            ? "bg-red-100 text-red-700"
            : e.severity === "High"
            ? "bg-orange-100 text-orange-700"
            : e.severity === "Medium"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-green-100 text-green-700"
        }">${e.severity}</span>
      </div>
      <p class="text-xs text-slate-500">${e.description}</p>
    `;
    card.addEventListener("click", () => {
      openDetail(e.id);
    });
    quickAccess.appendChild(card);
  });
}

// ------- Guide list -------
const guideList = document.getElementById("guide-list");
const searchInput = document.getElementById("search-input");
const noResults = document.getElementById("no-results");

function renderGuideList() {
  const term = (searchInput.value || "").toLowerCase();
  guideList.innerHTML = "";
  const filtered = EMERGENCIES.filter(
    (e) =>
      e.name.toLowerCase().includes(term) ||
      e.description.toLowerCase().includes(term)
  );

  if (filtered.length === 0) {
    noResults.classList.remove("hidden");
    return;
  }
  noResults.classList.add("hidden");

  filtered.forEach((e) => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-red-200 hover:shadow-md cursor-pointer flex flex-col p-4";
    card.innerHTML = `
      <div class="flex justify-between items-start mb-3">
        <div class="font-semibold text-sm text-slate-900">${e.name}</div>
        <span class="text-[10px] px-2 py-1 rounded-full ${
          e.severity === "Critical"
            ? "bg-red-100 text-red-700"
            : e.severity === "High"
            ? "bg-orange-100 text-orange-700"
            : e.severity === "Medium"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-green-100 text-green-700"
        }">${e.severity}</span>
      </div>
      <p class="text-xs text-slate-600 mb-2">${e.description}</p>
      <span class="text-[11px] text-red-600 mt-auto">View steps →</span>
    `;
    card.addEventListener("click", () => {
      openDetail(e.id);
    });
    guideList.appendChild(card);
  });
}

if (searchInput) {
  searchInput.addEventListener("input", renderGuideList);
}

renderGuideList();

// ------- Detail view -------
const detailContent = document.getElementById("detail-content");
const backToGuideBtn = document.getElementById("back-to-guide");

function openDetail(id) {
  const emergency = EMERGENCIES.find((e) => e.id === id);
  if (!emergency) return;
  selectedEmergency = emergency;
  showView("detail");
  renderDetail();
}

function renderDetail() {
  if (!detailContent || !selectedEmergency) return;
  const e = selectedEmergency;
  detailContent.innerHTML = `
    <div class="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm mb-5">
      <div class="flex justify-between items-start mb-3">
        <div>
          <h1 class="font-bold text-xl text-slate-900">${e.name}</h1>
          <p class="text-xs text-slate-500 mt-1">${e.description}</p>
        </div>
        <span class="text-[10px] px-2 py-1 rounded-full ${
          e.severity === "Critical"
            ? "bg-red-100 text-red-700"
            : e.severity === "High"
            ? "bg-orange-100 text-orange-700"
            : e.severity === "Medium"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-green-100 text-green-700"
        }">${e.severity}</span>
      </div>
      <h3 class="font-semibold text-sm text-slate-900 mb-2">Immediate Steps</h3>
      <ol class="space-y-1 text-xs text-slate-800">
        ${e.steps
          .map(
            (s, i) =>
              `<li><span class="font-bold mr-1">${i + 1}.</span>${s}</li>`
          )
          .join("")}
      </ol>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-green-50 border border-green-100 rounded-2xl p-4">
        <h3 class="font-semibold text-sm text-green-800 mb-2">Do's</h3>
        <ul class="space-y-1 text-xs text-green-900">
          ${e.dos.map((d) => `<li>• ${d}</li>`).join("")}
        </ul>
      </div>
      <div class="bg-red-50 border border-red-100 rounded-2xl p-4">
        <h3 class="font-semibold text-sm text-red-800 mb-2">Don'ts</h3>
        <ul class="space-y-1 text-xs text-red-900">
          ${e.donts.map((d) => `<li>• ${d}</li>`).join("")}
        </ul>
      </div>
    </div>
    <div class="mt-4 text-[11px] text-slate-500">
      If the condition worsens or seems severe, contact emergency services immediately.
    </div>
  `;
}

if (backToGuideBtn) {
  backToGuideBtn.addEventListener("click", () => showView("guide"));
}

// ------- AI Assistant chat -------
const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");

function addChatMessage(text, role) {
  const container = document.createElement("div");
  container.className =
    "flex " + (role === "user" ? "justify-end" : "justify-start");
  const bubble = document.createElement("div");
  bubble.className =
    "max-w-[80%] px-3 py-2 rounded-lg text-xs leading-relaxed " +
    (role === "user"
      ? "bg-red-600 text-white rounded-br-none"
      : "bg-white border border-slate-200 rounded-bl-none text-slate-800");
  bubble.textContent = text;
  container.appendChild(bubble);
  chatMessages.appendChild(container);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTypingIndicator() {
  const container = document.createElement("div");
  container.id = "typing-indicator";
  container.className = "flex justify-start";
  container.innerHTML = `
    <div class="bg-white border border-slate-200 rounded-bl-none rounded-lg px-3 py-2 text-xs text-slate-500">
      Typing...
    </div>
  `;
  chatMessages.appendChild(container);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
  const el = document.getElementById("typing-indicator");
  if (el) el.remove();
}

// initial message
addChatMessage(
  "Hello, I am the FirstAidConnect AI Assistant. I can help with basic first aid steps. This is for educational purposes only. In an emergency, call your local emergency number.",
  "bot"
);

if (chatForm) {
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    addChatMessage(text, "user");
    chatInput.value = "";
    addTypingIndicator();

    try {
      const res = await fetch("/api/firstaid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      });
      const data = await res.json();
      removeTypingIndicator();
      addChatMessage(data.answer || "No response received.", "bot");
    } catch (err) {
      removeTypingIndicator();
      addChatMessage(
        "Error contacting the AI service. Please try again later.",
        "bot"
      );
    }
  });
}

// ------- Quiz -------
const quizLoading = document.getElementById("quiz-loading");
const quizContent = document.getElementById("quiz-content");
const quizError = document.getElementById("quiz-error");
const quizQuestion = document.getElementById("quiz-question");
const quizOptionsContainer = document.getElementById("quiz-options");
const quizCheckBtn = document.getElementById("quiz-check");
const quizNextBtn = document.getElementById("quiz-next");
const quizResult = document.getElementById("quiz-result");

async function loadQuiz() {
  selectedOption = null;
  quizData = null;
  quizLoading.classList.remove("hidden");
  quizContent.classList.add("hidden");
  quizError.classList.add("hidden");
  quizResult.classList.add("hidden");
  quizNextBtn.classList.add("hidden");

  try {
    const res = await fetch("/api/quiz");
    const data = await res.json();
    quizData = data;
    renderQuiz();
  } catch (err) {
    quizLoading.classList.add("hidden");
    quizError.classList.remove("hidden");
  }
}

function renderQuiz() {
  quizLoading.classList.add("hidden");
  quizContent.classList.remove("hidden");
  quizQuestion.textContent = quizData.question;
  quizOptionsContainer.innerHTML = "";
  quizData.options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "w-full text-left text-xs border border-slate-200 rounded-lg px-3 py-2 mb-2 hover:border-slate-400";
    btn.textContent = opt;
    btn.addEventListener("click", () => {
      selectedOption = opt;
      // highlight selected
      Array.from(quizOptionsContainer.children).forEach((child) => {
        child.classList.remove("border-red-500", "bg-red-50");
      });
      btn.classList.add("border-red-500", "bg-red-50");
    });
    quizOptionsContainer.appendChild(btn);
  });
}

if (quizCheckBtn) {
  quizCheckBtn.addEventListener("click", () => {
    if (!quizData || !selectedOption) return;
    const correct = selectedOption === quizData.answer;
    quizResult.classList.remove("hidden");
    quizNextBtn.classList.remove("hidden");
    quizResult.textContent = correct
      ? "Correct! " + quizData.explanation
      : "Incorrect. " + quizData.explanation;
    quizResult.className =
      "text-xs rounded-lg p-2 mt-1 " +
      (correct ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800");
  });
}

if (quizNextBtn) {
  quizNextBtn.addEventListener("click", () => {
    loadQuiz();
  });
}

// Load first quiz when quiz view is opened the first time
// Simple approach: whenever we switch to quiz, reload
document
  .querySelector('button[data-view="quiz"]')
  .addEventListener("click", () => loadQuiz());

});