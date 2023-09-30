import styles from './styles.module.css'
import { BattleField, BattleFieldTable, Ship } from '../components'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

const MainPage = () => {
	const ships = useSelector(state => state.main.ships)
	const dispatch = useDispatch()



	return (
		<div className={styles.container}>
			<div className={styles['main-content']}>
				<BattleField>
					<BattleFieldTable

						axisX={n => n + 1}
					/>

					{ships.map(ship => (
						<Ship key={ship.id} {...ship} />
					))}
				</BattleField>

				<div className={styles['main-actions']}>
					<Link to='/editor'>
						<button className={styles.action}>Редактировать</button>
					</Link>
					<Link to='/bot'>
						<button className={styles.action}>
							Играть с ботом
						</button>
					</Link>

				</div>

				<BattleField>
					<BattleFieldTable />
				</BattleField>
			</div>
		</div>
	)
}

export default MainPage
