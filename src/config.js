/**
 * Application configuration
 * Centralizes environment-dependent settings
 */

const config = {
  apiUrl: process.env.GATSBY_API_URL || "https://api.petadex.net/api",
}

export default config
