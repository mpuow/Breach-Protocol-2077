import { useEffect, useMemo, useState } from "react"
import { randomNumber } from "./CodeMatrix"

interface Props {
    solutionStringArray: string[]
    combinationHover: string
    setCombinationHover: React.Dispatch<React.SetStateAction<string>>
    matrixHover: string
    userSelect: string[]
    setUserSelect: React.Dispatch<React.SetStateAction<string[]>>
    currentSequenceIndex: number
    bufferSize: number
}

// Fisher-Yates Shuffle
function shuffleArray(array:number[]) {
    let currentIndex = array.length

    while (currentIndex != 0) {
        let randomIndex = randomNumber(currentIndex)
        currentIndex--

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }
}

export default function Sequences(props: Props) {

    // useMemo prevents the sequence array from being rewritten every render
    const cachedFinalSequenceArray = useMemo(() => splitSolutionStringArray(props.solutionStringArray), [props.solutionStringArray])

    // Valid status: atstart, inprogress, completed, failed
    const [rowStatus, setRowStatus] = useState(["atstart", "atstart", "atstart"])
    const [sequenceIndex, setSequenceIndex] = useState([0,0,0])

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

        // Declare tempStatus outside of the loop to avoid rewriting on subsequent loops
        let tempStatus = [...rowStatus]
        let tempSequenceIndex = [... sequenceIndex]

        // Loop through and check each row
        for (let i = 0; i < sequences.length; i++) {

            // Skip unnecessary loop iterations
            if (tempStatus[i] === "completed" || tempStatus[i] === "failed") {
                // Check if all rows are complete using local array to avoid render delay issues
                checkGameWin(tempStatus)
                continue
            }

            // Check if inprogress or to set inprogress
            if (tempStatus[i] === "inprogress") {
                // Increase row index to check if row is still inprogress
                tempSequenceIndex[i] = tempSequenceIndex[i] + 1

                // If the last user entry is not equal to the next combination in the sequence
                if (userSelect[userSelect.length - 1] !== sequences[i][tempSequenceIndex[i]]) {
                    // Check if there is space left in the buffer
                    if (props.bufferSize - userSelect.length <= sequences[i].length - 1) {
                        // Set row failed
                        tempStatus[i] = "failed"
                    } else {
                        // Reset row and row index
                        tempStatus[i] = "atstart"
                        tempSequenceIndex[i] = 0
                    }
                }
            } else {
                // Check if last entry into buffer is start of a sequence
                if (bufferContainsSequence(sequences[i], userSelect, userSelect.length - 1) && userSelect.length > 0) {
                    // Set to inprogress
                    tempStatus[i] = "inprogress"
                }
            }

            // Check if buffer contains complete sequence in order
            if (bufferContainsSequence(sequences[i], userSelect, -1) && userSelect.length > 1) {

                // Set with the row that has been completed
                if (tempStatus[i] === "inprogress") {
                    tempStatus[i] = "completed"
                }

                // Check immediately in case of finishing a sequence with the last user select
                checkGameWin(tempStatus)
            }

            // Set row to failed if not inprogress and not enough buffer
            if (props.bufferSize - userSelect.length < sequences[i].length && tempStatus[i] !== "inprogress") {
                tempStatus[i] = "failed"
            }

        }
        // Set the state outside the loop to avoid re-render issues
        setRowStatus(tempStatus)
        setSequenceIndex(tempSequenceIndex)
    }

    // Check if player has solved the puzzle and to what degree
    function checkGameWin(rowStatus:string[]) {
        // // Check if all sequences have been completed
        // if(JSON.stringify(rowStatus) === `["completed","completed","completed"]`) {
        //     alert("ALL sequences have been completed!")
        // }
        // // Check if any sequences have been completed
        // if(!JSON.stringify(rowStatus).includes("inprogress") && !JSON.stringify(rowStatus).includes("atstart")) {
        //     alert("You have completed some sequences.")
        // }
        // // Check if all sequences have failed
        // if(JSON.stringify(rowStatus) === `["failed","failed","failed"]`) {
        //     alert("All sequences have failed!")
        // }
        console.log("check game win" + rowStatus)
    }
    
    // Check answers after every user select
    useEffect(() => {
        checkUserAnswer(cachedFinalSequenceArray, props.userSelect)

    }, [props.userSelect])

    // Splits the solution string into 3 parts
    function splitSolutionStringArray(solutionStringArray:string[]) {
        
        // Valid index locations to split the solution string
        let posibleIndexVariations = [2, 2, 3]
        shuffleArray(posibleIndexVariations)
        let finalSequenceArray = []
    
        // Create local copy of solutionStringArray to avoid mutating it directly
        let split3 = solutionStringArray.slice(0)
        let split1 = (split3.splice(0, posibleIndexVariations[0]))
        let split2 = (split3.splice(0, posibleIndexVariations[1]))
    
        // Recursion to prevent 3 of the same combination. Eg: ['FF', 'FF', 'FF']
        if (split1.length > 2) {
            if (split1[0] === split1[1] && split1[1] === split1[2]) {
                splitSolutionStringArray(split3)
            }
            [split1, split3] = [split3, split1]
        } else if (split2.length > 2) {
            if (split2[0] === split2[1] && split2[1] === split2[2]) {
                splitSolutionStringArray(split3)
            }
            [split2, split3] = [split3, split2]
        } else if (split3.length > 2) {
            if (split3[0] === split3[1] && split3[1] === split3[2]) {
                splitSolutionStringArray(split3)
            }
        }
        
        // Recursion to prevent 2 identical combinations. Eg: ['FF', 'FF'] and ['FF', 'FF']
        if (split1.length > 2) {
            split1.map((val, index) => {
                if (val !== split2[index]) {
                    splitSolutionStringArray(solutionStringArray)
                }
            })
        }
    
        // Push results to finalSequenceArray
        finalSequenceArray.push(split1, split2, split3)
    
        return(finalSequenceArray)
    }

    // Display the contents of the sequence section
    function DisplaySequences() {
        return (
            <table className="w-full mb-8" onMouseLeave={() => props.setCombinationHover("")}>
                <tbody className="select-none">
                    <tr className={`text-xl`}>{/* ${JSON.stringify(props.userSelect).includes("FF")  ? "bg-white" : ""} */}
                        <td className="w-1/2 pl-4 text-white">
                            {cachedFinalSequenceArray.map((row, rowIndex) => (
                                <span key={rowIndex} className="flex flex-row mb-2 space-x-2">
                                    {row.map((val, colIndex) => (
                                        <span
                                            key={colIndex}
                                            className={`hover:text-cyber-blue hover:inner-border-2 inner-border-cyber-blue p-2 w-10 h-auto flex items-center justify-center 
                                            ${val === props.matrixHover && colIndex === props.currentSequenceIndex ? "inner-border-2 inner-border-cyber-blue text-cyber-blue" : ""}
                                            ${val === props.userSelect[colIndex] ? "inner-border-2 inner-border-cyber-lightgreen text-cyber-lightgreen hover:text-cyber-lightgreen" : ""}
                                            ${colIndex === props.currentSequenceIndex ? "bg-cyber-purple" : ""}`}
                                            onMouseEnter={() => props.setCombinationHover(val)}
                                            onMouseLeave={() => props.setCombinationHover("")}>
                                            {val}
                                        </span>
                                    ))}
                                </span>
                            ))}
                        </td>
                        <td className="text-lg">
                            {cachedFinalSequenceArray.map((_row, rowIndex) => (
                                <ul key={rowIndex} className={`text-base 
                                ${rowStatus[rowIndex] === "completed" ? "bg-cyber-success text-black text-opacity-60" 
                                : rowStatus[rowIndex] === "failed" ? "bg-cyber-red text-black text-opacity-60" 
                                : rowStatus[rowIndex] === "inprogress" ? "bg-cyber-yellow text-black text-opacity-60" 
                                : ""}`}>
                                    <li>DATAMINE_V{rowIndex + 1}</li>
                                    <li className={`text-base ${rowStatus[rowIndex] === "completed" ? "" : rowStatus[rowIndex] === "failed" ? "" : rowStatus[rowIndex] === "inprogress" ? "" : "text-cyber-green"}`}>Flavour text</li>
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