import { Router } from 'express';

import * as contactControllers from '../controllers/contacts.js';

import ctrlWrapper from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(contactControllers.getContactsController));

contactsRouter.get(
  '/:id',
  ctrlWrapper(contactControllers.getContactByIdController),
);

contactsRouter.post('/', ctrlWrapper(contactControllers.addContactController));

contactsRouter.put(
  '/:id',
  ctrlWrapper(contactControllers.upsertContactController),
);

contactsRouter.patch(
  '/:id',
  ctrlWrapper(contactControllers.patchContactController),
);

contactsRouter.delete(
  '/:id',
  ctrlWrapper(contactControllers.deleteContactController),
);
export default contactsRouter;
