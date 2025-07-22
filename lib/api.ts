// frontend/lib/api.ts
const API_BASE_URL = "http://localhost:8000/api"; // atau https jika sudah SSL

export async function fetchFromAPI(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`)

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}
