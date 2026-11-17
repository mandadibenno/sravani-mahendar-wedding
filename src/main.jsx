import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { wedding } from './wedding.js';
import './styles.css';

const mapURL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(wedding.mapsQuery)}`;

function Icon({ name, size = 18 }) {
  const common = { width:size, height:size, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:1.6, strokeLinecap:'round', strokeLinejoin:'round', 'aria-hidden':true };
  if(name === 'music') return <svg {...common}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
  if(name === 'pause') return <svg {...common}><path d="M8 5v14M16 5v14" strokeWidth="3"/></svg>;
  if(name === 'play') return <svg {...common}><path d="m8 5 11 7-11 7z" fill="currentColor" stroke="none"/></svg>;
  if(name === 'arrow') return <svg {...common}><path d="M4 12h15m-6-6 6 6-6 6"/></svg>;
  if(name === 'pin') return <svg {...common}><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.4"/></svg>;
  if(name === 'calendar') return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 10h18"/></svg>;
  if(name === 'menu') return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
  if(name === 'close') return <svg {...common}><path d="M5 5l14 14M19 5 5 19"/></svg>;
  return null;
}
function Flourish({ light = false }) { return <div className={`flourish${light?' flourish-light':''}`} aria-hidden="true"><span/><b>✦</b><span/></div>; }
const petals = Array.from({length:17},(_,i)=>({
  left:`${(i*37 + 11)%100}%`, delay:`${-((i*3.7)%24)}s`, duration:`${14+(i%7)*2.1}s`,
  size:`${5+(i%4)*3}px`, drift:`${(i%2?-1:1)*(40+(i%5)*15)}px`
}));
function Petals(){return <div className="petal-layer" aria-hidden="true">{petals.map((p,i)=><i key={i} style={{'--left':p.left,'--delay':p.delay,'--duration':p.duration,'--size':p.size,'--drift':p.drift}}/>)}</div>}
function useReveal(){
  useEffect(()=>{
    const elements=document.querySelectorAll('[data-reveal]');
    if(!('IntersectionObserver' in window)){elements.forEach(el=>el.classList.add('is-visible'));return;}
    const observer=new IntersectionObserver(entries=>{entries.forEach(({target,isIntersecting})=>{
      if(isIntersecting){target.classList.add('is-visible');observer.unobserve(target)}
    })},{threshold:.08,rootMargin:'0px 0px -28px 0px'});
    elements.forEach(el=>observer.observe(el));
    return()=>observer.disconnect();
  },[]);
}
function Countdown(){
  const getTime=()=>{
    const remaining=Math.max(0,new Date(wedding.ceremonyISO).getTime()-Date.now());
    return {day:Math.floor(remaining/864e5),hr:Math.floor(remaining/36e5)%24,min:Math.floor(remaining/6e4)%60,sec:Math.floor(remaining/1e3)%60,ended:!remaining}
  };
  const [t,setT]=useState(getTime);
  useEffect(()=>{const id=window.setInterval(()=>setT(getTime()),1000);return()=>clearInterval(id)},[]);
  return t.ended ? <p className="countdown-done">The wedding day is here. We welcome you with love!</p> :
    <div className="timer" role="timer" aria-label="Countdown to 25 November 2026, 11:18 AM India time">
      {[[t.day,'DAYS'],[t.hr,'HOURS'],[t.min,'MINUTES'],[t.sec,'SECONDS']].map(([value,label])=><div className="timer-piece" key={label}><strong>{String(value).padStart(2,'0')}</strong><span>{label}</span></div>)}
    </div>;
}
function MusicControl({audioRef,playing,setPlaying}) {
  const [hasError,setHasError]=useState(false);
  useEffect(()=>{
    const audio=audioRef.current;
    if(!audio)return;
    audio.volume=0.55;
    const onPlay=()=>setPlaying(true),onPause=()=>setPlaying(false),onError=()=>setHasError(true);
    audio.addEventListener('play',onPlay);audio.addEventListener('pause',onPause);audio.addEventListener('error',onError);
    return()=>{audio.removeEventListener('play',onPlay);audio.removeEventListener('pause',onPause);audio.removeEventListener('error',onError)};
  },[audioRef,setPlaying]);
  const toggle=()=>{
    const audio=audioRef.current;
    if(!audio)return;
    if(audio.paused){audio.play().catch(()=>setPlaying(false))}else{audio.pause()}
  };
  return <button type="button" className={`music-control ${playing?'is-playing':''}`} onClick={toggle} aria-label={playing?'Pause background music':'Play background music'} aria-pressed={playing} title={hasError?'Music file could not load':playing?'Pause music':'Play music'}>
    <span className="music-disc"><Icon name={playing?'pause':'music'} size={19}/></span>
    <span className="music-caption"><b>{playing?'MUSIC ON':hasError?'MUSIC ERROR':'PLAY MUSIC'}</b><small>Original instrumental</small></span>
    <span className={`music-bars ${playing?'active':''}`} aria-hidden="true"><i/><i/><i/></span>
  </button>
}
function Header() {
  const [open,setOpen]=useState(false);
  useEffect(()=>{document.body.classList.toggle('menu-open',open);return()=>document.body.classList.remove('menu-open')},[open]);
  const links=[['The Invitation','#invitation'],['The Couple','#couple'],['Wedding Day','#wedding-day'],['Venue','#venue']];
  return <header className="header"><a className="brand" href="#top" aria-label="Home"><span className="brand-mark">S<span>&amp;</span>M</span><span className="brand-type">EKKALDEVI'S <small>WEDDING INVITATION</small></span></a>
    <nav className={`nav ${open?'nav-open':''}`} aria-label="Primary navigation">{links.map(([label,href])=><a key={href} href={href} onClick={()=>setOpen(false)}>{label}</a>)}</nav>
    <div className="header-actions"><span className="date-hint">25 . 11 . 2026</span><button className="menu-toggle" type="button" onClick={()=>setOpen(x=>!x)} aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open}><Icon name={open?'close':'menu'} size={24}/></button></div>
  </header>
}
function Hero({startWithMusic}) {
  const layer=useRef(null);
  useEffect(()=>{
    const element=layer.current;
    if(!element||window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches)return;
    const move=e=>{const bounds=element.getBoundingClientRect();element.style.setProperty('--mx',`${((e.clientX-bounds.left)/bounds.width-.5)*8}px`);element.style.setProperty('--my',`${((e.clientY-bounds.top)/bounds.height-.5)*6}px`)};
    element.addEventListener('pointermove',move);
    return()=>element.removeEventListener('pointermove',move);
  },[]);
  return <section className="hero hero-v4" id="top" ref={layer}>
    <div className="hero-scene" aria-hidden="true"/><div className="hero-overlay" aria-hidden="true"/>
    <div className="hero-side-trim left" aria-hidden="true"/><div className="hero-side-trim right" aria-hidden="true"/>
    <div className="hero-gold-dust" aria-hidden="true"/><Petals/>
    <div className="hero-content">
      
      <img
       className="ganesha-emblem"
       src={`${import.meta.env.BASE_URL}images/ganesha-emblem.webp`}
       alt="Lord Ganesha blessing this wedding"
      fetchPriority="high"
      />

      <p className="blessing-top">WITH THE BLESSINGS OF LORD GANESHA</p>
      <div className="hero-decor-line" aria-hidden="true"><span/><i>✦</i><span/></div>
      <p className="wedding-label">Ekkaldevi's Wedding Invitation</p>
      <h1 className="hero-names"><span className="hero-name">Sravani</span><span className="hero-and">&amp;</span><span className="hero-name">Mahendar</span></h1>
      <p className="hero-sub">A love to last a lifetime</p>
      <button className="hero-action" type="button" onClick={startWithMusic}><Icon name="music" size={16}/><span>OPEN INVITATION WITH MUSIC</span><Icon name="arrow" size={17}/></button>
      <p className="sound-hint">Tap to begin with a soft instrumental melody</p>
    </div>
    <a className="scroll-label" href="#invitation" aria-label="Scroll to the invitation"><span>DISCOVER OUR CELEBRATION</span><i/></a>
  </section>;
}
function Invitation(){return <section className="invitation-section" id="invitation"><div className="corner-flower corner-flower-a" aria-hidden="true">❀</div><div className="corner-flower corner-flower-b" aria-hidden="true">❀</div>
  <div className="invitation-grid site-width">
    <div className="invitation-side" data-reveal><p className="section-kicker">OUR FAMILIES JOYFULLY INVITE YOU</p><p className="large-monogram">S<span>&amp;</span>M</p><span className="vertical-doodle" aria-hidden="true">✦</span><p className="side-whisper">Under the blessings of our elders,<br/>with love in our hearts.</p></div>
    <div className="invitation-copy" data-reveal><p className="section-kicker">A HEARTFELT INVITATION</p><h2 className="section-display">With joy in our hearts,<br/><em>we invite you.</em></h2><Flourish/><p className="paragraph-lead">We solicit your gracious presence and blessings with family &amp; friends on the auspicious occasion of the marriage of our only daughter.</p>
      <p className="small-heading">DIVINE BLESSINGS OF OUR GRANDPARENTS</p><div className="grandparents">{wedding.grandparents.map(x=><p key={x}>{x}</p>)}</div>
      <div className="invitation-signature">With love &amp; blessings, <span>The Ekkaldevi Family</span></div>
    </div>
  </div>
</section>}
function CouplePortrait({name,relation,src}){
  const [failed,setFailed]=useState(false);
  return <article className="couple-person" data-reveal><div className="portrait-area"><div className="portrait-oval">{failed?<div className="silhouette"><svg viewBox="0 0 200 260" aria-hidden="true"><circle cx="100" cy="95" r="41" fill="currentColor" opacity=".23"/><path d="M28 255c0-58 26-95 72-95s72 37 72 95" fill="currentColor" opacity=".23"/></svg><span>ADD PHOTO</span></div>:<img src={src} alt={`${name}, the ${relation.toLowerCase()}`} loading="lazy" onError={()=>setFailed(true)} />}</div><div className="portrait-flower" aria-hidden="true">✿</div></div><p className="person-label">THE {relation.toUpperCase()}</p><h3>{name}</h3></article>
}
function Couple(){return <section className="couple-section" id="couple"><div className="couple-sky" aria-hidden="true"/><div className="site-width couple-inner"><div className="section-intro" data-reveal><p className="section-kicker">TWO SOULS · ONE DESTINY</p><h2 className="section-display">Together, <em>always.</em></h2><p className="intro-muted">Together with our families, we celebrate a new beginning.</p></div>
  <div className="portrait-grid"><CouplePortrait relation="Bride" name={wedding.bride} src={wedding.bridePhoto}/><div className="portrait-join" aria-hidden="true">&amp;</div><CouplePortrait relation="Groom" name={wedding.groom} src={wedding.groomPhoto}/></div>
  <p className="couple-note" data-reveal>Chi. La. Sow. <strong>{wedding.bride}</strong> &nbsp;with&nbsp; Chi. <strong>{wedding.groom}</strong></p><p className="couple-family" data-reveal>{wedding.familyNote}</p>
</div></section>}
function DateSection(){return <section className="date-section" id="wedding-day"><div className="date-glow" aria-hidden="true"/><div className="site-width date-content" data-reveal><p className="section-kicker">THE AUSPICIOUS DAY</p><h2 className="section-display">Save the <em>date.</em></h2><div className="date-feature"><span className="date-weekday">WEDNESDAY</span><div className="date-year-layout"><strong>25</strong><div><span>NOVEMBER</span><small>2026</small></div></div></div>
  <Flourish light/><p className="muhurtham-label">SUMUHURTHAM · DANUSU LAGNAM</p><p className="muhurtham-time">{wedding.muhurtham} <small>IST</small></p><p className="muhurtham-note">“{wedding.lagnam}” · Lunch follows</p><div className="timer-wrap"><p className="section-kicker">COUNTING THE MOMENTS</p><Countdown/></div><a className="date-cta" href="/wedding.ics" download="Sravani_Mahendar_Wedding.ics"><Icon name="calendar" size={16}/> ADD TO CALENDAR <Icon name="arrow" size={16}/></a>
</div></section>}
function Venue(){return <section className="venue-section" id="venue"><div className="venue-scene" aria-hidden="true"/><div className="venue-shade" aria-hidden="true"/><div className="venue-details" data-reveal><p className="section-kicker">THE PLACE WHERE FOREVER BEGINS</p><h2 className="section-display">The wedding <em>venue</em></h2><Flourish/><p className="venue-name">{wedding.venueName}</p><p className="venue-address">{wedding.venueLine1}<br/>{wedding.venueLine2}</p><p className="venue-schedule">Wednesday, 25 November 2026 · 11:18 AM</p><a className="venue-map" href={mapURL} target="_blank" rel="noopener noreferrer"><Icon name="pin" size={17}/> GET DIRECTIONS <Icon name="arrow" size={17}/></a></div><div className="venue-footnote">A CELEBRATION OF LOVE, LIGHT &amp; BLESSINGS</div></section>}
function ShareInvite(){
  const [copied,setCopied]=useState(false);
  const share=async()=>{
    const payload={title:'Sravani & Mahendar Wedding Invitation',text:'Join us on Wednesday, 25 November 2026, 11:18 AM at R.G.G. Convention, Mortad.',url:window.location.href};
    try{
      if(navigator.share){await navigator.share(payload);return;}
      if(navigator.clipboard && window.isSecureContext){await navigator.clipboard.writeText(window.location.href);setCopied(true);setTimeout(()=>setCopied(false),2200);return;}
      window.prompt('Copy invitation link:',window.location.href);
    }catch(e){if(e?.name!=='AbortError')window.prompt('Copy invitation link:',window.location.href)}
  };
  return <button className="share-invite" type="button" onClick={share}><Icon name="arrow" size={17}/>{copied?'LINK COPIED':'SHARE THIS INVITATION'}</button>;
}
function Ending(){return <section className="ending-section"><div className="site-width ending-inner" data-reveal><p className="section-kicker">WITH ALL OUR LOVE</p><h2 className="section-display">Your presence is<br/><em>our greatest blessing.</em></h2><p className="ending-p">Join us with your family and friends to bless the couple as they step into a lifetime of togetherness.</p><Flourish/>
  <div className="family-signoff"><div><p className="small-heading">INVITED BY</p><p className="signoff-name">{wedding.invitedBy}</p><p className="ending-address">{wedding.invitedFrom}</p></div><div><p className="small-heading">SPECIAL WISHES FROM</p><p className="signoff-name">{wedding.specialWishes}</p></div></div><p className="compliments">With best compliments from Near &amp; Dear...</p><ShareInvite/><div className="ending-emblem">S <span>&amp;</span> M</div><p className="end-date">25 NOVEMBER 2026</p></div></section>}
function App(){
  useReveal();
  const audioRef=useRef(null);
  const [playing,setPlaying]=useState(false);
  const startWithMusic=useCallback(()=>{
    const audio=audioRef.current;
    if(audio && audio.paused){audio.play().catch(()=>setPlaying(false))}
    document.getElementById('invitation')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  },[]);
  return <>
    <audio ref={audioRef} src={wedding.musicFile} preload="none" loop playsInline />
    <Header/>
    <main><Hero startWithMusic={startWithMusic}/><div className="invitation-ribbon" aria-hidden="true"><span>✦</span> A CELEBRATION OF LOVE &amp; BLESSINGS <span>✦</span></div><Invitation/><Couple/><DateSection/><Venue/><Ending/></main>
    
<footer className="footer studio-footer">
  <span className="studio-credit">
    DESIGNED & DEVELOPED BY
  </span>

  <a
    href="https://wa.me/919182970829"
    target="_blank"
    rel="noopener noreferrer"
    className="studio-logo"
  >
    pramod<span>.</span>studio
  </a>

  <a
    href="tel:+919182970829"
    className="studio-contact"
  >
    +91 91829 70829
  </a>

  <span className="studio-tagline">
    CRAFTING BEAUTIFUL DIGITAL EXPERIENCES
  </span>
</footer>

    <MusicControl audioRef={audioRef} playing={playing} setPlaying={setPlaying}/>
  </>
}
createRoot(document.getElementById('root')).render(<App/>);
