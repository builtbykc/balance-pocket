import {deflateSync} from 'node:zlib';
import {writeFileSync} from 'node:fs';
function crc(b){let c=0xffffffff;for(const v of b){c^=v;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;}
function chunk(name,data){const t=Buffer.from(name),out=Buffer.alloc(data.length+12);out.writeUInt32BE(data.length);t.copy(out,4);data.copy(out,8);out.writeUInt32BE(crc(Buffer.concat([t,data])),8+data.length);return out;}
function icon(size){const pixels=Buffer.alloc(size*(size*4+1));for(let y=0;y<size;y++)for(let x=0;x<size;x++){const sx=x/size,sy=y/size;const stem=sx>.30&&sx<.40&&sy>.24&&sy<.70;const ring=((sx-.465)**2+(sy-.55)**2<.16**2)&&((sx-.465)**2+(sy-.55)**2>.067**2)&&sx>.35;const dot=(sx-.69)**2+(sy-.655)**2<.035**2;const on=stem||ring||dot;const o=y*(size*4+1)+1+x*4;pixels[o]=on?255:23;pixels[o+1]=on?255:41;pixels[o+2]=on?255:65;pixels[o+3]=255;}
 const h=Buffer.alloc(13);h.writeUInt32BE(size);h.writeUInt32BE(size,4);h[8]=8;h[9]=6;return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',h),chunk('IDAT',deflateSync(pixels)),chunk('IEND',Buffer.alloc(0))]);}
for(const [size,name] of [[192,'icon-192.png'],[512,'icon-512.png'],[180,'apple-touch-icon.png']])writeFileSync('public/'+name,icon(size));
