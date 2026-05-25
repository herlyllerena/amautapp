import { useState, useEffect, useRef } from "react";

// ── Design tokens ──────────────────────────────────────────────────────────
const C = {
  gold: "#C8860A", goldL: "#E8A820", goldD: "#8A5A05",
  ink: "#0D0A06", inkL: "#1C1710", inkM: "#2A2318",
  cream: "#FDF8F0", creamD: "#F0E8D8", creamM: "#E8D9C0",
  gray: "#8A7A65", grayL: "#B0A090", grayD: "#5A4A38",
  red: "#B91C1C", redL: "#FEF2F2",
  amber: "#B45309", amberL: "#FFFBEB",
  blue: "#1D4ED8", blueL: "#EFF6FF",
  green: "#15803D", greenL: "#F0FDF4",
  violet: "#6D28D9", violetL: "#F5F3FF",
};

const FORMAS = [
  { key:"guerrero", name:"Guerrero", quechua:"Aucayoc Kawsay", color:C.red, light:C.redL, wilber:"Rojo", desc:"La Fuerza que Sostiene la Vida" },
  { key:"guardian", name:"Guardián", quechua:"Kamayoc Kawsay", color:C.amber, light:C.amberL, wilber:"Ámbar", desc:"La Fuerza que Sostiene el Tiempo" },
  { key:"descubridor", name:"Descubridor", quechua:"Hamutay Kawsay", color:C.blue, light:C.blueL, wilber:"Naranja", desc:"La Fuerza que Revela la Verdad" },
  { key:"guia", name:"Guía", quechua:"Pushac Kawsay", color:C.green, light:C.greenL, wilber:"Verde", desc:"La Fuerza que Teje la Unidad Humana" },
  { key:"maestro", name:"Maestro", quechua:"Kuraq Kawsay", color:C.violet, light:C.violetL, wilber:"Turquesa", desc:"La Fuerza de la Totalidad" },
];

const CUADRANTES = [
  { key:"sapa_ukhu", name:"Sapa Ukhu", sub:"Subjetivo · Interior individual", color:C.blue },
  { key:"sapa_hawa", name:"Sapa Hawa", sub:"Objetivo · Exterior individual", color:C.amber },
  { key:"tinkuy_yuyay", name:"Tinkuy Yuyay", sub:"Intersubjetivo · Interior colectivo", color:C.green },
  { key:"lliu_hawa", name:"Lliu Hawa", sub:"Interobjetivo · Exterior colectivo", color:C.violet },
];

const MANTRA_WORDS = [
  { word:"Ayni", meaning:"Reciprocidad sagrada", zone:"Plexo solar", cuad:"Lliu Hawa", color:C.red },
  { word:"Yanantin", meaning:"La danza de los opuestos", zone:"Pecho", cuad:"Sapa Ukhu", color:C.amber },
  { word:"Masintin", meaning:"La fuerza de los semejantes", zone:"Hombros", cuad:"Tinkuy Yuyay", color:C.green },
  { word:"Tawantin", meaning:"La totalidad viva", zone:"Todo el cuerpo", cuad:"Integración total", color:C.violet },
];

// Diagnostic questions
const DIAG_Q = [
  { id:1, forma:"guerrero", text:"Cuando algo amenaza lo que valoro, actúo con decisión y sin vacilar." },
  { id:2, forma:"guerrero", text:"Soy capaz de mantener mis límites aunque el otro se incomode." },
  { id:3, forma:"guerrero", text:"Cuando siento que me atacan, me calmo antes de responder." },
  { id:4, forma:"guerrero", text:"Puedo sostener un conflicto directo sin necesitar que el otro ceda." },
  { id:5, forma:"guerrero", text:"Mi fuerza está disponible para proteger a otros, no solo a mí." },
  { id:6, forma:"guardian", text:"Tengo hábitos y rutinas establecidas que mantengo con consistencia." },
  { id:7, forma:"guardian", text:"Cuando algo cambia inesperadamente, me adapto sin perder el rumbo." },
  { id:8, forma:"guardian", text:"Cumplo mis compromisos incluso cuando no tengo ganas." },
  { id:9, forma:"guardian", text:"Soy capaz de cuestionar una regla propia si ya no sirve a la vida." },
  { id:10, forma:"guardian", text:"Administro mis recursos (tiempo, energía, dinero) con orden." },
  { id:11, forma:"descubridor", text:"Cuando no entiendo algo, siento curiosidad antes que ansiedad." },
  { id:12, forma:"descubridor", text:"Puedo cambiar de posición cuando encuentro evidencia suficiente." },
  { id:13, forma:"descubridor", text:"Mis reflexiones aterrizan en acciones concretas, no solo en ideas." },
  { id:14, forma:"descubridor", text:"Cuando exploro algo nuevo, incluyo cómo me siento en el cuerpo." },
  { id:15, forma:"descubridor", text:"Lo que aprendo lo pongo al servicio de algo más grande que yo." },
  { id:16, forma:"guia", text:"Puedo acompañar a alguien en su dificultad sin necesitar resolverla." },
  { id:17, forma:"guia", text:"Me cuido a mí mismo con la misma atención que cuido a otros." },
  { id:18, forma:"guia", text:"Puedo decir no a una petición sin sentir culpa excesiva." },
  { id:19, forma:"guia", text:"Mi liderazgo surge del servicio, no de la necesidad de reconocimiento." },
  { id:20, forma:"guia", text:"Cuando alguien crece y ya no me necesita, lo celebro genuinamente." },
  { id:21, forma:"maestro", text:"Puedo sostener perspectivas opuestas sin necesitar que una gane." },
  { id:22, forma:"maestro", text:"Mi paz interior no depende de que el entorno esté en orden." },
  { id:23, forma:"maestro", text:"Actúo desde lo que el sistema completo necesita, más que desde lo que yo quiero." },
  { id:24, forma:"maestro", text:"Estoy activamente formando a otros para que ya no me necesiten." },
  { id:25, forma:"maestro", text:"Me sincronizo con los ritmos naturales como práctica consciente." },
];

const LIKERT = ["Casi nunca","Pocas veces","A veces","Con frecuencia","Casi siempre"];

// Amanecer questions
const AMANECER_Q = [
  { id:"voz", label:"¿Desde qué voz estás amaneciendo hoy?", hint:"No la voz que quisieras tener: la que realmente está presente ahora." },
  { id:"cuerpo", label:"¿Cuál es el estado de tu cuerpo en este momento?", hint:"Zona de tensión, calidad de la respiración, apertura o cierre del pecho." },
  { id:"emerger", label:"¿Qué quiere emerger hoy a través de ti?", hint:"No lo que debes hacer. Lo que quiere emerger: imagen, intención, palabra." },
];

