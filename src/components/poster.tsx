import "./poster.css";
import { Link } from "react-router-dom";
import { Movie, TVShow } from "../types/types";

type MediaItem = Movie | TVShow;

interface PosterGridProps {
  title: string;
  items: MediaItem[];
}

export default function PosterGrid({ title, items }: PosterGridProps) {
  return (
    <>
      <h2>{title}</h2>
      <ul className="poster-grid">
        {items.map((item: any) => {
          const type = (item as any).title ? "movie" : "tv";
          return (
            <li key={item.id} className="poster-card">
              <Link to={`/details/${type}/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <img
                  className="poster-image"
                  src={item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : "/placeholder-movie.jpg"}
                  alt={item.title || item.name}
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNODEgMTIwSDEyMFYxODBIODFWMTIwWiIgZmlsbD0iIjlCNUNGNiIvPjxwYXRoIGQ9Ikk5MCAxNDBIMTEwVjE2MEg5MFYxNDBaIiBmaWxsPSIjOUI1Q0Y2Ii8+PHRleHQgeD0iMTAwIiB5PSIyMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5QjVDRjYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";
                  }}
                />
                <p className="poster-title">{item.title || item.name}</p>
                <span className="poster-rating">⭐ {item.vote_average}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}