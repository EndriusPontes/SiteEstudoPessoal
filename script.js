let nivel = 1, xpAtual = 0, xpNecessario = 100, goldCount = 0;
let memorials = [], missoesConcluidasHoje = 0;
const LIMITE_MISSOES = 3;
let cropper;

// TEXTOS DAS MISSÕES QUE VOCÊ PEDIU
const poolDeMissoes = [
    { t: "Fazer AVA", d: "Faça os AVAS que estão disponíveis no site, você receberá uma recompensa de 50 de exp" },
    { t: "Estudar Logica Computacional", d: "Adquire os conhecimentos sobre logica computacional, você receberá uma recompensa de 50 de exp" },
    { t: "Algoritmos e Estruturas", d: "Adquire os conhecimentos sobre os Algoritimos e Estruturas de Dados, você receberá uma recompensa de 50 de exp" },
    { t: "Estudar Banco de Dados", d: "Adquire os conhecimentos sobre os Bancos de Dados, você receberá uma recompensa de 50 de exp" },
    { t: "Redes de Computadores", d: "Adquire os conhecimentos sobre Redes de Computadores, você receberá uma recompensa de 50 de exp" },
    { t: "Programação Web", d: "Estude Fundamentos de Programação para a Internet, você receberá uma recompensa de 50 de exp" },
    { t: "Sistemas Operacionais", d: "Adquire os conhecimentos sobre Sistemas Operacionais, você receberá uma recompensa de 50 de exp" },
    { t: "Cultura e Sociedade", d: "Estude Cultura e Sociedade, você receberá uma recompensa de 50 de exp" },
    { t: "Comunicação e Expressão", d: "Estude Comunicação e Expressão, você receberá uma recompensa de 50 de exp" },
    { t: "Arquitetura de Computadores", d: "Estude Arquitetura e Organização de Computadores, você receberá uma recompensa de 50 de exp" }
];

// Sorteia as missões do dia
let missoesDoDia = [...poolDeMissoes].sort(() => 0.5 - Math.random()).slice(0, 3);

// --- SALVAMENTO ---
function salvarDados() {
    const backup = {
        nivel, xpAtual, xpNecessario, goldCount, memorials, missoesConcluidasHoje,
        nomeUsuario: document.getElementById('user-name').innerText,
        tituloPainel: document.getElementById('main-title-text').innerText,
        blocoNotas: document.getElementById('main-notes').value,
        listaProvas: document.getElementById('exam-list').innerHTML,
        listaAFazer: document.getElementById('todo-list').innerHTML,
        listaConcluido: document.getElementById('done-list').innerHTML,
        fotoPerfil: document.getElementById('profile-img').src
    };
    localStorage.setItem('grimorio_save_v3', JSON.stringify(backup));
}

function carregarDados() {
    const salvo = localStorage.getItem('grimorio_save_v3');
    if (salvo) {
        const d = JSON.parse(salvo);
        nivel = d.nivel; xpAtual = d.xpAtual; xpNecessario = d.xpNecessario; goldCount = d.goldCount;
        memorials = d.memorials || []; missoesConcluidasHoje = d.missoesConcluidasHoje || 0;
        document.getElementById('user-name').innerText = d.nomeUsuario;
        document.getElementById('main-title-text').innerText = d.tituloPainel;
        document.getElementById('main-notes').value = d.blocoNotas;
        document.getElementById('exam-list').innerHTML = d.listaProvas;
        document.getElementById('todo-list').innerHTML = d.listaAFazer;
        document.getElementById('done-list').innerHTML = d.listaConcluido;
        document.getElementById('profile-img').src = d.fotoPerfil;
        updateUI();
    }
}

// --- RPG E UI ---
function addXP(valor) {
    if (nivel >= 250) return;
    xpAtual += valor;
    while (xpAtual >= xpNecessario && nivel < 250) {
        xpAtual -= xpNecessario;
        nivel++;
        xpNecessario = Math.floor(100 * Math.pow(1.18, nivel - 1));
        alert(`LEVEL UP! Nível ${nivel}`);
    }
    updateUI();
}

