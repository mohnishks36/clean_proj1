import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { dummyOrders } from '../assets/assets';

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency,user,axios } = useAppContext();

  const fetchMyOrders = async () => {
    try{
      const {data}=await axios.get('/api/order/user');
      if(data.success){
        setMyOrders(data.orders);
      }
      else{
        console.log(data.message);
      }
    }
    catch(err){
console.log(err);
    }
  }
  useEffect(() => {
    if(user){
    fetchMyOrders();
  }}, [user]);

  return (
    <div className="mt-16 pb-16">
      {/* Header */}
      <div className="flex flex-col items-start w-max mb-8">
        <p className="text-2xl font-medium uppercase">My Orders</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      {/* Order List */}
      {myOrders.map((order, index) => (
        <div
          key={index}
          className="border border-gray-300 rounded-xl mb-10 p-5 max-w-4xl mx-auto shadow-sm"
        >
          {/* Order Top Info */}
          <p className="flex justify-between text-gray-400 md:font-medium max-md:flex-col">
            <span>OrderId : {order._id}</span>
            <span>Payment : {order.paymentType}</span>
            <span>Total Amount : {currency}{order.amount}</span>
          </p>

          {/* Items in the Order */}
          {order.items.map((item, index) => (
  <div key={index}
    className={`relative bg-white text-gray-500/70 ${
      order.items.length !== index + 1 && 'border-b'
    } border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}
  >

    {/* Left: Product Info */}
    <div className="flex items-center flex-1 min-w-[200px]">
      <div className="bg-primary/10 p-4 rounded-lg">
        <img src={item.product.image[0]} alt={item.product.name} className="w-16 h-16" />
      </div>
      <div className="ml-4">
        <h2 className="text-xl font-medium text-gray-800">{item.product.name}</h2>
        <p className="text-gray-500">Category: {item.product.category}</p>
      </div>
    </div>

    {/* Center: Meta Info */}
    <div className='flex flex-col justify-center md:ml-8 mb-4 md:mb-0'>
  <p>Quantity: {item.quantity || "1"}</p>
  <p>Status: {order.status}</p>
  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
</div>


    {/* Right: Amount */}
    <div className="text-primary text-lg font-medium text-right flex-1">
      Amount: {currency}{item.product.offerPrice * item.quantity}
    </div>
  </div>
))}


        </div>
      ))}
    </div>
  );
};

export default MyOrders;
