export interface Image {
  aspect_ratio: number;
  file_path: string;
  height: number;
  iso_639_1: null | string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface Images {
  backdrops: Array<Image>;
  logos: Array<Image>;
  posters: Array<Image>;
}

export interface Genre {
  i: number;
  nam: string;
}
