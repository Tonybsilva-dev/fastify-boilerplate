<div align="center">

# Fastify Boilerplate - Backend Node.js Production-Ready

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=for-the-badge)
![Fastify](https://img.shields.io/badge/Fastify-4.x-green?style=for-the-badge&logo=fastify)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20+-green?style=for-the-badge&logo=node.js)

**Boilerplate completo para APIs Node.js com Fastify, DDD e RBAC** 🇧🇷

[Documentação](src/docs/server-with-fastify.md) • [PRD](src/docs/boilerplate.txt) • [Testes](src/docs/tests-qa.md)

</div>

---

## 📖 Sobre o Projeto

### 🎯 O Desafio

Equipes de desenvolvimento frequentemente perdem tempo recriando a mesma infraestrutura básica para novos backends: configuração de servidor, autenticação, RBAC, testes, lint, documentação e CI/CD. Isso gera inconsistência entre projetos, maior risco de bugs em produção e dificuldade de manutenção.

### 💡 A Solução

Um **boilerplate completo e production-ready** que atua em múltiplas frentes:

1. **Arquitetura DDD**: Separação clara entre domínio, aplicação e infraestrutura
2. **Autenticação & Autorização**: JWT + RBAC com CASL pronto para uso
3. **Qualidade de Código**: Pipeline completo de QA com lint, testes e type-check
4. **Documentação**: Swagger/OpenAPI integrado
5. **Testes**: Vitest configurado com coverage e padrão Factory
6. **CI/CD**: GitHub Actions para QA e análise de qualidade

### 💰 Valor do Projeto

**Boilerplate Open Source** - Template reutilizável para acelerar o desenvolvimento de backends Node.js, garantindo consistência, qualidade e boas práticas desde o início.

---

## ✨ Funcionalidades Principais

### 🏗️ Arquitetura e Estrutura

- ✅ **DDD Simplificado**: Organização em camadas (domain, application, infra, app/http)
- ✅ **TypeScript Strict**: Configuração rigorosa para type safety
- ✅ **Estrutura Modular**: Separação clara de responsabilidades
- ✅ **Value Objects**: Encapsulamento de lógica de domínio (ex: Password)
- ✅ **Repository Pattern**: Abstração de persistência para testes isolados

### 🔐 Autenticação e Autorização

- ✅ **JWT Authentication**: Autenticação baseada em tokens
- ✅ **RBAC com CASL**: Controle de acesso baseado em roles
- ✅ **User Roles**: Sistema de permissões (USER, ADMIN)
- ✅ **Password Security**: Hash seguro com bcrypt

### ✅ Validação e Schemas

- ✅ **Zod Schemas**: Validação type-safe com reutilização
- ✅ **Schema Composition**: Merge, unions e objetos compostos
- ✅ **Domain Schemas**: Schemas reutilizáveis por domínio
- ✅ **HTTP Validation**: Validação automática de requests

### 🧪 Testes e Qualidade

- ✅ **Vitest**: Framework de testes rápido e moderno
- ✅ **Coverage Reports**: Relatórios de cobertura com thresholds
- ✅ **Factory Pattern**: Padrão para criação de dados de teste
- ✅ **Mock Repositories**: Implementações mock para testes isolados
- ✅ **Unit & Integration Tests**: Estrutura para ambos os tipos

### 🛠️ Ferramentas de Desenvolvimento

- ✅ **Biome**: Linter e formatter unificado (substitui ESLint + Prettier)
- ✅ **Husky**: Git hooks para garantir qualidade
- ✅ **lint-staged**: Lint apenas em arquivos staged
- ✅ **Commitlint**: Padronização de mensagens de commit
- ✅ **TypeScript**: Type checking rigoroso

### 📊 CI/CD e Automação

- ✅ **GitHub Actions**: Pipeline completo de QA
- ✅ **Code Quality Analysis**: Análise profunda de qualidade
- ✅ **Security Scan**: Detecção de vulnerabilidades e arquivos sensíveis
- ✅ **Coverage Tracking**: Monitoramento de cobertura de testes
- ✅ **Dependency Updates**: Scripts para atualização segura

---

## 🚀 Destaques Técnicos

### Arquitetura e Performance

- ✅ **Domain-Driven Design**: Separação clara de contextos e regras de negócio
- ✅ **Repository Pattern**: Abstração de persistência para testabilidade
- ✅ **Value Objects**: Encapsulamento de lógica de domínio
- ✅ **Type Safety**: TypeScript strict mode para máxima segurança de tipos
- ✅ **Modular Structure**: Fácil manutenção e escalabilidade

### Qualidade e Testes

- ✅ **Test Coverage**: Thresholds configurados (80% lines, 75% branches)
- ✅ **Factory Pattern**: Criação consistente de dados de teste
- ✅ **Mock Implementations**: Repositórios mock para testes isolados
- ✅ **QA Pipeline**: Lint + Format + Tests + Type Check automatizado

### Segurança

- ✅ **Sensitive Files Detection**: Bloqueio de commits com .env ou chaves
- ✅ **Security Audit**: npm audit integrado no CI
- ✅ **Password Hashing**: Implementação segura com bcrypt
- ✅ **JWT Best Practices**: Autenticação baseada em tokens

### Developer Experience

- ✅ **Hot Reload**: Desenvolvimento com watch mode
- ✅ **TypeScript IntelliSense**: Autocomplete completo
- ✅ **Pre-commit Hooks**: QA automático antes de cada commit
- ✅ **Conventional Commits**: Padronização de mensagens

---

## 🛠️ Stack Tecnológica

### Core

- **Runtime**: Node.js 20+
- **Framework**: Fastify 4.x (alta performance)
- **Language**: TypeScript 5.9 (strict mode)
- **Architecture**: DDD (Domain-Driven Design)

### Validação e Schemas

- **Validation**: Zod 4.x (type-safe schemas)
- **Schema Composition**: Merge, unions, objects

### Testes

- **Test Framework**: Vitest 3.x
- **Coverage**: @vitest/coverage-v8
- **UI**: @vitest/ui

### Qualidade de Código

- **Linter/Formatter**: Biome 2.x
- **Git Hooks**: Husky 9.x
- **Commit Linting**: Commitlint
- **Type Check**: TypeScript Compiler

### CI/CD

- **CI Platform**: GitHub Actions
- **Workflows**: QA Pipeline + Code Quality Analysis

---

## 📦 Instalação e Desenvolvimento

### Pré-requisitos

- Node.js 20+
- npm (ou pnpm/yarn)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Tonybsilva-dev/fastify-boilerplate.git

# Entre no diretório
cd fastify-boilerplate

# Instale as dependências
npm install
```

### Desenvolvimento

```bash
# Execute o pipeline de QA
npm run qa

# Execute testes
npm test

# Execute testes com UI
npm run test:ui

# Execute testes com coverage
npm run test:coverage

# Lint e format
npm run check
npm run format

# Type check
npm run build:check
```

### Scripts Disponíveis

- `npm test` - Executa testes em modo watch
- `npm run test:ui` - Abre interface visual do Vitest
- `npm run test:changed` - Executa apenas testes de arquivos alterados
- `npm run test:coverage` - Gera relatório de cobertura
- `npm run lint` - Executa linter (Biome)
- `npm run format` - Formata código (Biome)
- `npm run check` - Lint + Format check
- `npm run build:check` - Verifica tipos TypeScript
- `npm run qa` - Pipeline completo: lint + format + tests + type-check

---

## 📂 Estrutura do Projeto

```text
fastify-boilerplate/
├── src/
│   ├── core/
│   │   └── domain/
│   │       ├── entities/          # Entidades de domínio
│   │       │   ├── user.ts
│   │       │   └── index.ts
│   │       ├── repositories/      # Interfaces de repositórios
│   │       │   ├── user-repository.ts
│   │       │   └── index.ts
│   │       ├── schemas/           # Schemas Zod
│   │       │   ├── user.schema.ts
│   │       │   └── index.ts
│   │       ├── value-objects/     # Value Objects
│   │       │   ├── password.ts
│   │       │   └── index.ts
│   │       └── index.ts
│   ├── docs/                      # Documentação
│   │   ├── boilerplate.txt        # PRD (Product Requirements Document)
│   │   ├── server-with-fastify.md # Guia de implementação
│   │   └── tests-qa.md            # Plano de testes e QA
│   └── index.ts
├── tests/
│   └── unit/
│       └── core/
│           └── domain/
│               ├── entities/
│               ├── repositories/
│               ├── schemas/
│               └── value-objects/
├── .github/
│   └── workflows/
│       └── qa.yml                 # Pipeline CI/CD
├── .husky/                        # Git hooks
│   ├── pre-commit
│   └── commit-msg
├── biome.json                     # Configuração Biome
├── commitlint.config.cjs          # Configuração Commitlint
├── tsconfig.json                  # Configuração TypeScript
├── vitest.config.ts               # Configuração Vitest
└── package.json
```

### Camadas da Arquitetura

- **`core/domain`**: Regras de negócio puras, sem dependência de frameworks
  - `entities/`: Entidades de domínio
  - `repositories/`: Interfaces de persistência
  - `schemas/`: Schemas Zod para validação
  - `value-objects/`: Objetos de valor (Password, etc.)

- **`tests/`**: Testes organizados por tipo (unit, integration)

---

## 🎯 Funcionalidades Implementadas

### ✅ Domínio e Entidades

- [x] Entidade `User` com roles (USER, ADMIN)
- [x] Enum `UserRole` para tipagem
- [x] Value Object `Password` com hash seguro
- [x] Interface `UserRepository` para abstração
- [x] Mock `MockUserRepository` para testes

### ✅ Validação com Zod

- [x] Schema base `userSchema` completo
- [x] Schema `createUserSchema` para criação
- [x] Schema `updateUserSchema` para atualização parcial
- [x] Reutilização com `omit`, `extend`, `partial`

### ✅ Testes

- [x] Testes unitários para `Password` value object
- [x] Testes unitários para schemas Zod
- [x] Testes unitários para `MockUserRepository`
- [x] Configuração de coverage com thresholds
- [x] Factory pattern para dados de teste

### ✅ Qualidade de Código

- [x] Biome configurado (lint + format)
- [x] Husky com pre-commit hooks
- [x] Commitlint para mensagens padronizadas
- [x] TypeScript strict mode
- [x] Pipeline QA automatizado

### ✅ CI/CD

- [x] GitHub Action para QA básico
- [x] GitHub Action para análise de qualidade
- [x] Detecção de arquivos sensíveis
- [x] Security scan (npm audit)
- [x] Coverage tracking

---

## 🚧 Roadmap

### Em Desenvolvimento

- [ ] Servidor Fastify com rotas básicas
- [ ] Middleware de autenticação JWT
- [ ] RBAC com CASL
- [ ] Tratamento de erros estruturado
- [ ] Paginação encapsulada
- [ ] Health-check detalhado
- [ ] Documentação Swagger/OpenAPI
- [ ] Testes de integração

### Planejado

- [ ] Integração com banco de dados
- [ ] Cache layer
- [ ] Logging estruturado
- [ ] Observabilidade (métricas, traces)
- [ ] Docker e Docker Compose
- [ ] Exemplos de use cases

---

## 📊 Métricas de Qualidade

### Test Coverage

- **Lines**: 80% (threshold)
- **Functions**: 80% (threshold)
- **Branches**: 75% (threshold)
- **Statements**: 80% (threshold)

### Code Quality

- ✅ **Lint**: Biome com regras configuradas
- ✅ **Format**: Aspas simples, semicolons, imports organizados
- ✅ **Type Safety**: TypeScript strict mode
- ✅ **Security**: npm audit + detecção de arquivos sensíveis

---

## 🚀 Como Usar Este Boilerplate

### 1. Clone e Instale

```bash
git clone https://github.com/Tonybsilva-dev/fastify-boilerplate.git
cd fastify-boilerplate
npm install
```

### 2. Configure o Ambiente

```bash
# Copie o arquivo de exemplo (quando disponível)
cp .env.example .env

# Configure suas variáveis de ambiente
```

### 3. Execute o QA

```bash
# Verifique se tudo está funcionando
npm run qa
```

### 4. Comece a Desenvolver

- Adicione suas entidades em `src/core/domain/entities/`
- Crie seus schemas Zod em `src/core/domain/schemas/`
- Implemente seus repositórios
- Adicione seus use cases
- Configure suas rotas Fastify

### 5. Commit com Padrão

```bash
# O commitlint garante mensagens padronizadas
git commit -m "feat: adicionar nova funcionalidade"
git commit -m "fix: corrigir bug em validação"
git commit -m "test: adicionar testes para User"
```

---

## 📝 Licença

ISC License

---

## 👨‍💻 Desenvolvedor

**Antonio Silva**  
Desenvolvedor Full Stack

- 🌐 Portfolio: [acesse aqui](https://antonbiobsilva.com.br)
- 💼 LinkedIn: [acesse aqui](https://linkedin.com/in/antonio-silva)
- 📧 Email: <contato@antonbiobsilva.com.br>
- 🐙 GitHub: [@Tonybsilva-dev](https://github.com/Tonybsilva-dev)

---

## 🙏 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Abrir issues para reportar bugs ou sugerir features
2. Fazer fork do projeto
3. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
4. Commit suas mudanças (`git commit -m 'feat: adicionar AmazingFeature'`)
5. Push para a branch (`git push origin feature/AmazingFeature`)
6. Abrir um Pull Request

---

## 📚 Documentação Adicional

- [Guia de Implementação](src/docs/server-with-fastify.md) - Documentação detalhada do boilerplate
- [PRD](src/docs/boilerplate.txt) - Product Requirements Document (método RPG)
- [Plano de Testes](src/docs/tests-qa.md) - Casos de teste e QA

---

<div align="center">

**Desenvolvido com ❤️ e muito ☕**

[⬆ Voltar ao topo](#fastify-boilerplate---backend-nodejs-production-ready)

</div>
