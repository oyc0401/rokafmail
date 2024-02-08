// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { getServerSession } from "next-auth"
// import { authOptions } from 'src/app/api/auth/[...nextauth]/route'

// // This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   console.log('middleware')
//  // const session =  getServerSession(authOptions);  
//  // console.log(session)

  
//   return NextResponse.redirect(new URL('/', request.nextUrl.origin));
//   return NextResponse.redirect(new URL('/home', request.url))
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: '/profile/:path*',
// }

export { default } from "next-auth/middleware"

export const config = { matcher: ["/profile"] }