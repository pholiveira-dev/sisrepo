# 🏥 SisRepo - Sistema de Gestão de Reposições Acadêmicas

![Badge de Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Badge de Licença](https://img.shields.io/badge/license-MIT-blue)
![Badge do Node.js](https://img.shields.io/badge/Node.js-18.x-green)

O **SisRepo** é uma API RESTful projetada para simplificar o gerenciamento e o rastreamento de reposições de aulas para alunos em estágios clínicos e laboratoriais. A plataforma permite o cadastro de alunos, a criação de horários disponíveis (slots) e a alocação dinâmica desses horários para as reposições necessárias.

## ✨ Funcionalidades

- **Gestão de Alunos:** Cadastro, consulta e atualização de informações dos estudantes.
- **Criação de Agendamentos (Schedules):** Definição de datas, horários e locais disponíveis para reposição.
- **Alocação de Reposições:** Associação de um aluno a um horário de reposição disponível.
- **Rastreamento:** Acompanhamento do status de cada reposição.
- **API Segura:** (Futuro) Proteção de rotas com autenticação baseada em JWT.

## 🚀 Tecnologias Utilizadas

| Categoria         | Tecnologia    | Descrição                                         |
| :---------------- | :------------ | :------------------------------------------------ |
| **Backend** | Node.js       | Ambiente de execução JavaScript no servidor.      |
| **Framework** | Express       | Framework para roteamento e middlewares.          |
| **Banco de Dados**| SQLite3       | Banco de dados relacional para desenvolvimento.   |
| **Query Builder** | Knex.js       | Gerenciamento de migrations e consultas SQL.      |
| **Testes** | Jest          | Framework para testes unitários e de integração.  |

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de que você tem os seguintes softwares instalados em sua máquina:

- [Node.js](https://nodejs.org/en/) (versão 18.x ou superior)
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/) (gerenciador de pacotes)
- [Git](https://git-scm.com/) (para versionamento de código)

## 📝 Instalação e Execução

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
