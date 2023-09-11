const express = require("express");

const router = express.Router();

const {
  joiSchema,
  favoriteJoiSchema
} = require("../../schemas/contactSchemas.js");
const { isEmptyBody } = require("../../middlewares/isEmptyBody");
const { isIdExist } = require("../../middlewares/isIdExist.js");
const { validateBody } = require("../../decorators/validateBody.js");

const contactAddValidate = validateBody(joiSchema);

const contactsController = require("../../controllers/contacts");

router.get("/", contactsController.getAllContacts);
router.get("/:contactId", isIdExist, contactsController.getContactById);
router.post("/", contactAddValidate, contactsController.postContact);
router.delete("/:contactId", isIdExist, contactsController.deleteContact);
router.put(
  "/:contactId",
  isIdExist,
  isEmptyBody,
  contactAddValidate,
  contactsController.putContact
);
router.patch(
  "/:contactId/favorite",
  isIdExist,
  isEmptyBody,
  validateBody(favoriteJoiSchema),
  contactsController.patchContact
);

module.exports = router;
