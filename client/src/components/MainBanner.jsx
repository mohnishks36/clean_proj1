import React from 'react';
import { assets } from '../assets/assets.js';
import { Link } from 'react-router-dom';

const MainBanner = () => {
  return (
    <div className='relative w-full overflow-hidden'>
      {/* Responsive background image */}
      <img src={assets.main_banner_bg} alt='banner' className='w-full hidden md:block object-cover' />
      <img src={assets.main_banner_bg_sm} alt='banner' className='w-full md:hidden object-cover' />

      {/* Banner text & buttons */}
      <div className="absolute inset-0 flex flex-col items-center md:items-start justify-center px-4 md:px-16 lg:px-24 text-center md:text-left max-w-screen-xl mx-auto">

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight max-w-[90%] md:max-w-md lg:max-w-xl text-black">
          Freshness You Can Trust, Savings You Will Love!
        </h1>

        <div className='flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-6 font-medium'>
          {/* Mobile Button */}
          <Link
            to='/products'
            className="group flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dull transition rounded text-white"
          >
            Shop Now
            <img className='transition group-hover:translate-x-1 md:hidden' src={assets.white_arrow_icon} alt='arrow' />
          </Link>

          {/* Desktop Button */}
          <Link
            to="/products"
            className="group hidden md:flex items-center gap-2 px-6 py-3 border border-black hover:bg-gray-100 rounded"
          >
            Explore Deals
            <img className="transition group-hover:translate-x-1" src={assets.black_arrow_icon} alt="arrow" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
