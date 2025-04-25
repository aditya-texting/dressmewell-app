
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { User, Camera, Heart, Settings, LogOut, Edit } from "lucide-react";

const bodyShapes = [
  { id: "hourglass", name: "Hourglass" },
  { id: "pear", name: "Pear" },
  { id: "apple", name: "Apple" },
  { id: "rectangle", name: "Rectangle" },
  { id: "inverted-triangle", name: "Inverted Triangle" }
];

const stylePreferenceOptions = {
  favoriteColors: ["Black", "White", "Blue", "Red", "Green", "Yellow", "Pink", "Purple", "Brown", "Gray"],
  preferredStyles: ["Casual", "Formal", "Business", "Sporty", "Streetwear", "Vintage", "Bohemian", "Preppy", "Minimalist"],
  avoidTypes: ["T-shirts", "Jeans", "Skirts", "Dresses", "Shorts", "Sweaters", "Jackets", "Hoodies", "Formal wear"]
};

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, updateUserProfile, logout } = useAuth();
  
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPreferences, setEditingPreferences] = useState(false);
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || ""
  });
  
  const [preferenceForm, setPreferenceForm] = useState({
    favoriteColors: currentUser?.stylePreferences?.favoriteColors || [],
    preferredStyles: currentUser?.stylePreferences?.preferredStyles || [],
    avoidTypes: currentUser?.stylePreferences?.avoidTypes || []
  });
  
  const handleUpdateProfile = async () => {
    try {
      await updateUserProfile({
        name: profileForm.name
      });
      
      setEditingProfile(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleUpdatePreferences = async () => {
    try {
      await updateUserProfile({
        stylePreferences: preferenceForm
      });
      
      setEditingPreferences(false);
      toast.success("Style preferences updated successfully");
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  const togglePreference = (type: keyof typeof preferenceForm, item: string) => {
    setPreferenceForm(prev => {
      const current = prev[type];
      
      if (current.includes(item)) {
        return { ...prev, [type]: current.filter(i => i !== item) };
      } else {
        return { ...prev, [type]: [...current, item] };
      }
    });
  };
  
  if (!currentUser) {
    return null; // Should be caught by ProtectedRoute
  }

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Personal Information</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setEditingProfile(true)}>
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-[#A3E4FF] flex items-center justify-center mr-4">
                  <User className="text-[#0057D8]" />
                </div>
                <div>
                  <h3 className="font-medium">{currentUser.name}</h3>
                  <p className="text-sm text-gray-500">{currentUser.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Body Shape Card */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Body Shape</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/body-scan")}>
                {currentUser.bodyShape ? (
                  <>
                    <Edit className="w-4 h-4 mr-1" /> Update
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-1" /> Complete
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {currentUser.bodyShape ? (
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-[#A3E4FF] flex items-center justify-center mr-4">
                  <span className="text-[#0057D8] font-medium">
                    {bodyShapes.find(shape => shape.id === currentUser.bodyShape)?.name.charAt(0) || "?"}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium">
                    {bodyShapes.find(shape => shape.id === currentUser.bodyShape)?.name || "Unknown"}
                  </h3>
                  <p className="text-sm text-gray-500">Last updated: Recently</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-3">You haven't completed your body shape analysis yet</p>
                <Button onClick={() => navigate("/body-scan")}>
                  <Camera className="w-4 h-4 mr-1" /> Complete Body Scan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Style Preferences Card */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Style Preferences</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setEditingPreferences(true)}>
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Favorite Colors */}
              <div>
                <h3 className="font-medium mb-2">Favorite Colors</h3>
                {currentUser.stylePreferences?.favoriteColors && 
                 currentUser.stylePreferences.favoriteColors.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentUser.stylePreferences.favoriteColors.map(color => (
                      <span key={color} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {color}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No favorite colors selected</p>
                )}
              </div>
              
              {/* Preferred Styles */}
              <div>
                <h3 className="font-medium mb-2">Preferred Styles</h3>
                {currentUser.stylePreferences?.preferredStyles && 
                 currentUser.stylePreferences.preferredStyles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentUser.stylePreferences.preferredStyles.map(style => (
                      <span key={style} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {style}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No preferred styles selected</p>
                )}
              </div>
              
              {/* Avoid Types */}
              <div>
                <h3 className="font-medium mb-2">Items to Avoid</h3>
                {currentUser.stylePreferences?.avoidTypes && 
                 currentUser.stylePreferences.avoidTypes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentUser.stylePreferences.avoidTypes.map(type => (
                      <span key={type} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {type}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No items selected to avoid</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Action Buttons */}
        <div className="grid gap-3">
          <Button 
            variant="outline" 
            className="flex items-center justify-center"
            onClick={() => navigate("/outfits")}
          >
            <Heart className="w-5 h-5 mr-2" /> View Saved Outfits
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-center"
          >
            <Settings className="w-5 h-5 mr-2" /> App Settings
          </Button>
          <Button 
            variant="destructive"
            className="flex items-center justify-center mt-2"
            onClick={() => setConfirmingLogout(true)}
          >
            <LogOut className="w-5 h-5 mr-2" /> Sign Out
          </Button>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editingProfile} onOpenChange={setEditingProfile}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Name</label>
              <Input 
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <Input 
                value={profileForm.email}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProfile(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Preferences Dialog */}
      <Dialog open={editingPreferences} onOpenChange={setEditingPreferences}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Style Preferences</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            {/* Favorite Colors */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Favorite Colors</label>
              <div className="grid grid-cols-3 gap-2">
                {stylePreferenceOptions.favoriteColors.map(color => (
                  <div 
                    key={color}
                    className={`
                      px-3 py-2 border rounded-md cursor-pointer text-center text-sm
                      ${preferenceForm.favoriteColors.includes(color) 
                        ? 'bg-[#A3E4FF] border-[#3A8DFF]' 
                        : 'border-gray-200 hover:bg-gray-50'}
                    `}
                    onClick={() => togglePreference('favoriteColors', color)}
                  >
                    {color}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Preferred Styles */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Preferred Styles</label>
              <div className="grid grid-cols-2 gap-2">
                {stylePreferenceOptions.preferredStyles.map(style => (
                  <div 
                    key={style}
                    className={`
                      px-3 py-2 border rounded-md cursor-pointer text-center text-sm
                      ${preferenceForm.preferredStyles.includes(style) 
                        ? 'bg-[#A3E4FF] border-[#3A8DFF]' 
                        : 'border-gray-200 hover:bg-gray-50'}
                    `}
                    onClick={() => togglePreference('preferredStyles', style)}
                  >
                    {style}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Items to Avoid */}
            <div className="mb-2">
              <label className="text-sm font-medium mb-2 block">Items to Avoid</label>
              <div className="grid grid-cols-2 gap-2">
                {stylePreferenceOptions.avoidTypes.map(type => (
                  <div 
                    key={type}
                    className={`
                      px-3 py-2 border rounded-md cursor-pointer text-center text-sm
                      ${preferenceForm.avoidTypes.includes(type) 
                        ? 'bg-[#A3E4FF] border-[#3A8DFF]' 
                        : 'border-gray-200 hover:bg-gray-50'}
                    `}
                    onClick={() => togglePreference('avoidTypes', type)}
                  >
                    {type}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPreferences(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePreferences}>
              Save Preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirm Logout Dialog */}
      <Dialog open={confirmingLogout} onOpenChange={setConfirmingLogout}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sign Out Confirmation</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>Are you sure you want to sign out of your account?</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmingLogout(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Profile;
