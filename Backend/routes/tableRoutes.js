const Table = require('../models/Table');

const express = require('express');
const router = express.Router();
const tableController = require('../Controllers/tableController');

router.get('/', tableController.getTables);
router.post('/', tableController.createTable);
router.delete('/:id', tableController.deleteTable);
router.patch('/:id/status', tableController.updateTableStatus); 

router.get('/:id/status', async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ error: 'Table not found' });

    res.json({ status: table.status });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});




module.exports = router;