// Atardecer questions
const ATARDECER_Q = [
  { id:"piso", label:"¿En qué piso pasaste más tiempo hoy?", hint:"No el mejor ni el peor momento: el piso donde operaste la mayor parte del día." },
  { id:"voz_control", label:"¿Qué voz tomó el control sin que lo eligieras?", hint:"¿En qué momento, ante qué circunstancia específica?" },
  { id:"ntin", label:"¿Hubo un momento de -ntin, de síntesis genuina?", hint:"¿Qué lo produjo? ¿Qué integró?" },
  { id:"nudos", label:"¿Qué nudo se tensó hoy y qué nudo se aflojó?", hint:"Ambos son información del Quipu personal." },
];

// ── Styles ─────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --gold: #C8860A; --goldL: #E8A820; --ink: #0D0A06;
    --cream: #FDF8F0; --creamD: #F0E8D8; --gray: #8A7A65;
    --ff-display: 'Cormorant Garamond', Georgia, serif;
    --ff-body: 'Jost', system-ui, sans-serif;
  }

  .app { background: var(--ink); min-height: 100vh; font-family: var(--ff-body); color: var(--cream); }

  /* NAV */
  .nav { display:flex; align-items:center; justify-content:space-between;
    padding: 14px 24px; border-bottom: 1px solid rgba(200,134,10,0.2);
    background: rgba(13,10,6,0.95); backdrop-filter: blur(12px);
    position: sticky; top:0; z-index:100; }
  .nav-logo { font-family: var(--ff-display); font-size:22px; font-weight:600; color: var(--gold); letter-spacing:0.05em; }
  .nav-logo span { font-size:11px; font-weight:300; color: var(--gray); display:block; letter-spacing:0.2em; text-transform:uppercase; }
  .nav-tabs { display:flex; gap:4px; }
  .nav-tab { padding: 7px 14px; border-radius:6px; font-size:12px; font-weight:500;
    color: var(--gray); background:none; border:none; cursor:pointer; transition: all .2s;
    letter-spacing:0.06em; text-transform:uppercase; }
  .nav-tab:hover { color: var(--cream); background: rgba(200,134,10,0.1); }
  .nav-tab.active { color: var(--gold); background: rgba(200,134,10,0.15); }

  /* SCREENS */
  .screen { padding: 32px 24px; max-width: 680px; margin: 0 auto; animation: fadeUp .4s ease; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }

  /* HOME */
  .home-hero { text-align:center; padding: 48px 0 40px; }
  .home-title { font-family: var(--ff-display); font-size: clamp(42px,8vw,72px);
    font-weight:600; color: var(--cream); line-height:1.05; letter-spacing:-0.01em; }
  .home-title .gold { color: var(--gold); }
  .home-sub { font-size:14px; color: var(--gray); letter-spacing:0.15em; text-transform:uppercase;
    margin-top:10px; font-weight:300; }
  .home-quote { font-family: var(--ff-display); font-size:17px; font-style:italic;
    color: var(--creamD); max-width:460px; margin: 24px auto 0; line-height:1.7; }
  .mantra-bar { display:flex; justify-content:center; gap:24px; margin: 28px 0;
    font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color: var(--gold); }
  .mantra-bar span { opacity:0.6; }
  .home-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:8px; }
  .home-card { padding:16px; border-radius:10px; border:1px solid rgba(200,134,10,0.2);
    background: rgba(255,255,255,0.02); cursor:pointer; transition: all .2s; }
  .home-card:hover { border-color: rgba(200,134,10,0.5); background: rgba(200,134,10,0.06); transform:translateY(-2px); }
  .home-card-num { font-size:10px; letter-spacing:0.2em; color: var(--gray); text-transform:uppercase; margin-bottom:6px; }
  .home-card-title { font-family: var(--ff-display); font-size:16px; font-weight:600; color:var(--cream); margin-bottom:4px; }
  .home-card-desc { font-size:12px; color: var(--gray); line-height:1.5; }
  .btn-primary { width:100%; padding:14px; border-radius:8px; background: var(--gold);
    color: var(--ink); font-family:var(--ff-body); font-size:13px; font-weight:600;
    letter-spacing:0.1em; text-transform:uppercase; border:none; cursor:pointer;
    transition: opacity .2s; margin-top:16px; }
  .btn-primary:hover { opacity:.85; }
  .btn-secondary { width:100%; padding:13px; border-radius:8px; background:transparent;
    color: var(--gold); font-family:var(--ff-body); font-size:13px; font-weight:500;
    letter-spacing:0.08em; text-transform:uppercase; border:1px solid var(--gold);
    cursor:pointer; transition: background .2s; margin-top:8px; }
  .btn-secondary:hover { background: rgba(200,134,10,0.1); }

  /* SECTION HEADERS */
  .sec-header { margin-bottom:28px; }
  .sec-eyebrow { font-size:10px; letter-spacing:0.25em; color:var(--gold);
    text-transform:uppercase; margin-bottom:8px; font-weight:500; }
  .sec-title { font-family:var(--ff-display); font-size:32px; font-weight:600;
    color:var(--cream); line-height:1.2; }
  .sec-desc { font-size:14px; color:var(--gray); margin-top:8px; line-height:1.6; }

  /* DIAGNOSTIC */
  .diag-progress { height:3px; background:rgba(255,255,255,0.1); border-radius:2px;
    margin-bottom:24px; overflow:hidden; }
  .diag-progress-bar { height:100%; background:var(--gold); border-radius:2px; transition: width .4s; }
  .diag-q-card { padding:20px; border-radius:10px; background:rgba(255,255,255,0.03);
    border:1px solid rgba(255,255,255,0.08); margin-bottom:14px; }
  .diag-q-num { font-size:10px; color:var(--gray); letter-spacing:0.2em; text-transform:uppercase; margin-bottom:8px; }
  .diag-q-text { font-family:var(--ff-display); font-size:18px; color:var(--cream);
    line-height:1.5; margin-bottom:16px; font-weight:400; }
  .likert { display:flex; gap:6px; }
  .likert-btn { flex:1; padding:8px 4px; border-radius:6px; border:1px solid rgba(255,255,255,0.12);
    background:rgba(255,255,255,0.03); color:var(--gray); font-size:10px; text-align:center;
    cursor:pointer; transition: all .15s; line-height:1.3; }
  .likert-btn:hover { border-color:var(--gold); color:var(--cream); }
  .likert-btn.selected { background:var(--gold); border-color:var(--gold); color:var(--ink); font-weight:600; }
  .likert-num { font-size:16px; font-family:var(--ff-display); font-weight:600;
    display:block; margin-bottom:2px; }

  /* PROFILE RESULT */
  .profile-card { border-radius:12px; overflow:hidden; margin-bottom:16px; }
  .profile-header { padding:24px; display:flex; align-items:center; gap:16px; }
  .profile-icon { width:56px; height:56px; border-radius:50%; display:flex;
    align-items:center; justify-content:center; font-family:var(--ff-display);
    font-size:22px; font-weight:600; color:#fff; flex-shrink:0; }
  .profile-name { font-family:var(--ff-display); font-size:26px; font-weight:600; color:#fff; }
  .profile-quechua { font-size:12px; color:rgba(255,255,255,0.7); font-style:italic; }
  .profile-body { padding:20px; background:rgba(255,255,255,0.03);
    border:1px solid rgba(255,255,255,0.08); border-top:none; border-radius:0 0 12px 12px; }
  .profile-desc { font-size:14px; color:var(--creamD); line-height:1.6; margin-bottom:14px; }
  .profile-item { display:flex; gap:10px; margin-bottom:8px; font-size:13px; }
  .profile-label { color:var(--gold); font-weight:500; min-width:120px; }
  .profile-value { color:var(--gray); }

  /* QUADS */
  .quad-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px; }
  .quad-card { padding:14px; border-radius:8px; border:1px solid rgba(255,255,255,0.08); }
  .quad-name { font-family:var(--ff-display); font-size:15px; font-weight:600;
    margin-bottom:2px; }
  .quad-sub { font-size:11px; color:var(--gray); margin-bottom:10px; }
  .quad-bar { height:4px; background:rgba(255,255,255,0.1); border-radius:2px; overflow:hidden; }
  .quad-fill { height:100%; border-radius:2px; transition: width .6s ease; }

  /* REGISTRO */
  .reg-q { margin-bottom:20px; }
  .reg-label { font-family:var(--ff-display); font-size:18px; color:var(--cream);
    margin-bottom:6px; font-weight:400; line-height:1.4; }
  .reg-hint { font-size:12px; color:var(--gray); margin-bottom:10px; }
  .reg-textarea { width:100%; padding:12px 14px; border-radius:8px; font-size:14px;
    font-family:var(--ff-body); background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.1); color:var(--cream); resize:none;
    transition: border-color .2s; outline:none; }
  .reg-textarea:focus { border-color:var(--gold); }
  .reg-textarea::placeholder { color:rgba(138,122,101,0.5); }

  /* MANTRA */
  .mantra-screen { text-align:center; }
  .mantra-word { font-family:var(--ff-display); font-size:clamp(48px,12vw,80px);
    font-weight:700; line-height:1; margin-bottom:6px; transition: all .4s; }
  .mantra-meaning { font-size:14px; color:var(--gray); margin-bottom:4px; }
  .mantra-zone { font-size:11px; letter-spacing:0.15em; text-transform:uppercase; color:var(--gold); }
  .mantra-dots { display:flex; justify-content:center; gap:8px; margin:24px 0; }
  .mantra-dot { width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,0.15);
    cursor:pointer; transition: all .2s; }
  .mantra-dot.active { background:var(--gold); transform:scale(1.3); }
  .breath-circle { width:100px; height:100px; border-radius:50%; margin:24px auto;
    border:2px solid rgba(200,134,10,0.4); display:flex; align-items:center;
    justify-content:center; font-size:12px; color:var(--gray);
    animation: breathe 10s ease-in-out infinite; }
  @keyframes breathe {
    0%,100% { transform:scale(1); border-color:rgba(200,134,10,0.3); }
    50% { transform:scale(1.15); border-color:rgba(200,134,10,0.8); }
  }

  /* GLOSARIO */
  .glos-item { padding:16px; border-radius:8px; border:1px solid rgba(255,255,255,0.07);
    margin-bottom:10px; cursor:pointer; transition: all .2s; }
  .glos-item:hover { border-color:rgba(200,134,10,0.3); background:rgba(200,134,10,0.04); }
  .glos-term { font-family:var(--ff-display); font-size:20px; font-weight:600; color:var(--gold); }
  .glos-pron { font-size:11px; color:var(--gray); margin-bottom:4px; }
  .glos-trans { font-size:13px; color:var(--creamD); font-style:italic; }
  .glos-def { font-size:13px; color:var(--gray); margin-top:8px; line-height:1.6;
    display:none; }
  .glos-def.open { display:block; }

  /* AI CHAT */
  .chat-history { max-height:320px; overflow-y:auto; margin-bottom:16px;
    display:flex; flex-direction:column; gap:12px; }
  .msg { max-width:85%; padding:12px 14px; border-radius:10px; font-size:14px; line-height:1.6; }
  .msg.user { align-self:flex-end; background:rgba(200,134,10,0.2);
    border:1px solid rgba(200,134,10,0.3); color:var(--cream); border-radius:10px 10px 2px 10px; }
  .msg.ai { align-self:flex-start; background:rgba(255,255,255,0.05);
    border:1px solid rgba(255,255,255,0.1); color:var(--creamD); border-radius:10px 10px 10px 2px; }
  .msg.ai .msg-label { font-size:10px; letter-spacing:0.15em; text-transform:uppercase;
    color:var(--gold); margin-bottom:4px; font-weight:500; }
  .chat-input-row { display:flex; gap:8px; }
  .chat-input { flex:1; padding:12px 14px; border-radius:8px; font-family:var(--ff-body);
    font-size:14px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12);
    color:var(--cream); outline:none; transition: border-color .2s; }
  .chat-input:focus { border-color:var(--gold); }
  .chat-send { padding:12px 18px; border-radius:8px; background:var(--gold);
    color:var(--ink); font-weight:600; font-size:13px; border:none; cursor:pointer;
    transition: opacity .2s; font-family:var(--ff-body); }
  .chat-send:hover { opacity:.85; }
  .chat-send:disabled { opacity:.4; cursor:not-allowed; }
  .typing { display:flex; gap:4px; padding:4px; }
  .typing span { width:6px; height:6px; background:var(--gold); border-radius:50%; animation: blink 1.2s infinite; }
  .typing span:nth-child(2) { animation-delay:.2s; }
  .typing span:nth-child(3) { animation-delay:.4s; }
  @keyframes blink { 0%,80%,100%{opacity:.2} 40%{opacity:1} }

  /* DIVIDER */
  .divider { display:flex; align-items:center; gap:12px; margin:24px 0; }
  .divider-line { flex:1; height:1px; background:rgba(200,134,10,0.2); }
  .divider-sym { color:var(--gold); font-size:14px; }

  /* MISC */
  .tag { display:inline-block; padding:3px 8px; border-radius:12px; font-size:10px;
    letter-spacing:0.1em; text-transform:uppercase; border:1px solid; }
  .badge { display:inline-flex; align-items:center; gap:6px; padding:5px 10px;
    border-radius:20px; font-size:11px; background:rgba(200,134,10,0.12);
    border:1px solid rgba(200,134,10,0.25); color:var(--gold); }
  .scroll-hint { text-align:center; font-size:11px; color:var(--gray);
    letter-spacing:0.1em; margin-top:24px; }
