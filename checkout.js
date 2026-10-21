/* =========================================================================
   LINHA ESCARLATE — checkout.js
   DEMONSTRAÇÃO: nada é cobrado e nenhum dado (CPF, endereço, cartão) é salvo.
   Para cobrar de verdade é preciso um gateway de pagamento + servidor.
   ========================================================================= */

// TROQUE pela sua chave PIX real para gerar um código válido
const CHAVE_PIX = "pix@linhaescarlate.example";
const NOME_RECEBEDOR = "LINHA ESCARLATE";   // até 25 letras, sem acento
const CIDADE_RECEBEDOR = "SAO PAULO";        // até 15 letras, sem acento

const sessao = lerJSON("sessao", null);
const chaveCarrinho = "carrinho:" + (sessao || "visitante");
const carrinho = lerJSON(chaveCarrinho, []);
const subtotal = carrinho.reduce((soma, i) => soma + i.preco * i.quantidade, 0);
let desconto = 0;      // vem do cupom
let frete = 0;         // vem do CEP (simulado)
let total = subtotal;  // subtotal - desconto + frete
let cupomAplicado = "";

const $ = (id) => document.getElementById(id);
const soNumeros = (v) => v.replace(/\D/g, "");
function mostrar(tela) {
  ["tela-form", "tela-vazio", "tela-pix", "tela-ok"].forEach((t) => { $(t).hidden = t !== tela; });
  window.scrollTo(0, 0);
}

/* --- Resumo --- */
if (carrinho.length === 0) mostrar("tela-vazio");
carrinho.forEach((item) => {
  const linha = document.createElement("div");
  linha.className = "resumo-item";
  const a = document.createElement("span");
  a.textContent = item.quantidade + "× " + item.nome + " (" + item.tamanho + ")";
  const b = document.createElement("span");
  b.textContent = formatarPreco(item.preco * item.quantidade);
  linha.append(a, b);
  $("resumo-itens").append(linha);
});
if (sessao) { $("ck-email").value = sessao; }   // facilita, mas ainda pede a confirmação

/* --- Máscaras --- */
$("ck-cpf").addEventListener("input", (e) => {
  e.target.value = soNumeros(e.target.value).slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
});
$("ck-cep").addEventListener("input", (e) => {
  e.target.value = soNumeros(e.target.value).slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
  if (soNumeros(e.target.value).length === 8) buscarCep(soNumeros(e.target.value));
});
$("ck-cartao").addEventListener("input", (e) => {
  e.target.value = soNumeros(e.target.value).slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");
});
$("ck-validade").addEventListener("input", (e) => {
  e.target.value = soNumeros(e.target.value).slice(0, 4).replace(/(\d{2})(\d)/, "$1/$2");
});

// Preenche a rua automaticamente pelo CEP (API pública ViaCEP; precisa de internet)
async function buscarCep(cep) {
  try {
    const resposta = await fetch("https://viacep.com.br/ws/" + cep + "/json/");
    const dados = await resposta.json();
    if (!dados.erro && dados.logradouro) $("ck-rua").value = dados.logradouro;
  } catch (erro) { /* sem internet: a pessoa digita a rua */ }
}

function cpfValido(cpf) {
  const c = soNumeros(cpf);
  if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
  for (const t of [9, 10]) {
    let soma = 0;
    for (let i = 0; i < t; i++) soma += Number(c[i]) * (t + 1 - i);
    if (((soma * 10) % 11) % 10 !== Number(c[t])) return false;
  }
  return true;
}

/* --- Forma de pagamento --- */
const metodo = () => document.querySelector('input[name="pagamento"]:checked').value;
function montarParcelas() {
  const lista = $("ck-parcelas");
  lista.replaceChildren();
  ["1× de " + formatarPreco(total) + " (à vista)", "2× de " + formatarPreco(total / 2) + " sem juros"].forEach((texto, i) => {
    const op = document.createElement("option");
    op.value = i + 1;
    op.textContent = texto;
    lista.append(op);
  });
}

/* --- Frete (simulado) e cupom --- */
// Frete grátis a partir de R$ 5.000; abaixo disso o valor depende do primeiro dígito do CEP
function calcularFrete(cep) {
  if (cep.length !== 8) return null;
  if (subtotal >= 5000) return 0;
  const regiao = Number(cep[0]);
  return regiao <= 3 ? 29.9 : regiao <= 6 ? 49.9 : 59.9;
}

function atualizarResumo() {
  const f = calcularFrete(soNumeros($("ck-cep").value));
  frete = f ?? 0;
  total = Math.max(0, subtotal - desconto) + frete;
  $("resumo-subtotal").textContent = formatarPreco(subtotal);
  $("linha-desconto").hidden = desconto === 0;
  $("resumo-desconto").textContent = "− " + formatarPreco(desconto);
  $("resumo-frete").textContent = f === null ? "informe o CEP" : f === 0 ? "Grátis" : formatarPreco(f);
  $("resumo-total").textContent = formatarPreco(total);
  montarParcelas();
}
$("ck-cep").addEventListener("input", atualizarResumo);

// Cupom de demonstração: ESCARLATE10 dá 10% de desconto
$("ck-cupom-aplicar").addEventListener("click", () => {
  const codigo = $("ck-cupom").value.trim().toUpperCase();
  if (codigo === "ESCARLATE10") {
    cupomAplicado = codigo;
    desconto = subtotal * 0.1;
    $("cupom-status").textContent = "Cupom aplicado: 10% de desconto.";
  } else {
    cupomAplicado = "";
    desconto = 0;
    $("cupom-status").textContent = codigo ? "Cupom inválido." : "";
  }
  atualizarResumo();
});

