import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "universal-cookie";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const cookies = new Cookies();

export const shazamCoreApi = createApi({
  reducerPath: "shazamCoreApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_URL,
    prepareHeaders: (headers) => {
      headers.set("Authorization", `Bearer ${cookies.get("access_token")}`);

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getRandomSongs: builder.query({
      query: () => {
        // console.log("first");
        return "/new-releases";
      },
    }),
    getTopCharts: builder.query({
      query: () => {
        console.log("top-charts");
        return `/top-charts`;
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
        return `/artists/top-charts/${artistId}`;
      },
    }),
    getSongsBySearch: builder.query({
      query: (searchTerm) => {
        // console.log(searchTerm);
        return `/search/${searchTerm}`;
      },
    }),
    getArtistDetails: builder.query({
      query: (artistId) => {
        // console.log("artist id = ", artistId);
        return `/artists/details/${artistId}`;
      },
    }),
    getArtistAlbums: builder.query({
      query: (artistId) => {
        // console.log("artist id = ", artistId);
        return `/artists/albums/${artistId}`;
      },
    }),
    getSongsByCountry: builder.query({
      query: (countryCode) => {
        console.log(countryCode);
        return `/around-you/${countryCode}`;
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
