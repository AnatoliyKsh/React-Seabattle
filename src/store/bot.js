
import { createSlice } from '@reduxjs/toolkit'
import { getShotedCell, randomize, shoot as doShoot } from '../additional'

const initialState = {
	playerShips: [],
	playerShots: [],

	botShips: randomize().map(ship => ({ ...ship, placed: true })),
	botShots: [],

	playing: true,
	playerWin: true,
}

export const botSlice = createSlice({
	name: 'bot',

	initialState,

	reducers: {

		reset(state, action) {
			Object.assign(state, {
				...initialState,

				botShips: randomize().map(ship => ({ ...ship, placed: true })),

				playerShips: action.payload,
			})
		},

		shoot(state, action) {
			if (!state.playing) {
				return
			}

			const shot = doShoot(
				state.botShips,
				state.botShots,
				action.payload.x,
				action.payload.y
			)

			if (!shot) {
				return
			}

			if (shot.status === 'hitted') {
				const playerWin = state.botShips.every(ship => ship.killed)

				if (playerWin) {
					state.playing = false
					state.playerWin = true
				}

				return
			}

			let botTurn = true
			while (botTurn) {
				botTurn = false

				const freeCell = getShotedCell(
					state.playerShips,
					state.playerShots
				)

				if (freeCell !== 'no free cells') {
					const shot = doShoot(
						state.playerShips,
						state.playerShots,
						freeCell.x,
						freeCell.y
					)

					if (!shot) {
						throw Error('Бот не может сюда стрелять.')
					}

					if (shot.status === 'hitted') {
						botTurn = true

						const botWin = state.playerShips.every(
							ship => ship.killed
						)

						if (botWin) {
							state.playing = false
							state.playerWin = false
							return
						}
					}
				}
			}
		},
	},
})

export const { reset, shoot } = botSlice.actions

export default botSlice.reducer
