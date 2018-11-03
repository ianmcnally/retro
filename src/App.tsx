//@ts-ignore
import React, { useState } from 'react'
import visually from './styles/visually.module.css'
import unset from './styles/unset.module.css'
import border from './styles/border.module.css'
import backgroundColor from './styles/background-color.module.css'
import cx from 'classnames'

function Entry({ children }: { children: string }) {
  return (
    <div>
      {children}
      <label htmlFor={children}>Starred</label>
      <input type="checkbox" id={children} />
    </div>
  )
}

function Column({
  children,
  title,
  show,
}: {
  children?: React.ReactNode
  title: string
  show: boolean
}) {
  return show ? (
    <section aria-labelledby={title}>
      <h2 id={title}>{title}</h2>
      {children}
    </section>
  ) : null
}

function ColumnToggles({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

function ColumnToggle({
  on,
  toggleFor,
  onClick,
  emoji,
}: {
  on: boolean
  toggleFor: string
  onClick(): void
  emoji: string
}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={cx(border.none, {
        [backgroundColor.blue]: on,
        [backgroundColor.transparent]: !on,
      })}>
      <span role="presentation">{emoji}</span>
      <span className={visually.hidden}>Show {toggleFor} column</span>
    </button>
  )
}

function Compose({ categories }: { categories: string[] }) {
  return (
    <form>
      <label htmlFor="content" className={visually.hidden}>
        Write down your idea
      </label>
      <input
        type="text"
        name="content"
        id="content"
        placeholder="What would you like to stay?"
      />
      <label htmlFor="select" className={visually.hidden}>
        Choose a category
      </label>
      <select name="category" id="category">
        {categories.map(category => (
          <option value={category} key={category}>
            {category}
          </option>
        ))}
      </select>
      <button type="submit">Enter</button>
    </form>
  )
}

function App() {
  const [showHappyColumn, setShowHappyColumn] = useState(true)
  const [showSadColumn, setShowSadColumn] = useState(true)
  const [showConfusedColumn, setShowConfusedColumn] = useState(true)
  const [showStarredColumn, setShowStarredColumn] = useState(true)

  const handleHappyColumnToggle = () => {
    setShowHappyColumn(!showHappyColumn)
  }
  const handleSadColumnToggle = () => {
    setShowSadColumn(!showSadColumn)
  }
  const handleConfusedColumnToggle = () => {
    setShowConfusedColumn(!showConfusedColumn)
  }
  const handleStarredColumnToggle = () => {
    setShowStarredColumn(!showStarredColumn)
  }

  return (
    <>
      <Column title="Happy" show={showHappyColumn}>
        <Entry>This is good</Entry>
      </Column>
      <Column title="Sad" show={showSadColumn}>
        <Entry>This is sad</Entry>
      </Column>
      <Column title="Confused" show={showConfusedColumn}>
        <Entry>This is confused</Entry>
      </Column>
      <Column title="Starred" show={showStarredColumn} />
      <ColumnToggles>
        <ColumnToggle
          emoji={'👍'}
          toggleFor="Happy"
          onClick={handleHappyColumnToggle}
          on={showHappyColumn}
        />
        <ColumnToggle
          emoji={'👎'}
          toggleFor="Sad"
          onClick={handleSadColumnToggle}
          on={showSadColumn}
        />
        <ColumnToggle
          emoji={'😕'}
          toggleFor="Confused"
          onClick={handleConfusedColumnToggle}
          on={showConfusedColumn}
        />
        <ColumnToggle
          emoji={'⭐️'}
          toggleFor="Starred"
          onClick={handleStarredColumnToggle}
          on={showStarredColumn}
        />
      </ColumnToggles>
      <Compose categories={['Happy', 'Sad', 'Confused']} />
    </>
  )
}

export default App
