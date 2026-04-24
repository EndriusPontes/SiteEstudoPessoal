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