require('dotenv').config();

const express = require("express");
const mongoose = require('mongoose');
const path = require("path");
const crypto = require('crypto');

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
  username: String,
  createdAt: { type: Date, default: Date.now },
  editToken: { type: String }
});


app.post('/create_postcard', async (req, res) => {
  const { city, title, message, username } = req.body;
  if (!city || !title || !message || !username) {
    return res.render('create_postcard', {
      savedId: null,
      savedPostcard: req.body,
      error: 'Please fill in all fields before creating your postcard.',
      editToken: null
    });
  }

  try {
    const editToken = crypto.randomBytes(16).toString('hex');
    const postcard = new Postcard({ ...req.body, editToken });
    await postcard.save();
    res.render('create_postcard', {
      savedId: postcard._id,
      savedPostcard: postcard,
      editToken: editToken,
      error: null
    });
  } catch (e) {
    res.render('create_postcard', {
      savedId: null,
      savedPostcard: req.body,
      error: 'Something went wrong. Please try again.',
      editToken: null
    });
  }
});

const PORT = 3000;


app.get("/", (req, res) => {
  res.render('index');
});



app.get("/create_postcard", (req, res) => {
  res.render('create_postcard', { savedId: null, savedPostcard: null, error: null, editToken: null });
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


app.get('/edit_postcard/:id', async (req, res) => {
  try {
    const postcard = await Postcard.findById(req.params.id);
    if (!postcard) {
      return res.render('view_postcard', { postcard: null, postcards: null, error: 'Postcard not found' });
    }
    const TEN_MINUTES = 10 * 60 * 1000;
    const isEditable = (Date.now() - postcard.createdAt.getTime()) < TEN_MINUTES;
    if (!isEditable) {
      return res.render('view_postcard', { postcard, postcards: null, error: 'This postcard can no longer be edited (10 minute window has passed).' });
    }
    res.render('edit_postcard', { postcard, token: req.query.token, error: null });
  } catch (e) {
    res.render('view_postcard', { postcard: null, postcards: null, error: 'Invalid ID' });
  }
});


app.post('/edit_postcard/:id', async (req, res) => {
  try {
    const postcard = await Postcard.findById(req.params.id);
    if (!postcard) {
      return res.render('view_postcard', { postcard: null, postcards: null, error: 'Postcard not found' });
    }

    const TEN_MINUTES = 10 * 60 * 1000;
    const isEditable = (Date.now() - postcard.createdAt.getTime()) < TEN_MINUTES;

    if (!isEditable) {
      return res.render('view_postcard', { postcard, postcards: null, error: 'This postcard can no longer be edited.' });
    }
    if (req.body.token !== postcard.editToken) {
      return res.render('edit_postcard', { postcard, token: req.body.token, error: 'Invalid edit token.' });
    }

    const { city, title, message, username } = req.body;
    await Postcard.findByIdAndUpdate(req.params.id, { city, title, message, username });

    res.redirect('/view_postcard?query=' + req.params.id);
  } catch (e) {
    res.render('view_postcard', { postcard: null, postcards: null, error: 'Something went wrong.' });
  }
});

app.post('/delete_postcard/:id', async (req, res) => {
  try {
    const postcard = await Postcard.findById(req.params.id);
    if (!postcard) {
      return res.render('view_postcard', { postcard: null, postcards: null, error: 'Postcard not found' });
    }

    const TEN_MINUTES = 10 * 60 * 1000;
    const isEditable = (Date.now() - postcard.createdAt.getTime()) < TEN_MINUTES;

    if (!isEditable) {
      return res.render('view_postcard', { postcard, postcards: null, error: 'This postcard can no longer be deleted.' });
    }
    if (req.body.token !== postcard.editToken) {
      return res.render('view_postcard', { postcard, postcards: null, error: 'Invalid edit token.' });
    }

    await Postcard.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (e) {
    res.render('view_postcard', { postcard: null, postcards: null, error: 'Something went wrong.' });
  }
});




app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});