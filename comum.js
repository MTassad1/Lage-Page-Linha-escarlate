/* =========================================================================
   LINHA ESCARLATE — comum.js
   Funções usadas pelo script.js (loja) e pelo checkout.js (pagamento).
   Precisa ser carregado ANTES dos outros dois.
   ========================================================================= */

const CH = "linhaescarlate:";   // prefixo das chaves salvas no localStorage

function lerJSON(chave, padrao) {
  try { return JSON.parse(localStorage.getItem(CH + chave)) ?? padrao; } catch (erro) { return padrao; }
}
function gravarJSON(chave, valor) {
  try { localStorage.setItem(CH + chave, JSON.stringify(valor)); } catch (erro) { /* armazenamento bloqueado */ }
}

// Transforma 1890 em "R$ 1.890,00"
function formatarPreco(valor) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
}

// Quantas unidades de cada peça já foram "vendidas" neste navegador (estoque da demonstração)
const vendidos = () => lerJSON("vendidos", {});
