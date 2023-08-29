const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");
const chalk = require("chalk");

//rotas
const toughtsRoutes = require("./routes/toughtsRoutes");
const authRoutes = require("./routes/authRoutes");

// import controller
const ToughtsController = require("./controllers/ToughtController.js");

const app = express();

// const conn = require('./db/conn')
const conn = require("./db/conn.js");

//Models
const Tought = require("./models/Toughts.js");
const User = require("./models/User.js");

//template engine
app.set("view engine", "handlebars");
app.engine("handlebars", exphbs.engine());

//receber resposta do body
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// sesssion middlware, onde o express vai salvar as sessoes
app.use(
  session({
    name: "session",
    secret: "nosso_secret",
    resave: false, //caiu a sessão ele desconecta
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "sessions"),
    }),
    cookie: {
      secure: false,
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    },
  })
);

//flash messages
app.use(flash());

//arquivos estáticos
app.use(express.static("public"));

//set session to res
app.use((req, res, next) => {
  if (req.session.userid) {
    res.locals.session = req.session;
  }
  next();
});

app.use("/toughts", toughtsRoutes);
app.use("/", authRoutes);
app.get("/", ToughtsController.showToughts);

conn
  .sync()
//   .sync({force: true})
  .then(() => {
    app.listen(3000);
    console.log(chalk.bgGreen.black("Servidor Conectado com Sucesso"));
  })
  .catch((error) => {
    console.log(chalk.bgRed.black("Erro ao conectar no Servidor"));
    console.error(error);
  });
