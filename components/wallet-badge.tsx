import { cn, shortAddress } from "@/lib/utils";
import { Copy, ExternalLink } from "lucide-react";

interface WalletBadgeProps {
  address: string;
  label?: string;
  chars?: number;
  showCopy?: boolean;
  showExplorer?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function WalletBadge({
  address,
  label,
  chars = 4,
  showCopy = false,
  showExplorer = false,
  size = "md",
  className,
}: WalletBadgeProps) {
  const display = label ?? shortAddress(address, chars);

  const sizeClass = {
    sm: "text-xs gap-1.5",
    md: "text-sm gap-2",
    lg: "text-base gap-2.5",
  }[size];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono",
        sizeClass,
        className,
      )}
      title={address}
    >
      <span className="w-2 h-2 rounded-full bg-violet-400/70 flex-shrink-0" />
      <span className="text-slate-200">{display}</span>
      {showCopy && (
        <button
          onClick={copyToClipboard}
          className="text-slate-500 hover:text-slate-300 transition-colors"
          title="Copy address"
        >
          <Copy className="w-3 h-3" />
        </button>
      )}
      {showExplorer && (
        <a
          href={`https://solscan.io/account/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </span>
  );
}
