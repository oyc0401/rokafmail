'use client' // Error components must be Client Components

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("에러: ", error)
  }, [])

  return (
    <div className='errorcss'>
      <div className='errorin'>
        <h2 className='font-bold text-xl py-4'>해당 페이지에 오류가 발생했습니다</h2>
        <p>oyc0401@gmail.com으로 연락해주시면 <br /> 바로 해결해드리겠습니다.</p>
        <p className='text-xs text-[#AAAAAA] pt-1'>{`${error}`}</p>
      </div>
    </div>
  )
}