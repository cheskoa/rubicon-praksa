import { useEffect, useState } from "react";
import Header from "./components/Header";
import { getTopRatedMovies, getTopRatedTVShows } from "./api/api";  // <-- folder api
import { Movie, TVShow } from "./types/types";                       // <-- folder types
import "./App.css";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [view, setView] = useState<"movies" | "tv">("movies");

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
      <Header />

      <main className="main">
        <h1>Welcome!</h1>
        <p className="subtitle">Choose one of the following</p>

        <div className="options">
          <button onClick={() => setView("movies")}>🎬 Movies</button>
          <button onClick={() => setView("tv")}>📺 TV Shows</button>
        </div>

        <div className="list">
          {view === "movies" ? (
            <>
              <h2>Top 10 Movies</h2>
              <ul className="grid">
                {movies.map((movie) => (
                  <li key={movie.id}>
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title}
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
                      src={`https://image.tmdb.org/t/p/w200${show.poster_path}`}
                      alt={show.name}
                    />
                    <p>{show.name}</p>
                    <span>⭐ {show.vote_average}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
