import { useEffect, useState, useRef } from "react";
import { Routes, Route, useLocation, useNavigate, useParams, Link } from "react-router-dom";
import Header, { HeaderRef } from "./components/Header";
import PosterGrid from "./components/poster";
import { getTopRatedMovies, getTopRatedTVShows, searchMulti, getMovieDetails, getTVDetails } from "./api/api";
import { Movie, TVShow } from "./types/types";
import "./App.css";

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [view, setView] = useState<"movies" | "tv">("movies");
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
        <div className="options">
          <button onClick={() => {
            const params = new URLSearchParams(location.search);
            params.set("view", "movies");
            params.delete("q");
            navigate({ pathname: "/", search: params.toString() });
          }}>🎬 Movies</button>
          <button onClick={() => {
            const params = new URLSearchParams(location.search);
            params.set("view", "tv");
            params.delete("q");
            navigate({ pathname: "/", search: params.toString() });
          }}>📺 TV Shows</button>
        </div>

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
          <Route path="/details/:type/:id" element={<DetailsPage />} />
        </Routes>
      </main>
    </div>
  );
}

function DetailsPage() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = type === "movie" ? await getMovieDetails(id) : await getTVDetails(id);
      setData(res);
      setLoading(false);
    })();
  }, [type, id]);

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate(-1)}>⟵ Nazad</button>
      {loading && <p>Loading...</p>}
      {!loading && data && (
        <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
          <img
            src={data.poster_path ? `https://image.tmdb.org/t/p/w300${data.poster_path}` : "/placeholder-movie.jpg"}
            alt={data.title || data.name}
            style={{ borderRadius: 12 }}
          />
          <div>
            <h2>{data.title || data.name}</h2>
            <p>⭐ {data.vote_average}</p>
            {data.overview && <p>{data.overview}</p>}
            {type === "movie" && data.release_date && <p>Release date: {data.release_date}</p>}
            {type === "tv" && data.first_air_date && <p>First air date: {data.first_air_date}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
