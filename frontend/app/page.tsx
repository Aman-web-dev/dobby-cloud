"use client";

import React, { useState } from "react";
import {
  Upload,
  FolderPlus,
  Search,
  Grid,
  List,
  Cloud,
  Star,
  Trash2,
} from "lucide-react";

const DobbyCloud = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [selectedItems, setSelectedItems] = useState(new Set());

  const folders = [
    { id: 1, name: "Photos", type: "folder", color: "#007AFF", items: 45 },
    { id: 2, name: "Documents", type: "folder", color: "#FF9500", items: 23 },
    { id: 3, name: "Projects", type: "folder", color: "#34C759", items: 12 },
    { id: 4, name: "Screenshots", type: "folder", color: "#5856D6", items: 67 },
  ];

  const files = [
    {
      id: 5,
      name: "vacation-photo.jpg",
      type: "image",
      size: "2.3 MB",
      preview:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop",
    },
    { id: 6, name: "presentation.pdf", type: "document", size: "4.1 MB" },
    {
      id: 7,
      name: "design-mockup.png",
      type: "image",
      size: "1.8 MB",
      preview:
        "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=100&h=100&fit=crop",
    },
    { id: 8, name: "meeting-notes.txt", type: "document", size: "256 KB" },
  ];

  const allItems = [...folders, ...files];

  const toggleSelection = (id: any) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  };

  const MacFolder = ({ folder, isSelected, onClick }: any) => (
    <div
      className={`relative cursor-pointer transition-all duration-200 ${
        isSelected ? "scale-105" : "hover:scale-102"
      }`}
      onClick={() => onClick(folder.id)}
    >
      <div className="flex flex-col items-center p-4">
        <div
          className="relative w-16 h-12 mb-2"
          style={{
            background: `linear-gradient(135deg, ${folder.color}, ${folder.color}dd)`,
            borderRadius: "6px 6px 4px 4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <div
            className="absolute top-0 left-2 w-4 h-2 rounded-b-sm"
            style={{ backgroundColor: folder.color }}
          ></div>
          {isSelected && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </div>
        <span className="text-sm text-gray-700 text-center max-w-20 truncate">
          {folder.name}
        </span>
        <span className="text-xs text-gray-500">{folder.items} items</span>
      </div>
    </div>
  );

  const FileIcon = ({ file, isSelected, onClick }: any) => {
    if (file.type === "image" && file.preview) {
      return (
        <div
          className={`relative cursor-pointer transition-all duration-200 ${
            isSelected ? "scale-105" : "hover:scale-102"
          }`}
          onClick={() => onClick(file.id)}
        >
          <div className="flex flex-col items-center p-4">
            <div className="relative w-16 h-16 mb-2 rounded-lg overflow-hidden shadow-md">
              <img
                src={file.preview}
                alt={file.name}
                className="w-full h-full object-cover"
              />
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            <span className="text-sm text-gray-700 text-center max-w-20 truncate">
              {file.name}
            </span>
            <span className="text-xs text-gray-500">{file.size}</span>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`relative cursor-pointer transition-all duration-200 ${
          isSelected ? "scale-105" : "hover:scale-102"
        }`}
        onClick={() => onClick(file.id)}
      >
        <div className="flex flex-col items-center p-4">
          <div className="relative w-16 h-16 mb-2 bg-white rounded-lg shadow-md border border-gray-200 flex items-center justify-center">
            <div className="text-2xl">📄</div>
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </div>
          <span className="text-sm text-gray-700 text-center max-w-20 truncate">
            {file.name}
          </span>
          <span className="text-xs text-gray-500">{file.size}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Cloud className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dobbby Cloud
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search files and folders..."
                  className="pl-10 pr-4 py-2 w-64 rounded-full border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Star className="w-5 h-5" />
              </button>
              <a href="/auth" className="p-2 px-2 rounded-lg bg-blue-700 text-white hover:text-blue-600 transition-colors">
                Sign in
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Your files, everywhere you need them
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Store, organize, and access your images and documents from anywhere.
            Simple, secure, and always in sync.
          </p>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl">
              <Upload className="w-5 h-5" />
              <span>Upload Files</span>
            </button>
            <button className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg border border-gray-200 transition-colors shadow-lg hover:shadow-xl">
              <FolderPlus className="w-5 h-5" />
              <span>Create Folder</span>
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-900">My Files</h3>
            <span className="text-sm text-gray-500">
              {allItems.length} items
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
            {selectedItems.size > 0 && (
              <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* File Grid */}
        <div className="bg-white rounded-2xl shadow-xl p-6 min-h-96">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {folders.map((folder) => (
                <MacFolder
                  key={folder.id}
                  folder={folder}
                  isSelected={selectedItems.has(folder.id)}
                  onClick={toggleSelection}
                />
              ))}
              {files.map((file) => (
                <FileIcon
                  key={file.id}
                  file={file}
                  isSelected={selectedItems.has(file.id)}
                  onClick={toggleSelection}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {allItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedItems.has(item.id)
                      ? "bg-blue-50 border border-blue-200"
                      : ""
                  }`}
                  onClick={() => toggleSelection(item.id)}
                >
                  <div className="w-8 h-8 mr-3 flex-shrink-0">
                    {item.type === "folder" ? (
                      <div
                        className="w-8 h-6 rounded"
                        style={{
                          backgroundColor: (item as { color: string }).color,
                        }}
                      ></div>
                    ) : item.type === "image" &&
                      "preview" in item &&
                      item.preview ? (
                      <img
                        src={item.preview}
                        alt={item.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                    ) : (
                      <div className="text-lg">📄</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.type === "folder"
                        ? `${(item as { items: number }).items} items`
                        : (item as { size: string }).size}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500">
          <p className="text-sm">
            Dobbby Cloud - Simple, secure file storage and sharing
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DobbyCloud;
