import styles from "@/styles/Home.module.scss";
import { useState } from "react";

export default function Host() {

    const [selectedTab, setSelectedTab] = useState("renderForm")

    function renderForm() {
        return (
            <div className={styles.form}>
                <input type="text" />
                <input type="text" />
                <input type="number" />
            </div>
        );
    }

    function renderMint() {
        return (
            <div className={styles.form}>
                <input type="text" />
                <input type="number" />
            </div>
        );
    }

    return (
        <div className={styles.host}>
            <div className={styles.subNavbar}>
                <button onClick={() => setSelectedTab("renderForm")}>Host</button>
                <button onClick={() => setSelectedTab("renderMint")}>Mint</button>
            </div>
            <div>
                {selectedTab == "renderForm" ? renderForm(): renderMint()} 
            </div>
        </div>
    )
}
