import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY; 

const initialState = {
  info: null,
  images: [],
  loading: false,
  error: null,
};

// --- Thunks --- //
export const fetchCityInfo = createAsyncThunk(
  "city/fetchInfo",
  async (city, { rejectWithValue }) => {
      try {        
      const res = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${city}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch city info");
    }
  }
);

export const fetchCityImages = createAsyncThunk(
  "city/fetchImages",
  async (city, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `https://api.unsplash.com/search/photos?query=${city}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=5`
      );
      return res.data.results;
    } catch (err) {
      return rejectWithValue("Failed to fetch city images");
    }
  }
);

export const fetchCityAttractions = createAsyncThunk(
  "city/fetchAttractions",
  async (city, { rejectWithValue }) => {
    try {
        const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
        
      const options = {
        method: "GET",
        url: "https://travel-advisor.p.rapidapi.com/locations/search",
        params: {
          query: `tourist attractions in ${city}`,
          limit: "6", // Get 6 attractions
          sort: "relevance",
          lang: "en_US",
        },
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
        },
      };

      const response = await axios.request(options);

      const attractions = response.data.data.filter(
        (item) =>
          item.result_type === "things_to_do" &&
          item.result_object?.name &&
          item.result_object?.photo
      );

      return attractions.map((item) => item.result_object);
    } catch (error) {
      console.error("Error fetching attractions:", error.response);
      return rejectWithValue("Failed to load attractions.");
    }
  }
);

// export const fetchAttractionDetails = createAsyncThunk(
//   "city/fetchAttractionDetails",
//   async (locationId, { rejectWithValue }) => {
//     try {
//       console.log("locationId ", locationId);
      
//       const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;

//       const options = {
//         method: "GET",
//         url: "https://travel-advisor.p.rapidapi.com/locations/get-details",
//         params: {
//           location_id: locationId,
//           lang: "en_US",
//         },
//         headers: {
//           "X-RapidAPI-Key": RAPIDAPI_KEY,
//           "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
//         },
//       };

//       const response = await axios.request(options);

//         // The response for this endpoint is the full object, not in a 'data' array
//         console.log("data: ", response.data);
        
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching attraction details:", error.response);
//       return rejectWithValue("Failed to load attraction details.");
//     }
//   }
// );
// ─── Restaurants ─────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const fetchCityRestaurants = createAsyncThunk(
  "city/fetchRestaurants",
  async (city, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/city/${encodeURIComponent(city)}/restaurants?limit=9`,
        { withCredentials: true }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to load restaurants.");
    }
  }
);

// ─── Hotels ──────────────────────────────────────────────────────────────────
export const fetchCityHotels = createAsyncThunk(
  "city/fetchHotels",
  async (city, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/city/${encodeURIComponent(city)}/hotels?limit=9`,
        { withCredentials: true }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to load hotels.");
    }
  }
);

export const fetchAttractionDetail = createAsyncThunk(
  "city/fetchAttractionDetails",
  async (locationId, { rejectWithValue }) => {
    try {
      // Security Warning: It's highly recommended to move this key to a .env.local file!
      const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;

      const options = {
        method: "GET",

        // --- THIS IS THE FIX ---
        // Use the 'attractions' endpoint, not 'locations'
        url: "https://travel-advisor.p.rapidapi.com/attractions/get-details",
        // -----------------------

        params: {
          location_id: locationId,
          lang: "en_US",
        },
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
        },
      };

      const response = await axios.request(options);

      // The response for this endpoint is the full object
      return response.data;
    } catch (error) {
      console.error("Error fetching attraction details:", error.response);
      return rejectWithValue("Failed to load attraction details.");
    }
  }
);

// --- Slice --- //
const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {
    clearCity: (state) => {
      state.info = null;
      state.images = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCityInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCityInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.info = action.payload;
      })
      .addCase(fetchCityInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // City images
      .addCase(fetchCityImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCityImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
      })
      .addCase(fetchCityImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCity } = citySlice.actions;
export default citySlice.reducer;