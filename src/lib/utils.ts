import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getAuth () {
  const res = await fetch("/api/req_auth", {
    method: "GET"
  });

  const url = await res.json();

  console.log(url);

  return;
}

export async function getToken () {
  const res = await fetch("/api/get_token", {
    method: "POST"
  });

  const token = await res.json();

  console.log(token);

  return;
}

export async function testSqlite() {
  const res = await fetch("/api/test_sqlite");
  return;
}

export async function redirectToSpotifyAuth() {
  window.location.href = "/api/to_spotify_auth";
  return;
}

export async function catchAuthResponse() {

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