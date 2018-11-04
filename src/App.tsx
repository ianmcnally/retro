//@ts-ignore
import React, { useState } from 'react'
import visually from './styles/visually.module.css'
import border from './styles/border.module.css'
import backgroundColor from './styles/background-color.module.css'
import styles from './styles/app.module.css'
import cx from 'classnames'

function Entry({ children }: { children: string }) {
  return (
    <div className={styles.entry}>
      {children}
      <label htmlFor={children}><span role="presentation">☆</span><span className={visually.hidden}>Starred</span></label>
      <input type="checkbox" id={children} />
    </div>
  )
}

function Columns({ children }: { children: React.ReactNode[] }) {
  return <div className={styles.columns}>{children}</div>
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
    <section aria-labelledby={title} className={styles.column}>
      <h2 id={title} className={styles.columnHeading}>{title}</h2>
      {children}
    </section>
  ) : null
}

function ColumnToggles({ children }: { children: React.ReactNode }) {
  return <div className={styles.columnToggles}>{children}</div>
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
      className={cx(styles.columnToggle, {
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
    <form className={styles.compose}>
      <label htmlFor="content" className={visually.hidden}>
        Write down your idea
      </label>
      <input
        className={styles.composeInput}
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
  const [showStarredColumn, setShowStarredColumn] = useState(false)

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
    <h1 className={visually.hidden}>Retro</h1>
    <main className={styles.main}>
      <Columns>
        <Column title="Happy" show={showHappyColumn}>
          <Entry>This is good</Entry>
          <Entry>This is good, too</Entry>
        </Column>
        <Column title="Sad" show={showSadColumn}>
          <Entry>This is sad</Entry>
          <Entry>This is sad, too</Entry>
        </Column>
        <Column title="Confused" show={showConfusedColumn}>
          <Entry>This is confused</Entry>
          <Entry>This is confused, too</Entry>
        </Column>
        <Column title="Starred" show={showStarredColumn} />
      </Columns>
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
    </main>
    </>
  )
}

export default App
