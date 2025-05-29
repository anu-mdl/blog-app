'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PocketBase, { ClientResponseError } from 'pocketbase';

export const isLoggedIn = async () => {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  return pb.authStore.isValid as unknown as Promise<boolean>;
};

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('pb_auth');

  if (!authCookie?.value) {
    return null;
  }

  try {
    const authData = JSON.parse(authCookie.value);
    return authData.model;
  } catch (error) {
    console.error('Error parsing auth cookie:', error);
    return null;
  }
}
export const logout = async () => {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  pb.authStore.clear();
};

// interface FormData {
//   email: string;
//   password: string;
// }

export async function authenticateUser(formData: FormData) {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const authData = await pb
      .collection('users')
      .authWithPassword(email, password);

    const authCookieValue = JSON.stringify({
      token: authData.token,
      model: authData.record
    });

    const cookieStore = await cookies();
    cookieStore.set({
      name: 'pb_auth',
      value: authCookieValue,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });

    cookieStore.set({
      name: 'pb_auth_client',
      value: authCookieValue,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });

    return {
      success: true,
      error: null,
      author: authData.record,
      authData: {
        token: authData.token,
        model: authData.record
      }
    };
  } catch (error) {
    console.error('Error during authentication:', error);

    let message = 'Произошла непредвиденная ошибка';
    if (error instanceof ClientResponseError) {
      switch (error.status) {
        case 400:
          message = 'Неверный email или пароль';
          break;
        case 500:
          message = 'Ошибка сервера. Попробуйте позже';
          break;
        default:
          message = 'Ошибка аутентификации';
      }
    } else if (error instanceof Error) {
      message = 'Ошибка сети. Проверьте подключение';
    }

    return { success: false, error: message };
  }
}
