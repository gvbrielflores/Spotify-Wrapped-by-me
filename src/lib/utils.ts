import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { webcrypto } from "crypto";

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

export async function generateRandomString(length: number) {
  const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = webcrypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + pool[x % pool.length],'');
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
    return 'https://gabis-wrapped.vercel.app'
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

export async function testRoute(){
  const res = await fetch("/api/test-route");
}