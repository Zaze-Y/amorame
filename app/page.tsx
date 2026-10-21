"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, ContactShadows, useGLTF } from "@react-three/drei";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Menu, Volume2, X } from "lucide-react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function LoadedBottle() {
  const gltf = useGLTF("/parfum.glb");
  return <primitive object={gltf.scene.clone()} />;
}

function Bottle({ progress, hasModel }: { progress: number; hasModel: boolean }) {
  const root = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!root.current) return;
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, progress * Math.PI * 2.15 - .5, 5, delta);
    root.current.rotation.x = Math.sin(progress * Math.PI * 2) * .045;
    root.current.position.y = Math.sin(state.clock.elapsedTime * .8) * .075;
  });
  return <group ref={root} scale={hasModel ? 1.45 : 1}>
    {hasModel ? <LoadedBottle /> : <FallbackBottle />}
  </group>;
}

function FallbackBottle() {
  const glass = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#b91627", roughness: .16, metalness: .12, transmission: .38, thickness: .75, clearcoat: 1, clearcoatRoughness: .1, ior: 1.42 }), []);
  const gold = useMemo(() => new THREE.MeshStandardMaterial({ color: "#d4aa70", metalness: .82, roughness: .24 }), []);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: "#58101b", metalness: .35, roughness: .22 }), []);
  return <group position={[0,-.03,0]}>
    <mesh position={[0,-.2,0]} castShadow material={glass}><cylinderGeometry args={[.67,.77,1.52,96,1,false]} /></mesh>
    <mesh position={[0,.6,0]} castShadow material={glass}><cylinderGeometry args={[.36,.36,.4,64]} /></mesh>
    <mesh position={[0,.83,0]} material={gold}><cylinderGeometry args={[.32,.33,.09,64]} /></mesh>
    <mesh position={[0,1.13,0]} castShadow material={dark}><cylinderGeometry args={[.29,.33,.52,64,1]} /></mesh>
    <mesh position={[0,-.15,.686]} material={gold}><boxGeometry args={[.9,.55,.045]} /></mesh>
    <mesh position={[0,-.14,.715]} material={dark}><boxGeometry args={[.82,.49,.02]} /></mesh>
    <mesh position={[0,.005,.73]}><planeGeometry args={[.72,.36]} /><meshBasicMaterial color="#f8e9dc" /></mesh>
    <mesh position={[0,.01,.745]}><planeGeometry args={[.69,.32]} /><meshBasicMaterial color="#6f1722" /></mesh>
    <mesh position={[0,.008,.752]}><planeGeometry args={[.65,.28]} /><meshBasicMaterial color="#f5e6d9" /></mesh>
    <mesh position={[0,.035,.76]}><planeGeometry args={[.56,.21]} /><meshBasicMaterial color="#701824" /></mesh>
    <mesh position={[0,-.175,.764]}><planeGeometry args={[.25,.055]} /><meshBasicMaterial color="#f2dfce" /></mesh>
  </group>;
}

function Scene({ progress, hasModel }: { progress: number; hasModel: boolean }) {
  return <Canvas camera={{ position: [0, 0, 5.2], fov: 35 }} dpr={[1,1.7]} gl={{ alpha: true, antialias: true }} shadows>
    <ambientLight intensity={1.2} /><directionalLight position={[4,5,4]} intensity={3.4} castShadow />
    <pointLight position={[-3,1,2]} color="#ffb59d" intensity={18} /><pointLight position={[2,-2,-3]} color="#f0b56c" intensity={14} />
    <Suspense fallback={null}><Float speed={1} rotationIntensity={0} floatIntensity={0}><Bottle progress={progress} hasModel={hasModel} /></Float><Environment preset="city" /></Suspense>
    <ContactShadows position={[0,-1.25,0]} opacity={.38} scale={4.3} blur={2.6} far={2.5} />
  </Canvas>;
}

