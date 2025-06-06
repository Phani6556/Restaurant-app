
const apiUrl = process.env.REACT_APP_API_URL;

export const fetchOrders = async () => {
  const response = await fetch(`${apiUrl}/api/orders`);
  return response.json();
};
