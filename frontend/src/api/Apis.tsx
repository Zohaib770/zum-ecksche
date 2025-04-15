import axiosInstance from './AxiosInstance.tsx';
import { Category, Food, Option } from '../types/Interfaces.tsx';

const Apis = {

  // categorie
  fetchCategories: async () => {
    try {
      const response = await axiosInstance.get('/api/fetch-all-category');
      return response.data as Category[];
    } catch (error) {
      console.error('Fehler beim Abrufen der Kategorien:', error);
      throw error;
    }
  },

  addCategory: async (formData: FormData) => {
    console.log("===== addCategory ENTER client");
    try {
      await axiosInstance.post('/api/create-category', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Kategorie:', error);
      throw error;
    }
  },

  // food
  fetchFoodsByCategory: async (categoryId: string) => {
    try {
      const response = await axiosInstance.get(`/api/fetch-foods-by-category/${categoryId}`);
      return response.data as Food[];
    } catch (error) {
      console.error('Fehler beim Abrufen der Speisen für Kategorie:', error);
      throw error;
    }
  },


  addFood: async (foodData: Omit<Food, '_id'>) => {
    try {
      await axiosInstance.post('/api/create-food', foodData); // Verwende axiosInstance
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Speise:', error);
      throw error;
    }
  },

  //option
  fetchOption: async () => {
    try {
      const response = await axiosInstance.get('/api/fetch-option');
      return response.data as Option[];
    } catch (error) {
      console.error('Fehler beim Abrufen der Option:', error);
      throw error;
    }
  },

};

export default Apis;