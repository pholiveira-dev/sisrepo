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

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})