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