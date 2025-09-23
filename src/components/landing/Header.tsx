import React from 'react';
import { Link } from 'react-router-dom';

export const LandingHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-lg border-b border-gray-300 fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.png" alt="AI Voice Journal" className="h-10 w-10 mr-3" />
            <span className="text-2xl font-bold text-black">AI Voice Journal</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link to="/app?signup=true" className="text-black hover:text-blue-600 font-semibold transition-colors">
              新規登録
            </Link>
            <Link to="/app?guest=true" className="text-black hover:text-blue-600 font-semibold transition-colors">
              ゲストモード
            </Link>
          </nav>
          <div className="md:hidden">
            <Link
              to="/app?guest=true"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              アプリを開く
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
