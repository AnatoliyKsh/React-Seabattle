import styles from './styles.module.css'

const BattleField = props => {
	const { children, style = {} } = props

	return (
		<div className={styles.battlefield} style={style}>
			{children}
		</div>
	)
}

export default BattleField
