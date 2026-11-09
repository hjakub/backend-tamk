const express = require("express");
const app = express();

app.use(express.json());

// starting data
let movies = [
  {
    id: 1,
    title: "Inception",
    director: "Christopher Nolan",
    year: 2010,
  },
  {
    id: 2,
    title: "The Matrix",
    director: "The Wachowskis",
    year: 1999,
  },
  {
    id: 3,
    title: "Parasite",
    director: "Bong Joon-ho",
    year: 2019,
  },
];

// validation function
function validateMovie(body, partial = false) {
  const errors = [];
  const maximumYear = new Date().getFullYear() + 5;

  if (!partial && body.title === undefined) {
    errors.push("title is required");
  }

  if (
    body.title !== undefined &&
    (typeof body.title !== "string" || body.title.trim().length === 0)
  ) {
    errors.push("title must be a non-empty string");
  }

  if (!partial && body.year === undefined) {
    errors.push("year is required");
  }

  if (
    body.year !== undefined &&
    (!Number.isInteger(body.year) ||
      body.year < 1888 ||
      body.year > maximumYear)
  ) {
    errors.push("year must be a valid integer");
  }

  if (!partial && body.genre === undefined) {
    errors.push("genre is required");
  }

  if (
    body.genre !== undefined &&
    (typeof body.genre !== "string" || body.genre.trim().length === 0)
  ) {
    errors.push("genre must be a non-empty string");
  }

  return errors;
}

// GET /movies
app.get("/movies", (req, res) => {
  res.json(movies);
});

// GET /movies/:id
app.get("/movies/:id", (req, res) => {
  const movieId = parseInt(req.params.id);
  const movie = movies.find((m) => m.id === movieId);
  if (!movie) {
    return res.status(404).json({
      error: {
        code: "MOVIE_NOT_FOUND",
        message: "movie not found",
      },
    });
  }
  res.json(movie);
});

// POST /movies
app.post("/movies", (req, res) => {
  // required data check
  const errors = validateMovie(req.body, false);
  if (errors.length > 0) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "movie data is invalid",
        details: errors,
      },
    });
  }

  const { title, director, year, genre } = req.body;
  const newId = movies.length > 0 ? movies[movies.length - 1].id + 1 : 1;
  const newMovie = {
    id: newId,
    title,
    director: director || "unknown",
    year,
    genre,
  };

  movies.push(newMovie);
  res.status(201).json(newMovie);
});

// PUT /movies/:id
app.put("/movies/:id", (req, res) => {
  const movieId = parseInt(req.params.id);
  const movieIndex = movies.findIndex((m) => m.id === movieId);

  if (movieIndex === -1) {
    return res.status(404).json({
      error: {
        code: "MOVIE_NOT_FOUND",
        message: "movie not found",
      },
    });
  }

  const { title, year, genre, director } = req.body;

  // requires data check
  const errors = validateMovie(req.body, false);
  if (errors.length > 0) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "movie data is invalid",
        details: errors,
      },
    });
  }

  movies[movieIndex] = {
    id: movieId,
    title,
    director: director || movies[movieIndex].director,
    year,
    genre,
  };

  res.json(movies[movieIndex]);
});

// PATCH /movies/:id
app.patch("/movies/:id", (req, res) => {
  const movieId = parseInt(req.params.id);
  const movie = movies.find((m) => m.id === movieId);

  if (!movie) {
    return res.status(404).json({
      error: {
        code: "MOVIE_NOT_FOUND",
        message: "movie not found",
      },
    });
  }

  const errors = validateMovie(req.body, true);
  if (errors.length > 0) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "movie data is invalid",
        details: errors,
      },
    });
  }

  const { title, director, year, genre } = req.body;

  // update only properties included in request body
  if (title !== undefined) movie.title = title;
  if (director !== undefined) movie.director = director;
  if (year !== undefined) movie.year = year;
  if (genre !== undefined) movie.genre = genre;

  res.json(movie);
});

// DELETE /movies/:id
app.delete("/movies/:id", (req, res) => {
  const movieId = parseInt(req.params.id);
  const movieIndex = movies.findIndex((m) => m.id === movieId);

  if (movieIndex === -1) {
    return res.status(404).json({
      error: {
        code: "MOVIE_NOT_FOUND",
        message: "movie not found",
      },
    });
  }

  movies.splice(movieIndex, 1);
  res.status(204).send();
});

// running the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:3000`);
});