import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const AllProducts = () => {
  const { products, searchQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchQuery]);

  return (
    <div className='mt-16 flex flex-col w-full px-4'>
      {/* Left-aligned header */}
      <div className='flex flex-col items-start w-full mb-6'>
        <p className='text-2xl font-semibold uppercase'>All Products</p>
        <div className='w-16 h-0.5 bg-primary rounded-full mt-1'></div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6 xl:gap-8 w-full">
        {filteredProducts
          .filter((product) => product.inStock)
          .map((product, index) => (
            <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
