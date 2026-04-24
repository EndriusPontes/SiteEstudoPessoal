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