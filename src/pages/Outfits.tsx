
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { Heart, RefreshCw, Filter, Sun, Cloud, CloudRain, Clock, Zap } from "lucide-react";

interface OutfitItem {
  id: string;
  name: string;
  imageUrl: string;
}

interface Outfit {
  id: string;
  occasion: string;
  temp: number;
  timeOfDay: string;
  weather: string;
  items: {
    top: OutfitItem;
    bottom: OutfitItem;
    shoes: OutfitItem;
    accessory?: OutfitItem;
  };
  explanation: string;
  favorite: boolean;
}

const occasions = ["Casual", "Work", "Party", "Sports"];
const weatherConditions = ["Sunny", "Cloudy", "Rainy", "Cold"];
const timeOfDay = ["Morning", "Afternoon", "Evening"];

// Mock outfits data
const mockOutfits: Outfit[] = [
  {
    id: "outfit1",
    occasion: "Casual",
    temp: 22,
    timeOfDay: "Morning",
    weather: "Sunny",
    items: {
      top: {
        id: "2",
        name: "White Cotton T-shirt",
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop"
      },
      bottom: {
        id: "1",
        name: "Blue Denim Jeans",
        imageUrl: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=300&h=400&fit=crop"
      },
      shoes: {
        id: "4",
        name: "White Sneakers",
        imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300&h=400&fit=crop"
      }
    },
    explanation: "Light cotton top selected for warm weather. Jeans provide comfort for casual occasions.",
    favorite: false
  },
  {
    id: "outfit2",
    occasion: "Work",
    temp: 18,
    timeOfDay: "Morning",
    weather: "Cloudy",
    items: {
      top: {
        id: "5",
        name: "Blue Button-Up Shirt",
        imageUrl: "https://images.unsplash.com/photo-1598961942613-ba897716405b?w=300&h=400&fit=crop"
      },
      bottom: {
        id: "6",
        name: "Black Dress Pants",
        imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=400&fit=crop"
      },
      shoes: {
        id: "7",
        name: "Black Dress Shoes",
        imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=400&fit=crop"
      }
    },
    explanation: "Professional attire suitable for work. Layers for changing office temperatures.",
    favorite: true
  },
  {
    id: "outfit3",
    occasion: "Party",
    temp: 24,
    timeOfDay: "Evening",
    weather: "Clear",
    items: {
      top: {
        id: "8",
        name: "Black Jacket",
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop"
      },
      bottom: {
        id: "9",
        name: "Dark Jeans",
        imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop"
      },
      shoes: {
        id: "10",
        name: "Leather Boots",
        imageUrl: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=300&h=400&fit=crop"
      },
      accessory: {
        id: "11",
        name: "Watch",
        imageUrl: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=300&h=400&fit=crop"
      }
    },
    explanation: "Stylish outfit for evening events. The jacket keeps you warm as temperatures drop.",
    favorite: false
  }
];

