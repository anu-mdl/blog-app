'use client';

import PocketBase from 'pocketbase';

export function initializePocketBaseAuth() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(cookie =>
      cookie.trim().startsWith('pb_auth_client=')
    );

    if (authCookie) {
      try {
        const cookieValue = decodeURIComponent(authCookie.split('=')[1]);
        const authData = JSON.parse(cookieValue);

        pb.authStore.save(authData.token, authData.model);
      } catch (error) {
        console.error('Error loading auth from cookie:', error);
      }
    }
  }

  return pb;
}
