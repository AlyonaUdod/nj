const express = require("express");

const router = express.Router();
const { isTokenValid } = require("../../middlewares/isTokenValid");
const { uploadFile } = require("../../middlewares/uploadFile");
const { validateBody } = require("../../decorators/validateBody");
const userController = require("../../controllers/user");
const {
  joiSignupSchema,
  joiLoginSchema,
  joiSubscriprtion
} = require("../../schemas/userSchemas");

router.get("/current", isTokenValid, userController.getCurrent);
router.post("/register", validateBody(joiSignupSchema), userController.register);
router.post("/login", validateBody(joiLoginSchema), userController.login);
router.post("/logout", isTokenValid, userController.logout);
router.patch(
  "/subscription",
  isTokenValid,
  validateBody(joiSubscriprtion),
  userController.changeSubscription
);
router.patch('/avatars', isTokenValid, uploadFile.single('avatar'), userController.updateAvatar);

module.exports = router;
