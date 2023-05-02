import styles from "@/styles/Home.module.scss";
import { useState } from "react";
import { fvmAddress, polygonAddress, gatifyAbi } from "@/config";
import { Web3Storage } from "web3.storage";
import web3modal from "web3modal";
import { ethers } from "ethers";
import Lottie from "react-lottie";
import animationData from "../assets/lottie/animation-1.json";
import { Tab } from "@headlessui/react";

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
    // Start loader
    const metaCID = await uploadToIPFS(files);
    const url = `https://ipfs.io/ipfs/${metaCID}/${inputFileName}`;
    // End loader
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
    console.log("debug", mintInput);
  }

  function debugHost() {
    console.log("debug", hostInput);
  }

  function RenderHost() {
    return (
      <div className="">
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

  function RenderMint({}) {
    return (
      <div className=" px-10 py-10">
        <div>
          <div>
            <h1 className="mb-6 block text-md font-semibold">
               Deployer Contract Address: {fvmAddress}
            </h1>
            <form noValidate="" className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="ml-2 mb-2 block text-sm font-semibold"
                >
                  Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    onChange={(e) =>
                      setMintInput({
                        ...mintInput,
                        name: e.target.value,
                      })
                    }
                    className="border-gel-background border px-6 py-3 form-input"
                    name="name"
                  />
                </div>
              </div>
              <div className="flex w-full gap-6">
                <div className="flex-1">
                  <label
                    htmlFor="email"
                    className="ml-2 mb-2 block text-sm font-semibold"
                  >
                    Price
                  </label>
                  <div className="relative">
                    <input
                      id="price"
                      type="number"
                      className="input-error border-gel-accent border px-6 py-3 form-input"
                      name="price"
                      onChange={(e) =>
                        setMintInput({
                          ...mintInput,
                          price: e.target.value,
                        })
                      }
                    />
                  </div>
                  {/* <div className="p-2 text-sm text-gel-accent first-letter:capitalize">
                    This field is required
                  </div> */}
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="email"
                    className="ml-2 mb-2 block text-sm font-semibold"
                  >
                    Supply
                  </label>
                  <div className="relative">
                    <input
                      id="supply"
                      type="number"
                      className="input-error border-gel-accent border px-6 py-3 form-input"
                      name="supply"
                      onChange={(e) =>
                        setMintInput({
                          ...mintInput,
                          supply: e.target.value,
                        })
                      }
                    />
                  </div>
                  {/* <div className="p-2 text-sm text-gel-accent first-letter:capitalize">
                    This field is required
                  </div> */}
                </div>
              </div>

              <div>
                <p  className="ml-2 mb-2 block text-sm font-semibold">Choose File</p>
                <div className="flex ">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full capa h-64 border-2 border-dashed rounded-lg cursor-pointer bg-[#191919] hover:bg-gray-800"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          aria-hidden="true"
                          className="w-10 h-10 mb-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                      <input onChange={mintImage} id="dropzone-file" type="file" className="hidden" />
                    </label>
                  </div>
                  <div className="ml-6 flex-shrink-0 overflow-hidden rounded-md">
                    <img className="h-64 w-auto" src={imgBase64 || "./download.gif"} alt="" />
                  </div>

                </div>
              </div>
              <button
                type="button"
                className="text-white gradient-blue w-40 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-blue-900 dark:focus:ring-gray-700 dark:border-gray-700"
              >
                Mint
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className={styles.host}>
      <div className="hero-wrapper pb-10 relative">
        <div className="relative mt-8 flex flex-1 flex-col justify-end overflow-hidden rounded-[36px] p-8 px-12">
          <div className="hero-bg absolute inset-0 -z-10 rounded-[36px] bg-gel-black md:block [&>div]:absolute [&>div]:inset-0 [&>div]:rounded-[36px]"></div>
          {/**/}
          <h1 className="hero-title lg:leading[72px] leading-[52px] tracking-[-1.5px] md:leading-[60px] lg:tracking-[-4.5px] pt-40">
            <span className="gel-gradient-text-blue inline-block pr-[4px] pb-1">
              Host
              <br />
              your{" "}
              <br className="xs:hidden sm:hidden md:inline-block lg:inline-block" />{" "}
              community
            </span>
          </h1>
          <p className="hero-text mb-8">
            <span>
              Reliable, secure &amp; easy <br /> way to host gated community
            </span>
          </p>
          {/* <div className="mt-8 flex flex-col items-center gap-4 md:flex-row">
            <button
              className="button button solid-gradient gradient-blue hidden w-full md:w-auto lg:block"
              onClick={() => setSelectedTab("renderHost")}
            >
              Host
            </button>
            <button
              className="button solid-gradient gradient-blue outlined w-full md:w-auto"
              onClick={() => setSelectedTab("renderMint")}
            >
              Mint
            </button>
          </div> */}
        </div>
        <div className="absolute right-20 top-14">
          <Lottie options={defaultOptions} height={500} width={550} />
        </div>
      </div>

      {/* <div className={styles.tab}>
        <button onClick={() => setSelectedTab("renderHost")}>Host</button>
        <button onClick={() => setSelectedTab("renderMint")}>Mint</button>
      </div> */}
      <OurTabs RenderHost={RenderHost} RenderMint={RenderMint} />
      {/* <div>{selectedTab == "renderHost" ? renderHost() : renderMint()}</div> */}
    </div>
  );
}

function OurTabs({ RenderMint, RenderHost }) {
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="w-fullpx-2 py-10 pt-0 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1  max-w-md  rounded-2xl bg-[#202020] p-2">
          <Tab
            key={"Host"}
            className={({ selected }) =>
              classNames(
                "w-full rounded-2xl py-4 px-1 font-bold leading-5 text-[#efe0e0] text-md",
                "focus:outline-none",
                selected ? "bg-[#4b507a] shadow" : "hover:bg-[#2c2f36]"
              )
            }
          >
            {"Host"}
          </Tab>
          <Tab
            key={"Mint"}
            className={({ selected }) =>
              classNames(
                "w-full rounded-2xl py-4 px-1 font-bold leading-5 text-[#efe0e0] text-md",
                "focus:outline-none",
                selected ? "bg-[#4b507a] shadow" : "hover:bg-[#2c2f36]"
              )
            }
          >
            {"Mint"}
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-8">
          <Tab.Panel
            key={0}
            className={classNames(
              "rounded-xl bg-[#202020] p-3",
              "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
            )}
          >
            <RenderHost />
          </Tab.Panel>
          <Tab.Panel
            key={0}
            className={classNames(
              "rounded-xl bg-[#202020] p-3",
              "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
            )}
          >
            <RenderMint />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
