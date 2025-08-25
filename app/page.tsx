"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type ElementType = "rock" | "paper" | "scissors"

interface GameElement {
  id: number
  type: ElementType
  x: number
  y: number
  vx: number
  vy: number
}

const ELEMENT_SIZE = 30
const CONTAINER_WIDTH = 600
const CONTAINER_HEIGHT = 400
const SPEED = 1.5

const elementEmojis = {
  rock: "🪨",
  paper: "📄",
  scissors: "✂️",
}

const elementColors = {
  rock: "bg-gray-500",
  paper: "bg-blue-500",
  scissors: "bg-red-500",
}

export default function RPSSimulation() {
  const [elements, setElements] = useState<GameElement[]>([])
  const [gameRunning, setGameRunning] = useState(false)
  const [winner, setWinner] = useState<ElementType | null>(null)
  const animationRef = useRef<number>()

  const initializeGame = useCallback(() => {
    const initialElements: GameElement[] = []
    let id = 0

    // Create rocks in top-left corner
    for (let i = 0; i < 15; i++) {
      initialElements.push({
        id: id++,
        type: "rock",
        x: Math.random() * 100 + 20,
        y: Math.random() * 100 + 20,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
      })
    }

    // Create papers in top-right corner
    for (let i = 0; i < 15; i++) {
      initialElements.push({
        id: id++,
        type: "paper",
        x: Math.random() * 100 + CONTAINER_WIDTH - 120,
        y: Math.random() * 100 + 20,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
      })
    }

    // Create scissors in bottom-center
    for (let i = 0; i < 15; i++) {
      initialElements.push({
        id: id++,
        type: "scissors",
        x: Math.random() * 100 + CONTAINER_WIDTH / 2 - 50,
        y: Math.random() * 100 + CONTAINER_HEIGHT - 120,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
      })
    }

    setElements(initialElements)
    setWinner(null)
  }, [])

  const getWinner = (type1: ElementType, type2: ElementType): ElementType => {
    if (type1 === type2) return type1
    if (
      (type1 === "rock" && type2 === "scissors") ||
      (type1 === "paper" && type2 === "rock") ||
      (type1 === "scissors" && type2 === "paper")
    ) {
      return type1
    }
    return type2
  }

  const checkCollision = (el1: GameElement, el2: GameElement): boolean => {
    const dx = el1.x - el2.x
    const dy = el1.y - el2.y
    const distanceSquared = dx * dx + dy * dy
    return distanceSquared < ELEMENT_SIZE * ELEMENT_SIZE
  }

  const animate = useCallback(() => {
    setElements((prevElements) => {
      const newElements = [...prevElements]

      // Move elements
      newElements.forEach((element) => {
        element.x += element.vx * 0.8 // Smooth movement by scaling velocity
        element.y += element.vy * 0.8

        // Bounce off walls
        if (element.x <= ELEMENT_SIZE / 2 || element.x >= CONTAINER_WIDTH - ELEMENT_SIZE / 2) {
          element.vx *= -1
          element.x = Math.max(ELEMENT_SIZE / 2, Math.min(CONTAINER_WIDTH - ELEMENT_SIZE / 2, element.x))
        }
        if (element.y <= ELEMENT_SIZE / 2 || element.y >= CONTAINER_HEIGHT - ELEMENT_SIZE / 2) {
          element.vy *= -1
          element.y = Math.max(ELEMENT_SIZE / 2, Math.min(CONTAINER_HEIGHT - ELEMENT_SIZE / 2, element.y))
        }
      })  
      // Check collisions and convert elements
      const elementsToRemove = new Set<number>()
      const elementsToAdd: GameElement[] = []

      for (let i = 0; i < newElements.length; i++) {
        for (let j = i + 1; j < newElements.length; j++) {
          const el1 = newElements[i]
          const el2 = newElements[j]

          if (elementsToRemove.has(el1.id) || elementsToRemove.has(el2.id)) continue

          if (checkCollision(el1, el2) && el1.type !== el2.type) {
            const winnerType = getWinner(el1.type, el2.type)

            if (winnerType === el1.type) {
              // el1 wins, convert el2
              elementsToRemove.add(el2.id)
              elementsToAdd.push({
                ...el2,
                type: el1.type,
                id: Date.now() + Math.random(),
              })
            } else {
              // el2 wins, convert el1
              elementsToRemove.add(el1.id)
              elementsToAdd.push({
                ...el1,
                type: el2.type,
                id: Date.now() + Math.random(),
              })
            }
          }
        }
      }

      // Remove converted elements and add new ones
      const filteredElements = newElements.filter((el) => !elementsToRemove.has(el.id))
      const finalElements = [...filteredElements, ...elementsToAdd]

      // Check if game is over
      const types = new Set(finalElements.map((el) => el.type))
      if (types.size === 1 && finalElements.length > 0) {
        setWinner(finalElements[0].type)
        setGameRunning(false)
      }

      return finalElements
    })

    if (gameRunning) {
      animationRef.current = requestAnimationFrame(animate)
    }
  }, [gameRunning])

  useEffect(() => {
    if (gameRunning) {
      animationRef.current = requestAnimationFrame(animate)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameRunning, animate])

  const startGame = () => {
    setGameRunning(true)
    setWinner(null)
  }

  const stopGame = () => {
    setGameRunning(false)
  }

  const resetGame = () => {
    setGameRunning(false)
    setWinner(null)
    initializeGame()
  }

  // Initialize game on mount
  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  const elementCounts = elements.reduce(
    (acc, el) => {
      acc[el.type] = (acc[el.type] || 0) + 1
      return acc
    },
    {} as Record<ElementType, number>,
  )

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Rock Paper Scissors Battle</h1>

        <div className="flex justify-center gap-4 mb-6">
          <Button onClick={startGame} disabled={gameRunning || winner !== null}>
            Start Game
          </Button>
          <Button onClick={stopGame} disabled={!gameRunning} variant="outline">
            Pause
          </Button>
          <Button onClick={resetGame} variant="outline">
            Reset
          </Button>
        </div>

        <div className="flex justify-center gap-8 mb-6">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl mb-2">🪨</div>
              <div className="font-semibold">Rocks: {elementCounts.rock || 0}</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl mb-2">📄</div>
              <div className="font-semibold">Papers: {elementCounts.paper || 0}</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl mb-2">✂️</div>
              <div className="font-semibold">Scissors: {elementCounts.scissors || 0}</div>
            </div>
          </Card>
        </div>

        {winner && (
          <div className="text-center mb-6">
            <Card className="p-6 bg-green-100 dark:bg-green-900">
              <h2 className="text-2xl font-bold text-green-800 dark:text-green-200">
                {elementEmojis[winner]} {winner.charAt(0).toUpperCase() + winner.slice(1)} Wins!
              </h2>
            </Card>
          </div>
        )}

        <div className="flex justify-center">
          <div
            className="relative border-2 border-border bg-card rounded-lg overflow-hidden"
            style={{ width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT }}
          >
            {elements.map((element) => (
              <div
                key={element.id}
                className={`absolute rounded-full flex items-center justify-center text-lg transition-all duration-50 ${elementColors[element.type]}`}
                style={{
                  left: element.x - ELEMENT_SIZE / 2,
                  top: element.y - ELEMENT_SIZE / 2,
                  width: ELEMENT_SIZE,
                  height: ELEMENT_SIZE,
                }}
              >
                {elementEmojis[element.type]}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-6 text-muted-foreground">
          <p>Watch as rocks, papers, and scissors battle it out!</p>
          <p className="text-sm mt-2">Rock beats Scissors • Paper beats Rock • Scissors beats Paper</p>
        </div>
      </div>
    </div>
  )
}
