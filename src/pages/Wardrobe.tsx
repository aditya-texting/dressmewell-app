import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { Camera, Upload, Search, Filter, X, Tag, Edit } from "lucide-react";
import PlusCircle from "@/components/ui/PlusCircle";

interface ClothingItem {
  id: string;
  name: string;
  type: string;
  color: string;
  style: string;
  material?: string;
  imageUrl: string;
  favorite: boolean;
}

const clothingTypes = [
  "T-shirt", "Shirt", "Blouse", "Sweater", "Jacket", 
  "Coat", "Jeans", "Pants", "Skirt", "Dress", 
  "Shorts", "Shoes", "Accessories"
];

const clothingStyles = [
  "Casual", "Formal", "Business", "Sporty", "Streetwear", 
  "Vintage", "Bohemian", "Preppy", "Minimalist"
];

const clothingColors = [
  "Black", "White", "Gray", "Red", "Blue", 
  "Green", "Yellow", "Purple", "Pink", "Brown", 
  "Orange", "Beige"
];

const mockClothingItems: ClothingItem[] = [
  {
    id: "1",
    name: "Blue Denim Jeans",
    type: "Jeans",
    color: "Blue",
    style: "Casual",
    material: "Denim",
    imageUrl: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=300&h=400&fit=crop",
    favorite: false
  },
  {
    id: "2",
    name: "White Cotton T-shirt",
    type: "T-shirt",
    color: "White",
    style: "Casual",
    material: "Cotton",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop",
    favorite: true
  },
  {
    id: "3",
    name: "Black Leather Jacket",
    type: "Jacket",
    color: "Black",
    style: "Streetwear",
    material: "Leather",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop",
    favorite: false
  }
];

