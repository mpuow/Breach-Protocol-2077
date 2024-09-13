import { useEffect, useState } from "react"
import CodeMatrix from "./components/CodeMatrix"
import Sequences from "./components/Sequences"
import Buffer from "./components/Buffer"
import BreachTime from "./components/BreachTime"

function App() {
    const [userSelect, setUserSelect] = useState<string[]>([])
    const [bufferSize, setBufferSize] = useState(8)
    const [matrixSize, setMatrixSize] = useState(6)
    const [solutionStringArray, setSolutionStringArray] = useState<string[]>([])

    return (
        <>
            <h1 className="font-bold text-3xl mb-6">Breach Protocol</h1>

            <div className="w-full flex flex-row h-[10vh] mb-6">
                <div className="w-1/3 mx-5">
                    <div className="w-full">
                        <h1 className="text-xl invisible">BUFFER</h1>
                        <BreachTime />
                    </div>
                </div>
                {/* border issue is with the 2/3 here */}
                <div className="w-2/3 mx-5">
                    <h1 className="text-xl text-cyber-lightgreen">BUFFER</h1>
                    <Buffer userSelect={userSelect} bufferSize={bufferSize} />
                </div>
            </div>

            <div className="w-full flex flex-row">
                <div className="w-1/3 mx-5">
                    <CodeMatrix userSelect={userSelect} setUserSelect={setUserSelect} bufferSize={bufferSize} solutionStringArray={solutionStringArray} setSolutionStringArray={setSolutionStringArray} matrixSize={matrixSize} />
                </div>
                <div className="w-2/3 mx-5">
                    <Sequences solutionStringArray={solutionStringArray} />
                </div>
            </div>

        </>
    )
}

export default App