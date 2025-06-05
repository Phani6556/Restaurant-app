const Order = require('../models/Order');

const updateOrderStatuses = async () => {
  const now = new Date();

  const orders = await Order.find();

  for (const order of orders) {
    const minutesSinceCreation = (now - new Date(order.createdAt)) / 60000;

    if (order.status === 'Processing' && minutesSinceCreation >= 20) {
      order.status = 'Done';
      order.doneAt = now;
      await order.save();
    }

    if (
      order.type === 'Dine In' &&
      order.status === 'Done' &&
      order.doneAt &&
      (now - new Date(order.doneAt)) / 60000 >= 20
    ) {
      order.status = 'Served';
      await order.save();
    }

  }
};

module.exports = updateOrderStatuses;
