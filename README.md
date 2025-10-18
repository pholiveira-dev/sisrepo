[![codecov](https://codecov.io/gh/SEU_USUARIO/SEU_REPOSITORIO/branch/main/graph/badge.svg)](https://codecov.io/gh/pholiveira-dev/sisrepo)

# SisRepo - Sistema de Gestão de Reposições Acadêmicas

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success)

## Sumário
- [Descrição](#descrição)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Tecnologias e Justificativa das Escolhas](#tecnologias-e-justificativa-das-escolhas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Autenticação e Autorização](#autenticação-e-autorização)
- [Endpoints da API](#endpoints-da-api)
- [Testes](#testes)
- [Como Contribuir](#como-contribuir)
- [Licença](#licença)

---

## Descrição

O **SisRepo** é uma API RESTful projetada para simplificar o gerenciamento e o rastreamento de reposições de aulas para alunos em estágios clínicos e laboratoriais.  
A plataforma permite o cadastro de alunos, a criação de horários disponíveis (*slots*) e a alocação dinâmica desses horários para as reposições necessárias.

---

## Funcionalidades Principais

A arquitetura do SisRepo foi planejada para oferecer um ambiente de desenvolvimento eficiente e um sistema de produção escalável e confiável.

---

## Tecnologias e Justificativa das Escolhas

| Categoria | Tecnologia | Justificativa da Escolha |
| :--- | :--- | :--- |
| **Backend** | **Node.js** | Ambiente assíncrono e não-bloqueante, ideal para APIs de alta performance que lidam com múltiplas requisições simultaneamente. |
| **Framework** | **Express** | Framework minimalista e flexível, oferecendo controle granular de rotas, middlewares e manipulação de requisições. |
| **Banco de Dados (Produção)** | **PostgreSQL** | Robustez e confiabilidade (ACID), com suporte avançado a dados relacionais e recursos como *triggers* e *stored procedures*. |
| **Query Builder** | **Knex.js** | Construtor de consultas SQL seguro e legível, com proteção contra SQL Injection e portabilidade entre bancos. |
| **Banco de Dados (Desenvolvimento)** | **SQLite3** | Banco leve e sem configuração, ideal para desenvolvimento local e testes. |
| **Segurança** | **JWT e Middlewares** | Autenticação *stateless* via JWT e controle de acesso por papéis (RBAC) implementado em middlewares Express. |
| **Testes** | **Jest** | Framework de testes rápido e amplamente utilizado, garantindo qualidade e confiabilidade do código. |

---

## Pré-requisitos

Antes de começar, certifique-se de ter os seguintes softwares instalados:

- [Node.js](https://nodejs.org/en/) (versão 18.x ou superior)  
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)  
- [Git](https://git-scm.com/)  
- **Opcional:** Instância local do **PostgreSQL** ou Docker para simular o ambiente de produção.

---

## Instalação e Execução

Siga os passos abaixo para configurar e executar o projeto localmente.

### 1. Clone o repositório:
```bash
git clone https://github.com/pholiveira-dev/sisrepo.git
cd sisrepo


**2. Instale as dependências:**

npm install
# ou
yarn install

**3. Configure as variáveis de ambiente:**
Crie um arquivo chamado .env na raiz do projeto e preencha-o com as configurações necessárias. Você pode usar o arquivo .env.example como base.

.env

# Ambiente da aplicação (development, production)
NODE_ENV=development

# Segredo para geração de tokens JWT
APP_SECRET=sua-chave-secreta-aqui

# Configuração do Banco de Dados
DB_CLIENT=sqlite3
DB_FILENAME=./src/database/db.sqlite

**4. Execute as migrações do banco de dados:**
Este comando criará as tabelas necessárias no banco de dados SQLite.

npx knex migrate:latest

**5. Inicie o servidor:**

npm run dev
# ou
yarn dev

# A API estará disponível em http://localhost:3333.

# Autenticação e Autorização

Para acessar as rotas privadas da API, o usuário deve enviar um Token JWT válido no cabeçalho da requisição.

    Login: Envie um POST para /auth/login com email e senha para obter o Token.

    Uso do Token: Inclua o Token no cabeçalho de todas as requisições privadas no formato:
    CHAVE (KEY)	VALOR (VALUE)
    Authorization	Bearer [SEU TOKEN JWT]

# Testes

O projeto utiliza o Jest para garantir a qualidade e o funcionamento correto das funcionalidades. Para executar a suíte de testes, use o comando:

npm test
# ou
yarn test

🛣️ Endpoints da API

Abaixo estão os principais endpoints disponíveis na API.

Alunos (/students)

    POST /students: Cria um novo aluno.

    GET /students: Lista todos os alunos.

    GET /students/:id: Retorna os detalhes de um aluno específico.

Agendamentos (/schedules)

    POST /schedules: Cria um novo slot de agendamento.

    GET /schedules: Lista todos os slots disponíveis.

Reposições (/replacements)

    POST /replacements: Agenda uma reposição para um aluno em um slot.

    GET /replacements: Lista todas as reposições agendadas.

    DELETE /replacements/:id: Cancela uma reposição.

🤝 Como Contribuir

**Contribuições são sempre bem-vindas! Se você deseja contribuir com o projeto, siga os passos abaixo:**

    Faça um Fork deste repositório.

    Crie uma nova Branch: git checkout -b feature/sua-feature.

    Faça suas alterações e realize o Commit: git commit -m 'feat: Adiciona nova funcionalidade'.

    Envie para a sua Branch: git push origin feature/sua-feature.

    Abra um Pull Request.

📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
