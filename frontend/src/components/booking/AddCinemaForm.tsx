import { FormEvent, useState } from "react";
import { api } from "@/api";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SAMPLE_CINEMAS } from "@/data/sampleCinemas";
import type { Cinema } from "@/types";

interface AddCinemaFormProps {
  cinemas: Cinema[];
  onCreated: (cinema: Cinema) => Promise<void>;
  onRefresh: () => Promise<void>;
  onError: (msg: string | null) => void;
  error: string | null;
}

export function AddCinemaForm({
  cinemas,
  onCreated,
  onRefresh,
  onError,
  error,
}: AddCinemaFormProps) {
  const [cinemaName, setCinemaName] = useState("");
  const [bundleInput, setBundleInput] = useState("6, 9, 20");
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    onError(null);
    setSuccess(null);

    const parsedSizes = bundleInput
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => !Number.isNaN(n) && n > 0);

    if (parsedSizes.length === 0) {
      onError("Enter at least one valid bundle size (e.g. 2, 5)");
      return;
    }

    setBusy(true);
    try {
      const created = await api.createCinema({
        name: cinemaName.trim(),
        bundleSizes: parsedSizes,
      });
      setCinemaName("");
      setSuccess(`Cinema "${created.name}" added!`);
      await onCreated(created);
    } catch (err) {
      onError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const handleLoadSample = async () => {
    onError(null);
    setSuccess(null);
    setBusy(true);
    try {
      const existingNames = new Set(
        cinemas.map((c) => c.name.toLowerCase())
      );

      for (const sample of SAMPLE_CINEMAS) {
        if (existingNames.has(sample.name.toLowerCase())) continue;
        await api.createCinema(sample);
      }

      setSuccess("Sample cinemas loaded!");
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
        <CardTitle>Add Cinema</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1.5">
            <label
              htmlFor="cinema-name"
              className="text-xs font-medium text-[hsl(var(--muted-foreground))]"
            >
              Cinema Name (unique)
            </label>
            <Input
              id="cinema-name"
              required
              value={cinemaName}
              onChange={(e) => setCinemaName(e.target.value)}
              placeholder="e.g. Star Cineplex IMAX"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="bundle-sizes"
              className="text-xs font-medium text-[hsl(var(--muted-foreground))]"
            >
              Bundle Sizes (1–10 sizes, comma-separated, 1–500 seats)
            </label>
            <Input
              id="bundle-sizes"
              required
              value={bundleInput}
              onChange={(e) => setBundleInput(e.target.value)}
              placeholder="e.g. 6, 9, 20"
            />
          </div>

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Saving..." : "Add Cinema"}
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
            Load Sample Cinemas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
