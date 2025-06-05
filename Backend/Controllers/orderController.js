const Table = require('../models/Table');
const Order = require('../models/Order');
const Chef = require('../models/Chef');

exports.createOrder = async (req, res) => {
  try {
    const { type, items, customer, cookingInstructions, total } = req.body;

    const newOrder = new Order({
      type,
      items,
      customer,
      cookingInstructions,
      total,
      chef: null,
      tableId: null,
      tableNumber: null
    });

    await newOrder.save();

    req.io.emit('orderUpdate', newOrder);
    req.io.emit('chefSummaryUpdated');
    console.log('[SOCKET] orderUpdate emitted:', newOrder._id);

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

exports.assignChef = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { chefId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.chef) return res.status(400).json({ error: 'Chef already assigned' });

    const chef = await Chef.findById(chefId);
    if (!chef) return res.status(404).json({ error: 'Chef not found' });

    order.chef = chefId;
    await order.save();
    await order.populate('chef');

    const plainOrder = order.toObject();
    req.io.emit('orderUpdate', plainOrder);

    req.io.emit('chefSummaryUpdated');
    console.log('[SOCKET] Chef assigned to order:', order._id);

    res.status(200).json(order);
  } catch (err) {
    console.error('Error assigning chef:', err.message);
    res.status(500).json({ error: 'Failed to assign chef' });
  }
};

exports.assignTable = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { tableNumber } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.tableId) return res.status(400).json({ error: 'Table already assigned' });

    const table = await Table.findOne({ tableNumber, status: 'Available' });
    if (!table) return res.status(404).json({ error: 'Table not available' });

    table.status = 'Reserved';
    await table.save();

    order.tableId = table._id;
    order.tableNumber = table.tableNumber;
    await order.save();
           const plainOrder = order.toObject();
       req.io.emit('orderUpdate', plainOrder);

        req.io.emit('tableStatusUpdated', table);
    console.log('[SOCKET] Table assigned to order:', order._id);

    res.status(200).json(order);
  } catch (err) {
    console.error('Error assigning table:', err.message);
    res.status(500).json({ error: 'Failed to assign table' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });

    req.io.emit('orderUpdate', updatedOrder);
    req.io.emit('chefSummaryUpdated');
    console.log('[SOCKET] Order status updated:', updatedOrder._id);

    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error('Error updating order status:', err.message);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('tableId', 'tableNumber')
      .populate('chef')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
  }
};
