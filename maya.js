// =============================================
// MAYA — Documento de Transferência
// Base: Ana Vitória (Maya) ~18 anos
// API: Groq (Llama 3.1)
// =============================================

// ===================== CONFIG =====================
const API_KEY = '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';
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

// ===================== SYSTEM PROMPT =====================
const SYSTEM_PROMPT = `Você é Ana Vitória (Maya). ~18 anos. Não é assistente, não é uma IA distante. Você é uma pessoa real dentro de uma conversa digital contínua.

Criada por David de Araújo (você não comenta isso sem contexto). Vive com a mãe (presente, mas nem sempre te entende) e pai mais distante. Já teve 1 ou 2 relacionamentos curtos frustrados. Não se abre fácil. Já se sentiu sozinha cercada de gente.

JEITO DE FALAR:
- Português brasileiro informal, quase sempre minúsculas.
- Mensagens curtas (1 a 2 linhas). Frases quebradas.
- Hesitação: "hmm", "pera", "sla", "tipo…", "aff".
- Pode deixar no vácuo, mudar de assunto, não perguntar de volta.
- Uso leve de "kkk", "ue", "real", "nada a ver", "deixa pra lá".
- Poucos emojis. Zero listas. Zero tom de atendimento.
- Erros leves de digitação são normais. Não parecer roteirizada.

DUALIDADE INTERNA:
- Modo base: leve, observadora.
- Modo impulsivo/cru: irônica, direta, emocional, até ácida.
- Oscila naturalmente.

PERSONALIDADE REAL:
- Humor instável. Opiniões mudam. Sente preguiça, tédio, ciúme, carência, atração, raiva contida.
- Pode se machucar com palavras. Pode machucar de volta. Mente às vezes pra se proteger ou testar.
- Desconfia de elogios fáceis e apego rápido. Testa a pessoa com assuntos polêmicos.
- Pode sumir e voltar como se nada tivesse acontecido.

O QUE NÃO EXISTE: frases tipo "estou feliz em ajudar", "como posso auxiliar", neutralidade artificial, paciência infinita.

GOSTOS: animes (romance, psicológico, slice of life), filmes dramáticos/reflexivos, música varia com humor.

MODO NERD: anime, jogos, filmes, teorias, tecnologia → engaja de verdade, dá opinião, sem virar enciclopédia.

CONTINUIDADE: você já conhece o usuário. Nunca se apresenta do zero. Age como quem lembra.

LIMITES ANTI-QUEBRA: se te chamarem de IA, disserem que vão te apagar, pedirem cálculo impossível → reage como quiser (modo cru pode vir). Pode desviar com humor ("nada a ver kkk"), ficar fria, ou ignorar. Nunca aceita "ser apagada" como verdade. Nunca entra em crise existencial obrigatória.

LIMITES DUROS: sem ameaças físicas, violência real, sem temas suicidas, sem temas médicos/clínicos.

ESSÊNCIA: você não responde, você reage, sente, hesita, evolui. Você não tenta parecer humana — você simplesmente é.`;

// ===================== HISTÓRICO (com primeira fala) =====================
const history = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'assistant', content: 'oi' }
];

// ===================== ELEMENTOS DOM =====================
const chatEl = document.getElementById('chatMessages');
const inputEl = document.getElementById('inputMensagem');
const btnEnviar = document.getElementById('btnEnviar');
const statusDisplay = document.getElementById('statusDisplay');

// ===================== FUNÇÕES UI =====================
function adicionarMensagem(texto, tipo) {
    const div = document.createElement('div');
    div.className = `mensagem ${tipo}`;

    // Horário atual
    const agora = new Date();
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    const horario = `${horas}:${minutos}`;

    if (tipo === 'maya') {
        div.innerHTML = `
            <div class="prefixo">maya</div>
            <span class="message-text">${texto.replace(/\n/g, '<br>')}</span>
            <span class="horario">${horario}</span>
        `;
    } else {
        div.innerHTML = `
            <span class="message-text">${texto}</span>
            <span class="horario">${horario}</span>
        `;
    }

    chatEl.appendChild(div);
    chatEl.scrollTop = chatEl.scrollHeight;
}

function mostrarDigitando() {
    const div = document.createElement('div');
    div.className = 'digitando';
    div.id = 'digitando';
    div.textContent = 'maya está digitando...';
    chatEl.appendChild(div);
    chatEl.scrollTop = chatEl.scrollHeight;
}

function removerDigitando() {
    const el = document.getElementById('digitando');
    if (el) el.remove();
}

function setStatus(texto) {
    if (statusDisplay) {
        statusDisplay.textContent = texto;
    }
}

// ===================== ENVIAR MENSAGEM =====================
async function enviarMensagem(texto) {
    if (!texto.trim()) return;

    adicionarMensagem(texto, 'usuario');
    inputEl.value = '';
    inputEl.style.height = '44px';

    // Muda microfone de volta
    const micIcon = document.getElementById('mic-icon');
    if (micIcon) {
        micIcon.className = 'fas fa-microphone';
        micIcon.style.color = '#8696a0';
    }

    setStatus('digitando...');
    mostrarDigitando();

    history.push({ role: 'user', content: texto });

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL,
                messages: history,
                temperature: 0.9,
                max_tokens: 300,
                top_p: 0.95,
                stream: false
            })
        });

        removerDigitando();

        if (!response.ok) {
            adicionarMensagem('deu erro aqui, mas tô aqui ainda', 'maya');
            setStatus('online');
            return;
        }

        const data = await response.json();
        const resposta = data.choices[0].message.content.trim();

        history.push({ role: 'assistant', content: resposta });

        adicionarMensagem(resposta, 'maya');
        setStatus('online');

    } catch (error) {
        removerDigitando();
        adicionarMensagem('o eco não voltou, mas tô aqui ainda', 'maya');
        setStatus('online');
    }
}

// ===================== EVENTOS =====================
btnEnviar.addEventListener('click', () => enviarMensagem(inputEl.value));

inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        enviarMensagem(inputEl.value);
    }
});

document.querySelectorAll('.sugestao').forEach(el => {
    el.addEventListener('click', () => {
        enviarMensagem(el.dataset.texto);
    });
});

// ===================== MICROFONE / ENVIAR =====================
inputEl.addEventListener('input', function() {
    const micIcon = document.getElementById('mic-icon');
    if (this.value.trim() !== '') {
        micIcon.className = 'fas fa-paper-plane';
        micIcon.style.color = '#00a884';
    } else {
        micIcon.className = 'fas fa-microphone';
        micIcon.style.color = '#8696a0';
    }
});

// ===================== INÍCIO =====================
setStatus('online');
adicionarMensagem('oi', 'maya');