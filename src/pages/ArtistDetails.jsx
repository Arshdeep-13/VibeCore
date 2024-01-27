import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DetailsHeader, Error, Loader } from '../components';

import { useGetArtistDetailsQuery } from '../redux/services/shazamCore';
import RelatedArrist from '../components/MusicPlayer/RelatedArrist';

const ArtistDetails = () => {
  const { id } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data, isFetching: isFetchingArtistDetails, error } = useGetArtistDetailsQuery({id});

  if (isFetchingArtistDetails) return <Loader title="Loading artist details..." />;

  if (error) return <Error />;

  // console.log(data.data)

  return (  
    <div className="flex flex-col">
      <DetailsHeader
        artistId={id}
        artistData={data?.data[0]}
      />

      <RelatedArrist
        data={data.data}
        artistId={id}
        isPlaying={isPlaying}
        activeSong={activeSong}
      />
    </div>
  );
};

export default ArtistDetails;