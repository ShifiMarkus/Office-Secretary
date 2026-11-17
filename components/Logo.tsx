/* eslint-disable @next/next/no-img-element */
export function Logo({ className = "h-7" }: { className?: string }) {
  return (
    <>
      <img src="/logo.svg" alt="TRUSTech" className={`${className} w-auto dark:hidden`} />
      <img src="/logo-dark.svg" alt="TRUSTech" className={`${className} w-auto hidden dark:block`} />
    </>
  );
}
