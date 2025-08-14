"use client";

import { Upload, FolderPlus, ArrowLeft, Home, Search } from "lucide-react";
import { getUserDetailsFromCookie } from "../../lib/session";
import { useEffect, useState } from "react";
import axios from "axios";
import { storage } from "../../lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { LogOut } from "lucide-react";
import { handleLogOut } from "../../action";

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

type User = {
  userId: string;
  email: string;
  token: string;
};

type Folder = {
  _id: string;
  name: string;
  user: string;
  parentFolder: string | null;
  path: string;
  createdAt: Date;
  __v: number;
};

type Image = {
  _id: string;
  name: string;
  user: string;
  folder: string | null;
  imageUrl: string;
  createdAt: Date;
  __v: number;
};

type BreadcrumbItem = {
  id: string;
  name: string;
};

export default function HomeScreen({ params }: { params: any }) {
  const [currentUser, setCurrentUser] = useState<User>({
    email: "",
    userId: "",
    token: "",
  });
  const [currentPath, setCurrentPath] = useState<BreadcrumbItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newImageName, setNewImageName] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Image[]>([]);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const pathName = usePathname();

  // Get current folder ID from params or null for root
  const getCurrentFolderId = () => {
    return params.id === "root" ? currentUser.userId : params.id;
  };

  // Create folder function
  const createFolder = async () => {
    if (!newFolderName.trim() || !currentUser.token) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/folders/`,
        {
          name: newFolderName,
          parentFolder: getCurrentFolderId(),
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      // Refresh folder data after creation
      await getFolderContents(getCurrentFolderId(), currentUser.token);

      setNewFolderName("");
      setShowCreateFolder(false);
    } catch (error) {
      console.error("Error creating folder:", error);
      console.log("Failed to create folder. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  async function uploadImageAndGetUrl(
    imageFile: any,
    storagePath: any,
    userId: string
  ) {
    try {
      console.log(storage);
      console.log("I am Called");

      let fullPath = storagePath;
      if (userId) {
        fullPath = `${userId}/${storagePath}`;
      }

      const timestamp = Date.now();
      const fileName = `${timestamp}_${imageFile.name}`;
      const storageRef = ref(storage, `${fullPath}/${fileName}`);

      const snapshot = await uploadBytes(storageRef, imageFile);

      const downloadUrl = await getDownloadURL(snapshot.ref);

      return downloadUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  const uploadImage = async () => {
    if (!newImageName.trim() || !selectedImage || !currentUser.token) return;

    setLoading(true);
    try {
      const imageUrl = await uploadImageAndGetUrl(
        selectedImage,
        "dobbyImages",
        currentUser.userId
      );

      const data = {
        name: newImageName,
        imageUrl: imageUrl,
        folderId: getCurrentFolderId(),
      };

      const response = await axios.post(`${backendUrl}/images/`, data, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });

      await getFolderContents(getCurrentFolderId(), currentUser.token);

      setNewImageName("");
      setSelectedImage(null);
      setShowUploadImage(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      console.log("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get user details from cookie
  const getUserDetails = async () => {
    const userDetails = await getUserDetailsFromCookie();
    if (userDetails) {
      const { id, email, token } = userDetails;
      setCurrentUser({
        email: email as string,
        userId: id as string,
        token: token as string,
      });

      // Load initial data
      await getFolderContents(getCurrentFolderId(), token as string);
      await buildBreadcrumbs(getCurrentFolderId(), token as string);
    } else {
      // Redirect to login if no user details
      router.push("/auth/login");
    }
  };

  const getFolderContents = async (folderId: string | null, token: string) => {
    setLoading(true);
    try {
      const folderIdParam = folderId || "689c241a9bad5e3b65a72e6a";

      const foldersResponse = await axios.get(
        `${backendUrl}/folders/${folderIdParam}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch images
      const imagesResponse = await axios.get(
        `${backendUrl}/images/${folderIdParam}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFolders(foldersResponse.data.data.folders || []);
      setImages(imagesResponse.data.data.images || []);
    } catch (error) {
      console.error("Error fetching folder contents:", error);
      setFolders([]);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const buildBreadcrumbs = async (folderId: string | null, token: string) => {
    if (!folderId) {
      setCurrentPath([]);
      return;
    }

    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/folders/${folderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const folderData = response.data.data.folder;
      if (folderData && folderData.path) {
        const pathParts = folderData.path
          .split("/")
          .filter((part: any) => part);
        setCurrentPath([{ id: folderId, name: folderData.name }]);
      }
    } catch (error) {
      console.error("Error building breadcrumbs:", error);
      setCurrentPath([]);
    }
  };

  const navigateToFolder = (folder: Folder) => {
    router.push(`/folder/${folder._id}`);
  };

  const navigateUp = () => {
    if (currentPath.length === 0) {
      router.push("/folder/root");
      return;
    }

    if (currentPath.length === 1) {
      router.push("/folder/root");
      return;
    }

    const parentFolder = currentPath[currentPath.length - 2];
    router.push(`/folder/${parentFolder.id}`);
  };

  const navigateHome = () => {
    router.push("/folder/root");
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);

    if (!term.trim() || !currentUser.token) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `${backendUrl}/images/search?q=${encodeURIComponent(term)}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      setSearchResults(response.data.data.images || []);
    } catch (error) {
      console.error("Error searching images:", error);
      setSearchResults([]);
    }
  };

  // Get images to display (search results or current folder images)
  const getDisplayImages = () => {
    return searchTerm.trim() ? searchResults : images;
  };

  useEffect(() => {
    getUserDetails();
  }, [params.id]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">My Images</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <button onClick={navigateHome} className="hover:text-blue-600">
                  <Home className="w-4 h-4" />
                </button>
                {currentPath.map((folder, index) => (
                  <div key={folder.id} className="flex items-center space-x-2">
                    <span>/</span>
                    <button
                      onClick={() => router.push(`/folder/${folder.id}`)}
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
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search images..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64"
                />
              </div>

              <div className="flex items-center space-x-2 text-gray-700">
                <span className="text-sm text-gray-700">
                  Welcome, {currentUser.email}
                </span>
                <span onClick={() => handleLogOut(router)}>
                  <LogOut />
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Action Bar */}
      <div className="bg-white border-b px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {(currentPath.length > 0 || getCurrentFolderId() !== null) && (
              <button
                onClick={navigateUp}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={loading}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCreateFolder(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              <FolderPlus className="w-4 h-4" />
              <span>New Folder</span>
            </button>

            <button
              onClick={() => setShowUploadImage(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Image</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {/* Show folders only if not searching */}
            {!searchTerm.trim() &&
              folders.map((folder) => (
                <div
                  key={folder._id}
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
            {getDisplayImages().map((image) => (
              <div
                key={image._id}
                className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 transform hover:scale-105"
              >
                <div className="w-16 h-16 mb-3 rounded-lg overflow-hidden shadow-md">
                  <img
                    src={image.imageUrl}
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
        )}

        {/* Empty State */}
        {!loading &&
          folders.length === 0 &&
          getDisplayImages().length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm.trim() ? "No images found" : "No items yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm.trim()
                  ? "Try adjusting your search terms"
                  : "Create a folder or upload some images to get started"}
              </p>
              {!searchTerm.trim() && (
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
              )}
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
              disabled={loading}
            />
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowCreateFolder(false);
                  setNewFolderName("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={createFolder}
                disabled={!newFolderName.trim() || loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Creating..." : "Create"}
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
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setSelectedImage(e.target.files?.[0] || null)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  disabled={loading}
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
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={uploadImage}
                disabled={!newImageName.trim() || !selectedImage || loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
