import Image from "next/image";
import type { Block, ImageBlock } from "@/lib/content";
import RichText from "./RichText";
import Reveal from "./Reveal";
import Wistia from "./Wistia";

/**
 * Renders the block sequence of a case study. Block shapes are produced by
 * tools/extract.py from the original Webflow layouts:
 *   image | text | split | frame | gallery | video | wistia | embed
 */

function isSvg(src: string) { return /\.svg(\?|$)/i.test(src); }

export function Img({ b, sizes = "100vw", className = "" }: { b: ImageBlock; sizes?: string; className?: string }) {
  const width: Record<ImageBlock["variant"], string> = {
    full: "w-full",
    web: "mx-auto w-[95%] max-w-[2000px]",
    mobile: "mx-auto w-full max-w-[886px]",
    small: "mx-auto w-full max-w-[630px]",
    smaller: "mx-auto w-4/5 max-w-[215px]",
  };
  const cls = `${width[b.variant]} ${b.rounded ? "rounded-2xl" : ""} ${className}`;
  const style = b.bg ? { backgroundColor: b.bg } : undefined;
  if (isSvg(b.src)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={b.src} alt={b.alt} className={`${cls} h-auto block`} style={style} loading="lazy" />;
  }
  return (
    <Image
      src={b.src}
      alt={b.alt}
      width={1600}
      height={1000}
      sizes={sizes}
      className={`${cls} h-auto block ${b.fit === "contain" ? "object-contain" : ""}`}
      style={style}
    />
  );
}

function Text({ html, centered, white, noPadding }: { html: string; centered?: boolean; white?: boolean; noPadding?: boolean }) {
  return (
    <RichText
      html={html}
      className={`${centered ? "mx-auto max-w-[810px] text-center" : "mx-auto max-w-[900px]"} ${white ? "white" : ""} ${noPadding ? "" : "py-6"}`}
    />
  );
}

export function Blocks({ blocks, nested = false }: { blocks: Block[]; nested?: boolean }) {
  return (
    <>
      {blocks.map((b, i) => {
        const key = i;
        switch (b.type) {
          case "image":
            return (
              <Reveal key={key} className={nested ? "" : "section py-6"}>
                <Img b={b} />
              </Reveal>
            );
          case "text":
            return (
              <div key={key} className={nested ? "" : "section py-4"}>
                <Text html={b.html} centered={b.centered} white={b.white} noPadding={b.noPadding} />
              </div>
            );
          case "split": {
            const media = <div className="min-w-0"><Blocks blocks={b.images} nested /></div>;
            const text = (
              <div className="min-w-0 self-center">
                <RichText html={b.html} />
              </div>
            );
            const cols = b.wide
              ? (b.imageFirst ? "md:grid-cols-[1fr_1fr_0.75fr]" : "md:grid-cols-[0.75fr_1fr_1fr]")
              : (b.imageFirst ? "md:grid-cols-[1.85fr_1fr]" : "md:grid-cols-[1fr_1.85fr]");
            return (
              <Reveal key={key} className={`${nested ? "" : "section"} grid gap-8 ${cols}`}>
                {b.imageFirst ? <>{b.wide ? <SplitMedia blocks={b.images} /> : media}{text}</> : <>{text}{b.wide ? <SplitMedia blocks={b.images} /> : media}</>}
              </Reveal>
            );
          }
          case "frame":
            return (
              <Reveal
                key={key}
                className={`${nested ? "" : "section"} text-center ${b.noPaddingTop ? "" : ""}`}
              >
                <div
                  className={`w-full ${b.noPaddingTop ? "px-6 pb-8 md:px-[100px] md:pb-[100px]" : "p-6 md:p-[100px]"}`}
                  style={{
                    backgroundColor: b.bg === "transparent" ? undefined : b.bg,
                    backgroundImage: b.bgImage ? `url(${b.bgImage})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "50% 50%",
                  }}
                >
                  <Blocks blocks={b.children} nested />
                </div>
              </Reveal>
            );
          case "gallery":
            return (
              <Reveal key={key} className={`${nested ? "" : "section"} grid gap-5 ${b.columns === 2 ? "md:grid-cols-2" : b.columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
                {b.children.map((c, j) => (
                  <div key={j}><Blocks blocks={[c]} nested /></div>
                ))}
              </Reveal>
            );
          case "video":
            return (
              <div key={key} className={nested ? "" : "section"}>
                <video src={b.src} poster={b.poster ?? undefined} controls playsInline className="mx-auto w-full max-w-[1200px] rounded-lg" />
              </div>
            );
          case "wistia":
            return b.id ? (
              <div key={key} className={nested ? "" : "section"}>
                <Wistia id={b.id} />
              </div>
            ) : null;
          case "embed":
            return (
              <div key={key} className={nested ? "" : "section"}>
                <iframe src={b.src} className="aspect-video w-full rounded-lg" loading="lazy" title="Embedded content" />
              </div>
            );
          default:
            return null;
        }
      })}
    </>
  );
}

/** For wide (two-image + text) splits, each image occupies its own column. */
function SplitMedia({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <div key={i} className="min-w-0 self-center"><Blocks blocks={[b]} nested /></div>
      ))}
    </>
  );
}
