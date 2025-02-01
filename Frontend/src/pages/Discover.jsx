import { useSelector } from "react-redux";
import { Error, Loader, SongCard, TopPlay } from "../components";
import { genres } from "../assets/constants";
import { useGetRandomSongsQuery } from "../redux/services/ShazamCore.js";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

const Discover = () => {
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const cookies = new Cookies();
  const { data, isFetching, error } = useGetRandomSongsQuery();
  const [songGenre, setSongGenre] = useState("Pop");
  const [genreSongData, setGenreSongData] = useState(null);

  // Fetch songs based on the selected genre
  const getGenreRelatedSongs = async (genre) => {
    try {
      const res = await fetch(`http://localhost:8000/songs/${genre}`, {
        headers: {
          Authorization: `Bearer ${cookies.get("access_token")}`,
        },
      });
      const json = await res.json();
      setGenreSongData(json);
    } catch (err) {
      console.error("Error fetching genre-related songs:", err);
    }
  };

  useEffect(() => {
    getGenreRelatedSongs(songGenre);
  }, [songGenre]);

  useEffect(() => {
    if (data) setGenreSongData(data);
  }, [data]);

  if (isFetching) return <Loader title="Loading songs..." />;
  if (error) return <Error />;

  return (
    <div className="flex justify-center items-start">
      <div className="flex flex-col w-2/3">
        <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
          <h2 className="font-bold text-3xl text-white text-left">
            Discover {songGenre}
          </h2>
          <select
            onChange={(e) => setSongGenre(e.target.value)}
            value={songGenre}
            className="bg-black text-gray-300 p-3 text-sm rounded-lg outline-none sm:mt-0 mt-5"
          >
            {genres.map((genre) => (
              <option value={genre.value} key={genre.value}>
                {genre.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap sm:justify-start justify-center gap-8">
          {genreSongData?.albums?.items?.map((song, i) => (
            <SongCard
              key={i}
              song={song}
              i={i}
              activeSong={activeSong}
              isPlaying={isPlaying}
              data={data}
            />
          ))}
        </div>
      </div>
      <div className="xl:sticky top-0 w-1/3">
        <TopPlay />
      </div>
    </div>
  );
};

export default Discover;
