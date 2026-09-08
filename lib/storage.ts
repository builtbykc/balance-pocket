import {newLedger,validateLedger,type Ledger} from './ledger';
let connection:Promise<IDBDatabase>|undefined;
function db() {return connection??=new Promise<IDBDatabase>((resolve,reject)=>{
 const r=indexedDB.open('balance-pocket',1);
 r.onupgradeneeded=()=>r.result.createObjectStore('ledger');
 r.onsuccess=()=>{r.result.onversionchange=()=>{r.result.close();connection=undefined;};resolve(r.result);};
 r.onerror=()=>{connection=undefined;reject(Error('Device storage is unavailable. Open in regular Safari and try again.'));};
 r.onblocked=()=>{connection=undefined;reject(Error('Close other copies of Balance Pocket, then reload.'));};
});}
export async function readLedger():Promise<Ledger> {const d=await db();return new Promise((resolve,reject)=>{const r=d.transaction('ledger').objectStore('ledger').get('main');r.onsuccess=()=>{try{resolve(r.result?validateLedger(r.result):newLedger());}catch(e){reject(e);}};r.onerror=()=>reject(r.error);});}
export async function writeLedger(next:Ledger,expectedRevision:number):Promise<Ledger> {
 validateLedger(next);const d=await db();return new Promise((resolve,reject)=>{
 const tx=d.transaction('ledger','readwrite');const store=tx.objectStore('ledger');const r=store.get('main');let conflict=false;
 const saved={...next,revision:expectedRevision+1};
 r.onsuccess=()=>{if((r.result?.revision??0)!==expectedRevision){conflict=true;tx.abort();return;}store.put(saved,'main');};
 tx.oncomplete=()=>resolve(saved);
 tx.onabort=()=>reject(Error(conflict?'Another copy has newer changes. Reload this app before saving.':'Could not save to this device. Your previous data is safe. Export a backup and free some device space.'));
 tx.onerror=()=>{};
 });
}
