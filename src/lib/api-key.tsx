const envApiKey: string | undefined = import.meta.env.VITE_LANGSMITH_API_KEY;

export function getApiKey(): string | null {
  let storedApiKey: string | null = null;

  try {
    // Check localStorage first (user override or previous setting)
    if (typeof window !== "undefined") {
      storedApiKey = window.localStorage.getItem("lg:chat:apiKey");
    }
  } catch (e) {
    console.warn("Could not access localStorage for API key:", e);
  }

  // Return the stored key if found, otherwise fall back to the environment variable
  return storedApiKey || envApiKey || null; 
}
