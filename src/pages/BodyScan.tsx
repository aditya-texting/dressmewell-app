
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { Camera, Image } from "lucide-react";

type BodyShape = "hourglass" | "pear" | "apple" | "rectangle" | "inverted-triangle";

interface ScanStep {
  id: string;
  title: string;
  description: string;
}

const BodyScan = () => {
  const navigate = useNavigate();
  const { currentUser, updateUserProfile } = useAuth();
  const [scanStep, setScanStep] = useState<number>(0);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [selectedBodyShape, setSelectedBodyShape] = useState<BodyShape | null>(null);
  const [processingImage, setProcessingImage] = useState<boolean>(false);

  const scanSteps: ScanStep[] = [
    {
      id: "intro",
      title: "Ready For Your Body Scan?",
      description: "We'll analyze your body shape to give you outfit recommendations that flatter your unique figure."
    },
    {
      id: "instructions",
      title: "Let's Get Ready",
      description: "For best results, wear fitted clothing and stand against a plain background with your full body visible."
    },
    {
      id: "scanning",
      title: "Capturing Your Shape",
      description: "We'll use your camera to capture your proportions. Your privacy is important - images are processed locally and never stored."
    }
  ];
  
  const bodyShapes: {
    id: BodyShape;
    name: string;
    description: string;
    imageUrl: string;
  }[] = [
    {
      id: "hourglass",
      name: "Hourglass",
      description: "Shoulders and hips are similar width with a defined waist",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=300&fit=crop"
    },
    {
      id: "pear",
      name: "Pear",
      description: "Hips wider than shoulders, with a defined waist",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=300&fit=crop"
    },
    {
      id: "apple",
      name: "Apple",
      description: "Fuller midsection, with slimmer legs and arms",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=300&fit=crop"
    },
    {
      id: "rectangle",
      name: "Rectangle",
      description: "Shoulders, waist and hips similar in width",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=300&fit=crop"
    },
    {
      id: "inverted-triangle",
      name: "Inverted Triangle",
      description: "Shoulders wider than hips",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=300&fit=crop"
    }
  ];

  const handleNextStep = () => {
    if (scanStep < scanSteps.length - 1) {
      setScanStep(scanStep + 1);
    } else {
      // Start camera
      setShowCamera(true);
    }
  };

  const handleCaptureImage = () => {
    // In a real app, we would use MediaPipe Pose to analyze the body
    // For now, we'll simulate processing and show results
    setProcessingImage(true);
    
    setTimeout(() => {
      // Mock result - in real app would be from MediaPipe analysis
      const detectedShape = bodyShapes[Math.floor(Math.random() * bodyShapes.length)].id;
      setSelectedBodyShape(detectedShape);
      setProcessingImage(false);
      setShowCamera(false);
      setShowResults(true);
    }, 3000);
  };

  const handleUploadImage = () => {
    // This would be implemented with a file input in real app
    toast.info("Image upload would be implemented here");
    handleCaptureImage(); // For demo, we'll just trigger the same flow
  };

  const handleConfirmBodyShape = async () => {
    try {
      if (!selectedBodyShape) return;
      
      await updateUserProfile({ bodyShape: selectedBodyShape });
      toast.success("Body shape saved successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const handleManualSelection = (shape: BodyShape) => {
    setSelectedBodyShape(shape);
  };

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Body Shape Analysis</h1>

        {/* Steps display when not showing camera or results */}
        {!showCamera && !showResults && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold">{scanSteps[scanStep].title}</h2>
              <p className="text-gray-600 mt-2">{scanSteps[scanStep].description}</p>
              
              {/* Illustration placeholder */}
              <div className="my-6 h-48 rounded-lg bg-[#A3E4FF] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#0057D8]">
                  <path d="M15 2H9a1 1 0 0 0-1 1v2a4 4 0 0 0 8 0V3a1 1 0 0 0-1-1Z" />
                  <path d="M8 12a5 5 0 0 1 8 0" />
                  <path d="M17 18.5a9 9 0 1 0-10 0" />
                </svg>
              </div>
              
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={() => scanStep > 0 ? setScanStep(scanStep - 1) : navigate(-1)}
                >
                  {scanStep > 0 ? "Back" : "Cancel"}
                </Button>
                <Button onClick={handleNextStep}>
                  {scanStep < scanSteps.length - 1 ? "Continue" : "Start Scan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Camera view */}
        {showCamera && (
          <Card className="mb-6">
            <CardContent className="pt-6 space-y-4">
              <div className="aspect-[3/4] bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* This would be a live camera feed in a real app */}
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-white text-center p-4">
                    <p>Camera preview would appear here</p>
                    <p className="text-sm text-gray-300 mt-2">
                      Stand with your full body visible
                    </p>
                  </div>
                </div>
                
                {/* Pose landmarks overlay - would be dynamic in real app */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 400">
                  <circle cx="150" cy="80" r="5" fill="#A3E4FF" />
                  <circle cx="130" cy="110" r="5" fill="#A3E4FF" />
                  <circle cx="170" cy="110" r="5" fill="#A3E4FF" />
                  <circle cx="150" cy="150" r="5" fill="#A3E4FF" />
                  <circle cx="120" cy="180" r="5" fill="#A3E4FF" />
                  <circle cx="180" cy="180" r="5" fill="#A3E4FF" />
                  <circle cx="120" cy="250" r="5" fill="#A3E4FF" />
                  <circle cx="180" cy="250" r="5" fill="#A3E4FF" />
                  <circle cx="120" cy="320" r="5" fill="#A3E4FF" />
                  <circle cx="180" cy="320" r="5" fill="#A3E4FF" />
                  
                  <line x1="150" y1="80" x2="130" y2="110" stroke="#A3E4FF" strokeWidth="2" />
                  <line x1="150" y1="80" x2="170" y2="110" stroke="#A3E4FF" strokeWidth="2" />
                  <line x1="130" y1="110" x2="150" y2="150" stroke="#A3E4FF" strokeWidth="2" />
                  <line x1="170" y1="110" x2="150" y2="150" stroke="#A3E4FF" strokeWidth="2" />
                  <line x1="150" y1="150" x2="120" y2="180" stroke="#A3E4FF" strokeWidth="2" />
                  <line x1="150" y1="150" x2="180" y2="180" stroke="#A3E4FF" strokeWidth="2" />
                  <line x1="120" y1="180" x2="120" y2="250" stroke="#A3E4FF" strokeWidth="2" />
                  <line x1="180" y1="180" x2="180" y2="250" stroke="#A3E4FF" strokeWidth="2" />
                  <line x1="120" y1="250" x2="120" y2="320" stroke="#A3E4FF" strokeWidth="2" />
                  <line x1="180" y1="250" x2="180" y2="320" stroke="#A3E4FF" strokeWidth="2" />
                </svg>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCamera(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCaptureImage}
                  disabled={processingImage}
                >
                  {processingImage ? 'Processing...' : 'Capture'}
                </Button>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  variant="link" 
                  className="text-[#3A8DFF]"
                  onClick={handleUploadImage}
                  disabled={processingImage}
                >
                  <Image className="h-4 w-4 mr-2" />
                  Upload from gallery instead
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Results view */}
        {showResults && (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold">Analysis Results</h2>
                <p className="text-gray-600 mt-1">We've analyzed your body shape</p>
                
                <div className="my-6">
                  {selectedBodyShape && (
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto bg-[#A3E4FF] rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#0057D8]">
                          <path d="M15 2H9a1 1 0 0 0-1 1v2a4 4 0 0 0 8 0V3a1 1 0 0 0-1-1Z" />
                          <path d="M8 12a5 5 0 0 1 8 0" />
                          <path d="M17 18.5a9 9 0 1 0-10 0" />
                        </svg>
                      </div>
                      <h3 className="mt-4 text-lg font-medium">
                        {bodyShapes.find(shape => shape.id === selectedBodyShape)?.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {bodyShapes.find(shape => shape.id === selectedBodyShape)?.description}
                      </p>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={handleConfirmBodyShape}
                  className="w-full"
                >
                  Confirm & Continue
                </Button>
              </CardContent>
            </Card>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Not sure? Choose manually:</h3>
              <div className="grid grid-cols-2 gap-3">
                {bodyShapes.map(shape => (
                  <Card 
                    key={shape.id} 
                    className={`cursor-pointer transition-all ${selectedBodyShape === shape.id ? 'ring-2 ring-[#3A8DFF]' : ''}`}
                    onClick={() => handleManualSelection(shape.id)}
                  >
                    <CardContent className="p-3 flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-[#A3E4FF] flex items-center justify-center mb-2">
                        <span className="text-[#0057D8]">{shape.name.charAt(0)}</span>
                      </div>
                      <h4 className="font-medium">{shape.name}</h4>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Processing Dialog */}
      <Dialog open={processingImage} onOpenChange={setProcessingImage}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Analyzing your body shape</DialogTitle>
            <DialogDescription>
              This will just take a moment...
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3A8DFF]"></div>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default BodyScan;
