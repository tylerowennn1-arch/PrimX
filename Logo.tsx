import coin from "@/assets/bitcoin-coin.jpg";

export function Logo({ size = 36, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <a href="/" className="flex items-center gap-3 group">
      <div
        className="relative rounded-full overflow-hidden ring-1 ring-[var(--gold)]/40 transition-transform group-hover:scale-105"
        style={{ width: size, height: size, boxShadow: "0 0 24px oklch(0.82 0.16 85 / 0.5)" }}
      >
        <img src={coin} alt="PrimXCapital" className="w-full h-full object-cover" />
      </div>
      {withText && (
        <span className="brand-wordmark text-2xl md:text-[1.7rem] font-normal leading-none whitespace-nowrap">
          <span className="text-foreground">Prim</span>
          <span className="gradient-text text-[1.2em] font-normal">X</span>
          <span className="text-foreground">Capital</span>
        </span>
      )}
    </a>
  );
}
