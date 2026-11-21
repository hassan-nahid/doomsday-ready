import { FormEvent, useState } from "react";
import { api } from "@/api";
import { MovieChecklist } from "@/components/shared/MovieChecklist";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SAMPLE_MCU_MOVIES } from "@/data/sampleMovies";
import type { Movie } from "@/types";

interface AddMovieFormProps {
  movies: Movie[];
  onRefresh: () => Promise<void>;
  onError: (msg: string | null) => void;
  onSuccess: (msg: string | null) => void;
  error: string | null;
  success: string | null;
}

export function AddMovieForm({
  movies,
  onRefresh,
  onError,
  onSuccess,
  error,
  success,
}: AddMovieFormProps) {
  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState(2026);
  const [runtimeMinutes, setRuntimeMinutes] = useState(140);
  const [selectedPrereqs, setSelectedPrereqs] = useState<string[]>([]);
  const [watched, setWatched] = useState(false);
  const [busy, setBusy] = useState(false);

  const togglePrereq = (id: string) => {
    setSelectedPrereqs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    onError(null);
    onSuccess(null);
    setBusy(true);
    try {
      await api.createMovie({
        title: title.trim(),
        releaseYear: Number(releaseYear),
        runtimeMinutes: Number(runtimeMinutes),
        prerequisites: selectedPrereqs,
        watched,
      });
      setTitle("");
      setSelectedPrereqs([]);
      setWatched(false);
      onSuccess("Movie added!");
      await onRefresh();
    } catch (err) {
      onError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const handleLoadSample = async () => {
    onError(null);
    onSuccess(null);
    setBusy(true);
    try {
      const idByTitle = new Map<string, string>(
        movies.map((m) => [m.title.toLowerCase(), m._id])
      );

      for (const item of SAMPLE_MCU_MOVIES) {
        if (idByTitle.has(item.title.toLowerCase())) continue;
        const prereqIds = item.prereqs
          .map((pTitle) => idByTitle.get(pTitle.toLowerCase()))
          .filter((id): id is string => Boolean(id));

        const created = await api.createMovie({
          title: item.title,
          releaseYear: item.releaseYear,
          runtimeMinutes: item.runtimeMinutes,
          prerequisites: prereqIds,
          watched: false,
        });
        idByTitle.set(created.title.toLowerCase(), created._id);
      }
      onSuccess("Sample MCU movies loaded!");
      await onRefresh();
    } catch (err) {
      onError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Movie</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <form onSubmit={handleCreate} className="space-y-3.5">
          <div className="space-y-1.5">
            <label
              htmlFor="movie-title"
              className="text-xs font-medium text-[hsl(var(--muted-foreground))]"
            >
              Title (unique)
            </label>
            <Input
              id="movie-title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Avengers: Doomsday"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label
                htmlFor="movie-year"
                className="text-xs font-medium text-[hsl(var(--muted-foreground))]"
              >
                Release Year
              </label>
              <Input
                id="movie-year"
                type="number"
                min={1888}
                max={2100}
                required
                value={releaseYear}
                onChange={(e) => setReleaseYear(Number(e.target.value))}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="movie-runtime"
                className="text-xs font-medium text-[hsl(var(--muted-foreground))]"
              >
                Runtime (1–300m)
              </label>
              <Input
                id="movie-runtime"
                type="number"
                min={1}
                max={300}
                required
                value={runtimeMinutes}
                onChange={(e) => setRuntimeMinutes(Number(e.target.value))}
              />
            </div>
          </div>

          {movies.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[hsl(var(--muted-foreground))]">
                Prerequisites (optional)
              </label>
              <MovieChecklist
                movies={movies}
                selectedIds={selectedPrereqs}
                onToggle={togglePrereq}
              />
            </div>
          )}

          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-sky-400"
              checked={watched}
              onChange={(e) => setWatched(e.target.checked)}
            />
            <span>Already watched</span>
          </label>

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Saving..." : "Add Movie"}
          </Button>
        </form>

        <div className="border-t border-[hsl(var(--border))] pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleLoadSample}
            disabled={busy}
            className="w-full"
          >
            Load Sample MCU Movies
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
