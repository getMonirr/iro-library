"use client";

import { ChevronDown, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Option {
  _id: string;
  name: string;
  description?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  label,
  required = false,
  error,
  loading = false,
  disabled = false,
  className = "",
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected option
  const selectedOption = options.find((option) => option._id === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case "Enter":
          event.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex]._id);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSearchTerm("");
          setHighlightedIndex(-1);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, highlightedIndex, filteredOptions]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
  };

  const toggleDropdown = () => {
    if (disabled || loading) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Main Select Button */}
      <div
        onClick={toggleDropdown}
        className={`
          relative w-full px-3 py-2 border rounded-lg cursor-pointer transition-colors
          ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
          ${
            disabled
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-white dark:bg-gray-700 hover:border-gray-400"
          }
          ${isOpen ? "ring-2 ring-blue-500 border-blue-500" : ""}
          focus:outline-none focus:ring-2 focus:ring-blue-500
        `}
      >
        <div className="flex items-center justify-between">
          <span
            className={`truncate ${
              selectedOption ? "text-gray-900 dark:text-white" : "text-gray-500"
            }`}
          >
            {selectedOption ? selectedOption.name : placeholder}
          </span>

          <div className="flex items-center gap-1">
            {/* Loading spinner */}
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            )}

            {/* Clear button */}
            {selectedOption && !disabled && (
              <button
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 p-0.5 rounded"
                type="button"
              >
                <X className="h-3 w-3" />
              </button>
            )}

            {/* Dropdown arrow */}
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform ${
                isOpen ? "transform rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-600">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setHighlightedIndex(-1);
                }}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                No options found
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={option._id}
                  onClick={() => handleSelect(option._id)}
                  className={`
                    px-3 py-2 cursor-pointer transition-colors
                    ${
                      index === highlightedIndex
                        ? "bg-blue-100 dark:bg-blue-900"
                        : ""
                    }
                    ${
                      option._id === value
                        ? "bg-blue-50 dark:bg-blue-800 text-blue-900 dark:text-blue-100"
                        : "text-gray-900 dark:text-white"
                    }
                    hover:bg-gray-100 dark:hover:bg-gray-600
                  `}
                >
                  <div className="font-medium">{option.name}</div>
                  {option.description && (
                    <div className="text-xs text-gray-500 truncate mt-0.5">
                      {option.description}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
