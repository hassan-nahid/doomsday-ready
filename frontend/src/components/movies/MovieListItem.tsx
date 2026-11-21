import { useState } from "react";
import { MovieChecklist } from "@/components/shared/MovieChecklist";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/types";

interface MovieListItemProps {
  movie: Movie;
  allMovies: Movie[];
  busy: boolean;
  onToggleWatched: (movie: Movie) => Promise<void>;
  onSavePrerequisites: (movieId: string, prereqIds: string[]) => Promise<boolean>;
}

export function MovieListItem({
  movie,
  allMovies,
  busy,
  onToggleWatched,
  onSavePrerequisites,
}: MovieListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editPrereqs, setEditPrereqs] = useState<string[]>([]);

  const getPrereqIds = (m: Movie): string[] =>
    m.prerequisites.map((p) => (typeof p === "string" ? p : p._id));

  const prereqTitles = movie.prerequisites.map((p) =>
    typeof p === "string"
      ? allMovies.find((m) => m._id === p)?.title || p
      : p.title
  );

  const handleToggleEdit = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      setEditPrereqs(getPrereqIds(movie));
      setIsEditing(true);
    }
  };

  const togglePrereq = (id: string) => {
    setEditPrereqs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    const ok = await onSavePrerequisites(movie._id, editPrereqs);
    if (ok) {
      setIsEditing(false);
    }
  };

  return (
    <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))]/40 p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex flex-1 cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 accent-sky-400"
            checked={movie.watched}
            onChange={() => onToggleWatched(movie)}
          />
          <div>
            <div
              className={`font-semibold ${
                movie.watched
                  ? "line-through text-[hsl(var(--muted-foreground))]"
                  : "text-white"
              }`}
            >
              {movie.title}
            </div>
            <div className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">
              {movie.releaseYear} · {movie.runtimeMinutes} min
              {prereqTitles.length > 0
                ? ` · Watch first: ${prereqTitles.join(", ")}`
                : " · No prerequisites"}
            </div>
          </div>
        </label>

        <div className="flex items-center gap-2">
          <Badge variant={movie.watched ? "success" : "secondary"}>
            {movie.watched ? "Watched" : "Unwatched"}
          </Badge>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleToggleEdit}
          >
            {isEditing ? "Cancel" : "Edit Prerequisites"}
          </Button>
        </div>
      </div>

      {isEditing && (
        <div className="mt-3 space-y-2 border-t border-[hsl(var(--border))] pt-3">
          <MovieChecklist
            movies={allMovies}
            selectedIds={editPrereqs}
            onToggle={togglePrereq}
            selfId={movie._id}
          />
          <Button
            type="button"
            size="sm"
            disabled={busy}
            onClick={handleSave}
          >
            Save Prerequisites
          </Button>
        </div>
      )}
    </div>
  );
}
