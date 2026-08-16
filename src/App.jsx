import { useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Menu, X } from 'lucide-react'
import { publications } from './data/publications'

const experiences = [
  {
    city: 'Geneva', country: 'Switzerland', x: 77, y: 46,
    entries: [
      ['2024–present', 'Graduate Teaching Assistant', 'University of Geneva'],
      ['2022–present', 'Ph.D. in Neuroscience · Graduate Research Assistant', 'University of Geneva · NoCE Lab'],
    ],
  },
  {
    city: 'San Sebastián', country: 'Spain', x: 62, y: 49,
    entries: [['Summer 2025', 'Guest Researcher', 'Brain Rhythms and Cognition Lab · Basque Center on Cognition, Brain and Language']],
  },
  {
    city: 'San Francisco', country: 'USA', x: 13, y: 49,
    entries: [['2020–2022', 'Staff Research Associate III · Imaging Data Assistant', 'UCSF Memory and Aging Center · ALBA Lab']],
  },
  {
    city: 'Baltimore', country: 'USA', x: 41, y: 35,
    entries: [['Summer 2019', 'Guest Researcher', 'Language Neuromodulation Lab · Johns Hopkins School of Medicine']],
  },
  {
    city: 'Munich', country: 'Germany', x: 75, y: 29,
    entries: [
      ['2017–2019', 'Graduate Research Assistant', 'Klinikum rechts der Isar · TUM'],
      ['2016–2018', 'M.Sc. in Neuro-Cognitive Psychology', 'Ludwig Maximilian University of Munich'],
    ],
  },
  {
    city: 'Cincinnati', country: 'USA', x: 30, y: 45,
    entries: [
      ['Spring 2016', 'Undergraduate Teaching Assistant', 'University of Cincinnati'],
      ['2015–2016', 'Laboratory Manager', 'Laboratory for Cognitive and Affective Neuropsychology'],
      ['Summer 2015', 'Undergraduate Research Fellow', 'SUMR-UC Fellowship'],
      ['2012–2016', 'B.Sc. in Neuroscience', 'University of Cincinnati'],
    ],
  },
]

const outreachItems = [
  ['2025–present', 'Open Science Delegate', 'actionuni der Schweizer Mittelbau'],
  ['2025–present', 'Steering Committee Member', 'Global ReproducibiliTea Steering Committee'],
  ['2025–present', 'Student Representative', 'Lemanic Neuroscience Doctoral School'],
  ['2024–2025', 'Co-organizer', 'R Quarto Workshop for Reproducible Research'],
  ['2024–present', 'Member', 'Swiss Reproducibility Network Academy'],
  ['2023–present', 'Co-organizer', 'ReproducibiliTea Journal Club Geneva'],
  ['2022–present', 'Member', 'Swiss Reproducibility Network · Geneva Node'],
  ['2022–2025', 'Board Member', 'Women in Neuroscience Repository'],
  ['2022', 'Local Event Organizer', 'Brainhack Geneva'],
  ['2016–2018', 'Member', 'Elite Network of Bavaria'],
  ['2015–2016', 'Member', 'Fossil Free UC'],
  ['2014–2016', 'Member', 'University of Cincinnati NeuroSociety'],
  ['2013', 'Co-President', 'University of Cincinnati Clermont College Psychology Club'],
]

const grants = [
  ['2025', 'Grant supporting Open Science Education', 'University of Geneva'],
  ['2025', 'Jean Falk-Vairant Award', 'Lemanic Neuroscience Doctoral School'],
  ['2025', 'Doc-Mobility Research Grant', 'University of Geneva'],
  ['June 2023', '12th Summer School', 'International Max Planck Research School'],
  ['2017–2019', 'German Academic Exchange Service Scholarship', 'DAAD'],
  ['2016', 'Arthur Bills Award for Outstanding Undergraduate Research', 'University of Cincinnati'],
  ['2015', 'SUMR-UC Fellowship', 'University of Cincinnati'],
  ['2014–2016', 'Cincinnatus Scholarship', 'University of Cincinnati'],
]

const teachingItems = [
  ['2024–present', 'Graduate Teaching Assistant', 'Cognitive Neuroscience of Language · University of Geneva'],
  ['2025–present', 'Master’s thesis mentor · Enrique Marcos', 'MEG data collection and N400 responses to French ambiguous words and sentences'],
  ['2025–present', 'Master’s thesis mentor · Thomas Hill', 'Cross-linguistic differences in motion events using non-verbal cognitive tasks'],
  ['2023–2025', 'Master’s thesis mentor · Lina Langauer', 'Free word associations and parametric modulation analysis of fMRI data'],
  ['2023–2025', 'Master’s thesis mentor · Tatiana Falquet', 'Behavioral paradigm design, Python, inverse multidimensional scaling and preregistration'],
  ['June 2023', 'Research methods mentor · Susanne Cambi', 'Audio transcription workflows, R, Python, Git and reproducible project organization'],
  ['Spring 2016', 'Undergraduate Teaching Assistant', 'Research Methods in Neuropsychology · University of Cincinnati'],
]

