import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getTVDetails } from '../api/api';
import './details.css';

const Details: React.FC = () => {
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
    <div className="details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ⟵ Nazad
      </button>
      
      {loading && <div className="loading">Loading...</div>}
      
      {!loading && data && (
        <>
          <div className="details-hero">
            <div 
              className="details-backdrop"
              style={{
                backgroundImage: `url(${data.backdrop_path ? `https://image.tmdb.org/t/p/w1920${data.backdrop_path}` : data.poster_path ? `https://image.tmdb.org/t/p/w1920${data.poster_path}` : "/placeholder-movie.jpg"})`
              }}
            />
            <div className="details-hero-content">
              <h1 className="details-title">{data.title || data.name}</h1>
              <div className="details-rating">
                ⭐ {data.vote_average}/10
              </div>
            </div>
          </div>
          
          <div className="details-content">
            <div className="details-poster">
              <img
                src={data.poster_path ? `https://image.tmdb.org/t/p/w400${data.poster_path}` : "/placeholder-movie.jpg"}
                alt={data.title || data.name}
                className="details-image"
              />
            </div>
            
            <div className="details-info">
              {data.overview && (
                <div className="details-overview">
                  <h3>Overview</h3>
                  <p>{data.overview}</p>
                </div>
              )}
              
              <div className="details-meta">
                {type === "movie" && data.release_date && (
                  <p><strong>Release Date:</strong> {data.release_date}</p>
                )}
                {type === "tv" && data.first_air_date && (
                  <p><strong>First Air Date:</strong> {data.first_air_date}</p>
                )}
                {data.runtime && (
                  <p><strong>Runtime:</strong> {data.runtime} minutes</p>
                )}
                {data.number_of_seasons && (
                  <p><strong>Seasons:</strong> {data.number_of_seasons}</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Details;
