import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getToken () {
  const res = await fetch("/api/get-token", {
    method: "POST"
  });

  const token = await res.json();

  console.log(token);

  return;
}

export async function testSqlite() {
  const res = await fetch("/api/test-sqlite");
  return;
}

export async function redirectToSpotifyAuth() {
  window.location.href = "/api/to-spotify-auth";
  return;
}

export async function getBaseUrl() {
  if (process.env.NODE_ENV === 'production') {
    return 'https://gabis-wrapped-knb2w07mg-gabriel-floreslovos-projects.vercel.app'
  }
  else if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }
  else {
    return 'test'
  }
}

export async function topTenArtistsOneMonth() {
  const res = await fetch("/api/top-ten-artists-one-month");
  return res;
}