import clsx from "clsx";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function Root() {
  const { pathname } = useLocation();

  return (
    <>
      <div className="flex p-5 shadow-md justify-between">
        <a href="/" className="text-2xl font-bold">Emergency Queue 🏥</a>

        <div className="flex gap-10 mt-1">
          {['/', '/triage'].map(link => (
            <Link
              to={link}
              key={link}
              className={clsx({
                'hover:underline': true,
                'text-red-500 underline': pathname === link,
              })}
            >
              {link === '/' ? 'Live Queue 🚨' : 'Manage Triage ⚙️'}
            </Link>
          ))}
        </div>
      </div>
      <Outlet />
    </>
  );
}
