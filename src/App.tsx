import { useEffect, useState, useRef } from "react";
import Header, { HeaderRef } from "./components/Header";
import PosterGrid from "./components/poster";
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
            <PosterGrid title="Search results" items={searchResults} />
          )}
          {searchResults.length === 0 && !searching && (
            view === "movies" ? (
              <PosterGrid title="Top 10 Movies" items={movies} />
            ) : (
              <PosterGrid title="Top 10 TV Shows" items={tvShows} />
            )
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
