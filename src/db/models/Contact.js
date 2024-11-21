import { Schema, model } from 'mongoose';

import { handleSaveError, setUpdateSettings } from "./hooks.js";

import { contactTypeList } from "../../constants/contacts.js";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: contactTypeList,
      default: 'personal',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
  },
    photo: { type: String },
  },
  {
    versionKey: false,
    timestamps: true, // Автоматично додає createdAt та updatedAt
  },
);

contactSchema.post("save", handleSaveError);

contactSchema.pre("findOneAndUpdate", setUpdateSettings);

contactSchema.post("findOneAndUpdate", handleSaveError);

export const sortByList = ["name", "phoneNumber", "email"];


const ContactCollection = model('contacts', contactSchema);

export default ContactCollection;
