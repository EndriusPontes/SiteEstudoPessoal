// --- SAVE & LOAD ---
function salvarDados() {
    const data = {
        nivel, xpAtual, xpNecessario, goldCount, memorials, missoesConcluidasHoje, notas, notaAtivaId,
        nome: document.getElementById('user-name').innerText,
        titulo: document.getElementById('main-title-text').innerText,
        exam: [{ nome: "Prova", data: "2026-04-24" }],
        todo: document.getElementById('todo-list').innerHTML,
        done: document.getElementById('done-list').innerHTML,
        foto: document.getElementById('profile-img').src
    };
    localStorage.setItem('grimorio_save_master_v5', JSON.stringify(data));
}

function carregarDados() {
    const s = localStorage.getItem('grimorio_save_master_v5');
    if(s) {
        const d = JSON.parse(s);
        nivel = d.nivel; xpAtual = d.xpAtual; xpNecessario = d.xpNecessario; goldCount = d.goldCount;
        memorials = d.memorials || []; missoesConcluidasHoje = d.missoesConcluidasHoje || 0;
        notas = d.notas || notas; notaAtivaId = d.notaAtivaId || notas[0].id;
        document.getElementById('user-name').innerText = d.nome;
        document.getElementById('main-title-text').innerText = d.titulo;
        document.getElementById('exam-list').innerHTML = d.exam;
        document.getElementById('todo-list').innerHTML = d.todo;
        document.getElementById('done-list').innerHTML = d.done;
        document.getElementById('profile-img').src = d.foto || "https://i.postimg.cc/8PzS6mZ8/pinguim.png";
        switchNote(notaAtivaId);
        updateUI();
        checkExams(); // Verifica logo ao carregar o site
    } else {
        document.getElementById('profile-img').src = "https://i.postimg.cc/8PzS6mZ8/pinguim.png";
        renderTabs();
    }
}

function openHistoryModal() {
    const c = document.getElementById('history-content');
    c.innerHTML = memorials.map(m => `<li>${m.n} (${m.d})</li>`).join("") || "Vazio";
    document.getElementById('history-modal').style.display = 'flex';
}
function closeMissionModal() { document.getElementById('mission-modal').style.display='none'; }
function closeHistoryModal() { document.getElementById('history-modal').style.display='none'; }

window.onload = carregarDados;

function spawnFloat(text, x, y, className="xp-float") {
    const el = document.createElement("div");
    el.className = className;
    el.innerText = text;

    el.style.left = x + "px";
    el.style.top = y + "px";

    document.body.appendChild(el);

    setTimeout(() => el.remove(), 1000);
}


// --- FOTO (CROPPER) ---
function loadPhoto(event) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = document.getElementById('image-to-crop');
        img.src = e.target.result;
        document.getElementById('cropper-modal').style.display = 'flex';
        if (cropper) cropper.destroy();
        cropper = new Cropper(img, { aspectRatio: 1, viewMode: 1 });
    };
    if(event.target.files[0]) reader.readAsDataURL(event.target.files[0]);
}

function confirmCrop() {
    const canvas = cropper.getCroppedCanvas({ width: 150, height: 150 });
    document.getElementById('profile-img').src = canvas.toDataURL();
    closeCropper();
}

function closeCropper() {
    document.getElementById('cropper-modal').style.display = 'none';
    if (cropper) cropper.destroy();
    salvarDados();
}