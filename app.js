const express = require("express");
const app = express();
const session = require("express-session");
const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "this is secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: true //untuk security dari csrf attack
    },
  })
);

app.use("/", require("./routers"));

app.listen(port, () => {
  console.log(`Pahala kamu dipangkatkan ${port}`);
});
