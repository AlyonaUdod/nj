const express = require("express");

const router = express.Router();

const { contactSchema } = require('../../schemas/contactSchemas.js')
const { isEmptyBody } = require('../../middlewares/isEmptyBody');
const { validateBody } = require('../../decorators/validateBody.js');

const contactAddValidate = validateBody(contactSchema);


const contactsController = require("../../controllers/contacts");

router.get("/", contactsController.getAllContacts);
router.get("/:contactId", contactsController.getContactById);
router.post("/", contactAddValidate, contactsController.postContact);
router.delete("/:contactId", contactsController.deleteContact);
router.put("/:contactId", isEmptyBody, contactAddValidate, contactsController.putContact);

module.exports = router;
