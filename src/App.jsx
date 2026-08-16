import { useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Menu, X } from 'lucide-react'
import { publications } from './data/publications'

const researchAreas = [
  {
    number: '01',
    title: 'Cross-linguistic influences of lexical semantics',
    description: 'How experience across languages shapes the way concepts are represented and connected to one another.',
  },
  {
    number: '02',
    title: 'Multimodal neuroimaging',
    description: 'Tracing the spatial and temporal dynamics of lexical semantic knowledge using a multimodal approach.',
  },
  {
    number: '03',
    title: 'Open science',
    description: 'Building FAIR and collaborative research practices in neuroscience.',
  },
]

const navItems = ['Research', 'About', 'Publications', 'Volunteer Experience']

function mulberry32(seed) {
  return () => {
    let value = (seed += 0x6d2b79f5)
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function BrainField() {
  const canvasRef = useRef(null)
  const pointerRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let width = 0
    let height = 0
    let lines = []

    const buildLines = () => {
      const random = mulberry32(4287)
      const groups = Array.from({ length: 43 }, (_, groupIndex) => ({
        angle: -Math.PI * 0.97 + (groupIndex / 42) * Math.PI * 1.94 + (random() - 0.5) * 0.08,
        offset: 74 + random() * 155,
        phase: random() * Math.PI * 2,
        bend: 0.22 + random() * 0.32,
        warmLane: Math.floor(random() * 5),
      }))
      lines = groups.flatMap((group, groupIndex) =>
        Array.from({ length: 5 }, (_, lane) => ({
          angle: group.angle + (lane - 2) * 0.011,
          offset: group.offset + lane * 5.5,
          phase: group.phase,
          bend: group.bend,
          width: lane === group.warmLane ? 1.08 : 0.48 + random() * 0.25,
          warm: lane === group.warmLane && groupIndex % 3 === 0,
          alpha: 0.17 + random() * 0.21,
        })),
      )
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildLines()
    }

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height)
      const drift = reducedMotion ? 0 : time * 0.000055
      const centerX = width * 0.9 + pointerRef.current.x * 16
      const centerY = height * 0.33 + pointerRef.current.y * 11
      const maxRadius = Math.max(width, height) * 1.05

      context.save()
      context.globalCompositeOperation = 'lighter'
      lines.forEach((line, index) => {
        context.beginPath()
        const steps = 150
        for (let step = 0; step <= steps; step += 1) {
          const progress = step / steps
          const radius = line.offset + progress * maxRadius
          const ripple =
            Math.sin(progress * 12.5 + line.phase + drift * (index % 2 ? 1 : -1)) * line.bend +
            Math.sin(progress * 30 + line.phase * 1.7) * 0.055 +
            Math.sin(progress * 61 + index) * 0.018
          const fan = Math.pow(progress, 0.78) * (index % 5 - 2) * 0.006
          const theta = line.angle + ripple + fan
          const x = centerX + Math.cos(theta) * radius * 1.04
          const y = centerY + Math.sin(theta) * radius * 0.76
          if (step === 0) context.moveTo(x, y)
          else context.lineTo(x, y)
        }
        context.lineWidth = line.width
        context.strokeStyle = line.warm
          ? `rgba(208, 111, 54, ${line.alpha + 0.16})`
          : `rgba(213, 215, 200, ${line.alpha})`
        context.shadowColor = line.warm ? 'rgba(183, 82, 35, .2)' : 'transparent'
        context.shadowBlur = line.warm ? 7 : 0
        context.stroke()
      })
      context.restore()

      if (!reducedMotion) frame = requestAnimationFrame(draw)
    }

    const onPointerMove = (event) => {
      pointerRef.current = {
        x: event.clientX / window.innerWidth - 0.5,
        y: event.clientY / window.innerHeight - 0.5,
      }
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="brain-field" aria-hidden="true" />
}

function Monogram() {
  return (
    <span className="monogram" aria-hidden="true">
      <span>A</span>
      <i />
      <span>L</span>
    </span>
  )
}

function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    return () => document.body.classList.remove('menu-open')
  }, [open])

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Abigail Licata, home">
        <Monogram />
        <span>Abigail Licata</span>
      </a>

      <button
        className="menu-toggle"
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="primary-navigation"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
      >
        {open ? <X /> : <Menu />}
      </button>

      <nav id="primary-navigation" className={open ? 'site-nav is-open' : 'site-nav'} aria-label="Primary navigation">
        {navItems.map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setOpen(false)}>
            {item}
          </a>
        ))}
        <a className="contact-link" href="mailto:abigail.licata@unige.ch">
          Contact <ArrowUpRight size={16} />
        </a>
      </nav>
    </header>
  )
}

