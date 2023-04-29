import styles from "@/styles/Home.module.scss";
import { useState } from "react";
import { fvmAddress, polygonAddress, gatifyAbi } from "@/config";

export default function Dashboard() {

    const [selectedTab, setSelectedTab] = useState("renderJoinedComm")

    function renderJoinedComm() {
        return (
            <div className={styles.joinedComm}>
                <p>Joined Communities</p>
            </div>
        );
    }

    function renderHostedComm() {
        return (
            <div className={styles.hostedComm}>
                <p>Hosted Communities</p>
            </div>
        );
    }

    return (
        <div className={styles.dashboard}>
            <div className={styles.tab}>
                <button onClick={() => setSelectedTab("renderJoinedComm")}>Joined Communities</button>
                <button onClick={() => setSelectedTab("renderHostedComm")}>Hosted Communities</button>
            </div>
            <div>
            {selectedTab == "renderJoinedComm" ? renderJoinedComm(): renderHostedComm()} 
            </div>
        </div>
    );
}
