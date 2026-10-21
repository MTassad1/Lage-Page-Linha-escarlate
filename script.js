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
   2. CONTA (LOGIN) E CARRINHO
   AVISO: contas e carrinhos ficam no localStorage, ou seja, só neste navegador.
   É uma versão de demonstração; conta de verdade exige um servidor.
   ------------------------------------------------------------------------- */

let sessao = lerJSON("sessao", null);                     // e-mail de quem está logado (ou null)
const chaveCarrinho = () => "carrinho:" + (sessao || "visitante");

// Cada item do carrinho é { nome, preco, tamanho, quantidade }
const carrinho = lerJSON(chaveCarrinho(), []);

const carrinhoJanela = document.getElementById("carrinho-sobreposicao");
const carrinhoItens = document.getElementById("carrinho-itens");
const carrinhoVazio = document.getElementById("carrinho-vazio");
const botaoFecharCarrinho = document.getElementById("fechar-carrinho");

// Aviso rápido que some sozinho (substitui abrir o carrinho a cada compra)
function mostrarAviso(texto) {
  let aviso = document.getElementById("aviso");
  if (!aviso) {
    aviso = document.createElement("div");
    aviso.id = "aviso";
    aviso.className = "aviso";
    aviso.setAttribute("role", "status");
    document.body.append(aviso);
  }
  aviso.textContent = texto;
  aviso.classList.add("aviso-visivel");
  clearTimeout(aviso.temporizador);
  aviso.temporizador = setTimeout(() => aviso.classList.remove("aviso-visivel"), 2800);
}

function criarBotao(texto, rotulo, aoClicar) {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.textContent = texto;
  botao.setAttribute("aria-label", rotulo);
  botao.addEventListener("click", aoClicar);
  return botao;
}

function renderizarCarrinho() {
  gravarJSON(chaveCarrinho(), carrinho);   // salva sempre que muda

  const quantidade = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
  const total = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
  document.getElementById("contador-carrinho").textContent = quantidade;
  document.getElementById("carrinho-total").textContent = formatarPreco(total);
  carrinhoVazio.hidden = carrinho.length > 0;
  document.getElementById("ir-checkout").hidden = carrinho.length === 0;

  carrinhoItens.replaceChildren();
  carrinho.forEach((item, posicao) => {
    const linha = document.createElement("div");
    linha.className = "item-carrinho";

    const detalhes = document.createElement("div");
    const nome = document.createElement("p");
    nome.className = "item-carrinho-nome";
    nome.textContent = item.nome;
    const preco = document.createElement("p");
    preco.className = "item-carrinho-preco";
    preco.textContent = "Tamanho " + item.tamanho + " · " + formatarPreco(item.preco * item.quantidade);
    detalhes.append(nome, preco);

    const mudar = (delta) => {
      item.quantidade += delta;
      if (item.quantidade < 1) carrinho.splice(posicao, 1);
      renderizarCarrinho();
    };
    const controles = document.createElement("div");
    controles.className = "item-controles";
    const qtd = document.createElement("span");
    qtd.textContent = item.quantidade;
    controles.append(
      criarBotao("−", "Diminuir " + item.nome, () => mudar(-1)),
      qtd,
      criarBotao("+", "Aumentar " + item.nome, () => mudar(1)),
      criarBotao("Remover", "Remover " + item.nome, () => { carrinho.splice(posicao, 1); renderizarCarrinho(); })
    );

    linha.append(detalhes, controles);
    carrinhoItens.append(linha);
  });
}

document.getElementById("abrir-carrinho").addEventListener("click", () => abrirJanela(carrinhoJanela, botaoFecharCarrinho));
botaoFecharCarrinho.addEventListener("click", () => fecharJanela(carrinhoJanela));
document.getElementById("carrinho-fundo").addEventListener("click", () => fecharJanela(carrinhoJanela));

// Fecha uma janela centralizada ao clicar no fundo escuro
function fecharAoClicarFora(janela) {
  janela.addEventListener("click", (evento) => { if (evento.target === janela) fecharJanela(janela); });
}

/* --- Janela de tamanho e quantidade --- */

const opcoesJanela = document.getElementById("opcoes-sobreposicao");
const campoQtd = document.getElementById("opcoes-qtd");
const erroOpcoes = document.getElementById("opcoes-erro");
let produtoEscolhido = null;
let tamanhoEscolhido = null;

function abrirOpcoes(produto) {
  produtoEscolhido = produto;
  tamanhoEscolhido = null;
  campoQtd.value = 1;
  erroOpcoes.textContent = "";
  document.getElementById("guia-tamanhos").hidden = true;
  document.getElementById("opcoes-titulo").textContent = produto.dataset.nome;
  document.getElementById("opcoes-preco").textContent = formatarPreco(Number(produto.dataset.preco));

  // Calças usam numeração; as demais peças usam P, M, G, GG
  const tamanhos = produto.dataset.nome.startsWith("Calça") ? ["38", "40", "42", "44", "46", "48"] : ["P", "M", "G", "GG"];
  const caixa = document.getElementById("opcoes-tamanhos");
  caixa.replaceChildren();
  tamanhos.forEach((tam) => {
    const botao = criarBotao(tam, "Tamanho " + tam, () => {
      tamanhoEscolhido = tam;
      caixa.querySelectorAll(".filtro").forEach((b) => b.setAttribute("aria-pressed", String(b === botao)));
    });
    botao.className = "filtro";
    botao.setAttribute("aria-pressed", "false");
    caixa.append(botao);
  });
  abrirJanela(opcoesJanela, document.getElementById("fechar-opcoes"));
}

const guia = document.getElementById("guia-tamanhos");
document.getElementById("abrir-guia").addEventListener("click", (evento) => {
  guia.hidden = !guia.hidden;
  evento.currentTarget.setAttribute("aria-expanded", String(!guia.hidden));
});

document.getElementById("qtd-menos").addEventListener("click", () => { campoQtd.value = Math.max(1, (parseInt(campoQtd.value, 10) || 1) - 1); });
document.getElementById("qtd-mais").addEventListener("click", () => { campoQtd.value = (parseInt(campoQtd.value, 10) || 0) + 1; });
document.getElementById("fechar-opcoes").addEventListener("click", () => fecharJanela(opcoesJanela));
fecharAoClicarFora(opcoesJanela);

document.getElementById("form-opcoes").addEventListener("submit", (evento) => {
  evento.preventDefault();
  const quantidade = Number(campoQtd.value);
  if (!tamanhoEscolhido) { erroOpcoes.textContent = "Escolha um tamanho."; return; }
  if (!Number.isInteger(quantidade) || quantidade < 1) { erroOpcoes.textContent = "A quantidade mínima é 1."; return; }

  const nome = produtoEscolhido.dataset.nome;

  // Peças limitadas têm estoque: não dá para pedir mais do que resta
  if (produtoEscolhido.classList.contains("produto-limitado")) {
    const jaNoCarrinho = carrinho.filter((i) => i.nome === nome).reduce((soma, i) => soma + i.quantidade, 0);
    const sobra = restantes(produtoEscolhido) - jaNoCarrinho;
    if (quantidade > sobra) { erroOpcoes.textContent = sobra > 0 ? "Restam apenas " + sobra + " peça(s) disponíveis." : "Você já tem todas as peças disponíveis no carrinho."; return; }
  }
  const existente = carrinho.find((i) => i.nome === nome && i.tamanho === tamanhoEscolhido);
  if (existente) {
    existente.quantidade += quantidade;   // mesma peça e tamanho: soma
  } else {
    carrinho.push({ nome, preco: Number(produtoEscolhido.dataset.preco), tamanho: tamanhoEscolhido, quantidade });
  }
  renderizarCarrinho();
  fecharJanela(opcoesJanela);
  mostrarAviso(nome + " (" + tamanhoEscolhido + ") adicionado ao carrinho");
});

