import { useEffect, useState, useRef } from "react";
import Header, { HeaderRef } from "./components/Header";
import { getTopRatedMovies, getTopRatedTVShows, searchMulti } from "./api/api";  // <-- folder api
import { Movie, TVShow } from "./types/types";                       // <-- folder types
import "./App.css";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [view, setView] = useState<"movies" | "tv">("movies");
  const [searchResults, setSearchResults] = useState<(Movie | TVShow)[]>([]);
  const [searching, setSearching] = useState(false);
  const headerRef = useRef<HeaderRef>(null);

  useEffect(() => {
    async function fetchData() {
      const movieData = await getTopRatedMovies();
      setMovies(movieData.slice(0, 10));

      const tvData = await getTopRatedTVShows();
      setTVShows(tvData.slice(0, 10));
    }

    fetchData();
  }, []);

  return (
    <div className="App">
      <Header
        ref={headerRef}
        onSearch={async (q) => {
          const trimmed = q.trim();
          if (!trimmed) {
            setSearchResults([]);
            setSearching(false);
            return;
          }
          setSearching(true);
          const res = await searchMulti(trimmed);
          // Filtriramo po trenutnom pogledu i izbacimo osobe
          const filtered = res.filter((item: any) => {
            if (item.media_type === "person") return false;
            if (view === "movies") return item.media_type === "movie";
            return item.media_type === "tv";
          });
          setSearchResults(filtered as unknown as (Movie | TVShow)[]);
          setSearching(false);
        }}
      />

      <main className="main">
        <div className="options">
          <button onClick={() => {
            setView("movies");
            setSearchResults([]);
            setSearching(false);
            headerRef.current?.clearSearch();
          }}>🎬 Movies</button>
          <button onClick={() => {
            setView("tv");
            setSearchResults([]);
            setSearching(false);
            headerRef.current?.clearSearch();
          }}>📺 TV Shows</button>
        </div>

        <div className="list">
          {searching && <p>Searching...</p>}
          {!searching && searchResults.length > 0 && (
            <>
              <h2>Search results</h2>
              <ul className="grid">
                {searchResults.map((item: any) => (
                  <li key={item.id}>
                    <img
                      src={item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : '/placeholder-movie.jpg'}
                      alt={item.title || item.name}
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCAxMjBIMTIwVjE4MEg4MFYxMjBaIiBmaWxsPSIjOUI1Q0Y2Ii8+CjxwYXRoIGQ9Ik05MCAxNDBIMTEwVjE2MEg5MFYxNDBaIiBmaWxsPSIjOUI1Q0Y2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUI1Q0Y2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
                      }}
                    />
                    <p>{item.title || item.name}</p>
                    <span>⭐ {item.vote_average}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {searchResults.length === 0 && !searching && (view === "movies" ? (
            <>
              <h2>Top 10 Movies</h2>
              <ul className="grid">
                {movies.map((movie) => (
                  <li key={movie.id}>
                    <img
                      src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : '/placeholder-movie.jpg'}
                      alt={movie.title}
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCAxMjBIMTIwVjE4MEg4MFYxMjBaIiBmaWxsPSIjOUI1Q0Y2Ii8+CjxwYXRoIGQ9Ik05MCAxNDBIMTEwVjE2MEg5MFYxNDBaIiBmaWxsPSIjOUI1Q0Y2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUI1Q0Y2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
                      }}
                    />
                    <p>{movie.title}</p>
                    <span>⭐ {movie.vote_average}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <h2>Top 10 TV Shows</h2>
              <ul className="grid">
                {tvShows.map((show) => (
                  <li key={show.id}>
                    <img
                      src={show.poster_path ? `https://image.tmdb.org/t/p/w200${show.poster_path}` : '/placeholder-movie.jpg'}
                      alt={show.name}
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCAxMjBIMTIwVjE4MEg4MFYxMjBaIiBmaWxsPSIjOUI1Q0Y2Ii8+CjxwYXRoIGQ9Ik05MCAxNDBIMTEwVjE2MEg5MFYxNDBaIiBmaWxsPSIjOUI1Q0Y2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUI1Q0Y2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
                      }}
                    />
                    <p>{show.name}</p>
                    <span>⭐ {show.vote_average}</span>
                  </li>
                ))}
              </ul>
            </>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
