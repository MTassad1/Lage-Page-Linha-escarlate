## Novidades da loja (para colar no README)

- **Novidades (edição limitada):** peças com `data-fim` (data de término) e `data-estoque` (quantidade inicial) no `index.html`. Depois da data, ou se o estoque acabar, o botão vira "Indisponível".
- **Tamanho e quantidade:** janela ao clicar em "Adicionar ao carrinho", com guia de tamanhos. Mínimo 1; sem máximo (nas peças limitadas, o máximo é o estoque).
- **Login:** e-mail e senha, salvos no `localStorage` (só no navegador, versão de demonstração). O carrinho fica salvo por conta.
- **Checkout (`checkout.html`):** CPF, entrega (CEP com ViaCEP), cupom `ESCARLATE10`, frete simulado, cartão (crédito até 2x ou débito) e PIX com QR Code.
- **Chave PIX:** trocar `CHAVE_PIX` no topo do `checkout.js`.
- **Arquivos:** `comum.js` (funções compartilhadas, carregado antes dos outros), `script.js` (loja), `checkout.js` (pagamento).
- **Limites:** não há cobrança real, e-mail verificado nem conta em vários aparelhos; isso exige servidor e gateway de pagamento.
