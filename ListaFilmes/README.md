# Lista de Filmes

Site para descobrir filmes recomendados, ver detalhes completos (sinopse, elenco, trailer) e montar uma lista pessoal de "filmes para assistir". Todos os dados vêm da API do [The Movie Database (TMDB)](https://www.themoviedb.org/) e a interface está em português do Brasil.

## Recursos

- **Home** com as seções Populares, Mais bem avaliados e Em cartaz.
- **Detalhes** do filme em `/filme/:id`: backdrop, nota, duração, gêneros, orçamento e receita, elenco e trailer.
- **Busca por título** no header, com resultados em `/busca?q=termo` e botão "Carregar mais".
- **Favoritos** em `/favoritos`, com filtro Todos / Para assistir / Assistidos e marcação de filmes assistidos. Os dados ficam no `localStorage`.

## Stack

React 19 + Vite, JavaScript, `react-router-dom` v7, CSS Modules e `fetch` nativo. Estado dos favoritos com React Context.

## Instalação

```bash
npm install
```

(A única dependência além do template é o roteador: `npm install react-router-dom@7`.)

## Configuração do `.env`

1. Crie uma conta em [themoviedb.org](https://www.themoviedb.org/) e gere o **Token de Acesso de Leitura da API (v4)** em *Configurações → API*.
2. Copie o arquivo de exemplo e preencha o token:

```bash
cp .env.example .env
```

```
VITE_TMDB_TOKEN=seu_token_aqui
```

3. Reinicie o servidor de desenvolvimento após alterar o `.env`. Sem o token, o site mostra uma mensagem de configuração.

O `.env` está no `.gitignore` e nunca deve ser enviado ao repositório. Como o Vite embute variáveis `VITE_*` no código do navegador, o token fica visível para quem usar o site: para publicar, use um token próprio do projeto ou um proxy.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção em `dist/` |
| `npm run preview` | Serve o build localmente |
| `npm run lint` | Executa o oxlint |

## Estrutura

```
src/
├── components/   Header, SearchBar, MovieCard, MovieList, FavoriteButton,
│                 Loader, ErrorMessage, Footer, SafeImage
├── pages/        Home, MovieDetails, Search, Favorites, NotFound
├── services/     tmdb.js (toda a comunicação com a API)
├── hooks/        useFetch.js
├── context/      FavoritesContext.jsx
└── utils/        formatters.js
```

## Decisões de projeto

- Componente extra `SafeImage`: concentra o placeholder (ícone + título) usado por pôsteres, backdrops e fotos do elenco, evitando repetir a lógica de `onError`.
- O `index.css` também define as classes globais `.btn` (botão azul compartilhado) e `.sr-only`, além das variáveis de cor.
- O card é clicável por um link com `::after` cobrindo a área toda, para que o botão de favorito não fique aninhado dentro de um `<a>`.
- O trailer é escolhido entre vídeos do YouTube do tipo "Trailer", em português ou, na falta, em inglês; fora isso, a seção não aparece.
- Sem o token configurado, o App substitui as rotas por uma mensagem de configuração.
- Lint com oxlint, que é o linter já configurado pelo template do Vite.

## Créditos

Este produto usa a API do TMDB, mas não é endossado ou certificado pelo TMDB.
