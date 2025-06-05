const Table = require('../models/Table');

exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ createdAt: 1 });
    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tables', error });
  }
};

exports.createTable = async (req, res) => {
  try {
    let { name, chairs, status } = req.body;

    const count = await Table.countDocuments();
    const tableNumber = count + 1;

    if (!name || name.trim() === '') {
      name = `Table ${tableNumber}`;
    }

    const newTable = new Table({ tableNumber, name, chairs, status });
    await newTable.save();

    res.status(201).json(newTable);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create table', error });
  }
};

exports.deleteTable = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Table.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.status(200).json({ message: 'Table deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete table', error });
  }
};

exports.updateTableStatus = async (req, res) => {
  try {
    const tableId = req.params.id;
    const { status } = req.body;

    const updatedTable = await Table.findByIdAndUpdate(
      tableId,
      { status },
      { new: true }
    );

    req.io.emit('tableStatusUpdated', {
      tableId,
      status: updatedTable.status,
    });

    res.status(200).json(updatedTable);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update table status' });
  }
};
