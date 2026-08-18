# Skills instaladas

Skills copiadas de [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills)
(licença Apache-2.0), commit `be2a406907dbc61b73e6827ded415c96139d13a2`.

Cada pasta contém um `SKILL.md` com frontmatter (`name`, `description`). O Claude Code
carrega automaticamente as skills em `.claude/skills/` deste projeto — só a descrição fica
em contexto; o corpo do `SKILL.md` é lido sob demanda.

## Skills (32)

| Skill | O que faz |
| --- | --- |
| artifacts-builder | Monta artifacts HTML complexos (React, Tailwind, shadcn/ui) |
| brand-guidelines | Aplica cores e tipografia de marca a artifacts |
| canvas-design | Cria arte visual em PNG/PDF (pôsteres, peças gráficas) |
| changelog-generator | Gera changelog voltado ao usuário a partir dos commits |
| competitive-ads-extractor | Extrai e analisa anúncios de concorrentes |
| connect | Conecta o Claude a apps externos via Composio |
| connect-apps | Setup e uso das conexões com 1000+ apps |
| content-research-writer | Escreve conteúdo com pesquisa, citações e revisão por seção |
| developer-growth-analysis | Analisa métricas de crescimento de produto para devs |
| docx | Cria/lê/edita documentos Word |
| domain-name-brainstormer | Sugere nomes de domínio e checa disponibilidade |
| file-organizer | Organiza arquivos e pastas, acha duplicados |
| image-enhancer | Melhora resolução e nitidez de imagens |
| internal-comms | Escreve comunicados internos, newsletters, status reports |
| invoice-organizer | Organiza notas e recibos para contabilidade |
| langsmith-fetch | Busca e analisa traces do LangSmith |
| lead-research-assistant | Pesquisa e qualifica leads |
| mcp-builder | Guia para construir servidores MCP |
| meeting-insights-analyzer | Analisa transcrições de reunião |
| pdf | Lê, extrai, junta e anota PDFs |
| pptx | Cria e edita apresentações PowerPoint |
| raffle-winner-picker | Sorteia ganhadores com aleatoriedade criptográfica |
| skill-creator | Guia para criar novas skills |
| skill-share | Empacota e compartilha skills |
| slack-gif-creator | Cria GIFs animados otimizados para Slack |
| tailored-resume-generator | Adapta currículo a uma vaga específica |
| template-skill | Esqueleto para começar uma skill nova |
| theme-factory | Aplica temas de fonte/cor a slides, docs e páginas |
| twitter-algorithm-optimizer | Otimiza tweets para alcance |
| webapp-testing | Testa web apps locais com Playwright |
| xlsx | Manipula planilhas: fórmulas, gráficos, transformações |
| youtube-downloader | Baixa vídeos do YouTube em vários formatos |

## Não instalado

- **`composio-skills/`** (~800 pastas, 7 MB): catálogo de automações app-a-app do Composio
  (`stripe-automation`, `notion-automation`, ...). Toda skill instalada gasta contexto na
  inicialização, e 800 descrições estourariam a janela de contexto de toda sessão. Se quiser
  alguma automação específica, copie só a pasta dela do repositório de origem.

## Observações

- `youtube-downloader` vem da pasta `video-downloader` no repositório de origem; renomeada
  aqui para bater com o `name:` do frontmatter, exigido pelo Claude Code.
- `docx`, `pdf`, `pptx`, `xlsx`, `canvas-design`, `mcp-builder`, `skill-creator` e
  `template-skill` também existem como skills nativas da Anthropic. As versões do projeto
  têm precedência dentro deste repositório.
- Skills que chamam serviços externos (`connect`, `connect-apps`, `langsmith-fetch`,
  `competitive-ads-extractor`) exigem chave de API própria — nenhuma credencial foi
  gravada aqui.

## Plugin

`.claude/plugins/connect-apps-plugin/` — plugin do Composio para conectar a 1000+ apps.
Uso: `claude --plugin-dir .claude/plugins/connect-apps-plugin` e depois `/connect-apps:setup`.
