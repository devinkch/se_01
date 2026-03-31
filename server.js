require('dotenv').config();

const express = require("express");
const mongoose = require('mongoose');
const path = require("path");

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


mongoose.connect(process.env.MONGODB_URI);

const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.render('index');
});


app.get("/about", (req, res) => {
    res.render('about');
});

app.get("/contact", (req, res) => {
    res.render('contact');
});

app.post('/create_postcard', async (req, res) => {
  const postcard = new Postcard(req.body);
  await postcard.save();
  res.render('create_postcard', { savedId: postcard._id });
});

app.get("/create_postcard", (req, res) => {
  res.render('create_postcard', { savedId: null });
});


const Postcard = mongoose.model('Postcard', {
  city: String,
  title: String,
  message: String
});

app.use(express.urlencoded({ extended: true }));
app.post('/create_postcard', async (req, res) => {
  const postcard = new Postcard(req.body);
  await postcard.save();
  res.redirect('/');
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});