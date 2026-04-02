import { useEffect } from 'react'
import { Link } from '../router'
import StudioExperience from '../components/StudioExperience'

function StudioPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <StudioExperience
      homeLink={<Link className="brand-mark" to="/"><span className="brand-orb" /><span>AI Creative Studio</span></Link>}
      navLinks={(
        <nav className="topnav">
          <Link className="nav-link link-button minimal-link" to="/">Landing</Link>
          <Link className="nav-link link-button minimal-link" to="/#how-it-works">How it works</Link>
          <Link className="nav-link link-button minimal-link" to="/#ai-loop">AI loop</Link>
        </nav>
      )}
    />
  )
}

export default StudioPage
