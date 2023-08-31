const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");

const contactsPath = path.join(__dirname, "contacts.json");
const updateContacts = async (contacts) => {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  const data = await listContacts();
  return data.find((el) => el.id === contactId) ?? null;
};

const removeContact = async (contactId) => {
  const data = await listContacts();
  const item = data.find((el) => el.id === contactId) ?? null;
  if (item) {
    const newArr = data.filter((el) => el.id !== contactId);
    await updateContacts(newArr);
  }
  return item;
};

const addContact = async (body) => {
  const contact = { id: randomUUID(), ...body };
  const data = await listContacts();
  data.push(contact);
  await updateContacts(data);
  return contact;
};

const updateContact = async (contactId, body) => {
  const data = await listContacts();
  const item = data.find((el) => el.id === contactId);
  if (item) {
    const newArr = data.map((el) =>
      el.id === contactId ? { ...item, ...body } : el
    );
    await updateContacts(newArr);
    const newItem = await getContactById(contactId);
    return newItem;
  }
  return null;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact
};
