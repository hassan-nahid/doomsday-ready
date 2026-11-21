import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva("rounded-lg border px-3.5 py-2.5 text-sm", {
  variants: {
    variant: {
      error: "border-red-500/40 bg-red-500/15 text-red-300",
      success: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
      warning: "border-amber-500/40 bg-amber-500/15 text-amber-200",
    },
  },
  defaultVariants: {
    variant: "error",
  },
});

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}
