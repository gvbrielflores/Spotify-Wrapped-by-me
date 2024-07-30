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

export async function redirectToSpotifyAuth() {
  window.location.href = "/api/to-spotify-auth";
}

export async function getBaseUrl() {
  if (process.env.NODE_ENV === 'production') {
    return 'https://gabis-wrapped.vercel.app'; //make sure not to have extra '/' at the end
  }
  else if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  else {
    return 'test';
  }
}

export async function topTenArtists(interval: String) {
  if (interval !== 'short_term' && interval !== 'medium_term' && interval !== 'long_term') {
    console.error('Invalid interval for top ten');
  }
  const topTenReq = new URL('/api/top-ten-artists', await getBaseUrl());
  topTenReq.searchParams.append('interval', interval.toString());
  const res = await fetch(topTenReq);
  return res;
}

export async function testRoute(){
  const res = await fetch("/api/test-route");
}