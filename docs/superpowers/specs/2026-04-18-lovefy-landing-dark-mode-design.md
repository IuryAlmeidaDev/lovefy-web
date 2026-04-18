# Lovefy Design Spec - Landing de Alto Impacto + Dark Mode Global

## Contexto

Este documento define a evolucao visual e funcional do app web do Lovefy para:

1. reforcar conversao na home com foco em resultados prontos;
2. manter o fluxo atual por rotas (sem migrar para SPA completa);
3. adicionar dark mode global com toggle no topo e persistencia de preferencia.

Decisoes aprovadas:

- Abordagem: `Landing forte + fluxo atual` (opcao B).
- Tema padrao: `sempre escuro`.
- Toggle no topo: `simples com icone`.
- Home focada em: `resultados prontos`.

## Objetivos

- Aumentar clareza de valor e taxa de clique para `/criar`.
- Melhorar percepcao de qualidade visual com identidade intencional.
- Garantir consistencia de tema em todas as paginas.

## Fora de Escopo

- Reescrever o fluxo principal como SPA unica.
- Alterar logica de checkout/pagamento.
- Refatorar profundamente componentes sem impacto direto no objetivo.

## Arquitetura de Alto Nivel

### Estrategia de rotas

Manter a estrutura existente no App Router:

- `/` (home/landing)
- `/criar`
- `/checkout`
- `/sucesso`
- `/s/[slug]`

Nao havera migracao para SPA total neste ciclo.

### Tema global

Implementar um provider global de tema no layout raiz:

- estado global: `dark | light`;
- tema inicial: `dark`;
- persistencia em `localStorage` com chave dedicada (ex.: `lovefy-theme`);
- aplicacao da classe de tema no elemento `html` para refletir em todas as rotas;
- sincronizacao imediata ao alternar no toggle.

## Experiencia da Landing (Home)

### Header global

- Logo/branding;
- CTA principal para `/criar`;
- toggle de tema com icones (sol/lua) usando biblioteca com licenca permissiva para uso comercial (MIT), como `lucide-react`.

### Hero

- titulo emocional direto;
- subtitulo curto orientado a beneficio;
- CTA primario (`Criar minha pagina`) e secundario (`Ver exemplos`).

### Secao principal: resultados prontos

- galeria de cards com previews de paginas finalizadas;
- variacao de estilos (ex.: classico, moderno, poetico);
- CTA por card (`Quero esse estilo`) apontando para `/criar` com pre-selecao opcional de estilo via query param.

### Secao de prova de valor

Bloco curto com 3-4 pontos objetivos:

- rapido para montar;
- personalizacao com mensagem/fotos/musica;
- facil de compartilhar;
- formato que gera efeito emocional.

### Responsividade e motion

- mobile-first com hierarquia clara e CTAs visiveis;
- desktop com grid visual mais expressivo;
- animacoes leves de entrada (fade/slide), sem excesso.

## Fluxo de Dados e Estado

### ThemeProvider

Responsabilidades:

- ler preferencia salva no client;
- aplicar fallback para `dark` quando nao houver preferencia;
- expor `theme` e `toggleTheme` via contexto;
- persistir alteracoes.

### ThemeToggle

Responsabilidades:

- acionar alternancia global;
- refletir estado atual pelo icone;
- manter acessibilidade com `aria-label` descritivo.

## Acessibilidade

- toggle operavel por teclado;
- foco visivel;
- contraste adequado em dark e light;
- textos e CTAs com hierarquia legivel em mobile e desktop.

## Tratamento de Erros e Fallbacks

- se `localStorage` nao estiver disponivel, manter funcionamento com tema `dark`;
- evitar flash visual indevido de tema na carga inicial;
- em erro de leitura/escrita de preferencia, nao interromper navegacao.

## Plano de Testes

### Testes manuais essenciais

1. alternar tema no header em cada rota principal;
2. recarregar pagina e validar persistencia;
3. abrir nova aba e confirmar tema mantido;
4. validar home em viewport mobile e desktop;
5. confirmar legibilidade/contraste dos elementos criticos.

### Testes automatizados (opcional neste ciclo)

- testes unitarios do provider para leitura/escrita da preferencia;
- teste de render do toggle conforme estado do tema.

## Criterios de Aceite

- home redesenhada com foco em resultados prontos e CTA claro para `/criar`;
- toggle de tema presente no topo global;
- tema padrao inicial escuro;
- alternancia dark/light funcionando em todas as paginas;
- preferencia persistida no navegador;
- nenhuma quebra do fluxo atual de criacao, checkout e sucesso.

## Riscos e Mitigacoes

- risco: inconsistencias visuais em componentes antigos no modo light.
  - mitigacao: checklist rapido de contraste e ajustes pontuais de tokens/classes.
- risco: flash de tema durante hidratacao.
  - mitigacao: aplicar classe inicial de tema no layout de forma antecipada.

## Entregavel deste ciclo

- atualizacao visual da landing com secao de resultados prontos;
- infraestrutura de tema global com toggle e persistencia;
- manutencao da arquitetura atual por rotas.
