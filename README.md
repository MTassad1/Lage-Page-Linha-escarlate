# Linha Escarlate — Landing Page

Vitrine de e-commerce para uma **marca fictícia de moda de luxo**, focada em alfaiataria e tecidos nobres. O projeto foi criado para praticar front-end com HTML, CSS e JavaScript puros, simulando uma landing page real de varejo premium.

🔗 **Demo:** https://mtassad1.github.io/Landing-Page-Linha-escarlate/

> ⚠️ Projeto demonstrativo. A marca, os produtos, os preços e o Instagram do rodapé são fictícios.

---

## Sobre o projeto

A proposta visual é minimalista e sofisticada: paleta sóbria, muito espaço em branco, fotografia em preto e branco e o nome da marca como único ponto de destaque em vermelho. O texto foi escrito para transmitir o tom de uma marca de luxo ("A elegância permanece", "Feito com intenção. Pensado para durar.").

## Funcionalidades

- **Hero** com chamada principal e dois botões de ação (ver coleção e descobrir a marca)
- **Vitrine de 8 produtos** com categoria, nome e preço
- **Filtro por categoria** (Todos, Masculino, Feminino)
- **Carrinho** com contador no cabeçalho e total estimado
- **Seção "Nossa perspectiva"** apresentando os valores da marca
- **Formulário de newsletter**
- **Rodapé** com atendimento, trocas e políticas
- **Navegação por âncoras** com rolagem entre as seções

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Estrutura | HTML5 semântico |
| Estilo | CSS3 (layout responsivo) |
| Interação | JavaScript (filtro e carrinho) |
| Hospedagem | GitHub Pages |

## Acessibilidade e SEO

- Atributo `alt` descritivo em todas as imagens de produto
- `meta description` e `theme-color` definidos
- `meta viewport` para uso em dispositivos móveis
- Estrutura de títulos hierárquica (`h1`, `h2`, `h3`)

## Estrutura de pastas

```
Landing-Page-Linha-escarlate/
├── index.html
├── style.css
├── script.js
└── img/
    ├── banner.jpg
    ├── marca.jpg
    └── produto1.jpg … produto8.jpg
```

## Como rodar localmente

```bash
# clonar o repositório
git clone https://github.com/mtassad1/Landing-Page-Linha-escarlate.git

# entrar na pasta
cd Landing-Page-Linha-escarlate

# abrir o index.html no navegador
# (ou usar uma extensão como o Live Server no VS Code)
```

Não há dependências nem etapa de build.

## O que aprendi

- Organizar um projeto em arquivos separados (HTML, CSS e JS)
- Construir um layout responsivo com foco em identidade visual
- Manipular o DOM para filtrar produtos e atualizar o carrinho
- Escrever textos alternativos pensando em acessibilidade
- Publicar um site estático no GitHub Pages

## Próximos passos

- [ ] Persistir o carrinho com `localStorage`
- [ ] Criar página de detalhe do produto
- [ ] Simular um fluxo de checkout
- [ ] Converter imagens para WebP e aplicar `loading="lazy"`
- [ ] Atingir 90+ no Lighthouse (performance e acessibilidade)

## Autor

[mtassad1](https://github.com/mtassad1) no GitHub
