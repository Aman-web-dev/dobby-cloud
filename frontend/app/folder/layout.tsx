"use client";

import React,{useState} from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home,Search } from "lucide-react";
import { LogOut } from "lucide-react";
import { handleLogOut } from "../action";

function layout({children}:{children:any}) {
  const pathName = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                My Images {pathName}
              </h1>
            
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
      {children}
    </div>
  );
}

export default layout;
