import { createContext, useMemo } from "react";

export const SeaBattleContext = createContext()

const SeaBattle = props => {
	const { cellSize, children } = props
	const value = useMemo(() => ({ cellSize }), [cellSize])

	return (
		<SeaBattleContext.Provider value={value}>
			{children}
		</SeaBattleContext.Provider>
	)
}

export default SeaBattle

