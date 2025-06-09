import React from 'react'

const TestTailwind: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="card animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Tailwind CSS đã hoạt động! 🎉
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="card bg-blue-50 border-blue-200">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-blue-900">Colors</h3>
              </div>
              <p className="text-blue-700">Tailwind's color system is working perfectly!</p>
            </div>
            
            <div className="card bg-green-50 border-green-200">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-green-900">Layout</h3>
              </div>
              <p className="text-green-700">Grid and flexbox utilities are ready to use!</p>
            </div>
            
            <div className="card bg-purple-50 border-purple-200">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-purple-900">Components</h3>
              </div>
              <p className="text-purple-700">Custom components are styled and ready!</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <button className="btn-primary">Primary Button</button>
            <button className="btn-secondary">Secondary Button</button>
            <button className="btn-danger">Danger Button</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Email Address</label>
              <input 
                type="email" 
                className="input" 
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="label">Full Name</label>
              <input 
                type="text" 
                className="input" 
                placeholder="Enter your name"
              />
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Responsive Design</h4>
            <p className="text-gray-600 text-sm">
              This layout adapts to different screen sizes using Tailwind's responsive utilities.
              Try resizing your window to see it in action!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestTailwind