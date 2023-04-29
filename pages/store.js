import styles from "@/styles/Home.module.scss";
import { useEffect, useState } from "react";
import { fvmAddress, polygonAddress, gatifyAbi } from "@/config";
import web3modal from "web3modal";
import { ethers } from "ethers";
import axios from "axios";

export default function Store() {

    const [nfts, setNfts] = useState([])
    // const [nfts, setNfts] = useState([{
    //     price: "1",
    //     name: "Twelve",
    //     tokenId: "9",
    //     supply: "15",
    //     cover: "https://eventifyv1.vercel.app/download.gif",
    // }, {
    //     price: "4",
    //     name: "Owl Boats",
    //     tokenId: "41",
    //     supply: "10",
    //     cover: "https://ipfs.io/ipfs/bafybeiadpzjd56aie2l6yqiyirwsxnjicoenkqinqpamrpsv3klx2rtk5y/download.png",
    // }])

    const [loaded, setLoaded]= useState();

    useEffect(() => {
        fetchFvmNfts()
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
        const data = await contract.fetchNfts();
        const items = await Promise.all(
            data.map(async (i) => {
                const tokenUri = await contract.uri(i.tokenId.toString());
                const meta = await axios.get(tokenUri);
                console.log(meta)
                let price = ethers.utils.formatEther(i.price);
                let item = {
                    price,
                    name: meta.data.name,
                    tokenId: i.tokenId.toNumber(),
                    supply: i.supply.toNumber(),
                    remaining: i.remaining.toNumber(),
                    image: meta.data.image,
                };
                return item;
            })
        );
        setNfts(items);
        setLoaded(true);
    }

    async function buy(item) {
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
        const price = ethers.utils.parseUnits(item.price.toString(), "ether");
        const transaction = await contract.buyNft(item.tokenId, {
            value: price,
            gasLimit: 1000000,
        });
        await transaction.wait();
        console.log(transaction)
        fetchFvmNfts();
    }

    function NftCard(prop) {
        return(
            <div>
                <p>Card</p>
                <img src={prop.image} alt="" width="200px"/>
                <p>{prop.price}</p>
                <p>{prop.name}</p>
                <p>{prop.tokenId}</p>
                <p>{prop.supply}</p>
                <p>{prop.remaining}</p>
                <button onClick={() => buy(prop)}>Buy</button>
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
                        image={item.image}
                        remaining={item.remaining}
                    />
                ))}
            </div>
        </div>
    )
}