import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import { ArrowLeft } from 'lucide-react'
import Button from './Button';

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const CountiesVisited = () => {
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    async function fetchVisits() {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage

      if (!token) {
        console.error("User token not found in localStorage.");
        return;
      }

      try {
        const GET_API_URL = import.meta.env.VITE_GET_API_URL;
        const response = await fetch(`${GET_API_URL}/${token}`);
        if (!response.ok) {
          throw new Error("Failed to fetch visited counties.");
        }
        const data = await response.json();
        setVisits(data);
      } catch (error) {
        console.error("Error fetching visits:", error);
      }
    }
    fetchVisits();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Map
          </Button>
        </Link>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Counties Visited</h2>
        </div>
        <div className="p-6">
          {visits.length > 0 ? (
            <ul className="space-y-2">
              {visits.map((visit) => (
                <li key={visit._id} className="bg-gray-100 p-3 rounded-md">
                  <p className="font-semibold text-gray-800">{visit.county_name}</p>
                  <p className="text-sm text-gray-600">
                    Visited on: {new Date(visit.date).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No counties visited yet.</p>
          )}
        </div>
      </div>
    </div>
  )
};

export default CountiesVisited;
