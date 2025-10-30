import React, { Component } from "react";
import { AlertTriangle } from "../../lib/icons";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-hospital-purple/20 via-white to-teal-500/20 flex items-center justify-center p-4">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-glass p-8 max-w-md w-full border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-error-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-error-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Something went wrong
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Please refresh the page or
              contact support if the problem persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-hospital-purple text-white rounded-lg hover:bg-hospital-purple-dark transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
