const express = require("express");
const path = require("path");

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const PORT = 3000;

app.use(express.static(__dirname));

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
  res.render('create_postcard');
});


const cards = [
    { id: 1, title: "Card One", text: "Some information about CODE UNIVERSITY" },
    { id: 2, title: "Card Two", text: "Some information about the SE19 Learning Unit" },
    { id: 3, title: "Card Three", text: "Some information about Berlin, Neukölln" },
];

app.get("/cards/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const card = cards.find((c) => c.id === id);

    if (!card) {
        return res.status(404).send("<h1>Card not found</h1>");
    }

    res.send(`
      <html>
        <head>
          <link rel="stylesheet" href="/style.css">
          <title>${card.title}</title>
        </head>
        <body>
          <header><h1>Devin's Website</h1></header>
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>
          <main>
            <div class="card">
              <h2>${card.title}</h2>
              <p>${card.text}</p>
            </div>
          </main>
          <footer><p>Devin Koch</p></footer>
        </body>
      </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});