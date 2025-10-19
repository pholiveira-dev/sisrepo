[![codecov](https://codecov.io/gh/SEU_USUARIO/SEU_REPOSITORIO/branch/main/graph/badge.svg)](https://codecov.io/gh/pholiveira-dev/sisrepo) 

# SisRepo - Sistema de Gestão de Reposições Acadêmicas

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

![Status](https://img.shields.io/badge/status-active-success) 

---

## 📑 Sumário

- [Descrição](#-descrição)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias e Justificativa das-Escolhas](#-tecnologias-e-justificativa-das-escolhas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Execução](#-instalação-e-execução)
- [Autenticação e Autorização](#-autenticação-e-autorização)
- [Endpoints da API](#-endpoints-da-api)
- [Testes](#-testes)
- [Como Contribuir](#-como-contribuir)
- [Licença](#-licença)

---

## Descrição

O **SisRepo** é uma API RESTful projetada para simplificar o **gerenciamento e o rastreamento de reposições de aulas** de alunos em **estágios clínicos e laboratoriais**.

A plataforma permite:
- Cadastro de alunos
- Criação de horários disponíveis (slots)
- Alocação dinâmica de horários para reposições necessárias

---

## Funcionalidades Principais

A arquitetura do **SisRepo** foi planejada para oferecer:
- Ambiente de desenvolvimento eficiente  
- Sistema de produção **escalável e confiável**  
- Separação clara de camadas (Model, Repository, Service e Controller)

---

## Tecnologias e Justificativa das Escolhas

| Categoria | Tecnologia | Justificativa da Escolha |
|------------|-------------|---------------------------|
| **Backend** | Node.js | Ambiente assíncrono e não-bloqueante, ideal para APIs de alta performance. |
| **Framework** | Express | Framework minimalista e flexível, com controle granular de rotas e middlewares. |
| **Banco de Dados (Produção)** | PostgreSQL | Banco robusto, confiável (ACID) e com suporte a triggers e stored procedures. |
| **Query Builder** | Knex.js | Construtor SQL seguro, legível e portátil, com proteção contra SQL Injection. |
| **Banco de Dados (Desenvolvimento)** | SQLite3 | Banco leve e sem configuração, ideal para desenvolvimento local e testes. |
| **Segurança** | JWT + Middlewares | Autenticação stateless via JWT e controle de acesso baseado em papéis (RBAC). |
| **Testes** | Jest | Framework de testes rápido e amplamente utilizado, garantindo qualidade e confiabilidade. |

---

## 🧰 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18.x ou superior)
- **NPM** ou **Yarn**
- **Git**
- (Opcional) Instância local do **PostgreSQL** ou **Docker**

---

## 🚀 Instalação e Execução

Siga os passos abaixo para configurar e executar o projeto localmente.

### Clone o repositório

```bash
git clone https://github.com/pholiveira-dev/sisrepo.git
cd sisrepo

**### Instale as dependências**

npm install
# ou
yarn install

**### Configure as variáveis de ambiente**

# Ambiente da aplicação (development, production)
NODE_ENV=development

# Segredo para geração de tokens JWT
APP_SECRET=sua-chave-secreta-aqui

# Configuração do Banco de Dados
DB_CLIENT=sqlite3
DB_FILENAME=./src/database/db.sqlite

**### Execute as migrações no banco de dados**

npx knex migrate:latest

**### Inicie o servidor:**

npm run dev
# ou
yarn dev

## A API estará disponível em:
👉 http://localhost:3333

🔐 Autenticação e Autorização

Para acessar rotas privadas, o usuário deve enviar um Token JWT válido no cabeçalho da requisição.

🔑 Login

## Envie um POST para:

/auth/login

Com:

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}

## Uso do Token

Inclua o token em todas as requisições privadas:

KEY: Authorization
VALUE: Bearer [SEU_TOKEN_JWT]

## Testes

O projeto utiliza o Jest para garantir a qualidade e confiabilidade do código.

## ▶️ Executar os testes:

npm test
# ou
yarn test

Os testes verificam:

Lógica de negócio dos Services

Integração com os Repositories

Autenticação e controle de acesso

Validação de dados e respostas esperadas

Nosso objetivo é manter alta cobertura de código, especialmente nas rotas críticas de autenticação e gestão de dados.

## Endpoints da API

👨‍🎓 Alunos (/students)

| Método   | Endpoint        | Descrição                                  |
| -------- | --------------- | ------------------------------------------ |
| **POST** | `/students`     | Cria um novo aluno                         |
| **GET**  | `/students`     | Lista todos os alunos                      |
| **GET**  | `/students/:id` | Retorna os detalhes de um aluno específico |

🗓️ Agendamentos (/schedules)

| Método   | Endpoint     | Descrição                        |
| -------- | ------------ | -------------------------------- |
| **POST** | `/schedules` | Cria um novo slot de agendamento |
| **GET**  | `/schedules` | Lista todos os slots disponíveis |

🔁 Reposições (/replacements)

| Método     | Endpoint            | Descrição                           |
| ---------- | ------------------- | ----------------------------------- |
| **POST**   | `/replacements`     | Agenda uma reposição para um aluno  |
| **GET**    | `/replacements`     | Lista todas as reposições agendadas |
| **DELETE** | `/replacements/:id` | Cancela uma reposição               |

## 🤝 Como Contribuir

Contribuições são sempre bem-vindas! 💡
Siga os passos abaixo:

Faça um Fork deste repositório

Crie uma nova branch:

git checkout -b feature/sua-feature

Faça suas alterações e realize o commit:

git commit -m "feat: adiciona nova funcionalidade"

Envie para o seu fork:

git push origin feature/sua-feature

Abra um Pull Request

📄 Licença

Este projeto está sob a licença MIT.
Consulte o arquivo LICENSE