const Outfits = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [outfits, setOutfits] = useState<Outfit[]>(mockOutfits);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    occasion: "",
    weather: "",
    timeOfDay: ""
  });
  
  const [bodyShape] = useState<string | undefined>(currentUser?.bodyShape);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    // Simulate loading outfits
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const filteredOutfits = outfits.filter(outfit => {
    let matchesOccasion = true;
    let matchesWeather = true;
    let matchesTime = true;
    
    if (filters.occasion) {
      matchesOccasion = outfit.occasion === filters.occasion;
    }
    
    if (filters.weather) {
      matchesWeather = outfit.weather === filters.weather;
    }
    
    if (filters.timeOfDay) {
      matchesTime = outfit.timeOfDay === filters.timeOfDay;
    }
    
    return matchesOccasion && matchesWeather && matchesTime;
  });

  const handleToggleFavorite = (id: string) => {
    const updatedOutfits = outfits.map(outfit => {
      if (outfit.id === id) {
        return { ...outfit, favorite: !outfit.favorite };
      }
      return outfit;
    });
    
    setOutfits(updatedOutfits);
    
    const outfit = updatedOutfits.find(o => o.id === id);
    if (outfit) {
      toast.success(`Outfit ${outfit.favorite ? 'added to' : 'removed from'} favorites`);
    }
  };

  const handleGenerateNewOutfits = () => {
    setGenerating(true);
    
    // Simulate generating new outfits
    setTimeout(() => {
      toast.success("New outfit suggestions generated!");
      setGenerating(false);
    }, 2000);
  };

  const handleApplyFilters = () => {
    setShowFilters(false);
    toast.success("Filters applied");
  };

  const handleClearFilters = () => {
    setFilters({
      occasion: "",
      weather: "",
      timeOfDay: ""
    });
    toast.success("Filters cleared");
  };

  const renderWeatherIcon = (weather: string) => {
    switch (weather.toLowerCase()) {
      case "sunny":
        return <Sun className="w-4 h-4" />;
      case "cloudy":
        return <Cloud className="w-4 h-4" />;
      case "rainy":
        return <CloudRain className="w-4 h-4" />;
      default:
        return <Sun className="w-4 h-4" />;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Outfit Suggestions</h1>
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(true)}
            >
              <Filter className="w-4 h-4 mr-1" /> Filter
            </Button>
            <Button
              size="sm"
              onClick={handleGenerateNewOutfits}
              disabled={generating}
              className="bg-[#3A8DFF]"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${generating ? 'animate-spin' : ''}`} /> 
              {generating ? 'Generating...' : 'New Ideas'}
            </Button>
          </div>
        </div>
        
        {!currentUser?.bodyShape && (
          <div className="mb-6 bg-[#A3E4FF] p-4 rounded-lg">
            <p className="text-sm">
              Complete your <strong>body shape analysis</strong> to get more personalized outfit suggestions.
            </p>
            <Button 
              variant="link" 
              className="text-[#0057D8] p-0 mt-1"
              onClick={() => navigate("/body-scan")}
            >
              Scan now →
            </Button>
          </div>
        )}
        
        {loading ? (
          <div className="py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3A8DFF] mx-auto mb-4"></div>
            <p className="text-center text-gray-500">Generating outfit suggestions for you...</p>
          </div>
        ) : filteredOutfits.length > 0 ? (
          <div className="space-y-6">
            {filteredOutfits.map(outfit => (
              <Card
                key={outfit.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
                onClick={() => navigate(`/outfit/${outfit.id}`)}
              >
                <CardContent className="p-0">
                  <div className="p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{outfit.occasion}</span>
                      <span className="text-sm text-gray-500">|</span>
                      <span className="flex items-center text-sm text-gray-500 gap-1">
                        {renderWeatherIcon(outfit.weather)}
                        {outfit.temp}°C
                      </span>
                      <span className="text-sm text-gray-500">|</span>
                      <span className="flex items-center text-sm text-gray-500 gap-1">
                        <Clock className="w-4 h-4" />
                        {outfit.timeOfDay}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(outfit.id);
                      }}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Heart className={`w-5 h-5 ${outfit.favorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-0.5">
                    <div className="aspect-square">
                      <img
                        src={outfit.items.top.imageUrl}
                        alt={outfit.items.top.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="aspect-square">
                      <img
                        src={outfit.items.bottom.imageUrl}
                        alt={outfit.items.bottom.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="aspect-square">
                      <img
                        src={outfit.items.shoes.imageUrl}
                        alt={outfit.items.shoes.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <p className="text-sm text-gray-700">{outfit.explanation}</p>
                    
                    {bodyShape && (
                      <div className="mt-2 flex items-center text-sm text-[#3A8DFF]">
                        <Zap className="w-4 h-4 mr-1" /> 
                        Best fit for your {bodyShape} body shape
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              No outfits match your current filters
            </p>
            <Button onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
      
      {/* Filter Dialog */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filter Outfits</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Occasion</label>
              <div className="grid grid-cols-2 gap-2">
                {occasions.map(occasion => (
                  <Button
                    key={occasion}
                    variant={filters.occasion === occasion ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilters(prev => ({...prev, occasion: prev.occasion === occasion ? "" : occasion}))}
                    className="justify-start"
                  >
                    {occasion}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Weather</label>
              <div className="grid grid-cols-2 gap-2">
                {weatherConditions.map(weather => (
                  <Button
                    key={weather}
                    variant={filters.weather === weather ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilters(prev => ({...prev, weather: prev.weather === weather ? "" : weather}))}
                    className="justify-start"
                  >
                    <span className="mr-1">
                      {renderWeatherIcon(weather)}
                    </span>
                    {weather}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Time of Day</label>
              <div className="grid grid-cols-3 gap-2">
                {timeOfDay.map(time => (
                  <Button
                    key={time}
                    variant={filters.timeOfDay === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilters(prev => ({...prev, timeOfDay: prev.timeOfDay === time ? "" : time}))}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleClearFilters}>
              Clear All
            </Button>
            <Button onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Outfits;
