import { lazy, Suspense, useEffect, useState } from "react";
import { api } from "./api";
import { Alert } from "./components/ui/alert";
import { Button } from "./components/ui/button";
import type { Movie } from "./types";

const MoviesView = lazy(() => import("./components/movies/MoviesView"));
const RewatchPlanView = lazy(
  () => import("./components/rewatch/RewatchPlanView")
);
const BookingView = lazy(() => import("./components/booking/BookingView"));

type Tab = "movies" | "rewatch" | "booking";

export default function App() {
  const [tab, setTab] = useState<Tab>("movies");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchMovies = async () => {
    try {
      setLoadError(null);
      const data = await api.getMovies();
      setMovies(data);
    } catch (err) {
      setLoadError((err as Error).message);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[hsl(var(--border))] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Doomsday Ready
          </h1>
          <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
            MCU Rewatch Order &amp; Opening-Night Watch-Party Planner
          </p>
        </div>

        <nav
          aria-label="Primary Views"
          className="flex flex-wrap gap-1.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1.5"
        >
          <Button
            type="button"
            size="sm"
            variant={tab === "movies" ? "default" : "ghost"}
            onClick={() => setTab("movies")}
          >
            1. Movies
          </Button>
          <Button
            type="button"
            size="sm"
            variant={tab === "rewatch" ? "default" : "ghost"}
            onClick={() => setTab("rewatch")}
          >
            2. Rewatch Plan
          </Button>
          <Button
            type="button"
            size="sm"
            variant={tab === "booking" ? "default" : "ghost"}
            onClick={() => setTab("booking")}
          >
            3. Booking
          </Button>
        </nav>
      </header>

      {loadError && (
        <Alert variant="error" className="mb-5">
          Failed to connect to backend API: {loadError}
        </Alert>
      )}

      <Suspense
        fallback={
          <div className="py-10 text-center text-sm text-[hsl(var(--muted-foreground))]">
            Loading view...
          </div>
        }
      >
        {tab === "movies" && (
          <MoviesView movies={movies} onRefresh={fetchMovies} />
        )}
        {tab === "rewatch" && (
          <RewatchPlanView movies={movies} onRefresh={fetchMovies} />
        )}
        {tab === "booking" && <BookingView />}
      </Suspense>
    </div>
  );
}
