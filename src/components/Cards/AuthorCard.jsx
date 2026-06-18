import React from "react";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import authorImg1 from "../../assets/a1.png";
import authorImg2 from "../../assets/a2.png";


const AuthorCard = ({ 
  id,
    name,
    noOfBooks,
   }) => {
  const navigate = useNavigate();
    // use random image for author
    const ref = React.useRef(
        Math.floor(Math.random() * 2) === 0 ? authorImg1 : authorImg2
    );
     return (
       <motion.div
         initial={{ opacity: 0, y: 18 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true, amount: 0.2 }}
         whileHover={{ y: -6, scale: 1.01 }}
         transition={{ duration: 0.28, ease: 'easeOut' }}
         className="bg-white shadow-md rounded-2xl p-4 w-full max-w-[24rem] flex flex-col sm:flex-row gap-4"
       >
         <div className="grid items-center w-full sm:w-32 min-h-28 rounded-xl" 
        >
           <img src={ref.current} alt={name} className="text-center font-light h-full w-full object-cover rounded-xl text-gray-800 text-wrap" />
         </div>
         <div className="flex flex-col px-0 sm:px-1 w-full flex-1 min-w-0">
            <div className="flex-1 space-y-1">
             <p className="text-wrap break-words font-medium text-gray-800">{name}</p>
             <p className="text-sm text-main">Books published: {noOfBooks}</p>
             </div>
 
             <div className="flex justify-end items-end pt-3">
                <button
                  type="button"
                  onClick={() => navigate(`/author/${id}`)}
                  className="bg-main font-light text-white px-3 py-2 rounded-lg w-full sm:w-auto"
                >
                  View Profile
                </button>
            </div>
                 
         </div>
       </motion.div>
     );
   };
 export default AuthorCard;