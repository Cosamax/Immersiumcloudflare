// Immersium Site Worker - Serves static files via Workers Assets API
// ASSETS binding is configured in wrangler.toml

export default {
    async fetch(request, env) {
          return env.ASSETS.fetch(request);
    }
};
