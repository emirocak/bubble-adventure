const APP_CONFIG = {
  name: "Baloncuk Macerası",
  missions: [
    {
      id: 1,
      title: "İlk Baloncuk",
      short: "Her şey küçük bir ipucuyla başlıyor.",
      description: "İlk sürpriz, seni sık sık bir yerlere götüren tanıdık bir yerde saklanıyor.",
      qrKey: "babol-abc-01",
      hints: [
        "Seni her gün bir yerlere götüren arkadaşına bak.",
        "Plakasının ortasında ABC harfleri olan arabayı düşün.",
        "Sürücü koltuğuna oturduğunda sağ tarafına bak.",
        "Torpido gözünü açmayı dene."
      ]
    },
    {
      id: 2,
      title: "İkinci İz",
      short: "Bu kez biraz daha dikkatli olmalısın.",
      description: "Sana ait olan ama her gün bakmadığın bir yerde küçük bir sürpriz bekliyor.",
      qrKey: "babol-pembe-02",
      hints: [
        "Günün sonunda yanına aldığın şeyleri düşün.",
        "Çantanın küçük gözlerinden birini kontrol et.",
        "Fermuarlı, dar ve gözden kaçan bölmeye bak."
      ]
    },
    {
      id: 3,
      title: "Sessiz Köşe",
      short: "Yakınında ama ilk bakışta görünmüyor.",
      description: "Bu görevde aradığın şey, genellikle acele ederken fark etmediğin bir köşede.",
      qrKey: "babol-sessiz-03",
      hints: [
        "Oturduğunda elinin kolayca ulaşabildiği bir yeri düşün.",
        "Bir masa ya da koltuk çevresine dikkatlice bak.",
        "Alt tarafta, kenara yakın küçük bir boşluk olabilir."
      ]
    },
    {
      id: 4,
      title: "Tatlı Tesadüf",
      short: "İpucu bu kez bir anının içinde.",
      description: "Birlikte vakit geçirirken sık kullandığınız bir yer ya da eşya seni bekliyor.",
      qrKey: "babol-ani-04",
      hints: [
        "Birlikte en çok nerede oturuyorsunuz?",
        "Fotoğraf çektiğiniz ya da kahve içtiğiniz bir yeri düşün.",
        "Yakınındaki küçük saklama alanlarını kontrol et."
      ]
    },
    {
      id: 5,
      title: "Final Balonu",
      short: "Son görev, bütün maceranın en tatlı noktası.",
      description: "Buraya kadar geldiysen son sürprize çok yakınsın.",
      qrKey: "babol-final-05",
      hints: [
        "Bu kez ipucu bende saklı olabilir.",
        "Buluştuğumuzda bana dikkatlice bak.",
        "Ceketimin ya da çantamın küçük cebini kontrol et."
      ]
    }
  ],
  notes: [
    "Bazen en güzel sürprizler, en beklenmedik yerde saklanır.",
    "Bir sonraki ipucu düşündüğünden daha yakın olabilir.",
    "Sabırlı ol. Bazı şeyler bulunmayı biraz bekler.",
    "Bu oyunun en güzel kısmı, yüzündeki merak ifadesi.",
    "Her bölüm küçük, hatırası büyük."
  ]
};

const STORAGE_KEY = "baloncukMaceraProgress";
let state = loadState();
let selectedMissionId = 1;
let revealedHints = {};

const screens = {
  welcome: document.getElementById("welcomeScreen"),
  game: document.getElementById("gameScreen"),
  mission: document.getElementById("missionScreen"),
  final: document.getElementById("finalScreen")
};

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return { started: false, completed: [] };
  try { return JSON.parse(saved); } catch { return { started: false, completed: [] }; }
}

