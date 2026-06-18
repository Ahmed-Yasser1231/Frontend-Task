import { Outlet, useLocation } from 'react-router-dom';
import { useLayoutEffect, useRef } from 'react';
import Sidelist from './Sidelist/Sidelist';
import Topbar from './Topbar';

export default function Layout() {
  const location = useLocation();
  const mainRef = useRef(null);

  useLayoutEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
      mainRef.current.scrollLeft = 0;
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background overflow-hidden">
      <Sidelist />
      <main ref={mainRef} className="min-h-screen w-full overflow-y-auto overflow-x-hidden flex-1 bg-background px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <Topbar />
        <Outlet />
      </main>
    </div>
  );
}