// Todo botão "Adicionar ao carrinho" abre a janela de opções
document.querySelectorAll(".adicionar").forEach((botao) => {
  botao.addEventListener("click", () => abrirOpcoes(botao.closest(".produto")));
});

/* --- Login e inscrição --- */

const contaJanela = document.getElementById("conta-sobreposicao");
const formConta = document.getElementById("form-conta");
const contaStatus = document.getElementById("conta-status");
const botaoConta = document.getElementById("abrir-conta");
let modoCadastro = false;

// Transforma a senha em um código (SHA-256) para não guardá-la em texto puro
async function gerarHash(email, senha) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(email + ":" + senha));
  return Array.from(new Uint8Array(bytes)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function definirModo(cadastro) {
  modoCadastro = cadastro;
  document.getElementById("conta-titulo").textContent = cadastro ? "Inscreva-se" : "Entrar";
  document.getElementById("conta-enviar").textContent = cadastro ? "Criar conta" : "Entrar";
  document.getElementById("conta-confirmar-rotulo").hidden = !cadastro;
  document.getElementById("conta-senha").autocomplete = cadastro ? "new-password" : "current-password";
  formConta.querySelectorAll("[data-modo]").forEach((b) => b.setAttribute("aria-pressed", String((b.dataset.modo === "cadastro") === cadastro)));
  contaStatus.textContent = "";
}
formConta.querySelectorAll("[data-modo]").forEach((b) => b.addEventListener("click", () => definirModo(b.dataset.modo === "cadastro")));

function atualizarBotaoConta() {
  botaoConta.textContent = sessao ? "Sair" : "Entrar";
  botaoConta.title = sessao ? "Conectado como " + sessao : "";
}

function entrarNaConta(email) {
  // Junta o carrinho de visitante com o carrinho já salvo na conta
  const visitante = lerJSON("carrinho:visitante", []);
  const salvo = lerJSON("carrinho:" + email, []);
  visitante.forEach((v) => {
    const igual = salvo.find((i) => i.nome === v.nome && i.tamanho === v.tamanho);
    if (igual) igual.quantidade += v.quantidade; else salvo.push(v);
  });
  gravarJSON("carrinho:visitante", []);
  sessao = email;
  gravarJSON("sessao", email);
  carrinho.splice(0, carrinho.length, ...salvo);
  atualizarBotaoConta();
  renderizarCarrinho();
}

botaoConta.addEventListener("click", () => {
  if (sessao) {
    // Sair: o carrinho da conta já está salvo; volta o carrinho de visitante
    sessao = null;
    gravarJSON("sessao", null);
    carrinho.splice(0, carrinho.length, ...lerJSON("carrinho:visitante", []));
    atualizarBotaoConta();
    renderizarCarrinho();
  } else {
    definirModo(false);
    abrirJanela(contaJanela, document.getElementById("fechar-conta"));
  }
});
document.getElementById("fechar-conta").addEventListener("click", () => fecharJanela(contaJanela));
fecharAoClicarFora(contaJanela);

formConta.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const campoEmailConta = document.getElementById("conta-email");
  const email = campoEmailConta.value.trim().toLowerCase();
  const senha = document.getElementById("conta-senha").value;

  if (!email || !campoEmailConta.validity.valid) { contaStatus.textContent = "Informe um e-mail válido."; return; }
  if (senha.length < 8) { contaStatus.textContent = "A senha precisa ter pelo menos 8 caracteres."; return; }

  const contas = lerJSON("contas", {});
  try {
    const hash = await gerarHash(email, senha);
    if (modoCadastro) {
      if (senha !== document.getElementById("conta-confirmar").value) { contaStatus.textContent = "As senhas não coincidem."; return; }
      if (contas[email]) { contaStatus.textContent = "Este e-mail já tem conta. Use a aba Entrar."; return; }
      contas[email] = hash;
      gravarJSON("contas", contas);
    } else if (contas[email] !== hash) {
      contaStatus.textContent = "E-mail ou senha incorretos.";
      return;
    }
    formConta.reset();
    entrarNaConta(email);
    fecharJanela(contaJanela);
  } catch (erro) {
    contaStatus.textContent = "Não foi possível concluir. Use um endereço seguro (https).";
  }
});

