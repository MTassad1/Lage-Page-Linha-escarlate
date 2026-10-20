/* =========================================================================
   LINHA NEGRA — script.js
   O design original trazia JavaScript embutido no HTML. Aqui ele foi:
     - separado em arquivo próprio;
     - adaptado aos novos nomes de classes e ids;
     - simplificado e comentado.
   ========================================================================= */


/* -------------------------------------------------------------------------
   1. FUNÇÕES DE APOIO
   ------------------------------------------------------------------------- */

// Lista (array) que guarda os produtos do carrinho. Cada item é { nome, preco }.
const carrinho = [];

// Transforma 1890 em "R$ 1.890,00" usando o padrão brasileiro.
function formatarPreco(valor) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
}

// Guarda qual elemento estava em foco antes de abrir uma janela,
// para devolver o foco a ele quando a janela fechar (importante para o teclado).
let elementoAnterior = null;

function abrirJanela(janela, botaoFechar) {
  elementoAnterior = document.activeElement;
  janela.hidden = false;                    // mostra a janela
  document.body.style.overflow = "hidden";  // trava a rolagem da página por trás
  botaoFechar.focus();                      // leva o foco para o botão de fechar
}

function fecharJanela(janela) {
  janela.hidden = true;                     // esconde a janela
  document.body.style.overflow = "";        // libera a rolagem de novo
  if (elementoAnterior) {
    elementoAnterior.focus();
  }
}


/* -------------------------------------------------------------------------
   2. CARRINHO
   ------------------------------------------------------------------------- */

const carrinhoJanela = document.getElementById("carrinho-sobreposicao");
const carrinhoItens = document.getElementById("carrinho-itens");
const carrinhoVazio = document.getElementById("carrinho-vazio");
const botaoFecharCarrinho = document.getElementById("fechar-carrinho");

// Redesenha o carrinho inteiro sempre que algo muda (adicionar ou remover)
function renderizarCarrinho() {
  // Contador no botão da barra
  document.getElementById("contador-carrinho").textContent = carrinho.length;

  // Soma dos preços: reduce percorre a lista acumulando o total
  const total = carrinho.reduce((soma, item) => soma + item.preco, 0);
  document.getElementById("carrinho-total").textContent = formatarPreco(total);

  // Mostra "carrinho vazio" só quando não há itens
  carrinhoVazio.hidden = carrinho.length > 0;

  // Limpa a lista e recria uma linha para cada item
  carrinhoItens.replaceChildren();

  carrinho.forEach((item, posicao) => {
    const linha = document.createElement("div");
    linha.className = "item-carrinho";

    const detalhes = document.createElement("div");

    const nome = document.createElement("p");
    nome.className = "item-carrinho-nome";
    nome.textContent = item.nome;   // textContent trata o valor como texto puro (mais seguro que innerHTML)

    const preco = document.createElement("p");
    preco.className = "item-carrinho-preco";
    preco.textContent = formatarPreco(item.preco);

    detalhes.append(nome, preco);

    const remover = document.createElement("button");
    remover.type = "button";
    remover.textContent = "Remover";
    remover.setAttribute("aria-label", "Remover " + item.nome);
    remover.addEventListener("click", () => {
      carrinho.splice(posicao, 1);  // apaga 1 item a partir da posição
      renderizarCarrinho();         // e redesenha
    });

    linha.append(detalhes, remover);
    carrinhoItens.append(linha);
  });
}

// Abrir e fechar o carrinho
document.getElementById("abrir-carrinho").addEventListener("click", () => {
  abrirJanela(carrinhoJanela, botaoFecharCarrinho);
});
botaoFecharCarrinho.addEventListener("click", () => fecharJanela(carrinhoJanela));
document.getElementById("carrinho-fundo").addEventListener("click", () => fecharJanela(carrinhoJanela));

// Botões "Adicionar ao carrinho": um listener para cada botão
document.querySelectorAll(".adicionar").forEach((botao) => {
  botao.addEventListener("click", () => {
    // closest() sobe na árvore do HTML até achar o <article class="produto"> deste botão
    const produto = botao.closest(".produto");

    carrinho.push({
      nome: produto.dataset.nome,           // lê data-nome do HTML
      preco: Number(produto.dataset.preco)  // lê data-preco (vem como texto, então converte para número)
    });

    renderizarCarrinho();
    abrirJanela(carrinhoJanela, botaoFecharCarrinho);
  });
});


/* -------------------------------------------------------------------------
   3. FILTRO DE PRODUTOS (Todos / Masculino / Feminino)
   ------------------------------------------------------------------------- */

