import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const shazamCoreApi = createApi({
    reducerPath: 'shazamCoreApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://shazam.p.rapidapi.com',
        prepareHeaders: (headers) => {
            headers.set('X-RapidAPI-Key', '9993d39359mshd7a76d2922c9d84p103e41jsn9564da2a3dcd');
            headers.set('X-RapidAPI-Host', 'shazam.p.rapidapi.com');

            return headers;
        },
    }),
    endpoints: (builder) => ({
        getTopCharts: builder.query({ query: () => {
            // console.log("first")
            return '/charts/track'
        } }),
        getSongDetails: builder.query({ 
            query: ({ songid }) => {
                // console.log("core id = ", songid);
                return `/songs/get-details?key=${songid}&locale=en-US`;
            }
        }),
        getArtistDetails: builder.query({ query: (artistId) => {
            // console.log("artist id = ", artistId);
            return `/artists/get-top-songs?id=${artistId.id}&l=en-US`
        } }),
        getSongsByCountry: builder.query({ query: () => {
            return `/charts/list`
        } }),
        getSongsBySearch: builder.query({ query: (searchTerm) => {
            console.log(searchTerm)
            return `/search?term=${searchTerm}`
        } }),
    })
});

export const { useGetTopChartsQuery, useGetSongDetailsQuery, useGetArtistDetailsQuery, useGetSongsByCountryQuery, useGetSongsBySearchQuery } = shazamCoreApi;
