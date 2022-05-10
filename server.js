const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const secret = "1111";
const port = 3000;

const { newUser, login } = require("./queries");

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));
app.use(
  fileupload({
    limits: 5000000,
    abortOnLimit: true,
    responseOnLimit: "File too large",
  })
);
app.use(
  "/bootstrap",
  express.static(__dirname + "/node_modules/bootstrap/dist")
);
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/css", express.static(__dirname + "/public/css"));

app.set("view engine", "handlebars");
app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
  })
);

app.get("/", (_req, res) => {
  res.render("index");
});

app.get("/register", (_req, res) => {
  res.render("register");
});

app.get("/login", (_req, res) => {
  res.render("login");
});

app.post("/register", async (req, res) => {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No files were uploaded.");
  }
  const { image } = req.files;
  const { name } = image;
  const user = req.body;
  user.image = `/imgs/${name}`;
  try {
    await newUser(user);
    image.mv(`${__dirname}/public/imgs/${name}`, async (err) => {
      if (err)
        return res.status(500).send({
          error: "Error al subir la imagen",
          code: 500,
        });
    });
    // res.status(200).send(usuario);
    res.redirect("/");
  } catch (e) {
    console.log(e);
    console.log(e.message);
    res.status(500).send({
      error: "Error al crear el usuario",
      code: 500,
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await login(email, password);
  if (user) {
    const token = jwt.sign({ user }, secret, { expiresIn: "1h" });
    res.cookie("token", token);
    res.redirect("/dashboard");
    console.log("User logged in");
  } else {
    res.redirect("/login");
  }
});

app.get("/dashboard", (req, res) => {
  console.log("dashboard accessed");
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.redirect("/login");
      } else {
        res.render("dashboard");
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/post", (req, res) => {
  res.render("post");
});

app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});
