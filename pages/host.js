import styles from "@/styles/Home.module.scss";
import { useState } from "react";
import { fvmAddress, polygonAddress, gatifyAbi } from "@/config";

export default function Host() {
    const [selectedTab, setSelectedTab] = useState("renderHost");
    const [hostInput, setHostInput] = useState({
        logo: null,
        eventName: "",
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

    async function hostComm() {}

    async function mintNft() {}

    function renderHost() {
        return (
            <div className={styles.hostForm}>
                <input
                    name="Logo"
                    type="file"
                    required
                    onChange={(e) =>
                        setHostInput({
                            ...hostInput,
                            logo: e.target.value,
                        })
                    }
                />
                <input
                    name="eventName"
                    type="text"
                    placeholder="Event Name"
                    required
                    onChange={(e) =>
                        setHostInput({
                            ...hostInput,
                            eventName: e.target.value,
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
                <input
                    name="Image"
                    type="file"
                    placeholder="Image"
                    required
                    onChange={(e) =>
                        setMintInput({
                            ...mintInput,
                            image: e.target.value,
                        })
                    }
                />
                <input
                    name="Name"
                    type="file"
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
