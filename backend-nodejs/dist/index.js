"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const routeController = require("./controllers/routeController");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
    res.send("Server is up and running");
});
app.get("/around-you/:countryCode", routeController.aroundYouController);
app.get("/new-releases", routeController.newReleaseSongController);
app.get("/top-charts", routeController.topChartsController);
app.get("/search/:searchTerm", routeController.searchTermController);
app.get("/artists/top-charts/:artistId", routeController.topArtistsChartsController);
app.get("/artists/details/:artistId", routeController.artistsDetailsController);
app.get("/artists/albums/:artistId", routeController.artistsAlbumsController);
app.get("/albums/songs/:albumId", routeController.albumSongsController);
app.get("/songs/:genre", routeController.genreSongsController);
app.listen(8000, () => {
    console.log(`Server running at http://localhost:8000`);
});
