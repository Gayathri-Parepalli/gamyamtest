const BASE_URL="https://prod-be.1acre.in/lands"

export const fetchProperties = async (page,page_size) => {
    try {
      const response = await fetch(`${BASE_URL}/?ordering=-updated_at&page=${page}&page_size=${page_size||10}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      } 
       return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };