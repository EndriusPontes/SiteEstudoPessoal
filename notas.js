// CALCULO DE NOTAS
function abrirSistemaNotas() {
    document.querySelector('.grade-system').style.display = 'flex';
}

function fecharNotas() {
    document.querySelector('.grade-system').style.display = 'none';
}

function abrirSistemaNotas() {
    const el = document.querySelector('.grade-system');

    el.style.display = 'block';
    el.style.position = 'fixed';
    el.style.top = '50%';
    el.style.left = '50%';
    el.style.transform = 'translate(-50%, -50%)';
    el.style.background = '#1c1815';
    el.style.padding = '20px';
    el.style.border = '2px solid gold';
    el.style.zIndex = '9999';

    el.innerHTML = `
        <h3>Sistema de Notas</h3>
        <p>Se isso apareceu, está funcionando ✔</p>
    `;
}

function calcularNotas() {
    const n1 = parseFloat(document.getElementById("nota1").value) || 0;
    const n2 = parseFloat(document.getElementById("nota2").value) || 0;
    const mediaMin = parseFloat(document.getElementById("media-minima").value);

    const media = (n1 + n2) / 2;

    let resultado = "";

    if (media >= mediaMin) {
        resultado = `🎉 Aprovado! Média: ${media.toFixed(2)}`;
    } else {
        const falta = (mediaMin * 2) - (n1 + n2);
        resultado = `❌ Reprovado<br>Falta: ${falta.toFixed(2)} pontos`;
    }

    document.getElementById("resultado").innerHTML = resultado;
}
