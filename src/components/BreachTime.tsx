import { useEffect, useState } from "react"

interface Props {
    initialTime: number
    gameStart: React.MutableRefObject<boolean>
    setGameStatus: React.Dispatch<React.SetStateAction<string>>
    gameReset: React.MutableRefObject<boolean>
    gameStatus: string
}

export default function BreachTime(props: Props) {
    const [timeLeft, setTimeLeft] = useState(props.initialTime)
    const [barPercent, setBarPercent] = useState(100)

    useEffect(() => {
        // If game started
        if (props.gameStart.current) {
            // End game when time runs out
            if (timeLeft <= 0) {
                props.gameStart.current = false
                props.setGameStatus("lose")
                return
            }
    
            // Update the timer and bar
            const timer = setInterval(() => {
                setTimeLeft(prevTime => {
                    const timeUpdate = Math.max(prevTime - 10, 0)
                    setBarPercent((timeUpdate / props.initialTime) * 100)
                    return timeUpdate
                })
            }, 10)
            
            return () => clearInterval(timer)
        } else if (props.gameReset.current) {
            setTimeLeft(props.initialTime)
            setBarPercent(100)
            props.gameReset.current = false
        } else if (props.gameStatus === ""){
            setTimeLeft(props.initialTime)
        }
    }, [timeLeft, props.gameStart.current, props.gameReset.current, props.initialTime])

    function formatTime (timeLeft: number) {
        const seconds = Math.floor(timeLeft / 1000) % 60;
        const milliseconds = Math.floor((timeLeft % 1000) / 10)

        return `${seconds}.${milliseconds.toString().padStart(2, '0')}`
    }

    function timerBar() {
        return (
            <div className="bg-cyber-green h-2" style={{ width: `${barPercent}%` }}></div>
        )
    }

    return (
        <>
            <div className="flex flex-row justify-between mb-2 h-full">
                <div className="text-2xl text-cyber-green line-clamp-1">BREACH TIME REMAINING</div>
                <div className="border-2 border-cyber-green w-1/4 h-11 text-cyber-green text-2xl select-none">
                    <span className="flex justify-center items-center h-full overflow-hidden">{formatTime(timeLeft)}</span>
                </div>
            </div>
            {/* <div className="bg-cyber-green h-2 mt-2"></div> */}
            <div className="border-[1px] border-cyber-green h-2 mt-2 overflow-hidden">
                {timerBar()}
            </div>
        </>
    )
}