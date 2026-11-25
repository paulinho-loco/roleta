
const perguntas = [
    {
        categoria: "Matemática",
        pergunta: "Quanto é 8 x 7?",
        opcoes: ["54", "56", "64", "48"],
        resposta: 1
    },
    {
        categoria: "Matemática",
        pergunta: "Quanto é 100 dividido por 4?",
        opcoes: ["20", "30", "25", "40"],
        resposta: 2
    },
    {
        categoria: "Ciências",
        pergunta: "Qual planeta é conhecido como planeta vermelho?",
        opcoes: ["Vênus", "Marte", "Júpiter", "Saturno"],
        resposta: 1
    },
    {
        categoria: "Ciências",
        pergunta: "Qual órgão bombeia o sangue?",
        opcoes: ["Pulmão", "Cérebro", "Coração", "Estômago"],
        resposta: 2
    },
    {
        categoria: "História",
        pergunta: "Em que ano ocorreu a Independência do Brasil?",
        opcoes: ["1822", "1889", "1500", "1922"],
        resposta: 0
    },
    {
        categoria: "História",
        pergunta: "Quem foi o primeiro presidente do Brasil?",
        opcoes: ["Dom Pedro II", "Getúlio Vargas", "Deodoro da Fonseca", "Tiradentes"],
        resposta: 2
    },
    {
        categoria: "Geografia",
        pergunta: "Qual é a capital do Brasil?",
        opcoes: ["São Paulo", "Brasília", "Rio de Janeiro", "Salvador"],
        resposta: 1
    },
    {
        categoria: "Geografia",
        pergunta: "Qual é o maior país da América do Sul?",
        opcoes: ["Argentina", "Chile", "Peru", "Brasil"],
        resposta: 3
    },
    {
        categoria: "Português",
        pergunta: "Qual é o plural de cidadão?",
        opcoes: ["Cidadões", "Cidadãos", "Cidadães", "Cidadans"],
        resposta: 1
    },
    {
        categoria: "Português",
        pergunta: "Qual palavra é um verbo?",
        opcoes: ["Casa", "Bonito", "Correr", "Azul"],
        resposta: 2
    },
    {
        categoria: "Conhecimentos",
        pergunta: "Quantos dias tem uma semana?",
        opcoes: ["5", "6", "7", "8"],
        resposta: 2
    },
    {
        categoria: "Conhecimentos",
        pergunta: "Qual animal é conhecido como rei da selva?",
        opcoes: ["Tigre", "Leão", "Elefante", "Lobo"],
        resposta: 1
    }
];

let pontos = 0;
let respondidas = 0;
let perguntaAtual = null;
let bloqueado = false;
let angulo = 0;

let perguntasDisponiveis = [...perguntas];

let recorde = Number(localStorage.getItem("recordeRoleta")) || 0;

document.getElementById("recorde").textContent = recorde;

function atualizarPlacar() {
    document.getElementById("pontos").textContent = pontos;

    document.getElementById("respondidas").textContent =
        respondidas + "/12";

    document.getElementById("recorde").textContent = recorde;
}

function girarRoleta() {

    if (bloqueado || respondidas >= 12) return;

    bloqueado = true;

    document.getElementById("girar").disabled = true;
    document.getElementById("perguntaBox").style.display = "none";
    document.getElementById("fim").style.display = "none";

    const sorteio = Math.floor(Math.random() * 6);

    angulo += 360 * 5 + (sorteio * 60) + 30;

    document.getElementById("roleta").style.transform =
        `rotate(${angulo}deg)`;

    setTimeout(() => {
        mostrarPergunta(sorteio);
    }, 4100);
}

function mostrarPergunta(categoriaIndex) {

    const categorias = [
        "Matemática",
        "Ciências",
        "História",
        "Geografia",
        "Português",
        "Conhecimentos"
    ];

    const categoriaEscolhida = categorias[categoriaIndex];

    const disponiveis = perguntasDisponiveis.filter(
        p => p.categoria === categoriaEscolhida
    );

    if (disponiveis.length === 0) {
        const outras = perguntasDisponiveis;

        if (outras.length === 0) {
            finalizarJogo();
            return;
        }

        perguntaAtual = outras[
            Math.floor(Math.random() * outras.length)
        ];

    } else {
        perguntaAtual = disponiveis[
            Math.floor(Math.random() * disponiveis.length)
        ];
    }

    document.getElementById("categoria").textContent =
        "Categoria: " + perguntaAtual.categoria;

    document.getElementById("pergunta").textContent =
        perguntaAtual.pergunta;

    const opcoes = document.getElementById("opcoes");

    opcoes.innerHTML = "";

    perguntaAtual.opcoes.forEach((opcao, indice) => {

        const botao = document.createElement("button");

        botao.className = "opcao";
        botao.textContent = opcao;

        botao.onclick = () => verificarResposta(indice, botao);

        opcoes.appendChild(botao);
    });

    document.getElementById("resultado").textContent = "";

    document.getElementById("perguntaBox").style.display = "block";
}

function verificarResposta(indice, botao) {

    if (!bloqueado || !perguntaAtual) return;

    const botoes = document.querySelectorAll(".opcao");

    botoes.forEach(b => b.disabled = true);

    const respostaCerta = perguntaAtual.resposta;

    if (indice === respostaCerta) {

        pontos += 10;

        botao.classList.add("correta");

        document.getElementById("resultado").textContent =
            "🎉 Resposta correta! Você ganhou 10 pontos!";

    } else {

        botao.classList.add("errada");

        botoes[respostaCerta].classList.add("correta");

        document.getElementById("resultado").textContent =
            "❌ Resposta incorreta! A resposta certa está em verde.";
    }

    perguntasDisponiveis = perguntasDisponiveis.filter(
        p => p !== perguntaAtual
    );

    respondidas++;

    if (pontos > recorde) {
        recorde = pontos;

        localStorage.setItem("recordeRoleta", recorde);
    }

    atualizarPlacar();

    perguntaAtual = null;

    setTimeout(() => {

        document.getElementById("perguntaBox").style.display = "none";

        if (respondidas === 12) {
            finalizarJogo();
        } else {
            bloqueado = false;
            document.getElementById("girar").disabled = false;
        }

    }, 2200);
}

function finalizarJogo() {

    bloqueado = true;

    document.getElementById("fim").style.display = "block";

    let mensagem = "";

    if (pontos >= 100) {
        mensagem = "Excelente! Você é um verdadeiro campeão! 🥇";
    } else if (pontos >= 70) {
        mensagem = "Muito bem! Você teve um ótimo desempenho! 🥈";
    } else if (pontos >= 40) {
        mensagem = "Bom trabalho! Continue aprendendo! 🥉";
    } else {
        mensagem = "Continue praticando! Você pode melhorar! 💪";
    }

    document.getElementById("mensagemFinal").textContent =
        mensagem + " Sua pontuação foi de " + pontos + " pontos.";
}

function reiniciar() {

    pontos = 0;
    respondidas = 0;
    bloqueado = false;
    perguntaAtual = null;

    perguntasDisponiveis = [...perguntas];

    angulo = 0;

    const roleta = document.getElementById("roleta");

    roleta.style.transition = "none";
    roleta.style.transform = "rotate(0deg)";

    setTimeout(() => {
        roleta.style.transition =
            "transform 4s cubic-bezier(.15,.75,.15,1)";
    }, 50);

    document.getElementById("fim").style.display = "none";
    document.getElementById("perguntaBox").style.display = "none";
    document.getElementById("girar").disabled = false;

    atualizarPlacar();
}

atualizarPlacar();
