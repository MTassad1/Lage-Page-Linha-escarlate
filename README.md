# Linha Escarlate

> Landing page de e-commerce fictício de uma marca de roupas de luxo. *Essencial, por escolha.*

🔗 **Site ao vivo:** https://mtassad1.github.io/Lage-Page-Linha-escarlate/

<!-- Depois de tirar uma captura de tela do site, salve em docs/ e descomente a linha abaixo -->
<!-- ![Captura de tela do site](docs/screenshot.png) -->

---

## 📖 Sobre o projeto

A **Linha Escarlate** é uma marca fictícia de roupas de alfaiataria e tecidos de luxo, pensada para um público de alto poder aquisitivo. O site apresenta a marca, mostra uma vitrine de produtos e simula a experiência de compra (filtros, carrinho e newsletter).

O projeto foi criado **como exercício de estudo de desenvolvimento web**, para praticar HTML, CSS e JavaScript na construção de uma página completa, com identidade visual própria e foco em design minimalista.

> ⚠️ Projeto **fictício**: marca, produtos e preços não existem de verdade. O carrinho é uma demonstração, não processa compras e não pede dados de pagamento.

---

## ✨ Funcionalidades

- **Banner principal** com foto em preto e branco e botões de ação
- **Vitrine com 8 produtos**, gerada em HTML com os dados (nome, preço e categoria) guardados em atributos `data-*`
- **Filtro por categoria** (Todos, Masculino, Feminino), acionado pelos botões da seção e também pelo menu
- **Carrinho lateral** com controle de quantidade (+ / −), remoção de itens, contador no cabeçalho, total em reais (`Intl.NumberFormat`) e **salvo no navegador** (`localStorage`), então não se perde ao recarregar
- **Janelas de informação** no rodapé (Atendimento, Trocas, Políticas), com fechamento por botão, clique no fundo ou tecla `Esc`
- **Newsletter** com validação do e-mail e mensagens de sucesso e erro (o e-mail é salvo apenas no navegador, via `localStorage`)
- **Seção "Nossa perspectiva"** apresentando os valores da marca
- **Layout responsivo** para desktop, tablet e celular
- **Acessibilidade:** foco visível, `aria-label`, `aria-pressed` nos filtros, `role="dialog"` nas janelas, fundo `inert` com a janela aberta (o Tab não escapa) e respeito a `prefers-reduced-motion`
- **SEO e compartilhamento:** `meta description`, favicon e tags Open Graph; imagens abaixo da dobra com `loading="lazy"`

---

## 🎨 Identidade visual

- **Estilo:** minimalista, elegante e atemporal, com muito espaço em branco
- **Paleta:** base neutra (preto `#171717`, papel `#faf9f7` e cinzas). O vermelho escarlate fica reservado ao nome da marca
- **Tipografia:** *Playfair Display* nos títulos e *Work Sans* no texto (Google Fonts)
- **Fotografias:** preto e branco, com foco em tecidos, alfaiataria e detalhes
- **Tom de voz:** discreto e sofisticado (ex.: *"O luxo está naquilo que se percebe de perto."*)

---

## 🛠️ Tecnologias utilizadas

| Tecnologia | Uso |
|---|---|
| **HTML5** | Estrutura semântica (`header`, `nav`, `main`, `section`, `article`, `footer`) |
| **CSS3** | Variáveis, Flexbox, Grid, `clamp()`, `@media` e `aspect-ratio` |
| **JavaScript (puro)** | Carrinho, filtro, janelas e newsletter, sem bibliotecas |
| **Google Fonts** | Playfair Display e Work Sans |
| **GitHub Pages** | Hospedagem do site |

---

## 📁 Estrutura de pastas

```
Lage-Page-Linha-escarlate/
├── index.html      # estrutura e conteúdo da página
├── style.css       # estilos, organizados em 10 seções comentadas
├── script.js       # carrinho, filtro, janelas e newsletter
├── img/
│   ├── banner.jpg
│   ├── marca.jpg
│   └── produto1.jpg ... produto8.jpg
└── README.md
```

---

## 🧠 Como o código funciona

