import { useState } from "react"

interface Props {
    setSolutionLength: React.Dispatch<React.SetStateAction<number>>
    setBufferSize: React.Dispatch<React.SetStateAction<number>>
    setMatrixSize: React.Dispatch<React.SetStateAction<number>>
    setInitialTime: React.Dispatch<React.SetStateAction<number>>
}

export default function DifficultySelector(props: Props) {
    const [difficulty, setDifficulty] = useState("choom") // default difficulty

    // {"difficultyName" : "Choom", "solutionLength" : 6, "matrixSize" : 5, "timer" : 10000,
    const difficultyOptions = [
        {"difficultyName" : "Choom", "solutionLength" : 6, "matrixSize" : 5, "initialTime" : 10000, "style" : "text-cyber-success"},
        {"difficultyName" : "Hacker", "solutionLength" : 7, "matrixSize" : 6, "initialTime" : 15000, "style" : "text-cyber-blue"},
        {"difficultyName" : "Netrunner", "solutionLength" : 8, "matrixSize" : 7, "initialTime" : 20000, "style" : "text-cyber-yellow"},
        {"difficultyName" : "Bartmoss", "solutionLength" : 10, "matrixSize" : 8, "initialTime" : 30000, "style" : "text-cyber-red"}
    ]

    const difficultySelect = (difficulty:string, solutionLength:number, matrixSize:number, initialTime:number) => {
        setDifficulty(difficulty.toLowerCase())
        props.setSolutionLength(solutionLength)
        props.setBufferSize(solutionLength + 1)
        props.setMatrixSize(matrixSize)
        props.setInitialTime(initialTime)
    }

    return (
        <div className="flex items-center justify-center flex-col select-none">
            <h1 className="text-cyber-green text-xl">DIFFICULTY</h1>
            <ul className="flex flex-row space-x-4 text-xl">
                {Object.values(difficultyOptions).map((d) => (
                    <li key={d.difficultyName} onClick={() => difficultySelect(d.difficultyName, d.solutionLength, d.matrixSize, d.initialTime)} className={`${d.difficultyName.toLowerCase() === difficulty ? `${d.style}` : "" }`}>
                        {d.difficultyName}
                    </li>
                ))}
            </ul>
        </div>
    )
}