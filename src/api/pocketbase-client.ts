'use client';

import PocketBase from 'pocketbase';
import { TypedPocketBase } from './api_types';
import Cookies from 'js-cookie';

export function pocketbaseClient() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL) as TypedPocketBase;
  pb.autoCancellation(false);

  const authCookie = Cookies.get('pb_auth_client');

  if (authCookie) {
    try {
      const authData = JSON.parse(decodeURIComponent(authCookie));
      pb.authStore.save(authData.token, authData.model);
    } catch (error) {
      console.error('Error parsing client auth cookie:', error);
    }
  }

  return pb;
}
