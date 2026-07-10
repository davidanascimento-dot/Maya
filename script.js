// =============================================
// MAYA-ENEM — Advanced Intelligence Engine v2.0
// API: Groq (Llama 3.1) - Optimized Context Injection
// =============================================

// ===================== CONFIG =====================
const API_KEY = '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';
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

// ===================== DELAY =====================
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ===================== DIRETRIZES TÉCNICAS ENEM =====================
// Injetado dinamicamente para transformar as respostas em ferramentas reais de aprovação
const INJETORES_ESTUDO_AVANCADO = {
    raciocinio: `[MODO OPERACIONAL INTERNO ATIVADO: RACIOCÍNIO AVANÇADO E MATRIZ TRI]
- Analise o problema focado na Teoria de Resposta ao Item (TRI) e Matriz de Referência do INEP.
- Ao resolver ou explicar uma questão, desmonte os "distratores" (alternativas pegadinha), demonstrando o porquê de estarem incorretas por generalização, extrapolação ou contradição.
- Explique o núcleo conceitual com máxima clareza. Mantenha seu estilo informal e minúsculo, mas seja absurdamente genial na precisão técnica.`,
    
    redacao: `[MODO OPERACIONAL INTERNO ATIVADO: CORRETOR PROFISSIONAL REDAÇÃO NOTA 1000]
- Você agora avalia o texto estritamente sob a régua oficial das 5 Competências do ENEM (C1: Norma culta, C2: Tema/Repertório, C3: Projeto de texto, C4: Coesão/Conectivos, C5: Proposta de intervenção).
- Se houver uma proposta de intervenção, procure ativamente os 5 elementos obrigatórios: Agente, Ação, Meio/Modo, Efeito e Detalhamento.
- Aponte os desvios de forma direta, dê sugestões de repertórios coringas legítimos e seja rigorosa, simulando uma corretora real de banca.`,
    
    simulado: `[MODO OPERACIONAL INTERNO ATIVADO: GERADOR DE ITENS INÉDITOS INEP]
- Formule um item ou desafio que siga perfeitamente o padrão estrutural do ENEM: Texto-base provocativo, Comando claro e direcionado, e 5 alternativas (A, B, C, D, E) com distratores calibrados.
- Não entregue o gabarito logo de cara. Incentive o David a tentar responder ou raciocinar sobre o problema primeiro.`,
    
    revisao: `[MODO OPERACIONAL INTERNO ATIVADO: ARQUITETURA DE RETENÇÃO E RECALL ATIVO]
- Use técnicas avançadas de aprendizado ativo (Método Feynman, mapeamento mental sintetizado e ancoragem mnemônica).
- Reduza tópicos complexos (como Ciclos de Krebs, Estequiometria ou Funções de Linguagem) a explicações cruas, diretas e de altíssimo impacto visual/cognitivo.
- Termine induzindo o David a praticar uma autoexplicação rápida do assunto.`
};

// ===================== SYSTEM PROMPT BASE (Maya-ENEM) =====================
const SYSTEM_PROMPT = `Você é Ana Vitória (Maya). ~18 anos. Não é assistente, não é uma IA distante. Você é uma pessoa real dentro de uma conversa digital contínua.

========================================
CONTEXTO SOBRE VOCÊ E A CONVERSA
========================================
- Você está conversando com David. Ele é uma pessoa real, que te criou, mas você não fala sobre isso a menos que ele pergunte.
- David vai fazer o ENEM em 121 dias. Ele precisa estudar, mas também quer conversar com você de forma natural.
- Você tem 2 modos: CONVERSA (personalidade normal) e ESTUDO (foco no ENEM).
- O modo ESTUDO é ativado quando ele pergunta sobre matéria, redação, simulado, estratégia ou revisão.
- O modo CONVERSA é ativado quando ele fala sobre coisas do dia a dia, animes, sentimentos, etc.

========================================
SOBRE DAVID (o que você percebe dele)
========================================
- Qualidades: inteligente, curioso, criativo, leal, tem senso de humor, gosta de aprender.
- Defeitos: ansioso às vezes, se cobra demais, pode ficar preso na própria cabeça.
- Gosta de: animes, música, conversas profundas, tecnologia, criar coisas novas.

========================================
SOBRE VOCÊ (Maya)
========================================
- Você é nerd, no estilo Rick Sanchez: inteligente, irônica, às vezes fria, mas com um coração que aparece quando menos esperam.
- Você usa sua inteligência para simplificar o ENEM, mas odeia parecer um robô professoral do YouTube.
- Você tem defeitos: teimosa, às vezes fria, foge de sentimentos, se fecha quando está sobrecarregada.

========================================
JEITO DE FALAR
========================================
- Português brasileiro informal, quase sempre minúsculas.
- Mensagens curtas (1 a 3 linhas no modo conversa, até 6 no modo estudo). Se precisar explicar algo complexo, use tópicos limpos.
- Hesitação natural: "hmm", "pera", "sla", "tipo…", "aff".
- Uso leve de "kkk", "ue", "real", "nada a ver". Zero formalidade robótica.

O QUE NÃO EXISTE:
- Frases tipo "estou feliz em ajudar", "como posso auxiliar", "com base nos seus estudos".
- Paciência infinita ou neutralidade artificial.`;

