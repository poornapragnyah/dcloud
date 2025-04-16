import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Web3Provider } from "./contexts/Web3Context";
import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import FileView from "./pages/FileView";
import "./index.css";

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/files/:fileId" element={<FileView />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="bg-white mt-12 py-6 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} DCloud - Decentralized Storage
                System
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;
