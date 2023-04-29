import styles from "@/styles/Home.module.scss";
import { useEffect, useState } from "react";
import { fvmAddress, polygonAddress, gatifyAbi } from "@/config";
import web3modal from "web3modal";
import { ethers } from "ethers";

export default function Dashboard() {

    const [selectedTab, setSelectedTab] = useState("renderJoinedComm")
    // const [joinedComm, setJoinedComm] = useState([])
    // const [hostedComm, setHostedComm] = useState([])

    const [joinedComm, setJoinedComm] = useState([{
        id: "1",
        logoLink: "https://ipfs.io/ipfs/bafybeiadpzjd56aie2l6yqiyirwsxnjicoenkqinqpamrpsv3klx2rtk5y/download.png",
        name: "TestComm 1",
        host: "0x..",
        entryContract: "0x..",
        entryTokenId: "4",
    }, {
        id: "1",
        logoLink: "https://ipfs.io/ipfs/bafybeiadpzjd56aie2l6yqiyirwsxnjicoenkqinqpamrpsv3klx2rtk5y/download.png",
        name: "TestComm 2",
        host: "0x..",
        entryContract: "0x..",
        entryTokenId: "28",
    }]);

    const [hostedComm, setHostedComm] = useState([{
        id: "1",
        logoLink: "https://ipfs.io/ipfs/bafybeiadpzjd56aie2l6yqiyirwsxnjicoenkqinqpamrpsv3klx2rtk5y/download.png",
        name: "TestComm 1",
        host: "0x..",
        entryContract: "0x..",
        entryTokenId: "4",
    }, {
        id: "1",
        logoLink: "https://ipfs.io/ipfs/bafybeiadpzjd56aie2l6yqiyirwsxnjicoenkqinqpamrpsv3klx2rtk5y/download.png",
        name: "TestComm 2",
        host: "0x..",
        entryContract: "0x..",
        entryTokenId: "28",
    }]);


    useEffect(() => {
        // fetchHostedComm()
        // fetchJoinedComm()
    }, [])

    async function fetchHostedComm() {
        const modal = new web3modal({
            network: "mumbai",
            cacheProvider: true,
        });
        const connection = await modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            fvmAddress,
            gatifyAbi,
            signer
        );
        const data = await contract.fetchInventory();
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
        setHostedComm(items);
        setLoaded(true);
    }

    async function fetchJoinedComm() {
        const modal = new web3modal({
            network: "mumbai",
            cacheProvider: true,
        });
        const connection = await modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            fvmAddress,
            gatifyAbi,
            signer
        );
        const data = await contract.fetchInventory();
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
        setJoinedComm(items);
        setLoaded(true);
    }

    function CommCard(prop) {
        return (
        <div>
            <p>Comm Card</p>
            <p>{prop.id}</p>
            <img src={prop.logoLink} alt=""/>
            <p>{prop.name}</p>
            <p>{prop.host}</p>
            <p>{prop.entryContract}</p>
            <p>{prop.entryTokenId}</p>
        </div>
        ) 
    }

    function renderJoinedComm() {
        return (
            <div className={styles.joinedComm}>
                <p>Joined Communities</p>
                <div>
                {joinedComm.map((item, i) => (
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

    function renderHostedComm() {
        return (
            <div className={styles.hostedComm}>
                <p>Hosted Communities</p>
                <div>
                {hostedComm.map((item, i) => (
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