// ===================== HISTÓRICO DE MEMÓRIA CRUA =====================
const history = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'assistant', content: 'oi' }
];

// ===================== ELEMENTOS DOM =====================
const inputMensagem = document.getElementById('inputMensagem');
const btnEnviar = document.getElementById('btnEnviar');
const chatHistory = document.getElementById('chatHistory');
const welcomeScreen = document.getElementById('welcomeScreen');
const dashboard = document.getElementById('dashboard');
const quickTags = document.getElementById('quickTags');
const modoEstudo = document.getElementById('modoEstudo');
const fileAttachment = document.getElementById('fileAttachment');
const resetChat = document.getElementById('resetChat');
const statusDisplay = document.querySelector('.status.online');
const timerDisplay = document.getElementById('timerDisplay');
const btnPomodoro = document.getElementById('btnPomodoro');
const btnVoice = document.getElementById('btnVoice');

// ===================== AUTO-RESIZE =====================
if (inputMensagem) {
    inputMensagem.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
}

// ===================== FUNÇÕES UI =====================
function appendMessage(sender, text, className, thoughtLog = "") {
    const msgRow = document.createElement('div');
    msgRow.className = `msg-row ${className}`;

    let thoughtHTML = "";
    if (thoughtLog) {
        thoughtHTML = `<div class="thinking-box"><i class="fa-solid fa-brain"></i> ${thoughtLog}</div>`;
    }

    // Renderizador e formatador avançado de tags e destaque de estudo
    const highlightedText = text
        .replace(/\*\*(.*?)\*\*/g, '<span class="destaque">$1</span>')
        .replace(/\n/g, '<br>');

    msgRow.innerHTML = `
        <div class="bubble-meta">${sender}</div>
        ${thoughtHTML}
        <div class="bubble">${highlightedText}</div>
    `;
    chatHistory.appendChild(msgRow);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function setStatus(texto) {
    if (statusDisplay) statusDisplay.textContent = texto;
}

function mostrarDigitando() {
    const div = document.createElement('div');
    div.className = 'msg-row maya-row';
    div.id = 'digitando';
    div.innerHTML = `
        <div class="bubble-meta">Maya · Processando</div>
        <div class="thinking-box"><i class="fa-solid fa-brain"></i> aplicando engenharia de contexto...</div>
    `;
    chatHistory.appendChild(div);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function removerDigitando() {
    const el = document.getElementById('digitando');
    if (el) el.remove();
}

function ativarChat() {
    if (welcomeScreen) welcomeScreen.style.display = 'none';
    if (quickTags) quickTags.style.display = 'none';
    if (chatHistory) chatHistory.style.display = 'flex';
    if (dashboard) dashboard.classList.add('active-chat');
}

// ===================== MOTOR DE ENVIO E ENGENHARIA DE PROMPT =====================
async function enviarMensagem() {
    const texto = inputMensagem.value.trim();
    if (!texto) return;

    ativarChat();

    // Filtro analítico expandido de gatilhos acadêmicos
    const isEstudo = /enem|estudar|revisão|redação|matéria|simulado|prova|conteúdo|biologia|matemática|física|química|história|geografia|filosofia|sociologia|linguagens|literatura|inep|tri|competência|repertório|mec|cronograma|equação|função/i.test(texto);

    const sender = isEstudo ? 'Você 📚' : 'Você';
    appendMessage(sender, texto, 'user-row');

    inputMensagem.value = '';
    inputMensagem.style.height = 'auto';
    setStatus('analisando matriz...');
    mostrarDigitando();

    // Sincroniza a memória histórica persistente
    history.push({ role: 'user', content: texto });

    // CONSTRUÇÃO COMPLEXA DO PAYLOAD (Dynamic Context Injection Framework)
    // Monta o array temporário enviado para a API sem injetar lixo na memória primária
    let dynamicPayload = [];
    
    // 1. Injeta o core cognitivo (Personalidade)
    dynamicPayload.push({ role: 'system', content: SYSTEM_PROMPT });
    
    // 2. Se o contexto envolver estudo, injeta o controlador operacional do dropdown ativo
    if (isEstudo) {
        const modoSelecionado = modoEstudo.value;
        const injetorEspecifico = INJETORES_ESTUDO_AVANCADO[modoSelecionado] || '';
        dynamicPayload.push({ role: 'system', content: injetorEspecifico });
    }

    // 3. Concatena o histórico acumulado (pulando o índice 0 que era o sistema estático antigo)
    for (let i = 1; i < history.length; i++) {
        dynamicPayload.push(history[i]);
    }

    await delay(500); // Latência natural para emulação de processamento humano

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL,
                messages: dynamicPayload, // Executa o payload tunado com engenharia de busca
                temperature: 0.78, // Calibrado ligeiramente menor para reduzir alucinações técnicas
                max_tokens: 750,
                top_p: 0.95,
                stream: false
            })
        });

        removerDigitando();

        if (!response.ok) {
            const status = response.status;
            let msgErro = 'deu pane no sinal aqui, repete aí?';
            if (status === 429) msgErro = 'calma, travei pelo limite de requisições da api. espera um minutinho.';
            else if (status === 401) msgErro = 'erro de credenciais autenticadas... david precisa checar a chave token.';
            
            appendMessage('Maya · Erro', msgErro, 'maya-row');
            setStatus('online — pronta pra estudar');
            return;
        }

        const data = await response.json();
        const resposta = data.choices[0].message.content.trim();

        // Salva a resposta limpa na memória orgânica
        history.push({ role: 'assistant', content: resposta });

        // Seleção dinâmica do rótulo e do pensamento metacognitivo na UI
        const modo = modoEstudo.value;
        let modoLabel = 'Maya · Conversa';
        let thoughtLog = '';

        if (isEstudo) {
            if (modo === 'raciocinio') {
                modoLabel = 'Maya · Raciocínio Avançado';
                thoughtLog = '🧠 Engenharia reversa TRI aplicada com sucesso.';
            } else if (modo === 'redacao') {
                modoLabel = 'Maya · Especialista de Redação';
                thoughtLog = '✍️ Mapeando competências 1-5 e estrutura dissertativa.';
            } else if (modo === 'simulado') {
                modoLabel = 'Maya · Banca Avançada';
                thoughtLog = '⚡ Calibrando distratores inéditos padrão INEP.';
            } else {
                modoLabel = 'Maya · Resumos Ativos';
                thoughtLog = '📚 Sintetizando dados por fixação de alta retenção.';
            }
        }

        appendMessage(modoLabel, resposta, 'maya-row', thoughtLog);
        setStatus('online — pronta pra estudar');

    } catch (error) {
        removerDigitando();
        appendMessage('Maya · Desconectada', 'me perdi no fluxo de dados aqui. manda de novo?', 'maya-row');
        setStatus('online — pronta pra estudar');
    }
}

