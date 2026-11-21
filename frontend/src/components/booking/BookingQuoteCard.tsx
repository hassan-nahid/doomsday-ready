import { FormEvent, useState } from "react";
import { api } from "@/api";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { BookingQuoteResponse, Cinema } from "@/types";

interface BookingQuoteCardProps {
  cinemas: Cinema[];
  selectedCinemaId: string;
  onSelectCinema: (id: string) => void;
  onError: (msg: string | null) => void;
}

export function BookingQuoteCard({
  cinemas,
  selectedCinemaId,
  onSelectCinema,
  onError,
}: BookingQuoteCardProps) {
  const [groupSize, setGroupSize] = useState(44);
  const [quote, setQuote] = useState<BookingQuoteResponse | null>(null);
  const [busy, setBusy] = useState(false);

  const activeCinema = cinemas.find((c) => c._id === selectedCinemaId);

  const handleGetQuote = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCinemaId) {
      onError("Please select a cinema first");
      return;
    }
    onError(null);
    setQuote(null);
    setBusy(true);
    try {
      const res = await api.getBookingQuote(selectedCinemaId, Number(groupSize));
      setQuote(res);
    } catch (err) {
      onError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Watch-Party Booking Quote</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cinemas.length === 0 ? (
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            No cinemas yet. Add a cinema on the left to calculate seat bundles.
          </p>
        ) : (
          <form onSubmit={handleGetQuote} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="select-cinema"
                className="text-xs font-medium text-[hsl(var(--muted-foreground))]"
              >
                Select Cinema
              </label>
              <Select
                id="select-cinema"
                value={selectedCinemaId}
                onChange={(e) => {
                  onSelectCinema(e.target.value);
                  setQuote(null);
                }}
              >
                {cinemas.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} (bundles: {c.bundleSizes.join(", ")})
                  </option>
                ))}
              </Select>
            </div>

            {activeCinema && (
              <div className="flex flex-wrap gap-2">
                {activeCinema.bundleSizes.map((size) => (
                  <Badge key={size}>{size}-seat bundle</Badge>
                ))}
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="group-size"
                className="text-xs font-medium text-[hsl(var(--muted-foreground))]"
              >
                Group Size (1–10,000)
              </label>
              <Input
                id="group-size"
                type="number"
                min={1}
                max={10000}
                required
                value={groupSize}
                onChange={(e) => setGroupSize(Number(e.target.value))}
              />
            </div>

            <Button type="submit" disabled={busy}>
              Calculate Bundles
            </Button>
          </form>
        )}

        {quote && (
          <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))]/40 p-4">
            {!quote.possible ? (
              <Alert variant="warning">
                <strong>Not possible:</strong> No exact bundle combination adds
                up to {quote.groupSize} seats.
              </Alert>
            ) : (
              <div className="space-y-2.5">
                <div className="text-base font-semibold text-white">
                  {quote.totalBundles} bundle
                  {quote.totalBundles === 1 ? "" : "s"} needed for{" "}
                  {quote.groupSize} seats
                </div>
                <div className="flex flex-wrap gap-2">
                  {quote.breakdown.map((item) => (
                    <Badge key={item.bundleSize} variant="success">
                      {item.bundleSize} × {item.count}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
