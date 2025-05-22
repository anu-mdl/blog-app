import PocketBase from "pocketbase";

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";

export const pb = new PocketBase(POCKETBASE_URL);

// (опционально) настраиваем автологин из cookie при SSR/SSG
if (typeof window !== "undefined" && pb.authStore.isValid) {
  pb.authStore.loadFromCookie(document.cookie);
}