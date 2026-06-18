import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
const StoreCard = ({ name, noOfBooks, averagePrice, id }) => {
    
    const navigate = useNavigate();
  return ( 
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="bg-white shadow-md rounded-2xl p-4 w-full max-w-[24rem] flex flex-col sm:flex-row gap-4"
    >
      {/* Store Placeholder (instead of an image) */}
      <div
        className="grid items-center w-full sm:w-32 min-h-28 sm:min-h-full rounded-xl"
        style={{ backgroundColor: '#E0F7FA' }} // Light cyan background
      >
        <p className="text-center font-medium text-gray-800 text-wrap px-2 text-sm sm:text-base">{name}</p>
      </div>

      {/* Store Details */}
      <div className="flex flex-col px-0 sm:px-1 w-full flex-1 min-w-0">
        <div className="flex-1 space-y-1">
          <p className="text-wrap text-lg font-bold text-gray-800 break-words">{name}</p>
          <p className="text-sm text-main">Books in stock: {noOfBooks}</p>
          <p className="text-sm text-main">
            Average Price: ${averagePrice.toFixed(2)}
          </p>
        </div>

        <div className="flex justify-end items-end pt-3">
          <button className="bg-main font-light text-white px-3 py-2 rounded-lg w-full sm:w-auto"
            onClick={
                () => {
                    navigate(`/store/${id}`);
                   
                }
            }
          >
            View Store
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default StoreCard;