import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from '../router'

const NAV_SECTIONS = [
  { id: 'how-it-works', label: 'How it works' },
  { id: 'features', label: 'Features' },
  { id: 'ai-loop', label: 'AI loop' },
]

const FEATURE_CARDS = [
  {
    title: '3D worldbuilding that teaches systems thinking',
    body: 'Learners sketch ideas as spatial compositions, balancing housing, ecology, culture, and infrastructure in one shared scene.',
  },
  {
    title: 'Challenge-led progression instead of an empty sandbox',
    body: 'Every mission frames a design problem and turns broad creativity into concrete goals, tradeoffs, and outcomes.',
  },
  {
    title: 'AI roles that coach, critique, and motivate iteration',
    body: 'The platform combines a tutor, a critic, and a live challenge engine so feedback feels like a studio review, not a toy.',
  },
]

const HOW_IT_WORKS_STEPS = [
  {
    title: 'Choose a challenge',
    body: 'Start with a creative prompt such as a future city, climate-resilient world, or accessible community.',
  },
  {
    title: 'Build a 3D concept',
    body: 'Compose with a visual palette of living, ecological, systemic, and experiential blocks inside the real studio canvas.',
  },
  {
    title: 'Learn through feedback loops',
    body: 'The tutor suggests next moves, the critic scores the work, and the checklist reveals what your concept still needs.',
  },
]

const SYSTEM_PANELS = [
  {
    badge: 'Challenge',
    title: 'Frames the mission',
    body: 'The challenge system turns open-ended building into a learnable exercise with visible goals, progress, and completion scoring.',
  },
  {
    badge: 'Tutor',
    title: 'Guides the next move',
    body: 'The tutor watches composition, variety, density, and challenge fit to suggest smart next steps while the learner is building.',
  },
  {
    badge: 'Critic',
    title: 'Evaluates the result',
    body: 'The critic converts the current world into strengths, improvements, rubric scores, and a project summary so iteration stays actionable.',
  },
]

function LandingPage() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace('#', '')
      window.requestAnimationFrame(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.hash])

  const scrollToSection = (sectionId) => {
    if (!sectionId) {
      navigate('/')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    navigate(`/#${sectionId}`)
  }

  return (
    <div className="app-shell landing-shell">
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />
      <div className="aurora aurora-c" />

      <header className="topbar">
        <button className="brand-mark" onClick={() => scrollToSection()}>
          <span className="brand-orb" />
          <span>AI Creative Studio</span>
        </button>
        <nav className="topnav">
          {NAV_SECTIONS.map((item) => (
            <button key={item.id} className="nav-link" onClick={() => scrollToSection(item.id)}>
              {item.label}
            </button>
          ))}
          <Link className="secondary-button link-button" to="/studio">Launch studio</Link>
        </nav>
      </header>

      <main className="landing-layout">
        <section className="landing-hero">
          <div className="landing-copy">
            <span className="eyebrow">AI-powered 3D creative learning platform</span>
            <h1>Teach creative systems thinking through a game-like 3D studio.</h1>
            <p className="landing-lead">
              AI Creative Studio helps learners build worlds, tackle design challenges, and improve through an integrated challenge, tutor, and critic loop.
            </p>
            <div className="hero-actions">
              <Link className="primary-button link-button" to="/studio">Launch the studio</Link>
              <button className="ghost-button" onClick={() => scrollToSection('how-it-works')}>See how it works</button>
            </div>
            <div className="hero-tags">
              <span>3D creative sandbox</span>
              <span>AI tutor + critic</span>
              <span>Challenge-based learning</span>
            </div>
          </div>

          <div className="landing-showcase hero-card">
            <div className="showcase-header">
              <span className="eyebrow">Platform snapshot</span>
              <strong>From play to critique in one flow</strong>
            </div>
            <div className="showcase-grid">
              <div className="showcase-card">
                <span className="mini-label">Build</span>
                <strong>3D block worlds</strong>
                <p>Compose cities, systems, and ecosystems with an intuitive worldbuilding interface.</p>
              </div>
              <div className="showcase-card">
                <span className="mini-label">Coach</span>
                <strong>Live tutor prompts</strong>
                <p>Get context-aware guidance while shaping the concept, not only after the fact.</p>
              </div>
              <div className="showcase-card">
                <span className="mini-label">Review</span>
                <strong>Critic scoring</strong>
                <p>Measure idea clarity, system thinking, spatial design, and challenge fit.</p>
              </div>
              <div className="showcase-card accent">
                <span className="mini-label">Outcome</span>
                <strong>Creative learning that feels like a game</strong>
                <p>Students iterate through challenge loops, feedback, and visible progress instead of static lessons.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="landing-section">
          <div className="section-intro">
            <span className="eyebrow">How it works</span>
            <h2>A simple loop that turns making into learning.</h2>
            <p>The product combines worldbuilding, structured prompts, and feedback systems so learners stay creative while still being guided.</p>
          </div>
          <div className="step-grid">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <article key={step.title} className="glass-card step-card">
                <span className="step-index">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="features" className="landing-section">
          <div className="section-intro">
            <span className="eyebrow">Product features</span>
            <h2>Built like a startup product, not a static demo.</h2>
            <p>The existing studio remains the core experience. The landing page now explains the value proposition and routes directly into it.</p>
          </div>
          <div className="feature-grid">
            {FEATURE_CARDS.map((feature) => (
              <article key={feature.title} className="glass-card feature-card">
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="ai-loop" className="landing-section system-section">
          <div className="section-intro">
            <span className="eyebrow">Challenge / Tutor / Critic</span>
            <h2>Three systems work together to create the learning loop.</h2>
            <p>Instead of generic AI chat, the product uses role-based guidance tied directly to what the learner has built.</p>
          </div>
          <div className="system-grid">
            {SYSTEM_PANELS.map((panel) => (
              <article key={panel.title} className="glass-card system-card">
                <span className="agent-badge">{panel.badge}</span>
                <h3>{panel.title}</h3>
                <p>{panel.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section cta-section">
          <div className="glass-card cta-card">
            <div>
              <span className="eyebrow">Launch</span>
              <h2>Open the live studio and build the experience behind this landing page.</h2>
              <p>The studio view is the real existing app, now connected to this front door without removing any current functionality.</p>
            </div>
            <Link className="primary-button link-button" to="/studio">Launch AI Creative Studio</Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export default LandingPage
