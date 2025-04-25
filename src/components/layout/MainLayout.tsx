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
  Settings,
  Moon,
  Sun
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const navItems = [
    { name: "Home", path: "/dashboard", icon: <Home className="w-5 h-5" /> },
    { name: "Wardrobe", path: "/wardrobe", icon: <Search className="w-5 h-5" /> },
    { name: "Scan", path: "/body-scan", icon: <Camera className="w-5 h-5" /> },
    { name: "Outfits", path: "/outfits", icon: <Heart className="w-5 h-5" /> },
    { name: "Profile", path: "/profile", icon: <User className="w-5 h-5" /> },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground dark:bg-[#1A1F2C]">
      <header className="bg-white dark:bg-[#222222] shadow-sm px-4 py-3">
        <div className="flex justify-between items-center max-w-5xl mx-auto">
          <Link to="/dashboard" className="flex items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#3A8DFF] to-[#0057D8] bg-clip-text text-transparent">
              DressMeWell
            </h1>
          </Link>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="mr-2"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {currentUser && (
              <>
                <span className="text-sm hidden md:inline-block dark:text-gray-300">
                  Hey, {currentUser.name}!
                </span>
                <button 
                  onClick={logout}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5 dark:text-gray-300" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#222222] border-t md:hidden">
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

      <nav className="fixed top-16 left-4 bottom-4 hidden md:flex flex-col bg-white dark:bg-[#1A1F2C] rounded-lg shadow-lg p-3 w-14">
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
