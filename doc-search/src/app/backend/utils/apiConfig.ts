const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  };
  
  export default getApiUrl;