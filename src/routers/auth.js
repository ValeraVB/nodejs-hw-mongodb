import { Router } from "express";

import * as authControllers from "../controllers/auth.js";

import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../utils/validateBody.js";

import {authRegisterSchema, authLoginSchema} from "../validation/auth.js";

import { requestResetEmailSchema } from '../validation/auth.js';
import { requestResetEmailController } from '../controllers/auth.js';

import { resetPasswordSchema } from '../validation/auth.js';
import { resetPasswordController } from '../controllers/auth.js';

import { getGoogleOAuthUrlController } from '../controllers/auth.js';
import { loginWithGoogleOAuthSchema } from '../validation/auth.js';
import { loginWithGoogleController } from '../controllers/auth.js';

const authRouter = Router();

authRouter.post("/register", validateBody(authRegisterSchema), ctrlWrapper(authControllers.registerController));

authRouter.post("/login", validateBody(authLoginSchema), ctrlWrapper(authControllers.loginController));

authRouter.post("/refresh", ctrlWrapper(authControllers.refreshSessionController));

authRouter.post("/logout", ctrlWrapper(authControllers.logoutController));

authRouter.post("/send-reset-email", validateBody(requestResetEmailSchema),  ctrlWrapper(requestResetEmailController),);

authRouter.post("/reset-pwd", validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController),);

authRouter.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));

authRouter.post('/confirm-oauth', validateBody(loginWithGoogleOAuthSchema), ctrlWrapper(loginWithGoogleController),);

export default authRouter;