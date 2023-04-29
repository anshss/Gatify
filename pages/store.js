import styles from "@/styles/Home.module.scss";
import { useEffect, useState } from "react";
import { fvmAddress, polygonAddress, gatifyAbi } from "@/config";
import web3modal from "web3modal";
import { ethers } from "ethers";
import axios from "axios";

export default function Store() {

    const [nfts, setNfts] = useState([])

    useEffect(() => {
        // fetchFvmNfts()
    }, [])

    async function fetchFvmNfts() {
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
                const tokenUri = await contract.uri(i.tokenId.toString());
                const meta = await axios.get(tokenUri);
                let price = ethers.utils.formatEther(i.price);
                let item = {
                    price,
                    name: meta.data.name,
                    tokenId: i.tokenId.toNumber(),
                    supply: i.supply.toNumber(),
                    cover: meta.data.cover,
                };
                return item;
            })
        );
        setNfts(items);
        setLoaded(true);
    }

    function NftCard() {
        return(
            <div>
                <p>Card</p>
            </div>
        )
    }

    return (
        <div className={styles.store}>
            <p>Store</p>
            <div>
                {nfts.map((item, i) => (
                    <NftCard
                        key={i}
                        price={item.price}
                        name={item.name}
                        tokenId={item.tokenId}
                        supply={item.supply}
                        cover={item.cover}
                    />
                ))}
            </div>
        </div>
    )
}