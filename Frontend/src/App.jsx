import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { Searchbar, Sidebar, MusicPlayer } from "./components";
import {
  ArtistDetails,
  TopArtists,
  AroundYou,
  Discover,
  Search,
  // SongDetails,
  TopCharts,
} from "./pages";
import Auth from "./pages/Auth";
import ValidateAuth from "./pages/ValidateAuth";
import Cookies from "universal-cookie";

const App = () => {
  const cookies = new Cookies();
  const { activeSong, showPlayer } = useSelector((state) => state.player);

  return (
    <div className="relative flex">
      {cookies.get("access_token") && <Sidebar />}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-black to-[#121286] h-screen">
        {cookies.get("access_token") && <Searchbar />}

        <div className="px-6 h-[calc(100vh-72px)] overflow-y-scroll hide-scrollbar flex xl:flex-row flex-col-reverse">
          <div className="flex-1 h-fit pb-40">
            <Routes>
              <Route
                path="/"
                element={cookies.get("access_token") ? <Discover /> : <Auth />}
              />
              <Route path="/callback" element={<ValidateAuth />} />
              <Route path="/login" element={<Auth />} />
              <Route
                path="/top-artists"
                element={
                  cookies.get("access_token") ? <TopArtists /> : <Auth />
                }
              />
              <Route
                path="/top-charts"
                element={cookies.get("access_token") ? <TopCharts /> : <Auth />}
              />
              <Route
                path="/around-you"
                element={cookies.get("access_token") ? <AroundYou /> : <Auth />}
              />
              <Route
                path="/artists/:id"
                element={
                  cookies.get("access_token") ? <ArtistDetails /> : <Auth />
                }
              />
              <Route path="/songs/:songid" element={<Error />} />
              <Route
                path="/search/:searchTerm"
                element={cookies.get("access_token") ? <Search /> : <Auth />}
              />
            </Routes>
          </div>
        </div>
      </div>

      {activeSong?.name && showPlayer && (
        <div className="absolute h-28 bottom-0 left-0 right-0 flex animate-slideup bg-gradient-to-br from-white/10 to-[#2a2a80] backdrop-blur-lg rounded-t-3xl z-10">
          {cookies.get("access_token") && <MusicPlayer />}
        </div>
      )}
    </div>
  );
};

export default App;
