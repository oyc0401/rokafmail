import Link from "next/link";

export function SubmitButton({children, onclick}){
  return <button className="bg-primary w-full text-white text-lg sm:text-xl font-medium py-3 sm:py-4 px-8 rounded-full cursor-pointer active:bg-lightaccent shadow">{children}</button>
}