"use client";
import React, { useState } from 'react';
import LoadVideos from '../video/LoadVideos';
import LoadTweets from '../tweet/LoadTweets';
import { X, Search } from 'lucide-react';
import LoadUsers from '../user/LoadUsers';

const SearchPage: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState<'videos' | 'tweets' | 'users'>('videos');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setQuery(e.target.value); // Sets query as the user types for faster fetching
    };

    const handleClear = () => {
        setInputValue('');
        setQuery(''); // Clears the query as well
    };

    const handleSubmit = () => {
        setQuery(inputValue);
    };

    return (
        <>
            <div className="flex justify-center items-center p-4">
                <div className="relative w-full md:w-[85%] lg:w-[65%] flex items-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Search..."
                        className="border bg-[#f1f0f0] dark:bg-[#163040] border-gray-300 rounded-full py-2 px-4 pr-8 w-full focus:outline-none"
                    />
                    {inputValue && (
                        <button onClick={handleClear} className="absolute right-14 text-gray-600">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                    <button onClick={handleSubmit} className="ml-2 bg-blue-600 rounded-full p-2 text-white hover:bg-blue-700 transition">
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto border-b border-[#a5bdc5] dark:border-[#485f67] p-1">
                <div className="flex justify-evenly items-center gap-4 mb-2 ">
                    <button
                        className={`py-1 px-6 rounded-full transition-colors duration-200 ${selected === 'videos' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        onClick={() => setSelected('videos')}
                    >
                        Videos
                    </button>
                    <button
                        className={`py-1 px-6 rounded-full transition-colors duration-200 ${selected === 'tweets' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        onClick={() => setSelected('tweets')}
                    >
                        Tweets
                    </button>
                    <button
                        className={`py-1 px-6 rounded-full transition-colors duration-200 ${selected === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        onClick={() => setSelected('users')}
                    >
                        Users
                    </button>
                </div>
            </div>
            <div className="mt-2">
                {selected === 'videos' && <LoadVideos query={query} />}
                {selected === 'tweets' && <LoadTweets query={query} />}
                {selected === 'users' && <LoadUsers query={query} />}
            </div>
        </>
    );
};

export default SearchPage;
