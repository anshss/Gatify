import styles from "@/styles/Home.module.scss";
import { useState } from "react";
import { fvmAddress, polygonAddress, gatifyAbi } from "@/config";
import { Web3Storage } from "web3.storage";
import web3modal from "web3modal";
import { ethers } from "ethers";

export default function Host() {
    const [selectedTab, setSelectedTab] = useState("renderHost");
    const [hostInput, setHostInput] = useState({
        logoLink: null,
        commName: "",
        entryContract: "",
        entryTokenId: "",
        entryTokenId: "",
        discordLink: "",
    });
    const [mintInput, setMintInput] = useState({
        image: null,
        name: "",
        supply: "",
        price: "",
    });
    const [imgBase64, setImgBase64] = useState(null);

    function getAccessToken() {
        // return process.env.NEXT_PUBLIC_IpfsToken
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkyMjkyQjQ5YzFjN2ExMzhERWQxQzQ3NGNlNmEyNmM1NURFNWQ0REQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjUyMzg2MDc1NDEsIm5hbWUiOiJNZXRhRmkifQ.cwyjEIx8vXtTnn8Y3vctroo_rooHV4ww_2xKY-MT0rs";
    }

    function makeStorageClient() {
        return new Web3Storage({ token: getAccessToken() });
    }

    const uploadToIPFS = async (files) => {
        const client = makeStorageClient();
        const cid = await client.put(files);
        return cid;
    };

    async function changeImage(prop) {
        const reader = new FileReader();
        if (prop) reader.readAsDataURL(prop);

        reader.onload = (readerEvent) => {
            const file = readerEvent.target.result;
            setImgBase64(file);
        };
        const inputFile = prop;
        const inputFileName = prop.name;
        const files = [new File([inputFile], inputFileName)];
        const metaCID = await uploadToIPFS(files);
        const url = `https://ipfs.io/ipfs/${metaCID}/${inputFileName}`;
        console.log(url);
        return url;
    }

    async function hostImage(e) {
        const file = e.target.files[0];
        const url = await changeImage(file);
        setHostInput({ ...hostInput, logoLink: url });
    }

    async function mintImage(e) {
        const file = e.target.files[0];
        const url = await changeImage(file);
        setMintInput({ ...mintInput, image: url });
    }

    const nftMetadata = async () => {
        const { image, name, supply, price } = mintInput;
        if (!image || !name || !supply || !price) return;
        const data = JSON.stringify({ image, name });
        const files = [new File([data], "data.json")];
        try {
            const metaCID = await uploadToIPFS(files);
            const metaUrl = `https://ipfs.io/ipfs/${metaCID}/data.json`;
            console.log(metaUrl);
            return metaUrl;
        } catch (error) {
            console.log("Error uploading:", error);
        }
    };

    async function getFvmContract() {
        const modal = new web3modal({
            network: "mumbai",
            cacheProvider: true,
        });
        const connection = await modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(fvmAddress, gatifyAbi, signer);
        return contract;
    }

    async function hostComm() {
        const contract = await getFvmContract();
        const host = await contract.host(
            hostInput.logoLink,
            hostInput.commName,
            hostInput.entryContract,
            hostInput.entryTokenId,
            hostInput.discordLink,
            {
                gasLimit: 1000000,
            }
        );
        await host.wait();
        console.log(host);
    }

    async function mintNft() {
        const contract = await getFvmContract();
        const url = await nftMetadata();
        const price = ethers.utils.parseEther(mintInput.price);
        const supply = mintInput.supply;
        const mint = await contract.mintNft(url, supply, price, {
            gasLimit: 1000000,
        });
        await mint.wait();
        console.log(mint);
    }

    function debugMint() {
        console.log('debug', mintInput)
    }

    function debugHost() {
        console.log('debug', hostInput)
    }

    function renderHost() {
        return (
            <div className={styles.hostForm}>
                <button onClick={debugHost}>click</button>
                <img src={imgBase64 || "./download.gif"} alt="" width="100px" />
                <input name="logo" type="file" required onChange={hostImage} />
                <input
                    name="commName"
                    type="text"
                    placeholder="Event Name"
                    required
                    onChange={(e) =>
                        setHostInput({
                            ...hostInput,
                            commName: e.target.value,
                        })
                    }
                />
                <input
                    name="entryContract"
                    type="text"
                    placeholder="Contract Address"
                    required
                    onChange={(e) =>
                        setHostInput({
                            ...hostInput,
                            entryContract: e.target.value,
                        })
                    }
                />
                <input
                    name="entryTokenId"
                    type="number"
                    placeholder="Token Id"
                    required
                    onChange={(e) =>
                        setHostInput({
                            ...hostInput,
                            entryTokenId: e.target.value,
                        })
                    }
                />
                <input
                    name="discordLink"
                    type="text"
                    placeholder="Discord Server Link"
                    required
                    onChange={(e) =>
                        setHostInput({
                            ...hostInput,
                            discordLink: e.target.value,
                        })
                    }
                />
                <button onClick={hostComm}>Host</button>
            </div>
        );
    }

    function renderMint() {
        return (
            <div className={styles.mintForm}>
                <button onClick={debugMint}>click</button>
                <p>{fvmAddress}</p>
                <img src={imgBase64 || "./download.gif"} alt="" width="100px" />
                <input
                    name="Image"
                    type="file"
                    placeholder="Image"
                    required
                    onChange={mintImage}
                />
                <input
                    name="Name"
                    type="text"
                    placeholder="Name"
                    required
                    onChange={(e) =>
                        setMintInput({
                            ...mintInput,
                            name: e.target.value,
                        })
                    }
                />
                <input
                    name="supply"
                    type="number"
                    placeholder="Supply"
                    required
                    onChange={(e) =>
                        setMintInput({
                            ...mintInput,
                            supply: e.target.value,
                        })
                    }
                />
                <input
                    name="price"
                    type="number"
                    placeholder="Price"
                    required
                    onChange={(e) =>
                        setMintInput({
                            ...mintInput,
                            price: e.target.value,
                        })
                    }
                />
                <button onClick={mintNft}>Mint</button>
            </div>
        );
    }

    return (
        <div className={styles.host}>
            <div className={styles.tab}>
                <button onClick={() => setSelectedTab("renderHost")}>
                    Host
                </button>
                <button onClick={() => setSelectedTab("renderMint")}>
                    Mint
                </button>
            </div>
            <div>
                {selectedTab == "renderHost" ? renderHost() : renderMint()}
            </div>
        </div>
    );
}
