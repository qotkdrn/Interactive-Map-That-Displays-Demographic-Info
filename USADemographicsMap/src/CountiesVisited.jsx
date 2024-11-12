import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
        const response = await fetch(`http://localhost:5000/api/visits/${token}`);
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
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Counties Visited</h2>
        </div>
      </header>

      <ul>
        {visits.map((visit) => (
          <li key={visit._id}>
            <strong>County ID:</strong> {visit.county_id}, 
            <strong> County Name:</strong> {visit.county_name}, 
            <strong> Date Visited:</strong> {new Date(visit.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CountiesVisited;
