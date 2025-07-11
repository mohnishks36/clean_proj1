import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

// Reusable input field component
const InputField = ({ type, placeholder, name, handleChange, address }) => {
  return (
    <input
      className="w-full px-3 py-2 border border-gray-300 rounded outline-none text-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition duration-300 text-sm"
      type={type}
      placeholder={placeholder}
      name={name}
      onChange={handleChange}
      value={address[name]}
    />
  );
};

const AddAddress = () => {
  const {axios,user,navigate} = useAppContext();
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

const onSubmitHandler = async (e) => {
  e.preventDefault();
  try {
   const { data } = await axios.post('/api/address/add', {
  address,
  userId: user._id, // ✅ include userId from context
});



    if (data.success) {
      toast.success(data.message);
      navigate('/cart');
    } else {
      toast.error(data.message);
    }
  } catch (err) {
    toast.error(err.message);
  }
};



useEffect(()=>{
   if(!user) navigate('/');
},[])
  return (
    <div className="mt-16 pb-16 px-4 md:px-10 lg:px-20">
      <p className="text-2xl md:text-3xl text-gray-500 text-center">
        Add Shipping <span className="font-semibold text-primary">Address</span>
      </p>

      <div className="flex flex-col-reverse md:flex-row justify-between items-center mt-10 gap-10">
        {/* Form Section */}
        <div className="w-full md:w-1/2">
          <form className="space-y-4 text-sm" onSubmit={onSubmitHandler}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField type="text" placeholder="First Name" name="firstName" address={address} handleChange={handleChange} />
              <InputField type="text" placeholder="Last Name" name="lastName" address={address} handleChange={handleChange} />
            </div>

            <InputField type="email" placeholder="Email address" name="email" address={address} handleChange={handleChange} />
            <InputField type="text" placeholder="Street" name="street" address={address} handleChange={handleChange} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField type="text" placeholder="City" name="city" address={address} handleChange={handleChange} />
              <InputField type="text" placeholder="State" name="state" address={address} handleChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField type="text" placeholder="Zip code" name="zipcode" address={address} handleChange={handleChange} />
              <InputField type="text" placeholder="Country" name="country" address={address} handleChange={handleChange} />
            </div>

            <InputField type="text" placeholder="Phone" name="phone" address={address} handleChange={handleChange} />

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded hover:bg-primary/90 transition"

            >
              SAVE ADDRESS
            </button>
          </form>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={assets.add_address_iamge}
            alt="Add Address"
            className="max-w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default AddAddress;
