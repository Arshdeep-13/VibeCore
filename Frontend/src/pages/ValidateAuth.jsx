import React, { useEffect, useState } from "react";
import queryString from "query-string";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const ValidateAuth = () => {
  const navigate = useNavigate();
  const [logedIn, setLogedIn] = useState(false);
  const cookies = new Cookies();
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    const validateAuth = async () => {
      if (isFetched) return; // Prevent duplicate API calls
      setIsFetched(true);

      const location = queryString.parse(window.location.search);
      const code = location.code || null;
      const state = location.state || null;

      const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
      const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
      const redirect_uri = `${import.meta.env.VITE_FRONTEND_URL}/callback`;

      if (!state) {
        window.location.href =
          "/#" +
          queryString.stringify({
            error: "state_mismatch",
          });
        return;
      }

      const authOptions = {
        url: "https://accounts.spotify.com/api/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
        },
        data: queryString.stringify({
          code: code,
          redirect_uri: redirect_uri,
          grant_type: "authorization_code",
        }),
      };

      try {
        const response = await axios.post(authOptions.url, authOptions.data, {
          headers: authOptions.headers,
        });

        const { access_token, refresh_token } = await response.data;
        cookies.set("access_token", access_token);
        cookies.set("refresh_token", refresh_token);

        setLogedIn(true);

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (error) {
        console.log(error);
        console.error({
          error: "Failed to retrieve access token",
          details: error.response ? error.response.data : error.message,
        });
      }
    };

    validateAuth();
  }, [isFetched]);

  return (
    <>
      <div className="text-white flex flex-col justify-center items-center h-screen gap-10">
        <h1 className="text-5xl">Redirecting...</h1>
        <Link
          className="rounded-md bg-blue-600 py-2 px-4 border border-transparent text-center text-xl text-white transition-all shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-none active:bg-blue-700 hover:bg-blue-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
          to="/login"
        >
          Retry
        </Link>
      </div>
    </>
  );
};

export default ValidateAuth;
