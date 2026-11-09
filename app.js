const express = require("express");
const app = express();

app.use(express.json());

// starting data
let movies = [
  {
    id: 1,
    title: "Inception",
    director: "Christopher Nolan",
    year: 2010
  },
  {
    id: 2,
    title: "The Matrix",
    director: "The Wachowskis",
    year: 1999
  },
  {
    id: 3,
    title: "Parasite",
    director: "Bong Joon-ho",
    year: 2019
  }
];

// GET /movies
app.get("/movies", (req, res) => {
  res.json(movies);
});

// GET /movies/:id
app.get("/movies/:id", (req, res) => {
  const movieId = parseInt(req.params.id);
  const movie = movies.find(m => m.id === movieId);
  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }
  res.json(movie);
});

// POST /movies
app.post("/movies", (req, res) => {
  const { title, director, year } = req.body;

  // required data check
  if (!title || !director || !year) {
    return res.status(400).json({ error: "title, director and year are required" });
  }

  const newId = movies.length > 0 ? movies[movies.length - 1].id + 1 : 1;
  const newMovie = {
    id: newId,
    title,
    director,
    year
  };

  movies.push(newMovie);
  res.status(201).json(newMovie);
});

// running the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:3000`);
});