import Link from "next/link";

/** Landing pages: minimal chrome (logo + schedule-a-call), no main nav. */
export default function LpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mx-auto flex max-w-[1340px] items-center justify-between px-4 py-5">
        <Link href="/" aria-label="SPARK home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/643dad15c0e36a9b01b8da86_spark_logo_dark.svg" alt="Spark logo" className="h-7 w-auto" />
        </Link>
        <Link href="/lp/schedule-a-call" className="btn-outline btn text-blue">Schedule a call</Link>
      </div>
      <main>{children}</main>
      <footer className="bg-blue">
        <div className="mx-auto flex max-w-[1340px] items-center justify-between px-4 py-8 text-white">
          <Link href="/" aria-label="SPARK home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/64735a014eeb1ff94a520100_spark_footer_logo.svg" alt="Spark logo" className="h-5 w-auto" />
          </Link>
          <Link href="/" className="text-sm underline">thespark.ai</Link>
        </div>
      </footer>
    </>
  );
}
