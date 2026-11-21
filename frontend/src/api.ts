import type {
  BookingQuoteResponse,
  Cinema,
  Movie,
  RewatchOrderResponse,
} from "./types";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    const codePrefix = json.code ? `[${json.code}] ` : "";
    throw new Error(`${codePrefix}${json.message || "Request failed"}`);
  }
  return json.data as T;
}

export const api = {
  getMovies: () => request<Movie[]>("/movies"),

  createMovie: (payload: {
    title: string;
    releaseYear: number;
    runtimeMinutes: number;
    prerequisites: string[];
    watched: boolean;
  }) =>
    request<Movie>("/movies", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateMovie: (
    id: string,
    payload: {
      title?: string;
      releaseYear?: number;
      runtimeMinutes?: number;
      prerequisites?: string[];
      watched?: boolean;
    }
  ) =>
    request<Movie>(`/movies/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  getRewatchOrder: (id: string) =>
    request<RewatchOrderResponse>(`/movies/${id}/rewatch-order`),

  getCinemas: () => request<Cinema[]>("/cinemas"),

  createCinema: (payload: { name: string; bundleSizes: number[] }) =>
    request<Cinema>("/cinemas", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getBookingQuote: (cinemaId: string, groupSize: number) =>
    request<BookingQuoteResponse>(
      `/cinemas/${cinemaId}/booking?groupSize=${groupSize}`
    ),
};
