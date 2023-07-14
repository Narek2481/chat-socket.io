import React, { useState } from 'react';
import styles from "../styles/Main.module.css"
import { Link } from 'react-router-dom';


const Main = () => {
    const [name, setName] = useState("")
    const [room, setRoom] = useState("")

    const hendelChange = e => {
        if (e.target.name === "name") {
            setName(e.target.value);
        } else {
            setRoom(e.target.value)
        }
    }
    const hendelClick = e => {
        const isDisabled = Object.values({name,room}).some((value) => !value)
        if(isDisabled){
            e.preventDefault()
        }
    }
    return (
        <div className={styles.wrap}>
            <div className={styles.container}>
                <h1 className={styles.heading}>Join</h1>
                <form className={styles.form}>
                    <div className={styles.group}>
                        <input
                            type="text"
                            name='name'
                            value={name}
                            placeholder='name'
                            className={styles.input}
                            autoComplete='off'
                            onChange={hendelChange}
                            required
                        />

                    </div>
                    <div className={styles.group}>
                        <input
                            type="text"
                            name='room'
                            value={room}
                            placeholder='Room'
                            className={styles.input}
                            autoComplete='off'
                            onChange={hendelChange}
                            required
                        />

                    </div>
                    <Link
                        onClick={hendelClick}
                        className={styles.group}
                        to={`/chat?name=${name}&room=${room}`}>
                        <button type="submit" className={styles.button}>
                            Sign In
                        </button>
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default Main;