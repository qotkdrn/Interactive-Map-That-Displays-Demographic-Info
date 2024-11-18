import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-4 px-4 mt-auto">
      <div className="container mx-auto text-center text-sm text-gray-600">
        <p className="mb-2">
          Demographic data provided by the U.S. Census Bureau&apos;s American Community Survey (ACS) 5-Year Estimates
        </p>
        <p className="text-xs">
          Source:{' '}
          <Link
            to="https://api.census.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            api.census.gov
          </Link>
          {' '}| Data from the 2022 ACS 5-Year Estimates
        </p>
      </div>
    </footer>
  )
}

export default Footer