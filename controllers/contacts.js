const HttpError = require("../helpers/HttpError");
const { ctrlWrapper } = require("../decorators/ctrlWrapper");

const {
  listContacts,
  getContact,
  addContact,
  removeContact,
  updateContact
} = require("../models/contacts");

const getAllContacts = async (req, res, next) => {
  const contacts = await listContacts();
  res.json(contacts);
};

const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const contactById = await getContact(contactId);
  if (!contactById) {
    throw HttpError(404, "Not Found");
  }
  res.json(contactById);
};

const postContact = async (req, res, next) => {
  const newContact = await addContact(req.body);
  res.status(201).json(newContact);
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const removedContact = await removeContact(contactId);
  if (!removedContact) {
    throw HttpError(404, "Not Found");
  }
  res.json({ message: "contact deleted" });
};

const putContact = async (req, res, next) => {
  const { contactId } = req.params;
  const updatedContact = await updateContact(contactId, req.body);
  if (!updatedContact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(updatedContact);
};

module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  postContact: ctrlWrapper(postContact),
  deleteContact: ctrlWrapper(deleteContact),
  putContact: ctrlWrapper(putContact)
};
