"use client";

import { ChevronDown, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Option {
  _id: string;
  name: string;
  description?: string;
}

interface SearchableMultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function SearchableMultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  label,
  required = false,
  error,
  loading = false,
  disabled = false,
  className = "",
}: SearchableMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected options
  const selectedOptions = options.filter((option) =>
    value.includes(option._id)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    };

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
          if (
            highlightedIndex >= 0 &&
            highlightedIndex < filteredOptions.length
          ) {
            handleOptionToggle(filteredOptions[highlightedIndex]._id);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSearchTerm("");
          setHighlightedIndex(-1);
          break;
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, highlightedIndex, filteredOptions]);

  const handleOptionToggle = (optionId: string) => {
    const isSelected = value.includes(optionId);
    if (isSelected) {
      onChange(value.filter((id) => id !== optionId));
    } else {
      onChange([...value, optionId]);
    }
  };

  const handleRemoveOption = (optionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onChange(value.filter((id) => id !== optionId));
  };

  const handleClearAll = (event: React.MouseEvent) => {
    event.stopPropagation();
    onChange([]);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        ref={dropdownRef}
        className={`relative w-full ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {/* Selected values display */}
        <div
          onClick={!disabled ? handleInputFocus : undefined}
          className={`
            w-full min-h-[42px] px-3 py-2 border rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500
            ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
            ${
              disabled
                ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                : "bg-white dark:bg-gray-700"
            }
            dark:text-white transition-colors
          `}
        >
          <div className="flex flex-wrap gap-1 min-h-[26px] items-center">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <span
                  key={option._id}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md text-sm"
                >
                  {option.name}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveOption(option._id, e)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))
            ) : (
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {placeholder}
              </span>
            )}

            {/* Clear all button */}
            {selectedOptions.length > 0 && !disabled && (
              <button
                type="button"
                onClick={handleClearAll}
                className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Dropdown arrow */}
            <ChevronDown
              className={`h-4 w-4 text-gray-400 ml-auto transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-hidden">
            {/* Search input */}
            <div className="p-2 border-b border-gray-200 dark:border-gray-600">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setHighlightedIndex(-1);
                  }}
                  placeholder="Search options..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
                />
              </div>
            </div>

            {/* Options list */}
            <div className="max-h-48 overflow-y-auto">
              {loading ? (
                <div className="p-3 text-center text-gray-500 dark:text-gray-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
                  <span className="text-sm mt-1">Loading...</span>
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="p-3 text-center text-gray-500 dark:text-gray-400 text-sm">
                  {searchTerm ? "No options found" : "No options available"}
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = value.includes(option._id);
                  const isHighlighted = index === highlightedIndex;

                  return (
                    <div
                      key={option._id}
                      onClick={() => handleOptionToggle(option._id)}
                      className={`
                        px-3 py-2 cursor-pointer transition-colors text-sm
                        ${
                          isHighlighted
                            ? "bg-blue-50 dark:bg-blue-900"
                            : "hover:bg-gray-50 dark:hover:bg-gray-600"
                        }
                        ${
                          isSelected
                            ? "bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-100"
                            : "text-gray-900 dark:text-white"
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // Controlled by parent click
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{option.name}</div>
                          {option.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {option.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
