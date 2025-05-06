// src/controllers/eventController.js
import { createEvent, getAllEvents, getEventById, updateStatus, uploadImage } from "../models/Event";

// export const fetchAllEvents = async () => {
//     return await getAllEvents()
// }
export const fetchAllEvents = async (params = {}) => {
    const cleanedFilters = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      );
    return await getAllEvents(cleanedFilters);
  };

  export const updateEvents = async (eventId, status, approverId) => {
    return await updateStatus(eventId, status, approverId);
  };

export const fetchEventById = async (id) => {
    return await getEventById(id)
}

export const addEvent = async (event) => {
    return await createEvent(event);
}

export const addImage = async (file, id_folder, id_image) => {
    return await uploadImage(file, id_folder, id_image)
}