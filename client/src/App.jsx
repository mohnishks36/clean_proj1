import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';
import Loading from './components/Loading'; // or the correct path to your Loading.jsx file

import { useAppContext } from './context/AppContext';
import Login from './components/Login';
import AllProducts from './pages/AllProducts';
import ProductCategory from './pages/ProductCategory';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AddAddress from './pages/AddAddress';
import MyOrders from './pages/MyOrders';
import SellerLogin from './components/seller/SellerLogin.jsx';
import SellerLayout from './pages/seller/SellerLayout.jsx';
import AddProduct from './pages/seller/AddProduct.jsx';
import ProductList from './pages/seller/ProductList.jsx';
import Orders from './pages/seller/Orders.jsx';

const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller");
  const { showUserLogin, isSeller } = useAppContext();

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {!isSellerPath && <Navbar />}
      {showUserLogin && <Login />}
      <Toaster />
      <div className={`${isSellerPath ? '' : 'px-6 md:px-16 lg:px-24 xl:px-32'}`}>
        <Routes>
          {/* Public/User Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<AllProducts />} />
          <Route path='/products/:category' element={<ProductCategory />} />
          <Route path='/products/:category/:id' element={<ProductDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/add-address' element={<AddAddress />} />
          <Route path='/my-orders' element={<MyOrders />} />
<Route path='/loader' element={<Loading />} />

          {/* Seller Routes */}
          <Route path='/seller' element={isSeller ? <SellerLayout /> : <SellerLogin />}>
            <Route index element={<AddProduct />} />
            <Route path='product-list' element={<ProductList />} />
            <Route path='orders' element={<Orders />} />
          </Route>
        </Routes>
      </div>
      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;
