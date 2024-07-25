import Link from "next/link";

export function BasicButton({ children, className }: { children?; className?}) {
  return (
    <button className={`rounded-xl bg-primary w-full cursor-pointer active:opacity-75 ${className}`}>
      {children}
    </button>
  )
}

export function BasicLink({ children, className, href }: { children?; className?, href }) {
  return (
    <Link href={href}
      className={`rounded-xl px-8 py-3.5 w-full cursor-pointer active:opacity-75 ${className}`}>
      {children}
    </Link>
  )
}