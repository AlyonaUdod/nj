const express = require("express");

const router = express.Router();

const {
  joiSchema,
  favoriteJoiSchema
} = require("../../schemas/contactSchemas.js");
const { isEmptyBody } = require("../../middlewares/isEmptyBody");
const { isIdExist } = require("../../middlewares/isIdExist.js");
const { validateBody } = require("../../decorators/validateBody.js");
const { isTokenValid } = require("../../middlewares/isTokenValid");

const contactAddValidate = validateBody(joiSchema);

const contactsController = require("../../controllers/contacts");

router.get("/", isTokenValid, contactsController.getAllContacts);
router.get("/:contactId", isTokenValid, isIdExist, contactsController.getContactById);
router.post("/", isTokenValid, contactAddValidate, contactsController.postContact);
router.delete("/:contactId", isTokenValid, isIdExist, contactsController.deleteContact);
router.put(
  "/:contactId",
  isTokenValid,
  isIdExist,
  isEmptyBody,
  contactAddValidate,
  contactsController.putContact
);
router.patch(
  "/:contactId/favorite",
  isTokenValid,
  isIdExist,
  isEmptyBody,
  validateBody(favoriteJoiSchema),
  contactsController.patchContact
);

module.exports = router;