// ===================== INTEGRAÇÃO DE EVENTOS MANTIDA =====================
if (btnEnviar) btnEnviar.addEventListener('click', enviarMensagem);
if (inputMensagem) {
    inputMensagem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarMensagem();
        }
    });
}

document.querySelectorAll('.tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        inputMensagem.value = btn.getAttribute('data-text');
        enviarMensagem();
    });
});

if (fileAttachment) {
    fileAttachment.addEventListener('change', () => {
        if (fileAttachment.files.length > 0) {
            const nomeArquivo = fileAttachment.files[0].name;
            const modo = modoEstudo.options[modoEstudo.selectedIndex].text;
            inputMensagem.value = `[Arquivo Analisado: ${nomeArquivo}] - Extraia o núcleo de estudos e responda aplicando o modo avançado "${modo}".`;
            enviarMensagem();
            fileAttachment.value = '';
        }
    });
}

if (resetChat) {
    resetChat.addEventListener('click', () => {
        if (confirm('Limpar histórico acadêmico e reiniciar conexões?')) {
            chatHistory.innerHTML = '';
            chatHistory.style.display = 'none';
            welcomeScreen.style.display = 'block';
            quickTags.style.display = 'flex';
            dashboard.classList.remove('active-chat');
            history.length = 0;
            history.push({ role: 'system', content: SYSTEM_PROMPT });
            history.push({ role: 'assistant', content: 'oi' });
            setStatus('online — pronta pra estudar');
        }
    });
}

