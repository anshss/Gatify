import styles from "@/styles/Home.module.scss";
import { ConnectKitButton } from 'connectkit';

export default function Login() {
    return (
        <div className={styles.login}>
            {/* <p>login</p> */}
            <ConnectKitButton />
        </div>
    )
}