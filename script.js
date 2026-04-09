let nivel = 1, xpAtual = 0, xpNecessario = 100, goldCount = 0;
let memorials = [], missoesConcluidasHoje = 0;
let cropper;

// NOTAS
let notas = [{ id: Date.now(), titulo: "Nota 1", conteudo: "" }];
let notaAtivaId = notas[0].id;

const poolDeMissoes = [
    { t: "Fazer AVA", d: "Faça os AVAS que estão disponíveis no site, você receberá uma recompensa de 50 de exp" },
    { t: "Estudar Logica Computacional", d: "Adquire os conhecimentos sobre logica computacional, você receberá uma recompensa de 50 de exp" },
    { t: "Algoritmos e Estruturas", d: "Adquire os conhecimentos sobre os Algoritimos e Estruturas de Dados, você receberá uma recompensa de 50 de exp" },
    { t: "Estudar Banco de Dados", d: "Adquire os conhecimentos sobre os Bancos de Dados, você receberá uma recompensa de 50 de exp" }
];
let missoesDoDia = [...poolDeMissoes].sort(() => 0.5 - Math.random()).slice(0, 3);

// --- BLOCO DE NOTAS ---
function execCmd(cmd) { document.execCommand(cmd, false, null); }

function renderTabs() {
    const container = document.getElementById('notes-tabs');
    container.innerHTML = "";
    notas.forEach(nota => {
        const div = document.createElement('div');
        div.className = `tab ${nota.id === notaAtivaId ? 'active' : ''}`;
        div.innerHTML = `<span onclick="switchNote(${nota.id})">${nota.titulo}</span> 
                         <span onclick="deleteNote(${nota.id})" style="color:red; cursor:pointer">✖</span>`;
        container.appendChild(div);
    });
}

function addNewNote() {
    const nova = { id: Date.now(), titulo: "Nota " + (notas.length + 1), conteudo: "" };
    notas.push(nova);
    switchNote(nova.id);
}

function switchNote(id) {
    notaAtivaId = id;
    const nota = notas.find(n => n.id === id);
    document.getElementById('note-editor').innerHTML = nota.conteudo;
    renderTabs();
    salvarDados();
}

function updateCurrentNote() {
    const nota = notas.find(n => n.id === notaAtivaId);
    if (nota) { nota.conteudo = document.getElementById('note-editor').innerHTML; salvarDados(); }
}

function deleteNote(id) {
    if (notas.length === 1) return;
    notas = notas.filter(n => n.id !== id);
    if (notaAtivaId === id) notaAtivaId = notas[0].id;
    switchNote(notaAtivaId);
}

// --- FOTO DE PERFIL (CROPPER) ---
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
    document.getElementById('file-input').value = "";
    if (cropper) cropper.destroy();
    salvarDados();
}

// --- MISSÕES E RPG ---
function openMissionModal() {
    const box = document.getElementById('missions-pool'); box.innerHTML = "";
    if (missoesConcluidasHoje >= 3) { box.innerHTML = "<p>Missões concluídas por hoje!</p>"; }
    else {
        missoesDoDia.forEach((m, i) => {
            const d = document.createElement('div'); d.style = "border:1px solid #333; padding:10px; margin-bottom:10px;";
            d.innerHTML = `<strong>⚔️ ${m.t}</strong><p style="font-size:12px">${m.d}</p>
                           <button onclick="acceptMission(${i})" class="btn-sidebar-custom" style="padding:5px">ACEITAR</button>`;
            box.appendChild(d);
        });
    }
    document.getElementById('mission-modal').style.display = 'flex';
}

function acceptMission(idx) {
    addTaskToUI(missoesDoDia[idx].t, 'todo-list', true);
    missoesDoDia.splice(idx, 1);
    closeMissionModal();
}

function finishTask(btn, txt, isFromPool) {
    btn.parentElement.parentElement.remove();
    addTaskToUI(txt, 'done-list', false);
    addXP(50); goldCount += 10;
    if(isFromPool) missoesConcluidasHoje++;
    memorials.push({n: txt, d: new Date().toLocaleDateString()});
    updateUI();
}

// --- UTILITÁRIOS ---
function addXP(v) { 
    xpAtual += v; 
    while(xpAtual >= xpNecessario) { xpAtual -= xpNecessario; nivel++; xpNecessario = Math.floor(100 * Math.pow(1.18, nivel-1)); alert("LEVEL UP!"); } 
    updateUI(); 
}

function updateUI() {
    document.getElementById('xp-fill').style.width = (xpAtual/xpNecessario)*100 + "%";
    document.getElementById('xp-text').innerText = `${xpAtual}/${xpNecessario} XP`;
    document.getElementById('lvl-current').innerText = nivel;
    document.getElementById('gold-count').innerText = goldCount;
    salvarDados();
}

function addTask() {
    const i = document.getElementById('task-in');
    if(i.value) { addTaskToUI(i.value, 'todo-list', false); i.value=""; }
}

function addExam() {
    const i = document.getElementById('exam-in');
    if(i.value) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${i.value}</span><button onclick="this.parentElement.remove();salvarDados();">❌</button>`;
        document.getElementById('exam-list').appendChild(li); i.value=""; salvarDados();
    }
}

function addTaskToUI(txt, listId, isFromPool) {
    const li = document.createElement('li');
    li.innerHTML = `<span>${txt}</span><div>
        ${listId === 'todo-list' ? `<button onclick="finishTask(this,'${txt}',${isFromPool})" style="color:green;background:none;border:none;cursor:pointer">✔️</button>` : ''}
        <button onclick="this.parentElement.parentElement.remove();salvarDados();" style="color:red;background:none;border:none;cursor:pointer">❌</button></div>`;
    document.getElementById(listId).appendChild(li); salvarDados();
}

function openHistoryModal() {
    const c = document.getElementById('history-content');
    c.innerHTML = memorials.map(m => `<li>${m.n} (${m.d})</li>`).join("") || "Vazio";
    document.getElementById('history-modal').style.display = 'flex';
}

function closeMissionModal() { document.getElementById('mission-modal').style.display='none'; }
function closeHistoryModal() { document.getElementById('history-modal').style.display='none'; }

function salvarDados() {
    const data = {
        nivel, xpAtual, xpNecessario, goldCount, memorials, missoesConcluidasHoje, notas, notaAtivaId,
        nome: document.getElementById('user-name').innerText,
        titulo: document.getElementById('main-title-text').innerText,
        exam: document.getElementById('exam-list').innerHTML,
        todo: document.getElementById('todo-list').innerHTML,
        done: document.getElementById('done-list').innerHTML,
        foto: document.getElementById('profile-img').src
    };
    localStorage.setItem('grimorio_master_save', JSON.stringify(data));
}

function carregarDados() {
    const s = localStorage.getItem('grimorio_master_save');
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
        document.getElementById('profile-img').src = d.foto;
        switchNote(notaAtivaId);
        updateUI();
    } else { renderTabs(); }
}

window.onload = carregarDados;