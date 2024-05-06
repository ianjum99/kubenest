import axios from 'axios';

const baseURL = 'http://localhost:3001'; // Change this to your Node.js server address

const kubeApi = {
  listNamespaces: async () => {
    try {
      const response = await axios.get(`${baseURL}/namespaces`);
      return response.data;
    } catch (error) {
      console.error('Error fetching namespaces:', error);
      throw error;
    }
  }
};

export default kubeApi;
