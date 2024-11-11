import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const CountiesVisited = () => {
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    async function fetchVisits() {
      const token = 'abcde'; // Replace with actual user token
      const response = await fetch(`http://localhost:5000/api/visits/${token}`);
      const data = await response.json();
      setVisits(data);
    }
    fetchVisits();
  }, []);

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/">
            <button>Back</button>
          </Link>
          <button style={{ marginLeft: '10px' }}>Counties Visited</button>
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
