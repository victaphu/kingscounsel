import React, {useRef} from "react";
import styles from './Main.module.scss'
import RadioButton from "../RadioButton/RadioButton";
import {resetGame, selectColor, selectIsGameStarted, setColor} from "@/app/redux/gameSlice";
import {useAppDispatch, useAppSelector} from "@/app/redux/hooks";
import {Colors} from "@/app/common/types";


const Main: React.FC = () => {
	const color = useAppSelector(selectColor);
	const isGameStarted = useAppSelector(selectIsGameStarted);
	const dispatch = useAppDispatch();

	const radioChanged = (id: string) => {
		dispatch(setColor(id as Colors));
	}

	const startNewGame = () => {
		dispatch(resetGame());
	}

	return <div className={styles.wrapper}>
		<div className={styles.logo}></div>
		<h2>Choose side</h2>
			<form>
				<RadioButton value="White" handleChange={radioChanged} name="radio" isChecked={color === 'white'}/>
				<RadioButton value="Black" handleChange={radioChanged} name="radio" isChecked={color === 'black'}/>
			</form>
		<a href="#" onClick={startNewGame} className={styles.button}>Start new game</a>
	</div>
}

export default Main;