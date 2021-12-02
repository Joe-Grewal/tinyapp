const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

const app = express();
app.use(cookieParser())
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = characters.length;
  for (let i = 0; i < 6; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * length));
 }
 return result;
};

const checkByEmail = (email, registry) => {
  for (const userId in registry) {
    if (registry[userId].email === email) {
      return registry[userId];
    }
  } return false;
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  }
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const user_id = users[req.cookies["user_id"]];
  const templateVars = { user_id, urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user_id = users[req.cookies["user_id"]];
  const templateVars = { user_id, urls: urlDatabase };
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  const user_id = users[req.cookies["user_id"]];
  const templateVars = { user_id, urls: urlDatabase };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(400).send('Status code 400: empty fields detected');
  } else if (checkByEmail(email, users)) {
    res.status(400).send('Status code 400: e-mail already exists');
  } else {
    users[id] = { id, email, password };
    res.cookie('user_id', users[id]['id']);
    res.redirect("/urls");
  }
});

app.get("/login", (req, res) => {
  const user_id = users[req.cookies["user_id"]];
  const templateVars = { user_id, urls: urlDatabase };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(400).send('Status code 400: empty fields detected');
  } else if (!checkByEmail(email, users)) {
    res.status(403).send('Status code 403: email not found');
  } else if (checkByEmail(email, users) && checkByEmail(email, users).password !== password) {
    res.status(403).send('Status code 403: incorrect password');
  } else if (checkByEmail(email, users) && checkByEmail(email, users).password === password) {
    const user_id = checkByEmail(email, users);
    res.cookie('user_id', user_id['id']);
    res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id')
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  const newShortUrl = generateRandomString();
  urlDatabase[newShortUrl] = req.body.longURL;
  res.redirect(`/urls/${newShortUrl}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  if (req.body.longURL) {
    urlDatabase[req.params.shortURL] = req.body.longURL;
    res.redirect("/urls");
  }
  res.redirect(`/urls/${req.params.shortURL}`);
});

app.get("/urls/:shortURL", (req, res) => {
  const user_id = users[req.cookies["user_id"]];
  const templateVars = { user_id, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});