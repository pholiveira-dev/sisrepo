# SisRepo - Sistema de Gestão de Reposições Acadêmicas

![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Framework-lightgrey?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-blue?logo=postgresql)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-ativo-success)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen?logo=jest)

---

## 📑 Sumário

- [Descrição](#-descrição)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias e Justificativas](#-tecnologias-e-justificativas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Execução](#-instalação-e-execução)
- [Autenticação e Autorização](#-autenticação-e-autorização)
- [Testes](#-testes)
- [Endpoints da API](#-endpoints-da-api)
- [Como Contribuir](#-como-contribuir)
- [Licença](#-licença)

---

## Descrição

O **SisRepo** é uma **API RESTful** projetada para simplificar o gerenciamento e o rastreamento de **reposições de aulas** de alunos em **estágios clínicos e laboratoriais**.

A plataforma permite:

- 📘 Cadastro de alunos  
- ⏰ Criação de horários disponíveis (slots)  
- 🔁 Alocação dinâmica de horários para reposições  

A arquitetura do sistema foi desenvolvida para oferecer um **ambiente eficiente, escalável e confiável**, com separação clara entre as camadas **Model**, **Repository**, **Service** e **Controller**.

---

## Funcionalidades Principais

- CRUD completo de usuários, alunos, agendamentos e reposições  
- Autenticação e autorização com **JWT**  
- Controle de acesso baseado em papéis (**RBAC**)  
- Estrutura modular e escalável  
- Testes automatizados com **Jest**  
- Banco de dados configurável (SQLite para dev, PostgreSQL para produção)

---

## Tecnologias e Justificativas

| Categoria | Tecnologia | Justificativa |
|------------|-------------|---------------|
| **Backend** | Node.js | Ambiente assíncrono e não-bloqueante, ideal para APIs de alta performance. |
| **Framework** | Express | Minimalista e flexível, com controle granular de rotas e middlewares. |
| **Banco de Dados (Produção)** | PostgreSQL | Banco robusto e confiável (ACID), com suporte a triggers e stored procedures. |
| **Query Builder** | Knex.js | SQL legível e seguro, com proteção contra SQL Injection. |
| **Banco de Dados (Desenvolvimento)** | SQLite3 | Banco leve e sem configuração, ideal para desenvolvimento local e testes. |
| **Segurança** | JWT + Middlewares | Autenticação stateless e controle de acesso baseado em papéis (RBAC). |
| **Testes** | Jest | Framework rápido e amplamente utilizado, garantindo qualidade e confiabilidade. |

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18.x ou superior)  
- **NPM** ou **Yarn**  
- **Git**  
- (Opcional) Instância local do **PostgreSQL** ou **Docker**

---

## Instalação e Execução

Siga os passos abaixo para configurar e executar o projeto localmente:

## 1️⃣ Clone o repositório

## 2️⃣ Instale as dependências

```bash
npm install
# ou
yarn install
```bash

## 3️⃣ Configure as variáveis de ambiente

```bash
Crie um arquivo .env na raiz do projeto e use o .env.example como referência.
# Ambiente da aplicação (development, production)
NODE_ENV=development

# Segredo para geração de tokens JWT
APP_SECRET=sua-chave-secreta-aqui

# Configuração do Banco de Dados
DB_CLIENT=sqlite3
DB_FILENAME=./src/database/db.sqlite

git clone https://github.com/pholiveira-dev/sisrepo.git
cd sisrepo
```bash

## 4️⃣ Execute as migrações do banco de dados
```bash
npx knex migrate:latest
```bash

## 5️⃣ Inicie o servidor

```bash
npm run dev
# ou
yarn dev
```bash

## A API estará disponível em:
```bash
- http://localhost:3333
```bash

## Autenticação e Autorização

Para acessar rotas privadas, o usuário deve enviar um Token JWT válido no cabeçalho da requisição.

**Login**

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "user_password"
}
```bash

## Uso do Token

Inclua o token em todas as requisições privadas:
| Cabeçalho       | Valor                    |
| --------------- | ------------------------ |
| `Authorization` | `Bearer [SEU_TOKEN_JWT]` |

## Testes

O projeto utiliza o Jest para garantir a qualidade e a confiabilidade do código.

## Executar os testes:

```bash
npm test
# ou
yarn test
```bash

## Os testes cobrem:

Lógica de negócio dos Services

Integração com os Repositories

Autenticação e controle de acesso

Validação de dados e respostas esperadas

Nosso objetivo é manter alta cobertura de código, especialmente nas rotas críticas de autenticação e gestão de dados.

## Endpoints da API

Alunos (/students)
| Método   | Endpoint        | Descrição                                  |
| -------- | --------------- | ------------------------------------------ |
| **POST** | `/students`     | Cria um novo aluno                         |
| **GET**  | `/students`     | Lista todos os alunos                      |
| **GET**  | `/students/:id` | Retorna os detalhes de um aluno específico |

Agendamentos (/schedules)
| Método   | Endpoint     | Descrição                        |
| -------- | ------------ | -------------------------------- |
| **POST** | `/schedules` | Cria um novo slot de agendamento |
| **GET**  | `/schedules` | Lista todos os slots disponíveis |

Reposições (/replacements)
| Método     | Endpoint            | Descrição                           |
| ---------- | ------------------- | ----------------------------------- |
| **POST**   | `/replacements`     | Agenda uma reposição para um aluno  |
| **GET**    | `/replacements`     | Lista todas as reposições agendadas |
| **DELETE** | `/replacements/:id` | Cancela uma reposição               |

🤝 Como Contribuir

Contribuições são sempre bem-vindas! 💡

Siga os passos abaixo:

## 1. Faça um Fork deste repositório

## 2. Crie uma nova branch:
```bash
git checkout -b feature/sua-feature
```bash

## 3. Faça suas alterações e realize o commit:
```bash
git commit -m "feat: adiciona nova funcionalidade"
```bash

## 4. Envie para o seu fork:
```bash
git push origin feature/sua-feature
```bash

## 5. Abra um Pull Request

📄 Licença

Este projeto está sob a licença MIT.
Consulte o arquivo LICENSE
