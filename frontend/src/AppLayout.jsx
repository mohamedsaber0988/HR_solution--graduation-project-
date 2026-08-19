import { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import { Outlet } from 'react-router-dom';
import PageTransition from './components/PageTransition';

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userProfilePicture, setUserProfilePicture] = useState(
    'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff'
  );

  return (
    <div className="min-h-screen flex font-sans">
      
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <TopHeader setMobileOpen={setMobileOpen} userProfilePicture={userProfilePicture} />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto w-full">
          <PageTransition>
            <Outlet context={{ userProfilePicture, setUserProfilePicture }} />
          </PageTransition>
        </main>
      </div>

    </div>
  );
}

export default App;