function updateUI() {
    const percent = (xpAtual / xpNecessario) * 100;
    document.getElementById('xp-fill').style.width = percent + "%";
    document.getElementById('xp-text').innerText = `${xpAtual}/${xpNecessario} XP`;
    document.getElementById('lvl-current').innerText = nivel;
    document.getElementById('gold-count').innerText = goldCount;
    salvarDados();
}

// --- MISSÕES DISPONÍVEIS ---
function openMissionModal() {
    const box = document.getElementById('missions-pool');
    box.innerHTML = "";
    if (missoesConcluidasHoje >= LIMITE_MISSOES) {
        box.innerHTML = `<h3 style="color: gold; margin-top:20px">Você fez todas as missões de hoje!</h3>`;
    } else {
        missoesDoDia.forEach((m, i) => {
            const div = document.createElement('div');
            div.style = "border:1px solid #333; padding:12px; margin-bottom:10px; text-align:left; background: rgba(255,255,255,0.02);";
            div.innerHTML = `<strong>⚔️ ${m.t}</strong><p style="font-size:12px; color:#aaa; margin:5px 0;">${m.d}</p>
                             <button class="btn-sidebar-custom" style="padding:5px; width:auto; font-size:11px;" onclick="acceptMission(${i})">ACEITAR</button>`;
            box.appendChild(div);
        });
    }
    document.getElementById('mission-modal').style.display = 'flex';
}

function acceptMission(idx) {
    const m = missoesDoDia[idx];
    addTaskToUI(m.t, 'todo-list', true);
    missoesDoDia.splice(idx, 1);
    closeMissionModal();
}

function closeMissionModal() { document.getElementById('mission-modal').style.display = 'none'; }

// --- TAREFAS E PROVAS ---
function addTask() {
    const inp = document.getElementById('task-in');
    if (inp.value.trim()) { addTaskToUI(inp.value, 'todo-list', false); inp.value = ""; }
}

function addExam() {
    const inp = document.getElementById('exam-in');
    if (inp.value.trim()) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${inp.value}</span> <button onclick="this.parentElement.remove(); salvarDados();" style="color:red; background:none; border:none; cursor:pointer">❌</button>`;
        document.getElementById('exam-list').appendChild(li);
        inp.value = "";
        salvarDados();
    }
}

function addTaskToUI(txt, listId, isFromPool) {
    const li = document.createElement('li');
    li.innerHTML = `<span>${txt}</span>
        <div>
            ${listId === 'todo-list' ? `<button onclick="finishTask(this, '${txt}', ${isFromPool})" style="color:green; background:none; border:none; cursor:pointer; font-size:20px">✔️</button>` : ''}
            <button onclick="this.parentElement.parentElement.remove(); salvarDados();" style="color:red; background:none; border:none; cursor:pointer; font-size:18px">❌</button>
        </div>`;
    document.getElementById(listId).appendChild(li);
    salvarDados();
}

function finishTask(btn, txt, isFromPool) {
    btn.parentElement.parentElement.remove();
    addTaskToUI(txt, 'done-list', false);
    addXP(50);
    goldCount += 10;
    if (isFromPool) missoesConcluidasHoje++;
    memorials.push({n: txt, d: new Date().toLocaleDateString()});
    updateUI();
}

// --- FOTO ---
function loadPhoto(event) {
    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('image-to-crop').src = e.target.result;
        document.getElementById('cropper-modal').style.display = 'flex';
        if (cropper) cropper.destroy();
        cropper = new Cropper(document.getElementById('image-to-crop'), { aspectRatio: 1, viewMode: 1 });
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

function openHistoryModal() {
    const cont = document.getElementById('history-content');
    cont.innerHTML = memorials.map(m => `<li style="border-bottom:1px solid #333; padding:5px;">${m.n} (${m.d})</li>`).join("") || "Sem memórias.";
    document.getElementById('history-modal').style.display = 'flex';
}
function closeHistoryModal() { document.getElementById('history-modal').style.display = 'none'; }

window.onload = carregarDados;