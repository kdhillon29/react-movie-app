import Spinner from "./Spinner";

type SearchProps = {
  searchterm: string;
  setSearchTerm?: (searchterm: string) => void;
  isLoading: boolean;
};

function Search({ searchterm, setSearchTerm, isLoading }: SearchProps) {
  // console.log(searchterm, setSearchTerm);

  return (
    <div className="search ">
      <div>
        <img src="./search.svg" alt="" />
        <input
          type="text"
          placeholder="Search movies"
          value={searchterm}
          onChange={(e) => setSearchTerm?.(e.target.value)}
        />
        {isLoading && <Spinner />}
      </div>
    </div>
  );
}

export default Search;
