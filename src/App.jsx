import { Canvas } from '@react-three/fiber'
import { Grid, Html, OrbitControls } from '@react-three/drei'
import { useMemo, useState } from 'react'

const CHALLENGES = [
  {
    id: 'future-city',
    title: 'Design a future city',
    description: 'Imagine housing, transport, energy, and public space in a better tomorrow.',
    goals: [
      { id: 'habitat', label: 'Create housing or living spaces' },
      { id: 'energy', label: 'Show how the city is powered' },
      { id: 'mobility', label: 'Include movement or transport systems' },
      { id: 'verticality', label: 'Build upward with layered space' },
      { id: 'spread', label: 'Expand beyond a tiny cluster' },
    ],
  },
  {
    id: 'climate-world',
    title: 'Create a world that solves climate problems',
    description: 'Use clean energy, green design, and resilient systems to reduce harm.',
    goals: [
      { id: 'nature', label: 'Use natural systems' },
      { id: 'water', label: 'Address water or cooling' },
      { id: 'energy', label: 'Add clean energy infrastructure' },
      { id: 'balance', label: 'Mix ecology with human systems' },
      { id: 'spread', label: 'Build a convincing footprint' },
    ],
  },
  {
    id: 'accessible-community',
    title: 'Build an accessible community for everyone',
    description: 'Prioritise mobility, inclusion, shared services, and human-friendly design.',
    goals: [
      { id: 'habitat', label: 'Create places for people' },
      { id: 'civic', label: 'Add shared or public services' },
      { id: 'mobility', label: 'Support easy movement' },
      { id: 'culture', label: 'Include social or creative space' },
      { id: 'balance', label: 'Balance multiple needs' },
    ],
  },
]

const BLOCK_TYPES = {
  habitat: {
    label: 'Habitat Pod',
    short: 'Housing',
    color: '#8b5cf6',
    tone: 'Homes, studios, living spaces',
    category: 'Living',
    shape: 'box',
  },
  civic: {
    label: 'Civic Hub',
    short: 'Civic',
    color: '#f97316',
    tone: 'Schools, clinics, public support',
    category: 'Living',
    shape: 'box',
  },
  nature: {
    label: 'Nature Canopy',
    short: 'Nature',
    color: '#22c55e',
    tone: 'Trees, parks, biodiversity',
    category: 'Ecology',
    shape: 'cone',
  },
  water: {
    label: 'Water Node',
    short: 'Water',
    color: '#38bdf8',
    tone: 'Cooling, resilience, water systems',
    category: 'Ecology',
    shape: 'cylinder',
  },
  energy: {
    label: 'Energy Core',
    short: 'Energy',
    color: '#f59e0b',
    tone: 'Solar, wind, power systems',
    category: 'Systems',
    shape: 'cylinder',
  },
  mobility: {
    label: 'Mobility Link',
    short: 'Transit',
    color: '#06b6d4',
    tone: 'Transit, paths, movement',
    category: 'Systems',
    shape: 'beam',
  },
  culture: {
    label: 'Culture Beacon',
    short: 'Culture',
    color: '#ec4899',
    tone: 'Creativity, gathering, identity',
    category: 'Experience',
    shape: 'sphere',
  },
  food: {
    label: 'Food Garden',
    short: 'Food',
    color: '#84cc16',
    tone: 'Urban farms and nourishment',
    category: 'Experience',
    shape: 'box',
  },
}

const TYPE_ORDER = Object.keys(BLOCK_TYPES)
const DEFAULT_CHALLENGE = CHALLENGES[0]
const DEFAULT_TYPE = 'habitat'

const INITIAL_BLOCKS = [
  { x: 0, y: 0, z: 0, type: 'habitat' },
  { x: 1, y: 0, z: 0, type: 'nature' },
  { x: 0, y: 0, z: 1, type: 'energy' },
  { x: 1, y: 0, z: 1, type: 'mobility' },
]

function keyFor(x, y, z) {
  return `${x},${y},${z}`
}

function clampGrid(value, min = -9, max = 9) {
  return Math.max(min, Math.min(max, value))
}

function createEmptyCounts() {
  return TYPE_ORDER.reduce((acc, type) => {
    acc[type] = 0
    return acc
  }, {})
}