function App() {
  return (
    <div className="site-shell" id="top">
      <BrainField />
      <div className="ambient-shade" aria-hidden="true" />
      <Header />

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">Abigail Licata</h1>
            <p className="role">PhD candidate in neuroscience at the University of Geneva.</p>
            <p className="statement">How languages shape<br />the conceptual brain.</p>
            <a className="primary-link" href="#research">
              Discover my research <ArrowDownRight size={19} />
            </a>
          </div>
          <span className="scroll-note" aria-hidden="true">Scroll to explore <i /></span>
        </section>

        <section className="research-section" id="research" aria-labelledby="research-title">
          <div className="section-heading">
            <span className="section-index">01</span>
            <h2 id="research-title">About the research</h2>
          </div>

          <div className="research-intro">
            <p>
              I study the neurocognitive correlates of semantic knowledge in bilingual
              and multilingual speakers.
            </p>
            <p>
              My doctoral project examines how semantic similarity and cross-linguistic
              experience shape conceptual representations in the brain.
            </p>
          </div>

          <div className="research-areas">
            {researchAreas.map((area) => (
              <article className="research-area" key={area.number}>
                <span className="area-number">{area.number}</span>
                <div>
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section" id="about" aria-labelledby="about-title">
          <div className="about-copy">
            <span className="section-index">02</span>
            <h2 id="about-title">Concepts live between languages.</h2>
            <p>
              I am a PhD candidate in the Lemanic Neuroscience Doctoral School and a
              member of the Neurobiology of Concepts Expression Laboratory at UNIGE.
              I use behavioural and neuroimaging methods to investigate how semantic
              knowledge is organised across languages.
            </p>
          </div>

          <dl className="profile-details">
            <div>
              <dt>Affiliation</dt>
              <dd>University of Geneva · FPSE</dd>
            </div>
            <div>
              <dt>Laboratory</dt>
              <dd><a href="https://noce-lab.github.io/" target="_blank" rel="noreferrer">NoCE Lab <ArrowUpRight size={14} /></a></dd>
            </div>
            <div>
              <dt>Doctoral school</dt>
              <dd>Lemanic Neuroscience Doctoral School</dd>
            </div>
            <div>
              <dt>Research network</dt>
              <dd>NCCR Evolving Language</dd>
            </div>
          </dl>
        </section>

        <section className="publications-section" id="publications" aria-labelledby="publications-title">
          <div className="publications-heading">
            <div>
              <span className="section-index">03</span>
              <h2 id="publications-title">Publications</h2>
            </div>
            <a
              className="scholar-link"
              href="https://scholar.google.com/scholar?q=%22Abigail+E.+Licata%22"
              target="_blank"
              rel="noreferrer"
            >
              Search on Google Scholar <ArrowUpRight size={16} />
            </a>
          </div>

          <div className="publication-list">
            {publications.map((publication, index) => (
              <article className={publication.featured ? 'publication is-featured' : 'publication'} key={publication.href}>
                <span className="publication-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="publication-year">{publication.year}</span>
                <div className="publication-copy">
                  <span className="publication-type">{publication.type}</span>
                  <h3>{publication.title}</h3>
                  <p>{publication.authors}</p>
                  <p className="publication-journal">{publication.journal}</p>
                </div>
                <a
                  className="publication-link"
                  href={publication.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open publication: ${publication.title}`}
                >
                  <ArrowUpRight size={20} />
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <span>Abigail Licata</span>
        <div className="footer-links">
          <a href="https://archive-ouverte.unige.ch/contributor/991158" target="_blank" rel="noreferrer">UNIGE archive <ArrowUpRight size={15} /></a>
          <a href="https://noce-lab.github.io/" target="_blank" rel="noreferrer">NoCE Lab <ArrowUpRight size={15} /></a>
          <a href="mailto:abigail.licata@unige.ch">Contact <ArrowUpRight size={15} /></a>
        </div>
        <span>Geneva · Switzerland</span>
      </footer>
    </div>
  )
}

export default App
