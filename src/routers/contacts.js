import { Router } from 'express';

import { isValidId } from "../middlewares/isValidId.js";

import * as contactControllers from '../controllers/contacts.js';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from "../utils/validateBody.js";

import { contactAddSchema, contactUpdateSchema } from "../validation/contacts.js";

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(contactControllers.getContactsController));

contactsRouter.get(
  '/:id', isValidId,
  ctrlWrapper(contactControllers.getContactByIdController),
);

contactsRouter.post('/', validateBody(contactAddSchema), ctrlWrapper(contactControllers.addContactController));

contactsRouter.put('/:id', isValidId, validateBody(contactAddSchema), ctrlWrapper(contactControllers.upsertContactController),
);

contactsRouter.patch('/:id', isValidId, validateBody(contactUpdateSchema), ctrlWrapper(contactControllers.patchContactController),
);

contactsRouter.delete('/:id', isValidId, ctrlWrapper(contactControllers.deleteContactController),
);
export default contactsRouter;
