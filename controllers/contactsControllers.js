import * as contactsService from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";

import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import Joi from "joi";
// // import * as contactsService from "../services/contactsServices.js";

// // import HttpError from "../helpers/HttpError.js";

// import {
//   createContactSchema,
//   updateContactSchema,
// } from "../schemas/contactsSchemas.js";
export const updateContactSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
})
.min(1)
.message({ 'object.min': 'Body must have at least one field' });

export const getAllContacts = async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.getContactById(id);
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.removeContact(id);
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await contactsService.addContact(req.body);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const result = await contactsService.updateContact(id, req.body);
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

