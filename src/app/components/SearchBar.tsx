import { useState, useEffect } from 'react';
import SearchSuggestions from './SearchSuggestions';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showClearButton?: boolean;
  onClear?: () => void;
  showSuggestions?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Buscar artículos...",
  className = "",
  showClearButton = true,
  onClear,
  showSuggestions = true
}: SearchBarProps) {
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestionsDropdown, setShowSuggestionsDropdown] = useState(false);

  // Indicador visual de que se está escribiendo
  useEffect(() => {
    if (value) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [value]);

  // Mostrar sugerencias cuando hay texto
  useEffect(() => {
    setShowSuggestionsDropdown(value.length >= 2);
  }, [value]);

  const handleClear = () => {
    onChange('');
    onClear?.();
    setShowSuggestionsDropdown(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestionsDropdown(false);
  };

  const handleInputFocus = () => {
    if (value.length >= 2) {
      setShowSuggestionsDropdown(true);
    }
  };

  const handleInputBlur = () => {
    // Pequeño delay para permitir clics en sugerencias
    setTimeout(() => {
      setShowSuggestionsDropdown(false);
    }, 150);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-500 search-input"
        />
        
        {/* Icono de búsqueda */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          {isTyping ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>

        {/* Botón de limpiar */}
        {showClearButton && value && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Sugerencias de búsqueda */}
      {showSuggestions && (
        <SearchSuggestions
          searchTerm={value}
          onSuggestionClick={handleSuggestionClick}
          isVisible={showSuggestionsDropdown}
          onClose={() => setShowSuggestionsDropdown(false)}
        />
      )}

      {/* Indicador de búsqueda activa */}
      {isTyping && value && (
        <div className="absolute -bottom-8 left-0 text-sm text-blue-600 flex items-center space-x-1">
          <div className="animate-pulse">🔍</div>
          <span>Buscando...</span>
        </div>
      )}
    </div>
  );
} 