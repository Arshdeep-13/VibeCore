import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import PlayPause from "./PlayPause";
import { playPause, setActiveSong } from "../redux/features/playerSlice";
import { useState } from "react";

const SongCard = ({ song, i, isPlaying, activeSong, data }) => {
  const dispatch = useDispatch();
  const [SongDetails, setSongDetails] = useState({});

  const { access_token, refresh_token } = useSelector((state) => state.player);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };
  const handlePlayClick = async () => {
    await getSongDetails(song, data);
    dispatch(setActiveSong({ SongDetails, data, i }));
    dispatch(playPause(true));
  };
  const getSongDetails = async () => {
    const albumId = song.uri.split(":")[2];
    let res = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    res = await res.json();
    const songData = res?.tracks?.items[0];
    songData.metadata = song;
    setSongDetails(songData);
  };

  const image = song?.images?.[0].url
    ? song?.images?.[0].url
    : song?.coverArt?.sources[0]?.url;

  return (
    <div className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
      <div className="relative w-full h-56 group">
        <div
          className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex ${
            activeSong?.title === song.name
              ? "flex bg-black bg-opacity-70"
              : "hidden"
          }`}
        >
          <PlayPause
            song={song}
            handlePause={handlePauseClick}
            handlePlay={handlePlayClick}
            isPlaying={isPlaying}
            activeSong={activeSong}
          />
        </div>
        <img src={image ?? "./src/assets/img.png"} alt="song_img" />
      </div>
      <div className="mt-4 flex flex-col">
        <p className="font-semibold text-lg text-white truncate">
          {/* <Link to={`/songs/${song.key}`}>{song.title}</Link> */}
          <p>{song.title}</p>
        </p>
        <p className="text-sm truncate text-gray-300 mt-1">
          <Link
            to={
              song.artists
                ? `artists/${song?.artists[0]?.id}`
                : "/get-latest-release"
            }
          >
            {song.name}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SongCard;
