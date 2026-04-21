import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        catalogue: resolve(__dirname, 'catalogue.html'),
        coaching: resolve(__dirname, 'coaching.html'),
        tarifs: resolve(__dirname, 'tarifs.html'),
        about: resolve(__dirname, 'about.html'),
        faq: resolve(__dirname, 'faq.html'),
        contact: resolve(__dirname, 'contact.html'),
        login: resolve(__dirname, 'login.html'),
        game: resolve(__dirname, 'game.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        demander: resolve(__dirname, 'demander-formation.html'),
        mentions: resolve(__dirname, 'mentions.html'),
        cgu: resolve(__dirname, 'cgu.html'),
        cgv: resolve(__dirname, 'cgv.html'),
        'access-code': resolve(__dirname, 'access-code.html'),
        'admin-access': resolve(__dirname, 'admin-access.html'),
        'admin-apprenants': resolve(__dirname, 'admin-apprenants.html'),
        'admin-dashboard': resolve(__dirname, 'admin-dashboard.html'),
        'admin-demandes': resolve(__dirname, 'admin-demandes.html'),
        'admin-editor': resolve(__dirname, 'admin-editor.html'),
        'admin-export': resolve(__dirname, 'admin-export.html'),
        'admin-formateurs': resolve(__dirname, 'admin-formateurs.html'),
        'admin-hero': resolve(__dirname, 'admin-hero.html'),
        'admin-pages': resolve(__dirname, 'admin-pages.html'),
        'admin-promotions': resolve(__dirname, 'admin-promotions.html'),
        'admin-results': resolve(__dirname, 'admin-results.html'),
        'admin-sessions': resolve(__dirname, 'admin-sessions.html'),
        'admin-simulations': resolve(__dirname, 'admin-simulations.html'),
        'admin-stats': resolve(__dirname, 'admin-stats.html'),
        'admin-users': resolve(__dirname, 'admin-users.html'),
        'admin-vedettes': resolve(__dirname, 'admin-vedettes.html'),
        'admin-coaching': resolve(__dirname, 'admin-coaching.html'),
        'admin-tarifs': resolve(__dirname, 'admin-tarifs.html'),
        'admin-faq': resolve(__dirname, 'admin-faq.html'),
      }
    }
  }
})
