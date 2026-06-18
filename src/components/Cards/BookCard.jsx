// src/components/BookCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa'; // For the cart icon

const randomColorGenerator = ()=>{
  // Function to generate a random color
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color+"20";
}
const BookCard = ({ title, author, stores }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="bg-white shadow-md rounded-2xl p-4 flex flex-col sm:flex-row gap-4 w-full max-w-[36rem]"
    >
      {/* Book Cover */}
      <div
        className="flex items-center justify-center min-h-40 w-full sm:w-32 rounded-xl"
        style={{ backgroundColor:randomColorGenerator()  }} // Light peach background
      >
        <p className="text-center text-black font-medium text-lg px-2 break-words">{title}</p>
      </div>

      {/* Book Details */}
      <div className="flex-1 min-w-0">
        <p className="text-lg font-bold text-gray-800 break-words">{title}</p>
        <p className="text-sm text-gray-500 mb-2 break-words">by {author}</p>
        <span className="text-sm text-gray-500">Stores:</span>

        <div className="flex flex-wrap gap-2 mt-2">
          {stores.length > 0 ? (
            stores.map((store, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-between py-2 px-3 bg-peach-100 rounded-xl gap-2 w-full sm:w-auto min-w-[10rem]"
                style={{ backgroundColor: '#FFE4E1' }} // Light peach background
              >
                <div className="flex flex-col">
                  <p className="text-sm text-gray-700">{store.name}</p>
                  <p className="text-sm font-semibold text-gray-800">
                    ${store.price.toFixed(2)}
                  </p>
                </div>
                <button className="flex items-center justify-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg w-full hover:bg-blue-600">
                  Sell
                  <FaShoppingCart className="text-sm" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No stores available</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;