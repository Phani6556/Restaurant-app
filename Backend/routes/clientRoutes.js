const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

router.post('/', async (req, res) => {
  const { name, phone, address } = req.body;

  try {
    
    let client = await Client.findOne({ phone });

    if (!client) {
      client = new Client({ name, phone, address });
      await client.save();
    }

    res.status(201).json({ success: true, client });
  } catch (err) {
    console.error('Error creating client:', err);
    res.status(500).json({ success: false, message: 'Client creation failed' });
  }
});
router.get('/count', async (req, res) => {
  try {
    const totalClients = await Client.countDocuments(); 
    res.json({ totalClients });
  } catch (err) {
    console.error('Error counting clients:', err);
    res.status(500).json({ error: 'Failed to count clients' });
  }
});
module.exports = router;
