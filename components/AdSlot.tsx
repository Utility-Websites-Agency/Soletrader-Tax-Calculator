interface AdSlotProps {
  label?: string;
  className?: string;
}

export default function AdSlot({ label = "Ad Slot — Google AdSense", className = "" }: AdSlotProps) {
  return (
    <div
      className={`w-full border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg flex items-center justify-center py-6 px-4 my-4 ${className}`}
      aria-hidden="true"
    >
      <span className="text-sm text-gray-400 font-medium tracking-wide">{label}</span>
    </div>
  );
}
