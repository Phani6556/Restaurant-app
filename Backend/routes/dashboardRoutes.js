const express = require('express');
const router = express.Router();
const Chef = require('../models/Chef');
const Order = require('../models/Order');
const { getMetrics,getChefSummary } = require('../Controllers/dashboardController');
const clientRoutes = require('./clientRoutes');

router.use('/clients', clientRoutes);

router.get('/metrics', getMetrics);

router.get('/chef-summary',getChefSummary );

router.get('/daily-revenue', async (req, res) => {
  const Order = require('../models/Order');
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' },
          total: { $sum: '$total' }
        }
      }
    ]);

    const dayMap = {
      1: 'Sun',
      2: 'Mon',
      3: 'Tue',
      4: 'Wed',
      5: 'Thu',
      6: 'Fri',
      7: 'Sat',
    };

    const dailyRevenue = {};
    result.forEach(item => {
      dailyRevenue[dayMap[item._id]] = item.total;
    });

    res.json(dailyRevenue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch daily revenue' });
  }
});

router.get('/order-summary', async (req, res) => {
  try {
    const served = await Order.countDocuments({ status: 'Served' });
    const dineIn = await Order.countDocuments({ type: 'Dine In' });
    const takeAway = await Order.countDocuments({ type: 'Take Away' });

    res.json({ served, dineIn, takeAway });
  } catch (err) {
    console.error('Error fetching summary:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('tableId')
      .populate('chef');

    res.json(recentOrders);
  } catch (err) {
    console.error("❌ Error in /orders:", err);
    res.status(500).json({ error: err.message });
  }
});

router.patch('/assign-chef', async (req, res) => {
  const { orderId, chefId } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { chef: chefId },
      { new: true }
    ).populate('chef').populate('tableId');

    const io = req.app.get('io');
    io.emit('orderUpdate', updatedOrder);
    io.emit('chefSummaryUpdated');

    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error('Error assigning chef:', err);
    res.status(500).json({ message: 'Failed to assign chef' });
  }
});

module.exports = router;
