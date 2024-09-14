import { useEffect, useMemo } from "react"
import { randomNumber } from "./CodeMatrix"

interface Props {
    solutionStringArray: string[]
    combinationHover: string
    setCombinationHover: React.Dispatch<React.SetStateAction<string>>
    matrixHover: string
    userSelect: string[]
    setUserSelect: React.Dispatch<React.SetStateAction<string[]>>
    currentSequenceIndex: number
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

    // useMemo prevents the sequence from being rewritten every render
    const cachedFinalSequenceArray = useMemo(() => splitSolutionStringArray(props.solutionStringArray), [props.solutionStringArray])

    /*
        Check answer algorithm works by:
            1. Converting the buffer array and sequence row array to strings
            2. Inverting the strings
            3. Checking if the buffer starts with a valid sequence

        This allows dead inputs into the buffer before the sequence for tactical play
        Eg: ['7A', 'E9', '1C']  -> C1,9E,A7
            ['E9', '1C']        -> C1,9E
            = True

    */
    function checkUserAnswer(cachedFinalSequenceArray:string[][], userSelect:string[]) {

        function bufferContainsSequence(sequence:string[], buffer:string[]) {
            // Turn arrays into strings
            const sequenceString = sequence.join()
            const bufferString = buffer.join()
        
            // Reverse the strings
            const reverseSequenceString = sequenceString.split('').reverse().join('')
            const reverseBufferString = bufferString.split('').reverse().join('')
    
            // Return true if the user has selected a valid sequence
            return reverseBufferString.startsWith(reverseSequenceString)
        }
    
        // Loop through and check each row
        for (let i = 0; i < cachedFinalSequenceArray.length; i++) {
            if (bufferContainsSequence(cachedFinalSequenceArray[i], userSelect) && userSelect.length > 1) {
                console.log("TRUE : " + i)
            }
        }
    
    }
    
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
        if (JSON.stringify(split1) === JSON.stringify(split2) && split1.length > 2 ) {
            splitSolutionStringArray(solutionStringArray)
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
                            <ul>
                                <li>DATAMINE_V1</li>
                                <li className="text-cyber-green text-base">Flavour text</li>
                            </ul>
                            <ul>
                                <li>DATAMINE_V2</li>
                                <li className="text-cyber-green text-base">Flavour text</li>
                            </ul>
                            <ul>
                                <li>DATAMINE_V3</li>
                                <li className="text-cyber-green text-base">Flavour text</li>
                            </ul>
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