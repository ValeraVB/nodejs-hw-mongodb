import createHttpError from 'http-errors';
import * as path from "node:path";

import * as contactServices from '../services/contacts.js';

import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseContactFilterParams } from "../utils/parseContactFilterParams.js";
import { saveFileToUploadDir } from "../utils/saveFileToUploadDir.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { env } from '../utils/env.js';

import { sortByList } from "../db/models/Contact.js";

const enableCloudinary = env("ENABLE_CLOUDINARY");

const processFile = async (file) => {
    if (!file) return null;

    if (enableCloudinary === "true") {
        return await saveFileToCloudinary(file, "photo");
    }

    await saveFileToUploadDir(file);
    return path.join(file.filename);
};

export const getContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);
    const filter = parseContactFilterParams(req.query);
    const { _id: userId } = req.user;
    filter.userId = userId;

    const data = await contactServices.getContacts({ page, perPage, sortBy, sortOrder, filter });

    res.json({
        status: 200,
        message: 'Contacts retrieved successfully',
        data,
    });
};

export const getContactByIdController = async (req, res) => {
    const { id } = req.params;
    const { _id: userId } = req.user;
    const data = await contactServices.getContactById(id, userId);

    if (!data) {
        throw createHttpError(404, `Contact with id=${id} not found`);
    }

    res.json({
        status: 200,
        message: `Contact retrieved successfully`,
        data,
    });
};

export const addContactController = async (req, res) => {
    const { _id: userId } = req.user;
    const photo = await processFile(req.file);

    const data = await contactServices.addContact({ ...req.body, userId, photo });

    res.status(201).json({
        status: 201,
        message: 'Contact successfully added',
        data,
    });
};

export const upsertContactController = async (req, res) => {
    const { id: _id } = req.params;
    const { _id: userId } = req.user;
    const photo = await processFile(req.file);

    const payload = { ...req.body, photo };

    const result = await contactServices.upsertContact({
        _id,
        payload: { ...payload, userId },
    });

    const status = result.isNew ? 201 : 200;

    res.status(status).json({
        status,
        message: 'Contact upserted successfully',
        data: result.data,
    });
};

export const patchContactController = async (req, res) => {
    const { id: _id } = req.params;
    const { _id: userId } = req.user;
    const photo = await processFile(req.file);

    const payload = { ...req.body };
    if (photo) {
        payload.photo = photo;
    }

    const result = await contactServices.updateContact({
        _id,
        userId,
        payload,
    });

    if (!result) {
        throw createHttpError(404, `Contact with id=${_id} not found or not accessible`);
    }

    res.json({
        status: 200,
        message: 'Contact patched successfully',
        data: result.data,
    });
};

export const deleteContactController = async (req, res) => {
    const { id: _id } = req.params;
    const { _id: userId } = req.user;

    const data = await contactServices.deleteContact(_id, userId);

    if (!data) {
        throw createHttpError(404, `Contact with id=${_id} not found or not accessible`);
    }

    res.status(204).send();
};
