import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper";
import PlayPause from "./PlayPause";
import { playPause, setActiveSong } from "../redux/features/playerSlice";
import {
  useGetTopArtistsChartsQuery,
  useGetTopChartsQuery,
} from "../redux/services/ShazamCore.js";
import "swiper/css";
import "swiper/css/free-mode";
import Cookies from "universal-cookie";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TopChartCard = ({
  song,
  i,
  isPlaying,
  activeSong,
  handlePauseClick,
  handlePlayClick,
}) => {
  return (
    <div
      className={`w-full flex flex-row items-center hover:bg-[#4c426e] ${
        activeSong?.title === song?.title ? "bg-[#4c426e]" : "bg-transparent"
      } py-2 p-4 rounded-lg cursor-pointer mb-2`}
    >
      <h3 className="font-bold text-base text-white mr-3">{i + 1}.</h3>
      <div className="flex-1 flex flex-row justify-between items-center">
        <img
          className="w-20 h-20 rounded-lg"
          src={song?.images?.[0].url}
          alt={song?.name}
        />
        <div className="flex-1 flex flex-col justify-center mx-3">
          {/* <Link to={`/songs/${song.id}`}>
            <p className="text-xl font-bold text-white">{song?.name}</p>
          </Link> */}
          <p className="text-xl font-bold text-white">{song?.name}</p>
          {song?.artists?.[0] && (
            <Link to={`/artists/${song?.artists?.[0].id}`}>
              <p className="text-base text-gray-300 mt-1">
                {song?.artists?.[0].name}
              </p>
            </Link>
          )}
        </div>
      </div>
      <PlayPause
        isPlaying={isPlaying}
        activeSong={activeSong}
        song={song}
        handlePause={handlePauseClick}
        handlePlay={handlePlayClick}
      />
    </div>
  );
};

const TopPlay = () => {
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  let { data } = useGetTopChartsQuery();
  let topArtistsData = useGetTopArtistsChartsQuery("0TnOYISbd1XYRBk9myaseg");
  const divRef = useRef(null);
  const [SongDetails, setSongDetails] = useState({});

  data = data?.albums?.items;
  topArtistsData = topArtistsData?.data?.artists;

  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const getSongDetails = async (song) => {
    const albumId = song.uri.split(":")[2];
    let res = await fetch(`${BACKEND_URL}/albums/songs/${albumId}`, {
      headers: {
        Authorization: `Bearer ${cookies.get("access_token")}`,
      },
    });
    res = await res.json();
    const songData = res?.tracks?.items[0];
    songData.metadata = song;
    setSongDetails(songData);
  };
  const handlePlayClick = async (song, i) => {
    await getSongDetails(song);
    dispatch(setActiveSong({ SongDetails, data, i }));
    dispatch(playPause(true));
  };

  return (
    <div
      ref={divRef}
      className="xl:ml-6 ml-0 xl:mb-0 mb-6 flex-1 xl:max-w-[500px] max-w-full flex flex-col"
    >
      <div className="w-full flex flex-col">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-white font-bold text-2xl">Top Charts</h2>
          <Link to="/top-charts">
            <p className="text-gray-300 text-base cursor-pointer">See more</p>
          </Link>
        </div>
        <div className="mt-4 flex flex-col gap-1">
          {data?.slice(0, 5).map((song, i) => (
            <TopChartCard
              key={song.id}
              song={song}
              i={i}
              isPlaying={isPlaying}
              activeSong={activeSong}
              handlePauseClick={handlePauseClick}
              handlePlayClick={() => handlePlayClick(song, i)}
            />
          ))}
        </div>
      </div>
      <div className="w-full flex flex-col mt-8">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-white font-bold text-2xl">Top Artists</h2>
          <Link to="/top-artists">
            <p className="text-gray-300 text-base cursor-pointer">See more</p>
          </Link>
        </div>
        <Swiper
          slidesPerView="auto"
          spaceBetween={15}
          freeMode
          centeredSlides
          centeredSlidesBounds
          modules={[FreeMode]}
          className="mt-4"
        >
          {topArtistsData?.map((artist, idx) => {
            return (
              <SwiperSlide
                key={idx}
                style={{ width: "25%", height: "auto" }}
                className="shadow-lg rounded-full animate-slideright"
              >
                <Link to={`#`}>
                  <img
                    src={artist?.images[0]?.url}
                    alt="Name"
                    className="rounded-full w-full object-cover"
                  />
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default TopPlay;
