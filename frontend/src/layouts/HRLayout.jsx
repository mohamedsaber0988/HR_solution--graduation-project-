import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';

const HRLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [userProfilePicture, setUserProfilePicture] = useState(
    'https://ui-avatars.com/api/?name=HR+User&background=0D8ABC&color=fff'
  );

  return (
    <div className="min-h-screen flex font-sans">

      {}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">

        {}
        <TopHeader
          setMobileOpen={setMobileOpen}
          userProfilePicture={userProfilePicture}
        />

        {}
        <main className="pro-content scrollbar-thin flex-1 overflow-y-auto p-6 lg:p-8 w-full">
          <PageTransition>
            <Outlet context={{ userProfilePicture, setUserProfilePicture }} />
          </PageTransition>
        </main>

      </div>
    </div>
  );
};

export default HRLayout;