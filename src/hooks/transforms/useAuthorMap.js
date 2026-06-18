import { useMemo } from 'react';

const useAuthorMap = (authors) => {
  const authorMap = useMemo(() => {
    return authors.reduce((map, author) => {
      map[author.id] = {
        ...author,
        name: `${author.first_name} ${author.last_name}`,
      };
      return map;
    }, {});
  }, [authors]);

  return authorMap;
};

export default useAuthorMap;
