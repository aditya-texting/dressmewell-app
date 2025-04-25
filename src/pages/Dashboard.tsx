
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { Camera, Image, Heart, Sun, Cloud, CloudRain } from "lucide-react";

interface WeatherData {
  temp: number;
  condition: string;
}

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  
  // Mock getting the weather
  useEffect(() => {
    // In a real app, we would fetch from OpenWeather API
    const mockWeather = {
      temp: 22,
      condition: "sunny"
    };
    
    setTimeout(() => {
      setWeather(mockWeather);
    }, 1000);
  }, []);
  
  const renderWeatherIcon = () => {
    if (!weather) return null;
    
    switch (weather.condition) {
      case "sunny":
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case "cloudy":
        return <Cloud className="w-8 h-8 text-gray-400" />;
      case "rainy":
        return <CloudRain className="w-8 h-8 text-blue-400" />;
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  // Check if user has completed body scan
  const hasBodyScan = !!currentUser?.bodyShape;
  
  // Mock wardrobe count
  const wardrobeCount = 0; // In a real app, we would fetch this from the database

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
        {/* Greeting */}
        <h1 className="text-2xl font-bold">
          Hey {currentUser?.name}! Let's dress you well today.
        </h1>

        {/* Weather Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              {weather ? (
                <>
                  {renderWeatherIcon()}
                  <div className="ml-4">
                    <p className="font-medium">Today's Weather</p>
                    <p className="text-sm text-gray-500">
                      {weather.temp}°C, {weather.condition.charAt(0).toUpperCase() + weather.condition.slice(1)}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          {/* Body Scan */}
          <Link to="/body-scan">
            <Card className="h-full transition-transform hover:scale-[1.02]">
              <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                <Camera className="w-8 h-8 mb-2 text-[#3A8DFF]" />
                <h3 className="font-medium text-center">
                  {hasBodyScan ? "Update Body Scan" : "Complete Body Scan"}
                </h3>
                <p className="text-xs text-gray-500 text-center mt-1">
                  {hasBodyScan ? "Refine your recommendations" : "Get personalized style recommendations"}
                </p>
              </CardContent>
            </Card>
          </Link>
          
          {/* Wardrobe */}
          <Link to="/wardrobe">
            <Card className="h-full transition-transform hover:scale-[1.02]">
              <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                <Image className="w-8 h-8 mb-2 text-[#3A8DFF]" />
                <h3 className="font-medium text-center">
                  {wardrobeCount > 0 ? "View Your Wardrobe" : "Add to Wardrobe"}
                </h3>
                <p className="text-xs text-gray-500 text-center mt-1">
                  {wardrobeCount} items in your collection
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Get Outfit Suggestions */}
        <Link to="/outfits">
          <Button className="w-full py-6 bg-gradient-to-r from-[#3A8DFF] to-[#0057D8] flex items-center justify-center gap-3">
            <Heart className="w-5 h-5" />
            <span>Get Outfit Suggestions</span>
          </Button>
        </Link>
        
        {/* Check if user needs to complete profile */}
        {(!hasBodyScan || wardrobeCount === 0) && (
          <div className="bg-[#A3E4FF] rounded-lg p-4 text-sm">
            <p className="font-medium">Complete your profile for better recommendations</p>
            <ul className="mt-2 space-y-1">
              {!hasBodyScan && (
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#0057D8]"></span>
                  <span>Complete your body shape analysis</span>
                </li>
              )}
              {wardrobeCount === 0 && (
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#0057D8]"></span>
                  <span>Add items to your wardrobe</span>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
