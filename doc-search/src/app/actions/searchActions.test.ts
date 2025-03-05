import { performSearch, refreshSearch } from "./searchActions";

describe('searchActions', () => {
  const mockFetch = jest.fn();
  
  beforeAll(() => {
    (global as Partial<typeof global>).fetch = mockFetch;
  });

  beforeEach(() => {
    mockFetch.mockClear();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    delete (global as Partial<typeof global>).fetch;
  });

  describe('performSearch', () => {
    const mockSuccessResponse = { 
      results: [{ title: 'Test Doc', content: 'Test Content' }] 
    };

    it('should make a POST request to the search API with correct parameters', async () => {
      // Arrange
      const mockResponse = { 
        ok: true, 
        json: () => Promise.resolve(mockSuccessResponse) 
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      // Act
      await performSearch('test query', 'JavaScript');

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/search'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: 'test query',
            language: 'JavaScript'
          })
        })
      );
    });

    it('should throw an error when the API request fails', async () => {
      // Arrange
      const mockResponse = { 
        ok: false, 
        statusText: 'Not Found',
        status: 404 
      };
      mockFetch.mockResolvedValueOnce(mockResponse);

      // Act & Assert
      await expect(performSearch('test query'))
        .rejects
        .toThrow('Search failed: Not Found (404)');
    });

    it('should handle network errors', async () => {
      // Arrange
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      // Act & Assert
      await expect(performSearch('test query'))
        .rejects
        .toThrow('Network error');
    });
  });

  describe('refreshSearch', () => {
    it('should return redirect object with encoded search query', async () => {
      // Arrange
      const formData = new FormData();
      formData.append('q', 'test query');

      // Act
      const result = await refreshSearch({}, formData);

      // Assert
      expect(result).toEqual({
        redirect: {
          destination: '/search?q=test%20query',
          permanent: false,
        },
      });
    });

    it('should handle empty search query', async () => {
      // Arrange
      const formData = new FormData();

      // Act
      const result = await refreshSearch({}, formData);

      // Assert
      expect(result).toEqual({
        redirect: {
          destination: '/search?q=',
          permanent: false,
        },
      });
    });
  });
});