import { useEffect, useState } from 'react';

const useFetchJson = (path) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    fetch(path)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch ${path}: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        if (!cancelled) {
          setData(Array.isArray(json) ? json : [json]);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(`Error fetching ${path}:`, err);
          setError(err);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [path]);

  return { data, setData, isLoading, error };
};

export default useFetchJson;
