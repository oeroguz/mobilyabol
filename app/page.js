"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { supabase } from "../lib/supabase";

const CATS = {
  "Oturma Grubu":["Koltuk Takımı","Köşe Koltuk","Tekli Koltuk / Berjer","TV Ünitesi","Sehpa","Kitaplık","Puf / Minder","Aksesuarlar"],
  "Yatak Odası":["Yatak Odası Takımı","Karyola / Baza","Şifonyer / Komodin","Gardırop","Yatak Başlığı","Aksesuarlar"],
  "Yemek Odası":["Yemek Odası Takımı","Yemek Masası","Sandalye","Konsol / Vitrin / Büfe"],
  "Genç / Çocuk Odası":["Genç Odası Takımı","Çocuk Odası Takımı","Bebek Odası Takımı","Ranza","Çalışma Masası"],
  "Mutfak":["Mutfak Masa Takımı","Mutfak Dolabı","Sandalye","Aksesuarlar"],
  "Banyo Mobilyası":["Banyo Dolabı","Aksesuarlar"],
  "Bahçe / Balkon":["Oturma Grubu","Şemsiye","Aksesuarlar"],
  "Ofis Mobilyası":["Ofis Masası","Ofis Koltuğu","Aksesuarlar"],
  "Ev Tekstili":["Halı / Kilim","Perde","Yatak Örtüsü / Nevresim"],
  "Aksesuar / Dekorasyon":["Ayna","Portmanto / Askılık","Dekoratif","Kapı"],
  "Aydınlatma":["Aydınlatma"],
};
const MC=Object.keys(CATS);
const CI={"Oturma Grubu":"🛋️","Yatak Odası":"🛏️","Yemek Odası":"🪑","Genç / Çocuk Odası":"🧒","Mutfak":"🍳","Banyo Mobilyası":"🚿","Bahçe / Balkon":"🌿","Ofis Mobilyası":"💼","Ev Tekstili":"🟫","Aksesuar / Dekorasyon":"🪞","Aydınlatma":"💡"};
const CD={
  "İstanbul":["Masko","Modoko","Kadıköy","Beşiktaş","Bakırköy","Ataşehir","Üsküdar","Beylikdüzü","Bağcılar","Başakşehir","Pendik","Kartal","Maltepe","Şişli","Fatih","Zeytinburnu","Esenyurt","Avcılar","Tuzla"],
  "Ankara":["Siteler","Çankaya","Keçiören","Mamak","Etimesgut","Sincan","Yenimahalle","Altındağ","Pursaklar","Gölbaşı"],
  "İzmir":["Bornova","Konak","Karşıyaka","Buca","Bayraklı","Çiğli","Gaziemir","Torbalı","Menemen"],
  "Bursa":["Nilüfer","Osmangazi","Yıldırım","İnegöl","Gemlik","Mudanya","Kestel","Gürsu"],
  "Antalya":["Muratpaşa","Konyaaltı","Kepez","Alanya","Manavgat","Serik","Kaş","Kemer"],
  "Konya":["Selçuklu","Meram","Karatay","Ereğli","Akşehir","Beyşehir"],
  "Kayseri":["Melikgazi","Kocasinan","Talas","İncesu","Develi","Hacılar"],
  "Trabzon":["Ortahisar","Akçaabat","Araklı","Of","Yomra","Sürmene"],
};
const CTS=Object.keys(CD);
const mkLogo=(txt,bg,fg)=>`data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" rx="16" fill="${bg}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="28" fill="${fg}">${txt}</text></svg>`)}`;
const ST=[
  {id:"s1",name:"Ahşap Sanat Mobilya",phone:"0532 111 22 33",logo:mkLogo("AS","#2C1810","#FFBE98"),locations:[{label:"Masko Mağaza",city:"İstanbul",district:"Masko",url:"https://maps.google.com/?q=41.0,28.9"},{label:"Modoko Şube",city:"İstanbul",district:"Modoko",url:"https://maps.google.com/?q=40.9,29.1"}]},
  {id:"s2",name:"Dekor Evi",phone:"0533 444 55 66",logo:mkLogo("DE","#D08A60","#fff"),locations:[{label:"Siteler Mağaza",city:"Ankara",district:"Siteler",url:"https://maps.google.com/?q=39.9,32.8"}]},
  {id:"s3",name:"Zen Yaşam",phone:"0535 222 33 44",logo:mkLogo("ZY","#1A1210","#FFBE98"),locations:[{label:"Bornova Mağaza",city:"İzmir",district:"Bornova",url:"https://maps.google.com/?q=38.4,27.2"}]},
  {id:"s4",name:"Usta Mobilya",phone:"0534 777 88 99",logo:mkLogo("UM","#E8A07A","#fff"),locations:[{label:"Nilüfer Mağaza",city:"Bursa",district:"Nilüfer",url:"https://maps.google.com/?q=40.2,28.9"},{label:"Osmangazi Şube",city:"Bursa",district:"Osmangazi",url:"https://maps.google.com/?q=40.1,29.0"}]},
];
const P0=[
  {id:"p1",sid:"s1",name:"Ceviz Koltuk Takımı",mc:"Oturma Grubu",sc:"Koltuk Takımı",price:45000,old:52000,desc:"Masif ceviz iskelet, kuştüyü minder, 3+3+1",imgs:["🛋️"]},
  {id:"p2",sid:"s1",name:"Chester Koltuk",mc:"Oturma Grubu",sc:"Tekli Koltuk / Berjer",price:38000,desc:"Hakiki deri, kapitoneli chester",imgs:["💺"]},
  {id:"p3",sid:"s1",name:"Meşe Yemek Masası",mc:"Yemek Odası",sc:"Yemek Masası",price:28000,desc:"6 kişilik uzayabilen meşe masa",imgs:["🪑"]},
  {id:"p4",sid:"s2",name:"Nordic Yatak Odası",mc:"Yatak Odası",sc:"Yatak Odası Takımı",price:62000,old:71000,desc:"İskandinav tarzı komple set",imgs:["🛏️"]},
  {id:"p5",sid:"s2",name:"Minimalist TV Ünitesi",mc:"Oturma Grubu",sc:"TV Ünitesi",price:12000,desc:"Duvar montajlı, LED aydınlatmalı",imgs:["📺"]},
  {id:"p6",sid:"s2",name:"Ofis Masa Seti",mc:"Ofis Mobilyası",sc:"Ofis Masası",price:15000,desc:"L masa + çekmece + raf",imgs:["💼"]},
  {id:"p7",sid:"s3",name:"Bambu Bahçe Seti",mc:"Bahçe / Balkon",sc:"Oturma Grubu",price:22000,desc:"4 kişilik bahçe oturma grubu",imgs:["🌿"]},
  {id:"p8",sid:"s3",name:"Doğal Taş Sehpa",mc:"Oturma Grubu",sc:"Sehpa",price:8500,desc:"Traverten mermer üst, meşe ayak",imgs:["☕"]},
  {id:"p9",sid:"s3",name:"Boy Aynası",mc:"Aksesuar / Dekorasyon",sc:"Ayna",price:4200,desc:"160cm boy aynası, meşe çerçeve",imgs:["🪞"]},
  {id:"p10",sid:"s4",name:"Lüks L Köşe Koltuk",mc:"Oturma Grubu",sc:"Köşe Koltuk",price:35000,old:42000,desc:"L köşe koltuk, yataklı",imgs:["🛋️"]},
  {id:"p11",sid:"s4",name:"Genç Odası Seti",mc:"Genç / Çocuk Odası",sc:"Genç Odası Takımı",price:32000,desc:"Yatak + masa + dolap + raf",imgs:["🧒"]},
  {id:"p12",sid:"s4",name:"Mutfak Köşe Takımı",mc:"Mutfak",sc:"Mutfak Masa Takımı",price:9800,desc:"Bank tipi oturma + masa",imgs:["🍳"]},
  {id:"p13",sid:"s1",name:"Ceviz Kitaplık",mc:"Oturma Grubu",sc:"Kitaplık",price:11500,desc:"5 raflı masif ceviz kitaplık",imgs:["📚"]},
  {id:"p14",sid:"s2",name:"Sürgülü Gardırop",mc:"Yatak Odası",sc:"Gardırop",price:18500,desc:"Aynalı sürgülü kapak",imgs:["🚪"]},
  {id:"p15",sid:"s3",name:"Salon Halısı",mc:"Ev Tekstili",sc:"Halı / Kilim",price:6800,desc:"200x300cm modern desen",imgs:["🟫"]},
  {id:"p16",sid:"s4",name:"Modern Avize",mc:"Aydınlatma",sc:"Aydınlatma",price:3200,desc:"5 kollu modern LED avize",imgs:["💡"]},
];
const fmt=n=>new Intl.NumberFormat("tr-TR").format(n)+" ₺";
const sC=s=>s?.locations?.map(l=>l.city).filter((v,i,a)=>a.indexOf(v)===i).join(", ")||"";
const isI=s=>typeof s==="string"&&s.startsWith("data:");

function Logo({size=28,light=false}){
  const c=light?"#fff":"#2C1810";const sc=light?"#FFBE98":"#E8A07A";
  return(<div style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer"}}>
    <svg width={size*.9} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M1 16 L14 3 L27 16" fill="none" stroke={sc} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="7" y1="18" x2="7" y2="24" stroke={sc} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="21" y1="18" x2="21" y2="24" stroke={sc} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="7" y1="24" x2="21" y2="24" stroke={sc} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
    <span style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:size*.72,color:c,letterSpacing:"-1px"}}>mobilya<span style={{color:sc}}>bol</span></span>
  </div>);
}

function ProductCard({p,stores,favs,onFav,onDetail}){
  const s=stores.find(x=>x.id===p.sid);const th=p.imgs?.[0]||"📦";
  return(<div className="card" onClick={()=>onDetail(p)}>
    <div style={{height:160,background:"linear-gradient(135deg,#FFF3EB,#E2E8F0)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
      {isI(th)?<img src={th} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:"3.5rem"}}>{th}</span>}
      {p.imgs?.length>1&&<span style={{position:"absolute",bottom:8,right:8,background:"rgba(15,23,42,.6)",color:"#fff",fontSize:".65rem",padding:"2px 8px",borderRadius:6,fontWeight:600}}>+{p.imgs.length-1} foto</span>}
      {p.old&&<span style={{position:"absolute",top:8,left:8,background:"#EF4444",color:"#fff",fontSize:".65rem",fontWeight:700,padding:"3px 8px",borderRadius:6}}>%{Math.round((1-p.price/p.old)*100)}</span>}
      <button onClick={e=>{e.stopPropagation();onFav(p.id);}} style={{position:"absolute",top:8,right:8,width:32,height:32,borderRadius:"50%",border:"none",background:"rgba(255,255,255,.9)",cursor:"pointer",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>{favs.includes(p.id)?"❤️":"🤍"}</button>
    </div>
    <div style={{padding:"12px 14px"}}>
      <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:2}}>{s?.logo&&isI(s.logo)?<img src={s.logo} alt="" style={{width:14,height:14,borderRadius:3,objectFit:"cover"}}/>:null}<p style={{fontSize:".68rem",color:"#94A3B8"}}>{s?.name} • {sC(s)}</p></div>
      <p style={{fontSize:".7rem",color:"#E8A07A",marginBottom:4}}>{p.mc} › {p.sc}</p>
      <h3 style={{fontFamily:"'Sora',sans-serif",fontSize:".92rem",fontWeight:700,color:"#2C1810",marginBottom:6,lineHeight:1.3}}>{p.name}</h3>
      <div style={{display:"flex",alignItems:"baseline",gap:6}}><span style={{fontFamily:"'Sora',sans-serif",fontSize:"1.05rem",fontWeight:800,color:"#E8A07A"}}>{fmt(p.price)}</span>{p.old&&<span style={{fontSize:".75rem",color:"#94A3B8",textDecoration:"line-through"}}>{fmt(p.old)}</span>}</div>
    </div>
  </div>);
}

export default function App(){
  const[pg,setPg]=useState("home");
  const[user,setUser]=useState(null);
  const[loading,setLoading]=useState(true);

  // Oturum kontrolü
  useEffect(()=>{
    const getSession=async()=>{
      const{data:{session}}=await supabase.auth.getSession();
      if(session){
        const{data:profile}=await supabase.from("profiles").select("*").eq("id",session.user.id).single();
        if(profile)setUser({...profile,email:session.user.email});
      }
      setLoading(false);
    };
    getSession();
    const{data:{subscription}}=supabase.auth.onAuthStateChange(async(event,session)=>{
      if(event==="SIGNED_IN"&&session){
        const{data:profile}=await supabase.from("profiles").select("*").eq("id",session.user.id).single();
        if(profile)setUser({...profile,email:session.user.email});
      }
      if(event==="SIGNED_OUT"){setUser(null);setPg("home");}
    });
    return()=>subscription.unsubscribe();
  },[]);
  const[modal,setModal]=useState(null);
  const[fm,setFm]=useState({name:"",email:"",pw:"",city:"İstanbul",firm:"",phone:"",locs:[],logo:""});
  const[err,setErr]=useState("");
  const[favs,setFavs]=useState([]);
  const[mcF,setMcF]=useState(null);
  const[scF,setScF]=useState(null);
  const[cityF,setCityF]=useState("");
  const[q,setQ]=useState("");
  const[det,setDet]=useState(null);
  const[dImg,setDImg]=useState(0);
  const[sv,setSv]=useState(null);
  const[prods,setProds]=useState(P0);
  const[pm,setPm]=useState("list");
  const[pcF,setPcF]=useState(null);
  const[eid,setEid]=useState(null);
  const[pf,setPf]=useState({name:"",mc:MC[0],sc:CATS[MC[0]][0],price:"",desc:"",imgs:[]});
  const[sf,setSf]=useState({name:"",city:"",pw:"",pw2:"",phone:"",logo:"",locs:[]});
  const[cf,setCf]=useState({name:"",email:"",topic:"Genel",msg:""});
  const[cfOk,setCfOk]=useState(false);
  const sendCf=async()=>{if(!cf.name||!cf.email||!cf.msg){setErr("Tüm alanları doldur");return;}setErr("");
    await supabase.from("messages").insert({name:cf.name,email:cf.email,topic:cf.topic,message:cf.msg});
    setCfOk(true);setCf({name:"",email:"",topic:"Genel",msg:""});
  };
  // Admin
  const[sApps,setSApps]=useState([]); // mağaza başvuruları
  const[msgs,setMsgs]=useState([]); // iletişim mesajları
  const[admTab,setAdmTab]=useState("prods"); // prods | stores | msgs
  const fRef=useRef(null);
  const lRef=useRef(null);
  const slRef=useRef(null);
  const onLogo=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setFm(p=>({...p,logo:ev.target.result}));r.readAsDataURL(f);e.target.value="";};
  const onSLogo=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setSf(p=>({...p,logo:ev.target.result}));r.readAsDataURL(f);e.target.value="";};

  const filt=useMemo(()=>{let r=prods.filter(p=>!p.status||p.status==="approved");if(mcF)r=r.filter(p=>p.mc===mcF);if(scF)r=r.filter(p=>p.sc===scF);if(cityF)r=r.filter(p=>{const s=ST.find(x=>x.id===p.sid);return s?.locations?.some(l=>l.city===cityF);});if(q){const ql=q.toLowerCase();r=r.filter(p=>p.name.toLowerCase().includes(ql)||p.desc?.toLowerCase().includes(ql)||p.mc.toLowerCase().includes(ql)||p.sc.toLowerCase().includes(ql));}if(sv)r=r.filter(p=>p.sid===sv);return r;},[prods,mcF,scF,cityF,q,sv]);

  const tFav=id=>{if(!user){setModal("login");return;}setFavs(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);};
  const gs=id=>{const base=ST.find(s=>s.id===id);if(!base)return null;if(user?.type==="store"&&user.sid===id)return{...base,name:user.name,phone:user.phone||base.phone,logo:user.logo||base.logo||"",locations:user.locs?.length?user.locs:base.locations};return base;};
  const goL=(m=null,s=null)=>{setMcF(m);setScF(s);setSv(null);setDet(null);setPg("list");};
  const resetFm=()=>setFm({name:"",email:"",pw:"",city:"İstanbul",firm:"",phone:"",locs:[],logo:""});
  const closeM=()=>{setModal(null);setErr("");resetFm();};
  const openDet=(p)=>{setDet(p);setDImg(0);setPg("detail");};

  const doLogin=async()=>{if(!fm.email||!fm.pw){setErr("Email ve şifre gir");return;}
    setErr("");
    const{error}=await supabase.auth.signInWithPassword({email:fm.email,password:fm.pw});
    if(error){setErr(error.message==="Invalid login credentials"?"Email veya şifre hatalı":error.message);return;}
    closeM();
  };
  const doRegister=async()=>{if(!fm.name||!fm.email||!fm.pw){setErr("Tüm alanları doldur");return;}
    setErr("");
    const{data,error}=await supabase.auth.signUp({email:fm.email,password:fm.pw});
    if(error){setErr(error.message);return;}
    if(data.user){
      await supabase.from("profiles").insert({id:data.user.id,name:fm.name,email:fm.email,city:fm.city,role:"user"});
      setUser({id:data.user.id,name:fm.name,email:fm.email,city:fm.city,role:"user"});
    }
    closeM();
  };
  const doSLogin=async()=>{if(!fm.email||!fm.pw){setErr("Email ve şifre gir");return;}
    setErr("");
    const{error}=await supabase.auth.signInWithPassword({email:fm.email,password:fm.pw});
    if(error){setErr(error.message==="Invalid login credentials"?"Email veya şifre hatalı":error.message);return;}
    closeM();setPg("panel");
  };
  const doSRegister=()=>{if(!fm.firm||!fm.email||!fm.pw||!fm.phone){setErr("Zorunlu alanları doldur");return;}setSApps(p=>[...p,{id:"sa_"+Date.now(),name:fm.firm,email:fm.email,phone:fm.phone,locs:fm.locs,logo:fm.logo,date:new Date().toLocaleDateString("tr-TR"),status:"pending"}]);closeM();setModal("sRegInfo");};
  const openSettings=()=>{if(!user)return;setSf({name:user.name,city:user.city||"İstanbul",pw:"",pw2:"",phone:user.phone||"",logo:user.logo||"",locs:user.locs||[]});setModal("settings");};
  const saveSettings=async()=>{if(!sf.name){setErr("Ad boş olamaz");return;}if(sf.pw&&sf.pw!==sf.pw2){setErr("Şifreler eşleşmiyor");return;}
    if(user.id){await supabase.from("profiles").update({name:sf.name,city:sf.city}).eq("id",user.id);}
    if(sf.pw){await supabase.auth.updateUser({password:sf.pw});}
    setUser(u=>({...u,name:sf.name,city:sf.city,phone:sf.phone,logo:sf.logo,locs:sf.locs}));closeM();
  };
  const onImgs=e=>{Array.from(e.target.files).forEach(f=>{const r=new FileReader();r.onload=ev=>setPf(p=>({...p,imgs:[...p.imgs,ev.target.result]}));r.readAsDataURL(f);});e.target.value="";};
  const saveProd=()=>{if(!pf.name||!pf.price)return;const im=pf.imgs.length?pf.imgs:[CI[pf.mc]||"📦"];if(eid)setProds(p=>p.map(x=>x.id===eid?{...x,name:pf.name,mc:pf.mc,sc:pf.sc,price:Number(pf.price),desc:pf.desc,imgs:im,status:"pending"}:x));else setProds(p=>[...p,{id:"p_"+Date.now(),sid:user?.sid||"s1",name:pf.name,mc:pf.mc,sc:pf.sc,price:Number(pf.price),desc:pf.desc,imgs:im,status:"pending"}]);setPf({name:"",mc:MC[0],sc:CATS[MC[0]][0],price:"",desc:"",imgs:[]});setEid(null);setPm("list");};
  const editP=p=>{setPf({name:p.name,mc:p.mc,sc:p.sc,price:String(p.price),desc:p.desc||"",imgs:p.imgs||[]});setEid(p.id);setPm("edit");};

  const CSS=`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{background:#FAF6F2}input,textarea,select{font-family:'Plus Jakarta Sans',sans-serif}.card{background:#fff;border-radius:16px;border:1px solid #E2E8F0;overflow:hidden;cursor:pointer;transition:transform .25s,box-shadow .25s}.card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(30,41,59,.08)}.btn{padding:12px 28px;border-radius:10px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;font-size:.9rem;transition:all .2s;border:none}.b1{background:linear-gradient(135deg,#E8A07A,#D08A60);color:#fff;box-shadow:0 4px 16px rgba(91,163,217,.25)}.b1:hover{box-shadow:0 6px 24px rgba(91,163,217,.35)}.b2{background:transparent;color:#E8A07A;border:2px solid #E8A07A}.inp{width:100%;padding:12px 16px;border-radius:10px;border:2px solid #E2E8F0;font-size:.9rem;outline:none;background:#FAFBFD;color:#2C1810}.inp:focus{border-color:#E8A07A}@keyframes fu{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes fi{from{opacity:0}to{opacity:1}}.ch{padding:6px 14px;border-radius:8px;font-size:.8rem;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;white-space:nowrap;border:2px solid #E2E8F0;background:#fff;color:#64748B;transition:all .15s}.ch.a{border-color:#E8A07A;background:#FFF3EB;color:#E8A07A}.lb{font-size:.78rem;font-weight:600;color:#64748B;display:block;margin-bottom:4px}.divider{display:flex;align-items:center;gap:12px;margin:16px 0;color:#94A3B8;font-size:.78rem}.divider::before,.divider::after{content:'';flex:1;height:1px;background:#E2E8F0}`;

  // All modal content rendered inline
  const mHead=(t)=>(<div style={{textAlign:"center",marginBottom:20}}><Logo size={30}/><h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.3rem",fontWeight:800,color:"#2C1810",marginTop:12}}>{t}</h2></div>);
  const errEl=err?<p style={{color:"#EF4444",fontSize:".8rem",marginTop:8,textAlign:"center"}}>{err}</p>:null;

  const locFields=(fm.locs||[]).map((loc,i)=>(<div key={i} style={{background:"#FFF3EB",borderRadius:12,padding:"12px 14px",marginBottom:8,border:"1px solid #E2E8F0"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:".75rem",fontWeight:700,color:"#E8A07A"}}>Mağaza {i+1}</span><button onClick={()=>{const l=[...fm.locs];l.splice(i,1);setFm(p=>({...p,locs:l}));}} style={{background:"none",border:"none",color:"#EF4444",cursor:"pointer",fontSize:".75rem",fontWeight:600}}>Kaldır</button></div>
    <input className="inp" placeholder="Mağaza adı (ör: Masko Şube)" value={loc.label} onChange={e=>{const l=[...fm.locs];l[i]={...l[i],label:e.target.value};setFm(p=>({...p,locs:l}));}} style={{marginBottom:6}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:6}}>
      <select className="inp" value={loc.city||"İstanbul"} onChange={e=>{const l=[...fm.locs];l[i]={...l[i],city:e.target.value,district:""};setFm(p=>({...p,locs:l}));}}>{CTS.map(c=><option key={c}>{c}</option>)}</select>
      <select className="inp" value={loc.district||""} onChange={e=>{const l=[...fm.locs];l[i]={...l[i],district:e.target.value};setFm(p=>({...p,locs:l}));}}><option value="">İlçe Seçin</option>{(CD[loc.city||"İstanbul"]||[]).map(d=><option key={d}>{d}</option>)}</select>
    </div>
    <input className="inp" placeholder="Google Maps linki (opsiyonel)" value={loc.url||""} onChange={e=>{const l=[...fm.locs];l[i]={...l[i],url:e.target.value};setFm(p=>({...p,locs:l}));}}/>
  </div>));

  const renderModal=()=>{
    if(!modal)return null;
    const overlay=(ch)=>(<div onClick={closeM} style={{position:"fixed",inset:0,background:"rgba(15,23,42,.4)",backdropFilter:"blur(8px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20,animation:"fi .2s"}}><div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:24,padding:"32px 28px",maxWidth:460,width:"100%",maxHeight:"90vh",overflowY:"auto"}}>{ch}</div></div>);

    if(modal==="login") return overlay(<>{mHead("Giriş Yap")}
      <label className="lb">Email</label><input className="inp" placeholder="ornek@email.com" value={fm.email} onChange={e=>setFm(p=>({...p,email:e.target.value}))}/><div style={{height:10}}/>
      <label className="lb">Şifre</label><input className="inp" type="password" placeholder="••••••" value={fm.pw} onChange={e=>setFm(p=>({...p,pw:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&doLogin()}/>
      {errEl}<button className="btn b1" onClick={doLogin} style={{width:"100%",marginTop:16}}>Giriş Yap</button>
      <div className="divider">veya</div>
      <p style={{textAlign:"center",fontSize:".85rem",color:"#64748B"}}>Hesabın yok mu? <span onClick={()=>{setErr("");setModal("register");}} style={{color:"#E8A07A",cursor:"pointer",fontWeight:700}}>Kayıt Ol</span></p>
      <div style={{background:"#FFF3EB",borderRadius:12,padding:"12px 16px",marginTop:12,textAlign:"center"}}>
        <p style={{fontSize:".82rem",color:"#64748B"}}>Mağaza hesabınız mı var? <span onClick={()=>{setErr("");setModal("sLogin");}} style={{color:"#E8A07A",cursor:"pointer",fontWeight:700}}>Mağaza Girişi →</span></p>
      </div>
      <p style={{textAlign:"center",marginTop:8,fontSize:".72rem",color:"#94A3B8"}}>Gerçek email adresi ile kayıt olun</p>
    </>);

    if(modal==="register") return overlay(<>{mHead("Kayıt Ol")}
      <label className="lb">Ad Soyad *</label><input className="inp" placeholder="Adınız Soyadınız" value={fm.name} onChange={e=>setFm(p=>({...p,name:e.target.value}))}/><div style={{height:10}}/>
      <label className="lb">Şehir *</label><select className="inp" value={fm.city} onChange={e=>setFm(p=>({...p,city:e.target.value}))}>{CTS.map(c=><option key={c}>{c}</option>)}</select><div style={{height:10}}/>
      <label className="lb">Email *</label><input className="inp" placeholder="ornek@email.com" value={fm.email} onChange={e=>setFm(p=>({...p,email:e.target.value}))}/><div style={{height:10}}/>
      <label className="lb">Şifre *</label><input className="inp" type="password" placeholder="••••••" value={fm.pw} onChange={e=>setFm(p=>({...p,pw:e.target.value}))}/>
      {errEl}<button className="btn b1" onClick={doRegister} style={{width:"100%",marginTop:16}}>Kayıt Ol</button>
      <div className="divider">veya</div>
      <p style={{textAlign:"center",fontSize:".85rem",color:"#64748B"}}>Zaten hesabın var mı? <span onClick={()=>{setErr("");setModal("login");}} style={{color:"#E8A07A",cursor:"pointer",fontWeight:700}}>Giriş Yap</span></p>
      <div style={{background:"#FFF3EB",borderRadius:12,padding:"14px 16px",marginTop:16,textAlign:"center"}}>
        <p style={{fontSize:".82rem",color:"#64748B"}}>Mobilya mağazanız mı var?</p>
        <span onClick={()=>{setErr("");setModal("sRegister");}} style={{color:"#E8A07A",cursor:"pointer",fontWeight:700,fontSize:".85rem"}}>Mağaza Hesabı Aç →</span>
      </div>
    </>);

    if(modal==="sLogin") return overlay(<>{mHead("Mağaza Girişi")}
      <label className="lb">Email</label><input className="inp" placeholder="ornek@email.com" value={fm.email} onChange={e=>setFm(p=>({...p,email:e.target.value}))}/><div style={{height:10}}/>
      <label className="lb">Şifre</label><input className="inp" type="password" placeholder="••••••" value={fm.pw} onChange={e=>setFm(p=>({...p,pw:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&doSLogin()}/>
      {errEl}<button className="btn b1" onClick={doSLogin} style={{width:"100%",marginTop:16}}>Giriş Yap</button>
      <div className="divider">veya</div>
      <p style={{textAlign:"center",fontSize:".85rem",color:"#64748B"}}>Mağaza hesabın yok mu? <span onClick={()=>{setErr("");setModal("sRegister");}} style={{color:"#E8A07A",cursor:"pointer",fontWeight:700}}>Mağaza Aç</span></p>
    </>);

    if(modal==="sRegister") return overlay(<>{mHead("Mağaza Hesabı Aç")}
      <label className="lb" style={{marginBottom:6}}>Mağaza Logosu</label>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
        <div onClick={()=>lRef.current?.click()} style={{width:64,height:64,borderRadius:12,border:"2px dashed #E2E8F0",background:"#FAFBFD",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}>
          {fm.logo?<img src={fm.logo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{color:"#E8A07A",fontSize:".7rem",fontWeight:600,textAlign:"center",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>📷 Logo</span>}
        </div>
        {fm.logo&&<button onClick={()=>setFm(p=>({...p,logo:""}))} style={{background:"none",border:"none",color:"#EF4444",cursor:"pointer",fontSize:".75rem",fontWeight:600}}>Kaldır</button>}
        <input ref={lRef} type="file" accept="image/*" onChange={onLogo} style={{display:"none"}}/>
      </div>
      <label className="lb">Firma Adı *</label><input className="inp" placeholder="Mobilya Diyarı A.Ş." value={fm.firm} onChange={e=>setFm(p=>({...p,firm:e.target.value}))}/><div style={{height:10}}/>
      <label className="lb">Telefon (WhatsApp) *</label><input className="inp" placeholder="0532 000 00 00" value={fm.phone} onChange={e=>setFm(p=>({...p,phone:e.target.value}))}/><div style={{height:10}}/>
      <label className="lb" style={{marginBottom:6}}>Mağaza Konumları</label>
      {locFields}
      <button onClick={()=>setFm(p=>({...p,locs:[...p.locs,{label:"",city:"İstanbul",district:"",url:""}]}))} style={{background:"none",border:"2px dashed #E2E8F0",borderRadius:10,padding:"8px 16px",color:"#E8A07A",fontSize:".8rem",fontWeight:600,cursor:"pointer",width:"100%",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>+ Mağaza Ekle</button><div style={{height:10}}/>
      <label className="lb">Email *</label><input className="inp" placeholder="ornek@email.com" value={fm.email} onChange={e=>setFm(p=>({...p,email:e.target.value}))}/><div style={{height:10}}/>
      <label className="lb">Şifre *</label><input className="inp" type="password" placeholder="••••••" value={fm.pw} onChange={e=>setFm(p=>({...p,pw:e.target.value}))}/>
      {errEl}<button className="btn b1" onClick={doSRegister} style={{width:"100%",marginTop:16}}>Mağaza Hesabı Oluştur</button>
      <div className="divider">veya</div>
      <p style={{textAlign:"center",fontSize:".85rem",color:"#64748B"}}>Zaten mağaza hesabın var mı? <span onClick={()=>{setErr("");setModal("sLogin");}} style={{color:"#E8A07A",cursor:"pointer",fontWeight:700}}>Giriş Yap</span></p>
    </>);

    if(modal==="settings") return overlay(<>{mHead("Hesap Ayarları")}
      {user?.type==="store"&&<>
        <label className="lb" style={{marginBottom:6}}>Mağaza Logosu</label>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <div onClick={()=>slRef.current?.click()} style={{width:64,height:64,borderRadius:12,border:"2px dashed #E2E8F0",background:"#FAFBFD",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}>
            {sf.logo?<img src={sf.logo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{color:"#E8A07A",fontSize:".7rem",fontWeight:600,textAlign:"center",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>📷 Logo</span>}
          </div>
          {sf.logo&&<button onClick={()=>setSf(p=>({...p,logo:""}))} style={{background:"none",border:"none",color:"#EF4444",cursor:"pointer",fontSize:".75rem",fontWeight:600}}>Kaldır</button>}
          <input ref={slRef} type="file" accept="image/*" onChange={onSLogo} style={{display:"none"}}/>
        </div>
      </>}
      <label className="lb">{user?.type==="store"?"Firma Adı":"Ad Soyad"}</label><input className="inp" value={sf.name} onChange={e=>setSf(p=>({...p,name:e.target.value}))}/><div style={{height:10}}/>
      {user?.type==="user"&&<><label className="lb">Şehir</label><select className="inp" value={sf.city} onChange={e=>setSf(p=>({...p,city:e.target.value}))}>{CTS.map(c=><option key={c}>{c}</option>)}</select><div style={{height:10}}/></>}
      {user?.type==="store"&&<>
        <label className="lb">Telefon (WhatsApp)</label><input className="inp" value={sf.phone} onChange={e=>setSf(p=>({...p,phone:e.target.value}))}/><div style={{height:10}}/>
        <label className="lb" style={{marginBottom:6}}>Mağaza Konumları</label>
        {(sf.locs||[]).map((loc,i)=>(<div key={i} style={{background:"#FFF3EB",borderRadius:12,padding:"12px 14px",marginBottom:8,border:"1px solid #E2E8F0"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:".75rem",fontWeight:700,color:"#E8A07A"}}>Mağaza {i+1}</span><button onClick={()=>{const l=[...sf.locs];l.splice(i,1);setSf(p=>({...p,locs:l}));}} style={{background:"none",border:"none",color:"#EF4444",cursor:"pointer",fontSize:".75rem",fontWeight:600}}>Kaldır</button></div>
          <input className="inp" placeholder="Mağaza adı" value={loc.label} onChange={e=>{const l=[...sf.locs];l[i]={...l[i],label:e.target.value};setSf(p=>({...p,locs:l}));}} style={{marginBottom:6}}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:6}}>
            <select className="inp" value={loc.city||"İstanbul"} onChange={e=>{const l=[...sf.locs];l[i]={...l[i],city:e.target.value,district:""};setSf(p=>({...p,locs:l}));}}>{CTS.map(c=><option key={c}>{c}</option>)}</select>
            <select className="inp" value={loc.district||""} onChange={e=>{const l=[...sf.locs];l[i]={...l[i],district:e.target.value};setSf(p=>({...p,locs:l}));}}><option value="">İlçe Seçin</option>{(CD[loc.city||"İstanbul"]||[]).map(d=><option key={d}>{d}</option>)}</select>
          </div>
          <input className="inp" placeholder="Google Maps linki (opsiyonel)" value={loc.url||""} onChange={e=>{const l=[...sf.locs];l[i]={...l[i],url:e.target.value};setSf(p=>({...p,locs:l}));}}/>
        </div>))}
        <button onClick={()=>setSf(p=>({...p,locs:[...p.locs,{label:"",city:"İstanbul",district:"",url:""}]}))} style={{background:"none",border:"2px dashed #E2E8F0",borderRadius:10,padding:"8px 16px",color:"#E8A07A",fontSize:".8rem",fontWeight:600,cursor:"pointer",width:"100%",fontFamily:"'Plus Jakarta Sans',sans-serif",marginBottom:10}}>+ Mağaza Ekle</button>
      </>}
      <div style={{height:1,background:"#E2E8F0",margin:"14px 0"}}/>
      <p style={{fontSize:".82rem",fontWeight:600,color:"#2C1810",marginBottom:10}}>Şifre Değiştir</p>
      <label className="lb">Yeni Şifre</label><input className="inp" type="password" placeholder="Boş bırakırsan değişmez" value={sf.pw} onChange={e=>setSf(p=>({...p,pw:e.target.value}))}/><div style={{height:10}}/>
      <label className="lb">Yeni Şifre (Tekrar)</label><input className="inp" type="password" placeholder="Tekrar gir" value={sf.pw2} onChange={e=>setSf(p=>({...p,pw2:e.target.value}))}/>
      {errEl}<div style={{display:"flex",gap:8,marginTop:16}}><button className="btn b1" onClick={saveSettings} style={{flex:1}}>Kaydet</button><button className="btn b2" onClick={closeM} style={{flex:1}}>İptal</button></div>
    </>);

    if(modal==="sRegInfo") return overlay(<><div style={{textAlign:"center",padding:"12px 0"}}>
      <p style={{fontSize:"2rem",marginBottom:12}}>📋</p>
      <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.2rem",fontWeight:800,color:"#2C1810",marginBottom:8}}>Başvurunuz Alındı</h2>
      <p style={{color:"#8B7B6E",fontSize:".88rem",lineHeight:1.6,marginBottom:20}}>Mağaza başvurunuz incelemeye alınmıştır. Onaylandığında email ile bilgilendirileceksiniz.</p>
      <button className="btn b1" onClick={closeM}>Tamam</button>
    </div></>);

    return null;
  };

  const s=det?gs(det.sid):null;
  const wp=s?`https://wa.me/90${s.phone.replace(/\s/g,"").replace(/^0/,"")}?text=${encodeURIComponent(`Merhaba, Mobilyabol'da "${det?.name}" (${fmt(det?.price||0)}) ürününüzü gördüm. Bilgi alabilir miyim?`)}`:"#";
  const ims=det?.imgs||["📦"];const cur=ims[dImg]||ims[0];
  const sid=user?.sid||"s1";const myP=prods.filter(p=>p.sid===sid);const panFilt=pcF?myP.filter(p=>p.mc===pcF):myP;const cc={};myP.forEach(p=>{cc[p.mc]=(cc[p.mc]||0)+1;});

  if(loading)return(<div style={{minHeight:"100vh",background:"#FAF6F2",display:"flex",alignItems:"center",justifyContent:"center"}}><style>{CSS}</style><Logo size={40}/></div>);

  return(<div style={{minHeight:"100vh",background:"#FAF6F2",fontFamily:"'Plus Jakarta Sans',sans-serif"}}><style>{CSS}</style>
    {renderModal()}

    {/* NAV */}
    <nav style={{background:"rgba(255,255,255,.95)",backdropFilter:"blur(12px)",borderBottom:"1px solid #E2E8F0",position:"sticky",top:0,zIndex:100,padding:"0 20px"}}><div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:58,gap:12,flexWrap:"wrap"}}>
      <div onClick={()=>{setPg("home");setMcF(null);setScF(null);setQ("");setDet(null);setSv(null);setCityF("");}}><Logo size={30}/></div>
      <input value={q} onChange={e=>{setQ(e.target.value);if(e.target.value){setPg("list");setDet(null);}}} placeholder="Mobilya ara..." style={{padding:"8px 14px",borderRadius:10,border:"2px solid #E2E8F0",fontSize:".85rem",width:200,outline:"none",background:"#FAFBFD",fontFamily:"'Plus Jakarta Sans',sans-serif"}}/>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {user&&<button onClick={()=>setPg("favs")} style={{background:"none",border:"none",cursor:"pointer",fontSize:"1.1rem"}}>❤️ <span style={{fontSize:".75rem",color:"#E8A07A",fontWeight:700}}>{favs.length}</span></button>}
        {user?(<div style={{display:"flex",alignItems:"center",gap:8}}>
          <select className="inp" value={cityF} onChange={e=>{setCityF(e.target.value);if(pg==="home"||pg==="list"){setPg("list");setDet(null);}}} style={{width:"auto",padding:"6px 10px",fontSize:".8rem",borderRadius:8,minWidth:100}}>
            <option value="">Tüm İller</option>{CTS.map(c=><option key={c}>{c}</option>)}
          </select>
          <span onClick={openSettings} style={{fontSize:".82rem",color:"#64748B",fontWeight:500,cursor:"pointer",borderBottom:"1px dashed #E8A07A"}}>{user.name}</span>
          {user.type==="store"&&<button className="btn b2" onClick={()=>{setPg("panel");setPm("list");}} style={{padding:"6px 14px",fontSize:".78rem"}}>Panel</button>}
          {user.type==="admin"&&<button className="btn b2" onClick={()=>{setPg("admin");setAdmTab("prods");}} style={{padding:"6px 14px",fontSize:".78rem",borderColor:"#E8A07A",color:"#E8A07A"}}>⚙️ Admin</button>}
          <button onClick={async()=>{await supabase.auth.signOut();setUser(null);setPg("home");}} style={{background:"none",border:"none",color:"#94A3B8",cursor:"pointer",fontSize:".78rem"}}>Çıkış</button>
        </div>):(<div style={{display:"flex",alignItems:"center",gap:6}}>
          <select className="inp" value={cityF} onChange={e=>{setCityF(e.target.value);if(pg==="home"||pg==="list"){setPg("list");setDet(null);}}} style={{width:"auto",padding:"6px 10px",fontSize:".8rem",borderRadius:8,minWidth:100}}>
            <option value="">Tüm İller</option>{CTS.map(c=><option key={c}>{c}</option>)}
          </select>
          <button className="btn b2" onClick={()=>setModal("login")} style={{padding:"7px 16px",fontSize:".82rem"}}>Giriş</button>
          <button className="btn b1" onClick={()=>setModal("register")} style={{padding:"7px 16px",fontSize:".82rem"}}>Kayıt Ol</button>
        </div>)}
      </div>
    </div></nav>

    {/* HOME */}
    {pg==="home"&&<div style={{animation:"fu .5s"}}>
      <div style={{background:"linear-gradient(160deg,#1A1210,#2C1810)",padding:"28px 20px",textAlign:"center"}}>
        <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:"clamp(1.4rem,3.5vw,2rem)",fontWeight:800,color:"#fff",lineHeight:1.2}}>Mobilya Aramanın <span style={{color:"#FFBE98"}}>En Kolay Yolu</span></h1>
      </div>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"16px 20px 0"}}><h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1rem",fontWeight:700,color:"#2C1810",marginBottom:8}}>Kategoriler</h2>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{MC.map(c=><button key={c} className="ch" onClick={()=>goL(c)} style={{display:"flex",alignItems:"center",gap:4,padding:"6px 12px"}}><span style={{fontSize:"1rem"}}>{CI[c]}</span><span style={{fontSize:".75rem"}}>{c}</span></button>)}</div>
      </div>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"14px 20px 48px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><h2 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.1rem",fontWeight:700,color:"#2C1810"}}>Öne Çıkanlar</h2><span onClick={()=>goL()} style={{color:"#E8A07A",fontSize:".85rem",fontWeight:600,cursor:"pointer"}}>Tümünü Gör →</span></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16}}>{prods.slice(0,8).map(p=><ProductCard key={p.id} p={p} stores={ST} favs={favs} onFav={tFav} onDetail={openDet}/>)}</div>
      </div>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 20px 48px"}}><div style={{background:"linear-gradient(135deg,#1A1210,#2C1810)",borderRadius:20,padding:"40px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:20}}><div><h3 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.3rem",fontWeight:800,color:"#fff"}}>Mağazanızı Açın</h3><p style={{color:"rgba(255,255,255,.5)",marginTop:6,maxWidth:380,lineHeight:1.5,fontSize:".9rem"}}>Ürünlerinizi kolayca sergileyin, müşterilerinize ulaşın.</p></div><button className="btn b1" onClick={()=>setModal("sRegister")} style={{padding:"14px 32px"}}>Ücretsiz Dene →</button></div></div>
      <footer style={{background:"#1A1210",padding:"32px 20px",textAlign:"center"}}><Logo size={24} light/><div style={{marginTop:12}}><span onClick={()=>{setPg("contact");setCfOk(false);setErr("");setCf({name:user?.name||"",email:user?.email||"",topic:"Genel",msg:""});}} style={{color:"rgba(255,255,255,.4)",fontSize:".8rem",cursor:"pointer",fontWeight:500}}>İletişim</span></div><p style={{color:"rgba(255,255,255,.2)",fontSize:".75rem",marginTop:8}}>© 2026 Mobilyabol</p></footer>
    </div>}

    {/* LIST */}
    {pg==="list"&&<div style={{maxWidth:1100,margin:"0 auto",padding:"28px 20px",animation:"fu .4s"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div><h1 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.4rem",fontWeight:800,color:"#2C1810"}}>{sv?gs(sv)?.name:scF||mcF||(q?`"${q}" sonuçları`:"Tüm Ürünler")}</h1><p style={{color:"#94A3B8",fontSize:".85rem"}}>{filt.length} ürün</p></div>
        <div style={{display:"flex",gap:6}}>{(mcF||scF||sv)&&<button className="ch" onClick={()=>{setMcF(null);setScF(null);setSv(null);}} style={{color:"#EF4444",borderColor:"#EF4444"}}>✕ Temizle</button>}</div>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:mcF?0:14}}><button className={`ch ${!mcF?"a":""}`} onClick={()=>{setMcF(null);setScF(null);}}>Tümü</button>{MC.map(c=><button key={c} className={`ch ${mcF===c?"a":""}`} onClick={()=>{setMcF(c);setScF(null);}}>{CI[c]} {c}</button>)}</div>
      {mcF&&CATS[mcF]&&<><div style={{height:1,background:"#E2E8F0",margin:"10px 0"}}/><div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}><button className={`ch ${!scF?"a":""}`} onClick={()=>setScF(null)} style={{fontSize:".75rem"}}>Tümü</button>{CATS[mcF].map(sc=><button key={sc} className={`ch ${scF===sc?"a":""}`} onClick={()=>setScF(sc)} style={{fontSize:".75rem"}}>{sc}</button>)}</div></>}
      {filt.length===0?<p style={{textAlign:"center",padding:40,color:"#94A3B8"}}>Sonuç bulunamadı 🔍</p>:<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16}}>{filt.map(p=><ProductCard key={p.id} p={p} stores={ST} favs={favs} onFav={tFav} onDetail={openDet}/>)}</div>}
    </div>}

    {/* DETAIL */}
    {pg==="detail"&&det&&<div style={{maxWidth:800,margin:"0 auto",padding:"28px 20px",animation:"fu .4s"}}>
      <button onClick={()=>{setDet(null);setPg("list");}} style={{background:"none",border:"none",color:"#E8A07A",cursor:"pointer",fontSize:".9rem",fontWeight:600,marginBottom:16}}>← Geri</button>
      <div style={{background:"#fff",borderRadius:20,border:"1px solid #E2E8F0",overflow:"hidden"}}>
        <div style={{height:300,background:"linear-gradient(135deg,#FFF3EB,#E2E8F0)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
          {isI(cur)?<img src={cur} alt="" style={{width:"100%",height:"100%",objectFit:"contain"}}/>:<span style={{fontSize:"5rem"}}>{cur}</span>}
          {ims.length>1&&<><button onClick={()=>setDImg(i=>i>0?i-1:ims.length-1)} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,.85)",border:"none",cursor:"pointer",fontSize:"1.1rem"}}>‹</button><button onClick={()=>setDImg(i=>i<ims.length-1?i+1:0)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,.85)",border:"none",cursor:"pointer",fontSize:"1.1rem"}}>›</button><div style={{position:"absolute",bottom:10,left:"50%",transform:"translateX(-50%)",display:"flex",gap:4}}>{ims.map((_,i)=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:i===dImg?"#E8A07A":"rgba(15,23,42,.15)",cursor:"pointer"}} onClick={()=>setDImg(i)}/>)}</div></>}
        </div>
        {ims.length>1&&<div style={{display:"flex",gap:6,padding:"10px 20px",overflowX:"auto"}}>{ims.map((img,i)=><div key={i} onClick={()=>setDImg(i)} style={{width:56,height:56,borderRadius:8,border:i===dImg?"2px solid #E8A07A":"2px solid #E2E8F0",background:"#FFF3EB",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",flexShrink:0}}>{isI(img)?<img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:"1.5rem"}}>{img}</span>}</div>)}</div>}
        <div style={{padding:"24px 28px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><p style={{fontSize:".78rem",color:"#E8A07A",marginBottom:4,cursor:"pointer"}} onClick={()=>goL(det.mc,det.sc)}>{det.mc} › {det.sc}</p><h1 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.6rem",fontWeight:800,color:"#2C1810"}}>{det.name}</h1></div><button onClick={()=>tFav(det.id)} style={{background:"none",border:"none",fontSize:"1.5rem",cursor:"pointer"}}>{favs.includes(det.id)?"❤️":"🤍"}</button></div>
          <div style={{display:"flex",alignItems:"baseline",gap:10,marginTop:8}}><span style={{fontFamily:"'Sora',sans-serif",fontSize:"1.5rem",fontWeight:800,color:"#E8A07A"}}>{fmt(det.price)}</span>{det.old&&<span style={{fontSize:".9rem",color:"#94A3B8",textDecoration:"line-through"}}>{fmt(det.old)}</span>}</div>
          {det.desc&&<p style={{color:"#64748B",marginTop:14,lineHeight:1.6}}>{det.desc}</p>}
          {s&&<div style={{marginTop:20,padding:16,background:"#FFF3EB",borderRadius:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}><div style={{display:"flex",alignItems:"center",gap:10}}>{s.logo&&isI(s.logo)?<img src={s.logo} alt="" style={{width:40,height:40,borderRadius:10,objectFit:"cover",border:"1px solid #E2E8F0"}}/>:<div style={{width:40,height:40,borderRadius:10,background:"#FFF3EB",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",flexShrink:0}}>🏪</div>}<div><p style={{fontWeight:700,color:"#2C1810",fontSize:".9rem"}}>{s.name}</p><p style={{color:"#94A3B8",fontSize:".8rem"}}>{sC(s)} • {s.phone}</p></div></div><div style={{display:"flex",gap:8}}><a href={wp} target="_blank" rel="noopener noreferrer" className="btn b1" style={{padding:"10px 20px",fontSize:".85rem",textDecoration:"none"}}>💬 WhatsApp</a><button className="btn b2" onClick={()=>{setSv(s.id);setPg("list");setDet(null);}} style={{padding:"10px 16px",fontSize:".85rem"}}>Mağazayı Gör</button></div></div>
            {s.locations?.length>0&&<div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #E2E8F0"}}><p style={{fontSize:".75rem",fontWeight:600,color:"#64748B",marginBottom:8}}>📍 Mağaza Konumları</p><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{s.locations.map((loc,i)=><a key={i} href={loc.url} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,padding:"6px 12px",background:"#fff",borderRadius:8,border:"1px solid #E2E8F0",fontSize:".8rem",color:"#2C1810",textDecoration:"none",fontWeight:500}} onMouseEnter={e=>{e.currentTarget.style.borderColor="#E8A07A";e.currentTarget.style.color="#E8A07A";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#E2E8F0";e.currentTarget.style.color="#2C1810";}}>📍 {loc.label} — {loc.city}/{loc.district}</a>)}</div></div>}
          </div>}
        </div>
      </div>
    </div>}

    {/* FAVS */}
    {pg==="favs"&&<div style={{maxWidth:1100,margin:"0 auto",padding:"28px 20px",animation:"fu .4s"}}><h1 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.4rem",fontWeight:800,color:"#2C1810",marginBottom:16}}>❤️ Favorilerim ({favs.length})</h1>{prods.filter(p=>favs.includes(p.id)).length===0?<p style={{color:"#94A3B8",textAlign:"center",padding:40}}>Henüz favori eklemediniz</p>:<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16}}>{prods.filter(p=>favs.includes(p.id)).map(p=><ProductCard key={p.id} p={p} stores={ST} favs={favs} onFav={tFav} onDetail={openDet}/>)}</div>}</div>}

    {/* PANEL */}
    {pg==="panel"&&<div style={{maxWidth:960,margin:"0 auto",padding:"28px 20px",animation:"fu .4s"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><div style={{display:"flex",alignItems:"center",gap:10}}>
        {user?.logo&&isI(user.logo)?<img src={user.logo} alt="" style={{width:36,height:36,borderRadius:8,objectFit:"cover",border:"1px solid #E2E8F0"}}/>:<div style={{width:36,height:36,borderRadius:8,background:"#FFF3EB",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem"}}>🏪</div>}
        <div><h1 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.2rem",fontWeight:800,color:"#2C1810"}}>{user?.name||"Mağaza Paneli"}</h1><p style={{color:"#94A3B8",fontSize:".78rem"}}>{myP.length} ürün{user?.phone?` • ${user.phone}`:""}</p></div>
      </div><div style={{display:"flex",gap:6}}>{pm==="list"&&<><button className="btn b2" onClick={openSettings} style={{padding:"8px 14px",fontSize:".78rem"}}>⚙️ Düzenle</button><button className="btn b1" onClick={()=>{setPm("add");setEid(null);setPf({name:"",mc:MC[0],sc:CATS[MC[0]][0],price:"",desc:"",imgs:[]});}} style={{padding:"8px 16px",fontSize:".85rem"}}>+ Ürün Ekle</button></>}</div></div>
      {pm==="list"&&user?.locs?.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>{user.locs.map((loc,i)=><span key={i} style={{padding:"4px 10px",borderRadius:6,background:"#FFF3EB",fontSize:".75rem",color:"#E8A07A",fontWeight:600}}>📍 {loc.label||`Mağaza ${i+1}`} — {loc.city}/{loc.district}</span>)}</div>}

      {(pm==="add"||pm==="edit")&&<div style={{background:"#fff",borderRadius:16,border:"1px solid #E2E8F0",padding:24}}>
        <h3 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.1rem",fontWeight:700,color:"#2C1810",marginBottom:14}}>{eid?"Ürünü Düzenle":"Yeni Ürün"}</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div><label className="lb">Ana Kategori *</label><select className="inp" value={pf.mc} onChange={e=>setPf(p=>({...p,mc:e.target.value,sc:CATS[e.target.value][0]}))}>{MC.map(c=><option key={c}>{c}</option>)}</select></div>
          <div><label className="lb">Alt Kategori *</label><select className="inp" value={pf.sc} onChange={e=>setPf(p=>({...p,sc:e.target.value}))}>{(CATS[pf.mc]||[]).map(c=><option key={c}>{c}</option>)}</select></div>
          <div><label className="lb">Ürün Adı *</label><input className="inp" value={pf.name} onChange={e=>setPf(p=>({...p,name:e.target.value}))}/></div>
          <div><label className="lb">Fiyat (₺) *</label><input className="inp" type="number" value={pf.price} onChange={e=>setPf(p=>({...p,price:e.target.value}))}/></div>
        </div>
        <div style={{marginTop:12}}><label className="lb">Açıklama</label><textarea className="inp" rows={2} value={pf.desc} onChange={e=>setPf(p=>({...p,desc:e.target.value}))}/></div>
        <div style={{marginTop:14}}>
          <label className="lb" style={{marginBottom:6}}>Ürün Fotoğrafları</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {pf.imgs.map((img,i)=><div key={i} style={{width:80,height:80,borderRadius:10,border:"2px solid #E2E8F0",overflow:"hidden",position:"relative",background:"#FFF3EB",display:"flex",alignItems:"center",justifyContent:"center"}}>{isI(img)?<img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:"2rem"}}>{img}</span>}<button onClick={()=>setPf(p=>({...p,imgs:p.imgs.filter((_,j)=>j!==i)}))} style={{position:"absolute",top:2,right:2,width:20,height:20,borderRadius:"50%",background:"rgba(239,68,68,.9)",color:"#fff",border:"none",cursor:"pointer",fontSize:".65rem",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button></div>)}
            <button onClick={()=>fRef.current?.click()} style={{width:80,height:80,borderRadius:10,border:"2px dashed #E2E8F0",background:"#FAFBFD",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,color:"#E8A07A",fontSize:".7rem",fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>📷<span>Ekle</span></button>
          </div>
          <input ref={fRef} type="file" accept="image/*" multiple onChange={onImgs} style={{display:"none"}}/>
          <p style={{fontSize:".7rem",color:"#94A3B8",marginTop:4}}>Birden fazla fotoğraf yükleyebilirsiniz</p>
        </div>
        <div style={{display:"flex",gap:8,marginTop:16}}><button className="btn b1" onClick={saveProd}>{eid?"Kaydet":"Ürünü Ekle"}</button><button className="btn b2" onClick={()=>{setPm("list");setEid(null);setPf({name:"",mc:MC[0],sc:CATS[MC[0]][0],price:"",desc:"",imgs:[]});}}>İptal</button></div>
      </div>}

      {pm==="list"&&<>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}><button className={`ch ${!pcF?"a":""}`} onClick={()=>setPcF(null)}>Tümü ({myP.length})</button>{Object.entries(cc).sort((a,b)=>b[1]-a[1]).map(([cat,n])=><button key={cat} className={`ch ${pcF===cat?"a":""}`} onClick={()=>setPcF(cat)}>{CI[cat]} {cat} ({n})</button>)}</div>
        {panFilt.length===0?<p style={{textAlign:"center",padding:32,color:"#94A3B8"}}>Bu kategoride ürün yok</p>:
        <div style={{display:"grid",gap:10}}>{panFilt.map(p=>{const th=p.imgs?.[0]||"📦";return(
          <div key={p.id} style={{background:"#fff",borderRadius:12,border:"1px solid #E2E8F0",padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:50,height:50,borderRadius:8,background:"#FFF3EB",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}>{isI(th)?<img src={th} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:"1.5rem"}}>{th}</span>}</div>
            <div style={{flex:1,minWidth:0}}><p style={{fontWeight:700,color:"#2C1810",fontSize:".88rem"}}>{p.name} {p.status==="pending"&&<span style={{fontSize:".65rem",background:"#FFF3EB",color:"#E8A07A",padding:"2px 6px",borderRadius:4,fontWeight:600,marginLeft:4}}>Onay Bekliyor</span>}{p.status==="rejected"&&<span style={{fontSize:".65rem",background:"#FEE2E2",color:"#EF4444",padding:"2px 6px",borderRadius:4,fontWeight:600,marginLeft:4}}>Reddedildi</span>}</p><p style={{color:"#94A3B8",fontSize:".75rem"}}>{p.mc} › {p.sc} • {fmt(p.price)}{p.imgs?.length>1?` • ${p.imgs.length} foto`:""}</p></div>
            <div style={{display:"flex",gap:6}}><button onClick={()=>editP(p)} style={{background:"none",border:"1px solid #E2E8F0",borderRadius:8,padding:"6px 12px",color:"#E8A07A",cursor:"pointer",fontSize:".78rem",fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Düzenle</button><button onClick={()=>setProds(prev=>prev.filter(x=>x.id!==p.id))} style={{background:"none",border:"1px solid #E2E8F0",borderRadius:8,padding:"6px 12px",color:"#EF4444",cursor:"pointer",fontSize:".78rem",fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Sil</button></div>
          </div>);})}</div>}
      </>}
    </div>}

    {/* ADMIN */}
    {pg==="admin"&&user?.type==="admin"&&<div style={{maxWidth:960,margin:"0 auto",padding:"28px 20px",animation:"fu .4s"}}>
      <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.4rem",fontWeight:800,color:"#2C1810",marginBottom:16}}>⚙️ Admin Paneli</h1>
      <div style={{display:"flex",gap:6,marginBottom:20}}>
        {[["prods","Ürün Onay",prods.filter(p=>p.status==="pending").length],["stores","Mağaza Başvuru",sApps.filter(a=>a.status==="pending").length],["msgs","Mesajlar",msgs.filter(m=>!m.read).length]].map(([k,l,n])=>
          <button key={k} className={`ch ${admTab===k?"a":""}`} onClick={()=>setAdmTab(k)} style={{position:"relative"}}>{l}{n>0&&<span style={{marginLeft:4,background:"#EF4444",color:"#fff",fontSize:".6rem",fontWeight:700,padding:"1px 5px",borderRadius:8}}>{n}</span>}</button>
        )}
      </div>

      {admTab==="prods"&&<>
        <p style={{color:"#8B7B6E",fontSize:".85rem",marginBottom:12}}>Onay bekleyen ürünler</p>
        {prods.filter(p=>p.status==="pending").length===0?<p style={{color:"#94A3B8",textAlign:"center",padding:32}}>Onay bekleyen ürün yok</p>:
        <div style={{display:"grid",gap:10}}>{prods.filter(p=>p.status==="pending").map(p=>{const th=p.imgs?.[0]||"📦";const st=gs(p.sid);return(
          <div key={p.id} style={{background:"#fff",borderRadius:12,border:"1px solid #F0E8E0",padding:"14px 16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:60,height:60,borderRadius:8,background:"#FFF3EB",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}>{isI(th)?<img src={th} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:"1.8rem"}}>{th}</span>}</div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontWeight:700,color:"#2C1810",fontSize:".92rem"}}>{p.name}</p>
                <p style={{color:"#94A3B8",fontSize:".78rem"}}>{p.mc} › {p.sc} • {fmt(p.price)}</p>
                <p style={{color:"#8B7B6E",fontSize:".75rem"}}>{st?.name||"Bilinmeyen Mağaza"}</p>
              </div>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>setProds(pr=>pr.map(x=>x.id===p.id?{...x,status:"approved"}:x))} style={{background:"#10B981",color:"#fff",border:"none",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:".8rem",fontWeight:600}}>✓ Onayla</button>
                <button onClick={()=>setProds(pr=>pr.map(x=>x.id===p.id?{...x,status:"rejected"}:x))} style={{background:"#EF4444",color:"#fff",border:"none",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:".8rem",fontWeight:600}}>✕ Reddet</button>
              </div>
            </div>
            {p.imgs?.length>1&&<div style={{display:"flex",gap:6,marginTop:10,overflowX:"auto"}}>{p.imgs.map((img,i)=><div key={i} style={{width:48,height:48,borderRadius:6,background:"#FFF3EB",border:"1px solid #F0E8E0",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}>{isI(img)?<img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:"1.3rem"}}>{img}</span>}</div>)}</div>}
            {p.desc&&<p style={{color:"#8B7B6E",fontSize:".78rem",marginTop:8}}>{p.desc}</p>}
          </div>
        );})}</div>}
      </>}

      {admTab==="stores"&&<>
        <p style={{color:"#8B7B6E",fontSize:".85rem",marginBottom:12}}>Mağaza başvuruları</p>
        {sApps.length===0?<p style={{color:"#94A3B8",textAlign:"center",padding:32}}>Başvuru yok</p>:
        <div style={{display:"grid",gap:10}}>{sApps.map(a=>(
          <div key={a.id} style={{background:"#fff",borderRadius:12,border:"1px solid #F0E8E0",padding:"16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:48,height:48,borderRadius:10,background:"#FFF3EB",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}>{a.logo&&isI(a.logo)?<img src={a.logo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:"1.3rem"}}>🏪</span>}</div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontWeight:700,color:"#2C1810",fontSize:".92rem"}}>{a.name}</p>
                <p style={{color:"#94A3B8",fontSize:".78rem"}}>{a.email} • {a.phone}</p>
                <p style={{color:"#8B7B6E",fontSize:".72rem"}}>{a.date}</p>
              </div>
              <span style={{fontSize:".72rem",fontWeight:600,padding:"3px 8px",borderRadius:6,background:a.status==="pending"?"#FFF3EB":a.status==="approved"?"#D1FAE5":"#FEE2E2",color:a.status==="pending"?"#E8A07A":a.status==="approved"?"#10B981":"#EF4444"}}>{a.status==="pending"?"Bekliyor":a.status==="approved"?"Onaylı":"Reddedildi"}</span>
            </div>
            {a.locs?.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:8}}>{a.locs.map((l,i)=><span key={i} style={{fontSize:".72rem",background:"#FFF3EB",padding:"3px 8px",borderRadius:4,color:"#8B7B6E"}}>{l.label||`Mağaza ${i+1}`} — {l.city}/{l.district}</span>)}</div>}
            {a.status==="pending"&&<div style={{display:"flex",gap:6,marginTop:12}}>
              <button onClick={()=>setSApps(p=>p.map(x=>x.id===a.id?{...x,status:"approved"}:x))} style={{background:"#10B981",color:"#fff",border:"none",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:".8rem",fontWeight:600}}>✓ Onayla</button>
              <button onClick={()=>setSApps(p=>p.map(x=>x.id===a.id?{...x,status:"rejected"}:x))} style={{background:"#EF4444",color:"#fff",border:"none",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:".8rem",fontWeight:600}}>✕ Reddet</button>
            </div>}
          </div>
        ))}</div>}
      </>}

      {admTab==="msgs"&&<>
        <p style={{color:"#8B7B6E",fontSize:".85rem",marginBottom:12}}>İletişim mesajları</p>
        {msgs.length===0?<p style={{color:"#94A3B8",textAlign:"center",padding:32}}>Mesaj yok</p>:
        <div style={{display:"grid",gap:10}}>{msgs.map(m=>(
          <div key={m.id} onClick={()=>setMsgs(p=>p.map(x=>x.id===m.id?{...x,read:true}:x))} style={{background:"#fff",borderRadius:12,border:m.read?"1px solid #F0E8E0":"2px solid #E8A07A",padding:"14px 16px",cursor:"pointer"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
              <div><p style={{fontWeight:700,color:"#2C1810",fontSize:".88rem"}}>{m.name} {!m.read&&<span style={{width:8,height:8,borderRadius:"50%",background:"#E8A07A",display:"inline-block",marginLeft:4}}/>}</p><p style={{color:"#94A3B8",fontSize:".75rem"}}>{m.email}</p></div>
              <div style={{textAlign:"right"}}><span style={{fontSize:".7rem",background:"#FFF3EB",padding:"2px 8px",borderRadius:4,color:"#E8A07A",fontWeight:600}}>{m.topic}</span><p style={{color:"#94A3B8",fontSize:".7rem",marginTop:4}}>{m.date}</p></div>
            </div>
            <p style={{color:"#8B7B6E",fontSize:".85rem",lineHeight:1.5}}>{m.msg}</p>
          </div>
        ))}</div>}
      </>}
    </div>}

    {/* CONTACT */}
    {pg==="contact"&&<div style={{maxWidth:560,margin:"0 auto",padding:"28px 20px",animation:"fu .4s"}}>
      <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:"1.4rem",fontWeight:800,color:"#2C1810",marginBottom:6}}>İletişim</h1>
      <p style={{color:"#8B7B6E",fontSize:".88rem",marginBottom:24}}>Soru, öneri veya şikayetleriniz için bize yazın.</p>
      {cfOk?<div style={{background:"#FFF3EB",borderRadius:16,padding:"32px 24px",textAlign:"center",border:"1px solid #F0E8E0"}}>
        <p style={{fontSize:"1.5rem",marginBottom:10}}>✅</p>
        <h3 style={{fontFamily:"'Sora',sans-serif",fontWeight:700,color:"#2C1810",marginBottom:6}}>Mesajınız Alındı</h3>
        <p style={{color:"#8B7B6E",fontSize:".88rem",marginBottom:16}}>En kısa sürede size dönüş yapacağız.</p>
        <button className="btn b1" onClick={()=>{setCfOk(false);setPg("home");}}>Ana Sayfaya Dön</button>
      </div>:<div style={{background:"#fff",borderRadius:16,border:"1px solid #F0E8E0",padding:24}}>
        <label className="lb">Ad Soyad *</label><input className="inp" placeholder="Adınız Soyadınız" value={cf.name} onChange={e=>setCf(p=>({...p,name:e.target.value}))}/><div style={{height:10}}/>
        <label className="lb">Email *</label><input className="inp" placeholder="ornek@email.com" value={cf.email} onChange={e=>setCf(p=>({...p,email:e.target.value}))}/><div style={{height:10}}/>
        <label className="lb">Konu</label><select className="inp" value={cf.topic} onChange={e=>setCf(p=>({...p,topic:e.target.value}))}>
          <option>Genel</option><option>Mağaza Başvurusu</option><option>Teknik Destek</option><option>Öneri</option><option>Şikayet</option>
        </select><div style={{height:10}}/>
        <label className="lb">Mesajınız *</label><textarea className="inp" rows={5} placeholder="Mesajınızı yazın..." value={cf.msg} onChange={e=>setCf(p=>({...p,msg:e.target.value}))}/>
        {err&&<p style={{color:"#EF4444",fontSize:".8rem",marginTop:8}}>{err}</p>}
        <button className="btn b1" onClick={sendCf} style={{width:"100%",marginTop:16}}>Gönder</button>
      </div>}
    </div>}
  </div>);
}
