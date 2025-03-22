const ioredis = require("ioredis");
// const redis = new ioredis({
//   host: process.env.REDIS_HOST || "localhost", // Use 'redis' from the Docker Compose file
//   port: process.env.REDIS_PORT || 6379,
// });
const redis = new ioredis(
  "redis://default:8ohlGoz30Tf46t7aM676flbZ4Or9OdFV@redis-14897.c301.ap-south-1-1.ec2.redns.redis-cloud.com:14897"
);

const aroundYouController = async (req: any, res: any) => {
  const { countryCode } = req.params;
  const access_token = req.headers.authorization.split(" ")[1];

  if (!countryCode) {
    return res.status(400).send({ error: "countryCode is required" });
  }

  try {
    const cachedResult = await redis.get(`songs/${countryCode}`);
    if (cachedResult) {
      console.log("Cache hit");
      return res.json(JSON.parse(cachedResult));
    }

    console.log("Cache miss");
    const fetchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=top+songs&type=album&market=${countryCode}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!fetchResponse.ok) {
      return res
        .status(fetchResponse.status)
        .send({ error: "Failed to fetch data from Spotify" });
    }

    const data = await fetchResponse.json();
    await redis.set(`songs/${countryCode}`, JSON.stringify(data), "EX", 3600); // Cache for 1 hour
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
const newReleaseSongController = async (req: any, res: any) => {
  const access_token = req.headers.authorization.split(" ")[1];

  try {
    const cachedResult = await redis.get("newReleaseSongs");
    if (cachedResult) {
      console.log("Cache hit");
      return res.json(JSON.parse(cachedResult));
    }

    console.log("Cache miss");
    const fetchResponse = await fetch(
      `https://api.spotify.com/v1/browse/new-releases`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!fetchResponse.ok) {
      return res
        .status(fetchResponse.status)
        .send({ error: "Failed to fetch data from Spotify" });
    }

    const data = await fetchResponse.json();
    await redis.set("newReleaseSongs", JSON.stringify(data), "EX", 3600); // Cache for 1 hour
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
const topChartsController = async (req: any, res: any) => {
  const access_token = req.headers.authorization.split(" ")[1];

  try {
    const cachedResult = await redis.get("topCharts");
    if (cachedResult) {
      console.log("Cache hit");
      return res.json(JSON.parse(cachedResult));
    }

    console.log("Cache miss");
    const fetchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=top+charts&type=album`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!fetchResponse.ok) {
      return res
        .status(fetchResponse.status)
        .send({ error: "Failed to fetch data from Spotify" });
    }

    const data = await fetchResponse.json();
    await redis.set("topCharts", JSON.stringify(data), "EX", 3600); // Cache for 1 hour
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
const searchTermController = async (req: any, res: any) => {
  const { searchTerm } = req.params;
  const access_token = req.headers.authorization.split(" ")[1];

  try {
    const cachedResult = await redis.get(`searchTerm/${searchTerm}`);
    if (cachedResult) {
      console.log("Cache hit");
      return res.json(JSON.parse(cachedResult));
    }

    console.log("Cache miss");
    const fetchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${searchTerm}&type=album`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!fetchResponse.ok) {
      return res
        .status(fetchResponse.status)
        .send({ error: "Failed to fetch data from Spotify" });
    }

    const data = await fetchResponse.json();
    await redis.set(
      `searchTerm/${searchTerm}`,
      JSON.stringify(data),
      "EX",
      1800
    ); // Cache for 1 hour
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
const topArtistsChartsController = async (req: any, res: any) => {
  const { artistId } = req.params;
  const access_token = req.headers.authorization.split(" ")[1];

  try {
    const cachedResult = await redis.get(`topArtistsCharts/${artistId}`);
    if (cachedResult) {
      console.log("Cache hit");
      return res.json(JSON.parse(cachedResult));
    }

    console.log("Cache miss");
    const fetchResponse = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!fetchResponse.ok) {
      return res
        .status(fetchResponse.status)
        .send({ error: "Failed to fetch data from Spotify" });
    }

    const data = await fetchResponse.json();
    await redis.set(
      `topArtistsCharts/${artistId}`,
      JSON.stringify(data),
      "EX",
      1800
    ); // Cache for 1 hour
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
const artistsDetailsController = async (req: any, res: any) => {
  const { artistId } = req.params;
  const access_token = req.headers.authorization.split(" ")[1];

  try {
    const cachedResult = await redis.get(`artistsDetails/${artistId}`);
    if (cachedResult) {
      console.log("Cache hit");
      return res.json(JSON.parse(cachedResult));
    }

    console.log("Cache miss");
    const fetchResponse = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!fetchResponse.ok) {
      return res
        .status(fetchResponse.status)
        .send({ error: "Failed to fetch data from Spotify" });
    }

    const data = await fetchResponse.json();
    await redis.set(
      `artistsDetails/${artistId}`,
      JSON.stringify(data),
      "EX",
      1800
    ); // Cache for 1 hour
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
const artistsAlbumsController = async (req: any, res: any) => {
  const { artistId } = req.params;
  const access_token = req.headers.authorization.split(" ")[1];

  try {
    const cachedResult = await redis.get(`artistsAlbums/${artistId}`);
    if (cachedResult) {
      console.log("Cache hit");
      return res.json(JSON.parse(cachedResult));
    }

    console.log("Cache miss");
    const fetchResponse = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/albums`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!fetchResponse.ok) {
      return res
        .status(fetchResponse.status)
        .send({ error: "Failed to fetch data from Spotify" });
    }

    const data = await fetchResponse.json();
    await redis.set(
      `artistsAlbums/${artistId}`,
      JSON.stringify(data),
      "EX",
      1800
    ); // Cache for 1 hour
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
const albumSongsController = async (req: any, res: any) => {
  const { albumId } = req.params;
  const access_token = req.headers.authorization.split(" ")[1];

  try {
    const cachedResult = await redis.get(`albumSongs/${albumId}`);
    if (cachedResult) {
      console.log("Cache hit");
      return res.json(JSON.parse(cachedResult));
    }

    console.log("Cache miss");
    const fetchResponse = await fetch(
      `https://api.spotify.com/v1/albums/${albumId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!fetchResponse.ok) {
      return res
        .status(fetchResponse.status)
        .send({ error: "Failed to fetch data from Spotify" });
    }

    const data = await fetchResponse.json();
    await redis.set(`albumSongs/${albumId}`, JSON.stringify(data), "EX", 1800); // Cache for 1 hour
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
const genreSongsController = async (req: any, res: any) => {
  const { genre } = req.params;
  const access_token = req.headers.authorization.split(" ")[1];

  try {
    const cachedResult = await redis.get(`genreSongs/${genre}`);
    if (cachedResult) {
      console.log("Cache hit");
      return res.json(JSON.parse(cachedResult));
    }

    console.log("Cache miss");
    const fetchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${genre}+songs&type=album&include_external=audio`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!fetchResponse.ok) {
      return res
        .status(fetchResponse.status)
        .send({ error: "Failed to fetch data from Spotify" });
    }

    const data = await fetchResponse.json();
    await redis.set(`genreSongs/${genre}`, JSON.stringify(data), "EX", 1800); // Cache for 1 hour
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

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
