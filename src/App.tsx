import React from 'react';
import PhotoUpload from './components/PhotoUpload';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm py-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Photo Hugs
        </h1>
      </header>
      <main className="container mx-auto py-8">
        <PhotoUpload />
      </main>
    </div>
  );
}

export default App; 