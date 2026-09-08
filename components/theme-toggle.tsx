'use client';
import {useEffect,useState,useRef} from 'react';
import {Monitor,Moon,Sun} from 'lucide-react';
import {DropdownMenu,DropdownMenuTrigger,DropdownMenuContent,DropdownMenuRadioGroup,DropdownMenuRadioItem} from '@/components/ui/dropdown-menu';
type Theme = 'system'|'light'|'dark';
const key='balance-pocket-theme';
function preference():Theme {try{const value=localStorage.getItem(key);if(value==='light'||value==='dark')return value;}catch{}return 'system';}
export default function ThemeToggle(){
 const [theme,setTheme]=useState<Theme>('system');
 const current=useRef<Theme>('system');
 useEffect(()=>{
  const media=window.matchMedia('(prefers-color-scheme: dark)');
  const apply=(value:Theme)=>{current.current=value;setTheme(value);const dark=value==='dark'||(value==='system'&&media.matches);document.documentElement.dataset.theme=dark?'dark':'light';document.querySelector('meta[name="theme-color"]')?.setAttribute('content',dark?'#0d1523':'#f3f6fa');};
  apply(preference());
  const sync=()=>apply(current.current);
  const storage=(event:StorageEvent)=>{if(event.key===key||event.key===null)apply(preference());};
  media.addEventListener('change',sync);window.addEventListener('storage',storage);
  return()=>{media.removeEventListener('change',sync);window.removeEventListener('storage',storage);};
 },[]);
 function choose(value:unknown){if(value!=='system'&&value!=='light'&&value!=='dark')return;current.current=value;setTheme(value);try{localStorage.setItem(key,value);}catch{}
  // Apply immediately even when the browser refuses preference storage.
  const dark=value==='dark'||(value==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme=dark?'dark':'light';document.querySelector('meta[name="theme-color"]')?.setAttribute('content',dark?'#0d1523':'#f3f6fa');
 }
 const Icon=theme==='system'?Monitor:theme==='dark'?Moon:Sun;
 return <DropdownMenu><DropdownMenuTrigger className="theme-toggle" aria-label={`Theme: ${theme}. Change appearance`} title={`Theme: ${theme}`}><Icon size={20}/></DropdownMenuTrigger><DropdownMenuContent align="end" className="theme-menu"><DropdownMenuRadioGroup value={theme} onValueChange={choose} aria-label="Appearance"><DropdownMenuRadioItem value="system"><Monitor/>System</DropdownMenuRadioItem><DropdownMenuRadioItem value="light"><Sun/>Light</DropdownMenuRadioItem><DropdownMenuRadioItem value="dark"><Moon/>Dark</DropdownMenuRadioItem></DropdownMenuRadioGroup></DropdownMenuContent></DropdownMenu>;
}
