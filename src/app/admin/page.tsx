
import Link from 'next/link';
import CronStatusMail from './CronStatusMail';
import CronStatusUser from './CronStatusUser';

export default async function Page(){
 
  return <>
     <h2 className="font-bold text-2xl mb-2">Welcome!</h2>
    <h3>This is Admin Page</h3>

    <CronStatusMail></CronStatusMail>
    <CronStatusUser></CronStatusUser>
    <Link  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-2" href='/admin/table/user'>View DataBase</Link>
   

    <Link  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-2" href='/admin/log'>View Logs</Link>
    
     <Link  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-2" href='/admin/userStat'>User Stat</Link>

    <Link  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-2" href='/admin/control'>Control</Link>

     <Link  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-2" href='/admin/dashboard'>DashBoard</Link>
  </>;

  
}
