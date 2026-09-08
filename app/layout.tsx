import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = { title:'Balance Pocket', description:'Your personal balance sheet, saved on this device.', manifest:'/manifest.webmanifest', appleWebApp:{capable:true,statusBarStyle:'default',title:'Balance'}, icons:{icon:'/icon-192.png',apple:'/apple-touch-icon.png'} };
export const viewport: Viewport = {width:'device-width',initialScale:1,viewportFit:'cover',themeColor:'#172941'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>) {return <html lang="en" suppressHydrationWarning><head><script src="/theme.js" /></head><body>{children}</body></html>}
