import { motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import "./Sequences.css"
import { randomNumber } from "./CodeMatrix"

interface Props {
    solutionStringArray: string[]
    combinationHover: string
    setCombinationHover: React.Dispatch<React.SetStateAction<string>>
    matrixHover: string
    userSelect: string[]
    setUserSelect: React.Dispatch<React.SetStateAction<string[]>>
    bufferSize: number
    setGameStatus: React.Dispatch<React.SetStateAction<string>>
    gameStart: React.MutableRefObject<boolean>
    gameReset: React.MutableRefObject<boolean>
    setSequenceArray: React.Dispatch<React.SetStateAction<string[][]>>
    gameStatus: string
    inputCover: boolean
    setInputCover: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Sequences(props: Props) {

    // Declare before useMemo
    const [componentSequenceArray, setComponentSequenceArray] = useState<string[][]>([])
    
    // useMemo prevents the sequence array from being rewritten every render
    const cachedFinalSequenceArray = useMemo(() => splitSolutionStringArray(props.solutionStringArray), [props.solutionStringArray])

    // Valid status: atstart, inprogress (inprogressSpace), completed, failed
    const [rowStatus, setRowStatus] = useState<string[]>(["atstart", "atstart", "atstart"])
    const [sequenceIndex, setSequenceIndex] = useState<number[]>([0,0,0])
    const [spaceIndex, setSpaceIndex] = useState<number[]>([0,0,0])
    const [lineIndex, setLineIndex] = useState<number[]>([0,0,0])
    const [invisElements, setInvisElements] = useState([<span key={-1}></span>])
    const [rowAnimate, setRowAnimate] = useState<boolean[]>([true, true, true])
    // const [inputCover, setInputCover] = useState(false)

    // Used to reset sequences
    const handleReset = useMemo(() => {
        if (props.gameReset.current) {
            setRowStatus(["atstart", "atstart", "atstart"])
            setSequenceIndex([0,0,0])
            setSpaceIndex([0,0,0])
            setLineIndex([0,0,0])
            setInvisElements([<span key={-1}></span>])
            setRowAnimate([true, true, true])
            console.log("Reset")
        }
      }, [props.gameReset.current])

    // Check answer and update state
    function checkUserAnswer(sequences:string[][], userSelect:string[]) {
        /*
            Buffer-Contains-Sequence algorithm works by:
                1. Converting the buffer array and sequence row array to strings
                2. Inverting the strings
                3. Checking if the buffer starts with a valid sequence
    
            This allows dead inputs into the buffer before the sequence for tactical play
            Eg: ['7A', 'E9', '1C']  -> C1,9E,A7
                ['E9', '1C']        -> C1,9E
                = True
        */
        function bufferContainsSequence(sequence:string[], buffer:string[], progressCheckIndex:number) {
            // Turn arrays into strings
            const sequenceString = sequence.join()
            let bufferString = ""
            
            // Checking for completion or progress 
            if (progressCheckIndex > -1) {
                // Only check the most recent input into buffer
                bufferString = buffer[progressCheckIndex]
                return sequenceString.startsWith(bufferString)
            } else {
                bufferString = buffer.join()
            }
        
            // Reverse the strings
            const reverseSequenceString = sequenceString.split('').reverse().join('')
            const reverseBufferString = bufferString.split('').reverse().join('')
    
            // Return true if the user has selected a valid sequence
            return reverseBufferString.startsWith(reverseSequenceString)
        }

        // Declare outside of the loop to avoid rewriting on subsequent loops
        let tempStatus = [...rowStatus]
        let tempSequenceIndex = [... sequenceIndex]
        let bufferRemaining = props.bufferSize - userSelect.length

        // Loop through and check each row
        for (let i = 0; i < sequences.length; i++) {

            // Skip unnecessary loop iterations
            if (tempStatus[i] === "completed" || tempStatus[i] === "failed") {
                // Check if all rows are complete
                checkGameWin(tempStatus)
                continue
            }

            // Check if inprogress or set inprogress
            if (tempStatus[i] === "inprogress" || tempStatus[i] === "inprogressSpace") {
                // Reset status after space correction
                if (tempStatus[i] === "inprogressSpace") {
                    tempStatus[i] = "inprogress"
                }

                // Increase row index to check if row is still inprogress
                tempSequenceIndex[i] = tempSequenceIndex[i] + 1

                // If the last user entry is not equal to the next combination in the sequence
                if (userSelect[userSelect.length - 1] !== sequences[i][tempSequenceIndex[i]]) {
                    // Check if there is no space left in the buffer
                    if (bufferRemaining <= sequences[i].length - 1) {
                        tempStatus[i] = "failed"

                        // Check immediately to update properly
                        checkGameWin(tempStatus)
                    } else {
                        // If last input started a sequence, and user selects the same combination
                        if (userSelect[userSelect.length - 2] === sequences[i][0] && userSelect[userSelect.length - 1] === sequences[i][0]) {
                            // Set temp status to change spacing
                            tempStatus[i] = "inprogressSpace"
                        } else {
                            // Reset row
                            tempStatus[i] = "atstart"
                        }
                        // Reset row index
                        tempSequenceIndex[i] = 0
                    }
                }
            } else {
                // Check if last entry into buffer is the start of a sequence
                if (bufferContainsSequence(sequences[i], userSelect, userSelect.length - 1) && userSelect.length > 0) {
                    tempStatus[i] = "inprogress"
                }
            }

            // Check if buffer contains complete sequence in order
            if (bufferContainsSequence(sequences[i], userSelect, -1) && userSelect.length > 1) {

                // Set with the row that has been completed
                if (tempStatus[i] === "inprogress") {
                    tempStatus[i] = "completed"
                    // Check here to update lineIndex properly
                    checkInProgress(tempStatus)
                }

                // Check immediately in case of finishing a sequence with the last user select
                checkGameWin(tempStatus)

                // Skip the last part of failure checking
                continue
            }

            // Set row to failed if not inprogress and not enough buffer
            if (bufferRemaining < sequences[i].length && tempStatus[i] === "atstart") {
                tempStatus[i] = "failed"

                // Check immediately in case of failing a sequence with the last user select
                checkGameWin(tempStatus)
            }

            // Set line and space indexes
            checkInProgress(tempStatus)

        }
        // Set the state outside the loop to avoid re-render issues
        setRowStatus(tempStatus)
        setSequenceIndex(tempSequenceIndex)

    }

    // Check and change the select line index and the spacing of the sequences
    function checkInProgress(rowStatus: string[]) {
        // Return if user hasn't selected anything
        if (props.userSelect.length < 1) {
            return
        }

        // Declare local versions of useState
        let tempSpaceIndex = [...spaceIndex]
        let tempLineIndex = [...lineIndex]

        // Map through all rows
        rowStatus.map((val, index) => {
            if (val !== "completed" && val !== "failed") {
                // If the line is inprogress, only the select line index should change
                if (val === "inprogress") {
                    tempLineIndex[index] = tempLineIndex[index] + 1
                } else if (val === "inprogressSpace") {
                    // Space out sequence that is continuing
                    tempSpaceIndex[index] = tempSpaceIndex[index] + 1
                } else {
                    // If the row has been started, but not completed or failed, add the extra spacing to the space index
                    if (tempLineIndex[index] !== 0) {
                        tempSpaceIndex[index] = tempSpaceIndex[index] + tempLineIndex[index]
                        tempLineIndex[index] = 0
                    }

                    // Skips adding space if user input doesn't change row status
                    if (JSON.stringify(rowStatus) === '["atstart","atstart","atstart"]') {
                        return
                    }

                    // Add one space if not inprogress
                    tempSpaceIndex[index] = tempSpaceIndex[index] + 1
                }
            }

            // If completed, move select line off the last combination in the row
            if (val === "completed" || val === "failed") {
                // tempLineIndex[index] = val.length
                tempLineIndex[index] = -1
            }
        })

        // Set useState to the updated version
        setLineIndex(tempLineIndex)
        setSpaceIndex(tempSpaceIndex)
    }

    // Check if player has solved the puzzle and to what degree
    function checkGameWin(rowStatus:string[]) {

        // Case of completing all sequences
        if (JSON.stringify(rowStatus) === `["completed","completed","completed"]`) {
            props.setGameStatus("win")
            props.gameStart.current = false
            return
        }

        // Case of not completing all sequences
        if (!JSON.stringify(rowStatus).includes("atstart") && !JSON.stringify(rowStatus).includes("inprogress")) {
            // Case of completing some sequences
            if (JSON.stringify(rowStatus).includes("completed")) {
                props.setGameStatus("win")
                props.gameStart.current = false
            }
            // Case of failing all sequences
            else if (JSON.stringify(rowStatus) === `["failed","failed","failed"]`) {
                props.setGameStatus("lose")
                props.gameStart.current = false
            }

            return
        }

        // Case of no buffer remaining
        if (props.userSelect.length >= props.bufferSize) {
            props.setGameStatus("lose")
            props.gameStart.current = false
            return
        }
    }

    // Check answers after every user select
    useEffect(() => {
        checkUserAnswer(cachedFinalSequenceArray, props.userSelect)

        // Reset variables upon game reset
        handleReset

        props.setSequenceArray(componentSequenceArray)

        // Set sequences to failed if time runs out
        if (!props.gameStart.current && props.gameStatus !== "") {
            let localRowStatus = [...rowStatus]
            for (let i = 0; i < localRowStatus.length; i++) {
                if (localRowStatus[i] === "completed") {
                    props.setGameStatus("win")
                    continue
                }
                localRowStatus[i] = "failed"
            }
            setRowStatus(localRowStatus)
        }

    }, [props.userSelect, componentSequenceArray, props.gameStart.current, props.gameStatus, setRowStatus])


    // Splits the solution string into 3 parts
    function splitSolutionStringArray(solutionStringArray:string[]) {
        
        // Find valid index locations to split the solution string
        let possibleIndexVariations = []
        let moduloSolutionLength = solutionStringArray.length % 3
        
        if (moduloSolutionLength === 0) {
            const indexLocation = solutionStringArray.length / 3

            // Evenly divided by 3, all indexes are equal
            possibleIndexVariations = [indexLocation, indexLocation, indexLocation]
        } else {
            const indexLocation = solutionStringArray.length / 3

            // Add remaining length to some indexLocations
            for (let i = 0; i < moduloSolutionLength; i++) {
                possibleIndexVariations.push(indexLocation + 1)
            }

            // Add indexLocations until length is 3
            while (possibleIndexVariations.length < 3) {
                possibleIndexVariations.push(indexLocation)
            }
        }
        
        let finalSequenceArray = []
    
        // Create local copy of solutionStringArray to avoid mutating it directly
        let split3 = solutionStringArray.slice(0)
        let split1 = (split3.splice(0, possibleIndexVariations[0]))
        let split2 = (split3.splice(0, possibleIndexVariations[1]))

        // New array to shuffle
        let splitArray:string[][] = []
        splitArray.push(split1, split2, split3)

        // Ensuring that sequences are in a different order every generation
        if (split1.length > 2) {
            let currentIndex = splitArray.length
            while (currentIndex != 0) {
                let randomIndex = randomNumber(currentIndex)
                console.log(randomIndex)
                currentIndex--

                // Swap sequences
                let tempSplit = splitArray[currentIndex]
                splitArray[currentIndex] = splitArray[randomIndex]
                splitArray[randomIndex] = tempSplit
            }
        }
    
        // Push results to finalSequenceArray
        finalSequenceArray.push(splitArray[0], splitArray[1], splitArray[2])
        
        // Steps to set variables for props, avoid bad setState
        let tempSequenceArray = []
        tempSequenceArray.push(splitArray[0], splitArray[1], splitArray[2])
        setComponentSequenceArray(tempSequenceArray)
    
        return(finalSequenceArray)
    }

    // Load and display extra spans to push certain sequences to stay in the select line
    function displayInvisSequence(lineIndex:number) {
        let elements = [...invisElements]
        for (let i = 0; i < lineIndex; i++) {
            elements.push(
                <span key={i} className="size-12 flex items-center justify-center text-xl"></span>
            )
        }
        return elements
    }

    // Updates the animation condition for each sequence row
    const updateAnimation = () => {
        // Set sequence animation boolean
        let tempRowAnimate = [...rowAnimate]

        // Check and update current row status for all rows to avoid re-render issues
        for (let i = 0; i < rowStatus.length; i++) {
            if (rowStatus[i] === "completed" || rowStatus[i] === "failed") {
                if (tempRowAnimate[i] === true) {
                    tempRowAnimate[i] = false
                }
            }
        }
        setRowAnimate(tempRowAnimate)

        // Reset input cover to false
        props.setInputCover(false)
    }

    // Sequence cover animations
    const sequenceCoverAnimations = (rowIndex: number) => {
        const variants = {
            initial: { height: 0 },
            final: { height: '100%' },
        }

        return (
            <div>
                {rowStatus[rowIndex] === "completed" || rowStatus[rowIndex] === "failed" ? (
                    <motion.div
                        variants={variants}
                        initial={rowAnimate[rowIndex] ? "initial" : "final" }
                        animate={rowAnimate[rowIndex] ? "final" : {}}
                        transition={{ duration: 0.2 }}
                        onAnimationStart={() => props.setInputCover(true)}
                        onAnimationComplete={() => updateAnimation()}
                        className={`w-full h-full absolute flex items-center pl-4 ${rowStatus[rowIndex] === "completed" ? "bg-cyber-success" : "bg-cyber-red"} text-black text-opacity-60 z-100 top-0 left-0`}>
                        {rowStatus[rowIndex] === "completed" ? <span>INSTALLED</span> : <span>FAILED</span>}
                    </motion.div>
                ) : <></>}
            </div>
        )
    }

    // Flavour text animations (second half of the sequences)
    const flavourTextAnimations = (rowIndex: number) => {
        const datamineText = [
            {type: "BASIC DATAMINE", flavourText: "Extract eurodollars"},
            {type: "ADVANCED DATAMINE", flavourText: "Extract eurodollars and quickhack crafting components"},
            {type: "EXPERT DATAMINE", flavourText: "Extract quickhacks and quickhack crafting specs"}
        ]

        const variants = {
            initial: { height: 0 },
            final: { height: '100%' },
        }

        return (
            <motion.ul key={rowIndex} initial={{ x: -2 }} className="relative">
                {rowStatus[rowIndex] === "completed" && (
                    <motion.div
                        variants={variants}
                        initial={rowAnimate[rowIndex] ? "initial" : "final"}
                        animate={rowAnimate[rowIndex] ? "final" : {}}
                        transition={{ duration: 0.2 }}
                        className={`absolute top-0 left-0 w-full bg-cyber-success text-black text-opacity-60`}>
                    </motion.div>
                )}

                {rowStatus[rowIndex] === "failed" && (
                    <motion.div
                    variants={variants}
                    initial={rowAnimate[rowIndex] ? "inital" : "final"}
                    animate={rowAnimate[rowIndex] ? "final" : {}}
                    transition={{ duration: 0.2 }}
                    className={`absolute top-0 left-0 w-full bg-cyber-red text-black text-opacity-60`}>
                </motion.div>
                )}

                <div
                    className={`text-base ${rowStatus[rowIndex] === "completed" || rowStatus[rowIndex] === "failed" ? "text-black text-opacity-60" : ""}`}>
                    <li className="showText">{datamineText[rowIndex].type}</li>
                    <li className={`scrollContainer ${rowStatus[rowIndex] === "completed" || rowStatus[rowIndex] === "failed" ? "" : "text-cyber-green"}`}>
                        <span className="scrollText">{datamineText[rowIndex].flavourText}</span>
                    </li>
                </div>
            </motion.ul>
        )
    }

    // Display the contents of the sequence section
    function DisplaySequences() {
        return (
            <table className="w-full mb-8" onMouseLeave={() => props.setCombinationHover("")}>
                <tbody className="select-none">
                    {/* Covers the screen while the animation is in progress, to avoid triggering re-renders and causing re-animate issues */}
                    {props.inputCover ? <tr className="top-0 left-0 z-50 absolute w-[100vw] h-[100vh]"></tr> : <tr></tr>}     
                    <tr className="text-xl">
                        <td className="w-2/3 pl-4 text-white">
                            {cachedFinalSequenceArray.map((row, rowIndex) => (
                                <div key={rowIndex + 10} className="flex flex-row relative">

                                    {sequenceCoverAnimations(rowIndex)}
                                    
                                    <span key={rowIndex + 100} className="flex flex-row">
                                        {displayInvisSequence(spaceIndex[rowIndex])}
                                    </span>

                                    <span key={rowIndex} className="flex flex-row">
                                        {row.map((val, colIndex) => (
                                            <span
                                                key={colIndex}
                                                className={`hover:text-cyber-blue hover:inner-sequence size-12 flex items-center justify-center
                                                ${val === props.matrixHover && colIndex === lineIndex[rowIndex] ? "inner-sequence text-cyber-blue" : ""}
                                                ${colIndex < lineIndex[rowIndex] && rowStatus[rowIndex] !== "failed" ? "inner-sequence-selected text-cyber-lightgreen hover:text-cyber-lightgreen hover:inner-sequence-selected" : ""}
                                                ${colIndex === lineIndex[rowIndex] ? "bg-cyber-purple" : ""}`}
                                                onMouseEnter={() => props.setCombinationHover(val)}
                                                onMouseLeave={() => props.setCombinationHover("")}>
                                                {val}
                                            </span>
                                        ))}
                                    </span>
                                </div>
                            ))}
                        </td>
                        <td className="text-lg pr-4">
                            {cachedFinalSequenceArray.map((_row, rowIndex) => (
                                flavourTextAnimations(rowIndex)
                            ))}
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }

    return (
        <div className='border-[1px] border-cyber-green'>
            <div className="border-[1px] border-cyber-green text-cyber-lightgreen p-2 text-xl mb-2">SEQUENCE REQUIRED TO UPLOAD</div>
            <DisplaySequences />
        </div>
    )
}