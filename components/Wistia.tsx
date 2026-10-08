/** Wistia player via their iframe embed (no third-party script needed). */
export default function Wistia({ id, className = "" }: { id: string; className?: string }) {
  return (
    <div className={`relative w-full overflow-hidden rounded-lg bg-black pt-[56.25%] ${className}`}>
      <iframe
        src={`https://fast.wistia.net/embed/iframe/${id}?seo=true&videoFoam=true`}
        title="Video"
        allow="autoplay; fullscreen"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
        loading="lazy"
      />
    </div>
  );
}
