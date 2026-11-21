export interface MovieRef {
  _id: string;
  title: string;
  releaseYear: number;
  runtimeMinutes: number;
  watched: boolean;
}

export interface Movie {
  _id: string;
  title: string;
  releaseYear: number;
  runtimeMinutes: number;
  prerequisites: (MovieRef | string)[];
  watched: boolean;
}

export interface RewatchOrderResponse {
  target: Movie;
  order: Movie[];
  watchedCount: number;
  totalCount: number;
  unwatchedRuntimeMinutes: number;
}

export interface Cinema {
  _id: string;
  name: string;
  bundleSizes: number[];
}

export interface BundleBreakdownItem {
  bundleSize: number;
  count: number;
}

export interface BookingQuoteResponse {
  possible: boolean;
  groupSize: number;
  totalBundles: number;
  breakdown: BundleBreakdownItem[];
  message: string;
}
