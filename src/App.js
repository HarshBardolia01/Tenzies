import React from "react"
import './style.css';
import Die from "./components/Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [count, setCount] = React.useState(0)
    const [BestCount, setBestCount] = React.useState(-1)

    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            setBestCount(prevBestCount => (
                prevBestCount === -1 ? count : Math.min(prevBestCount, count)
            ))
        }
    }, [dice])

    function generateNewDie(value) {
        let val = Math.ceil(Math.random() * 6)
        while (val === value) {
            val = Math.ceil(Math.random() * 6)
        }
        return {
            value: val,
            isHeld: false,
            id: nanoid()
        }
    }

    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie(7))
        }
        return newDice 
    }

    function rollDice() {
        if (tenzies) {
            setCount(0)
            setTenzies(false)
            setDice(allNewDice())
        } else {
            setCount(prevCount => prevCount + 1)
            setDice(prevDice => prevDice.map(die => {
                return die.isHeld ?
                    die : 
                    generateNewDie(die.value)
            }))
        }
    }

    function resetDice() {
        setCount(0)
        setTenzies(false)
        setDice(allNewDice())
    }

    function holdDice(id) {
        setDice(prevDice => prevDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }

    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))

    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">
                Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
            </p>
            <div className="roll-count">
                <span>
                    Count: {count}
                </span>
                <span>
                    Best Score: {BestCount === -1 ? "" : BestCount}
                </span>
            </div>
            <div className="die-container">
                {diceElements}
            </div>
            <div className="buttons">
                <button 
                    className="roll-dice"
                    onClick={rollDice}
                >
                    {tenzies === true ? "Play Again" : "Roll"}
                </button>
                {
                    !tenzies && 
                    <button 
                        className="roll-dice"
                        onClick={resetDice}
                    >
                        Reset
                    </button>
                }
            </div>
        </main>     
    )
}

export default App