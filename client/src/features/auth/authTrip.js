import api from "./authAPI";


export const createTrip = (destination) =>
  api.post("/api/trips/create", { destination });

export const getTripById = (tripId) =>
  api.get(`/api/trips/${tripId}`);

export const addActivityToTrip = (tripId, activity) =>
  api.post(`/api/trips/${tripId}/add-activity`, activity);

export const getExplorePlaces = (tripId) =>
  api.get(`/api/trips/${tripId}/explore`);

export default {
  createTrip,
  getTripById,
  addActivityToTrip,
  getExplorePlaces,
};
