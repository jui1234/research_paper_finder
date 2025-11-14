import {useEffect,useState} from "react";
export function useDebounce<T>(value:T, delay=300){
  const [deb,setDeb] = useState(value);
  useEffect(()=>{ const id = setTimeout(()=>setDeb(value), delay); return ()=>clearTimeout(id); }, [value,delay]);
  return deb;
}
