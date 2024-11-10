import ContactCollection from '../db/models/Contact.js';
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getContacts = async ({ page = 1, perPage = 10, sortBy = "_id", sortOrder = "asc", filter = {} }) => {
  const skip = (page - 1) * perPage;

  const query = ContactCollection.find(filter).skip(skip).limit(perPage).sort({ [sortBy]: sortOrder });

  const data = await query;

  const totalItems = await ContactCollection.find(filter).countDocuments();
  const paginationData = calculatePaginationData({ totalItems, page, perPage });

  return {
    data,
    ...paginationData,
  };
};

export const getContactById = (id) => ContactCollection.findById(id);

export const addContact = (payload) => ContactCollection.create(payload);

export const updateContact = async ({ _id, payload, options = {} }) => {
  const rawResult = await ContactCollection.findOneAndUpdate({ _id }, payload, {
    ...options,
    new: true,
    includeResultMetadata: true,
  });

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject.upserted),
  };
};

export const deleteContact = (filter) => ContactCollection.findOneAndDelete(filter);
