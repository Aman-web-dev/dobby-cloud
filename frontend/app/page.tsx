"use client";

import Image from "next/image";
import {
  Search,
  Upload,
  FolderPlus,
  Home,
  ArrowLeft,
  LogOut,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { getUserDetailsFromCookie } from "./lib/session";
import { useEffect, useState } from "react";
import axios from "axios";
import { handleLogOut } from "./action";
import { useRouter, usePathname } from "next/navigation";


const FolderIcon = ({ className = "w-12 h-12" }) => (
  <div className={`${className} relative`}>
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <defs>
        <linearGradient id="folderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      {/* Folder back */}
      <path
        d="M8 16 L8 52 C8 54 10 56 12 56 L52 56 C54 56 56 54 56 52 L56 20 C56 18 54 16 52 16 L28 16 L24 12 L12 12 C10 12 8 14 8 16 Z"
        fill="url(#folderGradient)"
        stroke="#2563eb"
        strokeWidth="0.5"
      />
      {/* Folder front */}
      <path
        d="M8 20 L8 48 C8 50 10 52 12 52 L52 52 C54 52 56 50 56 48 L56 24 C56 22 54 20 52 20 L28 20 L24 16 L12 16 C10 16 8 18 8 20 Z"
        fill="url(#folderGradient)"
        stroke="#2563eb"
        strokeWidth="0.5"
      />
    </svg>
  </div>
);

type user = {
  userId: string;
  email: string;
  token: string;
};

type folder={
  name:string,
  id:string,
  user: string,
  parentFolder: string|null,
  path: string,
  createdAt: Date,
  __v: number
}

// Home Screen Component
export default function HomeScreen() {
  const [currentUser, setCurrentUser] = useState<user>({
    email: "",
    userId: "",
    token: "",
  });

  const [currentPath, setCurrentPath] = useState([]);
  const [folders, setFolders] = useState<folder[]>([]);
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newImageName, setNewImageName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const router = useRouter();
  const pathName = usePathname();

  const getCurrentFolders = () => {
    const parentId = getCurrentFolderId();
    return folders.filter((f) => f.parentId === parentId);
  };


  const getCurrentFolderId = () => {
    if (currentPath.length === 0) return null;
    return currentPath[currentPath.length - 1].id;
  };


  

  const getCurrentImages = () => {
    const parentId = getCurrentFolderId();
    return images.filter((i) => i.folderId === parentId);
  };

  const getFilteredImages = () => {
    if (!searchTerm) return getCurrentImages();
    return images.filter(
      (i) =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (i.folderId === getCurrentFolderId() || searchTerm.length > 0)
    );
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;

    const folderCreationReponse = await axios
      .post("http://localhost:9000/api/v1/folders/", {
        newFolderName,
      })
      .then(() => {
        setNewFolderName("");
        setShowCreateFolder(false);
      })
      .catch((error) => {});
  };

  const uploadImage = () => {
    if (!newImageName.trim() || !selectedImage) return;

    const image = {
      id: Date.now(),
      name: newImageName,
      folderId: getCurrentFolderId(),
      userId: currentUser.id || "rwerwwer",
      file: selectedImage,
      url: URL.createObjectURL(selectedImage),
      createdAt: new Date(),
    };

    mockImages.push(image);
    setImages([...images, image]);
    setNewImageName("");
    setSelectedImage(null);
    setShowUploadImage(false);
  };

  const navigateToFolder = (folder) => {
    setCurrentPath([...currentPath, folder]);
  };

  const navigateUp = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };

  const navigateHome = () => {
    setCurrentPath([]);
  };

  const getUserDetails = async () => {
    const userDetails = await getUserDetailsFromCookie();
    if (userDetails) {
      const { id, email, token } = userDetails;
      setCurrentUser({
        email: email as string,
        userId: id as string,
        token: token as string,
      });
      getAllfolders(token as string);
    }
  };

  const getAllfolders = (token: string) => {
    axios
      .get("http://localhost:9000/api/v1/folders/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        console.log(resp.data.data.folders);
        setFolders(resp.data.data.folders);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                My Images {pathName}
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <button onClick={navigateHome} className="hover:text-blue-600">
                  <Home className="w-4 h-4" />
                </button>
                {currentPath.map((folder, index) => (
                  <div key={folder.id} className="flex items-center space-x-2">
                    <span>/</span>
                    <button
                      onClick={() =>
                        setCurrentPath(currentPath.slice(0, index + 1))
                      }
                      className="hover:text-blue-600"
                    >
                      {folder.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search images..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64"
                />
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Welcome,{" "}
                  <span className="font-bold">{currentUser.email}</span>
                </span>
                <button
                  onClick={() => handleLogOut(router)}
                  className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Action Bar */}
      <div className="bg-white border-b px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {currentPath.length > 0 && (
              <button
                onClick={navigateUp}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCreateFolder(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FolderPlus className="w-4 h-4" />
              <span>New Folder</span>
            </button>

            <button
              onClick={() => setShowUploadImage(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Image</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {/* Folders */}
          {getCurrentFolders().map((folder) => (
            <div
              key={folder.id}
              onClick={() => navigateToFolder(folder)}
              className="flex flex-col items-center p-4 rounded-xl hover:bg-blue-50 cursor-pointer transition-all duration-200 transform hover:scale-105 group"
            >
              <FolderIcon className="w-16 h-16 mb-3 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900 text-center break-words w-full">
                {folder.name}
              </span>
            </div>
          ))}

          {/* Images */}
          {getFilteredImages().map((image) => (
            <div
              key={image.id}
              className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 transform hover:scale-105"
            >
              <div className="w-16 h-16 mb-3 rounded-lg overflow-hidden shadow-md">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium text-gray-900 text-center break-words w-full">
                {image.name}
              </span>
            </div>
          ))}
        </div>

        {getCurrentFolders().length === 0 &&
          getFilteredImages().length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No items yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create a folder or upload some images to get started
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setShowCreateFolder(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Create Folder</span>
                </button>
                <button
                  onClick={() => setShowUploadImage(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                </button>
              </div>
            </div>
          )}
      </main>

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Create New Folder
            </h2>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mb-6"
              autoFocus
            />
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowCreateFolder(false);
                  setNewFolderName("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createFolder}
                disabled={!newFolderName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Image Modal */}
      {showUploadImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Upload Image
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Name
                </label>
                <input
                  type="text"
                  value={newImageName}
                  onChange={(e) => setNewImageName(e.target.value)}
                  placeholder="Enter image name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>

              {selectedImage && (
                <div className="mt-4">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowUploadImage(false);
                  setNewImageName("");
                  setSelectedImage(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={uploadImage}
                disabled={!newImageName.trim() || !selectedImage}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
