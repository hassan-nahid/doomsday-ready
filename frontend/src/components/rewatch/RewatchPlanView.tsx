import { useEffect, useState } from "react";
import { api } from "@/api";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import type { Movie, RewatchOrderResponse } from "@/types";
import { RewatchSummary } from "./RewatchSummary";

interface RewatchPlanViewProps {
  movies: Movie[];
  onRefresh: () => Promise<void>;
}

export default function RewatchPlanView({
  movies,
  onRefresh,
}: RewatchPlanViewProps) {
  const [targetId, setTargetId] = useState<string>("");
  const [plan, setPlan] = useState<RewatchOrderResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!targetId && movies.length > 0) {
      const doomsday = movies.find((m) =>
        m.title.toLowerCase().includes("doomsday")
      );
      setTargetId(doomsday?._id || movies[movies.length - 1]._id);
    }
  }, [movies, targetId]);

  useEffect(() => {
    if (!targetId) {
      setPlan(null);
      return;
    }

    const loadPlan = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getRewatchOrder(targetId);
        setPlan(res);
      } catch (err) {
        setError((err as Error).message);
        setPlan(null);
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, [targetId, movies]);

  const handleToggleWatched = async (movie: Movie) => {
    try {
      await api.updateMovie(movie._id, { watched: !movie.watched });
      await onRefresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rewatch Plan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {error && <Alert variant="error">{error}</Alert>}

        <div className="max-w-md space-y-1.5">
          <label
            htmlFor="target-movie"
            className="text-xs font-medium text-[hsl(var(--muted-foreground))]"
          >
            Target Movie
          </label>
          <Select
            id="target-movie"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
          >
            <option value="">-- Select a movie --</option>
            {movies.map((m) => (
              <option key={m._id} value={m._id}>
                {m.title} ({m.releaseYear})
              </option>
            ))}
          </Select>
        </div>

        {loading && (
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Calculating rewatch order...
          </p>
        )}

        {plan && !loading && (
          <div className="space-y-4">
            <RewatchSummary
              watchedCount={plan.watchedCount}
              totalCount={plan.totalCount}
              unwatchedRuntimeMinutes={plan.unwatchedRuntimeMinutes}
            />

            {plan.order.length === 0 ? (
              <Alert variant="success">
                No prerequisite movies needed before{" "}
                <strong>{plan.target.title}</strong>! You are ready to watch it.
              </Alert>
            ) : (
              <div className="space-y-2">
                {plan.order.map((movie, index) => (
                  <div
                    key={movie._id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))]/40 px-4 py-3"
                  >
                    <label className="flex flex-1 cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        className="accent-sky-400"
                        checked={movie.watched}
                        onChange={() => handleToggleWatched(movie)}
                      />
                      <div>
                        <div
                          className={`font-semibold ${
                            movie.watched
                              ? "line-through text-[hsl(var(--muted-foreground))]"
                              : "text-white"
                          }`}
                        >
                          {index + 1}. {movie.title}
                        </div>
                        <div className="text-xs text-[hsl(var(--muted-foreground))]">
                          {movie.releaseYear} · {movie.runtimeMinutes} min
                        </div>
                      </div>
                    </label>
                    <Badge variant={movie.watched ? "success" : "default"}>
                      {movie.watched ? "Watched" : "Up Next"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
