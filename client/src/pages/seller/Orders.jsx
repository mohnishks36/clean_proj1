import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';                 // ✅ add import

const Orders = () => {
  const { currency, axios } = useAppContext();       // ✅ rely on context axios only
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/order/seller', {
        withCredentials: true                      // ✅ send cookies (JWT)
      });

      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message || 'Unable to fetch orders');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
      <div className="md:p-10 p-4 space-y-4">
        <h2 className="text-lg font-medium">Orders List</h2>

        {/* --- fallback when there are no orders --- */}
        {orders.length === 0 && (
          <p className="text-gray-500 text-sm">No orders have been placed yet.</p>
        )}

        {orders.map((order) => (
          <div
            key={order._id}                           // ✅ use _id
            className="grid md:grid-cols-[2fr_1fr_auto_1fr] gap-5 p-5 max-w-4xl
                       rounded-md border border-gray-300 items-center"
          >
            {/* Product block */}
            <div className="flex gap-5">
              <img src={assets.box_icon} alt="box" className="w-12 h-12 object-cover" />
              <div>
                {order.items.map((item, i) => (
                  <p key={i} className="font-medium">
                    {item.product.name}
                    <span className="text-primary ml-1">× {item.quantity}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="text-sm text-gray-700">
              <p className="font-medium text-black">
                {order.address.firstName} {order.address.lastName}
              </p>
              <p>
                {order.address.street}, {order.address.city}
              </p>
              <p>
                {order.address.state}, {order.address.zipcode},{' '}
                {order.address.country}
              </p>
              <p>{order.address.phone}</p>
            </div>

            {/* Amount */}
            <p className="font-medium text-lg text-gray-900 text-center">
              {currency}
              {order.amount}
            </p>

            {/* Payment info */}
            <div className="text-sm text-gray-700">
              <p>Method: {order.paymentType}</p>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>
                Payment:{' '}
                <span className={order.isPaid ? 'text-green-600' : 'text-red-500'}>
                  {order.isPaid ? 'Paid' : 'Pending'}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
