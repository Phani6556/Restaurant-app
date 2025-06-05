
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Chef = require('../models/Chef');

router.put('/:id/assign-chef', async (req, res) => {
  try {
    const { chefId } = req.body;
    const orderId = req.params.id;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { chef: chefId },
      { new: true }
    ).populate('chef').populate({
      path: 'tableId',
      select: 'tableNumber name'
    });

    if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });

    req.io.emit('orderUpdate', updatedOrder);
    req.io.emit('chefSummaryUpdated');


    res.json(updatedOrder);
  } catch (err) {
    console.error('Error assigning chef:', err);
    res.status(500).json({ error: 'Failed to assign chef' });
  }
});



module.exports = router;
