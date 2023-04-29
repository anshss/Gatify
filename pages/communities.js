import styles from "@/styles/Home.module.scss";
import { useEffect, useState } from "react";
import { fvmAddress, polygonAddress, gatifyAbi } from "@/config";
import web3modal from "web3modal";
import { ethers } from "ethers";

export default function Active() {
    const [fvmComm, setFvmComm] = useState([]);
    
    const [loaded, setLoaded]= useState();
    
    // const [fvmComm, setFvmComm] = useState([{
    //     id: "1",
    //     logoLink: "https://ipfs.io/ipfs/bafybeiadpzjd56aie2l6yqiyirwsxnjicoenkqinqpamrpsv3klx2rtk5y/download.png",
    //     name: "TestComm 1",
    //     host: "0x..",
    //     entryContract: "0x..",
    //     entryTokenId: "4",
    // }, {
    //     id: "1",
    //     logoLink: "https://ipfs.io/ipfs/bafybeiadpzjd56aie2l6yqiyirwsxnjicoenkqinqpamrpsv3klx2rtk5y/download.png",
    //     name: "TestComm 2",
    //     host: "0x..",
    //     entryContract: "0x..",
    //     entryTokenId: "28",
    // }]);

    useEffect(() => {
        fetchFvm();
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
        const data = await contract.activeComms();
        const items = await Promise.all(
            data.map(async (i) => {
                let item = {
                    id: i.id.toNumber(),
                    logoLink: i.logoLink,
                    name: i.name,
                    host: i.creator,
                    entryContract: i.entryContract,
                    entryTokenId: i.entryTokenId.toNumber(),
                };
                return item;
            })
        );
        console.log(items)
        setFvmComm(items);
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
