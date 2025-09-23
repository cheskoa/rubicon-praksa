import "../styles/header.css";
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export interface HeaderRef {
  clearSearch: () => void;
}

const Header = forwardRef<HeaderRef, HeaderProps>(({ onSearch }, ref) => {
  const [query, setQuery] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debouncing
    timeoutRef.current = setTimeout(() => {
      onSearch?.(value);
    }, 300); // 0.3 seconds
  }

  const clearSearch = () => {
    setQuery("");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useImperativeHandle(ref, () => ({
    clearSearch
  }));

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="header">
      <div className="logo">BAIR</div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search movies or series..."
          value={query}
          onChange={handleChange}
        />
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
