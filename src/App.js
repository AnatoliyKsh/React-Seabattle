import { Routes, Route } from 'react-router-dom'
import { BotPage, EditorPage, MainPage, } from './pages'

const App = () => {
	return (
		<Routes>
			<Route path='/editor' component={EditorPage} />
			<Route path='/bot' component={BotPage} />
			<Route path='/' component={MainPage} />
		</Routes>

	)
}

export default App
