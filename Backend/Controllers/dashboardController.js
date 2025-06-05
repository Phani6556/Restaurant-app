
const Order = require('../models/Order');
const Chef = require('../models/Chef');


const getMetrics = async (req, res) => {
  try {
    const totalChefs = await Chef.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenueAgg = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" }
        }
      }
    ]);

    const totalRevenue = totalRevenueAgg[0]?.totalRevenue || 0;
    const clients = await Order.distinct('customer.phone');
    const totalClients = clients.length;

    res.json({
      totalChefs,
      totalOrders,
      totalRevenue,
      totalClients
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
};

const getChefSummary = async (req, res) => {
  try {
    const chefOrderCounts = await Order.aggregate([
      { $match: { status: 'Processing', chef: { $ne: null } } },
      {
        $group: {
          _id: '$chef',
          orderCount: { $sum: 1 }
        }
      }
    ]);

    const chefs = await Chef.find();

    const result = chefs.map(chef => {
      const match = chefOrderCounts.find(c => c._id.toString() === chef._id.toString());
      return {
        _id: chef._id,
        name: chef.name,
        orderCount: match ? match.orderCount : 0
      };
    });


    result.sort((a, b) => a.orderCount - b.orderCount);

    res.json({ chefs: result });
  } catch (err) {
    console.error('Error fetching chef summary:', err);
    res.status(500).json({ error: 'Failed to fetch chef summary' });
  }
};

module.exports = { getMetrics ,getChefSummary };
