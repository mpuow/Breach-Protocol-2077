import difficultypic from '../assets/howtoplay/difficultypic.png'
import rowpic from '../assets/howtoplay/rowpic.png'
import colpic from '../assets/howtoplay/colpic.png'
import sequencepic from '../assets/howtoplay/sequencepic.png'
import timerpic from '../assets/howtoplay/timerpic.png'
import bufferpic from '../assets/howtoplay/bufferpic.png'
import solvepic from '../assets/howtoplay/solvepic.png'
import { AnimatePresence, motion } from "framer-motion"

interface Props {
    infoClicked: boolean
    setInfoClicked: React.Dispatch<React.SetStateAction<boolean>>
}

const show = {
	opacity: 1,
	display: "block"
}

const hide = {
	opacity: 0,
	transitionEnd: {
		duration: "none"
	}
}

export default function HowToPlay(props: Props) {
  return (
	<AnimatePresence>
		{props.infoClicked && (
			<motion.div
				key={"howtoplay"}
				initial = {hide}
				animate={show}
				exit={hide}
				className={`select-none overflow-auto bg-gradient-to-b from-[#361319] from-10% via-[#07060D] via-70% to-black 
					${props.infoClicked ? "modalNoBlur opacity-100 w-[70vw] h-[90vh] z-50 border-2 border-cyber-red-light" : "overflow-hidden w-0 h-0 opacity-0"}`}>
				<div className="flex flex-col text-cyber-blue p-4 items-center space-y-4">
					<span>1. Select a difficulty</span>
					<img src={difficultypic} className='size-fit border-2 border-cyber-red-light'></img>

					<span>2. Select a combination within the highlighted row</span>
					<img src={rowpic} className='size-fit border-2 border-cyber-red-light'></img>

					<span>3. Select a new combination within the highlighted column</span>
					<img src={colpic} className='size-fit border-2 border-cyber-red-light'></img>

					<span>4. Match the selected combinations (in order) with the sequences on the right</span>
					<img src={sequencepic} className='size-fit border-2 border-cyber-red-light'></img>

					<span>5. Match as many combinations as possible, with the given timer and buffer</span>
					<img src={timerpic} className='size-fit'></img>
					<img src={bufferpic} className='size-fit'></img>

					<span>6. Use the solve button to see a possible solution to the puzzle</span>
					<img src={solvepic} className='size-fit'></img>
				</div>
				<div className='flex items-center justify-center my-10'>
					<motion.span 
						whileTap={{scale: 0.95}}
						className="border-[1px] border-transparent hover:border-cyber-blue hover:text-cyber-blue text-cyber-red-light font-semibold mb-4 p-1 px-2" 
						onClick={() => props.setInfoClicked(false)}>
							CLOSE
					</motion.span>
				</div>
			</motion.div>
		)}
	</AnimatePresence>
  )
}