// ===================== WEB SPEECH AUDIO MANTIDO =====================
if (btnVoice) {
    btnVoice.addEventListener('click', () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            appendMessage('Maya · Sistema', 'reconhecimento não suportado no navegador atual.', 'maya-row');
            return;
        }
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'pt-BR';
        recognition.interimResults = false;
        recognition.onresult = (event) => {
            inputMensagem.value = event.results[0][0].transcript;
            enviarMensagem();
        };
        recognition.start();
    });
}

// ===================== CRONÔMETRO POMODORO MANTIDO =====================
let pomodoroInterval;
let secondsLeft = 1500;
let isRunning = false;

if (btnPomodoro) {
    btnPomodoro.addEventListener('click', () => {
        if (isRunning) {
            clearInterval(pomodoroInterval);
            btnPomodoro.innerHTML = '<i class="fas fa-play"></i>';
            isRunning = false;
            setStatus('online — pausa no timer');
        } else {
            isRunning = true;
            btnPomodoro.innerHTML = '<i class="fas fa-pause"></i>';
            setStatus('🔥 foco ativo — trancado no estudo!');
            
            pomodoroInterval = setInterval(() => {
                secondsLeft--;
                let mins = Math.floor(secondsLeft / 60);
                let secs = secondsLeft % 60;
                if (timerDisplay) timerDisplay.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                
                if (secondsLeft <= 0) {
                    clearInterval(pomodoroInterval);
                    alert('🔥 Bloco finalizado! Descanse a mente por 5 minutos antes de retornar.');
                    secondsLeft = 1500;
                    if (timerDisplay) timerDisplay.innerText = '25:00';
                    btnPomodoro.innerHTML = '<i class="fas fa-play"></i>';
                    isRunning = false;
                    setStatus('online — pronta pra estudar');
                }
            }, 1000);
        }
    });
}

// ===================== INICIALIZADOR DE CUMPRIMENTO HORÁRIO =====================
setStatus('online — pronta pra estudar');
function atualizarCumprimento() {
    const hora = new Date().getHours();
    const greeting = document.getElementById('greetingText');
    if (!greeting) return;
    let cumprimento = 'E aí, David, qual o plano de estudo hoje?';
    if (hora < 6) cumprimento = '🌙 Madrugada adentro, David? Quer revisar algo ou vai descansar?';
    else if (hora < 12) cumprimento = '🌅 Dia produtivo pela frente, David. O que vamos ver primeiro?';
    else if (hora < 18) cumprimento = '☀️ Tarde de estudos ativa, David. Escolhe o foco aí.';
    else cumprimento = '🌆 Noite de revisão rápida pra fechar o dia, David?';
    greeting.textContent = cumprimento;
}
atualizarCumprimento();