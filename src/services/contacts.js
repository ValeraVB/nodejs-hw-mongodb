import ContactCollection from '../db/models/Contact.js';
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getContacts = async ({ 
  page = 1, 
  perPage = 10, 
  sortBy = "_id", 
  sortOrder = "asc", 
  filter = {} 
}) => {
  const skip = (page - 1) * perPage;

  const query = ContactCollection.find().skip(skip).limit(perPage).sort({ [sortBy]: sortOrder });

  if (filter.id) {
    query.where({ _id: filter.id }); 
  }

  if (filter.userId) {
    query.where({ userId: filter.userId }); 
  }

  const data = await query;

  const totalItems = await ContactCollection.find(filter).countDocuments();
  const paginationData = calculatePaginationData({ totalItems, page, perPage });

  return {
    data,
    ...paginationData,
  };
};

export const getContactById = (id, userId) => {
  return ContactCollection.findOne({ _id: id, userId });
};

export const addContact = (payload) => ContactCollection.create(payload);

export const updateContact = async ({ _id, userId, payload, options = {} }) => {
  const rawResult = await ContactCollection.findOneAndUpdate(
    { _id, userId },  
    payload,
    { ...options, new: true, includeResultMetadata: true }
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject.upserted),
  };
};

export const deleteContact = (id, userId) => {
  return ContactCollection.findOneAndDelete({ _id: id, userId });
};
