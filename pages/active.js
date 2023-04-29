import styles from "@/styles/Home.module.scss";
import { useEffect, useState } from "react";
import { fvmAddress, polygonAddress, gatifyAbi } from "@/config";
import web3modal from "web3modal";
import { ethers } from "ethers";
import axios from "axios";

export default function Active() {
    const [fvmComm, setFvmComm] = useState([]);
    const [loaded, setLoaded]= useState();

    useEffect(() => {
        // fetchFvm();
    }, []);

    async function fetchFvm() {
        const modal = new web3modal({
            network: "mumbai",
            cacheProvider: true,
        });
        const connection = await modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(fvmAddress, gatifyAbi, signer);
        const data = await contract.activeComm();
        const items = await Promise.all(
            data.map(async (i) => {
                let item = {
                    id: i.id,
                    logoLink: i.logoLink,
                    name: i.name,
                    host: i.creator,
                    entryContract: i.entryContract,
                    entryTokenId: i.entryTokenId,
                };
                return item;
            })
        );
        setFvmComm(items);
        setLoaded(true);
    }

    function CommCard() {
        return <div>Comm Card</div>;
    }

    return (
        <div className={styles.active}>
            <p>Communities</p>
            <input
                name="searchBar"
                type="text"
                placeholder="Name a community"
            />
            <div>
                {fvmComm.map((item, i) => (
                    <CommCard
                        key={i}
                        id={item.id}
                        logoLink={item.logoLink}
                        name={item.name}
                        host={item.host}
                        tokenId={item.tokenId}
                        entryContract={item.entryContract}
                        entryTokenId={item.entryTokenId}
                    />
                ))}
            </div>
        </div>
    );
}