function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function showScreen(name) {
  Object.values(screens).forEach(el => el.classList.remove("active"));
  screens[name].classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function isUnlocked(id) {
  return id === 1 || state.completed.includes(id - 1);
}

function renderMap() {
  const path = document.getElementById("missionPath");
  path.innerHTML = "";

  APP_CONFIG.missions.forEach((mission) => {
    const completed = state.completed.includes(mission.id);
    const unlocked = isUnlocked(mission.id);
    const item = document.createElement("button");
    item.className = `mission-item ${completed ? "completed" : ""} ${!unlocked ? "locked" : ""}`;
    item.disabled = !unlocked;
    item.innerHTML = `
      <div class="mission-dot">${completed ? "✓" : String(mission.id).padStart(2, "0")}</div>
      <div class="mission-copy">
        <strong>${mission.title}</strong>
        <span>${completed ? "Tamamlandı" : unlocked ? mission.short : "Önceki görevi tamamla"}</span>
      </div>
      <div class="mission-state">${completed ? "★" : unlocked ? "→" : "🔒"}</div>
    `;
    item.addEventListener("click", () => openMission(mission.id));
    path.appendChild(item);
  });

  const count = state.completed.length;
  const total = APP_CONFIG.missions.length;
  const percent = Math.round((count / total) * 100);
  document.getElementById("progressText").textContent = `${count} / ${total} tamamlandı`;
  document.getElementById("progressPercent").textContent = `${percent}%`;
  document.getElementById("progressBar").style.width = `${percent}%`;
  document.getElementById("dailyNote").textContent = APP_CONFIG.notes[count % APP_CONFIG.notes.length];
}

function openMission(id) {
  if (!isUnlocked(id)) return;
  selectedMissionId = id;
  const mission = APP_CONFIG.missions.find(m => m.id === id);
  document.getElementById("missionNumber").textContent = String(id).padStart(2, "0");
  document.getElementById("missionTitle").textContent = mission.title;
  document.getElementById("missionDescription").textContent = mission.description;
  document.getElementById("missionStatus").textContent = state.completed.includes(id) ? "TAMAMLANAN GÖREV" : "AÇIK GÖREV";
  revealedHints[id] = revealedHints[id] || 1;
  renderHints();
  showScreen("mission");
}

function renderHints() {
  const mission = APP_CONFIG.missions.find(m => m.id === selectedMissionId);
  const area = document.getElementById("hintArea");
  area.innerHTML = "";
  mission.hints.slice(0, revealedHints[selectedMissionId]).forEach((hint, index) => {
    const card = document.createElement("div");
    card.className = "hint-card";
    card.innerHTML = `<span>İPUCU ${index + 1}</span><p>${hint}</p>`;
    area.appendChild(card);
  });
  const button = document.getElementById("hintButton");
  const allShown = revealedHints[selectedMissionId] >= mission.hints.length;
  button.disabled = allShown;
  button.textContent = allShown ? "Tüm ipuçları gösterildi" : "Bir ipucu daha göster";
}

function completeMission(mission, fromQr = true) {
  if (!state.completed.includes(mission.id)) {
    state.completed.push(mission.id);
    state.completed.sort((a, b) => a - b);
    state.started = true;
    saveState();
    launchConfetti();
  }

  renderMap();
  document.getElementById("qrSuccess").classList.remove("hidden");
  document.getElementById("successTitle").textContent = `${mission.title} tamamlandı!`;
  document.getElementById("successText").textContent = mission.id === APP_CONFIG.missions.length
    ? "Bütün görevler tamamlandı. Final açıldı."
    : `Görev ${mission.id + 1} artık açık.`;

  showScreen("game");
  if (mission.id === APP_CONFIG.missions.length) {
    setTimeout(() => showScreen("final"), 1600);
  } else if (fromQr) {
    showToast("QR kod doğrulandı. Yeni bölüm açıldı.");
  }
}

function processQrFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const key = params.get("qr");
  if (!key) return false;
  const mission = APP_CONFIG.missions.find(m => m.qrKey === key);
  if (!mission) {
    showToast("Bu QR kod bu maceraya ait görünmüyor.");
    return false;
  }
  if (!isUnlocked(mission.id) && !state.completed.includes(mission.id)) {
    state.started = true;
    saveState();
    showScreen("game");
    showToast("Biraz acele ettin. Önce önceki görevi tamamlamalısın.");
    return true;
  }
  completeMission(mission, true);
  return true;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 3200);
}

function launchConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * .3,
    size: 5 + Math.random() * 7,
    speed: 2 + Math.random() * 4,
    drift: -1.5 + Math.random() * 3,
    rotate: Math.random() * Math.PI,
    spin: -.08 + Math.random() * .16,
    color: ["#ff6f91", "#ff9b76", "#ffd166", "#4fbd8f", "#9a7cff"][Math.floor(Math.random() * 5)]
  }));
  let frame = 0;
  function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p => {
      p.y += p.speed; p.x += p.drift; p.rotate += p.spin;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rotate); ctx.fillStyle = p.color;
      ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*.7); ctx.restore();
    });
    frame++;
    if (frame < 180) requestAnimationFrame(animate); else ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  animate();
}

document.getElementById("totalMissionCount").textContent = APP_CONFIG.missions.length;
document.getElementById("startButton").addEventListener("click", () => {
  state.started = true;
  saveState();
  renderMap();
  showScreen("game");
});
document.getElementById("backButton").addEventListener("click", () => { renderMap(); showScreen("game"); });
document.getElementById("returnMapButton").addEventListener("click", () => { renderMap(); showScreen("game"); });
document.getElementById("hintButton").addEventListener("click", () => { revealedHints[selectedMissionId]++; renderHints(); });
document.getElementById("resetButton").addEventListener("click", () => {
  if (!confirm("Tüm görev ilerlemesi sıfırlansın mı?")) return;
  state = { started: false, completed: [] };
  saveState();
  document.getElementById("qrSuccess").classList.add("hidden");
  showScreen("welcome");
});

window.addEventListener("resize", () => {
  const canvas = document.getElementById("confettiCanvas");
  canvas.width = innerWidth; canvas.height = innerHeight;
});

renderMap();
const handledQr = processQrFromUrl();
if (!handledQr) showScreen(state.started ? "game" : "welcome");