function summariseWorld(blocks) {
  const counts = createEmptyCounts()
  let tallestY = 0
  let minX = Infinity
  let maxX = -Infinity
  let minZ = Infinity
  let maxZ = -Infinity
  let elevatedBlocks = 0

  blocks.forEach((block) => {
    counts[block.type] += 1
    tallestY = Math.max(tallestY, block.y)
    minX = Math.min(minX, block.x)
    maxX = Math.max(maxX, block.x)
    minZ = Math.min(minZ, block.z)
    maxZ = Math.max(maxZ, block.z)
    if (block.y > 0) elevatedBlocks += 1
  })

  const total = blocks.length
  const footprint = new Set(blocks.map((block) => `${block.x},${block.z}`)).size
  const categories = [...new Set(blocks.map((block) => BLOCK_TYPES[block.type].category))]
  const typeCoverage = TYPE_ORDER.filter((type) => counts[type] > 0).length
  const maxHeight = total ? tallestY + 1 : 0
  const width = total ? maxX - minX + 1 : 0
  const depth = total ? maxZ - minZ + 1 : 0
  const density = footprint ? total / footprint : 0
  const balance = total ? 1 - (Math.max(...TYPE_ORDER.map((type) => counts[type])) / total) : 0
  const sustainabilityScore = Math.min(100, Math.round(((counts.nature + counts.water + counts.energy + counts.food) / Math.max(total, 1)) * 100))
  const peopleScore = Math.min(100, Math.round(((counts.habitat + counts.civic + counts.culture + counts.mobility) / Math.max(total, 1)) * 100))

  return {
    total,
    counts,
    footprint,
    categories,
    typeCoverage,
    maxHeight,
    width,
    depth,
    density,
    balance,
    elevatedBlocks,
    sustainabilityScore,
    peopleScore,
    hasHabitat: counts.habitat > 0,
    hasNature: counts.nature > 0,
    hasEnergy: counts.energy > 0,
    hasWater: counts.water > 0,
    hasMobility: counts.mobility > 0,
    hasCivic: counts.civic > 0,
    hasCulture: counts.culture > 0,
    hasFood: counts.food > 0,
  }
}

function evaluateChallengeGoals(challenge, summary) {
  const checks = {
    habitat: summary.hasHabitat,
    energy: summary.hasEnergy,
    mobility: summary.hasMobility,
    verticality: summary.maxHeight >= 3,
    spread: summary.footprint >= 7,
    nature: summary.hasNature,
    water: summary.hasWater,
    balance: summary.typeCoverage >= 4 && summary.balance > 0.45,
    civic: summary.hasCivic,
    culture: summary.hasCulture,
  }

  const items = challenge.goals.map((goal) => ({
    ...goal,
    done: Boolean(checks[goal.id]),
  }))

  const completed = items.filter((item) => item.done).length
  const score = Math.round((completed / items.length) * 100)

  return { items, completed, score }
}

function buildTutorPrompt(challenge, summary, progress) {
  const prompts = []

  if (summary.total < 6) {
    prompts.push('Start by creating a clear centrepiece. What is the first structure that explains the idea at a glance?')
  }

  if (challenge.id === 'future-city') {
    if (!summary.hasMobility) prompts.push('Add transit or pathways so the city feels navigable, not static.')
    if (summary.hasEnergy && summary.hasHabitat) prompts.push('You have homes and power. What public place connects daily life to infrastructure?')
  }

  if (challenge.id === 'climate-world') {
    if (!summary.hasNature) prompts.push('Introduce ecology that does real work: shade, habitat, cooling, or food production.')
    if (!summary.hasWater) prompts.push('A climate-smart world usually manages heat and water. Where is that visible in your build?')
  }

  if (challenge.id === 'accessible-community') {
    if (!summary.hasCivic) prompts.push('Try adding a civic hub such as a school, clinic, or shared service point.')
    if (summary.hasMobility) prompts.push('Your movement layer is forming. What would make every route feel easy and welcoming?')
  }

  if (summary.maxHeight >= 3 && !summary.hasMobility) {
    prompts.push('You are building upward. Add mobility features so vertical space still feels inclusive.')
  }

  if (summary.typeCoverage <= 2) {
    prompts.push('Your palette is still narrow. Mix in a contrasting system so the world feels more complete.')
  }

  if (progress.completed >= 3) {
    prompts.push('You are close to a finished concept. Refine the story: what should a visitor understand within five seconds?')
  }

  if (summary.density > 1.8) {
    prompts.push('This build is getting dense. Consider opening pockets of public or natural space to improve readability.')
  }

  return [...new Set(prompts)].slice(0, 4)
}

