export interface Movie {
  id: number
  title: string
  originalTitle: string
  language: string
  releaseYear: number
  releaseDate: string
  genres: Array<string>
  plot: string
  runtime: number | string
  budget: string
  revenue: string
  homepage: string
  status: string
  posterUrl: string
  backdropUrl: string
  trailerUrl: string
  trailerYoutubeId: string
  tmdbRating: number | null
  searchL: string
  keywords: string[]
  countriesOfOrigin: string[]
  languages: string[]
  cast: string[]
  director: string
  production: string
  awardsSummary: string
}