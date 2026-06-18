import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import searchIcon from '../assets/search.png';

const Searchbar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    useEffect(() => {
        setSearchParams((previousParams) => {
            const params = new URLSearchParams(previousParams);
            if (searchTerm) {
                params.set('search', searchTerm);
            } else {
                params.delete('search');
            }
            return params;
        });
    }, [searchTerm, setSearchParams]);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="flex w-full sm:w-72 items-center rounded-lg border border-gray-200 bg-white py-2 px-3 shadow-sm">
            <img src={searchIcon} alt="Search" className="w-4 h-4 mr-2 shrink-0" />
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search..."
                className="flex-1 min-w-0 outline-none bg-transparent text-sm"
           
           />
        </div>
    );
};

export default Searchbar;