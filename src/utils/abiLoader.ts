
export const loadABI = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al cargar ABI desde ${url}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw new Error("No se pudo cargar el ABI.");
    }
  };
  