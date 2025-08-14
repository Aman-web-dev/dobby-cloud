'use client'

import React, { useState, useEffect } from 'react';
import { Search, Upload, FolderPlus, Home, ArrowLeft, LogOut, User, Eye, EyeOff } from 'lucide-react';

// Mock data structure for demonstration
const mockUsers = [];
const mockFolders = [];
const mockImages = [];

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [currentPath, setCurrentPath] = useState([]);
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newImageName, setNewImageName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  // Authentication functions
  const handleSignup = (email, password, name) => {
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      alert('User already exists!');
      return false;
    }
    
    const newUser = {
      id: Date.now(),
      email,
      password,
      name,
      createdAt: new Date()
    };
    mockUsers.push(newUser);
    alert('Account created successfully! Please login.');
    setCurrentScreen('login');
    return true;
  };

  const handleLogin = (email, password) => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setCurrentScreen('home');
      loadUserData(user.id);
      return true;
    }
    alert('Invalid credentials!');
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
    setCurrentPath([]);
    setFolders([]);
    setImages([]);
    setSearchTerm('');
  };

  // Data management functions
  const loadUserData = (userId) => {
    const userFolders = mockFolders.filter(f => f.userId === userId);
    const userImages = mockImages.filter(i => i.userId === userId);
    setFolders(userFolders);
    setImages(userImages);
  };

  const getCurrentFolderId = () => {
    if (currentPath.length === 0) return null;
    return currentPath[currentPath.length - 1].id;
  };

  const getCurrentFolders = () => {
    const parentId = getCurrentFolderId();
    return folders.filter(f => f.parentId === parentId);
  };



  const createFolder = () => {
    if (!newFolderName.trim()) return;
    
    const folder = {
      id: Date.now(),
      name: newFolderName,
      parentId: getCurrentFolderId(),
      userId: currentUser.id,
      createdAt: new Date()
    };
    
    mockFolders.push(folder);
    setFolders([...folders, folder]);
    setNewFolderName('');
    setShowCreateFolder(false);
  };

  const uploadImage = () => {
    if (!newImageName.trim() || !selectedImage) return;
    
    const image = {
      id: Date.now(),
      name: newImageName,
      folderId: getCurrentFolderId(),
      userId: currentUser.id,
      file: selectedImage,
      url: URL.createObjectURL(selectedImage),
      createdAt: new Date()
    };
    
    mockImages.push(image);
    setImages([...images, image]);
    setNewImageName('');
    setSelectedImage(null);
    setShowUploadImage(false);
  };



  // Login Screen Component
  const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      handleLogin(email, password);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => handleLogin(email, password)}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02]"
            >
              Sign In
            </button>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => setCurrentScreen('signup')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Signup Screen Component
  const SignupScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = () => {
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      handleSignup(email, password, name);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600 mt-2">Sign up to get started</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                placeholder="Confirm your password"
                required
              />
            </div>
            
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-[1.02]"
            >
              Create Account
            </button>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => setCurrentScreen('login')}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  };

  


  // Render current screen
  if (currentScreen === 'login') {
    return <LoginScreen />;
  } else if (currentScreen === 'signup') {
    return <SignupScreen />;
  }

  return <LoginScreen />;
};

export default App;