import { useEffect, useState, useRef } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Header, { HeaderRef } from "./components/Header";
import PosterGrid from "./components/poster";
import Details from "./components/Details";
import { getTopRatedMovies, getTopRatedTVShows, searchMulti } from "./api/api";
import { Movie, TVShow } from "./types/types";
import "./App.css";
import { useAppStore } from "./store/useAppStore";

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const view = useAppStore(s => s.view);
  const setView = useAppStore(s => s.setView);
  const setSearchQueryGlobal = useAppStore(s => s.setSearchQuery);
  const [searchResults, setSearchResults] = useState<(Movie | TVShow)[]>([]);
  const [searching, setSearching] = useState(false);
  const headerRef = useRef<HeaderRef>(null);
  const navigate = useNavigate();
  const query = useQuery();
  const location = useLocation();

  useEffect(() => {
    async function fetchData() {
      const movieData = await getTopRatedMovies();
      setMovies(movieData.slice(0, 10));

      const tvData = await getTopRatedTVShows();
      setTVShows(tvData.slice(0, 10));
    }

    fetchData();
  }, []);

  useEffect(() => {
    const q = query.get("q") || "";
    const v = (query.get("view") as "movies" | "tv") || "movies";
    setView(v);
    setSearchQueryGlobal(q);
    if (!q) {
      setSearchResults([]);
      setSearching(false);
      headerRef.current?.clearSearch();
      return;
    }
    (async () => {
      setSearching(true);
      const res = await searchMulti(q);
      const filtered = res.filter((item: any) => {
        if (item.media_type === "person") return false;
        if (v === "movies") return item.media_type === "movie";
        return item.media_type === "tv";
      });
      setSearchResults(filtered as unknown as (Movie | TVShow)[]);
      setSearching(false);
    })();
  }, [location.search]);

  return (
    <div className="App">
      <Header
        ref={headerRef}
        onSearch={(q) => {
          const params = new URLSearchParams(location.search);
          if (q.trim()) {
            params.set("q", q.trim());
          } else {
            params.delete("q");
          }
          params.set("view", view);
          navigate({ pathname: "/", search: params.toString() });
        }}
      />

      <main className="main">
        {location.pathname === "/" && (
        <div className="options">
          <button onClick={() => {
            const params = new URLSearchParams(location.search);
            params.set("view", "movies");
            params.delete("q");
            navigate({ pathname: "/", search: params.toString() });
            setView("movies");
            setSearchQueryGlobal("");
          }}>🎬 Movies</button>
          <button onClick={() => {
            const params = new URLSearchParams(location.search);
            params.set("view", "tv");
            params.delete("q");
            navigate({ pathname: "/", search: params.toString() });
            setView("tv");
            setSearchQueryGlobal("");
          }}>📺 TV Shows</button>
        </div>
        )}

        <Routes>
          <Route path="/" element={(
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
          )} />
          <Route path="/details/:type/:id" element={<Details />} />
        </Routes>
      </main>
    </div>
  );
}


export default App;
