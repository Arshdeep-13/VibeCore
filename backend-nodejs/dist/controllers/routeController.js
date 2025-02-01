"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const ioredis = require("ioredis");
const redis = new ioredis();
const aroundYouController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { countryCode } = req.params;
    const access_token = req.headers.authorization.split(" ")[1];
    if (!countryCode) {
        return res.status(400).send({ error: "countryCode is required" });
    }
    try {
        const cachedResult = yield redis.get(`songs/${countryCode}`);
        if (cachedResult) {
            console.log("Cache hit");
            return res.json(JSON.parse(cachedResult));
        }
        console.log("Cache miss");
        const fetchResponse = yield fetch(`https://api.spotify.com/v1/search?q=top+songs&type=album&market=${countryCode}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        if (!fetchResponse.ok) {
            return res
                .status(fetchResponse.status)
                .send({ error: "Failed to fetch data from Spotify" });
        }
        const data = yield fetchResponse.json();
        yield redis.set(`songs/${countryCode}`, JSON.stringify(data), "EX", 3600); // Cache for 1 hour
        return res.json(data);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
const newReleaseSongController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const access_token = req.headers.authorization.split(" ")[1];
    try {
        const cachedResult = yield redis.get("newReleaseSongs");
        if (cachedResult) {
            console.log("Cache hit");
            return res.json(JSON.parse(cachedResult));
        }
        console.log("Cache miss");
        const fetchResponse = yield fetch(`https://api.spotify.com/v1/browse/new-releases`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        if (!fetchResponse.ok) {
            return res
                .status(fetchResponse.status)
                .send({ error: "Failed to fetch data from Spotify" });
        }
        const data = yield fetchResponse.json();
        yield redis.set("newReleaseSongs", JSON.stringify(data), "EX", 3600); // Cache for 1 hour
        return res.json(data);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
const topChartsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const access_token = req.headers.authorization.split(" ")[1];
    try {
        const cachedResult = yield redis.get("topCharts");
        if (cachedResult) {
            console.log("Cache hit");
            return res.json(JSON.parse(cachedResult));
        }
        console.log("Cache miss");
        const fetchResponse = yield fetch(`https://api.spotify.com/v1/search?q=top+charts&type=album`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        if (!fetchResponse.ok) {
            return res
                .status(fetchResponse.status)
                .send({ error: "Failed to fetch data from Spotify" });
        }
        const data = yield fetchResponse.json();
        yield redis.set("topCharts", JSON.stringify(data), "EX", 3600); // Cache for 1 hour
        return res.json(data);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
const searchTermController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = req.params;
    const access_token = req.headers.authorization.split(" ")[1];
    try {
        const cachedResult = yield redis.get(`searchTerm/${searchTerm}`);
        if (cachedResult) {
            console.log("Cache hit");
            return res.json(JSON.parse(cachedResult));
        }
        console.log("Cache miss");
        const fetchResponse = yield fetch(`https://api.spotify.com/v1/search?q=${searchTerm}&type=album`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        if (!fetchResponse.ok) {
            return res
                .status(fetchResponse.status)
                .send({ error: "Failed to fetch data from Spotify" });
        }
        const data = yield fetchResponse.json();
        yield redis.set(`searchTerm/${searchTerm}`, JSON.stringify(data), "EX", 1800); // Cache for 1 hour
        return res.json(data);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
const topArtistsChartsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { artistId } = req.params;
    const access_token = req.headers.authorization.split(" ")[1];
    try {
        const cachedResult = yield redis.get(`topArtistsCharts/${artistId}`);
        if (cachedResult) {
            console.log("Cache hit");
            return res.json(JSON.parse(cachedResult));
        }
        console.log("Cache miss");
        const fetchResponse = yield fetch(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        if (!fetchResponse.ok) {
            return res
                .status(fetchResponse.status)
                .send({ error: "Failed to fetch data from Spotify" });
        }
        const data = yield fetchResponse.json();
        yield redis.set(`topArtistsCharts/${artistId}`, JSON.stringify(data), "EX", 1800); // Cache for 1 hour
        return res.json(data);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
const artistsDetailsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { artistId } = req.params;
    const access_token = req.headers.authorization.split(" ")[1];
    try {
        const cachedResult = yield redis.get(`artistsDetails/${artistId}`);
        if (cachedResult) {
            console.log("Cache hit");
            return res.json(JSON.parse(cachedResult));
        }
        console.log("Cache miss");
        const fetchResponse = yield fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        if (!fetchResponse.ok) {
            return res
                .status(fetchResponse.status)
                .send({ error: "Failed to fetch data from Spotify" });
        }
        const data = yield fetchResponse.json();
        yield redis.set(`artistsDetails/${artistId}`, JSON.stringify(data), "EX", 1800); // Cache for 1 hour
        return res.json(data);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
const artistsAlbumsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { artistId } = req.params;
    const access_token = req.headers.authorization.split(" ")[1];
    try {
        const cachedResult = yield redis.get(`artistsAlbums/${artistId}`);
        if (cachedResult) {
            console.log("Cache hit");
            return res.json(JSON.parse(cachedResult));
        }
        console.log("Cache miss");
        const fetchResponse = yield fetch(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        if (!fetchResponse.ok) {
            return res
                .status(fetchResponse.status)
                .send({ error: "Failed to fetch data from Spotify" });
        }
        const data = yield fetchResponse.json();
        yield redis.set(`artistsAlbums/${artistId}`, JSON.stringify(data), "EX", 1800); // Cache for 1 hour
        return res.json(data);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
const albumSongsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { albumId } = req.params;
    const access_token = req.headers.authorization.split(" ")[1];
    try {
        const cachedResult = yield redis.get(`albumSongs/${albumId}`);
        if (cachedResult) {
            console.log("Cache hit");
            return res.json(JSON.parse(cachedResult));
        }
        console.log("Cache miss");
        const fetchResponse = yield fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        if (!fetchResponse.ok) {
            return res
                .status(fetchResponse.status)
                .send({ error: "Failed to fetch data from Spotify" });
        }
        const data = yield fetchResponse.json();
        yield redis.set(`albumSongs/${albumId}`, JSON.stringify(data), "EX", 1800); // Cache for 1 hour
        return res.json(data);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
const genreSongsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { genre } = req.params;
    const access_token = req.headers.authorization.split(" ")[1];
    try {
        const cachedResult = yield redis.get(`genreSongs/${genre}`);
        if (cachedResult) {
            console.log("Cache hit");
            return res.json(JSON.parse(cachedResult));
        }
        console.log("Cache miss");
        const fetchResponse = yield fetch(`https://api.spotify.com/v1/search?q=${genre}+songs&type=album&include_external=audio`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        if (!fetchResponse.ok) {
            return res
                .status(fetchResponse.status)
                .send({ error: "Failed to fetch data from Spotify" });
        }
        const data = yield fetchResponse.json();
        yield redis.set(`genreSongs/${genre}`, JSON.stringify(data), "EX", 1800); // Cache for 1 hour
        return res.json(data);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
module.exports = {
    aroundYouController,
    newReleaseSongController,
    topChartsController,
    searchTermController,
    topArtistsChartsController,
    artistsDetailsController,
    artistsAlbumsController,
    albumSongsController,
    genreSongsController,
};
