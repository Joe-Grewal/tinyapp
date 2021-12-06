const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const { getUserByEmail, generateRandomString, urlsForUser } = require('./helpers');

const app = express();
app.use(cookieSession({
  name: 'session',
  secret: 'JoeGrewal' 
}));
const PORT = 8080;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  }
}

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "userRandomID" }
};

//==============================
// Requests
//==============================
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const user_id = users[req.session.user_id];
  const templateVars = { user_id, urls: urlsForUser(user_id, urlDatabase) };
  res.render("urls_index", templateVars);
});

// Registration
app.get("/register", (req, res) => {
  const user_id = users[req.session.user_id];
  const templateVars = { user_id };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (!email || !password) {
    res.status(400).send('Status code 400: empty fields detected');
  } else if (getUserByEmail(email, users)) {
    res.status(400).send('Status code 400: e-mail already exists');
  } else {
    users[id] = { id, email, hashedPassword };
    req.session.user_id = users[id]['id'];
    res.redirect("/urls");
  }
});

// Login
app.get("/login", (req, res) => {
  const user_id = users[req.session.user_id];
  const templateVars = { user_id, urls: urlDatabase };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user_id = getUserByEmail(email, users);
  if (!email || !password) {
    res.status(400).send('Status code 400: empty fields detected');
  } else if (!user_id) {
    res.status(403).send('Status code 403: email not found');
  } else if (!bcrypt.compareSync(password, user_id.hashedPassword)) {
    res.status(403).send('Status code 403: incorrect password');
  } else {
    req.session.user_id = user_id['id'];
    res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// Creating/Editing Urls
app.get("/urls/new", (req, res) => {
  const user_id = users[req.session.user_id];
  const templateVars = { user_id };
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  const user_id = users[req.session.user_id];
  if (!req.body.longURL) {
    res.status(400).send('Status code 400: empty field detected');
  } else {
    const newShortUrl = generateRandomString();
    urlDatabase[newShortUrl] = { longURL: req.body.longURL, userID: user_id };
    res.redirect(`/urls/${newShortUrl}`);
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const user_id = users[req.session.user_id];
  if (user_id && urlDatabase[req.params.shortURL].userID === user_id) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  }
});

app.post("/urls/:shortURL", (req, res) => {
  const user_id = users[req.session.user_id];
  if (user_id && urlDatabase[req.params.shortURL].userID === user_id) {
    if (req.body.longURL) {
     urlDatabase[req.params.shortURL] = { longURL: req.body.longURL, userID: user_id };
     res.redirect("/urls");
    }
  }
  res.redirect(`/urls/${req.params.shortURL}`);
});

app.get("/urls/:shortURL", (req, res) => {
  const user_id = users[req.session.user_id];
  const templateVars = { user_id, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]['longURL'], userIDCheck: urlDatabase[req.params.shortURL].userID };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longAddress = urlDatabase[req.params.shortURL]['longURL'];
  res.redirect(longAddress);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});