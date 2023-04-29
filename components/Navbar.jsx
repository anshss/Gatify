import styles from "@/styles/Home.module.scss";
import Link from "next/link";
import Login from "./Login";

export default function Navbar() {
    return (
        <div className={styles.navbar}>
            <Link href="/"><p>Home</p></Link>
            <Link href="/active"><p>Communities</p></Link>
            <Link href="/host"><p>Host</p></Link>
            <Link href="/dashboard"><p>Dashboard</p></Link>
            <Login />
        </div>
    );
}