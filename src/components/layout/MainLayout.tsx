
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home, 
  Camera, 
  User,
  LogOut,
  Search,
  Heart,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/dashboard", icon: <Home className="w-5 h-5" /> },
    { name: "Wardrobe", path: "/wardrobe", icon: <Search className="w-5 h-5" /> },
    { name: "Scan", path: "/body-scan", icon: <Camera className="w-5 h-5" /> },
    { name: "Outfits", path: "/outfits", icon: <Heart className="w-5 h-5" /> },
    { name: "Profile", path: "/profile", icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F2F2F2]">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-3">
        <div className="flex justify-between items-center max-w-5xl mx-auto">
          <Link to="/dashboard" className="flex items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#3A8DFF] to-[#0057D8] bg-clip-text text-transparent">
              DressMeWell
            </h1>
          </Link>
          
          <div className="flex items-center gap-2">
            {currentUser && (
              <>
                <span className="text-sm hidden md:inline-block">
                  Hey, {currentUser.name}!
                </span>
                <button 
                  onClick={logout}
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center py-2 px-3",
                location.pathname === item.path
                  ? "text-[#3A8DFF]"
                  : "text-gray-600"
              )}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Desktop navigation - side menu */}
      <nav className="fixed top-16 left-4 bottom-4 hidden md:flex flex-col bg-white rounded-lg shadow-lg p-3 w-14">
        <div className="flex flex-col items-center space-y-8 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "p-2 rounded-full",
                location.pathname === item.path
                  ? "bg-[#A3E4FF] text-[#0057D8]"
                  : "text-gray-600 hover:bg-gray-100"
              )}
              title={item.name}
            >
              {item.icon}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MainLayout;
