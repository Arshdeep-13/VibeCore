import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { DetailsHeader, Error, Loader, SongCard } from "../components";

import {
  useGetArtistAlbumsQuery,
  useGetArtistDetailsQuery,
} from "../redux/services/shazamCore";

const ArtistDetails = () => {
  const { id } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const {
    data,
    isFetching: isFetchingArtistDetails,
    error,
  } = useGetArtistDetailsQuery(id);
  const ArtistAlbums = useGetArtistAlbumsQuery(id);

  if (isFetchingArtistDetails || ArtistAlbums.isFetching)
    return <Loader title="Loading artist details..." />;

  if (error || ArtistAlbums.error) return <Error />;

  return (
    <div className="flex flex-col">
      <DetailsHeader artistId={id} artistData={data} activeSong={activeSong} />

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {ArtistAlbums?.data?.items?.map((album, i) => {
          return (
            <SongCard
              key={i}
              song={album}
              i={i}
              activeSong={activeSong}
              isPlaying={isPlaying}
              data={ArtistAlbums?.data}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ArtistDetails;
