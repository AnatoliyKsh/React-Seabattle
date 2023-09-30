// Вспомогательные функции.

export const isValidCoordinates = (x, y) => 0 <= x && x < 10 && 0 <= y && y < 10

export const getDefaultShips = () => [

	{ id: 1, x: 0, y: 0, length: 4, direction: 'row', placed: false },
	{ id: 2, x: 0, y: 2, length: 3, direction: 'row', placed: false },
	{ id: 3, x: 4, y: 2, length: 3, direction: 'row', placed: false },
	{ id: 4, x: 0, y: 4, length: 2, direction: 'row', placed: false },
	{ id: 5, x: 3, y: 4, length: 2, direction: 'row', placed: false },
	{ id: 6, x: 6, y: 4, length: 2, direction: 'row', placed: false },
	{ id: 7, x: 0, y: 6, length: 1, direction: 'row', placed: false },
	{ id: 8, x: 2, y: 6, length: 1, direction: 'row', placed: false },
	{ id: 9, x: 4, y: 6, length: 1, direction: 'row', placed: false },
	{ id: 10, x: 6, y: 6, length: 1, direction: 'row', placed: false },
]


export const isNormalPosition = ships => {

	const matrix = Array(10)
		.fill()
		.map(() => Array(10).fill(0))

	for (const ship of ships) {
		const { direction, length } = ship

		const dx = direction === 'row'
		const dy = direction === 'column'

		for (let i = 0; i < length; i++) {
			const x = ship.x + i * dx
			const y = ship.y + i * dy

			if (!isValidCoordinates(x, y) || matrix[y][x]) {
				return false
			}
		}

		if (direction === 'row') {
			for (let y = ship.y - 1; y <= ship.y + 1; y++) {
				for (let x = ship.x - 1; x <= ship.x + length; x++) {
					if (isValidCoordinates(x, y)) {
						matrix[y][x] = 1
					}
				}
			}
		} else {
			for (let y = ship.y - 1; y <= ship.y + length; y++) {
				for (let x = ship.x - 1; x <= ship.x + 1; x++) {
					if (isValidCoordinates(x, y)) {
						matrix[y][x] = 1
					}
				}
			}
		}
	}

	return true
}

export const randomize = () => {
	const ships = getDefaultShips()

	for (let i = 0; i < 100000; i++) {
		for (const ship of ships) {
			ship.x = Math.floor(Math.random() * 10)
			ship.y = Math.floor(Math.random() * 10)
			ship.direction = ['row', 'column'][Math.floor(Math.random() * 2)]
		}

		if (isNormalPosition(ships)) {
			return ships
		}
	}

	return getDefaultShips()
}


export const shoot = (ships, shots, x, y) => {
	if (shots.find(shot => shot.x === x && shot.y === y)) {
		return false
	}

	const shot = {
		id: 1 + Math.max(0, ...shots.map(shot => shot.id)),
		x,
		y,
		status: 'missed',
	}

	shots.push(shot)

	let hittedShip = null

	mainLoop: for (const ship of ships) {
		const dx = ship.direction === 'row'
		const dy = ship.direction === 'column'

		for (let i = 0; i < ship.length; i++) {
			const x = ship.x + dx * i
			const y = ship.y + dy * i

			if (shot.x === x && shot.y === y) {
				shot.status = 'hitted'
				hittedShip = ship
				break mainLoop
			}
		}
	}

	if (shot.status === 'hitted') {
		const hittedShots = []

		const dx = hittedShip.direction === 'row'
		const dy = hittedShip.direction === 'column'

		for (let i = 0; i < hittedShip.length; i++) {
			const x = hittedShip.x + dx * i
			const y = hittedShip.y + dy * i
			const shot = shots.find(shot => shot.x === x && shot.y === y)

			if (shot) {
				hittedShots.push(shot)
			}
		}

		if (hittedShots.length === hittedShip.length) {
			hittedShip.killed = true
		}
	}

	return shot
}

export const getFreeCell = (ships, shots) => {

	const matrix = Array(10)
		.fill()
		.map(() => Array(10).fill(0))

	for (const { x, y } of shots) {
		matrix[y][x] = 1
	}

	for (const ship of ships) {
		if (!ship.killed) {
			continue
		}

		const { direction, length } = ship

		if (direction === 'row') {
			for (let y = ship.y - 1; y <= ship.y + 1; y++) {
				for (let x = ship.x - 1; x <= ship.x + length; x++) {
					if (isValidCoordinates(x, y)) {
						matrix[y][x] = 1
					}
				}
			}
		} else {
			for (let y = ship.y - 1; y <= ship.y + length; y++) {
				for (let x = ship.x - 1; x <= ship.x + 1; x++) {
					if (isValidCoordinates(x, y)) {
						matrix[y][x] = 1
					}
				}
			}
		}
	}

	const freeCells = []
	for (let y = 0; y < 10; y++) {
		for (let x = 0; x < 10; x++) {
			if (matrix[y][x] === 0) {
				freeCells.push({ x, y })
			}
		}
	}

	return freeCells[Math.floor(Math.random() * freeCells.length)]
}

