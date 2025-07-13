import { create } from "zustand";
import axiosInstance from "../utils/axiosInstance";

const API_URL = "/categories";

export const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: "",

  // GET categories
  fetchCategories: async () => {
    set({ loading: true, error: "" });
    try {
      const response = await axiosInstance.get(API_URL);
      set({ categories: response.data, loading: false });
    } catch (error) {
      set({
        error: "Failed to fetch categories",
        loading: false,
      });
      console.error(error);
    }
  },
}));
