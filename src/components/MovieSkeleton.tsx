const MovieSkeleton = () => {
  return (
    <div className="movie-card animate-pulse">
      <div className="bg-gray-700/50 w-full aspect-[2/3] rounded-lg" />
      <div className="mt-4 space-y-3">
        <div className="h-4 bg-gray-700/50 rounded w-3/4" />
        <div className="flex items-center gap-2">
          <div className="h-4 bg-gray-700/50 rounded w-10" />
          <span className="text-gray-700/50">•</span>
          <div className="h-4 bg-gray-700/50 rounded w-8" />
          <span className="text-gray-700/50">•</span>
          <div className="h-4 bg-gray-700/50 rounded w-12" />
        </div>
      </div>
    </div>
  );
};

export default MovieSkeleton;
