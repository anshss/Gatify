import styles from "@/styles/Home.module.scss";
import { useEffect, useState } from "react";
import { fvmAddress, polygonAddress, gatifyAbi, fvmCurrency } from "@/config";
import web3modal from "web3modal";
import { ethers } from "ethers";
import axios from "axios";
import Footer from "@/components/Footer";

export default function Store() {
  const [nfts, setNfts] = useState([]);

  const [loaded, setLoaded] = useState();

  useEffect(() => {
    fetchFvmNfts();
  }, []);

  async function fetchFvmNfts() {
    const modal = new web3modal({
      network: "mumbai",
      cacheProvider: true,
    });
    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(fvmAddress, gatifyAbi, signer);
    const data = await contract.fetchNfts();
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.uri(i.tokenId.toString());
        const meta = await axios.get(tokenUri);
        console.log(meta);
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
    const contract = new ethers.Contract(fvmAddress, gatifyAbi, signer);
    const price = ethers.utils.parseUnits(item.price.toString(), "ether");
    const transaction = await contract.buyNft(item.tokenId, {
      value: price,
      gasLimit: 1000000,
    });
    await transaction.wait();
    console.log(transaction);
    fetchFvmNfts();
  }

  function NftCard(prop) {
    return (
      <div className="relative flex  w-[23%] flex-col rounded-xl bg-gel-black text-sm overflow-hidden">
        <div className="flex flex-1 flex-col">
          <div className="rounded-t-3xl ">
            <img className="w-full" src={prop.image} alt="" width="200px" />
          </div>
          <div className="p-6">
            <div></div>
            <div className="flex gap-2">
              <p>{prop.name}</p>
              <p>#{prop.tokenId}</p>
            </div>
            <div className="flex justify-between">
              <p>
                {prop.supply}/{prop.remaining}
              </p>
            <p>{prop.price} {fvmCurrency}</p>
            </div>
            <div className="flex justify-between mt-2">
              <button
                className="w-[100px] font-medium px-2 text-xs lg:text-base lg:px-5 py-2 text-white rounded-xl lg:rounded-2xl hover:opacity-70 bg-blue-600"
                onClick={() => buy(prop)}
              >
                Buy
              </button>
            </div>
          </div>

          <div className="use-case-projects flex transition-all delay-100 duration-200 group-hover:translate-y-5 group-hover:scale-105 group-hover:opacity-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40">
      <div className="flex flex-wrap mt-6 gap-6 justify-start">
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
  );
}
