import styles from "@/styles/Home.module.scss";
import { useEffect, useState } from "react";
import { fvmAddress, polygonAddress, gatifyAbi } from "@/config";
import web3modal from "web3modal";
import { ethers } from "ethers";
import axios from "axios";

export default function Store() {
  const [nfts, setNfts] = useState([]);
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
            {/* <div className="mt-2 flex-1 text-2xl font-bold transition-all delay-75 duration-200 group-hover:-translate-y-5 group-hover:scale-105 group-hover:opacity-0">
                Harvesting Yield Farming Vaults
            </div> */}
            <div>
            <p>{prop.tokenId}</p>
            </div>
            <div className="flex justify-between">
              <p>{prop.name}</p>
              <p>{prop.price}</p>
            </div>
            <div className="flex justify-between">
              <p>{prop.supply}</p>
              <p>{prop.remaining}</p>
            </div>
            <div className="flex justify-between">
                
              <button className="font-medium px-2 text-xs lg:text-base lg:px-5 py-2 text-white rounded-xl lg:rounded-2xl hover:opacity-70 bg-blue-600" onClick={() => buy(prop)}>Buy</button>
              <p>{prop.price}</p>
            </div>
          </div>

          <div className="use-case-projects flex transition-all delay-100 duration-200 group-hover:translate-y-5 group-hover:scale-105 group-hover:opacity-0"></div>
        </div>
      </div>

      // <div>
      //     <p>Card</p>
      //     <img src={prop.image} alt="" width="200px"/>
      //   <p>{prop.price}</p>
      //   <p>{prop.name}</p>
      //   <p>{prop.tokenId}</p>
      //   <p>{prop.supply}</p>
      //   <p>{prop.remaining}</p>
      //   <button onClick={() => buy(prop)}>Buy</button>
      // </div>
    );
  }

  return (
    <div className="pt-40">
      <p>Store</p>
      <div className="flex flex-wrap gap-6 justify-start">
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
