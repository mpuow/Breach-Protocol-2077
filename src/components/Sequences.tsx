import { useEffect, useMemo, useState } from "react"

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


    // Used to reset sequences
    const handleReset = useMemo(() => {
        if (props.gameReset.current) {
            setRowStatus(["atstart", "atstart", "atstart"])
            setSequenceIndex([0,0,0])
            setSpaceIndex([0,0,0])
            setLineIndex([0,0,0])
            setInvisElements([<span key={-1}></span>])
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

        // Ensuring that sequences are different
        if (split1.length > 2) {
            // Shuffle around sequences
            [split1, split3] = [split3, split1];
            [split2, split3] = [split3, split2];
            
        }
    
        // Push results to finalSequenceArray
        finalSequenceArray.push(split1, split2, split3)
        
        // Steps to set variables for props, avoid bad setState
        let tempSequenceArray = []
        tempSequenceArray.push(split1, split2, split3)
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

    // Display the contents of the sequence section
    function DisplaySequences() {
        const datamineType = ["BASIC DATAMINE", "ADVANCED DATAMINE", "EXPERT DATAMINE"]
        const datamineFlavourText = ["Extract eurodollars", "Extract eurodollars and quickhack crafting components", "Extract quickhacks and quickhack crafting specs"]

        return (
            <table className="w-full mb-8" onMouseLeave={() => props.setCombinationHover("")}>
                <tbody className="select-none">
                    <tr className="text-xl">
                        <td className="w-2/3 pl-4 text-white">
                            {cachedFinalSequenceArray.map((row, rowIndex) => (
                                <div key={rowIndex + 10} className="flex flex-row relative">
                                    <div className={`w-full absolute flex items-center pl-4 
                                    ${rowStatus[rowIndex] === "completed" ? "bg-cyber-success text-black text-opacity-60 z-100 top-0 left-0 h-full" 
                                    : rowStatus[rowIndex] === "failed" ? "bg-cyber-red text-black text-opacity-60 z-100 top-0 left-0 h-full" 
                                    : ""}`}>
                                        { rowStatus[rowIndex] === "completed" ? "INSTALLED" : rowStatus[rowIndex] === "failed" ? "FAILED" : ""}
                                    </div>
                                    
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
                                <ul key={rowIndex} className={`text-base 
                                ${rowStatus[rowIndex] === "completed" ? "bg-cyber-success text-black text-opacity-60" 
                                : rowStatus[rowIndex] === "failed" ? "bg-cyber-red text-black text-opacity-60"
                                : ""}`}>
                                    <li>{datamineType[rowIndex]}</li>
                                    <li className={`text-base ${rowStatus[rowIndex] === "completed" ? "" : rowStatus[rowIndex] === "failed" ? "" : "text-cyber-green"}`}>
                                        <span className="line-clamp-1">{datamineFlavourText[rowIndex]}</span>
                                    </li>
                                </ul>
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