import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets.js';
import { useAppContext } from '../context/AppContext.jsx';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const {
    user,
    setUser,
    searchQuery,
    setSearchQuery,
    setShowUserLogin,
    getCartCount,
    axios,
  } = useAppContext();

  const logout = async () => {
    try {
      const { data } = await axios.get('/api/user/logout');
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate('/products');
    }
  }, [searchQuery]);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative z-50 transition-all">
      {/* Logo */}
      <NavLink to="/" onClick={() => setOpen(false)}>
        <img className="h-9" src={assets.logo} alt="logo" />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to="/" className="text-black hover:text-green-600 transition">
          Home
        </NavLink>
        <NavLink to="/products" className="text-black hover:text-green-600 transition">
          All Products
        </NavLink>
        <NavLink to="/contact" className="text-black hover:text-green-600 transition">
          Contact
        </NavLink>

        {/* Search Input */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            type="text"
            placeholder="Search products"
            value={typeof searchQuery === 'string' ? searchQuery : ''}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
          />
          <img src={assets.search_icon} alt="search" className="w-4 h-4" />
        </div>

        {/* Cart */}
        <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
          <img src={assets.nav_cart_icon} alt="cart" className="w-6 opacity-80" />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-green-500 w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>

        {/* Login / Profile */}
        {!user ? (
          <button
            className="cursor-pointer px-8 py-2 bg-green-500 hover:bg-green-600 transition text-white rounded-full"
            onClick={() => setShowUserLogin(true)}
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            <img src={assets.profile_icon} className="w-10 cursor-pointer" alt="profile" />
            <ul className="absolute right-0 mt-2 bg-white shadow-md rounded-md py-2 w-32 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate('/my-orders')}
              >
                My Orders
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={logout}
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Right Icons */}
      <div className="flex items-center gap-6 sm:hidden">
        <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
          <img src={assets.nav_cart_icon} alt="cart" className="w-6 opacity-80" />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-green-500 w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>
        <button onClick={() => setOpen(!open)} aria-label="Menu">
          <img src={assets.menu_icon} alt="menu" />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden flex z-50">
          <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>All Products</NavLink>
          {user && (
            <NavLink to="/my-orders" onClick={() => setOpen(false)}>My Orders</NavLink>
          )}
          <NavLink to="/contact" onClick={() => setOpen(false)}>Contact</NavLink>
          {!user ? (
            <button
              className="cursor-pointer px-6 py-2 mt-2 bg-green-500 hover:bg-green-600 transition text-white rounded-full text-sm"
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
            >
              Login
            </button>
          ) : (
            <button
              className="cursor-pointer px-6 py-2 mt-2 bg-green-500 hover:bg-green-600 transition text-white rounded-full text-sm"
              onClick={logout}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
