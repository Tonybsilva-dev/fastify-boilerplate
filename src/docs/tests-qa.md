## Test Plan - Domínio Inicial e Validações (User, UserRole, Password, Schemas Zod)

Este documento descreve, do ponto de vista de QA, os cenários de teste que devem cobrir o que já foi implementado no domínio:

- Entidade `User` e enum `UserRole`.
- Value object `Password`.
- Schemas Zod (`userSchema`, `createUserSchema`, `updateUserSchema`).
- Integração com o pipeline de QA (`npm run qa`).

Cada seção traz os **objetivos**, **cenários de teste** e o **tipo de teste** (unitário / integração).

---

## 1. Entidade `User` e Enum `UserRole`

### Objetivo

Garantir que a modelagem da entidade de domínio `User` e do enum `UserRole` representa corretamente os estados válidos de um usuário da aplicação.

### Casos de teste

- **UT-USER-001 – Enum de roles deve conter apenas valores suportados**
  - **Tipo**: Unitário
  - **Pré-condição**: Código compilando.
  - **Cenário**:
    - Verificar que `UserRole.USER === "ROLE_USER"` e `UserRole.ADMIN === "ROLE_ADMIN"`.
  - **Critério de aceitação**:
    - Os valores do enum correspondem exatamente às strings esperadas (evita typos espalhados).

- **UT-USER-002 – Interface `User` deve expor campos obrigatórios**
  - **Tipo**: Unitário (type-level)
  - **Cenário**:
    - Verificar (via uso em código/compilação) que os campos `id`, `name`, `email`, `passwordHash`, `role`, `createdAt`, `updatedAt` são obrigatórios.
  - **Critério de aceitação**:
    - O TypeScript acusa erro se qualquer um dos campos obrigatórios for omitido na criação de um `User`.

---

## 2. Value Object `Password`

### Objetivo

Assegurar que senhas em texto plano sejam sempre transformadas em hash por um `PasswordHasher`, que o hash nunca seja vazio e que a verificação (`verify`) funcione conforme esperado.

### Casos de teste

- **UT-PASS-001 – Criação a partir de hash válido**
  - **Tipo**: Unitário
  - **Cenário**:
    - Chamar `Password.fromHash("hashed:secret")`.
  - **Critério de aceitação**:
    - A instância resultante expõe `hash === "hashed:secret"`.

- **UT-PASS-002 – Erro ao criar a partir de hash vazio**
  - **Tipo**: Unitário
  - **Cenário**:
    - Chamar `Password.fromHash("")`.
  - **Critério de aceitação**:
    - Lança erro com mensagem `"Password hash must not be empty"`.

- **UT-PASS-003 – Criação a partir de senha em texto com hasher**
  - **Tipo**: Unitário
  - **Cenário**:
    - Usar um `PasswordHasher` fake que prefixa `"hashed:"`.
    - Chamar `Password.fromPlain("super-secret", fakeHasher)`.
  - **Critério de aceitação**:
    - `password.hash === "hashed:super-secret"`.

- **UT-PASS-004 – Senha curta deve ser rejeitada**
  - **Tipo**: Unitário
  - **Cenário**:
    - Chamar `Password.fromPlain("short", fakeHasher)`.
  - **Critério de aceitação**:
    - Lança erro `"Password must have at least 8 characters"`.

- **UT-PASS-005 – Verificação de senha correta**
  - **Tipo**: Unitário
  - **Cenário**:
    - Criar `password` via `fromPlain("super-secret", fakeHasher)`.
    - Chamar `password.verify("super-secret", fakeHasher)`.
  - **Critério de aceitação**:
    - Retorna `true`.

- **UT-PASS-006 – Verificação de senha incorreta**
  - **Tipo**: Unitário
  - **Cenário**:
    - Criar `password` via `fromPlain("super-secret", fakeHasher)`.
    - Chamar `password.verify("other-password", fakeHasher)`.
  - **Critério de aceitação**:
    - Retorna `false`.

---

## 3. Schemas Zod de Usuário

### Objetivo

Validar estrutura e regras de negócio básicas dos dados de usuário em três níveis:

- Objeto completo de usuário (`userSchema`).
- Payload de criação (`createUserSchema`).
- Payload de atualização parcial (`updateUserSchema`).

### 3.1 `userSchema`

- **UT-USCHEMA-001 – Usuário válido passa na validação**
  - **Tipo**: Unitário
  - **Cenário**:
    - Construir objeto com:
      - `id`: UUID válido.
      - `name`: string com pelo menos 2 caracteres.
      - `email`: email válido.
      - `passwordHash`: string não vazia.
      - `role`: `UserRole.USER` ou `UserRole.ADMIN`.
      - `createdAt` / `updatedAt`: `Date`.
    - `userSchema.safeParse(obj)`.
  - **Critério de aceitação**:
    - `success === true`.

- **UT-USCHEMA-002 – Email inválido é rejeitado**
  - **Tipo**: Unitário
  - **Cenário**:
    - Mesmo objeto do caso anterior, mas com `email = "not-an-email"`.
  - **Critério de aceitação**:
    - `success === false` e erro aponta para o campo `email`.

