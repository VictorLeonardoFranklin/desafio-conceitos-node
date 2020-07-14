const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  //return all repositories
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  //Get Params
  const { title, url, techs } = request.body;
  //Create repository object
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };
  //add object to repositories
  repositories.push(repository);
  //return repository
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  // Get ID
  const { id } = request.params;
  // Get Params
  const { title, url, techs } = request.body;
  // Find repository
  const repositoryIndex = repositories.findIndex(rep => rep.id === id);
  //check if repository exits
  if (repositoryIndex < 0) {
    return response.status(400).json({ "error": "Repository not found." });
  }

  const likes = repositories[repositoryIndex].likes;

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  };
  repositories[repositoryIndex] = repository;
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  // Get ID
  const { id } = request.params;
  // Find repository
  const repositoryIndex = repositories.findIndex(rep => rep.id === id);
  if (repositoryIndex < 0) {
    return response.status(400).send();
  }
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repository = repositories.find(rep => rep.id === id);
  if (!repository) {
    return response.status(400).send();
  }
  repository.likes += 1;
  return response.json(repository);
});

module.exports = app;
