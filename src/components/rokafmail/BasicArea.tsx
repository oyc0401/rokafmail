import { NavHeaderHome } from "./NavHeaderHome";

export function BasicFormArea({ children }) {
  return (
    <div className="max-w-3xl mx-auto h-full">
      <form className="w-full h-full flex flex-col">
        <NavHeaderHome></NavHeaderHome>
        {children}
      </form>
    </div>
  );
}

export function BasicHeader({ children }) {
  return (
    <div className="flex flex-col-reverse  px-4" style={{ flex: 8 }}>
      <div className="pt-20 pb-14 w-full">
        <h2 className='font-medium text-[22px]'>{children}</h2>
      </div>
    </div>
  );
}

export function BasicBody({ children, paddingBottom = true }) {
  return (
    <div className="w-full  px-4" style={{ flex: 18 }}>
      <div className={`${paddingBottom ? "pb-12" : null} w-full h-full`}>
        {children}
      </div>
    </div>
  );
}

export function BasicFooter({ children }) {
  return (
    <div className="pb-8 pt-6 w-full  px-4">
      <div className="row">{children}</div>
    </div>
  );
}
