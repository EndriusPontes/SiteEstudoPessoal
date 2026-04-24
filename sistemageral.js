// --- RPG E SISTEMAS GERAIS ---
function addXP(v) { 
    xpAtual += v; 

    let levelUp = false;

    while(xpAtual >= xpNecessario) { 
        xpAtual -= xpNecessario; 
        nivel++; 
        xpNecessario = Math.floor(100 * Math.pow(1.18, nivel-1)); 
        levelUp = true;
    }

    if(levelUp) {
        document.querySelector('.profile-highlight-box')
            .classList.add("level-up-effect");

        spawnFloat("LEVEL UP!", window.innerWidth / 2, 100);

        setTimeout(() => {
            document.querySelector('.profile-highlight-box')
                .classList.remove("level-up-effect");
        }, 1000);
    }

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
    const rect = btn.getBoundingClientRect();

    // animação visual
    btn.parentElement.parentElement.classList.add("task-done-anim");

    setTimeout(() => {
        btn.parentElement.parentElement.remove();
        addTaskToUI(txt, 'done-list', false);
    }, 300);

    // efeitos visuais XP / GOLD
    spawnFloat("+50 XP", rect.left, rect.top);
    spawnFloat("+10 GOLD", rect.left, rect.top + 20, "gold-float");

    // lógica
    addXP(50);
    goldCount += 10;

    if(isFromPool) missoesConcluidasHoje++;

    memorials.push({n: txt, d: new Date().toLocaleDateString()});

    updateUI();
}