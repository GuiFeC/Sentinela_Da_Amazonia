const MODO_DESENVOLVEDOR = false; 

const FASES = [
    {
        nome: "1. Quintal de Casa",
        img: "assets/fase1.png",
        alvos: [
            { top: "66.1%", left: "73.0%", width: "8vw", height: "8vw", msg: "Pneu" },
            { top: "88.2%", left: "73.0%", width: "8vw", height: "8vw", msg: "Vaso" },
            { top: "61.9%", left: "26.2%", width: "8vw", height: "8vw", msg: "Muitas Garrafas" },
            { top: "67.5%", left: "63.0%", width: "3vw", height: "3vw", msg: "Garrafa Sozinha" },
            { top: "32.1%", left: "58.0%", width: "23vw", height: "2vw", msg: "Calha" },
        ]
    },
    {
        nome: "2. Cozinha",
        img: "assets/fase2.png",
        alvos: [
            { top: "74.5%", left: "71.8%", width: "8vw", height: "8vw", msg: "Prato da Planta" },
            { top: "89.3%", left: "51.8%", width: "8vw", height: "8vw", msg: "Pote de Água" },
            { top: "85.3%", left: "26.5%", width: "8vw", height: "8vw", msg: "Garrafas" },
            { top: "84.0%", left: "64.8%", width: "4vw", height: "9vw", msg: "Mais Garrafas" },
        ]
    },
    {
        nome: "3. Rua com Entulhos",
        img: "assets/fase3.png",
        alvos: [
            { top: "64.6%", left: "28.2%", width: "8vw", height: "8vw", msg: "Carrinho de Mão" },
            { top: "84.6%", left: "47.7%", width: "8vw", height: "8vw", msg: "Bloco de Concreto 1" },
            { top: "67.8%", left: "45.2%", width: "12vw", height: "8vw", msg: "Bloco de Concreto 2" },
            { top: "76.2%", left: "75.2%", width: "8vw", height: "8vw", msg: "Pneu" },
            { top: "44.2%", left: "58.1%", width: "14vw", height: "8vw", msg: "Poça Menor" },
            { top: "61.9%", left: "64.6%", width: "16vw", height: "8vw", msg: "Poça Maior" },
        ]
    }
];

let faseAtual = 0;
let focosAbatidosFase = 0;
let totalFocosJogo = 0;
let totalAbatidosJogo = 0;

document.addEventListener('DOMContentLoaded', () => {
    if(!MODO_DESENVOLVEDOR) {
        document.getElementById('menu').style.display = 'flex';
    } else {
        document.getElementById('menu').style.display = 'none';
        document.getElementById('jogo').style.display = 'flex';
        document.body.classList.add('debug-mode');
        alert("MODO DESENVOLVEDOR ATIVO (Calibração CÍRCULO CENTRADO)!");
        carregarFase(0);
    }
});

function iniciarJogo() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('jogo').style.display = 'flex';
    carregarFase(0);
}

function carregarFase(indice) {
    faseAtual = indice;
    const dados = FASES[indice];
    focosAbatidosFase = 0;

    document.getElementById('nomeFase').innerText = dados.nome;
    document.getElementById('gameContent').style.backgroundImage = `url('${dados.img}')`;
    document.getElementById('restantes').innerText = dados.alvos.length;

    const container = document.getElementById('alvosContainer');
    container.innerHTML = '';

    dados.alvos.forEach(alvo => {
        totalFocosJogo++;
        const el = document.createElement('div');
        el.className = 'alvo';
        el.style.top = alvo.top;
        el.style.left = alvo.left;
        el.style.width = alvo.width;
        el.style.height = alvo.height;
        
        el.onclick = function(e) {
            e.stopPropagation(); 
            eliminarFoco(el, alvo.msg);
        };

        container.appendChild(el);
    });
}

