import { FC, useEffect, useState } from 'react'
import './App.css'

const totalGridSize = 20

const snakeInitialPosition = [
  {
    x: totalGridSize / 2,
    y: totalGridSize / 2 + 1,
  },
  {
    x: totalGridSize / 2,
    y: totalGridSize / 2,
  },
]

type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT' | 'NONE'

export const App: FC = () => {
  const [score, setScore] = useState(0)
  const [food, setFood] = useState({
    x: 5,
    y: 5,
  })
  const [snake, setSnake] = useState(snakeInitialPosition)
  const [direction, setDirection] = useState<Direction>('NONE')

  function renderBoard() {
    const cellArray = []

    for (let row = 0; row < totalGridSize; row++) {
      for (let col = 0; col < totalGridSize; col++) {
        let classes = 'cell'
        const isFood = food.x === row && food.y === col
        const isSnake = snake.some((dot) => dot.x === row && dot.y === col)
        const isSnakeHead = snake[0].x === row && snake[0].y === col

        if (isFood) {
          classes = `${classes} food`
        }

        if (isSnake) {
          classes = `${classes} snake`
        }

        if (isSnakeHead) {
          classes = `${classes} snake-head`
        }

        const cell = <div key={`${row}-${col}`} className={classes} />

        cellArray.push(cell)
      }
    }

    return cellArray
  }

  function renderFood() {
    const randomX = Math.floor(Math.random() * totalGridSize)
    const randomY = Math.floor(Math.random() * totalGridSize)

    setFood({
      x: randomX,
      y: randomY,
    })
  }

  function gameOver() {
    setSnake(snakeInitialPosition)
    setScore(0)
    setDirection('NONE')
  }

  function updateGame() {
    if (direction === 'NONE') {
      return
    }

    if (snake[0].x < 0 || snake[0].x > totalGridSize || snake[0].y < 0 || snake[0].y > totalGridSize) {
      gameOver()
      return
    }

    const isSnake = snake.slice(1).some((dot) => dot.x === snake[0].x && dot.y === snake[0].y)

    if (isSnake) {
      gameOver()
      return
    }

    const newSnake = [...snake]

    switch (direction) {
      case 'UP':
        newSnake.unshift({ x: newSnake[0].x - 1, y: newSnake[0].y })
        break
      case 'DOWN':
        newSnake.unshift({ x: newSnake[0].x + 1, y: newSnake[0].y })
        break
      case 'LEFT':
        newSnake.unshift({ x: newSnake[0].x, y: newSnake[0].y - 1 })
        break
      case 'RIGHT':
        newSnake.unshift({ x: newSnake[0].x, y: newSnake[0].y + 1 })
        break
    }

    if (newSnake[0].x === food.x && newSnake[0].y === food.y) {
      setScore((prev) => prev + 1)
      renderFood()
    } else {
      newSnake.pop()
    }

    setSnake(newSnake)
  }

  function updateDirection(e: KeyboardEvent) {
    const key = e.code

    switch (key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP')
        break
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN')
        break
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT')
        break
      case 'ArrowRight':
        if (direction !== 'LEFT') setDirection('RIGHT')
        break
    }
  }

  useEffect(() => {
    const moveSnake = setInterval(updateGame, 150)

    return () => clearInterval(moveSnake)
  })

  useEffect(() => {
    document.addEventListener('keydown', updateDirection)

    return () => document.removeEventListener('keydown', updateDirection)
  })

  return (
    <main className="main">
      <div className="score">
        Счет: <span>{score}</span>
      </div>
      <div className="board">{renderBoard()}</div>
    </main>
  )
}
