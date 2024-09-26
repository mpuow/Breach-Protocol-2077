import { useRef, useState } from "react"
import CodeMatrix from "./components/CodeMatrix"
import Sequences from "./components/Sequences"
import Buffer from "./components/Buffer"
import BreachTime from "./components/BreachTime"
import DifficultySelector from "./components/DifficultySelector"

function App() {
    const defaultSettings = {solutionLength: 6, matrixSize: 4, initialTime: 10000}
    // {solutionLength: 6, matrixSize: 5, initialTime: 10000}

    const [userSelect, setUserSelect] = useState<string[]>([])
    const [solutionLength, setSolutionLength] = useState<number>(defaultSettings.solutionLength)
    const [bufferSize, setBufferSize] = useState<number>(defaultSettings.solutionLength + 1)
    const [matrixSize, setMatrixSize] = useState<number>(defaultSettings.matrixSize)
    const [initialTime, setInitialTime] = useState<number>(defaultSettings.initialTime)
    const [solutionStringArray, setSolutionStringArray] = useState<string[]>([])
    const [combinationHover, setCombinationHover] = useState<string>("")
    const [matrixHover, setMatrixHover] = useState<string>("")
    const gameStart = useRef(false)
    const [gameStatus, setGameStatus] = useState<string>("")
    const gameReset = useRef(false)
    const [sequenceArray, setSequenceArray] = useState<string[][]>([])

    return (
        <div className="border-2 border-cyber-green p-2 h-[90vh] m-6 select-none">
            {/* <h1 className="font-bold text-3xl mb-4">Breach Protocol</h1> */}

            <div className="my-6">
                <DifficultySelector
                setSolutionLength={setSolutionLength}
                setBufferSize={setBufferSize}
                setMatrixSize={setMatrixSize}
                setInitialTime={setInitialTime} />
            </div>

            <div className="w-full flex flex-row h-[10vh] mb-6">
                <div className="w-1/3 mx-4 pr-16">
                    <div className="w-full">
                        <h1 className="text-xl invisible">BUFFER</h1>
                        <BreachTime 
                        initialTime={initialTime}
                        gameStart={gameStart}
                        setGameStatus={setGameStatus}
                        gameReset={gameReset} />
                    </div>
                </div>
                <div className="">
                    <h1 className="text-xl text-cyber-lightgreen">BUFFER</h1>
                    <Buffer 
                        userSelect={userSelect} 
                        bufferSize={bufferSize}
                        matrixHover={matrixHover}
                        gameStatus={gameStatus} />
                </div>
            </div>

            <div className="w-full flex flex-row">
                <div className="w-1/3 mx-4">
                    <CodeMatrix
                        userSelect={userSelect}
                        setUserSelect={setUserSelect}
                        bufferSize={bufferSize}
                        solutionStringArray={solutionStringArray}
                        setSolutionStringArray={setSolutionStringArray}
                        matrixSize={matrixSize}
                        combinationHover={combinationHover}
                        setCombinationHover={setCombinationHover} 
                        setMatrixHover={setMatrixHover}
                        gameStart={gameStart}
                        gameStatus={gameStatus}
                        setGameStatus={setGameStatus}
                        gameReset={gameReset}
                        solutionLength={solutionLength}
                        sequenceArray={sequenceArray} />
                </div>
                <div className="w-2/3 mx-8">
                    <Sequences 
                    solutionStringArray={solutionStringArray} 
                    combinationHover={combinationHover} 
                    setCombinationHover={setCombinationHover} 
                    matrixHover={matrixHover}
                    userSelect={userSelect}
                    setUserSelect={setUserSelect}
                    bufferSize={bufferSize}
                    setGameStatus={setGameStatus}
                    gameStart={gameStart}
                    gameReset={gameReset}
                    setSequenceArray={setSequenceArray} />
                </div>
            </div>

        </div>
    )
}

export default App