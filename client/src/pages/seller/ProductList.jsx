import React from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ProductList = () => {
  const { products, fetchProducts, axios, currency } = useAppContext();

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post('/api/product/stock', { id, inStock });
      if (data.success) {
        toast.success(data.message);
        fetchProducts(); // ✅ Refresh state after successful toggle
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Products</h2>

        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Product</th>
                <th className="px-4 py-3 font-semibold truncate">Category</th>
                <th className="px-4 py-3 font-semibold truncate hidden md:block">Selling Price</th>
                <th className="px-4 py-3 font-semibold truncate">In Stock</th>
              </tr>
            </thead>

            <tbody className="text-sm text-gray-500">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">No products available.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="border-t border-gray-500/20">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="border border-gray-300 rounded overflow-hidden">
                        <img src={product.image[0]} alt="Product" className="w-16" />
                      </div>
                      <span className="truncate max-sm:hidden w-full">{product.name}</span>
                    </td>

                    <td className="px-4 py-3">{product.category}</td>

                    <td className="px-4 py-3 max-sm:hidden">
                      {currency}{product.offerPrice}
                    </td>

                <td className="px-4 py-3">
  <label className="relative inline-flex items-center cursor-pointer w-12 h-7">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={product.inStock}
      onChange={() => toggleStock(product._id, !product.inStock)}
    />
    
    {/* Track */}
    <div className="w-full h-full bg-gray-300 peer-checked:bg-blue-600 rounded-full transition-colors duration-300" />

    {/* Dot (Knob) */}
    <div className="absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full shadow transition-transform duration-300 transform peer-checked:translate-x-[20px]" />
  </label>
</td>


                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
