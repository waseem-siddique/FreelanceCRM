const Client = require('../models/Client');

// Get all clients for logged-in user
const getClients = async (req, res) => {
  try {
    const clients = await Client.find({ user: req.user._id });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single client
const getClientById = async (req, res) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, user: req.user._id });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create client
const createClient = async (req, res) => {
  const { name, email, phone, company, notes } = req.body;
  try {
    const client = await Client.create({ name, email, phone, company, notes, user: req.user._id });
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update client
const updateClient = async (req, res) => {
  try {
    let client = await Client.findOne({ _id: req.params.id, user: req.user._id });
    if (!client) return res.status(404).json({ message: 'Client not found' });

    client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete client
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, user: req.user._id });
    if (!client) return res.status(404).json({ message: 'Client not found' });

    await client.deleteOne();
    res.json({ message: 'Client removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getClients, getClientById, createClient, updateClient, deleteClient };