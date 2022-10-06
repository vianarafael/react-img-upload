import { useState } from "react";
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { NetworkType } from "@airgap/beacon-sdk";
import axios from "axios";

const ImageUpload = () => {
  const Tezos = new TezosToolkit("https://ghostnet.tezos.marigold.dev/");

  let wallet;
  const walletOptions = {
    name: "Illic et Numquam",
    preferredNetwork: NetworkType.GHOSTNET,
  };
  let userAddress;

  const rpcUrl = "https://uoi3x99n7c.ghostnet.tezosrpc.midl.dev";

  const [files, setFiles] = useState([]);

  const onChangeImages = (e) => {
    setFiles([...e.target.files]);
  };

  const connect = async () => {
    if (!wallet) {
      wallet = new BeaconWallet(walletOptions);
    }
    console.log("da wallet", wallet);
    try {
      await wallet.requestPermissions({
        network: {
          type: NetworkType.GHOSTNET,
          rpcUrl,
        },
      });
      userAddress = await wallet.getPKH();
      Tezos.setWalletProvider(wallet);
      // await getUserNfts(userAddress);
    } catch (err) {
      console.error(err);
    }
  };
  const upload = async () => {
    if (files.length) {
      try {
        const data = new FormData();
        data.append("file", files[0]);

        console.log("data:", data);
        console.log("key:", process.env.REACT_APP_PINATA_API_KEY);
        console.log("secret:", process.env.REACT_APP_PINATA_API_SECRET);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: data,
          headers: {
            pinata_api_key: `${process.env.REACT_APP_PINATA_API_KEY}`,
            pinata_secret_api_key: `${process.env.REACT_APP_PINATA_API_SECRET}`,
            "Content-Type": "multipart/form-data",
          },
        });

        const imgHash = `ipfs://${resFile.data.IpfsHash}`;
        console.log(imgHash);
      } catch (error) {
        console.log("Error sending File to IPFS: ");
        console.log(error);
      }
    }
  };
  return (
    <div className="App">
      <div>
        <p>Select your picture</p>
        <br />
        <input type="file" onChange={onChangeImages} />
      </div>

      <button onClick={upload}>Upload</button>
      <div>
        <button onClick={connect}>Connect your wallet</button>
      </div>
    </div>
  );
};

export default ImageUpload;
