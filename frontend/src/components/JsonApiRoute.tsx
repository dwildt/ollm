import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

const JsonApiRoute: React.FC = () => {
  const { templateSlug } = useParams<{ templateSlug?: string }>();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!templateSlug) return;

    // Redirect directly to the backend API endpoint
    const queryString = searchParams.toString();
    const apiUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:4001/api'}/chat/${templateSlug}.json${queryString ? `?${queryString}` : ''}`;
    
    // Replace current location with API endpoint
    window.location.replace(apiUrl);
  }, [templateSlug, searchParams]);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'monospace',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '50vh'
    }}>
      <div>Redirecting to API endpoint...</div>
    </div>
  );
};

export default JsonApiRoute;