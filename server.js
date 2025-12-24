const express = require("express");
const path = require("path");
const app = express();

// Middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

// Para carregar arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Para o express ler JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API rodando no Cloud Run 🚀");
});

const userRoutes = require("./src/routes/userRoutes");
app.use("/register", userRoutes);
app.use("/login", userRoutes);
app.use("/auth", userRoutes);

const studentsRoutes = require("./src/routes/studentsRoutes");
app.use("/students", studentsRoutes);

const schedulesRouter = require("./src/routes/scheduleRoutes");
app.use("/schedules", schedulesRouter);

const replacementsRoutes = require("./src/routes/replacementsRoutes");
app.use("/replacement", replacementsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
