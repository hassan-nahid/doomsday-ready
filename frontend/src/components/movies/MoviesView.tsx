import { useState } from "react";
import { api } from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Movie } from "@/types";
import { AddMovieForm } from "./AddMovieForm";
import { MovieListItem } from "./MovieListItem";

interface MoviesViewProps {
  movies: Movie[];
  onRefresh: () => Promise<void>;
}

export default function MoviesView({ movies, onRefresh }: MoviesViewProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleToggleWatched = async (movie: Movie) => {
    setError(null);
    setSuccess(null);
    try {
      await api.updateMovie(movie._id, { watched: !movie.watched });
      await onRefresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSavePrerequisites = async (
    movieId: string,
    prerequisites: string[]
  ): Promise<boolean> => {
    setError(null);
    setSuccess(null);
    setBusy(true);
    try {
      await api.updateMovie(movieId, { prerequisites });
      setSuccess("Prerequisites updated!");
      await onRefresh();
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[360px_1fr]">
      <AddMovieForm
        movies={movies}
        onRefresh={onRefresh}
        onError={setError}
        onSuccess={setSuccess}
        error={error}
        success={success}
      />

      <Card>
        <CardHeader>
          <CardTitle>Movies ({movies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {movies.length === 0 ? (
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              No movies yet. Add one on the left or click &ldquo;Load Sample MCU
              Movies&rdquo;.
            </p>
          ) : (
            <div className="space-y-2.5">
              {movies.map((movie) => (
                <MovieListItem
                  key={movie._id}
                  movie={movie}
                  allMovies={movies}
                  busy={busy}
                  onToggleWatched={handleToggleWatched}
                  onSavePrerequisites={handleSavePrerequisites}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
