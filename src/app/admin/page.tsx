
import { auth } from "src/app/api/auth/auth";
import { User } from "src/db";

import { notFound } from "next/navigation";
import Link from 'next/link';
import CronStatus from './CronStatus';
import CronStatusAPI from './CronStatusAPI';

export default async function Page(){
 

  return <>
     <h2 className="font-bold text-2xl mb-2">Welcome!</h2>
    <h3>This is Admin Page</h3>

    <CronStatus></CronStatus>
    <CronStatusAPI></CronStatusAPI>

    <Link  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" href='/admin/table/user'>View DataBase</Link>
  </>;
}
