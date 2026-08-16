import { useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Mail, Menu, X } from 'lucide-react'
import { publications } from './data/publications'

const experiences = [
  {
    city: 'Geneva', country: 'Switzerland',
    entries: [
      ['2024–present', 'Graduate Teaching Assistant', 'University of Geneva'],
      ['2022–present', 'Ph.D. in Neuroscience · Graduate Research Assistant', 'University of Geneva · NoCE Lab'],
    ],
  },
  {
    city: 'San Sebastián', country: 'Spain',
    entries: [['Summer 2025', 'Guest Researcher', 'Brain Rhythms and Cognition Lab · Basque Center on Cognition, Brain and Language']],
  },
  {
    city: 'San Francisco', country: 'USA',
    entries: [['2020–2022', 'Staff Research Associate III · Imaging Data Assistant', 'UCSF Memory and Aging Center · ALBA Lab']],
  },
  {
    city: 'Baltimore', country: 'USA',
    entries: [['Summer 2019', 'Guest Researcher', 'Language Neuromodulation Lab · Johns Hopkins School of Medicine']],
  },
  {
    city: 'Munich', country: 'Germany',
    entries: [
      ['2017–2019', 'Graduate Research Assistant', 'Klinikum rechts der Isar · TUM'],
      ['2016–2018', 'M.Sc. in Neuro-Cognitive Psychology', 'Ludwig Maximilian University of Munich'],
    ],
  },
  {
    city: 'Cincinnati', country: 'USA',
    entries: [
      ['Spring 2016', 'Undergraduate Teaching Assistant', 'University of Cincinnati'],
      ['2015–2016', 'Laboratory Manager', 'Laboratory for Cognitive and Affective Neuropsychology'],
      ['Summer 2015', 'Undergraduate Research Fellow', 'SUMR-UC Fellowship'],
      ['2012–2016', 'B.Sc. in Neuroscience', 'University of Cincinnati'],
    ],
  },
]

const outreachItems = [
  ['2025–present', 'actionuni der Schweizer Mittelbau', 'Open Science Delegate'],
  ['2025–present', 'Global ReproducibiliTea Steering Committee', 'Steering Committee Member'],
  ['2025–present', 'Lemanic Neuroscience Doctoral School', 'Student Representative'],
  ['2024–2025', 'R Quarto Workshop for Reproducible Research', 'Co-organizer'],
  ['2024–present', 'Swiss Reproducibility Network Academy', 'Member'],
  ['2023–present', 'ReproducibiliTea Journal Club Geneva', 'Co-organizer'],
  ['2022–present', 'Swiss Reproducibility Network · Geneva Node', 'Member'],
  ['2022–2025', 'Women in Neuroscience Repository', 'Board Member'],
  ['2022', 'Brainhack Geneva', 'Local Event Organizer'],
  ['2016–2018', 'Elite Network of Bavaria', 'Member'],
  ['2015–2016', 'Fossil Free UC', 'Member'],
  ['2014–2016', 'University of Cincinnati NeuroSociety', 'Member'],
  ['2013', 'University of Cincinnati Clermont College Psychology Club', 'Co-President'],
]

const grants = [
  ['2025', 'Grant supporting Open Science Education', 'University of Geneva'],
  ['2025', 'Jean Falk-Vairant Award', 'Lemanic Neuroscience Doctoral School'],
  ['2025', 'Doc-Mobility Research Grant', 'University of Geneva'],
  ['2017–2019', 'German Academic Exchange Service Scholarship', 'DAAD'],
  ['2016', 'Arthur Bills Award for Outstanding Undergraduate Research', 'University of Cincinnati'],
  ['2015', 'SUMR-UC Fellowship', 'University of Cincinnati'],
  ['2014–2016', 'Cincinnatus Scholarship', 'University of Cincinnati'],
]

const teachingItems = [
  ['2024–present', 'Graduate Teaching Assistant', 'Cognitive Neuroscience of Language · University of Geneva'],
  ['2023–present', 'Mentorship', 'Five students within the Cognitive Psychology and Neuroscience programs at the University of Geneva'],
  ['Spring 2016', 'Undergraduate Teaching Assistant', 'PSYC5059 · Research Methods in Neuropsychology · University of Cincinnati'],
]

