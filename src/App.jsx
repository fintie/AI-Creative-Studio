import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, Html } from '@react-three/drei'
import { useMemo, useState } from 'react'

const CHALLENGES = [
  {
    id: 'future-city',
    title: 'Design a future city',
    description: 'Imagine housing, transport, energy, and public space in a better tomorrow.',
    accent: 'from-cyan-400/30 to-blue-500/30',
  },
  {
    id: 'climate-world',
    title: 'Create a world that solves climate problems',
    description: 'Use clean energy, green design, and resilient systems to reduce harm.',
    accent: 'from-emerald-400/30 to-teal-500/30',
  },
  {
    id: 'accessible-community',
    title: 'Build an accessible community for everyone',
    description: 'Prioritise mobility, inclusion, shared services, and human-friendly design.',
    accent: 'from-fuchsia-400/30 to-violet-500/30',
  },
]

const BLOCK_TYPES = {
  habitat: { label: 'Habitat', color: '#8b5cf6', tone: 'Homes and community spaces' },
  nature: { label: 'Nature', color: '#22c55e', tone: 'Trees, parks, and living systems' },
  energy: { label: 'Energy', color: '#f59e0b', tone: 'Solar, wind, and infrastructure' },
  water: { label: 'Water', color: '#38bdf8', tone: 'Waterways, cooling, and resilience' },
}

const INITIAL_BLOCKS = [
  { x: 0, y: 0, z: 0, type: 'habitat' },
  { x: 1, y: 0, z: 0, type: 'nature' },
  { x: 0, y: 0, z: 1, type: 'energy' },
]

function keyFor(x, y, z) {
  return `${x},${y},${z}`
}

function summariseWorld(blocks) {
  const counts = blocks.reduce((acc, block) => {
    acc[block.type] = (acc[block.type] || 0) + 1
    return acc
  }, {})

  const total = blocks.length
  const maxHeight = blocks.reduce((max, block) => Math.max(max, block.y + 1), 0)
  const footprint = new Set(blocks.map((block) => `${block.x},${block.z}`)).size

  return {
    total,
    counts,
    maxHeight,
    footprint,
    hasNature: Boolean(counts.nature),
    hasEnergy: Boolean(counts.energy),
    hasWater: Boolean(counts.water),
    hasHabitat: Boolean(counts.habitat),
  }
}

function buildTutorPrompt(challenge, summary) {
  const prompts = []

  if (summary.total < 5) {
    prompts.push('What is the first big idea you want this world to communicate more clearly?')
  }
  if (challenge.id === 'future-city') {
    prompts.push(summary.hasEnergy ? 'Your city has power systems. How do people move between places without friction?' : 'What clean infrastructure would make your future city feel believable?')
  }
  if (challenge.id === 'climate-world') {
    prompts.push(summary.hasNature ? 'Nice ecological signal. How does nature actively solve a climate problem here?' : 'Where could you add natural systems that reduce heat, waste, or pollution?')
  }
  if (challenge.id === 'accessible-community') {
    prompts.push(summary.footprint > 6 ? 'Your space is spreading out. How will every resident navigate it comfortably and safely?' : 'How can you make the shared spaces welcoming for different physical and sensory needs?')
  }
  if (summary.maxHeight >= 3) {
    prompts.push('You are building vertically. What helps people access the upper levels equally?')
  }
  if (!summary.hasWater) {
    prompts.push('What role does water, cooling, or environmental comfort play in this world?')
  }

  return prompts.slice(0, 3)
}

function buildCriticReview(challenge, summary) {
  const strengths = []
  const improvements = []

  if (summary.hasHabitat) strengths.push('There is a clear sense of human presence and purpose.')
  if (summary.hasNature) strengths.push('Green elements make the world feel alive instead of purely mechanical.')
  if (summary.hasEnergy) strengths.push('Infrastructure hints at how the world actually functions.')
  if (summary.maxHeight >= 2) strengths.push('Vertical layering adds spatial interest and ambition.')

  if (!summary.hasHabitat) improvements.push('Add spaces for people or community life so the build feels inhabited.')
  if (!summary.hasNature) improvements.push('Introduce natural elements to soften the environment and improve balance.')
  if (!summary.hasEnergy && challenge.id !== 'accessible-community') improvements.push('Show how the world is powered or sustained.')
  if (summary.footprint < 4) improvements.push('Expand the footprint so the idea reads as a place, not a single object.')
  if (!summary.hasWater) improvements.push('Consider water, climate comfort, or environmental resilience to make the build smarter.')

  return {
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
  }
}