export const getShotedCell = (ships, shots) => {

	let numberOfKilledShipsOfEachSize = [
		[1, 0],
		[2, 0],
		[3, 0],
		[4, 0],
	]

	const markCornersEmpty = (ship, x, y) => {
		;[
			[ship.y - 1, ship.x - 1],
			[ship.y + 1, ship.x - 1],
			[ship.y - 1, ship.x + 1],
			[ship.y + 1, ship.x + 1],
		].forEach(([y, x]) => {
			if (isValidCoordinates(x, y)) {
				matrix[y][x] = 1
			}
		})
	}


	const matrix = Array(10)
		.fill()
		.map(() => Array(10).fill(0))

	for (const { x, y } of shots) {
		matrix[y][x] = 1
	}

	for (const ship of ships) {
		const { direction, length } = ship

		if (!ship.killed) {
			if (direction === 'row') {
				for (let y = ship.y - 1; y <= ship.y + 1; y++) {
					for (let x = ship.x - 1; x <= ship.x + length; x++) {
						if (shots.find(shot => shot.x === x && shot.y === y)) {
							markCornersEmpty(ship, x, y)
						}
					}
				}
			} else {
				for (let y = ship.y - 1; y <= ship.y + length; y++) {
					for (let x = ship.x - 1; x <= ship.x + 1; x++) {
						if (shots.find(shot => shot.x === x && shot.y === y)) {
							markCornersEmpty(ship, x, y)
						}
					}
				}
			}

			continue
		}

		numberOfKilledShipsOfEachSize[ship.length - 1][1]++

		if (direction === 'row') {
			for (let y = ship.y - 1; y <= ship.y + 1; y++) {
				for (let x = ship.x - 1; x <= ship.x + length; x++) {
					if (isValidCoordinates(x, y)) {
						matrix[y][x] = 1
					}
				}
			}
		} else {
			for (let y = ship.y - 1; y <= ship.y + length; y++) {
				for (let x = ship.x - 1; x <= ship.x + 1; x++) {
					if (isValidCoordinates(x, y)) {
						matrix[y][x] = 1
					}
				}
			}
		}
	}

	const totalKilledShips = numberOfKilledShipsOfEachSize.reduce(
		(acc, item) => acc + item[1],
		0
	)



	numberOfKilledShipsOfEachSize = numberOfKilledShipsOfEachSize.filter(
		item => item[0] !== 5 - item[1]
	)


	if (
		numberOfKilledShipsOfEachSize.length === 1 &&
		numberOfKilledShipsOfEachSize[0][0] !== 1
	) {

		const cellsWithWoundedDecks = []

		for (const ship of ships) {
			const { direction, length } = ship

			/* Если корабль НЕ убит: */
			if (!ship.killed) {
				if (direction === 'row') {
					for (let y = ship.y - 1; y <= ship.y + 1; y++) {
						for (let x = ship.x - 1; x <= ship.x + length; x++) {
							if (
								shots.find(shot => shot.x === x && shot.y === y)
							) {
								cellsWithWoundedDecks.push([x, y])
							}
						}
					}
				} else {
					for (let y = ship.y - 1; y <= ship.y + length; y++) {
						for (let x = ship.x - 1; x <= ship.x + 1; x++) {
							if (
								shots.find(shot => shot.x === x && shot.y === y)
							) {
								cellsWithWoundedDecks.push([x, y])
							}
						}
					}
				}
			}
		}

		if (
			(numberOfKilledShipsOfEachSize[0][0] === 2 &&
				(cellsWithWoundedDecks.length >= 3 ||
					(cellsWithWoundedDecks.length >= 2 &&
						totalKilledShips === 8) ||
					(cellsWithWoundedDecks.length === 1 &&
						totalKilledShips === 9))) ||
			(numberOfKilledShipsOfEachSize[0][0] === 3 &&
				(cellsWithWoundedDecks.length >= 3 ||
					(cellsWithWoundedDecks.length >= 1 &&
						totalKilledShips === 9))) ||
			(numberOfKilledShipsOfEachSize[0][0] === 4 &&
				cellsWithWoundedDecks.length >= 1)
		) {

			const mapOfAllowedCells = Array(10)
				.fill()
				.map(() => Array(10).fill(null))


			const allowableDistance = numberOfKilledShipsOfEachSize[0][0] - 1

			cellsWithWoundedDecks.forEach(([x, y]) => {
				for (
					let dy = y - allowableDistance;
					dy <= y + allowableDistance;
					dy++
				) {
					for (
						let dx = x - allowableDistance;
						dx <= x + allowableDistance;
						dx++
					) {
						if (
							isValidCoordinates(dx, dy) &&
							dx !== x &&
							dy !== y
						) {
							if (matrix[dy][dx] === 0) {
								mapOfAllowedCells[dy][dx] = 'psbl'
							} else {
								mapOfAllowedCells[dy][dx] = null
							}
						}
					}
				}
			})


			for (let y = 0; y < 10; y++) {
				for (let x = 0; x < 10; x++) {
					if (mapOfAllowedCells[y][x] !== 'psbl') {
						matrix[y][x] = 1
					}
				}
			}
		}
	}

	const freeCells = []
	for (let y = 0; y < 10; y++) {
		for (let x = 0; x < 10; x++) {
			if (matrix[y][x] === 0) {
				freeCells.push({ x, y })
			}
		}
	}

	if (freeCells.length === 0) {
		return 'no free cells'
	}

	return freeCells[Math.floor(Math.random() * freeCells.length)]
}
