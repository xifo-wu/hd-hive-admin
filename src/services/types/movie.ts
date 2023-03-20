import type { Genre, Images } from './tmdb';

export interface Collection {
  id: number;
  name: string;
  backdrop_path: string;
  poster_path: string;
}

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  adult: boolean;
  belongs_to_collection?: Collection;
  genres: Array<Genre>;
  genre_names: Array<string>;
  images: Images;
  imdb_id: string;
  original_language: string;
  overview: string;
  runtime: number;
  status: string;
  tagline: string;
}
