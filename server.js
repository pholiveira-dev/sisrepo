const express = require('express');
const path = require('path');
const app = express();

// Middlewares
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Para carregar arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Para o express ler JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurando a rota inicial - apenas teste
const userRoutes = require('./src/routes/userRoutes');
app.use('/', userRoutes);

const studentRoutes = require('./src/routes/studentRoutes');
app.use('/students', studentRoutes)

app.get('/register', (req, res) => {
    res.render('register');
})

app.get('/login', (req, res) => {
    res.render('login');
})

const schedulesRouter = require('./src/routes/scheduleRoutes');
app.use('/schedules', schedulesRouter);

app.get('/admin/users', (req, res) => {
    res.render('users_managment');
});

app.get('/admin/students', (req, res) => {
    res.render('students_managment');
});

// ROTAS DE FRONT-END PARA SCHEDULES
app.get('/schedules/create', (req, res) => {
    // Note: Esta rota deve ser protegida com middlewares, mas está aqui para testes de EJS
    res.render('create_schedule', { message: null, isSuccess: false });
});

app.get('/schedules', (req, res) => {
    // Esta é a rota principal de gerenciamento/visualização de agendamentos
    res.render('schedules_management');
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})