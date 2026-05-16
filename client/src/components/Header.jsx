import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import { useState, useEffect } from "react";
import axios from "axios";

const Header = () => {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const onLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const fetchCities = setTimeout(async () => {
      try {
        const res = await axios.get(
          `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}`,
          {
            headers: {
              "X-RapidAPI-Key":
                "47df44a313msh99baf3110b907f8p12029djsnc8b04820603f", // Your API Key
              "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
            },
          }
        );
        // Save the full array of city objects
        setSuggestions(res.data.data);
      } catch (err) {
        if (err.response?.status === 429)
          console.warn("Rate limit reached — slow down requests.");
        else console.error("Error fetching cities:", err);
      }
    }, 1000); // wait 1000ms after last key press to avoid rate limiting

    return () => clearTimeout(fetchCities);
  }, [query]);

  return (
    <header className="bg-slate-50 border-b relative">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg">
          PathCrafters
        </Link>

        {/* 🔍 Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city..."
            className="border rounded-lg px-3 py-1 w-80"
          />
          {suggestions.length > 0 && (
            <ul className="absolute bg-white border rounded-lg shadow-md mt-1 w-60 z-50">
              {/* --- MODIFIED SECTION --- */}
              {suggestions.map((cityObj) => (
                <li
                  // Use the unique ID from the API as the key
                  key={cityObj.id}
                  className="px-3 py-2 hover:bg-slate-100 cursor-pointer"
                  onClick={() => {
                    setQuery("");
                    setSuggestions([]);
                    // Navigate using the city name from the object
                    navigate(`/city/${cityObj.city}`);
                  }}
                >
                  {/* Display the city and country for clarity */}
                  {cityObj.city}, {cityObj.country}
                </li>
              ))}
              {/* --- END MODIFIED SECTION --- */}
            </ul>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-x-3 flex items-center">
          {!user && (
            <>
              <Link to="/login" className="text-sky-600">
                Login
              </Link>
              <Link to="/signup" className="text-sky-600">
                Sign up
              </Link>
            </>
          )}
          {user && (
            <>
              <Link to="/dashboard" className="text-sky-600">
                Dashboard
              </Link>
              <Link to="/profile" className="text-sky-600">
                Profile
              </Link>
              <button onClick={onLogout} className="text-red-600">
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
