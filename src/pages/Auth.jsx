import React from "react";
import querystring from "querystring";

let CLIENT_ID = "267b243ab8764377bdd3241d6bf8ebd1";
let CLIENT_SECRET = "10aad7d88b844976b18d37cd5e3d98a1";
var client_id = CLIENT_ID;
var redirect_uri = "http://localhost:3000/callback";

const Auth = () => {
  function generateRandomString(len) {
    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < len; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }

    return result;
  }
  const handleAuth = () => {
    var state = generateRandomString(16);
    var scope = "user-read-private user-read-email";

    window.location.href =
      "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      });
  };

  return (
    <>
      <div className="text-white flex flex-col justify-center items-center h-screen gap-10">
        <h1 className="text-5xl">Authenticate yourself</h1>
        <button
          className="rounded-md bg-blue-600 py-2 px-4 border border-transparent text-center text-xl text-white transition-all shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-none active:bg-blue-700 hover:bg-blue-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
          onClick={handleAuth}
        >
          Authenticate
        </button>
      </div>
    </>
  );
};

export default Auth;
