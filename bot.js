// Armazena os arquivos de markdown
const posts = [
    'posts/example1.md',
    'posts/exemplo2.md'
];

// Dados processados dos artigos
let articles = [];

// Função para carregar e converter os arquivos Markdown
async function loadArticles() {
    for (let post of posts) {
        const response = await fetch(post);
        const text = await response.text();
        articles.push({ content: text, html: marked(text) });
    }
}

// Função para detectar idioma
function detectLanguage(text) {
    const isEnglish = /^[a-zA-Z0-9\s.,?!]+$/.test(text);
    return isEnglish ? 'en' : 'pt';
}

// Função para processar uma pergunta
function processQuestion(question) {
    const language = detectLanguage(question);
    const keywords = extractKeywords(question, language);  // Extrair palavras-chave da pergunta
    const bestMatch = findBestMatch(keywords);  // Encontrar o artigo mais relevante

    const response = bestMatch ? bestMatch : 
        (language === 'pt' ? "Desculpe, não encontrei nada relacionado." : "Sorry, I couldn't find anything related.");
    
    return response;
}

// Função para extrair palavras-chave simples
function extractKeywords(question, language) {
    const stopWords = language === 'pt' ? ["e", "de", "que", "a", "o", "na", "em", "com"] : ["and", "the", "that", "a", "in", "of"];
    return question
        .toLowerCase()
        .split(" ")
        .filter(word => !stopWords.includes(word))
        .join(" ");
}

// Função para encontrar o artigo mais relevante
function findBestMatch(keywords) {
    const matchedArticles = articles.filter(article => {
        return article.content.toLowerCase().includes(keywords);
    });

    if (matchedArticles.length > 0) {
        // Retorna um resumo do primeiro artigo que coincidir
        return summarizeContent(matchedArticles[0].content, detectLanguage(keywords));
    } else {
        return null;
    }
}

// Função para resumir conteúdo
function summarizeContent(content, language) {
    // Simplesmente retorna as primeiras 3 linhas como resumo (pode ser melhorado)
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    return language === 'pt' 
        ? lines.slice(0, 3).join(' ') 
        : lines.slice(0, 3).join(' ');
}

// Função para enviar mensagem
function sendMessage() {
    const userInput = document.getElementById("userInput").value;
    const messages = document.getElementById("messages");

    // Adicionar mensagem do usuário
    const userMessage = document.createElement("div");
    userMessage.className = "message user";
    userMessage.textContent = userInput;
    messages.appendChild(userMessage);

    // Processar resposta
    const botResponse = processQuestion(userInput);
    const botMessage = document.createElement("div");
    botMessage.className = "message bot";
    botMessage.textContent = botResponse;
    messages.appendChild(botMessage);

    // Limpar input
    document.getElementById("userInput").value = "";

    // Scroll até o final
    messages.scrollTop = messages.scrollHeight;
}

// Carregar artigos ao iniciar
loadArticles();
