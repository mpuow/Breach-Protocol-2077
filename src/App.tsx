import { useRef, useState } from "react"
import CodeMatrix from "./components/CodeMatrix"
import Sequences from "./components/Sequences"
import Buffer from "./components/Buffer"
import BreachTime from "./components/BreachTime"
import DifficultySelector from "./components/DifficultySelector"
import './App.css'
import HowToPlay from "./components/HowToPlay"

function App() {
    const defaultSettings = {solutionLength: 7, matrixSize: 5, initialTime: 10000}
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
    const [solvedArray, setSolvedArray] = useState<number[][]>([])
    const [infoClicked, setInfoClicked] = useState<boolean>(false)

    return (
        <>
            <div className="w-full h-[100vh] overflow-y-hidden flex items-center justify-center flex-col md:w-0 md:h-0">
                <span>THIS APP IS DESIGNED FOR LARGER SCREENS.</span>
                <span>PLEASE USE A LARGER SCREEN.</span>
            </div>

            {/* Background blur for modal */}
            <div className={`modal z-30 ${infoClicked ? "w-full h-full" : "w-0 h-0"}`} onClick={() => setInfoClicked(false)}></div>

            <HowToPlay infoClicked={infoClicked} setInfoClicked={setInfoClicked} />


            <div className="border-cyber-green h-0 select-none overflow-hidden md:h-[89vh] md:border-2 md:m-4 md:p-2">

                <div className="my-4">
                    <DifficultySelector
                        setSolutionLength={setSolutionLength}
                        setBufferSize={setBufferSize}
                        setMatrixSize={setMatrixSize}
                        setInitialTime={setInitialTime}
                        gameStart={gameStart}
                        setSolvedArray={setSolvedArray}
                        gameStatus={gameStatus}
                        setInfoClicked={setInfoClicked} />
                </div>

                <div className="w-full flex flex-row h-[10vh] mb-6">
                    <div className="w-1/3 mx-4 pr-16">
                        <div className="w-full">
                            <h1 className="text-xl invisible">BUFFER</h1>
                            <BreachTime
                                initialTime={initialTime}
                                gameStart={gameStart}
                                setGameStatus={setGameStatus}
                                gameReset={gameReset}
                                gameStatus={gameStatus} />
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
                            sequenceArray={sequenceArray}
                            solvedArray={solvedArray}
                            setSolvedArray={setSolvedArray} />
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
                            setSequenceArray={setSequenceArray}
                            gameStatus={gameStatus} />
                    </div>
                </div>

            </div>

            <div className="bottom-0 h-[6vh] w-full fixed text-center text-sm">
                <div className="flex items-center justify-center flex-col">
                    <span>NOT AN OFFICIAL APP. TRADEMARK OWNED BY CD PROJEKT S.A.</span>
                    <a className="text-cyber-red-menu w-fit hover:text-cyber-blue-darker" href="https://github.com/mpuow/2077-Hacking-Minigame">Github</a>
                </div>
            </div>
        </>
    )
}

export default App