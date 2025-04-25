
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { Heart, ArrowLeft, Swap } from "lucide-react";
import PlusCircle from "@/components/ui/PlusCircle";

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  style: string;
  color: string;
  material: string;
  imageUrl: string;
}

interface OutfitItem {
  id: string;
  category: string;
  clothingItem: ClothingItem;
}

interface Outfit {
  id: string;
  name: string;
  items: OutfitItem[];
  occasion: string;
  temperature: number;
  timeOfDay: string;
  weather: string;
  isFavorite: boolean;
}

const OutfitDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [loading, setLoading] = useState(true);
  const [swapCategory, setSwapCategory] = useState<string | null>(null);
  const [showSwapDialog, setShowSwapDialog] = useState(false);
  const [alternativeItems, setAlternativeItems] = useState<ClothingItem[]>([]);
  const [selectedAlternative, setSelectedAlternative] = useState<string | null>(null);

  // Mock data - in a real app, this would be fetched from an API
  useEffect(() => {
    const fetchOutfit = async () => {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock outfit data
        const mockOutfit: Outfit = {
          id: id || "outfit_1",
          name: "Casual Blue Ensemble",
          occasion: "Casual",
          temperature: 22,
          timeOfDay: "Afternoon",
          weather: "Sunny",
          isFavorite: false,
          items: [
            {
              id: "outfit_item_1",
              category: "top",
              clothingItem: {
                id: "clothing_1",
                name: "Blue Cotton T-shirt",
                category: "top",
                style: "casual",
                color: "blue",
                material: "cotton",
                imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300",
              },
            },
            {
              id: "outfit_item_2",
              category: "bottom",
              clothingItem: {
                id: "clothing_2",
                name: "Slim Fit Jeans",
                category: "bottom",
                style: "casual",
                color: "blue",
                material: "denim",
                imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300",
              },
            },
            {
              id: "outfit_item_3",
              category: "shoes",
              clothingItem: {
                id: "clothing_3",
                name: "White Sneakers",
                category: "shoes",
                style: "casual",
                color: "white",
                material: "canvas",
                imageUrl: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=300",
              },
            },
            {
              id: "outfit_item_4",
              category: "accessory",
              clothingItem: {
                id: "clothing_4",
                name: "Silver Watch",
                category: "accessory",
                style: "casual",
                color: "silver",
                material: "metal",
                imageUrl: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=300",
              },
            },
          ],
        };

        setOutfit(mockOutfit);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching outfit:", error);
        toast.error("Failed to load outfit details");
        setLoading(false);
      }
    };

    fetchOutfit();
  }, [id]);

  const handleBack = () => {
    navigate("/outfits");
  };

  const toggleFavorite = () => {
    if (outfit) {
      const updatedOutfit = { ...outfit, isFavorite: !outfit.isFavorite };
      setOutfit(updatedOutfit);
      
      // In a real app, this would update the database
      const message = updatedOutfit.isFavorite
        ? "Outfit added to favorites"
        : "Outfit removed from favorites";
      
      toast.success(message);
    }
  };

  const openSwapDialog = (category: string) => {
    setSwapCategory(category);
    
    // Generate alternative items based on category
    // In a real app, these would be fetched from the user's wardrobe
    // based on the outfit's occasion, weather, etc.
    const getMockAlternatives = (category: string): ClothingItem[] => {
      switch (category) {
        case "top":
          return [
            {
              id: "alt_top_1",
              name: "White Button-up Shirt",
              category: "top",
              style: "smart-casual",
              color: "white",
              material: "cotton",
              imageUrl: "https://images.unsplash.com/photo-1598961942613-ba897716405b?w=300",
            },
            {
              id: "alt_top_2",
              name: "Navy Polo Shirt",
              category: "top",
              style: "casual",
              color: "navy",
              material: "cotton",
              imageUrl: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=300",
            },
          ];
        case "bottom":
          return [
            {
              id: "alt_bottom_1",
              name: "Khaki Chinos",
              category: "bottom",
              style: "smart-casual",
              color: "khaki",
              material: "cotton",
              imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300",
            },
            {
              id: "alt_bottom_2",
              name: "Black Jeans",
              category: "bottom",
              style: "casual",
              color: "black",
              material: "denim",
              imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=300",
            },
          ];
        case "shoes":
          return [
            {
              id: "alt_shoes_1",
              name: "Brown Leather Boots",
              category: "shoes",
              style: "casual",
              color: "brown",
              material: "leather",
              imageUrl: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=300",
            },
            {
              id: "alt_shoes_2",
              name: "Black Canvas Sneakers",
              category: "shoes",
              style: "casual",
              color: "black",
              material: "canvas",
              imageUrl: "https://images.unsplash.com/photo-1527010154944-f2241763d806?w=300",
            },
          ];
        case "accessory":
          return [
            {
              id: "alt_accessory_1",
              name: "Black Leather Belt",
              category: "accessory",
              style: "casual",
              color: "black",
              material: "leather",
              imageUrl: "https://images.unsplash.com/photo-1553704571-c32d20e6c81f?w=300",
            },
            {
              id: "alt_accessory_2",
              name: "Sunglasses",
              category: "accessory",
              style: "casual",
              color: "black",
              material: "plastic",
              imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300",
            },
          ];
        default:
          return [];
      }
    };

    setAlternativeItems(getMockAlternatives(category));
    setShowSwapDialog(true);
  };

  const handleSwapItem = () => {
    if (!outfit || !swapCategory || !selectedAlternative) {
      return;
    }

    // Find the selected alternative item
    const selectedItem = alternativeItems.find(
      (item) => item.id === selectedAlternative
    );

    if (!selectedItem) {
      return;
    }

    // Update the outfit with the new item
    const updatedItems = outfit.items.map((item) => {
      if (item.category === swapCategory) {
        return {
          ...item,
          clothingItem: selectedItem,
        };
      }
      return item;
    });

    setOutfit({
      ...outfit,
      items: updatedItems,
    });

    setShowSwapDialog(false);
    setSelectedAlternative(null);
    toast.success(`${swapCategory.charAt(0).toUpperCase() + swapCategory.slice(1)} swapped successfully`);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-xl mx-auto p-4 flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3A8DFF]"></div>
        </div>
      </MainLayout>
    );
  }

  if (!outfit) {
    return (
      <MainLayout>
        <div className="max-w-xl mx-auto p-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Outfit Not Found</h2>
            <p className="text-gray-600 mb-6">This outfit doesn't exist or has been removed.</p>
            <Button onClick={handleBack}>Return to Outfits</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto p-4">
        {/* Back button and header */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" className="p-1" onClick={handleBack}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">{outfit.name}</h1>
          <Button 
            variant="ghost"
            className="p-1"
            onClick={toggleFavorite}
          >
            <Heart
              className={`h-6 w-6 ${outfit.isFavorite ? "fill-red-500 text-red-500" : ""}`}
            />
          </Button>
        </div>

        {/* Outfit context */}
        <div className="bg-[#A3E4FF50] rounded-lg p-3 mb-4 flex items-center justify-between">
          <div>
            <span className="inline-block bg-[#0057D830] text-[#0057D8] rounded-full px-2 py-1 text-xs font-semibold mr-2">
              {outfit.occasion}
            </span>
            <span className="inline-block bg-[#0057D830] text-[#0057D8] rounded-full px-2 py-1 text-xs font-semibold mr-2">
              {outfit.temperature}°C
            </span>
            <span className="inline-block bg-[#0057D830] text-[#0057D8] rounded-full px-2 py-1 text-xs font-semibold">
              {outfit.weather}
            </span>
          </div>
          <div className="text-xs text-gray-600">{outfit.timeOfDay}</div>
        </div>

        {/* Style tip */}
        <div className="bg-[#F2F2F2] rounded-lg p-4 mb-6 border-l-4 border-[#3A8DFF]">
          <h3 className="font-medium mb-1">Style Tip</h3>
          <p className="text-sm text-gray-700">
            This outfit works well for your body shape. The fitted top highlights your
            proportions while the straight-leg jeans create a balanced silhouette.
          </p>
        </div>

        {/* Outfit items */}
        <div className="space-y-4">
          {outfit.items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="flex">
                <img
                  src={item.clothingItem.imageUrl}
                  alt={item.clothingItem.name}
                  className="w-24 h-24 object-cover"
                />
                <CardContent className="flex-1 p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </h3>
                      <p className="text-sm text-gray-600">{item.clothingItem.name}</p>
                      <div className="flex gap-1 mt-1">
                        <span className="inline-block bg-gray-100 rounded-full px-2 py-0.5 text-xs">
                          {item.clothingItem.color}
                        </span>
                        <span className="inline-block bg-gray-100 rounded-full px-2 py-0.5 text-xs">
                          {item.clothingItem.material}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-8 w-8"
                      onClick={() => openSwapDialog(item.category)}
                    >
                      <Swap className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}

          {/* Add accessory button */}
          <Button 
            variant="outline" 
            className="w-full py-6 flex items-center justify-center border-dashed"
            onClick={() => openSwapDialog("accessory")}
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Accessory
          </Button>
        </div>

        {/* Swap dialog */}
        <Dialog open={showSwapDialog} onOpenChange={setShowSwapDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                Swap {swapCategory?.charAt(0).toUpperCase() + swapCategory?.slice(1)}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-3">
              {alternativeItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center p-2 rounded-lg cursor-pointer
                    ${selectedAlternative === item.id ? "border border-[#3A8DFF] bg-[#A3E4FF20]" : "border border-gray-200"}
                  `}
                  onClick={() => setSelectedAlternative(item.id)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="ml-3">
                    <h4 className="font-medium">{item.name}</h4>
                    <div className="flex gap-1 mt-1">
                      <span className="inline-block bg-gray-100 rounded-full px-2 py-0.5 text-xs">
                        {item.color}
                      </span>
                      <span className="inline-block bg-gray-100 rounded-full px-2 py-0.5 text-xs">
                        {item.material}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSwapDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSwapItem} disabled={!selectedAlternative}>
                Swap Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default OutfitDetails;
