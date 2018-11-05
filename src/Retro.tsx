//@ts-ignore
import React, { useEffect, useState, Suspense } from 'react'
import Loading from './Loading'
import visually from './styles/visually.module.css'
import border from './styles/border.module.css'
import backgroundColor from './styles/background-color.module.css'
import styles from './styles/app.module.css'
import cx from 'classnames'
//@ts-ignore
import { unstable_createResource as createResource } from 'react-cache'
import {
  addHappyIdeaToRetro,
  addSadIdeaToRetro,
  addConfusedIdeaToRetro,
  getHappyIdeasForRetro,
  getSadIdeasForRetro,
  getConfusedIdeasForRetro,
  Idea,
} from './Database'

const happyIdeasResource = createResource(getHappyIdeasForRetro)
const sadIdeasResource = createResource(getSadIdeasForRetro)
const confusedIdeasResource = createResource(getConfusedIdeasForRetro)

function Entry({
  children,
  isStarred = false,
}: {
  children: React.ReactNode
  isStarred?: boolean
}) {
  const [starred, setStarred] = useState(isStarred)
  const onChange = () => {
    setStarred(!starred)
  }

  return (
    <div className={styles.entry}>
      {children}
      <label htmlFor={String(children)}>
        <span role="presentation" className={styles.entryStar}>
          {starred ? '⭐️' : '☆'}
        </span>
        <span className={visually.hidden}>Starred</span>
      </label>
      <input
        type="checkbox"
        id={String(children)}
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
  const { retroId } = props
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
    //@ts-ignore
    const { content, category } = event.target
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
  const happyIdeas = happyIdeasResource.read(retroId)
  const sadIdeas = sadIdeasResource.read(retroId)
  const confusedIdeas = confusedIdeasResource.read(retroId)

  return (
    <>
      <h1 className={visually.hidden}>Retro</h1>
      <main className={styles.main}>
        <Columns>
          <Column title="happy" show={showHappyColumn}>
            {happyIdeas.map((idea: Idea) => (
              <Entry isStarred={idea.starred} key={idea.id}>
                <span>
                  {idea.content} votes:
                  {idea.votes}
                </span>
              </Entry>
            ))}
          </Column>
          <Column title="sad" show={showSadColumn}>
            {sadIdeas.map((idea: Idea) => (
              <Entry isStarred={idea.starred} key={idea.id}>
                <span>
                  {idea.content} votes:
                  {idea.votes}
                </span>
              </Entry>
            ))}
          </Column>
          <Column title="confused" show={showConfusedColumn}>
            {confusedIdeas.map((idea: Idea) => (
              <Entry isStarred={idea.starred} key={idea.id}>
                <span>
                  {idea.content} votes:
                  {idea.votes}
                </span>
              </Entry>
            ))}
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
