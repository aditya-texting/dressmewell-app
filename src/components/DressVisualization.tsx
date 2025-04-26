
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Hanger } from "lucide-react";

interface Clothing {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
}

interface DressVisualizationProps {
  selectedDress: Clothing | null;
  onSelectDress: () => void;
}

const DressVisualization = ({ selectedDress, onSelectDress }: DressVisualizationProps) => {
  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {selectedDress ? (
            <div className="relative w-full aspect-[3/4]">
              <img
                src={selectedDress.imageUrl}
                alt={selectedDress.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full aspect-[3/4] bg-gray-100 rounded-lg">
              <Hanger className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-gray-500 text-center">No dress selected</p>
            </div>
          )}
          
          <Button 
            onClick={onSelectDress}
            className="w-full"
          >
            {selectedDress ? "Change Dress" : "Select Dress"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DressVisualization;
