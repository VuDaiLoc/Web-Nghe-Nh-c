import React from 'react';

// Component thanh tìm kiếm có thể tái sử dụng
const SearchBar = ({ value, onChange, placeholder = 'Tìm kiếm...', autoFocus = false }) => {
  return (
    <div className="relative w-full max-w-2xl">
      {/* Icon tìm kiếm */}
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280] pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z"
        />
      </svg>

      {/* Input field */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full bg-white text-black placeholder-[#6b7280] pl-12 pr-10 py-3.5 rounded-full text-sm font-medium outline-none focus:ring-2 focus:ring-green-500"
      />

      {/* Nút xóa nhanh khi có nội dung */}
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-black transition-colors"
          title="Xóa"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
