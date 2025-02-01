import { useSelector } from "react-redux";
import { useGetTopArtistsChartsQuery } from "../redux/services/ShazamCore.js";
import { ArtistCard, Error, Loader } from "../components";

const TopArtists = () => {
  const { data, isFetching, error } = useGetTopArtistsChartsQuery(
    "5r3wPya2PpeTTsXsGhQU8O"
  );
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  if (isFetching) return <Loader title="Loading Top Charts" />;

  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
        Discover Top Artists
      </h2>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {data?.artists?.map((song, i) => (
          <ArtistCard
            key={song.key}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={data}
            i={i}
          />
        ))}
      </div>
    </div>
  );
};

export default TopArtists;
