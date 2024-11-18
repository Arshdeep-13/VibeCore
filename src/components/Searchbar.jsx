import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Searchbar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (searchTerm.length == 0) {
      toast.error("Add some keywords", {
        position: "top-center",
        autoClose: 1100,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    navigate(`/search/${searchTerm}`);
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1100}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="p-2 text-gray-400 focus-within:text-gray-600"
      >
        <label htmlFor="search-field" className="sr-only">
          Search all files
        </label>
        <div className="flex flex-row justify-start items-center">
          <FiSearch aria-hidden="true" className="w-5 h-5 ml-4" />
          <input
            name="search-field"
            autoComplete="off"
            id="search-field"
            className="flex-1 bg-transparent border-none placeholder-gray-500 outline-none text-base text-white p-4"
            placeholder="Search"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </form>
    </>
  );
};

export default Searchbar;
