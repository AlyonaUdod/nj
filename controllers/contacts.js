const HttpError = require("../helpers/HttpError");

const {
  listContacts,
  getContact,
  addContact,
  removeContact,
  updateContact
} = require("../models/contacts");

module.exports.getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

module.exports.getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contactById = await getContact(contactId);
    if (!contactById) {
      throw HttpError(404, "Not Found");
    }
    res.json(contactById);
  } catch (error) {
    next(error);
  }
};

module.exports.postContact = async (req, res, next) => {
  try {
    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const removedContact = await removeContact(contactId);
    if (!removedContact) {
      throw HttpError(404, "Not Found");
    }
    res.json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports.putContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updatedContact = await updateContact(contactId, req.body);
    if (!updatedContact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
