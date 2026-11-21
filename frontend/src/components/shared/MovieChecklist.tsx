import type { Movie } from "@/types";

interface MovieChecklistProps {
  movies: Movie[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  selfId?: string;
}

export function MovieChecklist({
  movies,
  selectedIds,
  onToggle,
  selfId,
}: MovieChecklistProps) {
  return (
    <div className="max-h-40 space-y-1.5 overflow-y-auto rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-2.5">
      {movies.map((movie) => (
        <label
          key={movie._id}
          className="flex cursor-pointer items-center gap-2 text-sm"
        >
          <input
            type="checkbox"
            className="accent-sky-400"
            checked={selectedIds.includes(movie._id)}
            onChange={() => onToggle(movie._id)}
          />
          <span>
            {movie.title}
            {selfId === movie._id ? " (self)" : ""}
          </span>
        </label>
      ))}
    </div>
  );
}
