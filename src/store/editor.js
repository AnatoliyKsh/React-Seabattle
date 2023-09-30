import { createSlice } from '@reduxjs/toolkit'
import { getDefaultShips, isNormalPosition, randomize } from '../additional'

const initialState = {
	ships: getDefaultShips(),
}

export const editorSlice = createSlice({
	name: 'editor',

	initialState,

	reducers: {
		setShips(state, action) {
			state.ships = action.payload
		},

		place(state, action) {
			const { id, x, y } = action.payload


			const placed = state.ships.filter(
				ship => ship.placed && ship.id !== id
			)

			const ship = state.ships.find(ship => ship.id === id)

			const normal = isNormalPosition([...placed, { ...ship, x, y }])
			if (normal) {
				Object.assign(ship, { x, y, placed: true })
			}
		},

		dock(state, action) {
			const id = action.payload

			const defaultShip = getDefaultShips().find(ship => ship.id === id)
			const ship = state.ships.find(ship => ship.id === id)

			if (ship && defaultShip) {
				Object.assign(ship, defaultShip)
			}
		},

		random(state) {
			state.ships = randomize()
			for (const ship of state.ships) {
				ship.placed = true
			}
		},

		reset(state) {
			state.ships = getDefaultShips()
		},

		rotate(state, action) {

			const { id, mouseX, mouseY, cellSize } = action.payload


			const ship = state.ships.find(ship => ship.id === id)

			if (!ship || ship.length === 1) {
				return
			}

			if (!ship.placed) {
				ship.direction = ship.direction === 'row' ? 'column' : 'row'
			} else {
				const shipElem = document.querySelector(
					`[class^=styles_ship]:nth-child(${ship.id + 1})`
				)

				const { left: shipCoordinatesLeft, top: shipCoordinatesTop } =
					shipElem.getBoundingClientRect()

				let newShipX = null
				let newShipY = null
				let cellByWhichToRotate = null

				if (ship.direction === 'row') {
					cellByWhichToRotate = Math.floor(
						(mouseX - shipCoordinatesLeft) / cellSize
					)
					if (cellByWhichToRotate === ship.length) {
						cellByWhichToRotate--
					}

					newShipX = ship.x + cellByWhichToRotate
					newShipY = ship.y - cellByWhichToRotate
				} else {
					cellByWhichToRotate = Math.floor(
						(mouseY - shipCoordinatesTop) / cellSize
					)
					if (cellByWhichToRotate === ship.length) {
						cellByWhichToRotate--
					}

					newShipX = ship.x - cellByWhichToRotate
					newShipY = ship.y + cellByWhichToRotate
				}


				const placed = state.ships.filter(
					ship => ship.placed && ship.id !== id
				)


				const normal = isNormalPosition([
					...placed,
					{
						...ship,
						direction: ship.direction === 'row' ? 'column' : 'row',
						x: newShipX,
						y: newShipY,
					},
				])

				if (normal) {
					ship.direction = ship.direction === 'row' ? 'column' : 'row'
					ship.x = newShipX
					ship.y = newShipY
				}
			}
		},
	},
})

export const { place, dock, random, reset, rotate, setShips } =
	editorSlice.actions

export default editorSlice.reducer