function buildCriticReview(challenge, summary, progress) {
  const strengths = []
  const improvements = []
  const rubric = []

  if (summary.hasHabitat) strengths.push('The world feels inhabited rather than abstract.')
  if (summary.hasNature) strengths.push('Natural elements soften the composition and add life.')
  if (summary.hasEnergy || summary.hasWater || summary.hasMobility) strengths.push('Infrastructure is starting to explain how the world functions.')
  if (summary.maxHeight >= 2) strengths.push('Layering and elevation create more visual interest than a flat layout.')
  if (summary.typeCoverage >= 4) strengths.push('A wider palette gives the world more believable systems and contrast.')

  if (!summary.hasHabitat) improvements.push('Add places for people so the concept has a social anchor.')
  if (!summary.hasMobility) improvements.push('Show how residents move through the space with comfort and clarity.')
  if (summary.typeCoverage < 4) improvements.push('Use more categories to make the world feel designed instead of symbolic.')
  if (summary.footprint < 6) improvements.push('Expand the footprint so the idea reads as a district or ecosystem, not a single cluster.')
  if (!summary.hasWater && challenge.id !== 'future-city') improvements.push('Introduce water or climate-comfort systems to strengthen resilience.')
  if (!summary.hasCivic && challenge.id === 'accessible-community') improvements.push('Add a civic or shared-service layer to support inclusion in practice.')

  rubric.push({ label: 'Idea clarity', score: Math.min(10, 3 + progress.completed + (summary.total >= 8 ? 1 : 0)) })
  rubric.push({ label: 'System thinking', score: Math.min(10, 2 + summary.typeCoverage + (summary.hasEnergy || summary.hasWater || summary.hasMobility ? 1 : 0)) })
  rubric.push({ label: 'Spatial design', score: Math.min(10, 2 + Math.min(summary.footprint, 5) + (summary.maxHeight >= 3 ? 1 : 0)) })
  rubric.push({ label: 'Challenge fit', score: Math.min(10, 2 + Math.round(progress.score / 20)) })

  const totalScore = rubric.reduce((acc, item) => acc + item.score, 0)

  return {
    strengths: strengths.slice(0, 4),
    improvements: improvements.slice(0, 4),
    rubric,
    totalScore,
  }
}

function buildProjectSummary(challenge, summary, progress, criticReview) {
  const stage = progress.score >= 80 ? 'Showcase-ready concept' : progress.score >= 50 ? 'Promising prototype' : 'Early concept sketch'
  const headline = `${challenge.title} is currently a ${stage.toLowerCase()}.`
  const emphasis = TYPE_ORDER.filter((type) => summary.counts[type] > 0)
    .sort((a, b) => summary.counts[b] - summary.counts[a])
    .slice(0, 3)
    .map((type) => BLOCK_TYPES[type].short)
    .join(', ')

  return {
    stage,
    headline,
    emphasis: emphasis || 'No strong focus yet',
    nextStep: criticReview.improvements[0] || 'Refine the composition with contrast, detail, or storytelling.',
  }
}

