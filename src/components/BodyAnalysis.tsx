
import React, { useState } from 'react';
import { analyzeBodyShape } from '@/utils/bodyShapeAnalysis';
import DressVisualization from './DressVisualization';
import DressSelectionModal from './DressSelectionModal';
import { toast } from "@/components/ui/sonner";

interface Clothing {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
}

// Mock data for dresses - in a real app, this would come from your wardrobe
const mockDresses: Clothing[] = [
  {
    id: "dress1",
    name: "Blue Summer Dress",
    type: "dress",
    imageUrl: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=300"
  },
  {
    id: "dress2",
    name: "Red Evening Dress",
    type: "dress",
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300"
  }
];

const BodyAnalysis = () => {
  const [bodyShape, setBodyShape] = useState<string | null>(null);
  const [selectedDress, setSelectedDress] = useState<Clothing | null>(null);
  const [showDressModal, setShowDressModal] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = URL.createObjectURL(file);
      const shape = await analyzeBodyShape(imageUrl);
      setBodyShape(shape);
      toast.success(`Body shape analysis complete: ${shape} body type`);
    } catch (error) {
      console.error('Error analyzing body shape:', error);
      toast.error('Error analyzing body shape. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Upload your photo for body shape analysis
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full p-2 border rounded"
        />
      </div>

      {bodyShape && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Your Body Shape Analysis</h3>
          <p className="text-gray-700">
            Your body shape appears to be: <span className="font-medium">{bodyShape}</span>
          </p>
        </div>
      )}

      <DressVisualization
        selectedDress={selectedDress}
        onSelectDress={() => setShowDressModal(true)}
      />

      <DressSelectionModal
        isOpen={showDressModal}
        onClose={() => setShowDressModal(false)}
        onSelectDress={setSelectedDress}
        dresses={mockDresses}
      />
    </div>
  );
};

export default BodyAnalysis;
