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
                         <span onclick="deleteNote(${nota.id})" style="color:#ff5555; cursor:pointer;">×</span>`;
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

// --- PROVAS & ALERTAS ---
function addExam() {
    const nameIn = document.getElementById('exam-name-in');
    const dateIn = document.getElementById('exam-date-in');
    
    if(nameIn.value.trim() && dateIn.value) {
        const li = document.createElement('li');
        // Armazenamos a data bruta no atributo data-date para verificação
        li.setAttribute('data-date', dateIn.value);
        li.innerHTML = `<span><strong>${nameIn.value}</strong> - ${dateIn.value}</span>
                        <button onclick="this.parentElement.remove();salvarDados();" style="color:red;background:none;border:none;cursor:pointer">❌</button>`;
        document.getElementById('exam-list').appendChild(li);
        
        nameIn.value = "";
        dateIn.value = "";
        salvarDados();
    }
}

function checkExams() {
    const hoje = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const provas = document.querySelectorAll('#exam-list li');
    
    provas.forEach(prova => {
        const dataProva = prova.getAttribute('data-date');
        const nomeProva = prova.querySelector('strong').innerText;
        
        // Se a data da prova for hoje e ainda não alertamos nesta sessão
        if(dataProva === hoje) {
            alert(`📢 ALERTA DE PROVA: ${nomeProva} é HOJE!`);
        }
    });
}

// Verifica provas a cada 60 segundos
setInterval(checkExams, 60000);

// --- RPG E SISTEMAS GERAIS ---
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
    if(i.value.trim()) { addTaskToUI(i.value, 'todo-list', false); i.value=""; }
}

function addTaskToUI(txt, listId, isFromPool) {
    const li = document.createElement('li');
    li.innerHTML = `<span>${txt}</span><div>
        ${listId === 'todo-list' ? `<button onclick="finishTask(this,'${txt}',${isFromPool})" style="color:green;background:none;border:none;cursor:pointer;">✔️</button>` : ''}
        <button onclick="this.parentElement.parentElement.remove();salvarDados();" style="color:red;background:none;border:none;cursor:pointer;">❌</button></div>`;
    document.getElementById(listId).appendChild(li); salvarDados();
}

function finishTask(btn, txt, isFromPool) {
    btn.parentElement.parentElement.remove();
    addTaskToUI(txt, 'done-list', false);
    addXP(50); goldCount += 10;
    if(isFromPool) missoesConcluidasHoje++;
    memorials.push({n: txt, d: new Date().toLocaleDateString()});
    updateUI();
}

// --- MISSÕES ---
function openMissionModal() {
    const box = document.getElementById('missions-pool'); box.innerHTML = "";
    if (missoesConcluidasHoje >= 3) { box.innerHTML = "<p style='color:gold;'>Meta diária batida!</p>"; }
    else {
        missoesDoDia.forEach((m, i) => {
            const d = document.createElement('div');
            d.style = "border:1px solid #333; padding:10px; margin-bottom:10px; text-align:left;";
            d.innerHTML = `<strong>⚔️ ${m.t}</strong><p style="font-size:12px; color:#aaa;">${m.d}</p>
                           <button onclick="acceptMission(${i})" class="btn-sidebar-custom" style="padding:5px; width:auto;">ACEITAR</button>`;
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

// --- SAVE & LOAD ---
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