function eliminarFoco(el, texto) {
    if(el.classList.contains('morto')) return;
    
    el.classList.add('morto');
    
    focosAbatidosFase++;
    totalAbatidosJogo++;
    
    const totalFase = FASES[faseAtual].alvos.length;
    document.getElementById('restantes').innerText = totalFase - focosAbatidosFase;

    const msg = document.getElementById('msg');
    document.getElementById('txtMsg').innerText = texto;
    msg.style.display = 'block';
    setTimeout(() => { msg.style.display = 'none'; }, 1200);

    if(focosAbatidosFase >= totalFase) {
        setTimeout(proximaFase, 1500);
    }
}

function proximaFase() {
    if(faseAtual + 1 < FASES.length) {
        carregarFase(faseAtual + 1);
    } else {
        mostrarPlacarFinal();
    }
}

function mostrarPlacarFinal() {
    document.getElementById('jogo').style.display = 'none';
    document.getElementById('placarFinal').style.display = 'flex';
    document.getElementById('pontuacaoFinal').innerText = "100%"; 
}

function debugClick(e) {
    if(!MODO_DESENVOLVEDOR) return;
    
    const gameContent = document.getElementById('gameContent');
    const bgImgUrl = window.getComputedStyle(gameContent).backgroundImage.slice(5, -2).replace(/['"]/g, ''); 
    
    if (!bgImgUrl || bgImgUrl === 'none') {
        alert("Nenhuma imagem de fundo detectada em #gameContent. Verifique se a fase está carregada.");
        return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous"; 
    img.onload = function() {
        const imgRatio = img.width / img.height;
        const containerRect = gameContent.getBoundingClientRect();
        const containerRatio = containerRect.width / containerRect.height;

        let imgDisplayWidth, imgDisplayHeight, imgDisplayLeft, imgDisplayTop;

        if (containerRatio > imgRatio) {
            imgDisplayHeight = containerRect.height;
            imgDisplayWidth = imgDisplayHeight * imgRatio;
            imgDisplayLeft = (containerRect.width - imgDisplayWidth) / 2;
            imgDisplayTop = 0;
        } else {
            imgDisplayWidth = containerRect.width;
            imgDisplayHeight = imgDisplayWidth / imgRatio;
            imgDisplayTop = (containerRect.height - imgDisplayHeight) / 2;
            imgDisplayLeft = 0;
        }

        const clickX = e.clientX - containerRect.left;
        const clickY = e.clientY - containerRect.top;

        if (clickX >= imgDisplayLeft && clickX <= (imgDisplayLeft + imgDisplayWidth) &&
            clickY >= imgDisplayTop && clickY <= (imgDisplayTop + imgDisplayHeight)) {
            
            const relativeX = (clickX - imgDisplayLeft) / imgDisplayWidth;
            const relativeY = (clickY - imgDisplayTop) / imgDisplayHeight;

            const top = (relativeY * 100).toFixed(1) + "%";
            const left = (relativeX * 100).toFixed(1) + "%";
            
            const defaultTargetWidth = "8vw";
            const defaultTargetHeight = "8vw";
            const msg = "NOVO FOCO";

            const texto = `{ top: "${top}", left: "${left}", width: "${defaultTargetWidth}", height: "${defaultTargetHeight}", msg: "${msg}" },`;
            
            console.log(texto);
            navigator.clipboard.writeText(texto);
            alert("Copiado para área de transferência (Círculo Centrado!):\n" + texto + 
                  "\n\nATENÇÃO: Clique no ponto que será o CENTRO do seu alvo!");

            const tempMarker = document.createElement('div');
            tempMarker.style.position = 'absolute';
            tempMarker.style.top = top;
            tempMarker.style.left = left;
            tempMarker.style.width = defaultTargetWidth;
            tempMarker.style.height = defaultTargetHeight;
            tempMarker.style.backgroundColor = 'rgba(255,0,0,0.3)';
            tempMarker.style.border = '2px dashed red';
            tempMarker.style.borderRadius = '50%';
            tempMarker.style.transform = 'translate(-50%, -50%)';
            tempMarker.style.zIndex = '1000';
            gameContent.appendChild(tempMarker);
            setTimeout(() => tempMarker.remove(), 1000);

        } else {
            alert("Clique fora da área da imagem (na barra preta). Por favor, clique DENTRO da imagem visível.");
        }
    };
    img.src = bgImgUrl;
}