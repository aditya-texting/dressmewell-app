
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { ArrowLeft, Heart, RefreshCw, Shirt, Scissors, Bookmark, Zap, Sun, Cloud, CloudRain } from "lucide-react";

interface OutfitItem {
  id: string;
  name: string;
  imageUrl: string;
  type: string;
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
  styleNotes?: string[];
  favorite: boolean;
}

// Mock outfit data
const mockOutfits: Record<string, Outfit> = {
  "outfit1": {
    id: "outfit1",
    occasion: "Casual",
    temp: 22,
    timeOfDay: "Morning",
    weather: "Sunny",
    items: {
      top: {
        id: "2",
        name: "White Cotton T-shirt",
        type: "top",
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop"
      },
      bottom: {
        id: "1",
        name: "Blue Denim Jeans",
        type: "bottom",
        imageUrl: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=300&h=400&fit=crop"
      },
      shoes: {
        id: "4",
        name: "White Sneakers",
        type: "shoes",
        imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300&h=400&fit=crop"
      }
    },
    explanation: "Light cotton top selected for warm weather. Jeans provide comfort for casual occasions.",
    styleNotes: [
      "The neutral white top pairs well with any bottom",
      "Classic denim works for most casual situations",
      "Comfortable sneakers for all-day wear"
    ],
    favorite: false
  },
  "outfit2": {
    id: "outfit2",
    occasion: "Work",
    temp: 18,
    timeOfDay: "Morning",
    weather: "Cloudy",
    items: {
      top: {
        id: "5",
        name: "Blue Button-Up Shirt",
        type: "top",
        imageUrl: "https://images.unsplash.com/photo-1598961942613-ba897716405b?w=300&h=400&fit=crop"
      },
      bottom: {
        id: "6",
        name: "Black Dress Pants",
        type: "bottom",
        imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=400&fit=crop"
      },
      shoes: {
        id: "7",
        name: "Black Dress Shoes",
        type: "shoes",
        imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=400&fit=crop"
      }
    },
    explanation: "Professional attire suitable for work. Layers for changing office temperatures.",
    styleNotes: [
      "Blue conveys trustworthiness in professional settings",
      "Classic black pants for versatility",
      "Polished shoes complete the professional look"
    ],
    favorite: true
  },
  "outfit3": {
    id: "outfit3",
    occasion: "Party",
    temp: 24,
    timeOfDay: "Evening",
    weather: "Clear",
    items: {
      top: {
        id: "8",
        name: "Black Jacket",
        type: "top",
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop"
      },
      bottom: {
        id: "9",
        name: "Dark Jeans",
        type: "bottom",
        imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop"
      },
      shoes: {
        id: "10",
        name: "Leather Boots",
        type: "shoes",
        imageUrl: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=300&h=400&fit=crop"
      },
      accessory: {
        id: "11",
        name: "Watch",
        type: "accessory",
        imageUrl: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=300&h=400&fit=crop"
      }
    },
    explanation: "Stylish outfit for evening events. The jacket keeps you warm as temperatures drop.",
    styleNotes: [
      "Black jacket creates a sleek silhouette",
      "Dark jeans transition well from day to night",
      "Statement boots elevate the casual base"
    ],
    favorite: false
  }
};

// Mock alternative items for swapping
const mockAlternatives: Record<string, OutfitItem[]> = {
  "top": [
    {
      id: "top1",
      name: "Striped Shirt",
      type: "top",
      imageUrl: "https://images.unsplash.com/photo-1608030609295-a581b8f46672?w=300&h=400&fit=crop"
    },
    {
      id: "top2",
      name: "Gray Sweater",
      type: "top",
      imageUrl: "https://images.unsplash.com/photo-1580331451432-511418247ba8?w=300&h=400&fit=crop"
    },
    {
      id: "top3",
      name: "Polo Shirt",
      type: "top",
      imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=300&h=400&fit=crop"
    }
  ],
  "bottom": [
    {
      id: "bottom1",
      name: "Khaki Pants",
      type: "bottom",
      imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=300&h=400&fit=crop"
    },
    {
      id: "bottom2",
      name: "Black Jeans",
      type: "bottom",
      imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=400&fit=crop"
    },
    {
      id: "bottom3",
      name: "Chinos",
      type: "bottom",
      imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=400&fit=crop"
    }
  ],
  "shoes": [
    {
      id: "shoes1",
      name: "Black Sneakers",
      type: "shoes",
      imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300&h=400&fit=crop"
    },
    {
      id: "shoes2",
      name: "Loafers",
      type: "shoes",
      imageUrl: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=300&h=400&fit=crop"
    },
    {
      id: "shoes3",
      name: "Canvas Shoes",
      type: "shoes",
      imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=300&h=400&fit=crop"
    }
  ],
  "accessory": [
    {
      id: "acc1",
      name: "Silver Necklace",
      type: "accessory",
      imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=400&fit=crop"
    },
    {
      id: "acc2",
      name: "Leather Belt",
      type: "accessory",
      imageUrl: "https://images.unsplash.com/photo-1594223274512-ad4b5ead7ecc?w=300&h=400&fit=crop"
    },
    {
      id: "acc3",
      name: "Beanie",
      type: "accessory",
      imageUrl: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=300&h=400&fit=crop"
    }
  ]
};

const OutfitDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [loading, setLoading] = useState(true);
  const [swapping, setSwapping] = useState<string | null>(null);
  const [itemType, setItemType] = useState<string | null>(null);
  const [alternativeItems, setAlternativeItems] = useState<OutfitItem[]>([]);

  useEffect(() => {
    // Fetch outfit details - using mock data for now
    if (id && mockOutfits[id]) {
      setTimeout(() => {
        setOutfit(mockOutfits[id]);
        setLoading(false);
      }, 1000);
    } else {
      navigate("/outfits");
      toast.error("Outfit not found");
    }
  }, [id, navigate]);

  const handleToggleFavorite = () => {
    if (!outfit) return;
    
    const updatedOutfit = { ...outfit, favorite: !outfit.favorite };
    setOutfit(updatedOutfit);
    
    // In a real app, we would update this in the backend
    toast.success(`Outfit ${updatedOutfit.favorite ? 'added to' : 'removed from'} favorites`);
  };

  const handleSwapItem = (type: string) => {
    setItemType(type);
    setSwapping("loading");
    
    // Fetch alternative items - using mock data for now
    setTimeout(() => {
      if (mockAlternatives[type]) {
        setAlternativeItems(mockAlternatives[type]);
        setSwapping("selecting");
      } else {
        setSwapping(null);
        toast.error("No alternatives found");
      }
    }, 1000);
  };

  const handleSelectAlternative = (item: OutfitItem) => {
    if (!outfit || !itemType) return;
    
    // Update outfit with new item
    const updatedOutfit = { 
      ...outfit, 
      items: { 
        ...outfit.items, 
        [itemType]: item 
      } 
    };
    
    setOutfit(updatedOutfit);
    setSwapping(null);
    toast.success(`${item.name} added to outfit`);
  };

  const renderWeatherIcon = (weather: string) => {
    switch (weather.toLowerCase()) {
      case "sunny":
        return <Sun className="w-5 h-5" />;
      case "cloudy":
        return <Cloud className="w-5 h-5" />;
      case "rainy":
        return <CloudRain className="w-5 h-5" />;
      default:
        return <Sun className="w-5 h-5" />;
    }
  };

  if (loading || !outfit) {
    return (
      <MainLayout>
        <div className="max-w-xl mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3A8DFF] mb-4"></div>
          <p className="text-gray-500">Loading outfit details...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto p-4">
        <div className="mb-6">
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Outfits
          </Button>
          <h1 className="text-2xl font-bold">{outfit.occasion} Outfit</h1>
        </div>

        {/* Outfit Info Card */}
        <Card className="mb-6 overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div>
                  {renderWeatherIcon(outfit.weather)}
                </div>
                <div>
                  <h2 className="font-medium">{outfit.weather}, {outfit.temp}°C</h2>
                  <p className="text-sm text-gray-500">{outfit.timeOfDay}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleFavorite}
                className={outfit.favorite ? "text-red-500" : "text-gray-400"}
              >
                <Heart className={`w-5 h-5 ${outfit.favorite ? "fill-red-500" : ""}`} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Full Outfit Preview */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="col-span-2 overflow-hidden">
            <div className="aspect-[3/4] relative">
              {/* This would be a full outfit image in a real app */}
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                <div className="relative">
                  <img
                    src={outfit.items.top.imageUrl}
                    alt={outfit.items.top.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-white/80 text-xs px-2 py-1 rounded">
                    Top
                  </div>
                </div>
                <div className="relative">
                  <img
                    src={outfit.items.bottom.imageUrl}
                    alt={outfit.items.bottom.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-white/80 text-xs px-2 py-1 rounded">
                    Bottom
                  </div>
                </div>
                <div className="relative">
                  <img
                    src={outfit.items.shoes.imageUrl}
                    alt={outfit.items.shoes.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-white/80 text-xs px-2 py-1 rounded">
                    Shoes
                  </div>
                </div>
                {outfit.items.accessory ? (
                  <div className="relative">
                    <img
                      src={outfit.items.accessory.imageUrl}
                      alt={outfit.items.accessory.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-white/80 text-xs px-2 py-1 rounded">
                      Accessory
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 flex items-center justify-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSwapItem('accessory')}
                    >
                      <PlusCircle className="w-4 h-4 mr-1" /> Add Accessory
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-gray-700">{outfit.explanation}</p>
            </CardContent>
          </Card>
        </div>

        {/* Outfit Details */}
        <h2 className="text-xl font-semibold mb-3">Outfit Breakdown</h2>
        <div className="space-y-3 mb-6">
          {/* Top */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded overflow-hidden mr-3">
                  <img
                    src={outfit.items.top.imageUrl}
                    alt={outfit.items.top.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Shirt className="w-4 h-4 text-gray-500" />
                    <h3 className="font-medium">Top</h3>
                  </div>
                  <p className="text-sm">{outfit.items.top.name}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSwapItem('top')}
                  className="whitespace-nowrap"
                >
                  <RefreshCw className="w-4 h-4 mr-1" /> Swap
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Bottom */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded overflow-hidden mr-3">
                  <img
                    src={outfit.items.bottom.imageUrl}
                    alt={outfit.items.bottom.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-gray-500" />
                    <h3 className="font-medium">Bottom</h3>
                  </div>
                  <p className="text-sm">{outfit.items.bottom.name}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSwapItem('bottom')}
                  className="whitespace-nowrap"
                >
                  <RefreshCw className="w-4 h-4 mr-1" /> Swap
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Shoes */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded overflow-hidden mr-3">
                  <img
                    src={outfit.items.shoes.imageUrl}
                    alt={outfit.items.shoes.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-500"
                    >
                      <path d="M2 6h18v4c0 3-2 4-2 4H4s-2-1-2-4V6z" />
                      <path d="M2 10s2 1 2 8v1" />
                      <path d="M22 10s-2 1-2 8v1" />
                      <path d="m2 6 10-4" />
                      <path d="m22 6-10-4" />
                    </svg>
                    <h3 className="font-medium">Shoes</h3>
                  </div>
                  <p className="text-sm">{outfit.items.shoes.name}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSwapItem('shoes')}
                  className="whitespace-nowrap"
                >
                  <RefreshCw className="w-4 h-4 mr-1" /> Swap
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Accessory if exists */}
          {outfit.items.accessory && (
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded overflow-hidden mr-3">
                    <img
                      src={outfit.items.accessory.imageUrl}
                      alt={outfit.items.accessory.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-500"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="6" />
                        <circle cx="12" cy="12" r="2" />
                      </svg>
                      <h3 className="font-medium">Accessory</h3>
                    </div>
                    <p className="text-sm">{outfit.items.accessory.name}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSwapItem('accessory')}
                    className="whitespace-nowrap"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" /> Swap
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Style Notes */}
        {outfit.styleNotes && outfit.styleNotes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <Zap className="w-5 h-5 mr-1 text-[#3A8DFF]" /> Style Notes
            </h2>
            <Card>
              <CardContent className="p-4">
                <ul className="space-y-2">
                  {outfit.styleNotes.map((note, index) => (
                    <li key={index} className="flex items-start">
                      <span className="h-2 w-2 mt-2 rounded-full bg-[#3A8DFF] mr-2 flex-shrink-0"></span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant={outfit.favorite ? "outline" : "default"}
            onClick={handleToggleFavorite}
            className="flex items-center justify-center"
          >
            {outfit.favorite ? (
              <>
                <Bookmark className="w-5 h-5 mr-1" /> Saved
              </>
            ) : (
              <>
                <Heart className="w-5 h-5 mr-1" /> Save Outfit
              </>
            )}
          </Button>
          <Button 
            onClick={() => navigate('/outfits')}
            className="flex items-center justify-center"
          >
            <RefreshCw className="w-5 h-5 mr-1" /> Try New Outfit
          </Button>
        </div>
      </div>

      {/* Item Swapping Dialog */}
      <Dialog open={!!swapping} onOpenChange={(open) => !open && setSwapping(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {swapping === "loading" 
                ? "Finding Alternatives..." 
                : `Choose Alternative ${itemType?.charAt(0).toUpperCase()}${itemType?.slice(1)}`
              }
            </DialogTitle>
          </DialogHeader>
          
          {swapping === "loading" ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3A8DFF]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 py-4">
              {alternativeItems.map((item) => (
                <Card 
                  key={item.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleSelectAlternative(item)}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-2">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default OutfitDetails;
