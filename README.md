SE01 Project

This is my project for the SE01 module. It's a postcard app where you can create and share digital postcards.

The pages are:
- / (home page)
- /create_postcard (create a new postcard)
- /view_postcard (open a postcard)

On the create page you can pick a city (Berlin, Paris or Amsterdam), write a title and a message, and add a username. When you submit the form, the postcard gets saved to a database and you get an ID back.

On the view page you can search for a postcard by its ID or by a username with @ in front of it (like @devin). If you search by username it shows all postcards from that user.

The postcard preview updates live while you type, without reloading the page.

The backend is built with Node.js and Express. I used EJS as a templating language to render dynamic HTML on the server. The data gets stored in a MongoDB database and I used Mongoose to connect to it and define the postcard model. Sensitive data like the database URL is stored in a .env file and not pushed to GitHub.


I used media queries to make the layout responsive. The site works on mobile and desktop.