function aplicarFiltro(categoria) {
  // Esconde os produtos que não são da categoria escolhida
  document.querySelectorAll(".produto").forEach((produto) => {
    const deveEsconder = categoria !== "todos" && produto.dataset.categoria !== categoria;
    produto.hidden = deveEsconder;
  });

  // Marca visualmente o botão ativo (o CSS lê aria-pressed)
  document.querySelectorAll(".filtro").forEach((botao) => {
    botao.setAttribute("aria-pressed", String(botao.dataset.filtro === categoria));
  });
}

// Qualquer elemento com data-filtro (botões da seção E links do menu) aciona o filtro
document.querySelectorAll("[data-filtro]").forEach((elemento) => {
  elemento.addEventListener("click", () => aplicarFiltro(elemento.dataset.filtro));
});


/* -------------------------------------------------------------------------
   4. JANELAS DE INFORMAÇÃO DO RODAPÉ
   ------------------------------------------------------------------------- */

// Objeto com os textos: chave = valor de data-info no HTML; valor = [título, texto]
const informacoes = {
  atendimento: [
    "Atendimento",
    "Para dúvidas sobre as peças e a experiência Linha escarlate, entre em contato pelo Instagram indicado no rodapé."
  ],
  trocas: [
    "Trocas",
    "Esta vitrine é uma demonstração e não recebe pedidos. Para informações sobre trocas, entre em contato pelo Instagram indicado no rodapé."
  ],
  politicas: [
    "Políticas",
    "Esta página salva somente o e-mail enviado para a newsletter, com a data da inscrição, no seu próprio navegador, e o conteúdo do carrinho demonstrativo, também no seu próprio navegador. O carrinho não realiza compras e não solicita dados de pagamento."
  ]
};

const infoJanela = document.getElementById("info-sobreposicao");
const botaoFecharInfo = document.getElementById("fechar-info");

document.querySelectorAll("[data-info]").forEach((botao) => {
  botao.addEventListener("click", () => {
    const [titulo, texto] = informacoes[botao.dataset.info];  // "desestruturação": separa o par em duas variáveis
    document.getElementById("info-titulo").textContent = titulo;
    document.getElementById("info-texto").textContent = texto;
    abrirJanela(infoJanela, botaoFecharInfo);
  });
});

botaoFecharInfo.addEventListener("click", () => fecharJanela(infoJanela));

// Clicar no fundo escuro (e não dentro da janela) também fecha
infoJanela.addEventListener("click", (evento) => {
  if (evento.target === infoJanela) {
    fecharJanela(infoJanela);
  }
});

// Tecla Esc fecha qualquer janela que esteja aberta
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") {
    if (!carrinhoJanela.hidden) fecharJanela(carrinhoJanela);
    if (!infoJanela.hidden) fecharJanela(infoJanela);
  }
});


/* -------------------------------------------------------------------------
   5. NEWSLETTER
   O original usava "window.dataSdk", um serviço da plataforma onde o design foi
   gerado. Ele não existe no seu projeto, então troquei por localStorage:
   os e-mails ficam salvos só no navegador de quem preencheu. Para receber
   e-mails de verdade, será preciso um servidor ou um serviço de newsletter.
   ------------------------------------------------------------------------- */

const formulario = document.getElementById("form-newsletter");
const campoEmail = document.getElementById("email-newsletter");
const statusNewsletter = document.getElementById("status-newsletter");
const botaoInscrever = document.getElementById("botao-inscrever");

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();   // impede o navegador de recarregar a página ao enviar

  // validity.valid confere se o texto parece um e-mail (por causa de type="email")
  if (!campoEmail.value.trim() || !campoEmail.validity.valid) {
    statusNewsletter.textContent = "Informe um e-mail válido.";
    campoEmail.focus();
    return;   // para aqui; não salva nada
  }

  botaoInscrever.disabled = true;   // evita cliques duplos

  try {
    // Lê a lista já salva (ou começa vazia) e acrescenta o novo e-mail
    const salvos = JSON.parse(localStorage.getItem("linhaescarlate:newsletter") || "[]");
    salvos.push({ email: campoEmail.value.trim(), inscritoEm: new Date().toISOString() });
    localStorage.setItem("linhaescarlate:newsletter", JSON.stringify(salvos));

    formulario.reset();   // limpa o campo
    statusNewsletter.textContent = "Inscrição realizada. Obrigado por acompanhar a Linha escarlate.";
  } catch (erro) {
    // O navegador pode bloquear o armazenamento (ex.: modo anônimo em alguns casos)
    statusNewsletter.textContent = "Não foi possível concluir a inscrição. Tente novamente.";
  } finally {
    botaoInscrever.disabled = false;   // roda sempre, com sucesso ou erro
  }
});


/* -------------------------------------------------------------------------
   6. INÍCIO
   ------------------------------------------------------------------------- */

renderizarCarrinho();   // desenha o carrinho vazio ao abrir a página