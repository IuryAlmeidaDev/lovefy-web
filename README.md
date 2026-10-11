# 💖 Lovefy

[![Turborepo](https://img.shields.io/badge/Monorepo-Turborepo-EF4444?style=for-the-badge&logo=turborepo)](https://turbo.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/Package%20Manager-pnpm-F69220?style=for-the-badge&logo=pnpm)](https://pnpm.io/)

Plataforma web para criação e compartilhamento de páginas românticas interativas e personalizadas para casais.

---

## 📌 Sobre o Projeto

O **Lovefy** permite criar declarações digitais memoráveis com fotos, contadores de tempo de relacionamento, trilha sonora personalizada e cartas digitais responsivas com links compartilháveis.

Construído sob a arquitetura de **Monorepo com Turborepo**, garantindo isolamento de pacotes compartilhados (UI, configurações, utils) e compilação em alta velocidade.

## 🚀 Funcionalidades

- ⏱️ **Contador de Relacionamento:** Cálculo exato de anos, meses, dias, horas e segundos juntos.
- 🎵 **Player Multimídia Integrado:** Reprodução da música marcante do casal.
- 🖼️ **Galeria de Fotos Interativa:** Carrossel dinâmico com momentos especiais.
- 💌 **Cartas Personalizadas:** Geração de página web única pronta para compartilhamento via link ou QR Code.

## 🛠️ Estrutura do Monorepo

```
lovefy/
├── apps/              # Aplicações (Web client, Editor)
├── packages/          # Pacotes compartilhados (UI, Configs, Utils)
├── turbo.json         # Configuração de pipelines do Turborepo
└── package.json
```

## ⚙️ Como Executar Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/IuryAlmeidaDev/lovefy-web.git
cd lovefy-web

# 2. Instale dependências usando pnpm
pnpm install

# 3. Execute o ambiente de desenvolvimento
pnpm dev
```

---

## 👤 Autor

Desenvolvido por **[Iury Almeida](https://github.com/IuryAlmeidaDev)**.
