import logo from "../assets/cloudy.png";
import search from "../assets/search.png";
import location from "../assets/location.png";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NavBar = ({ onCitySearch, onLocationFetch }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchQuery = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const trimmedQuery = searchQuery.trim();
        if (trimmedQuery) {
            onCitySearch(trimmedQuery);
            setSearchQuery("");
        } else {
            toast.warn("Please enter a city name");
        }
    };

    const handleLocationClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    onLocationFetch(latitude, longitude);
                    setSearchQuery("");
                },
                (error) => {
                    if (error.code === 1) {
                        toast.error("Location permission denied");
                    } else if (error.code === 2) {
                        toast.error("Location unavailable");
                    } else {
                        toast.error("Failed to get location");
                    }
                }
            );
        } else {
            toast.error("Geolocation is not supported by your browser");
        }
    };

    return (
        <div className="m-4">
            <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
                {/* Logo */}
                <img src={logo} alt="logo" className="w-20 select-none" />

                {/* Search Bar */}
                <form
                    onSubmit={handleSearchSubmit}
                    className="relative flex items-center w-full max-w-md bg-white rounded-lg shadow-md"
                >
                    <img
                        src={search}
                        alt="search"
                        className="absolute left-3 w-4 h-4 text-gray-400 select-none"
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchQuery}
                        placeholder="Search for your preferred city..."
                        className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 border-none rounded-lg outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-[#050e1fde] text-white px-5 py-2 rounded-r-lg"
                    >
                        Search
                    </button>
                </form>

                {/* Current Location Button */}
                <div
                    onClick={handleLocationClick}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-500 rounded cursor-pointer hover:bg-green-600 transition"
                >
                    <img
                        src={location}
                        alt="location"
                        className="w-4 h-4 select-none"
                    />
                    <p>Current Location</p>
                </div>
            </div>
        </div>
    );
};

export default NavBar;
