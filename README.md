# 🏥 SisRepo - Sistema de Gestão de Reposições Acadêmicas

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success)

## 📑 Sumário
- [Descrição](#-sisrepo---sistema-de-gestão-de-reposições-acadêmicas)
- [Tecnologias e Justificativas](#-tecnologias-e-justificativa-das-escolhas)
- [Instalação](#-instalação-e-execução)
- [Autenticação](#️-autenticação-e-autorização)
- [Endpoints](#️-endpoints-da-api)
- [Testes](#-testes)
- [Contribuição](#-como-contribuir)
- [Licença](#-licença)


O **SisRepo** é uma API RESTful projetada para simplificar o gerenciamento e o rastreamento de reposições de aulas para alunos em estágios clínicos e laboratoriais. A plataforma permite o cadastro de alunos, a criação de horários disponíveis (slots) e a alocação dinâmica desses horários para as reposições necessárias.

## Funcionalidades principais

A arquitetura do SisRepo foi definida para garantir um ambiente de desenvolvimento eficiente e um sistema de produção confiável e escalável.

## Tecnologias e Justificativa das Escolhas

| Categoria | Tecnologia | Justificativa da Escolha |
| :--- | :--- | :--- |
| **Backend** | **Node.js** | Escolhido pela sua **natureza assíncrona e não-bloqueante**, ideal para construir APIs de alta performance que lidam com múltiplas requisições simultaneamente, garantindo respostas rápidas. |
| **Framework** | **Express** | O *framework* minimalista padrão do Node.js. Oferece flexibilidade e leveza, sendo perfeito para o controle granular de roteamento, *middlewares* de segurança e manipulação de requisições. |
| **Banco de Dados** | **PostgreSQL** | **Escolha principal devido à sua robustez, confiabilidade (ACID compliance) e suporte avançado a dados relacionais.** É ideal para um sistema acadêmico onde a integridade dos dados (relações entre alunos, agendamentos e usuários) é crítica. Oferece também funcionalidades avançadas como *Triggers* e *Stored Procedures*. |
| **Query Builder** | **Knex.js** | Um construtor de consultas SQL versátil e poderoso. Permite escrever consultas de forma segura e legível em JavaScript, protegendo contra SQL Injection e facilitando a transição entre diferentes dialetos de banco de dados (SQLite no dev, Postgres na prod). |
| **Banco de Dados (Dev)** | **SQLite3** | Utilizado exclusivamente para **desenvolvimento local e testes unitários**, devido à sua instalação zero-configuração e ao armazenamento em um único arquivo, agilizando o setup do ambiente. |
| **Segurança** | **JWT & Middlewares** | A autenticação é feita via JWT, que é um padrão leve e *stateless*. O controle de acesso (RBAC) é implementado através de *middlewares* no Express, garantindo a separação de responsabilidades (Autenticação vs. Autorização). |
| **Testes** | **Jest** | Framework de testes rápido e amplamente adotado no ecossistema JavaScript, usado para testes unitários em todas as camadas e testes de integração de rotas, garantindo a qualidade do código. |



## Tecnologias Utilizadas

| Categoria         | Tecnologia    | Descrição                                         |
| :---------------- | :------------ | :------------------------------------------------ |
| **Backend** | Node.js       | Ambiente de execução JavaScript no servidor.      |
| **Framework** | Express       | Framework para roteamento e middlewares.          |
| **Banco de Dados**| SQLite3       | Banco de dados relacional para desenvolvimento.   |
| **Query Builder** | Knex.js       | Gerenciamento de migrations e consultas SQL.      |
| **Testes** | Jest          | Framework para testes unitários e de integração.  |

## Pré-requisitos

Antes de começar, certifique-se de que você tem os seguintes softwares instalados em sua máquina:

- [Node.js](https://nodejs.org/en/) (versão 18.x ou superior)
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/) (gerenciador de pacotes)
- [Git](https://git-scm.com/) (para versionamento de código)
- **Opcional, mas Recomendado:** Uma instância local do **PostgreSQL** ou Docker para simular o ambiente de produção.

## Instalação e Execução

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente local.

**1. Clone o repositório:**
```bash
git clone [https://github.com/pholiveira-dev/sisrepo.git](https://github.com/pholiveira-dev/sisrepo.git)
cd sisrepo

2. Instale as dependências:

npm install
# ou
yarn install

3. Configure as variáveis de ambiente:
Crie um arquivo chamado .env na raiz do projeto e preencha-o com as configurações necessárias. Você pode usar o arquivo .env.example como base.

.env

# Ambiente da aplicação (development, production)
NODE_ENV=development

# Segredo para geração de tokens JWT
APP_SECRET=sua-chave-secreta-aqui

# Configuração do Banco de Dados
DB_CLIENT=sqlite3
DB_FILENAME=./src/database/db.sqlite

4. Execute as migrações do banco de dados:
Este comando criará as tabelas necessárias no banco de dados SQLite.

npx knex migrate:latest

5. Inicie o servidor:

npm run dev
# ou
yarn dev

🎉 A API estará disponível em http://localhost:3333.

🛡️ Autenticação e Autorização

Para acessar as rotas privadas da API, o usuário deve enviar um Token JWT válido no cabeçalho da requisição.

    Login: Envie um POST para /auth/login com email e senha para obter o Token.

    Uso do Token: Inclua o Token no cabeçalho de todas as requisições privadas no formato:
    CHAVE (KEY)	VALOR (VALUE)
    Authorization	Bearer [SEU TOKEN JWT]

🧪 Testes

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

Contribuições são sempre bem-vindas! Se você deseja contribuir com o projeto, siga os passos abaixo:

    Faça um Fork deste repositório.

    Crie uma nova Branch: git checkout -b feature/sua-feature.

    Faça suas alterações e realize o Commit: git commit -m 'feat: Adiciona nova funcionalidade'.

    Envie para a sua Branch: git push origin feature/sua-feature.

    Abra um Pull Request.

📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
