import Joi from "joi";

import { contactTypeList } from "../constants/contacts.js";

export const contactAddSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid(...contactTypeList).required(),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid(...contactTypeList),
}).or('name', 'phoneNumber', 'email', 'isFavourite', 'contactType'); // хоча б одне поле має бути присутнє