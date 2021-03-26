const express = require("express");
var jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

var movies = [
  {
    id: "1",
    Title: "Titanic",
    Director: "James",
    release_year: "2020-12-22"
  },
  {
    id: "2",
    Title: "Title_2",
    Director: "James gohsling",
    release_year: "2012-12-22"
  }
];

app.get("/movies", (req, res) => {
  res.json(movies);
});

app.post("/movie/add", (req, res) => {
  const movie = req.body;
  movies.push(movie);
  res.send("Movie added successfully");
});

app.post("/api/post", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretKey", (err, authData) => {
    if (err) {
      res.sendStatus(403); //Forbidden
    } else {
      res.json({ message: "Post created...", authData });
    }
  });
});

app.post("/api/login", (req, res) => {
  var user = {
    id: "1",
    name: "sandeep Mishra",
    email: "sandeepmishra@gmail.com"
  };
  jwt.sign({ user: user }, "secretKey", (err, token) => {
    res.json({ token });
  });
});

// Middleware for verifying token
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader != "undefined") {
    const bearerToken = bearerHeader.split("  ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403); //forbidden
  }
}

app.get("/movies/:id", (req, res) => {
  const id = req.params.id;
  for (let movie of movies) {
    if (movie.id === id) {
      res.json(movie);
      return;
    }
    res.status(404).send("Movie not found");
  }
});

app.delete("/delete/:id", (req, res) => {
  var id = req.params.id;
  movies = movies.filter(movie => {
    if (movie.id != id) return true;

    return false;
  });
  res.send("Movie has been deleted");
});

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
