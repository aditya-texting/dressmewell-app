
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8 text-center">
          {/* App Logo/Name */}
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#3A8DFF] to-[#0057D8] bg-clip-text text-transparent">
            DressMeWell
          </h1>
          
          {/* Tagline */}
          <p className="text-xl text-gray-700">
            Your personal AI fashion assistant
          </p>
          
          {/* Illustration */}
          <div className="py-8 flex justify-center">
            <div className="w-40 h-40 rounded-full bg-[#A3E4FF] flex items-center justify-center overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#0057D8]">
                <path d="M6.5 14.5h11"></path>
                <path d="M6.5 9.5h11"></path>
                <path d="m8 4 4 16 4-16"></path>
              </svg>
            </div>
          </div>
          
          {/* Features List */}
          <div className="space-y-2 text-gray-600">
            <p>✓ Smart outfit recommendations</p>
            <p>✓ Body shape analysis</p>
            <p>✓ Virtual wardrobe management</p>
            <p>✓ Weather-based style guidance</p>
          </div>
          
          {/* CTA Buttons */}
          <div className="pt-6 space-y-3">
            {currentUser ? (
              <Link to="/dashboard">
                <Button 
                  className="w-full bg-gradient-to-r from-[#3A8DFF] to-[#0057D8] text-white py-6"
                >
                  Continue to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button 
                    className="w-full bg-gradient-to-r from-[#3A8DFF] to-[#0057D8] text-white py-6"
                  >
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    className="w-full border-[#3A8DFF] text-[#3A8DFF] py-6"
                  >
                    I Already Have an Account
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-4 px-4 border-t bg-white">
        <div className="max-w-5xl mx-auto flex justify-center">
          <p className="text-sm text-gray-500">© 2025 DressMeWell. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
