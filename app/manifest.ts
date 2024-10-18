import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Haloweave Jobs',
    short_name: 'Haloweave',
    description: 'AI-powered job application management platform',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    // iOS specific properties are added using type assertion
  } as MetadataRoute.Manifest & {
    apple_mobile_web_app_capable: 'yes';
    apple_mobile_web_app_status_bar_style: 'default';
    apple_mobile_web_app_title: 'Haloweave';
  }
}