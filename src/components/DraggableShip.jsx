import { useDrag } from 'react-dnd'
import Ship from './Ship'

const DraggableShip = props => {
	const { id, x, y, length, direction, killed, onClick } = props

	const [collected, drag] = useDrag(() => ({
		type: 'SHIP',
		item: { id },

		collect: monitor => ({
			isDragging: monitor.isDragging(),
		}),
	}))

	if (collected.isDragging) {

		return null
	}

	return (
		<Ship
			ref={drag}
			onClick={onClick}
			killed={killed}
			x={x}
			y={y}
			length={length}
			direction={direction}
		/>
	)
}

export default DraggableShip




