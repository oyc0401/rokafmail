
import Link from 'next/link';
import CronStatus from './CronStatus';

export default async function Page(){
 
  return <>
     <h2 className="font-bold text-2xl mb-2">Welcome!</h2>
    <h3>This is Admin Page</h3>

    <CronStatus></CronStatus>

    <Link  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" href='/admin/table/user'>View DataBase</Link>

    <Link  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" href='/admin/log'>View Logs</Link>
  </>;
}
