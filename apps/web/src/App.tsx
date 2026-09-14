import { useState } from 'react';

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                C
              </div>
              <span className="font-bold text-xl tracking-tight">Clothy AI</span>
              <span className="ml-2 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                Store A Tenant
              </span>
            </div>
            <div className="flex items-center gap-6">
              <button className="text-sm font-medium text-gray-500 hover:text-gray-900">Catalog</button>
              <button className="text-sm font-medium text-gray-500 hover:text-gray-900">Analytics</button>
              <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white shadow-sm"></div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            AI Virtual Try-On
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Upload a customer photo to generate AI-powered product recommendations and visualize garments instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 flex flex-col items-center justify-center min-h-[400px] transition-all hover:border-blue-300">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Upload Customer Photo</h3>
            <p className="mt-2 text-sm text-gray-500 text-center mb-6 max-w-xs">
              PNG, JPG up to 5MB. Clear, full-body images yield the most accurate AI recommendations.
            </p>
            <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm cursor-pointer">
              Select Image
            </button>
          </div>

          {/* AI Results Placeholder */}
          <div className="bg-gray-100/50 rounded-2xl border-2 border-dashed border-gray-300 p-10 flex flex-col items-center justify-center min-h-[400px]">
            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
            </svg>
            <h3 className="text-gray-500 font-semibold text-center">
              Awaiting AI Analysis
            </h3>
            <p className="text-sm text-gray-400 mt-2 text-center max-w-xs">
              Upload an image to see top recommended products and generate virtual try-ons from the active catalog.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;