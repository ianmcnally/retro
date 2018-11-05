//@ts-ignore
import React, { useEffect, useState, Suspense } from 'react'
import Loading from './Loading'
import visually from './styles/visually.module.css'
import border from './styles/border.module.css'
import backgroundColor from './styles/background-color.module.css'
import styles from './styles/app.module.css'
import cx from 'classnames'
import {
  addHappyIdeaToRetro,
  addSadIdeaToRetro,
  addConfusedIdeaToRetro,
} from './Database'

function Entry({ children }: { children: string }) {
  const [starred, setStarred] = useState(false)
  const onChange = () => {
    setStarred(!starred)
  }

  return (
    <div className={styles.entry}>
      {children}
      <label htmlFor={children}>
        <span role="presentation" className={styles.entryStar}>
          {starred ? '⭐️' : '☆'}
        </span>
        <span className={visually.hidden}>Starred</span>
      </label>
      <input
        type="checkbox"
        id={children}
        checked={starred}
        onChange={onChange}
        className={visually.hidden}
      />
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
    <Suspense fallback={<Loading />}>
      <section aria-labelledby={title} className={styles.column}>
        <h2 id={title} className={styles.columnHeading}>
          {title}
        </h2>
        {children}
      </section>
    </Suspense>
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
  onSubmit,
}: {
  categories: { value: string; display: string }[]
  onSubmit(event: React.FormEvent<any>): void
}) {
  return (
    <form
      name="compose"
      id="compose"
      className={styles.compose}
      onSubmit={onSubmit}>
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

function Retro(props: { retroId: string }) {
  const [showHappyColumn, setShowHappyColumn] = useState(true)
  const [showSadColumn, setShowSadColumn] = useState(true)
  const [showConfusedColumn, setShowConfusedColumn] = useState(true)
  const [showStarredColumn, setShowStarredColumn] = useState(false)
  useViewportHeightOnMobile()

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
  const handleComposeSubmit = (event: React.FormEvent<any>) => {
    event.preventDefault()
    const {
     retroId
    } = props
    //@ts-ignore
    const { content, category } = event.target
    //@ts-ignore
    console.log('submit', 'content', content.value, 'category', category.value)
    switch (category.value) {
      case 'happy':
        addHappyIdeaToRetro(
          { content: content.value, starred: false, votes: 0 },
          retroId,
        )
        break
      case 'sad':
        addSadIdeaToRetro(
          { content: content.value, starred: false, votes: 0 },
          retroId,
        )
        break
      case 'confused':
        addConfusedIdeaToRetro(
          { content: content.value, starred: false, votes: 0 },
          retroId,
        )
        break
      default:
        break
    }
    //@ts-ignore
    event.target.reset()
  }
  return (
    <>
      <h1 className={visually.hidden}>Retro</h1>
      <main className={styles.main}>
        <Columns>
          <Column title="happy" show={showHappyColumn}>
            <Entry>This is good</Entry>
            <Entry>This is good, too</Entry>
          </Column>
          <Column title="sad" show={showSadColumn}>
            <Entry>This is sad</Entry>
            <Entry>This is sad, too</Entry>
          </Column>
          <Column title="confused" show={showConfusedColumn}>
            <Entry>This is confused</Entry>
            <Entry>This is confused, too</Entry>
          </Column>
          <Column title="starred" show={showStarredColumn} />
        </Columns>
        <ColumnToggles>
          <ColumnToggle
            emoji={'👍'}
            toggleFor="happy"
            onClick={handleHappyColumnToggle}
            on={showHappyColumn}
          />
          <ColumnToggle
            emoji={'👎'}
            toggleFor="sad"
            onClick={handleSadColumnToggle}
            on={showSadColumn}
          />
          <ColumnToggle
            emoji={'😕'}
            toggleFor="confused"
            onClick={handleConfusedColumnToggle}
            on={showConfusedColumn}
          />
          <ColumnToggle
            emoji={'⭐️'}
            toggleFor="starred"
            onClick={handleStarredColumnToggle}
            on={showStarredColumn}
          />
        </ColumnToggles>
        <Compose
          onSubmit={handleComposeSubmit}
          categories={[
            { value: 'happy', display: '👍' },
            { value: 'sad', display: '👎' },
            { value: 'confused', display: '😕' },
          ]}
        />
      </main>
    </>
  )
}

function useViewportHeightOnMobile() {
  return useEffect(() => {
    const documentElement = document.documentElement
    if (!documentElement) {
      return
    }
    const isMobile = 'ontouchstart' in documentElement
    if (isMobile) {
      const viewportHeight = window.innerHeight * 0.01
      documentElement.style.setProperty('--vh', `${viewportHeight}px`)
    }
  }, [])
}

export default Retro
