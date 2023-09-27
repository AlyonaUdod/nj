const HttpError = require("../helpers/HttpError");
const { ctrlWrapper } = require("../decorators/ctrlWrapper");
const { Contact } = require("../schemas/contactSchemas");

const getAllContacts = async (req, res) => {
  const { _id } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;
  const contacts = await Contact.find(
    favorite ? { owner: _id, favorite } : { owner: _id },
    "",
    {
      skip,
      limit
    }
  ).populate("owner", "_id subscription email");
  res.json(contacts);
};

const getContactById = async (req, res) => {
  const { _id } = req.user;
  const { contactId } = req.params;
  const contactById = await Contact.find({
    _id: contactId,
    owner: _id
  }).populate("owner", "_id subscription email");
  if (!contactById) {
    throw HttpError(404, "Not Found");
  }
  res.json(contactById);
};

const postContact = async (req, res) => {
  const { _id } = req.user;
  const newContact = await Contact.create({ ...req.body, owner: _id });
  res.status(201).json(newContact);
};

const deleteContact = async (req, res) => {
  const { _id } = req.user;
  const { contactId } = req.params;
  const removedContact = await Contact.findOneAndDelete({
    _id: contactId,
    owner: _id
  }).populate("owner", "_id subscription email");
  if (!removedContact) {
    throw HttpError(404, "Not Found");
  }
  res.json({ message: "contact deleted" });
};

const putContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id } = req.user;
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId, owner: _id },
    req.body,
    {
      new: true
    }
  ).populate("owner", "_id subscription email");
  if (!updatedContact) {
    throw HttpError(404, "Not found");
  }
  res.json(updatedContact);
};

const patchContact = async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const { _id } = req.user;
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId, owner: _id },
    { favorite },
    { new: true }
  ).populate("owner", "_id subscription email");
  if (!updatedContact) {
    throw HttpError(404, "Not found");
  }
  res.json(updatedContact);
};

module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  postContact: ctrlWrapper(postContact),
  deleteContact: ctrlWrapper(deleteContact),
  putContact: ctrlWrapper(putContact),
  patchContact: ctrlWrapper(patchContact)
};
