
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Hanger } from "lucide-react";

interface Clothing {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
}

interface DressSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDress: (dress: Clothing) => void;
  dresses: Clothing[];
}

const DressSelectionModal = ({
  isOpen,
  onClose,
  onSelectDress,
  dresses,
}: DressSelectionModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select a Dress</DialogTitle>
        </DialogHeader>
        
        {dresses.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {dresses.map((dress) => (
              <Card 
                key={dress.id}
                className="cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => {
                  onSelectDress(dress);
                  onClose();
                }}
              >
                <CardContent className="p-3">
                  <div className="aspect-square mb-2">
                    <img
                      src={dress.imageUrl}
                      alt={dress.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <p className="text-sm font-medium truncate">{dress.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Hanger className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">No dresses found in your wardrobe</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DressSelectionModal;
