import { create } from 'zustand';

const useProjectStore = create((set) => ({
  projects: [],
  isLoading: false,
  error: null,

  addProject: (project) => set((state) => {
    const exists = state.projects.some((p) => p.id === project.id);
    if (exists) {
      return { projects: state.projects };
    }
    return { projects: [...state.projects, project] };
  }),

  setProjects: (projects) => set({ projects }),

  clearProjects: () => set({ projects: [] }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}));

export default useProjectStore;
