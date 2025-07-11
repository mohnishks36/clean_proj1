import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

// Axios global config
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch authenticated user
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
      } else {
        setUser(null);
        setCartItems({});
      }
    } catch (err) {
      console.error("Fetch User Error:", err.message);
      setUser(null);
      setCartItems({});
    }
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message || "Failed to fetch products");
    }
  };

  // Check seller authentication
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(data.success);
    } catch (err) {
      console.error("Seller Auth Error:", err.message);
    }
  };

  // Add product to cart
  const addToCart = (itemId) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      setShowUserLogin(true);
      return;
    }

    const newCart = { ...cartItems };
    newCart[itemId] = (newCart[itemId] || 0) + 1;
    setCartItems(newCart);
    toast.success("Item added to cart");
  };

  // Update quantity of product in cart
  const updateCartItems = (itemId, quantity) => {
    if (!user) return;

    const newCart = { ...cartItems };
    newCart[itemId] = quantity;
    setCartItems(newCart);
    toast.success("Cart updated");
  };

  // Remove product from cart
  const removeFromCart = (itemId) => {
    if (!user) return;

    const newCart = { ...cartItems };
    if (newCart[itemId]) {
      newCart[itemId] -= 1;
      if (newCart[itemId] === 0) {
        delete newCart[itemId];
      }
      setCartItems(newCart);
      toast.success("Item removed from cart");
    }
  };

  // Get total item count in cart
  const getCartCount = () => {
    return Object.values(cartItems).reduce((acc, count) => acc + count, 0);
  };

  // Get total amount in cart
  const getCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const product = products.find((p) => p._id === id);
      if (product) {
        total += product.offerPrice * cartItems[id];
      }
    }
    return Math.round(total * 100) / 100;
  };

  // Fetch on mount
  useEffect(() => {
    fetchUser();
    fetchProducts();
    fetchSeller();
  }, []);

  // Update cart in DB on change
  useEffect(() => {
  if (!user) return;

  const updateCart = async () => {
    try {
      const { data } = await axios.post("/api/cart/update", {
        userId: user._id,
        cartItems,
      });
      if (!data.success) {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Update Cart Error:", err.message);
    }
  };

  updateCart();
}, [cartItems, user]);

  const value = {
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    navigate,
    products,
    fetchProducts,
    cartItems,
    addToCart,
    updateCartItems,
    removeFromCart,
    getCartCount,
    getCartAmount,
    searchQuery,
    setSearchQuery,
    setCartItems,
    currency,
    axios,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