- **Produtos:** cada `<article class="produto">` guarda `data-nome`, `data-preco` e `data-categoria`. O JavaScript lê esses atributos ao adicionar ao carrinho e ao filtrar.
- **Carrinho:** um array (`carrinho`) guarda `{ nome, preco, quantidade }`. A função `renderizarCarrinho()` redesenha a lista, o contador e o total sempre que algo muda e salva o resultado no `localStorage`. Ao carregar a página, os dados salvos são lidos e validados (`itemValido()`).
- **Filtro:** `aplicarFiltro(categoria)` esconde os produtos com o atributo `hidden` e atualiza `aria-pressed` nos botões (o CSS usa isso para destacar o filtro ativo).
- **Janelas:** `abrirJanela()` e `fecharJanela()` travam a rolagem do fundo, marcam `header`, `main` e `footer` como `inert` e devolvem o foco ao elemento que abriu a janela.
- **Newsletter:** valida o e-mail, salva em `localStorage` e mostra o status em uma região `role="status"`.

---

## 🚀 Como rodar o projeto localmente

1. **Clone o repositório**
   ```bash
   git clone https://github.com/mtassad1/Lage-Page-Linha-escarlate.git
   ```
2. **Entre na pasta**
   ```bash
   cd Lage-Page-Linha-escarlate
   ```
3. **Abra o `index.html`** no navegador (duplo clique) ou use a extensão **Live Server** do VS Code.

Não é preciso instalar nada: o projeto usa apenas HTML, CSS e JavaScript puros.

---

## 📚 O que aprendi

<!-- Vá preenchendo conforme avança. Exemplos para começar: -->

- Estruturar uma página completa com HTML semântico
- Criar layouts responsivos com Flexbox, Grid e `clamp()`
- Manipular o DOM com JavaScript (filtro, carrinho e janelas)
- Usar atributos `data-*` para ligar o HTML ao JavaScript
- Pensar em acessibilidade (teclado, foco, `aria-*`)
- Publicar um site com GitHub Pages
- A importância de revisar detalhes (título, links, textos alternativos) antes de publicar

---

## 🧭 Roadmap (próximos passos)

- [x] Estrutura base da página
- [x] Vitrine de produtos com filtro
- [x] Carrinho com adição e remoção de itens
- [x] Janelas de informação e newsletter com validação
- [x] Layout responsivo
- [x] Corrigir `data-categoria="Masculino"` do produto 1 (o filtro não o encontrava)
- [x] Corrigir o link do menu "Coleções" (`#coleções` → `#colecoes`) e padronizar `#contacto` → `#contato`
- [ ] Conferir se os `alt` dos produtos 1 e 5 a 8 (escritos a partir do nome da peça) descrevem as fotos reais
- [x] Salvar o carrinho com `localStorage`
- [x] Controle de quantidade no carrinho (em vez de linhas repetidas)
- [x] Prender o foco dentro das janelas abertas (fundo `inert`)
- [x] Melhorar o contraste do cinza `--cinza-medio` (agora `#6b6b6b`)
- [x] Adicionar `meta description`, favicon e Open Graph
- [ ] Converter e comprimir as imagens (WebP) — `loading="lazy"` já aplicado
- [ ] Rodar o Lighthouse e buscar 90+ em todas as categorias
- [ ] Página de detalhe do produto (tamanhos e descrição)

---

## 📝 Histórico de versões

| Versão | Data | Mudanças |
|---|---|---|
| 1.0 | Outubro/2026 | Primeira versão publicada: banner, vitrine, filtro, carrinho, janelas e newsletter |
| 1.1 | Outubro/2026 | Correção do filtro e dos links do menu; carrinho com quantidade e persistência; fundo `inert` nas janelas; meta tags, favicon e carregamento preguiçoso de imagens |

<!-- Adicione uma linha nova a cada atualização importante -->

---

## 👤 Autor

**mtassad1**
GitHub: [@mtassad1](https://github.com/mtassad1)

---

## 📄 Licença

Projeto de estudo, sem fins comerciais. As imagens são ilustrativas.
