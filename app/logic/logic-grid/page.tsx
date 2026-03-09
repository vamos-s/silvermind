'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

type Item = { name: string, value: number }

export default function LogicGridPage() {
  const { t } = useTranslation()
  const { currentDifficulty, addSession } = useGameStore()

  const [items, setItems] = useState<Item[]>([])
  const [userOrder, setUserOrder] = useState<string[]>([])
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [hints, setHints] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [victory, setVictory] = useState(false)

  const getItemCount = useCallback(() => {
    switch (currentDifficulty) {
      case 'easy': return 3
      case 'medium': return 4
      case 'hard': return 5
    }
  }, [currentDifficulty])

  const generatePuzzle = useCallback(() => {
    const count = getItemCount()
    const names = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape', 'Honeydew']
    const values = Array.from({ length: count }, (_, i) => ({
      name: names[i],
      value: Math.floor(Math.random() * 100) + 1
    })).sort((a, b) => a.value - b.value)

    const newHints: string[] = []

    // Generate various hint types
    const hintTypes = [
      () => `${values[0].name} has the smallest value (${values[0].value})`,
      () => `${values[values.length - 1].name} has the largest value (${values[values.length - 1].value})`,
      () => {
        const idx = Math.floor(Math.random() * values.length)
        return `${values[idx].name} has value ${values[idx].value}`
      },
      () => {
        const smaller = values.slice(0, Math.floor(values.length / 2))
        const larger = values.slice(Math.floor(values.length / 2))
        const s = smaller[Math.floor(Math.random() * smaller.length)]
        const l = larger[Math.floor(Math.random() * larger.length)]
        return `${s.name} (${s.value}) is less than ${l.name} (${l.value})`
      },
      () => {
        const sorted = [...values].sort((a, b) => b.value - a.value)
        return `The order from highest to lowest is: ${sorted.map(v => v.name).join(', ')}`
      }
    ]

    const hintCount = currentDifficulty === 'easy' ? 2 : currentDifficulty === 'medium' ? 3 : 4
    for (let i = 0; i < hintCount; i++) {
      const hintType = hintTypes[Math.floor(Math.random() * hintTypes.length)]
      newHints.push(hintType())
    }

    setItems(values)
    setHints(newHints)
    setUserOrder([])
    setSelectedItem(null)
    setGameOver(false)
    setVictory(false)
  }, [currentDifficulty, getItemCount])

  const handleItemClick = useCallback((item: string) => {
    if (gameOver) return

    if (selectedItem === item) {
      setSelectedItem(null)
    } else if (selectedItem === null) {
      setSelectedItem(item)
    } else {
      // Swap items in user order
      if (userOrder.includes(item) && userOrder.includes(selectedItem)) {
        const newOrder = [...userOrder]
        const idx1 = newOrder.indexOf(item)
        const idx2 = newOrder.indexOf(selectedItem)
        newOrder[idx1] = selectedItem
        newOrder[idx2] = item
        setUserOrder(newOrder)
      } else if (!userOrder.includes(selectedItem)) {
        setUserOrder([...userOrder, selectedItem])
      }
      setSelectedItem(null)
    }
  }, [gameOver, selectedItem, userOrder])

  const handleAddToOrder = useCallback(() => {
    if (selectedItem && !userOrder.includes(selectedItem)) {
      setUserOrder([...userOrder, selectedItem])
      setSelectedItem(null)
    }
  }, [selectedItem, userOrder])

  const handleRemoveFromOrder = useCallback((item: string) => {
    setUserOrder(userOrder.filter(i => i !== item))
  }, [userOrder])

  const checkSolution = useCallback(() => {
    if (userOrder.length !== items.length) return

    const isCorrect = userOrder.every((item, i) => {
      const itemObj = items.find(i => i.name === item)
      return itemObj && items.indexOf(itemObj) === i
    })

    if (isCorrect) {
      setVictory(true)
      setGameOver(true)
      const levelScore = (items.length * 30) * level
      setScore(score + levelScore)
      addSession({
        id: Date.now().toString(),
        gameId: 'logic-grid',
        difficulty: currentDifficulty,
        score: score + levelScore,
        completedAt: new Date(),
        durationSeconds: 90 * level
      })
    }
  }, [userOrder, items, level, score, addSession, currentDifficulty])

  useEffect(() => {
    generatePuzzle()
  }, [])

  if (gameOver && victory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md"
        >
          <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Solved!</h2>
          <p className="text-xl text-gray-600 mb-2">Score: {score}</p>
          <p className="text-lg text-gray-500 mb-6">Level: {level}</p>
          <button
            onClick={() => {
              setLevel(level + 1)
              generatePuzzle()
            }}
            className="bg-green-500 text-white px-8 py-3 rounded-xl text-xl font-bold hover:bg-green-600 transition mb-4"
          >
            Next Level
          </button>
          <br />
          <button
            onClick={() => {
              setScore(0)
              setLevel(1)
              generatePuzzle()
            }}
            className="bg-blue-500 text-white px-8 py-3 rounded-xl text-xl font-bold hover:bg-blue-600 transition"
          >
            Restart
          </button>
          <Link href="/logic" className="block mt-4 text-green-500 hover:underline">
            ← Back to Games
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="p-6 bg-white shadow-sm">
        <Link href="/logic" className="text-green-500 hover:underline mb-4 block">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">🧩 Logic Grid</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <div className="flex justify-center gap-8 text-2xl mb-4">
            <p className="font-bold text-green-600">Score: {score}</p>
            <p className="font-bold text-blue-600">Level: {level}</p>
          </div>
          <p className="text-lg text-gray-600">Arrange items in order from smallest to largest value</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">📝 Hints</h2>
            <ul className="space-y-3">
              {hints.map((hint, i) => (
                <li key={i} className="bg-gray-100 rounded-lg p-3 text-gray-700">
                  {hint}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">📦 Items</h2>
            <div className="grid grid-cols-2 gap-3">
              {items.map((item, i) => (
                <motion.button
                  key={item.name}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleItemClick(item.name)}
                  className={`p-4 rounded-lg font-bold transition-all ${
                    selectedItem === item.name
                      ? 'bg-yellow-400 text-white border-4 border-yellow-500'
                      : userOrder.includes(item.name)
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-50'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  disabled={userOrder.includes(item.name)}
                >
                  {item.name}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg max-w-2xl mx-auto mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">📋 Your Order (Smallest → Largest)</h2>
          <div className="flex flex-wrap gap-3 min-h-[60px] bg-gray-100 rounded-lg p-4">
            {userOrder.length === 0 ? (
              <p className="text-gray-500">Click items to add them to your order</p>
            ) : (
              userOrder.map((item, i) => (
                <motion.button
                  key={item}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleRemoveFromOrder(item)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-500 transition"
                >
                  {i + 1}. {item} ❌
                </motion.button>
              ))
            )}
          </div>

          <div className="flex gap-4 mt-4 justify-center">
            <button
              onClick={handleAddToOrder}
              disabled={!selectedItem}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Selected
            </button>
            <button
              onClick={checkSolution}
              disabled={userOrder.length !== items.length}
              className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check Solution
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