const chapters = [
  { n: "01", eyebrow: "UNE RENCONTRE", title: <>Tout commence<br/><em>par un frisson.</em></>, copy: "Un sillage chaud, inattendu. L’instant suspendu où les sens prennent les devants." },
  { n: "02", eyebrow: "L’ALCHIMIE", title: <>Le rouge a<br/><em>son secret.</em></>, copy: "Des pétales en plein soleil. Une peau qui s’attarde. Amora révèle ce qui ne se dit pas." },
  { n: "03", eyebrow: "LA PROMESSE", title: <>Bientôt,<br/><em>le désir.</em></>, copy: "Une nouvelle histoire d’amour. Amora, eau de parfum. Rendez-vous dans deux mois." },
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasModel, setHasModel] = useState(false);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sound, setSound] = useState(false);
  const smooth = useTransform(scrollYProgress, [0,1], [0,1]);
  useEffect(() => {
    const unsub = smooth.on("change", setProgress);
    const timer = window.setTimeout(() => setLoading(false), 1800);
    return () => { unsub(); clearTimeout(timer); };
  }, [smooth]);
  useEffect(() => { fetch("/parfum.glb", { method: "HEAD" }).then(r => setHasModel(r.ok)).catch(() => setHasModel(false)); }, []);
  const goTo = (id: string) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  return <>
    <AnimatePresence>{loading && <motion.div className="preloader" initial={{opacity:1}} exit={{opacity:0, transition:{duration:.65}}}>
      <div className="pre-mark">A<span>.</span></div><div className="pre-rule"><motion.i initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:1.35,ease:[.76,0,.24,1]}} /></div><p>UNE HISTOIRE SE PRÉPARE</p>
    </motion.div>}</AnimatePresence>
    <div className="grain" aria-hidden="true"/><div className="ambient" aria-hidden="true"/>
    <header className="topbar"><a className="wordmark" href="#top" aria-label="Amora accueil">amora<span>.</span></a><span className="top-note">EAU DE PARFUM · PARIS</span><button className="menu-trigger" onClick={()=>setMenuOpen(!menuOpen)} aria-label={menuOpen?"Fermer le menu":"Ouvrir le menu"}>{menuOpen?<X size={18}/>:<Menu size={18}/>}<span>MENU</span></button></header>
    <AnimatePresence>{menuOpen&&<motion.nav className="menu-panel" initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}><button onClick={()=>goTo("top")}>La promesse <span>01</span></button><button onClick={()=>goTo("story")}>L’alchimie <span>02</span></button><button onClick={()=>goTo("waitlist")}>Le premier rendez-vous <span>03</span></button></motion.nav>}</AnimatePresence>
    <div className="scene-shell" aria-label="Flacon de parfum Amora, rotation guidée par le défilement"><Scene progress={progress} hasModel={hasModel}/><div className="scene-caption">AMORA <span>·</span> EAU DE PARFUM</div><button className="sound-toggle" onClick={()=>setSound(!sound)} aria-label="Activer ou désactiver le son"><Volume2 size={14}/><span>{sound?"SON ACTIVÉ":"SON OFF"}</span><i className={sound?"sound-dot on":"sound-dot"}/></button></div>
    <main>
      <section className="hero section" id="top"><div className="hero-copy"><p className="eyebrow"><span className="eyebrow-line"/>LE NOUVEAU PARFUM AMORA</p><h1>Une histoire<br/>de <em>désir.</em></h1><p className="hero-description">Il y a des rencontres que l’on n’oublie pas.<br/>La prochaine commence dans deux mois.</p><button className="text-link" onClick={()=>goTo("story")}>DÉCOUVRIR L’HISTOIRE <ArrowDown size={15}/></button></div><div className="hero-aside"><span className="side-index">01 <i/> 03</span><span className="side-copy">LE TEMPS<br/>DU PREMIER<br/><em>REGARD</em></span></div><div className="hero-vertical">LE ROUGE, ENFIN</div><div className="hero-bottom"><span>01 / 03</span><span className="scroll-cue">DÉFILER POUR RESSENTIR <ArrowDown size={12}/></span><span>48°51’N · 2°21’E</span></div><div className="hero-number">A</div></section>
      <section className="story section" id="story"><div className="chapter-label"><span>LE JOURNAL AMORA</span><span>—</span><span>02 / 03</span></div><div className="story-layout"><div className="story-left"><p className="eyebrow"><span className="eyebrow-line"/>L’ALCHIMIE D’UN INSTANT</p><h2>À fleur<br/>de <em>peau.</em></h2></div><div className="story-right"><p className="story-lead">L’amour ne prévient pas.<br/>Il laisse une trace.</p><p>Une fleur rouge s’ouvre à la chaleur. La vanille s’y attarde, le bois enveloppe. Amora est ce moment juste après, quand le souvenir est encore une sensation.</p><a className="text-link" href="#waitlist">UNE PREMIÈRE IMPRESSION <ArrowUpRight size={15}/></a></div></div><div className="story-foot"><span>NOTES DE TÊTE <b>·</b> ROSE ÉCLATANTE</span><span>NOTES DE CŒUR <b>·</b> JASMIN SOLAIRE</span><span>NOTES DE FOND <b>·</b> VANILLE & BOIS AMBRÉ</span></div><div className="story-watermark">A.</div></section>
      <section className="countdown section" id="waitlist"><div className="chapter-label"><span>LE PREMIER RENDEZ-VOUS</span><span>—</span><span>03 / 03</span></div><div className="countdown-content"><p className="eyebrow"><span className="eyebrow-line"/>RENDEZ-VOUS DANS DEUX MOIS</p><h2>À très<br/><em>bientôt.</em></h2><p className="countdown-copy">Amora arrive. Soyez parmi les premiers<br/>à découvrir sa signature.</p><form className="signup" onSubmit={e=>{e.preventDefault();if(email.includes("@"))setJoined(true)}}><label htmlFor="email">VOTRE ADRESSE E-MAIL</label><div className="input-row"><input id="email" type="email" placeholder="bonjour@exemple.com" value={email} onChange={e=>setEmail(e.target.value)} required/><button aria-label="M’inscrire" type="submit"><ArrowUpRight size={19}/></button></div><p className="signup-note">{joined?"C’est noté. On se retrouve très bientôt. ❤":"Une note de notre part, au bon moment. Rien de plus."}</p></form></div><div className="end-stamp"><span>AMORA</span><span>PARIS · MMXXVI</span></div></section>
    </main>
    <footer className="footer"><a href="#top">amora<span>.</span></a><span>UNE HISTOIRE SE PRÉPARE</span><span>© AMORA PARIS 2026</span></footer>
    <div className="scroll-progress"><motion.i style={{scaleX:scrollYProgress,transformOrigin:"0% 50%"}}/></div>
  </>;
}