const navItems = [
  ['About', 'about'],
  ['Experience', 'experience'],
  ['Publications', 'publications'],
  ['Outreach', 'outreach'],
  ['Grants & Awards', 'grants'],
  ['Teaching & Mentoring', 'teaching'],
]

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
        {navItems.map(([label, id]) => (
          <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
            {label}
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
  return (
    <div className="experience-layout">
      <div className="experience-map">
        <img
          className="map-geography"
          src="/atlantic-map.svg"
          alt="Map marking Geneva, San Sebastián, San Francisco, Baltimore, Munich and Cincinnati."
        />
      </div>

      <div className="experience-list">
        {experiences.map((experience) => (
          <div className="experience-group" key={experience.city}>
            <div className="experience-group-heading">
              <span>{experience.city}</span>
              <small>{experience.country}</small>
            </div>
            {experience.entries.map(([period, role, organization]) => (
              <article key={`${period}-${role}`}>
                <span>{period}</span>
                <h3>{role}</h3>
                <p>{organization}</p>
              </article>
            ))}
          </div>
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

function SocialLinks() {
  const links = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/abigail-licata-456929103/', icon: <span className="social-lettermark social-linkedin">in</span> },
    {
      label: 'Bluesky',
      href: 'https://bsky.app/profile/licataae.bsky.social',
      icon: (
        <svg className="bluesky-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 11.1C10.8 8.8 7.5 4.5 4.5 2.5 1.6.6.5.9.5 3.8c0 .6.3 5.2.5 5.9.7 2.3 3.1 3.1 5.2 2.7-3.7.6-7 2.1-2.7 6.9 4.7 4.9 6.4-1.1 7-3.3.6 2.2 2.3 8.2 7 3.3 4.3-4.8 1-6.3-2.7-6.9 2.1.4 4.5-.4 5.2-2.7.2-.7.5-5.3.5-5.9 0-2.9-1.1-3.2-4-1.3-3 2-6.3 6.3-7.5 8.6Z" />
        </svg>
      ),
    },
    { label: 'ORCID', href: 'https://orcid.org/my-orcid?orcid=0000-0003-2278-0856', icon: <span className="social-lettermark">iD</span> },
    { label: 'ResearchGate', href: 'https://www.researchgate.net/profile/Abigail-Licata?ev=hdr_xprf', icon: <span className="social-lettermark">RG</span> },
    { label: 'Email Abigail Licata', href: 'mailto:alicata3098@gmail.com', icon: <Mail size={17} /> },
  ]

  return (
    <div className="social-links" aria-label="Professional profiles and contact">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          aria-label={link.label}
          title={link.label}
          {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
        >
          {link.icon}
        </a>
      ))}
    </div>
  )
}

function App() {
  return (
    <div className="site-shell" id="top">
      <div className="neuron-background" aria-hidden="true" />
      <div className="ambient-shade" aria-hidden="true" />
      <Header />

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">Abigail Licata</h1>
            <SocialLinks />
            <p className="role">PhD candidate in neuroscience at the University of Geneva.</p>
            <p className="statement">Neuroimaging. Language. Open Science.</p>
            <a className="primary-link" href="#about">
              Learn more <ArrowDownRight size={19} />
            </a>
          </div>
        </section>

        <section className="research-section" id="about" aria-labelledby="about-title">
          <div className="about-visual">
            <div className="section-heading">
              <span className="section-index">01</span>
              <h2 id="about-title">About</h2>
            </div>
            <div className="about-portrait-frame">
              <img
                className="about-portrait"
                src="/abigail-portrait.jpeg"
                alt="Abigail Licata smiling in a garden."
              />
            </div>
          </div>

          <div className="research-intro">
            <p>
              I am a cognitive neuroscience PhD student with a background in neuroscience
              and biology (B.Sc.) and neurocognitive psychology (M.Sc.). I have worked in
              laboratories and clinics across four countries, integrating multimodal
              neuroimaging with behavioral and neuropsychological assessments to study
              language (dis)function across the lifespan. My key interests include language
              function in primary progressive aphasia, cross-linguistic transfer in
              multilingualism, and the neural basis of lexical-semantic knowledge. I am
              heavily engaged in the open science movement, volunteering with several
              organizations and co-organizing events that help researchers engage with and
              learn about FAIR practices in psychology and neuroscience. I also collaborate
              on the{' '}
              <a
                href="https://smallworldofwords.org/fr/project"
                target="_blank"
                rel="noreferrer"
              >
                Small World of Words project
              </a>
              .
            </p>
            <p>
              Currently, I am working toward my PhD in neuroscience, focusing on
              cross-linguistic influences on the behavioral and neural underpinnings of word
              processing and the role of semantic control in processing ambiguous words and
              sentences, as measured using magnetoencephalography.
            </p>
            <p>
              Outside of my research and volunteer work, I am a mom to a little tot, a dancer,
              a swimmer, a roller-skater, and a friend to some of the most wonderful people in
              the world—hopefully that will include you, too :)
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
          </div>
          <ProfileList items={outreachItems} />
        </section>

        <section className="profile-section" id="grants" aria-labelledby="grants-title">
          <div className="profile-section-heading">
            <span className="section-index">05</span>
            <h2 id="grants-title">Grants &amp; Awards</h2>
          </div>
          <ProfileList items={grants} />
        </section>

        <section className="profile-section" id="teaching" aria-labelledby="teaching-title">
          <div className="profile-section-heading">
            <span className="section-index">06</span>
            <h2 id="teaching-title">Teaching &amp; Mentoring</h2>
          </div>
          <ProfileList items={teachingItems} />
        </section>
      </main>

      <footer>
        <div className="footer-identity">
          <span>Abigail Licata</span>
          <small>
            Background image by{' '}
            <a href="https://unsplash.com/@julientromeur" target="_blank" rel="noreferrer">Julien Tromeur</a>
            {' '}on{' '}
            <a href="https://unsplash.com/photos/VY_Io5Ik3u4" target="_blank" rel="noreferrer">Unsplash</a>
          </small>
        </div>
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
