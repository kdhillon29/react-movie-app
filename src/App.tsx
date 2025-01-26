import MovieCard from "./components/MovieCard";
import Search from "./components/Search";
import MovieSkeleton from "./components/MovieSkeleton";
import { useCallback, useEffect, useState } from "react";
import { Models } from "appwrite";
import { useDebounce } from "./hooks/useDebounce";
import { getTrendingMovies, updateSearchCount } from "./lib/appwrite";
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
  const debouncedValue = useDebounce(searchterm, 1000);
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState<Models.Document[]>([]);

  const baseUrl = "https://api.themoviedb.org/3";
  const apiKey = import.meta.env.VITE_TMDB_API_ACCESS_TOKEN;

  // console.log(searchterm, debouncedValue);
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  };
  const fetchMovies = useCallback(
    async (query: string = "") => {
      try {
        // setMovies([]);
        setLoading(true);
        const endpoint = query
          ? `/search/movie?query=${encodeURIComponent(query)}`
          : "/discover/movie?sort_by=popularity.desc";
        const res = await fetch(`${baseUrl}${endpoint}`, options);
        const data = await res.json();
        if (data.Response === "False") {
          setError(data.Error || "Failed to fetch movies data");
          setMovies([]);
        }
        setMovies(data.results || []);
        if (query && data.results.length > 0) {
          await updateSearchCount(query, data.results[0]);
        }
        // setSearchTerm("");

        console.log(data);
      } catch (error) {
        setError("error fetching data");
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [debouncedValue]
  );
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      console.log("movies", movies);
      if (movies && movies.length > 0) setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };
  useEffect(() => {
    fetchMovies(debouncedValue);
  }, [debouncedValue, fetchMovies]);
  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="hero " />
          <h1>
            Find the <span className="text-gradient">Latest Movies</span> you
            love without the hassle
          </h1>
          <Search
            searchterm={searchterm}
            isLoading={loading}
            setSearchTerm={setSearchTerm}
          />
        </header>
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2 className="mt-2 px-5 text-white  border-b-2 border-purple-500">
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
