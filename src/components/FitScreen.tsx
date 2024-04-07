'use client'
import { useEffect, useState } from "react";

export function FitScreen({ children }) {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const innerHeight = window.innerHeight;
    setHeight(innerHeight);
  }, []);

  return <div className='w-full h-screen' style={height == 0 ? {} : { height: height }}>
    {children}
  </div>
}