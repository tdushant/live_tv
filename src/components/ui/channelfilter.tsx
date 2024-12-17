import React from 'react';

function ChannelFilters({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div>
      {categories.map((category:any) => (
        <span
          key={category.id}
          onClick={() => onCategoryChange(category.insert_language)}
          className={`block text-white text-lg mt-3 cursor-pointer px-4 py-2 rounded-md transition-colors duration-300 ${
            selectedCategory === category.insert_language
              ? 'bg-[var(--primary-color)] text-white'
              : 'hover:bg-[var(--secondary-color)] text-[var(--primary-color)]'
          }`}
        >
          {category.insert_language}
        </span>
      ))}
    </div>
  );
}

export default ChannelFilters;
