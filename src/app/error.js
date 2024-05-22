'use client' // Error components must be Client Components

import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("에러: ", error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>oyc0401@gmail.com으로 메일 남겨주세요.</p>
      <p>{error}</p>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}