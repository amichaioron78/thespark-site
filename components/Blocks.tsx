import Image from "next/image";
import type { Block, ImageBlock } from "@/lib/content";
import RichText from "./RichText";
import Reveal from "./Reveal";
import Wistia from "./Wistia";

/**
 * Renders the block sequence of a case study. Block shapes are produced by
 * tools/extract.py from the original Webflow layouts:
 *   image | text | split | frame | gallery | video | wistia | embed
 *
 * Spacing mirrors the Webflow build: every top-level block is an `.about-section`
 * (margin 4.8%, inner `.uk-container` padding 4.8%, 50px bottom padding, the first one
 * also 50px top padding — `.work-block`), passe-partout frames (`.works_image_passparto`)
 * touch each other when consecutive, centred copy under a full image sits 100px below it
 * (`.works_full_layout_t`).
 */

function isSvg(src: string) { return /\.svg(\?|$)/i.test(src); }

export function Img({ b, sizes = "100vw", className = "" }: { b: ImageBlock; sizes?: string; className?: string }) {
  // .works_image_full / .works_image_web (95%, 90% < 992px) / .works_image_mobile (886px) / small_630w / .smaller (215px)
  const width: Record<ImageBlock["variant"], string> = {
    full: "w-full",
    web: "mx-auto w-[90%] max-w-[2000px] lg:w-[95%]",
    mobile: "mx-auto w-full max-w-[70%] sm:max-w-[886px]",
    small: "mx-auto w-[90%] lg:w-[95%]",
    smaller: "mx-auto w-4/5 max-w-[215px]",
  };
  const cls = `${width[b.variant]} ${b.rounded ? "rounded-lg sm:rounded-2xl" : ""} ${className}`;
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

function Text({ html, centered, white, noPadding, nested }: { html: string; centered?: boolean; white?: boolean; noPadding?: boolean; nested?: boolean }) {
  // centred copy = .works_full_layout_t (max 810px, 100px above: 50px from the previous block + 50px here)
  const layout = centered
    ? `mx-auto max-w-[810px] px-0 text-center sm:px-5 ${noPadding || nested ? "" : "mt-10 md:mt-[14px] lg:mt-[50px]"}`
    : `max-w-[900px] ${noPadding || nested ? "" : "py-2"}`;
  return <RichText html={html} className={`work-text ${layout} ${white ? "white" : ""}`} />;
}

export function Blocks({ blocks, nested = false }: { blocks: Block[]; nested?: boolean }) {
  const wrap = (i: number) => (nested ? "" : `work-block ${i === 0 ? "first" : ""}`);
  return (
    <>
      {blocks.map((b, i) => {
        const key = i;
        switch (b.type) {
          case "image":
            return (
              <Reveal key={key} className={wrap(i)}>
                <Img b={b} />
              </Reveal>
            );
          case "text":
            return (
              <div key={key} className={wrap(i)}>
                <Text html={b.html} centered={b.centered} white={b.white} noPadding={b.noPadding} nested={nested} />
              </div>
            );
          case "split": {
            // .grid_col_left_text_right_image: 1fr 1.85fr, 30px gap (.flip reverses); wide = two images + text
            const media = <div className="min-w-0"><Blocks blocks={b.images} nested /></div>;
            const text = (
              <div className="min-w-0 self-center">
                <RichText html={b.html} className="work-text" />
              </div>
            );
            const cols = b.wide
              ? (b.imageFirst ? "lg:grid-cols-[1fr_1fr_0.75fr]" : "lg:grid-cols-[0.75fr_1fr_1fr]")
              : (b.imageFirst ? "lg:grid-cols-[1.85fr_1fr]" : "lg:grid-cols-[1fr_1.85fr]");
            return (
              <Reveal key={key} className={`${wrap(i)} grid gap-[30px] ${cols}`}>
                {b.imageFirst ? <>{b.wide ? <SplitMedia blocks={b.images} /> : media}{text}</> : <>{text}{b.wide ? <SplitMedia blocks={b.images} /> : media}</>}
              </Reveal>
            );
          }
          case "frame":
            // .works_image_passparto: 100px padding (32px vertical < 480px); consecutive frames touch (next one p-t-0)
            return (
              <Reveal key={key} className={`${wrap(i)} ${nested ? "" : "frame"} text-center`}>
                <div
                  className={`w-full ${b.noPaddingTop ? "px-6 pb-8 sm:px-10 md:px-[100px] md:pb-[100px]" : "px-6 py-8 sm:px-10 md:p-[100px]"}`}
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
              <Reveal key={key} className={`${wrap(i)} grid gap-[30px] ${b.columns === 2 ? "md:grid-cols-2" : b.columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
                {b.children.map((c, j) => (
                  <div key={j}><Blocks blocks={[c]} nested /></div>
                ))}
              </Reveal>
            );
          case "video":
            return (
              <div key={key} className={wrap(i)}>
                <video src={b.src} poster={b.poster ?? undefined} controls playsInline className="mx-auto w-full max-w-[1200px] rounded-lg" />
              </div>
            );
          case "wistia":
            return b.id ? (
              <div key={key} className={wrap(i)}>
                <Wistia id={b.id} />
              </div>
            ) : null;
          case "embed":
            return (
              <div key={key} className={wrap(i)}>
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
