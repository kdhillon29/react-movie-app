import MovieCard from "./components/MovieCard";
import Search from "./components/Search";
import MovieSkeleton from "./components/MovieSkeleton";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "./hooks/useDebounce";
export type MovieType = {
  id: string;
  title: string;
  vote_average: number;
  poster_path: string;
  release_date: string;
  original_language: string;
};
function App() {
  const [searchterm, setSearchTerm] = useState<string>("");
  const debouncedValue = useDebounce(searchterm, 500);
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const baseUrl = "https://api.themoviedb.org/3";
  const apiKey = import.meta.env.VITE_TMDB_API_ACCESS_TOKEN;

  console.log(searchterm, debouncedValue);
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  };
  const fetchMovies = useCallback(async () => {
    try {
      // setMovies([]);
      setLoading(true);
      const endpoint = debouncedValue
        ? `/search/movie?query=${encodeURIComponent(debouncedValue)}`
        : "/discover/movie?sort_by=popularity.desc";
      const res = await fetch(`${baseUrl}${endpoint}`, options);
      const data = await res.json();
      if (data.Response === "False") {
        setError(data.Error || "Failed to fetch movies data");
        setMovies([]);
      }
      setMovies(data.results || []);
      // setSearchTerm("");

      console.log(data);
    } catch (error) {
      setError("error fetching data");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [debouncedValue]);
  useEffect(() => {
    fetchMovies();
  }, [debouncedValue, fetchMovies]);

  return (
    <>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="hero " />
          <h1>
            Find the <span className="text-gradient">Movies</span> you love
            without the hassle
          </h1>
          <Search searchterm={searchterm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="mt-20 px-5 text-white border-l-4 border-purple-500">
            All Movies
          </h2>

          {error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <ul>
              {loading
                ? Array(8)
                    .fill(null)
                    .map((_, index) => (
                      <li key={`skeleton-${index}`}>
                        <MovieSkeleton />
                      </li>
                    ))
                : movies.map((movie: MovieType) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

export default App;