function App() {
  const [selectedChallenge, setSelectedChallenge] = useState(CHALLENGES[0])
  const [activeType, setActiveType] = useState('habitat')
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS)

  const summary = useMemo(() => summariseWorld(blocks), [blocks])
  const tutorPrompts = useMemo(() => buildTutorPrompt(selectedChallenge, summary), [selectedChallenge, summary])
  const criticReview = useMemo(() => buildCriticReview(selectedChallenge, summary), [selectedChallenge, summary])

  const addBlock = (position) => {
    setBlocks((current) => {
      const next = [...current]
      const exists = next.some((block) => keyFor(block.x, block.y, block.z) === keyFor(position.x, position.y, position.z))
      if (!exists) next.push({ ...position, type: activeType })
      return next
    })
  }

  const removeBlock = (position) => {
    setBlocks((current) => current.filter((block) => keyFor(block.x, block.y, block.z) !== keyFor(position.x, position.y, position.z)))
  }

  const clearWorld = () => setBlocks([])
  const resetWorld = () => setBlocks(INITIAL_BLOCKS)

  return (
    <div className="app-shell">
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />

      <header className="hero">
        <div>
          <span className="eyebrow">AI Creative Studio</span>
          <h1>Build an idea-driven 3D world, then learn from your own AI studio team.</h1>
          <p>
            A lightweight Minecraft-inspired creative sandbox with an offline Tutor Agent and Critic Agent.
            Pick a challenge, place blocks, and iterate on your design thinking.
          </p>
        </div>
        <div className="hero-card">
          <div className="hero-metric">
            <strong>{summary.total}</strong>
            <span>blocks placed</span>
          </div>
          <div className="hero-metric">
            <strong>{summary.footprint}</strong>
            <span>grid cells used</span>
          </div>
          <div className="hero-metric">
            <strong>{summary.maxHeight}</strong>
            <span>levels tall</span>
          </div>
        </div>
      </header>

      <main className="studio-layout">
        <aside className="panel left-panel">
          <section>
            <div className="panel-heading">
              <h2>Creative Challenges</h2>
              <p>Start with a mission, not a blank canvas.</p>
            </div>
            <div className="challenge-list">
              {CHALLENGES.map((challenge) => (
                <button
                  key={challenge.id}
                  className={`challenge-card ${selectedChallenge.id === challenge.id ? 'selected' : ''}`}
                  onClick={() => setSelectedChallenge(challenge)}
                >
                  <span>{challenge.title}</span>
                  <small>{challenge.description}</small>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="panel-heading">
              <h2>Build Palette</h2>
              <p>Left click to place. Right click a block to remove it.</p>
            </div>
            <div className="palette-grid">
              {Object.entries(BLOCK_TYPES).map(([key, block]) => (
                <button
                  key={key}
                  className={`palette-chip ${activeType === key ? 'active' : ''}`}
                  onClick={() => setActiveType(key)}
                >
                  <span className="swatch" style={{ background: block.color }} />
                  <div>
                    <strong>{block.label}</strong>
                    <small>{block.tone}</small>
                  </div>
                </button>
              ))}
            </div>
            <div className="button-row">
              <button className="secondary-button" onClick={resetWorld}>Reset demo</button>
              <button className="ghost-button" onClick={clearWorld}>Clear world</button>
            </div>
          </section>
        </aside>

        <section className="canvas-panel panel">
          <div className="canvas-header">
            <div>
              <span className="eyebrow">Current challenge</span>
              <h2>{selectedChallenge.title}</h2>
            </div>
            <div className="legend">
              <span>Orbit: drag</span>
              <span>Zoom: scroll</span>
              <span>Build: click</span>
            </div>
          </div>

          <div className="canvas-frame" onContextMenu={(event) => event.preventDefault()}>
            <Canvas camera={{ position: [8, 8, 8], fov: 50 }} shadows>
              <color attach="background" args={['#0b1020']} />
              <fog attach="fog" args={['#0b1020', 12, 28]} />
              <ambientLight intensity={0.8} />
              <directionalLight castShadow position={[10, 16, 8]} intensity={1.5} shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
              <Grid infiniteGrid={false} args={[20, 20]} cellColor="#334155" sectionColor="#475569" fadeDistance={25} fadeStrength={1} />
              <WorldScene blocks={blocks} onAddBlock={addBlock} onRemoveBlock={removeBlock} />
              <OrbitControls makeDefault minDistance={5} maxDistance={18} maxPolarAngle={Math.PI / 2.1} />
            </Canvas>
          </div>
        </section>

        <aside className="panel right-panel">
          <section className="agent-card tutor">
            <div className="agent-header">
              <span className="agent-badge">Tutor Agent</span>
              <h2>Reflect and extend</h2>
            </div>
            <ul>
              {tutorPrompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
          </section>

          <section className="agent-card critic">
            <div className="agent-header">
              <span className="agent-badge">Critic Agent</span>
              <h2>What is working</h2>
            </div>
            <div className="agent-columns">
              <div>
                <h3>Strengths</h3>
                <ul>
                  {criticReview.strengths.length ? criticReview.strengths.map((item) => <li key={item}>{item}</li>) : <li>Add a few more elements to reveal the world’s intention.</li>}
                </ul>
              </div>
              <div>
                <h3>Improvements</h3>
                <ul>
                  {criticReview.improvements.length ? criticReview.improvements.map((item) => <li key={item}>{item}</li>) : <li>The world is reading clearly. Try refining details or adding contrast.</li>}
                </ul>
              </div>
            </div>
          </section>

          <section className="panel stats-panel">
            <div className="panel-heading">
              <h2>World Snapshot</h2>
            </div>
            <div className="stats-list">
              {Object.entries(BLOCK_TYPES).map(([key, block]) => (
                <div key={key} className="stat-item">
                  <span className="stat-label">
                    <span className="swatch" style={{ background: block.color }} />
                    {block.label}
                  </span>
                  <strong>{summary.counts[key] || 0}</strong>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </main>
    </div>
  )
}

function WorldScene({ blocks, onAddBlock, onRemoveBlock }) {
  return (
    <group>
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -0.5, 0]} onClick={(event) => {
        event.stopPropagation()
        const [x, , z] = event.point.toArray()
        onAddBlock({ x: Math.round(x), y: 0, z: Math.round(z) })
      }}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0f172a" transparent opacity={0.08} />
      </mesh>

      {blocks.map((block) => (
        <Block key={keyFor(block.x, block.y, block.z)} block={block} onAddBlock={onAddBlock} onRemoveBlock={onRemoveBlock} />
      ))}

      {blocks.length === 0 && (
        <Html position={[0, 1.5, 0]} center>
          <div className="empty-state">Place your first block to start shaping the idea.</div>
        </Html>
      )}
    </group>
  )
}

function Block({ block, onAddBlock, onRemoveBlock }) {
  const blockMeta = BLOCK_TYPES[block.type]
  return (
    <mesh
      castShadow
      receiveShadow
      position={[block.x, block.y, block.z]}
      onClick={(event) => {
        event.stopPropagation()
        if (event.nativeEvent.button === 2) {
          onRemoveBlock({ x: block.x, y: block.y, z: block.z })
          return
        }
        onAddBlock({ x: block.x, y: block.y + 1, z: block.z })
      }}
      onPointerDown={(event) => {
        if (event.button === 2) {
          event.stopPropagation()
          onRemoveBlock({ x: block.x, y: block.y, z: block.z })
        }
      }}
    >
      <boxGeometry args={[0.95, 0.95, 0.95]} />
      <meshStandardMaterial color={blockMeta.color} metalness={0.15} roughness={0.45} />
    </mesh>
  )
}

export default App
