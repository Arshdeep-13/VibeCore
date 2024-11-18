import React, { useEffect, useState } from "react";
import queryString from "query-string";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAccessToken, setRefreshToken } from "../redux/features/playerSlice";
import { Link, useNavigate } from "react-router-dom";

const ValidateAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logedIn, setLogedIn] = useState(false);

  useEffect(() => {
    const validateAuth = async () => {
      const location = queryString.parse(window.location.search);
      const code = location.code || null;
      const state = location.state || null;

      const CLIENT_ID = "267b243ab8764377bdd3241d6bf8ebd1";
      const CLIENT_SECRET = "10aad7d88b844976b18d37cd5e3d98a1";
      const redirect_uri = "http://localhost:3000/callback";

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

        const { access_token, refresh_token } = response.data;
        dispatch(setAccessToken(access_token));
        dispatch(setRefreshToken(refresh_token));
        setLogedIn(true);

        navigate("/");
      } catch (error) {
        console.error({
          error: "Failed to retrieve access token",
          details: error.response ? error.response.data : error.message,
        });
      }
    };

    validateAuth(); // Call the async function inside useEffect
  }, []);

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
