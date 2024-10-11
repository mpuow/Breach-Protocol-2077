import { useState } from "react"
import { motion } from "framer-motion"

interface Props {
    setSolutionLength: React.Dispatch<React.SetStateAction<number>>
    setBufferSize: React.Dispatch<React.SetStateAction<number>>
    setMatrixSize: React.Dispatch<React.SetStateAction<number>>
    setInitialTime: React.Dispatch<React.SetStateAction<number>>
    gameStart: React.MutableRefObject<boolean>
    setSolvedArray: React.Dispatch<React.SetStateAction<number[][]>>
    gameStatus: string
    setInfoClicked: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DifficultySelector(props: Props) {
    const [difficulty, setDifficulty] = useState("choom") // default difficulty

    // Difficulty options and their settings
    const difficultyOptions = [
        {"difficultyName" : "Choom", "solutionLength" : 7, "matrixSize" : 5, "initialTime" : 10000, "style" : "text-cyber-success underline"},
        {"difficultyName" : "Hacker", "solutionLength" : 8, "matrixSize" : 6, "initialTime" : 15000, "style" : "text-cyber-blue-darker underline"},
        {"difficultyName" : "Netrunner", "solutionLength" : 9, "matrixSize" : 7, "initialTime" : 20000, "style" : "text-cyber-yellow underline"},
        {"difficultyName" : "Bartmoss", "solutionLength" : 12, "matrixSize" : 8, "initialTime" : 30000, "style" : "text-cyber-red underline"}
    ]

    // Set state variables with difficulty settings
    const difficultySelect = (difficulty:string, solutionLength:number, matrixSize:number, initialTime:number) => {
        if (!props.gameStart.current && props.gameStatus === "") {
            setDifficulty(difficulty.toLowerCase())
            props.setSolutionLength(solutionLength)
            props.setBufferSize(solutionLength + 1)
            props.setMatrixSize(matrixSize)
            props.setInitialTime(initialTime)
            props.setSolvedArray([])
        }
    }

    return (
        <div className="relative">
            <motion.span
                whileTap={{scale: 0.95}} 
                className="border-[1px] border-transparent hover:border-cyber-blue hover:text-cyber-blue text-cyber-red-light font-semibold mb-4 p-2 absolute right-6" 
                onClick={() => props.setInfoClicked(true)}>
                HOW TO PLAY
            </motion.span>

            <div className="flex items-center justify-center flex-col select-none">

                <h1 className="text-cyber-green text-xl">DIFFICULTY</h1>
                <ul className="flex flex-row space-x-4 text-xl">
                    {Object.values(difficultyOptions).map((d) => (
                        <motion.li 
                            whileTap={!props.gameStart.current && props.gameStatus === "" ? {scale: 0.95} : {}}
                            key={d.difficultyName}
                            onClick={() => difficultySelect(d.difficultyName, d.solutionLength, d.matrixSize, d.initialTime)}
                            className={`${d.difficultyName.toLowerCase() === difficulty ? `${d.style}` : `${!props.gameStart.current && props.gameStatus === "" ? "hover:text-cyber-green" : ""}` }`}>
                            {d.difficultyName}
                        </motion.li>
                    ))}
                </ul>
            </div>
        </div>
    )
}