"use client";
import dynamic from 'next/dynamic';

export const Code = dynamic(() => import('lucide-react').then(mod => mod.Code), { ssr: false });
export const Eye = dynamic(() => import('lucide-react').then(mod => mod.Eye), { ssr: false });
export const EyeOff = dynamic(() => import('lucide-react').then(mod => mod.EyeOff), { ssr: false });
export const ExternalLink = dynamic(() => import('lucide-react').then(mod => mod.ExternalLink), { ssr: false });
export const Bookmark = dynamic(() => import('lucide-react').then(mod => mod.Bookmark), { ssr: false });
export const Folder = dynamic(() => import('lucide-react').then(mod => mod.Folder), { ssr: false });
export const Trash2 = dynamic(() => import('lucide-react').then(mod => mod.Trash2), { ssr: false });
export const ArrowLeft = dynamic(() => import('lucide-react').then(mod => mod.ArrowLeft), { ssr: false });
export const ArrowRight = dynamic(() => import('lucide-react').then(mod => mod.ArrowRight), { ssr: false });
export const Search = dynamic(() => import('lucide-react').then(mod => mod.Search), { ssr: false });
export const LogOut = dynamic(() => import('lucide-react').then(mod => mod.LogOut), { ssr: false });
export const Copy = dynamic(() => import('lucide-react').then(mod => mod.Copy), { ssr: false });