`;

// ── Component helpers ───────────────────────────────────────────────────────
function Divider() {
  return <div className="divider"><div className="divider-line"/><span className="divider-sym">✦</span><div className="divider-line"/></div>;
}

function FormaTag({ forma }) {
  const f = FORMAS.find(x => x.key === forma);
  if (!f) return null;
  return <span className="tag" style={{ color: f.color, borderColor: f.color + "44" }}>{f.name}</span>;
}

// ── SCREENS ─────────────────────────────────────────────────────────────────

function HomeScreen({ onNav, perfil }) {
  return (
    <div className="screen">
      <div className="home-hero">
        <div className="home-title">
          <span className="gold">Amaut</span>App
        </div>
        <div className="home-sub">Código Tawantin · Manual del Pururauca</div>
        <div className="home-quote">
          "La verdadera maestría no consiste en acumular más ideas,<br/>
          sino en despejar el espacio interior."
        </div>
        <div className="mantra-bar">
          <span>Ayni</span>·<span>Yanantin</span>·<span>Masintin</span>·<span>Tawantin</span>
        </div>
      </div>

      {perfil && (
        <>
          <div style={{ marginBottom:8 }}>
            <div className="sec-eyebrow">Tu perfil de entrada</div>
            <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px",
              borderRadius:8, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background: FORMAS.find(f=>f.key===perfil)?.color,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:"#fff",
                fontFamily:"'Cormorant Garamond',serif", fontWeight:600 }}>
                {FORMAS.find(f=>f.key===perfil)?.name[0]}
              </div>
              <div>
                <div style={{ fontSize:14, color:"var(--cream)", fontWeight:500 }}>
                  {FORMAS.find(f=>f.key===perfil)?.name}
                </div>
                <div style={{ fontSize:11, color:"var(--gray)" }}>
                  {FORMAS.find(f=>f.key===perfil)?.quechua}
                </div>
              </div>
              <div style={{ marginLeft:"auto" }}>
                <span className="badge">Activo</span>
              </div>
            </div>
          </div>
          <Divider />
        </>
      )}

      <div className="home-grid">
        {[
          { tab:"diagnostico", num:"I", title:"Diagnóstico de Entrada", desc:"Calibra tu punto de partida en 25 minutos" },
          { tab:"amanecer", num:"II", title:"Registro del Amanecer", desc:"Las tres preguntas del día" },
          { tab:"mantra", num:"III", title:"El Mantra", desc:"Ayni · Yanantin · Masintin · Tawantin" },
          { tab:"atardecer", num:"IV", title:"Registro del Atardecer", desc:"Tejiendo el Quipu del día" },
          { tab:"glosario", num:"V", title:"Glosario Andino", desc:"Los términos del Código Tawantin" },
          { tab:"amautu", num:"VI", title:"Amautu", desc:"El asistente IA del Código Tawantin" },
        ].map(c => (
          <div key={c.tab} className="home-card" onClick={() => onNav(c.tab)}>
            <div className="home-card-num">Parte {c.num}</div>
            <div className="home-card-title">{c.title}</div>
            <div className="home-card-desc">{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiagnosticoScreen({ onComplete }) {
  const [step, setStep] = useState(0); // 0=intro, 1-25=questions, 26=result
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);

  const q = DIAG_Q[current];
  const progress = current / DIAG_Q.length;

  function answer(val) {
    const newA = { ...answers, [q.id]: val };
    setAnswers(newA);
    if (current < DIAG_Q.length - 1) {
      setTimeout(() => setCurrent(c => c + 1), 300);
    } else {
      // Calculate profile
      const scores = {};
      FORMAS.forEach(f => {
        const qs = DIAG_Q.filter(x => x.forma === f.key);
        scores[f.key] = qs.reduce((s, x) => s + (newA[x.id] || 3), 0) / qs.length;
      });
      const top = Object.entries(scores).sort((a,b) => b[1]-a[1])[0][0];
      setStep(26);
      setTimeout(() => onComplete(top), 100);
    }
  }

  if (step === 0) return (
    <div className="screen">
      <div className="sec-header">
        <div className="sec-eyebrow">Diagnóstico de Entrada</div>
        <div className="sec-title">El primer nudo del Quipu</div>
        <div className="sec-desc">25 preguntas sobre tus patrones reales de conducta. Responde desde lo que haces, no desde lo que deseas hacer. La precisión del sistema depende de tu honestidad.</div>
      </div>
      <div style={{ padding:"16px", borderRadius:8, background:"rgba(200,134,10,0.08)",
        border:"1px solid rgba(200,134,10,0.2)", marginBottom:20 }}>
        <div style={{ fontSize:12, color:"var(--gold)", marginBottom:6, fontWeight:500 }}>Antes de comenzar</div>
        <div style={{ fontSize:13, color:"var(--gray)", lineHeight:1.6 }}>
          Realiza 3 respiraciones lentas: 5 segundos de inhalación, 5 de exhalación. Luego responde desde ese estado de calma.
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {FORMAS.map(f => (
          <div key={f.key} style={{ display:"flex", gap:10, alignItems:"center", padding:"10px 12px",
            borderRadius:6, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:f.color, flexShrink:0 }}/>
            <div style={{ fontSize:13, color:"var(--gray)" }}>
              <span style={{ color:"var(--cream)", fontWeight:500 }}>{f.name}</span> — {f.desc}
            </div>
          </div>
        ))}
      </div>
      <button className="btn-primary" onClick={() => setStep(1)}>Comenzar el Diagnóstico</button>
    </div>
  );

  if (step === 26) return (
    <div className="screen">
      <div className="sec-header">
        <div className="sec-eyebrow">Diagnóstico completado</div>
        <div className="sec-title">Calculando tu perfil...</div>
      </div>
      <div className="breath-circle">✦</div>
    </div>
  );

  return (
    <div className="screen">
      <div className="diag-progress">
        <div className="diag-progress-bar" style={{ width: `${progress*100}%` }}/>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
        <div className="sec-eyebrow">Pregunta {current+1} de {DIAG_Q.length}</div>
        <FormaTag forma={q.forma}/>
      </div>
      <div className="diag-q-card">
        <div className="diag-q-num">Escala 1–5</div>
        <div className="diag-q-text">{q.text}</div>
        <div className="likert">
          {[1,2,3,4,5].map(n => (
            <button key={n} className={`likert-btn ${answers[q.id]===n?"selected":""}`}
              onClick={() => answer(n)}>
              <span className="likert-num">{n}</span>
              {LIKERT[n-1]}
            </button>
          ))}
        </div>
      </div>
      <div style={{ fontSize:11, color:"var(--gray)", textAlign:"center", marginTop:12 }}>
        Responde desde tu conducta real, no desde la ideal
      </div>
    </div>
  );
}

function PerfilScreen({ perfil }) {
  const f = FORMAS.find(x => x.key === perfil);
  if (!f) return null;

  const descs = {
    guerrero: "Tu fuerza es real y evidente. El trabajo inicial de AmautApp es acompañar la transformación de esa fuerza: de la que lucha a la que protege, de la que reacciona a la que elige.",
    guardian: "Tu estructura es tu fortaleza. Has construido hábitos y orden que sostienen tu vida. El trabajo inicial es transformar el 'tengo que' en 'elijo'.",
    descubridor: "Tu mente es tu mayor activo. Has desarrollado la capacidad de entender sistemas y ver patrones. El trabajo inicial es bajar ese entendimiento del concepto al cuerpo.",
    guia: "Tu capacidad de cuidar a otros es genuina. El trabajo inicial es asegurar que ese cuidado fluya desde la abundancia y no desde el sacrificio.",
    maestro: "Tu nivel de integración es poco frecuente. El trabajo inicial es el más sutil: mantener el enraizamiento en lo concreto mientras la visión se expande.",
  };

  const primerPaso = {
    guerrero: "Respiración de Coherencia diaria antes del Registro del Amanecer.",
    guardian: "La pregunta radical de la semana: elige un hábito y pregúntate por qué lo haces.",
    descubridor: "La pregunta encarnada: antes del Registro, lleva la atención al pecho 60 segundos.",
    guia: "Una acción de cuidado propio no negociable cada día.",
    maestro: "Sincronización naturalista: los primeros tres días, el Registro al aire libre.",
  };

  return (
    <div className="screen">
      <div className="sec-header">
        <div className="sec-eyebrow">Tu perfil de entrada</div>
        <div className="sec-title">El Quipu ha hablado</div>
      </div>

      <div className="profile-card">
        <div className="profile-header" style={{ background: f.color }}>
          <div className="profile-icon" style={{ background:"rgba(0,0,0,0.2)" }}>
            {f.name[0]}
          </div>
          <div>
            <div className="profile-name">{f.name}</div>
            <div className="profile-quechua">{f.quechua} · Wilber {f.wilber}</div>
          </div>
        </div>
        <div className="profile-body">
          <div className="profile-desc">{descs[f.key]}</div>
          <div className="profile-item">
            <span className="profile-label">Primer paso</span>
            <span className="profile-value">{primerPaso[f.key]}</span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Hardware día 1</span>
            <span className="profile-value">{f.key === "guerrero" ? "Liberación del psoas — 5 min" : f.key === "guardian" ? "Espiral de columna — 5 min" : f.key === "descubridor" ? "Liberación cervical — 5 min" : f.key === "guia" ? "Apertura torácica — 5 min" : "Movimiento espiral completo"}</span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Mantra énfasis</span>
            <span className="profile-value">{f.key === "guerrero" ? "AYNI — plexo solar" : f.key === "guardian" ? "YANANTIN — pecho" : f.key === "descubridor" ? "MASINTIN — hombros" : f.key === "guia" ? "TAWANTIN — todo el cuerpo" : "Las cuatro en equilibrio"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AmanecerScreen() {
  const [answers, setAnswers] = useState({});
  const [sent, setSent] = useState(false);

  function send() {
    if (Object.keys(answers).length < 3) return;
    setSent(true);
  }

  if (sent) return (
    <div className="screen">
      <div className="sec-header">
        <div className="sec-eyebrow">Registro del Amanecer</div>
        <div className="sec-title">El día está orientado</div>
      </div>
      <div style={{ padding:"20px", borderRadius:10, background:"rgba(200,134,10,0.08)",
        border:"1px solid rgba(200,134,10,0.25)", marginBottom:16 }}>
        <div style={{ fontSize:13, color:"var(--gold)", marginBottom:8, fontWeight:500 }}>Calibración del sistema</div>
        <div style={{ fontSize:13, color:"var(--gray)", lineHeight:1.7 }}>
          AmautApp ha recibido tus tres coordenadas. Hoy el hardware prioritario es la <strong style={{color:"var(--cream)"}}>Respiración de Coherencia</strong> antes de tu primera reunión. Tu primera misión del día corresponde al cuadrante <strong style={{color:"var(--cream)"}}>Sapa Ukhu</strong>: observa y transforma un «tengo que» en «elijo».
        </div>
      </div>
      <div className="mantra-bar" style={{ margin:"20px 0" }}>
        <span>Ayni</span>·<span>Yanantin</span>·<span>Masintin</span>·<span>Tawantin</span>
      </div>
      <div style={{ fontSize:13, color:"var(--gray)", textAlign:"center", lineHeight:1.6 }}>
        El sistema registra que hoy tu Quipu tiene un hilo nuevo.<br/>
        Regresa esta tarde para el Registro del Atardecer.
      </div>
    </div>
  );

  return (
    <div className="screen">
      <div className="sec-header">
        <div className="sec-eyebrow">☀ Registro del Amanecer</div>
        <div className="sec-title">Tres coordenadas<br/>antes del día</div>
        <div className="sec-desc">Responde antes de revisar el teléfono. El amanecer es el momento más limpio del día.</div>
      </div>
      <div style={{ padding:"12px 14px", borderRadius:8, background:"rgba(200,134,10,0.06)",
        border:"1px solid rgba(200,134,10,0.15)", marginBottom:20, fontSize:12, color:"var(--gray)" }}>
        <span style={{color:"var(--gold)"}}>Preparación: </span>
        3 ciclos de Respiración de Coherencia (5s entrada / 5s salida) antes de responder.
      </div>
      {AMANECER_Q.map(q => (
        <div key={q.id} className="reg-q">
          <div className="reg-label">{q.label}</div>
          <div className="reg-hint">{q.hint}</div>
          <textarea className="reg-textarea" rows={3}
            placeholder="Escribe desde la observación honesta..."
            value={answers[q.id] || ""}
            onChange={e => setAnswers({...answers, [q.id]: e.target.value})}/>
        </div>
      ))}
      <button className="btn-primary" onClick={send}
        disabled={Object.keys(answers).filter(k=>answers[k].trim()).length < 3}>
        Entregar al Sistema
      </button>
    </div>
  );
}

function MantraScreen() {
  const [idx, setIdx] = useState(0);
  const [mode, setMode] = useState("explore"); // explore | practice
  const [breath, setBreath] = useState("inhala");
  const w = MANTRA_WORDS[idx];

  useEffect(() => {
    if (mode !== "practice") return;
    const iv = setInterval(() => setBreath(b => b === "inhala" ? "exhala" : "inhala"), 5000);
    return () => clearInterval(iv);
  }, [mode]);

  return (
    <div className="screen mantra-screen">
      <div className="sec-header" style={{textAlign:"center"}}>
        <div className="sec-eyebrow">El Mantra</div>
        <div className="sec-title">La llave que abre<br/>los cuatro mundos</div>
      </div>

      <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:24 }}>
        <button className={`nav-tab ${mode==="explore"?"active":""}`} onClick={()=>setMode("explore")}>Explorar</button>
        <button className={`nav-tab ${mode==="practice"?"active":""}`} onClick={()=>setMode("practice")}>Practicar</button>
      </div>

      {mode === "explore" ? (
        <>
          <div className="mantra-word" style={{ color: w.color }}>{w.word}</div>
          <div className="mantra-meaning">{w.meaning}</div>
          <div className="mantra-zone">{w.zone} · {w.cuad}</div>
          <div className="mantra-dots">
            {MANTRA_WORDS.map((_, i) => (
              <div key={i} className={`mantra-dot ${i===idx?"active":""}`}
                onClick={() => setIdx(i)}/>
            ))}
          </div>
          <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
            {MANTRA_WORDS.map((mw, i) => (
              <button key={i} className="nav-tab" style={{ color: i===idx ? mw.color : undefined }}
                onClick={() => setIdx(i)}>{mw.word}</button>
            ))}
          </div>
          <div style={{ marginTop:24, padding:"16px", borderRadius:8,
            background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
            fontSize:13, color:"var(--gray)", lineHeight:1.6, textAlign:"left" }}>
            <div style={{color:"var(--gold)", marginBottom:6, fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase"}}>Intención al pronunciar</div>
            {idx === 0 && "Lleva la atención al plexo solar. Imagina una corriente dorada que sale de tu centro hacia el tejido que te rodea y regresa amplificada."}
            {idx === 1 && "Lleva la atención al pecho. Trae dos fuerzas en tensión dentro de ti. Imagínalas girando juntas en lugar de anularse."}
            {idx === 2 && "Lleva la atención a los hombros. Visualiza a tu derecha e izquierda a los seres que comparten tu camino."}
            {idx === 3 && "Lleva la atención a todo el cuerpo a la vez. Los cuatro cuadrantes iluminados en simultáneo. Completo, ahora mismo."}
          </div>
        </>
      ) : (
        <>
          <div className="breath-circle">{breath}</div>
          <div style={{ fontSize:12, color:"var(--gray)", marginBottom:16 }}>
            5 segundos entrada · 5 segundos salida
          </div>
          <div style={{ fontSize:13, color:"var(--gray)", marginBottom:20 }}>
            Cuando el ritmo esté estable, pronuncia cada palabra con la respiración:
          </div>
          {MANTRA_WORDS.map((mw, i) => (
            <div key={i} style={{ padding:"12px 16px", borderRadius:8, marginBottom:8,
              background:`${mw.color}15`, border:`1px solid ${mw.color}30`,
              display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, color:mw.color }}>{mw.word}</span>
              <span style={{ fontSize:11, color:"var(--gray)" }}>{mw.zone}</span>
            </div>
          ))}
          <div style={{ textAlign:"center", fontSize:12, color:"var(--gray)", marginTop:16 }}>
            Versión estándar: 3 respiraciones por palabra · 8–10 minutos
          </div>
        </>
      )}
    </div>
  );
}

function AtardecerScreen() {
  const [answers, setAnswers] = useState({});
  const [sent, setSent] = useState(false);

  if (sent) return (
    <div className="screen">
      <div className="sec-header">
        <div className="sec-eyebrow">🌙 Registro del Atardecer</div>
        <div className="sec-title">El Quipu tiene<br/>un nudo nuevo</div>
      </div>
      <div style={{ padding:"20px", borderRadius:10, background:"rgba(255,255,255,0.03)",
        border:"1px solid rgba(255,255,255,0.08)", marginBottom:16 }}>
        <div style={{ fontSize:13, color:"var(--gold)", marginBottom:10, fontWeight:500 }}>Lectura del sistema</div>
        <div style={{ fontSize:13, color:"var(--gray)", lineHeight:1.7 }}>
          El sistema ha registrado los cuatro nudos del día. El patrón de hoy se suma al tejido de la semana. Mañana el Registro del Amanecer comenzará desde este punto.<br/><br/>
          <span style={{color:"var(--cream)"}}>Para cerrar:</span> activa el mantra en versión estándar. Lo que viviste hoy pertenece al tejido.
        </div>
      </div>
      <div style={{ textAlign:"center", padding:"20px 0", fontFamily:"'Cormorant Garamond',serif",
        fontSize:22, color:"var(--gold)", fontStyle:"italic" }}>
        Ayni
      </div>
    </div>
  );

  return (
    <div className="screen">
      <div className="sec-header">
        <div className="sec-eyebrow">🌙 Registro del Atardecer</div>
        <div className="sec-title">Tejiendo el día</div>
        <div className="sec-desc">No es evaluación. Es convertir la experiencia en aprendizaje registrado.</div>
      </div>
      <div style={{ padding:"12px 14px", borderRadius:8, background:"rgba(255,255,255,0.03)",
        border:"1px solid rgba(255,255,255,0.08)", marginBottom:20, fontSize:12, color:"var(--gray)" }}>
        <span style={{color:"var(--gold)"}}>Preparación: </span>
        3 ciclos de Respiración de Coherencia para salir del modo hacer y entrar al modo observar.
      </div>
      {ATARDECER_Q.map(q => (
        <div key={q.id} className="reg-q">
          <div className="reg-label">{q.label}</div>
          <div className="reg-hint">{q.hint}</div>
          <textarea className="reg-textarea" rows={q.id === "nudos" ? 4 : 3}
            placeholder="Observa sin juzgar..."
            value={answers[q.id] || ""}
            onChange={e => setAnswers({...answers, [q.id]: e.target.value})}/>
        </div>
      ))}
      <button className="btn-primary" onClick={() => setSent(true)}
        disabled={Object.keys(answers).filter(k=>answers[k].trim()).length < 4}>
        Entregar al Quipu
      </button>
    </div>
  );
}

function GlosarioScreen() {
  const [open, setOpen] = useState(null);

  const TERMINOS = [
    { term:"Ayni", pron:"AY-ni", trans:"Reciprocidad sagrada / Ley de correspondencia",
      def:"La ley fundamental de la cosmovisión andina: lo que das al universo, el universo te devuelve. No como transacción comercial sino como principio cósmico de flujo y equilibrio. En AmautApp, el Yanapay diario es la expresión concreta del Ayni en el cuarto cuadrante." },
    { term:"-ntin", pron:"sufijo quechua", trans:"En relación de totalidad / Con su par complementario y sus semejantes",
      def:"El corazón del Código Tawantin. Opera en dos dimensiones: integra lo opuesto (Yanantin) y fortalece lo semejante (Masintin). Esto lo distingue del Yin-Yang, que solo describe opuestos. Tawa + ntin = Tawantin: no cuatro partes sumadas, sino una unidad viva." },
    { term:"Yanantin", pron:"ya-NAN-tin", trans:"La danza creativa de los opuestos",
      def:"El principio de la complementariedad entre pares opuestos: masculino-femenino, luz-sombra, yo-otro. El Yanantin no pide que los opuestos se neutralicen sino que se reconozcan como necesarios el uno para el otro. En AmautApp activa el ejercicio del Big Mind." },
    { term:"Masintin", pron:"ma-SIN-tin", trans:"La solidaridad con los iguales",
      def:"El principio de la solidaridad entre semejantes: la capacidad de verse reflejado en quien comparte el mismo nivel de experiencia o búsqueda. Corresponde al cuadrante Tinkuy Yuyay: la cultura, el linaje y los vínculos que nos formaron." },
    { term:"Tawantin", pron:"ta-WAN-tin", trans:"La totalidad integrada de las cuatro dimensiones",
      def:"El resultado del Yanantin y el Masintin articulados por el -ntin. Toda persona tiene su propio Tawantinsuyo personal. Lo mismo aplica a familias, equipos y organizaciones. El -ntin es el operador que articula todo: sin él, hay cuatro partes; con él, hay un organismo." },
    { term:"Kawsay", pron:"KAW-say", trans:"Vida / Energía vital",
      def:"No simplemente vida biológica sino la energía vital que anima toda forma de existencia. El Kawsay es lo que fluye cuando el sistema está integrado y lo que se bloquea cuando la fragmentación se instala. Las 5 Formas de Kawsay describen cómo esta energía se expresa según el nivel evolutivo." },
    { term:"Pururauca", pron:"pu-ru-RAU-ka", trans:"El que ha despertado",
      def:"En la historia de Pachacútec, los Pururaucas eran piedras que cobraron vida y se convirtieron en guerreros. En AmautApp, el Pururauca es el ser humano que ha despertado a su proceso evolutivo consciente: el que ya no reacciona desde el automático sino que elige." },
    { term:"Allin Kawsay", pron:"A-llin KAW-say", trans:"La vida plena / El buen vivir",
      def:"El estado de plenitud integral que el Código Tawantin propone como horizonte. No es la ausencia de dificultades sino la capacidad de habitarlas desde la integración. En biología corresponde al estado ventral vagal: la biología de la seguridad y la creatividad." },
    { term:"Pachamama", pron:"pa-cha-MA-ma", trans:"Madre Tierra / La tierra como ser vivo",
      def:"En la cosmovisión andina, la tierra no es un recurso sino una maestra viva cuya inteligencia precede y excede a la humana. La inteligencia naturalista del sistema ANI de AmautApp se activa por contacto directo con los ciclos de la Pachamama." },
    { term:"Amautu", pron:"a-MAU-tu", trans:"El sabio que enseña",
      def:"En la tradición andina, el Amautu era el maestro que no acumula conocimiento para sí mismo sino que lo transmite y lo encarna. AmautApp lleva este nombre porque actúa como Amautu digital: espejo sagrado, no juez. Cuando calibra y devuelve una lectura, habla como el Amautu hablaría." },
  ];

  return (
    <div className="screen">
      <div className="sec-header">
        <div className="sec-eyebrow">Glosario Andino</div>
        <div className="sec-title">Los términos del<br/>Código Tawantin</div>
        <div className="sec-desc">Toca cualquier término para leer su definición completa en el contexto del sistema.</div>
      </div>
      {TERMINOS.map(t => (
        <div key={t.term} className="glos-item" onClick={() => setOpen(open===t.term ? null : t.term)}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div className="glos-term">{t.term}</div>
              <div className="glos-pron">{t.pron}</div>
              <div className="glos-trans">{t.trans}</div>
            </div>
            <div style={{ color:"var(--gold)", fontSize:16, marginTop:4 }}>
              {open===t.term ? "−" : "+"}
            </div>
          </div>
          <div className={`glos-def ${open===t.term?"open":""}`}>{t.def}</div>
        </div>
      ))}
    </div>
  );
}

function AmautuScreen({ perfil }) {
  const WEBHOOK_URL = "https://hook.us2.make.com/gnntvqqskg6b7y8n8kmlsrvm8qiv77am";

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hola Pururauca. Soy el Amautu, el asistente del Código Tawantin. Puedes preguntarme sobre las Formas de Kawsay, el significado de los términos andinos, cómo usar AmautApp, o explorar cualquier concepto del libro. ¿Por dónde comenzamos?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const perfilNombre = perfil ? (FORMAS.find(f => f.key === perfil)?.name || "") : "";
  const perfilQuechua = perfil ? (FORMAS.find(f => f.key === perfil)?.quechua || "") : "";

  const buildSystemPrompt = () => {
    const lines = [
      "Eres el Amautu, el asistente de IA del Código Tawantin y AmautApp, creados por Vidal Herly Llerena García.",
      "",
      "SOBRE EL CÓDIGO TAWANTIN:",
      "Es un sistema de desarrollo humano que integra la cosmovisión andina, la Teoría Integral de Ken Wilber, neurociencia y filosofía comparada.",
      "Mantra central: Ayni · Yanantin · Masintin · Tawantin",
      "5 Formas de Kawsay: Guerrero (Aucayoc), Guardián (Kamayoc), Descubridor (Hamutay), Guía (Pushac), Maestro (Kuraq)",
      "4 cuadrantes: Sapa Ukhu (subjetivo), Sapa Hawa (objetivo), Tinkuy Yuyay (intersubjetivo), Lliu Hawa (interobjetivo)",
      "El sufijo -ntin opera para opuestos (Yanantin) Y semejantes (Masintin), distinguiéndolo del Yin-Yang",
      "ANI trabaja 6 inteligencias: cognitiva, emocional, corporal, relacional, espiritual, naturalista",
      "Escala Hawkins: umbral 200 (Coraje) separa Fuerza del Poder. El Pururauca es el nombre del usuario.",
      "",
      perfil ? ("CONTEXTO DEL USUARIO: Forma de Kawsay predominante es " + perfilNombre + " (" + perfilQuechua + ").") : "",
      "",
      "ESTILO DE RESPUESTA:",
      "Habla desde la sabiduría, no desde la información académica.",
      "Usa términos quechuas naturalmente, explicándolos cuando sea relevante.",
      "Sé conciso pero profundo. Máximo 3-4 párrafos salvo que la pregunta requiera más.",
      "Conecta siempre la respuesta con la práctica concreta en AmautApp.",
      "Mantén el tono cálido del Amautu: ni condescendiente ni excesivamente formal.",
    ];
    return lines.join("\n");
  };

  async function send() {
    if (!input.trim() || loading) return;

    const inputTexto = input.trim();
    setInput("");
    setLoading(true);
    setMessages(m => [...m, { role: "user", text: inputTexto }]);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: inputTexto }),
      });

      if (!response.ok) {
        throw new Error("Error " + response.status);
      }

      const data = await response.json();
      const aiText = data.reply || "El Amautu no pudo generar una respuesta. Inténtalo de nuevo.";
      setMessages(m => [...m, { role: "ai", text: aiText }]);

    } catch (e) {
      console.error("Amautu webhook error:", e);
      setMessages(m => [...m, { role: "ai", text: "Hubo un error de conexión con el Amautu. Inténtalo de nuevo." }]);
    } finally {
      setLoading(false);
    }
  }

  const suggestions = [
    "¿Qué es el sufijo -ntin?",
    "¿Cuál es mi práctica de hoy?",
    "¿Cómo funciona la ANI?",
    "Explícame el Protocolo de Crisis",
  ];

  return (
    <div className="screen">
      <div className="sec-header">
        <div className="sec-eyebrow">Amautu · IA del Código Tawantin</div>
        <div className="sec-title">El sabio que<br/>acompaña el tejido</div>
      </div>

      {messages.length === 1 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
          {suggestions.map(s => (
            <button key={s} onClick={() => setInput(s)}
              style={{ padding:"7px 12px", borderRadius:20, fontSize:12,
                background:"rgba(200,134,10,0.08)", border:"1px solid rgba(200,134,10,0.2)",
                color:"var(--gold)", cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="chat-history">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.role === "ai" && <div className="msg-label">Amautu</div>}
            <div style={{ whiteSpace:"pre-wrap" }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div className="msg ai">
            <div className="msg-label">Amautu</div>
            <div className="typing"><span/><span/><span/></div>
          </div>
        )}
        <div ref={endRef}/>
      </div>

      <div className="chat-input-row">
        <input className="chat-input" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==="Enter" && !e.shiftKey && send()}
          placeholder="Pregunta al Amautu..."
          disabled={loading}/>
        <button className="chat-send" onClick={send} disabled={loading||!input.trim()}>
          ↑
        </button>
      </div>
    </div>
  );
}

// ── APP ROOT ─────────────────────────────────────────────────────────────────
export default function AmautApp() {
  const [tab, setTab] = useState("home");
  const [perfil, setPerfil] = useState(null);
  const [diagDone, setDiagDone] = useState(false);

  function handleDiagComplete(p) {
    setPerfil(p);
    setDiagDone(true);
    setTab("perfil");
  }

  const TABS = [
    { id:"home", label:"Inicio" },
    { id:"diagnostico", label:"Diagnóstico" },
    { id:"amanecer", label:"Amanecer" },
    { id:"mantra", label:"Mantra" },
    { id:"atardecer", label:"Atardecer" },
    { id:"glosario", label:"Glosario" },
    { id:"amautu", label:"Amautu IA" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-logo">
            AmautApp
            <span>Código Tawantin</span>
          </div>
          <div className="nav-tabs">
            {TABS.slice(0,4).map(t => (
              <button key={t.id} className={`nav-tab ${tab===t.id?"active":""}`}
                onClick={() => setTab(t.id)}>{t.label}</button>
            ))}
          </div>
        </nav>

        {/* Secondary nav */}
        <div style={{ background:"rgba(13,10,6,0.8)", backdropFilter:"blur(8px)",
          borderBottom:"1px solid rgba(200,134,10,0.1)", padding:"8px 24px",
          display:"flex", gap:4, overflowX:"auto" }}>
          {TABS.slice(4).map(t => (
            <button key={t.id} className={`nav-tab ${tab===t.id||tab==="perfil"&&t.id==="diagnostico"?"active":""}`}
              onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
          {perfil && (
            <button className={`nav-tab ${tab==="perfil"?"active":""}`}
              onClick={() => setTab("perfil")}>
              Mi Perfil
            </button>
          )}
        </div>

        {/* Screens */}
        {tab === "home" && <HomeScreen onNav={setTab} perfil={perfil}/>}
        {tab === "diagnostico" && !diagDone && <DiagnosticoScreen onComplete={handleDiagComplete}/>}
        {tab === "diagnostico" && diagDone && <PerfilScreen perfil={perfil}/>}
        {tab === "perfil" && <PerfilScreen perfil={perfil}/>}
        {tab === "amanecer" && <AmanecerScreen/>}
        {tab === "mantra" && <MantraScreen/>}
        {tab === "atardecer" && <AtardecerScreen/>}
        {tab === "glosario" && <GlosarioScreen/>}
        {tab === "amautu" && <AmautuScreen perfil={perfil}/>}
      </div>
    </>
  );
}