/* --- Peças limitadas: contagem regressiva e estoque --- */

// Estoque da demonstração = estoque inicial (data-estoque) menos o que já foi "comprado" neste navegador
function restantes(produto) {
  return Math.max(0, Number(produto.dataset.estoque) - (vendidos()[produto.dataset.nome] || 0));
}

function atualizarLimitadas() {
  document.querySelectorAll(".produto-limitado").forEach((produto) => {
    const rotulo = produto.querySelector(".contagem");
    const botao = produto.querySelector(".adicionar");
    const sobra = restantes(produto);
    const restante = new Date(produto.dataset.fim) - Date.now();

    produto.querySelector(".restam").textContent = sobra > 0 ? "restam " + sobra + " peças" : "esgotado";

    if (restante <= 0 || sobra === 0) {
      rotulo.textContent = sobra === 0 ? "Esgotado" : "Encerrado";
      botao.disabled = true;
      botao.textContent = "Indisponível";
      return;
    }
    const dias = Math.floor(restante / 864e5);
    const horas = Math.floor((restante % 864e5) / 36e5);
    const minutos = Math.floor((restante % 36e5) / 6e4);
    rotulo.textContent = "Termina em " + dias + "d " + horas + "h " + minutos + "min";
  });
}
atualizarLimitadas();
setInterval(atualizarLimitadas, 30000);

/* --- Mantém várias abas do navegador sincronizadas (carrinho, login e estoque) --- */
window.addEventListener("storage", (evento) => {
  if (evento.key === CH + "sessao") sessao = lerJSON("sessao", null);
  if (evento.key === CH + "sessao" || evento.key === CH + chaveCarrinho()) {
    carrinho.splice(0, carrinho.length, ...lerJSON(chaveCarrinho(), []));
    atualizarBotaoConta();
    renderizarCarrinho();
  }
  if (evento.key === CH + "vendidos") atualizarLimitadas();
});


/* -------------------------------------------------------------------------
   3. FILTRO DE PRODUTOS (Todos / Masculino / Feminino)
   ------------------------------------------------------------------------- */

function aplicarFiltro(categoria) {
  // Esconde os produtos que não são da categoria escolhida
  document.querySelectorAll(".grade-produtos .produto:not(.produto-limitado)").forEach((produto) => {
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
    "Esta é uma vitrine demonstrativa. Contas (e-mail e senha em formato criptografado), carrinho e newsletter ficam salvos apenas no seu navegador. O checkout é uma simulação: nenhuma cobrança é feita e CPF, endereço e dados de cartão não são armazenados."
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
    document.querySelectorAll(".sobreposicao:not([hidden])").forEach(fecharJanela);
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


/* Mantém o foco do teclado dentro da janela aberta (Tab e Shift+Tab dão a volta) */
document.addEventListener("keydown", (evento) => {
  if (evento.key !== "Tab") return;
  const aberta = document.querySelector(".sobreposicao:not([hidden])");
  if (!aberta) return;
  const focaveis = [...aberta.querySelectorAll("button, input, select, a[href]")].filter((el) => !el.disabled && !el.closest("[hidden]"));
  if (focaveis.length === 0) return;
  const primeiro = focaveis[0];
  const ultimo = focaveis[focaveis.length - 1];
  if (!aberta.contains(document.activeElement)) { evento.preventDefault(); primeiro.focus(); }
  else if (evento.shiftKey && document.activeElement === primeiro) { evento.preventDefault(); ultimo.focus(); }
  else if (!evento.shiftKey && document.activeElement === ultimo) { evento.preventDefault(); primeiro.focus(); }
});


/* -------------------------------------------------------------------------
   6. INÍCIO
   ------------------------------------------------------------------------- */

atualizarBotaoConta();
renderizarCarrinho();   // desenha o carrinho salvo ao abrir a página