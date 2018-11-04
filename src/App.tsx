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
      <label htmlFor={children}>
        <span role="presentation">☆</span>
        <span className={visually.hidden}>Starred</span>
      </label>
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
      <h2 id={title} className={styles.columnHeading}>
        {title}
      </h2>
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
        [backgroundColor.columnToggle]: on,
        [backgroundColor.transparent]: !on,
      })}>
      <span role="presentation">{emoji}</span>
      <span className={visually.hidden}>Show {toggleFor} column</span>
    </button>
  )
}

function Compose({
  categories,
}: {
  categories: { value: string; display: string }[]
}) {
  const onSubmit = (event: React.FormEvent<any>) => {
    event.preventDefault()
    //@ts-ignore
    const { content, category } = event.target
    //@ts-ignore
    console.log('submit', 'content', content.value, 'category', category.value)
    //@ts-ignore
    event.target.reset()
  }
  return (
    <form name="compose" id="compose" className={styles.compose} onSubmit={onSubmit}>
      <label htmlFor="content" className={visually.hidden}>
        Write down your idea
      </label>
      <input
        className={styles.composeInput}
        type="text"
        name="content"
        id="content"
        placeholder="What’s on your mind?"
      />
      <label htmlFor="select" className={visually.hidden}>
        Choose a category
      </label>
      <select className={styles.composeSelect} name="category" id="category">
        {categories.map(({ value, display }) => (
          <option value={value} key={value}>
            {display}
          </option>
        ))}
      </select>
      <button type="submit" className={visually.hidden}>
        Enter
      </button>
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
        <Compose
          categories={[
            { value: 'Happy', display: '👍' },
            { value: 'Sad', display: '👎' },
            { value: 'Confused', display: '😕' },
          ]}
        />
      </main>
    </>
  )
}

export default App