const navItems = ['About', 'Experience', 'Publications', 'Outreach', 'Grants', 'Teaching']

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

function ExperienceMap() {
  const [selectedCity, setSelectedCity] = useState('Geneva')
  const selected = experiences.find((experience) => experience.city === selectedCity)

  return (
    <div className="experience-layout">
      <div className="experience-map" aria-label="Map of education and work experience">
        <svg viewBox="0 0 100 62" role="img" aria-labelledby="map-title map-description">
          <title id="map-title">Academic experience across the United States and Europe</title>
          <desc id="map-description">Locations in Cincinnati, Munich, San Francisco and Geneva.</desc>
          <path className="map-line" d="M2 12 8 7 17 6 24 9 31 8 37 13 35 19 39 24 35 30 31 33 30 42 25 49 20 48 16 41 12 37 8 31 5 27 7 20Z" />
          <path className="map-line" d="M58 5 63 3 68 6 70 10 75 11 78 16 77 22 82 25 79 30 73 31 70 38 66 41 62 36 60 29 55 25 57 19 54 14Z" />
          <path className="map-line map-line-muted" d="M36 20 C45 17 52 18 59 21 M34 29 C45 27 54 28 63 31" />
        </svg>
        {experiences.map((experience) => (
          <button
            className={selectedCity === experience.city ? 'map-pin is-active' : 'map-pin'}
            key={experience.city}
            style={{ left: `${experience.x}%`, top: `${experience.y}%` }}
            type="button"
            onClick={() => setSelectedCity(experience.city)}
            aria-pressed={selectedCity === experience.city}
          >
            <span className="pin-dot" />
            <span>{experience.city}</span>
          </button>
        ))}
        <p className="map-instruction">Select a location to explore the experience</p>
      </div>

      <div className="experience-detail" aria-live="polite">
        <p className="experience-location">{selected.city} · {selected.country}</p>
        {selected.entries.map(([period, role, organization]) => (
          <article key={`${period}-${role}`}>
            <span>{period}</span>
            <h3>{role}</h3>
            <p>{organization}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

function ProfileList({ items }) {
  return (
    <div className="profile-list">
      {items.map(([period, title, detail]) => (
        <article key={`${period}-${title}`}>
          <span>{period}</span>
          <div>
            <h3>{title}</h3>
            <p>{detail}</p>
          </div>
        </article>
      ))}
    </div>
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
            <p className="statement">Neuroimaging, Language, Open Science.</p>
            <a className="primary-link" href="#about">
              Learn more <ArrowDownRight size={19} />
            </a>
          </div>
          <span className="scroll-note" aria-hidden="true">Scroll to explore <i /></span>
        </section>

        <section className="research-section" id="about" aria-labelledby="about-title">
          <div className="section-heading">
            <span className="section-index">01</span>
            <h2 id="about-title">About</h2>
          </div>

          <div className="research-intro">
            <p>
              With a background in the neuroimaging of language function in both healthy
              and clinical populations, and research experience across three countries,
              my research interests span language (dis)function across the lifespan,
              cross-linguistic influences on language processing in multilingual speakers,
              and open and reproducible neuroimaging practices.
            </p>
            <p>
              My doctoral project examines cross-linguistic influences on the behavioral
              and neural underpinnings of word processing, and the role of semantic control
              during the processing of ambiguous words and sentences, as measured via
              magnetoencephalography.
            </p>
          </div>
        </section>

        <section className="experience-section" id="experience" aria-labelledby="experience-title">
          <div className="experience-heading">
            <span className="section-index">02</span>
            <h2 id="experience-title">Education &amp;<br />experience</h2>
          </div>
          <ExperienceMap />
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

        <section className="profile-section" id="outreach" aria-labelledby="outreach-title">
          <div className="profile-section-heading">
            <span className="section-index">04</span>
            <h2 id="outreach-title">Outreach</h2>
            <p>Building communities around open, collaborative and reproducible science.</p>
          </div>
          <ProfileList items={outreachItems} />
        </section>

        <section className="profile-section" id="grants" aria-labelledby="grants-title">
          <div className="profile-section-heading">
            <span className="section-index">05</span>
            <h2 id="grants-title">Grants</h2>
            <p>Competitive support for research, mobility and open science education.</p>
          </div>
          <ProfileList items={grants} />
        </section>

        <section className="profile-section" id="teaching" aria-labelledby="teaching-title">
          <div className="profile-section-heading">
            <span className="section-index">06</span>
            <h2 id="teaching-title">Teaching</h2>
            <p>Teaching and mentoring across neuroscience, language and reproducible methods.</p>
          </div>
          <ProfileList items={teachingItems} />
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