function App() {
  const [selectedChallenge, setSelectedChallenge] = useState(DEFAULT_CHALLENGE)
  const [activeType, setActiveType] = useState(DEFAULT_TYPE)
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS)
  const [toolMode, setToolMode] = useState('build')
  const [selectedBlockKey, setSelectedBlockKey] = useState(null)
  const [hoveredPlacement, setHoveredPlacement] = useState(null)
  const [history, setHistory] = useState([])
  const [future, setFuture] = useState([])

  const summary = useMemo(() => summariseWorld(blocks), [blocks])
  const progress = useMemo(() => evaluateChallengeGoals(selectedChallenge, summary), [selectedChallenge, summary])
  const tutorPrompts = useMemo(() => buildTutorPrompt(selectedChallenge, summary, progress), [selectedChallenge, summary, progress])
  const criticReview = useMemo(() => buildCriticReview(selectedChallenge, summary, progress), [selectedChallenge, summary, progress])
  const projectSummary = useMemo(() => buildProjectSummary(selectedChallenge, summary, progress, criticReview), [selectedChallenge, summary, progress, criticReview])

  const selectedBlock = selectedBlockKey ? blocks.find((block) => keyFor(block.x, block.y, block.z) === selectedBlockKey) : null
  const groupedTypes = useMemo(() => {
    return Object.entries(BLOCK_TYPES).reduce((acc, [type, meta]) => {
      acc[meta.category] = acc[meta.category] || []
      acc[meta.category].push([type, meta])
      return acc
    }, {})
  }, [])

  const commitWorld = (updater) => {
    setBlocks((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater
      if (next === current) return current
      const unchanged = next.length === current.length && next.every((block, index) => {
        const existing = current[index]
        return existing && existing.x === block.x && existing.y === block.y && existing.z === block.z && existing.type === block.type
      })
      if (unchanged) return current
      setHistory((previous) => [...previous, current])
      setFuture([])
      return next
    })
  }

  const addBlock = (position, forcedType = activeType) => {
    commitWorld((current) => {
      const nextKey = keyFor(position.x, position.y, position.z)
      if (current.some((block) => keyFor(block.x, block.y, block.z) === nextKey)) return current
      return [...current, { ...position, type: forcedType }]
    })
  }

  const paintBlock = (position, forcedType = activeType) => {
    commitWorld((current) => {
      let changed = false
      const next = current.map((block) => {
        if (keyFor(block.x, block.y, block.z) === keyFor(position.x, position.y, position.z)) {
          if (block.type === forcedType) return block
          changed = true
          return { ...block, type: forcedType }
        }
        return block
      })
      return changed ? next : current
    })
  }

  const removeBlock = (position) => {
    commitWorld((current) => {
      const next = current.filter((block) => keyFor(block.x, block.y, block.z) !== keyFor(position.x, position.y, position.z))
      return next.length === current.length ? current : next
    })
    if (selectedBlockKey === keyFor(position.x, position.y, position.z)) {
      setSelectedBlockKey(null)
    }
  }

  const clearWorld = () => {
    setSelectedBlockKey(null)
    commitWorld([])
  }

  const resetWorld = () => {
    setSelectedBlockKey(null)
    commitWorld(INITIAL_BLOCKS)
  }

  const undo = () => {
    if (!history.length) return
    const previous = history[history.length - 1]
    setHistory((current) => current.slice(0, -1))
    setFuture((current) => [blocks, ...current])
    setBlocks(previous)
    setSelectedBlockKey(null)
  }

  const redo = () => {
    if (!future.length) return
    const next = future[0]
    setFuture((current) => current.slice(1))
    setHistory((current) => [...current, blocks])
    setBlocks(next)
    setSelectedBlockKey(null)
  }

  return (
    <div className="app-shell">
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />
      <div className="aurora aurora-c" />

      <header className="hero">
        <div>
          <span className="eyebrow">AI Creative Studio · Phase 2</span>
          <h1>Build a richer 3D concept world and get sharper guidance from your AI studio team.</h1>
          <p>
            This upgraded demo adds more object categories, smarter build feedback, clearer editing tools,
            and a stronger challenge loop so the sandbox feels closer to a polished product prototype.
          </p>
          <div className="hero-tags">
            <span>Offline tutor logic</span>
            <span>Structured critic review</span>
            <span>Challenge progress tracking</span>
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-metric">
            <strong>{progress.score}%</strong>
            <span>challenge completion</span>
          </div>
          <div className="hero-metric">
            <strong>{criticReview.totalScore}/40</strong>
            <span>design score</span>
          </div>
          <div className="hero-metric">
            <strong>{summary.typeCoverage}</strong>
            <span>object types used</span>
          </div>
          <div className="hero-metric compact">
            <span>Focus</span>
            <strong>{projectSummary.stage}</strong>
          </div>
        </div>
      </header>

      <main className="studio-layout">
        <aside className="panel left-panel">
          <section>
            <div className="panel-heading">
              <h2>Creative Challenges</h2>
              <p>Pick a mission with built-in goals to guide your world-building decisions.</p>
            </div>
            <div className="challenge-list">
              {CHALLENGES.map((challenge) => {
                const isSelected = selectedChallenge.id === challenge.id
                return (
                  <button
                    key={challenge.id}
                    className={`challenge-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedChallenge(challenge)}
                  >
                    <span>{challenge.title}</span>
                    <small>{challenge.description}</small>
                    <div className="challenge-goal-preview">{challenge.goals.length} goals to complete</div>
                  </button>
                )
              })}
            </div>
          </section>

          <section>
            <div className="panel-heading">
              <h2>Editing Tools</h2>
              <p>Build, recolor, or erase. Left click uses the active tool. Right click removes.</p>
            </div>
            <div className="tool-row">
              {[
                { id: 'build', label: 'Build' },
                { id: 'paint', label: 'Paint' },
                { id: 'erase', label: 'Erase' },
              ].map((tool) => (
                <button
                  key={tool.id}
                  className={`tool-chip ${toolMode === tool.id ? 'active' : ''}`}
                  onClick={() => setToolMode(tool.id)}
                >
                  {tool.label}
                </button>
              ))}
            </div>
            <div className="button-row triple">
              <button className="secondary-button" onClick={undo} disabled={!history.length}>Undo</button>
              <button className="secondary-button" onClick={redo} disabled={!future.length}>Redo</button>
              <button className="ghost-button" onClick={resetWorld}>Reset</button>
            </div>
            <button className="ghost-button full-width danger" onClick={clearWorld}>Clear world</button>
          </section>

          <section>
            <div className="panel-heading">
              <h2>World Palette</h2>
              <p>Choose from multiple categories to make the world feel more complete and intentional.</p>
            </div>
            <div className="palette-groups">
              {Object.entries(groupedTypes).map(([category, entries]) => (
                <div key={category} className="palette-group">
                  <div className="palette-group-title">{category}</div>
                  <div className="palette-grid">
                    {entries.map(([key, block]) => (
                      <button
                        key={key}
                        className={`palette-chip ${activeType === key ? 'active' : ''}`}
                        onClick={() => setActiveType(key)}
                      >
                        <span className="swatch large" style={{ background: block.color }} />
                        <div>
                          <strong>{block.label}</strong>
                          <small>{block.tone}</small>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <section className="canvas-panel panel">
          <div className="canvas-header">
            <div>
              <span className="eyebrow">Current challenge</span>
              <h2>{selectedChallenge.title}</h2>
              <p>{selectedChallenge.description}</p>
            </div>
            <div className="legend">
              <span>Drag to orbit</span>
              <span>Scroll to zoom</span>
              <span>Click faces to build outward</span>
              <span>Right click to erase</span>
            </div>
          </div>

          <div className="canvas-frame" onContextMenu={(event) => event.preventDefault()}>
            <Canvas camera={{ position: [9, 9, 10], fov: 48 }} shadows>
              <color attach="background" args={['#07111f']} />
              <fog attach="fog" args={['#07111f', 12, 28]} />
              <ambientLight intensity={0.95} />
              <hemisphereLight intensity={0.55} groundColor="#09101c" color="#b8d8ff" />
              <directionalLight castShadow position={[10, 16, 8]} intensity={1.65} shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
              <Grid infiniteGrid={false} args={[20, 20]} cellColor="#334155" sectionColor="#64748b" fadeDistance={25} fadeStrength={1} />
              <WorldScene
                blocks={blocks}
                toolMode={toolMode}
                activeType={activeType}
                selectedBlockKey={selectedBlockKey}
                hoveredPlacement={hoveredPlacement}
                onHoverPlacement={setHoveredPlacement}
                onSelectBlock={setSelectedBlockKey}
                onAddBlock={addBlock}
                onPaintBlock={paintBlock}
                onRemoveBlock={removeBlock}
              />
              <OrbitControls makeDefault minDistance={5} maxDistance={19} maxPolarAngle={Math.PI / 2.05} target={[0, 1, 0]} />
            </Canvas>
          </div>

          <div className="canvas-footer">
            <div className="mini-card">
              <span className="mini-label">Active tool</span>
              <strong>{toolMode === 'build' ? 'Build mode' : toolMode === 'paint' ? 'Paint mode' : 'Erase mode'}</strong>
            </div>
            <div className="mini-card">
              <span className="mini-label">Active object</span>
              <strong>{BLOCK_TYPES[activeType].label}</strong>
            </div>
            <div className="mini-card">
              <span className="mini-label">Selection</span>
              <strong>{selectedBlock ? `${BLOCK_TYPES[selectedBlock.type].label} @ ${selectedBlock.x},${selectedBlock.y},${selectedBlock.z}` : 'No block selected'}</strong>
            </div>
          </div>
        </section>

        <aside className="panel right-panel">
          <section className="agent-card tutor">
            <div className="agent-header">
              <span className="agent-badge">Tutor Agent</span>
              <h2>Context-aware coaching</h2>
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
              <h2>Structured design review</h2>
            </div>
            <div className="agent-columns">
              <div>
                <h3>Strengths</h3>
                <ul>
                  {criticReview.strengths.length
                    ? criticReview.strengths.map((item) => <li key={item}>{item}</li>)
                    : <li>Add a few more elements so the critic has something clearer to evaluate.</li>}
                </ul>
              </div>
              <div>
                <h3>Improvements</h3>
                <ul>
                  {criticReview.improvements.length
                    ? criticReview.improvements.map((item) => <li key={item}>{item}</li>)
                    : <li>The concept is reading well. Push detail, contrast, or storytelling next.</li>}
                </ul>
              </div>
            </div>
            <div className="rubric-list">
              {criticReview.rubric.map((item) => (
                <div key={item.label} className="rubric-row">
                  <span>{item.label}</span>
                  <strong>{item.score}/10</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="panel progress-panel">
            <div className="panel-heading">
              <h2>Challenge checklist</h2>
              <p>{progress.completed} of {progress.items.length} goals completed.</p>
            </div>
            <div className="checklist">
              {progress.items.map((item) => (
                <div key={item.id} className={`check-item ${item.done ? 'done' : ''}`}>
                  <span className="check-mark">{item.done ? '✓' : '○'}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel summary-panel">
            <div className="panel-heading">
              <h2>Project summary card</h2>
            </div>
            <div className="summary-stage">{projectSummary.stage}</div>
            <p className="summary-headline">{projectSummary.headline}</p>
            <div className="summary-grid">
              <div>
                <span className="mini-label">Main emphasis</span>
                <strong>{projectSummary.emphasis}</strong>
              </div>
              <div>
                <span className="mini-label">Best next step</span>
                <strong>{projectSummary.nextStep}</strong>
              </div>
            </div>
          </section>

          <section className="panel stats-panel">
            <div className="panel-heading">
              <h2>World snapshot</h2>
              <p>Live metrics update as you build.</p>
            </div>
            <div className="stats-list">
              {Object.entries(BLOCK_TYPES).map(([key, block]) => (
                <div key={key} className="stat-item">
                  <span className="stat-label">
                    <span className="swatch" style={{ background: block.color }} />
                    {block.short}
                  </span>
                  <strong>{summary.counts[key] || 0}</strong>
                </div>
              ))}
            </div>
            <div className="score-grid">
              <div className="score-card">
                <span className="mini-label">Footprint</span>
                <strong>{summary.footprint}</strong>
              </div>
              <div className="score-card">
                <span className="mini-label">Height</span>
                <strong>{summary.maxHeight}</strong>
              </div>
              <div className="score-card">
                <span className="mini-label">People score</span>
                <strong>{summary.peopleScore}</strong>
              </div>
              <div className="score-card">
                <span className="mini-label">Eco score</span>
                <strong>{summary.sustainabilityScore}</strong>
              </div>
            </div>
          </section>
        </aside>
      </main>
    </div>
  )
}

function WorldScene({
  blocks,
  toolMode,
  activeType,
  selectedBlockKey,
  hoveredPlacement,
  onHoverPlacement,
  onSelectBlock,
  onAddBlock,
  onPaintBlock,
  onRemoveBlock,
}) {
  return (
    <group>
      <mesh
        receiveShadow
        rotation-x={-Math.PI / 2}
        position={[0, -0.5, 0]}
        onPointerMove={(event) => {
          event.stopPropagation()
          const [x, , z] = event.point.toArray()
          onHoverPlacement({ x: clampGrid(Math.round(x)), y: 0, z: clampGrid(Math.round(z)) })
        }}
        onPointerOut={() => onHoverPlacement(null)}
        onClick={(event) => {
          event.stopPropagation()
          const [x, , z] = event.point.toArray()
          const position = { x: clampGrid(Math.round(x)), y: 0, z: clampGrid(Math.round(z)) }
          if (toolMode === 'erase') return
          if (toolMode === 'paint') return
          onAddBlock(position, activeType)
          onSelectBlock(keyFor(position.x, position.y, position.z))
        }}
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0f172a" transparent opacity={0.12} />
      </mesh>

      {blocks.map((block) => (
        <Block
          key={keyFor(block.x, block.y, block.z)}
          block={block}
          isSelected={selectedBlockKey === keyFor(block.x, block.y, block.z)}
          toolMode={toolMode}
          activeType={activeType}
          onHoverPlacement={onHoverPlacement}
          onSelectBlock={onSelectBlock}
          onAddBlock={onAddBlock}
          onPaintBlock={onPaintBlock}
          onRemoveBlock={onRemoveBlock}
        />
      ))}

      {hoveredPlacement && !blocks.some((block) => keyFor(block.x, block.y, block.z) === keyFor(hoveredPlacement.x, hoveredPlacement.y, hoveredPlacement.z)) && toolMode === 'build' && (
        <mesh position={[hoveredPlacement.x, hoveredPlacement.y, hoveredPlacement.z]}>
          <boxGeometry args={[0.96, 0.96, 0.96]} />
          <meshStandardMaterial color={BLOCK_TYPES[activeType].color} transparent opacity={0.28} emissive={BLOCK_TYPES[activeType].color} emissiveIntensity={0.15} />
        </mesh>
      )}

      {blocks.length === 0 && (
        <Html position={[0, 1.5, 0]} center>
          <div className="empty-state">Place your first object to start shaping the concept.</div>
        </Html>
      )}
    </group>
  )
}

function Block({
  block,
  isSelected,
  toolMode,
  activeType,
  onHoverPlacement,
  onSelectBlock,
  onAddBlock,
  onPaintBlock,
  onRemoveBlock,
}) {
  const blockMeta = BLOCK_TYPES[block.type]
  const blockKey = keyFor(block.x, block.y, block.z)

  const handleActivate = (event) => {
    event.stopPropagation()
    onSelectBlock(blockKey)

    if (event.nativeEvent.button === 2 || toolMode === 'erase') {
      onRemoveBlock({ x: block.x, y: block.y, z: block.z })
      return
    }

    if (toolMode === 'paint') {
      onPaintBlock({ x: block.x, y: block.y, z: block.z }, activeType)
      return
    }

    const normal = event.face?.normal
    const nextPosition = normal
      ? {
          x: clampGrid(Math.round(block.x + normal.x)),
          y: Math.max(0, Math.round(block.y + normal.y)),
          z: clampGrid(Math.round(block.z + normal.z)),
        }
      : { x: block.x, y: block.y + 1, z: block.z }

    onAddBlock(nextPosition, activeType)
    onSelectBlock(keyFor(nextPosition.x, nextPosition.y, nextPosition.z))
  }

  const handleHover = (event) => {
    event.stopPropagation()
    const normal = event.face?.normal
    if (!normal || toolMode !== 'build') {
      onHoverPlacement(null)
      return
    }
    onHoverPlacement({
      x: clampGrid(Math.round(block.x + normal.x)),
      y: Math.max(0, Math.round(block.y + normal.y)),
      z: clampGrid(Math.round(block.z + normal.z)),
    })
  }

  return (
    <mesh
      castShadow
      receiveShadow
      position={[block.x, block.y, block.z]}
      onClick={handleActivate}
      onPointerMove={handleHover}
      onPointerOut={() => onHoverPlacement(null)}
      onPointerDown={(event) => {
        if (event.button === 2) {
          event.stopPropagation()
          onRemoveBlock({ x: block.x, y: block.y, z: block.z })
        }
      }}
    >
      <BlockGeometry shape={blockMeta.shape} />
      <meshStandardMaterial
        color={blockMeta.color}
        metalness={blockMeta.shape === 'sphere' ? 0.3 : 0.14}
        roughness={blockMeta.shape === 'energy' ? 0.35 : 0.48}
        emissive={isSelected ? blockMeta.color : '#000000'}
        emissiveIntensity={isSelected ? 0.28 : 0}
      />
    </mesh>
  )
}

function BlockGeometry({ shape }) {
  if (shape === 'cylinder') return <cylinderGeometry args={[0.36, 0.42, 0.95, 18]} />
  if (shape === 'cone') return <coneGeometry args={[0.46, 1, 10]} />
  if (shape === 'sphere') return <sphereGeometry args={[0.5, 20, 20]} />
  if (shape === 'beam') return <boxGeometry args={[1.08, 0.44, 0.62]} />
  return <boxGeometry args={[0.95, 0.95, 0.95]} />
}

export default App