function atualizarPagamento() {
  $("bloco-cartao").hidden = metodo() === "pix";
  $("bloco-parcelas").hidden = metodo() !== "credito";
}
document.querySelectorAll('input[name="pagamento"]').forEach((r) => r.addEventListener("change", atualizarPagamento));
atualizarPagamento();
atualizarResumo();

/* --- PIX: código "copia e cola" (BR Code) --- */
function campoPix(id, valor) { return id + String(valor.length).padStart(2, "0") + valor; }
function crc16(texto) {
  let crc = 0xFFFF;
  for (let i = 0; i < texto.length; i++) {
    crc ^= texto.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xFFFF : (crc << 1) & 0xFFFF;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}
function gerarPix(valor, pedido) {
  const corpo =
    campoPix("00", "01") + campoPix("01", "12") +
    campoPix("26", campoPix("00", "br.gov.bcb.pix") + campoPix("01", CHAVE_PIX)) +
    campoPix("52", "0000") + campoPix("53", "986") + campoPix("54", valor.toFixed(2)) +
    campoPix("58", "BR") + campoPix("59", NOME_RECEBEDOR) + campoPix("60", CIDADE_RECEBEDOR) +
    campoPix("62", campoPix("05", pedido)) + "6304";
  return corpo + crc16(corpo);
}

/* --- Finalização --- */
let numeroPedido = "";
let emailPedido = "";

function concluir(titulo) {
  // Estoque da demonstração: registra o que foi comprado (script.js lê isso na loja)
  const baixa = vendidos();
  carrinho.forEach((i) => { baixa[i.nome] = (baixa[i.nome] || 0) + i.quantidade; });
  gravarJSON("vendidos", baixa);

  // Resumo do pedido na tela de confirmação
  const linhas = carrinho.map((i) => i.quantidade + "× " + i.nome + " (" + i.tamanho + ") — " + formatarPreco(i.preco * i.quantidade));
  linhas.push("Frete: " + (frete === 0 ? "grátis" : formatarPreco(frete)));
  if (desconto > 0) linhas.push("Desconto (" + cupomAplicado + "): − " + formatarPreco(desconto));
  linhas.push("Total: " + formatarPreco(total));
  const complemento = $("ck-complemento").value.trim();
  linhas.push("Entrega: " + $("ck-rua").value.trim() + ", " + $("ck-numero").value.trim() + (complemento ? " – " + complemento : "") + " · CEP " + $("ck-cep").value);
  $("ok-resumo").replaceChildren(...linhas.map((texto) => { const p = document.createElement("p"); p.className = "resumo-item"; p.textContent = texto; return p; }));

  try { localStorage.setItem(CH + chaveCarrinho, "[]"); } catch (erro) { /* ignora */ }   // esvazia o carrinho
  $("ok-numero").textContent = "#" + numeroPedido;
  $("ok-titulo").textContent = titulo;
  $("ok-email").textContent = emailPedido;
  mostrar("tela-ok");
}

function validar() {
  const email = $("ck-email").value.trim().toLowerCase();
  if (!$("ck-email").validity.valid || !email) return "Informe um e-mail válido.";
  if (email !== $("ck-email2").value.trim().toLowerCase()) return "Os e-mails não coincidem.";
  if ($("ck-cupom").value.trim() && !cupomAplicado) return "Aplique o cupom ou deixe o campo vazio.";
  if (!cpfValido($("ck-cpf").value)) return "CPF inválido.";
  if (soNumeros($("ck-cep").value).length !== 8) return "Informe um CEP com 8 números.";
  if (!$("ck-rua").value.trim()) return "Informe a rua.";
  if (!$("ck-numero").value.trim()) return "Informe o número da casa.";
  if (metodo() !== "pix") {
    const cartao = soNumeros($("ck-cartao").value);
    if (cartao.length < 13 || cartao.length > 19) return "Número do cartão inválido.";
    const [mes, ano] = $("ck-validade").value.split("/").map(Number);
    const hoje = new Date();
    if (!mes || mes > 12 || !ano || new Date(2000 + ano, mes, 1) <= hoje) return "Validade do cartão inválida.";
    if (!/^\d{3,4}$/.test($("ck-cvv").value)) return "CVV inválido.";
  }
  return "";
}

$("form-checkout").addEventListener("submit", (evento) => {
  evento.preventDefault();
  const erro = validar();
  $("erro-checkout").textContent = erro;
  if (erro) return;

  numeroPedido = "LE" + String(Date.now()).slice(-8);
  emailPedido = $("ck-email").value.trim();
  $("ck-enviar").disabled = true;

  if (metodo() === "pix") {
    const codigo = gerarPix(total, numeroPedido);
    $("pix-codigo").value = codigo;
    $("qr-pix").replaceChildren();
    if (window.QRCode) new QRCode($("qr-pix"), { text: codigo, width: 220, height: 220 });
    else $("pix-status").textContent = "Não foi possível gerar o QR Code. Use o código copia e cola.";
    mostrar("tela-pix");
  } else {
    $("ck-enviar").textContent = "Processando…";
    setTimeout(() => concluir("Pagamento aprovado"), 1500);   // aprovação simulada
  }
});

$("pix-copiar").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText($("pix-codigo").value); $("pix-status").textContent = "Código copiado."; }
  catch (erro) { $("pix-codigo").select(); $("pix-status").textContent = "Selecione e copie o código acima."; }
});

// Conferência SIMULADA. Em loja real, o servidor confirma via webhook/API do banco.
$("pix-verificar").addEventListener("click", () => {
  $("pix-verificar").disabled = true;
  $("pix-status").textContent = "Verificando pagamento…";
  setTimeout(() => concluir("Pagamento PIX confirmado"), 2000);
});
