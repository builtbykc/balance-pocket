export const groups = ['Liquid assets', 'Receivables', 'Investments', 'Credit cards'] as const;
export type Group = typeof groups[number];
export type Account = {id:string;name:string;group:Group;cents:number|null;updatedAt:string|null;note:string;archived:boolean};
export type Snapshot = {id:string;at:string;accounts:Account[]};
export type Ledger = {version:1;revision:number;accounts:Account[];snapshots:Snapshot[]};
export const money = (cents:number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents/100);
export function newLedger():Ledger {return {version:1,revision:0,accounts:[],snapshots:[]};}
export function parseAmount(input:string):number|null {
 const s=input.trim(); if(!s)return null;
 if(!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$/.test(s))throw Error('Enter an amount with up to two decimal places, such as 1234.56.');
 const value=Math.round(Number(s.replaceAll(',',''))*100);
 if(!Number.isSafeInteger(value)||Math.abs(value)>1e12)throw Error('Amount must be under $10 billion.');
 return value;
}
export function totals(accounts:Account[]) {
 const active=accounts.filter(a=>!a.archived); const assets=active.filter(a=>a.group!=='Credit cards').reduce((s,a)=>s+(a.cents??0),0);
 const debt=active.filter(a=>a.group==='Credit cards').reduce((s,a)=>s+(a.cents??0),0);
 return {assets,debt,net:assets-debt,missing:active.filter(a=>a.cents===null).length};
}
export function recordSnapshot(ledger:Ledger, accounts:Account[], at=new Date().toISOString()):Ledger {
 return {...ledger,accounts,snapshots:[...ledger.snapshots,{id:crypto.randomUUID(),at,accounts:accounts.map(a=>({...a}))}]};
}
function validDate(v:unknown):v is string {return typeof v==='string'&&/^\d{4}-\d\d-\d\dT/.test(v)&&Number.isFinite(Date.parse(v));}
export function validateLedger(raw:unknown):Ledger {
 const fail=()=>{throw Error('This is not a valid Balance Pocket backup. Your current data has not changed.');};
 if(!raw||typeof raw!=='object')return fail();
 const r=raw as Ledger;
 if(r.version!==1||!Number.isSafeInteger(r.revision)||r.revision<0||!Array.isArray(r.accounts)||!Array.isArray(r.snapshots)||r.snapshots.length>20000)return fail();
 function accounts(rows:Account[]) {
  if(!Array.isArray(rows)||rows.length>500)return fail(); const ids=new Set();
  return rows.map(a=>{
   if(!a||typeof a.id!=='string'||a.id.length>100||ids.has(a.id)||typeof a.name!=='string'||!a.name.trim()||a.name.length>80||!groups.includes(a.group)||!(a.cents===null||(Number.isSafeInteger(a.cents)&&Math.abs(a.cents)<=1e12))||!(a.updatedAt===null||validDate(a.updatedAt))||typeof a.note!=='string'||a.note.length>1000||typeof a.archived!=='boolean')return fail();
   ids.add(a.id); return {id:a.id,name:a.name,group:a.group,cents:a.cents,updatedAt:a.updatedAt,note:a.note,archived:a.archived};
  });
 }
 const seen=new Set();let previous=0;
 const snapshots=r.snapshots.map(s=>{if(!s||typeof s.id!=='string'||s.id.length>100||seen.has(s.id)||!validDate(s.at)||Date.parse(s.at)<previous)return fail();seen.add(s.id);previous=Date.parse(s.at);return {id:s.id,at:s.at,accounts:accounts(s.accounts)};});
 return {version:1,revision:r.revision,accounts:accounts(r.accounts),snapshots};
}
export function csv(ledger:Ledger):string {
 const quote=(v:unknown)=>'"'+String(v).replace(/^[=+@\t\r]/,"'$&").replaceAll('"','""')+'"';
 const rows:unknown[][]=[['Snapshot date','Account','Category','Balance (USD)','Last checked','Archived','Note']];
 for(const s of ledger.snapshots)for(const a of s.accounts)rows.push([s.at,a.name,a.group,a.cents===null?'':(a.cents/100).toFixed(2),a.updatedAt??'',a.archived?'Yes':'No',a.note]);
 if(!ledger.snapshots.length)for(const a of ledger.accounts)rows.push(['Current',a.name,a.group,a.cents===null?'':(a.cents/100).toFixed(2),a.updatedAt??'',a.archived?'Yes':'No',a.note]);
 return '\uFEFF'+rows.map(r=>r.map(quote).join(',')).join('\r\n');
}
