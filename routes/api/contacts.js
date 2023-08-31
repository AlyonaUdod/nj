const express = require("express");

const router = express.Router();

const { contactSchema } = require('../../schemas/contactSchemas.js')
const { isEmptyBody } = require('../../middlewares/isEmptyBody');
const { validateBody } = require('../../decorators/validateBody.js');

const contactAddValidate = validateBody(contactSchema);


const {
  getAllContacts,
  getContactById,
  postContact,
  deleteContact,
  putContact
} = require("../../controllers/contacts");

router.get("/", getAllContacts);
router.get("/:contactId", getContactById);
router.post("/", contactAddValidate, postContact);
router.delete("/:contactId", deleteContact);
router.put("/:contactId", isEmptyBody, contactAddValidate, putContact);

module.exports = router;
