// app/dashboard/layout.tsx

import DashboardSidebar from "../components/SideBar";
import {Toaster} from 'react-hot-toast'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-6 bg-[#F8FAFB]">
        {children}
        <Toaster position="top-right" reverseOrder={false}/>
      </main>
    </div>
  );
};

export default DashboardLayout;