require('dotenv').config();

const express = require("express");
const mongoose = require('mongoose');
const path = require("path");

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGODB_URI);

const Postcard = mongoose.model('Postcard', {
  city: String,
  title: String,
  message: String,
  username: String
});


app.post('/create_postcard', async (req, res) => {
  const postcard = new Postcard(req.body);
  await postcard.save();
  res.render('create_postcard', { 
    savedId: postcard._id,
    savedPostcard: postcard
  });
});

const PORT = 3000;


app.get("/", (req, res) => {
    res.render('index');
});


app.get("/about", (req, res) => {
    res.render('about');
});

app.get("/contact", (req, res) => {
    res.render('contact');
});



app.get("/create_postcard", (req, res) => {
  res.render('create_postcard', { savedId: null, savedPostcard: null });
});

app.get('/view_postcard', async (req, res) => {
  if (!req.query.query) {
    return res.render('view_postcard', { postcard: null, postcards: null, error: null });
  }

  try {
    const query = req.query.query.trim();

    if (query.startsWith('@')) {
      const username = query.slice(1);
      const postcards = await Postcard.find({ username: username });
      if (postcards.length === 0) {
        return res.render('view_postcard', { postcard: null, postcards: null, error: 'No postcards found for this user' });
      }
      return res.render('view_postcard', { postcard: null, postcards, error: null });
    } else {
      const postcard = await Postcard.findById(query);
      if (!postcard) {
        return res.render('view_postcard', { postcard: null, postcards: null, error: 'Postcard not found' });
      }
      return res.render('view_postcard', { postcard, postcards: null, error: null });
    }
  } catch (e) {
    res.render('view_postcard', { postcard: null, postcards: null, error: 'Invalid ID or username' });
  }
});







app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});