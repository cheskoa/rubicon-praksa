export interface Movie {
  id: number;
  title: string;
  vote_average: number;
  poster_path: string | null;
}

export interface TVShow {
  id: number;
  name: string;
  vote_average: number;
  poster_path: string | null;
}