const Wardrobe = () => {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>(mockClothingItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string | null>(null);
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [newItemImage, setNewItemImage] = useState<string | null>(null);
  
  const [newItem, setNewItem] = useState<Partial<ClothingItem>>({
    name: "",
    type: "",
    color: "",
    style: "",
    material: "",
    favorite: false
  });
  
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);

  const filteredItems = clothingItems.filter(item => {
    let matchesSearch = true;
    let matchesFilter = true;
    
    if (searchQuery) {
      matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.style.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    if (activeFilter && filterValue) {
      matchesFilter = item[activeFilter as keyof ClothingItem] === filterValue;
    }
    
    return matchesSearch && matchesFilter;
  });

  const handleAddItem = () => {
    if (!newItem.name || !newItem.type || !newItem.color || !newItem.style) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const imageUrl = newItemImage || "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=300&h=400&fit=crop";
    
    const newClothingItem: ClothingItem = {
      id: `item_${Date.now()}`,
      name: newItem.name || "",
      type: newItem.type || "",
      color: newItem.color || "",
      style: newItem.style || "",
      material: newItem.material,
      imageUrl,
      favorite: newItem.favorite || false
    };
    
    setClothingItems([...clothingItems, newClothingItem]);
    resetNewItem();
    setShowAddDialog(false);
    toast.success("Item added to your wardrobe");
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;
    
    const updatedItems = clothingItems.map(item => 
      item.id === editingItem.id ? editingItem : item
    );
    
    setClothingItems(updatedItems);
    setEditingItem(null);
    toast.success("Item updated successfully");
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = clothingItems.filter(item => item.id !== id);
    setClothingItems(updatedItems);
    toast.success("Item removed from your wardrobe");
  };

  const handleToggleFavorite = (id: string) => {
    const updatedItems = clothingItems.map(item => {
      if (item.id === id) {
        return { ...item, favorite: !item.favorite };
      }
      return item;
    });
    
    setClothingItems(updatedItems);
  };

  const resetNewItem = () => {
    setNewItem({
      name: "",
      type: "",
      color: "",
      style: "",
      material: "",
      favorite: false
    });
    setNewItemImage(null);
  };

  const handleFilter = (filterType: string, value: string) => {
    if (activeFilter === filterType && filterValue === value) {
      setActiveFilter(null);
      setFilterValue(null);
    } else {
      setActiveFilter(filterType);
      setFilterValue(value);
    }
  };

  const handleCaptureImage = () => {
    toast.info("Camera would be activated here");
    setTimeout(() => {
      setNewItemImage("https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=300&h=400&fit=crop");
      setShowImageDialog(false);
      
      toast.success("Item detected: Blue T-shirt");
      setNewItem(prev => ({
        ...prev,
        name: "Blue T-shirt",
        type: "T-shirt",
        color: "Blue",
        style: "Casual"
      }));
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Wardrobe</h1>
          <Button 
            onClick={() => setShowAddDialog(true)} 
            size="sm"
            className="bg-[#3A8DFF]"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Add Item
          </Button>
        </div>

        <div className="mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search your wardrobe..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={activeFilter === "type" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(activeFilter === "type" ? null : "type")}
              className="whitespace-nowrap"
            >
              <Filter className="w-4 h-4 mr-1" /> Type
            </Button>
            <Button
              variant={activeFilter === "color" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(activeFilter === "color" ? null : "color")}
              className="whitespace-nowrap"
            >
              <Filter className="w-4 h-4 mr-1" /> Color
            </Button>
            <Button
              variant={activeFilter === "style" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(activeFilter === "style" ? null : "style")}
              className="whitespace-nowrap"
            >
              <Filter className="w-4 h-4 mr-1" /> Style
            </Button>
            <Button
              variant={activeFilter === "favorite" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilter("favorite", "true")}
              className="whitespace-nowrap"
            >
              <Filter className="w-4 h-4 mr-1" /> Favorites
            </Button>
          </div>
          
          {activeFilter && activeFilter !== "favorite" && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {(activeFilter === "type" ? clothingTypes : 
                activeFilter === "color" ? clothingColors : 
                clothingStyles).map(value => (
                <Button
                  key={value}
                  variant={filterValue === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilter(activeFilter, value)}
                  className="whitespace-nowrap text-xs"
                >
                  {value}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredItems.map(item => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative aspect-square">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => handleToggleFavorite(item.id)} 
                      className="p-1 rounded-full bg-white/80 text-red-500"
                      aria-label={item.favorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill={item.favorite ? "currentColor" : "none"}
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setEditingItem(item)} 
                      className="p-1 rounded-full bg-white/80 text-blue-500"
                      aria-label="Edit item"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium truncate">{item.name}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{item.type}</span>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{item.color}</span>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{item.style}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            {clothingItems.length === 0 ? (
              <div>
                <p className="text-gray-500 mb-4">Your wardrobe is empty</p>
                <Button onClick={() => setShowAddDialog(true)}>
                  Add Your First Item
                </Button>
              </div>
            ) : (
              <p className="text-gray-500">
                No items match your search or filters
              </p>
            )}
          </div>
        )}
      </div>
      
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add to Your Wardrobe</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div 
              className="aspect-square rounded-lg bg-gray-100 flex flex-col items-center justify-center cursor-pointer"
              onClick={() => setShowImageDialog(true)}
            >
              {newItemImage ? (
                <div className="relative w-full h-full">
                  <img 
                    src={newItemImage} 
                    alt="New clothing item" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button 
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNewItemImage(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Upload or take a photo</p>
                </>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input 
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="e.g. Blue T-shirt"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Type</label>
                <select 
                  value={newItem.type}
                  onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select type</option>
                  {clothingTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Color</label>
                <select 
                  value={newItem.color}
                  onChange={(e) => setNewItem({...newItem, color: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select color</option>
                  {clothingColors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Style</label>
                <select 
                  value={newItem.style}
                  onChange={(e) => setNewItem({...newItem, style: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select style</option>
                  {clothingStyles.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Material (optional)</label>
              <Input 
                value={newItem.material || ''}
                onChange={(e) => setNewItem({...newItem, material: e.target.value})}
                placeholder="e.g. Cotton, Polyester"
              />
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="favorite"
                checked={newItem.favorite}
                onChange={(e) => setNewItem({...newItem, favorite: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="favorite" className="text-sm font-medium">Add to favorites</label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem}>
              Add to Wardrobe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        {editingItem && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img 
                  src={editingItem.imageUrl} 
                  alt={editingItem.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input 
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <select 
                    value={editingItem.type}
                    onChange={(e) => setEditingItem({...editingItem, type: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {clothingTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Color</label>
                  <select 
                    value={editingItem.color}
                    onChange={(e) => setEditingItem({...editingItem, color: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {clothingColors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Style</label>
                  <select 
                    value={editingItem.style}
                    onChange={(e) => setEditingItem({...editingItem, style: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {clothingStyles.map(style => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Material (optional)</label>
                <Input 
                  value={editingItem.material || ''}
                  onChange={(e) => setEditingItem({...editingItem, material: e.target.value})}
                />
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="editFavorite"
                  checked={editingItem.favorite}
                  onChange={(e) => setEditingItem({...editingItem, favorite: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="editFavorite" className="text-sm font-medium">Add to favorites</label>
              </div>
            </div>
            
            <DialogFooter className="flex justify-between">
              <Button 
                variant="destructive" 
                onClick={() => {
                  handleDeleteItem(editingItem.id);
                  setEditingItem(null);
                }}
              >
                Delete Item
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setEditingItem(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateItem}>
                  Save Changes
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add a Photo</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Camera preview would appear here</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => setShowImageDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCaptureImage}>
                <Camera className="w-4 h-4 mr-2" /> Capture
              </Button>
            </div>
            
            <div className="text-center">
              <Button variant="link" className="text-[#3A8DFF]">
                <Upload className="w-4 h-4 mr-2" /> Upload from gallery
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Wardrobe;
