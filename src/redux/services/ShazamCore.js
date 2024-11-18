import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const shazamCoreApi = createApi({
  reducerPath: "shazamCoreApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.spotify.com",
    prepareHeaders: (headers, { getState }) => {
      const { access_token } = getState().player;
      headers.set("Authorization", `Bearer ${access_token}`);

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getRandomSongs: builder.query({
      query: () => {
        // console.log("first");
        return "/v1/browse/new-releases";
      },
    }),
    getTopCharts: builder.query({
      query: () => {
        // console.log("first");
        return `/v1/search?q=top+charts&type=album`;
      },
    }),
    getSongTracks: builder.query({
      query: (albumId) => {
        // console.log("first");
        return `/v1/albums/${albumId}`;
      },
    }),
    getTopArtistsCharts: builder.query({
      query: (artistId) => {
        return `/v1/artists/${artistId}/related-artists`;
      },
    }),
    getSongsBySearch: builder.query({
      query: (searchTerm) => {
        // console.log(searchTerm);
        return `/v1/search?q=${searchTerm}&type=album`;
      },
    }),
    getArtistDetails: builder.query({
      query: (artistId) => {
        // console.log("artist id = ", artistId);
        return `/v1/artists/${artistId}`;
      },
    }),
    getArtistAlbums: builder.query({
      query: (artistId) => {
        // console.log("artist id = ", artistId);
        return `/v1/artists/${artistId}/albums`;
      },
    }),
    getSongsByCountry: builder.query({
      query: (countryCode) => {
        // console.log(countryCode);
        return `/v1/search?q=top+songs&type=album&market=${countryCode}`;
      },
    }),
  }),
});

export const {
  useGetTopChartsQuery,
  useGetArtistDetailsQuery,
  useGetSongsByCountryQuery,
  useGetSongsBySearchQuery,
  useGetTopArtistsChartsQuery,
  useGetRandomSongsQuery,
  useGetSongTracksQuery,
  useGetArtistAlbumsQuery,
} = shazamCoreApi;
