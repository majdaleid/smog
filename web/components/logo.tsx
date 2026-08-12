import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** size of the accent dot in pixels */
  dotClassName?: string;
};

/**
 * smog wordmark — lowercase logotype with an animated accent dot.
 */
export function Logo({ className, dotClassName }: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline font-semibold tracking-tight text-foreground",
        className,
      )}
    >
      smog
      <span
        aria-hidden="true"
        className={cn(
          "smog-dot ml-[1px] inline-block size-[0.42em] rounded-full bg-emerald-400 shadow-[0_0_10px_2px] shadow-emerald-400/60",
          dotClassName,
        )}
      />
    </span>
  );
}
