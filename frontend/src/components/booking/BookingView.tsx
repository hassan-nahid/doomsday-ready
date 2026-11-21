import { useEffect, useState } from "react";
import { api } from "@/api";
import type { Cinema } from "@/types";
import { AddCinemaForm } from "./AddCinemaForm";
import { BookingQuoteCard } from "./BookingQuoteCard";

export default function BookingView() {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadCinemas = async () => {
    try {
      const data = await api.getCinemas();
      setCinemas(data);
      if (!selectedCinemaId && data.length > 0) {
        setSelectedCinemaId(data[0]._id);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    loadCinemas();
  }, []);

  const handleCreated = async (created: Cinema) => {
    await loadCinemas();
    setSelectedCinemaId(created._id);
  };

  return (
    <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[360px_1fr]">
      <AddCinemaForm
        cinemas={cinemas}
        onCreated={handleCreated}
        onRefresh={loadCinemas}
        onError={setError}
        error={error}
      />
      <BookingQuoteCard
        cinemas={cinemas}
        selectedCinemaId={selectedCinemaId}
        onSelectCinema={setSelectedCinemaId}
        onError={setError}
      />
    </div>
  );
}
