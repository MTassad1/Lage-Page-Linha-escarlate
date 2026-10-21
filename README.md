# Linha escarlate

Vitrine de uma marca fictícia de moda de luxo, com alfaiataria e tecidos nobres. Feita com HTML, CSS e JavaScript puros, sem frameworks e sem servidor.

> **Projeto demonstrativo.** A marca é fictícia, nenhuma compra é cobrada e nenhum dado é enviado a servidores. Contas, carrinhos e estoque ficam apenas no navegador de quem usa.

**Site publicado:** https://mtassad1.github.io/Landing-Page-Linha-escarlate/

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Como executar](#como-executar)
- [Como personalizar](#como-personalizar)
- [Como os dados são guardados](#como-os-dados-são-guardados)
- [Acessibilidade e desempenho](#acessibilidade-e-desempenho)
- [Limitações](#limitações)
- [Próximos passos](#próximos-passos)
- [Autor](#autor)

---

## Funcionalidades

**Vitrine**
- Banner de apresentação, seção da marca e rodapé com janelas de informação (Atendimento, Trocas, Políticas).
- Coleção com 8 peças (masculino e feminino) e filtro Todos / Masculino / Feminino.
- Newsletter com validação de e-mail.

**Novidades (edição limitada)**
- Peças com selo "Edição limitada", data de término e contagem regressiva.
- Estoque por peça: o botão vira "Indisponível" quando a data passa ou o estoque acaba.

**Carrinho**
- Janela de tamanho (P, M, G, GG; calças de 38 a 48) e quantidade (mínimo 1, sem máximo).
- Guia de tamanhos, controles +/− e remoção de itens.
- Peças iguais no mesmo tamanho somam a quantidade.
- Aviso rápido ao adicionar e sincronização entre abas do navegador.

**Conta**
- Inscrição e login com e-mail e senha (mínimo de 8 caracteres, senha guardada com hash SHA-256).
- Carrinho salvo por conta; o carrinho de visitante é juntado ao da conta ao entrar.

**Checkout (`checkout.html`)**
- E-mail com confirmação, CPF com máscara e validação dos dígitos.
- Entrega: CEP (preenche a rua pela API ViaCEP), rua, número e complemento.
- Pagamento: cartão de crédito (à vista ou em até 2x sem juros), débito e PIX.
- PIX com QR Code e código "copia e cola" no formato BR Code.
- Cupom de teste, frete simulado e resumo do pedido na confirmação.
- Botão "Voltar à loja".

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura e semântica das páginas |
| CSS3 | Layout, responsividade (grid e flexbox) e variáveis de cor |
| JavaScript (ES6+) | Carrinho, login, filtros, contagem e checkout |
| Web Crypto API | Hash SHA-256 das senhas |
| localStorage | Contas, carrinhos, estoque e newsletter no navegador |
| [ViaCEP](https://viacep.com.br/) | Busca do endereço pelo CEP |
| [qrcodejs](https://cdnjs.com/libraries/qrcodejs) | QR Code do PIX |
| Google Fonts | Playfair Display e Work Sans |

---

## Estrutura do projeto

```
.
├── index.html        # Página principal da loja
├── checkout.html     # Página de pagamento
├── style.css         # Estilos de todo o site
├── comum.js          # Funções compartilhadas (carregado primeiro)
├── script.js         # Lógica da loja
├── checkout.js       # Lógica do checkout
├── README.md
└── img/
    ├── banner.jpg
    ├── marca.jpg
    └── produto1.jpg ... produto8.jpg
```

---

## Como executar

Não há instalação. Basta abrir o projeto de uma destas formas:

1. **Pelo site publicado:** acesse o link do GitHub Pages acima.
2. **Servidor local (recomendado):** na pasta do projeto, rode `python -m http.server 8000` e abra `http://localhost:8000`.
3. **Direto do arquivo:** abra o `index.html` no navegador. O login pode não funcionar, porque o hash de senha exige um endereço seguro (https ou localhost).

QR Code e busca de CEP precisam de conexão com a internet.

---

## Como personalizar

| O que mudar | Onde |
|---|---|
| Nome, preço e categoria de uma peça | Atributos `data-nome`, `data-preco` e `data-categoria` do `<article class="produto">` no `index.html` |
| Data de término de uma peça limitada | `data-fim` (formato `2026-11-30T23:59:59`) |
| Estoque inicial de uma peça limitada | `data-estoque` |
| Tamanhos disponíveis | Função `abrirOpcoes` no `script.js` |
| Medidas do guia de tamanhos | Tabela `#guia-tamanhos` no `index.html` |
| Chave PIX, nome e cidade do recebedor | Topo do `checkout.js` |
| Cupom de desconto | Trecho do cupom no `checkout.js` (código `ESCARLATE10`, 10%) |
| Valores do frete e frete grátis | Função `calcularFrete` no `checkout.js` |
| Cores, fontes e largura | Variáveis `:root` no início do `style.css` |

---

## Como os dados são guardados

Tudo fica no `localStorage`, com o prefixo `linhaescarlate:`.

| Chave | Conteúdo |
|---|---|
| `contas` | E-mails e hash das senhas |
| `sessao` | E-mail de quem está logado |
| `carrinho:<e-mail>` ou `carrinho:visitante` | Itens do carrinho |
| `vendidos` | Quantidade comprada de cada peça (estoque da demonstração) |
| `newsletter` | E-mails inscritos e data |

CPF, endereço e dados de cartão **não** são salvos.

---

## Acessibilidade e desempenho

- Janelas com `role="dialog"`, foco devolvido ao fechar, foco preso dentro delas e fechamento pela tecla Esc.
- Textos alternativos nas imagens e avisos com `aria-live` e `role="alert"`.
- Imagens dos produtos com carregamento sob demanda (`loading="lazy"`).
- Layout responsivo para celular, tablet e computador.
- Tags Open Graph para a prévia do link em redes sociais.

---

## Limitações

Por ser um site estático, este projeto **não** faz:

- cobrança real de cartão ou PIX, nem confirmação automática de pagamento;
- verificação de que o e-mail existe nem recuperação de senha;
- contas ou estoque compartilhados entre aparelhos (tudo é local ao navegador);
- segurança real das contas: quem abrir as ferramentas do navegador consegue ver e alterar os dados.

---

## Próximos passos

- Fotos próprias para as peças de edição limitada.
- Back-end com login real (por exemplo, Firebase ou Supabase).
- Gateway de pagamento (Mercado Pago, Stripe, Pagar.me ou Asaas) com confirmação de PIX por webhook.
- Páginas de produto individuais e histórico de pedidos.
- Conversão das imagens para WebP.

---

## Autor

Criado por **Matheus Thiago Assad**.

- GitHub: [github.com/mtassad1](https://github.com/mtassad1)

---

*Linha escarlate é uma marca fictícia criada para fins de estudo e portfólio.*