- **UT-USCHEMA-003 – Role inválida é rejeitada**
  - **Tipo**: Unitário
  - **Cenário**:
    - Mesmo objeto válido, mas com `role = "ROLE_MANAGER"`.
  - **Critério de aceitação**:
    - `success === false`.

### 3.2 `createUserSchema`

- **UT-CUSCHEMA-001 – Payload mínimo válido de criação**
  - **Tipo**: Unitário
  - **Cenário**:
    - `createUserSchema.safeParse({ name, email, password })`.
  - **Critério de aceitação**:
    - `success === true`.
    - Campos como `id`, `createdAt`, `updatedAt`, `passwordHash` não são exigidos no payload.

- **UT-CUSCHEMA-002 – Falha quando password não é informado**
  - **Tipo**: Unitário
  - **Cenário**:
    - `createUserSchema.safeParse({ name, email })`.
  - **Critério de aceitação**:
    - `success === false` e erro aponta para `password`.

### 3.3 `updateUserSchema`

- **UT-UUSCHEMA-001 – Payload parcial válido**
  - **Tipo**: Unitário
  - **Cenário**:
    - `updateUserSchema.safeParse({ name: "Novo Nome" })`.
  - **Critério de aceitação**:
    - `success === true`.

- **UT-UUSCHEMA-002 – Validação ainda é aplicada em payload parcial**
  - **Tipo**: Unitário
  - **Cenário**:
    - `updateUserSchema.safeParse({ email: "not-an-email" })`.
  - **Critério de aceitação**:
    - `success === false` e erro aponta para `email`.

---

## 4. Pipeline de QA (Smoke Tests)

### Objetivo

Garantir que a adição de novos testes e módulos de domínio não quebre o pipeline padrão de QA.

### Casos de teste

- **SM-QA-001 – Execução completa do `npm run qa`**
  - **Tipo**: Integração / Build pipeline
  - **Cenário**:
    - Rodar `npm run qa`.
  - **Critério de aceitação**:
    - `lint` (Biome) executa sem erros.
    - `format` (Biome) não deixa arquivos pendentes de formatação.
    - `test:changed` (Vitest) executa sem falhas.
    - `build:check` (`tsc --noEmit`) compila sem erros de tipo.

---

## 5. Repository Pattern para Testes

### 5.1 Interface do Repositório

**Arquivo**: `src/core/domain/repositories/user-repository.ts`

- **Status**: ✅ Implementado
- **Descrição**: Interface `UserRepository` define o contrato para persistência de usuários.
- **Métodos**:
  - `findById(id: string): Promise<User | null>`
  - `findByEmail(email: string): Promise<User | null>`
  - `create(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>`
  - `update(id: string, user: Partial<...>): Promise<User | null>`
  - `delete(id: string): Promise<boolean>`

### 5.2 Mock Repository

**Arquivo**: `tests/unit/core/domain/repositories/mock-user-repository.ts`

- **Status**: ✅ Implementado
- **Descrição**: Implementação mock do `UserRepository` usando `Map` em memória.
- **Funcionalidades**:
  - Armazena usuários em memória durante execução dos testes.
  - Implementa todos os métodos da interface `UserRepository`.
  - Métodos auxiliares para testes: `clear()`, `getAll()`, `count()`.

### 5.3 Testes do Mock Repository

**Arquivo**: `tests/unit/core/domain/repositories/mock-user-repository.spec.ts`

- **Status**: ✅ Implementado
- **Cenários testados**:
  - ✅ Criação de usuário com geração automática de `id`, `createdAt`, `updatedAt`.
  - ✅ Busca por ID (sucesso e não encontrado).
  - ✅ Busca por email (sucesso e não encontrado).
  - ✅ Atualização de usuário (sucesso e não encontrado).
  - ✅ Deleção de usuário (sucesso e não encontrado).
  - ✅ Métodos auxiliares (`clear`, `getAll`, `count`).

### 5.4 Benefícios do Padrão Repository nos Testes

- **Isolamento**: Testes de casos de uso não dependem de infraestrutura real (DB, APIs).
- **Determinismo**: Comportamento previsível e controlável.
- **Performance**: Testes rápidos sem I/O de banco de dados.
- **Flexibilidade**: Fácil simular cenários específicos (erros, edge cases).
- **Manutenibilidade**: Mudanças na infraestrutura não quebram testes unitários.

---

## 6. Próximos Passos de QA

- Adicionar testes unitários específicos para a integração entre:
  - `Password` e futura infra de hash real (ex.: bcrypt).
  - Schemas Zod e camada HTTP (validação de body/query/params).
- Expandir cobertura de testes para:
  - Hierarquia de erros (`AppError`, `ValidationError`, `AuthError`, etc.).
  - Casos de uso de autenticação quando forem implementados (usando `MockUserRepository`).
- Criar mocks adicionais conforme necessário:
  - `MockTokenProvider` para testes de JWT.
  - `MockPasswordHasher` para testes de hash (se necessário).
