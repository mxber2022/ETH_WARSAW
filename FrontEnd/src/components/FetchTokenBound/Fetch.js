import "./Fetch.css";
import { RequestNetwork } from '@requestnetwork/request-client.js';
import { Web3SignatureProvider } from '@requestnetwork/web3-signature';
import { useWalletClient } from "wagmi";
import { ethers } from "ethers";
import { Types, Utils } from "@requestnetwork/request-client.js";
import { hasSufficientFunds, utils } from "@requestnetwork/payment-processor";
import { approveErc20, hasErc20Approval } from "@requestnetwork/payment-processor";
import { payRequest } from "@requestnetwork/payment-processor";
import { useState } from "react";
import Metals from "./Metals.jpeg";
import mortgage from "./mortgage.jpeg";
import Patent from "./Patent.jpeg";

function Fetch () {
    //const xprovider = new ethers.providers.JsonRpcProvider(window.ethereum);
    const { data: walletClient } = useWalletClient();
    const web3SignatureProvider =  new Web3SignatureProvider(window.ethereum);
    console.log("data: ", web3SignatureProvider);

    const requestClient = new RequestNetwork({
        nodeConnectionConfig: { 
          baseURL: "https://goerli.gateway.request.network/",
        },
        signatureProvider: web3SignatureProvider,
    });


    const payeeIdentity = '0xc614d9a56c9EaFbFc50B993F70386b0fb0B37A24';
    //const payerIdentity = '0x7199D548f1B30EA083Fe668202fd5E621241CC89';
    const [payerIdentity, setPayerIdentity] = useState('');
    const handlePayerIdentityChange = (e) => {
        setPayerIdentity(e.target.value);
    };

    /*
        Reason
    */
    const [reason, setReason] = useState('');
    const handleReasonChange = (e) => {
        setReason(e.target.value);
    };

    const paymentRecipient = payeeIdentity;
    const feeRecipient = '0x0000000000000000000000000000000000000000';

    const requestCreateParameters = {
    requestInfo: {
        
        // The currency in which the request is denominated
        currency: {
        type: Types.RequestLogic.CURRENCY.ETH,
        value: '0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc',
        network: "mantle",
        },
        
        // The expected amount as a string, in parsed units, respecting `decimals`
        // Consider using `parseUnits()` from ethers or viem
        expectedAmount: '1000000000000000000',
        
        // The payee identity. Not necessarily the same as the payment recipient.
        payee: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payeeIdentity,
        },
        
        // The payer identity. If omitted, any identity can pay the request.
        payer: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payerIdentity,
        },
        
        // The request creation timestamp.
        timestamp: Utils.getCurrentTimestampInSecond(),
    },
    
    // The paymentNetwork is the method of payment and related details.
    paymentNetwork: {
        id: Types.Extension.PAYMENT_NETWORK_ID.ETH_FEE_PROXY_CONTRACT,
        parameters: {
        paymentNetworkName: 'mantle', 
        paymentAddress: payeeIdentity,
        feeAddress: feeRecipient,  
        feeAmount: '1',
        },
    },
    
    // The contentData can contain anything.
    // Consider using rnf_invoice format from @requestnetwork/data-format
    contentData: {
        reason: reason,
        dueDate: '2023.06.16',
    },
    
    // The identity that signs the request, either payee or payer identity.
    signer: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payeeIdentity,
    },
    };


    const [requestId, setRequestId] = useState('');

    async function createReq() {
        const request = await requestClient.createRequest(requestCreateParameters);
        console.log("request: ", request);
        const confirmedRequestData = await request.waitForConfirmation();
        console.log("confirmedRequestData: ", confirmedRequestData.requestId);
        //01808aed041ca46973c99228fce8b6174819c98bcb25df648e1747f01c2a9eabba
        setRequestId(confirmedRequestData.requestId);
    }

    

    async function payReq() {
        const request = await requestClient.fromRequestId(
            requestId,
        );
        const requestData = request.getData();

       /* const _hasSufficientFunds = await hasSufficientFunds(
            requestData,
            payerAddress,
            {
              provider: provider,
            },
        );
    */
       /* const approvalTx = await approveErc20(requestData);
        await approvalTx.wait(1);
            */
        const paymentTx = await payRequest(requestData);
        await paymentTx.wait(2);

    }


    return (
        <>
        {/* Content #1 */}
        <div className="fetch-container">
            <div className="left-content">
                <img
                    src={Metals}
                    alt="Your Image"
                    style={{ width: "50%", height: "40%", padding: "20px" }}
                />
            </div>

            <div className="right-content">
                <p>Our Tokenized Gold and Silver Contracts bring a new dimension to the market by combining the purity standards of traditional precious metals with the revolutionary concept of non-fungible tokens (NFTs). These digital assets represent ownership in real-world gold and silver, boasting a minimum fineness of 99.9% for gold and 99.5% for silver. With standardized tick sizes, expiration dates, and the unique NFT characteristics, investors can access a transparent, secure, and highly liquid market, bridging the traditional and digital realms of precious metal trading.</p>

                {/* Input Fields and Buttons */}
                <div>
                    <label htmlFor="payerIdentity">Payee: </label>
                    <input
                        type="text"
                        id="payerIdentity"
                        name="payerIdentity"
                        value={payerIdentity}
                        onChange={handlePayerIdentityChange}
                    />
                </div>

                <div>
                    <label htmlFor="reason">Reason: </label>
                    <input
                        type="text"
                        id="reason"
                        name="reason"
                        value={reason}
                        onChange={handleReasonChange}
                    />
                </div>

                <button onClick={createReq}>Request for Invoice</button>

                {requestId && <p>{requestId}</p>}

                <button onClick={payReq}>Pay the request</button>
            </div>
        </div>

        {/* Content #2 (Duplicate) */}
        <div className="fetch-container">
            <div className="left-content">
                <img
                    src={Patent}
                    alt="Your Image"
                    style={{ width: "50%", height: "40%", padding: "20px" }}
                />
            </div>

            <div className="right-content">
                <p>Introducing our Tokenized Technological Patent Contracts, where innovation meets the blockchain era. These groundbreaking contracts offer a unique fusion of traditional patent rights and cutting-edge non-fungible tokens (NFTs). Each contract encapsulates the essence of groundbreaking inventions, protected by the strength of blockchain technology. With standardized terms, transparent ownership records, and the added dimension of NFTs, inventors and tech enthusiasts alike can confidently navigate this new realm of patent trading, unlocking a future where ideas and innovation find their digital home.</p>

                {/* Input Fields and Buttons */}
                <div>
                    <label htmlFor="payerIdentity">Payee: </label>
                    <input
                        type="text"
                        id="payerIdentity"
                        name="payerIdentity"
                        value={payerIdentity}
                        onChange={handlePayerIdentityChange}
                    />
                </div>

                <div>
                    <label htmlFor="reason">Reason: </label>
                    <input
                        type="text"
                        id="reason"
                        name="reason"
                        value={reason}
                        onChange={handleReasonChange}
                    />
                </div>

                <button onClick={createReq}>Request for Invoice</button>

                {requestId && <p>{requestId}</p>}

                <button onClick={payReq}>Pay the request</button>
            </div>
        </div>

        {/* Content #3 (Duplicate) */}
        <div className="fetch-container">
            <div className="left-content">
                <img
                    src={mortgage}
                    alt="Your Image"
                    style={{ width: "50%", height: "40%", padding: "20px" }}
                />
            </div>

            <div className="right-content">
                <p>Introducing our Tokenized Mortgage Contracts, revolutionizing the way we think about homeownership. These visionary contracts seamlessly merge the traditional concept of mortgages with the power of blockchain and non-fungible tokens (NFTs). Each contract represents a unique piece of real estate, secured and immortalized on the blockchain. With standardized terms, transparent property records, and the added layer of NFTs, homeowners and investors can explore a novel world of real estate investment, paving the way for a future where property ownership is as easy as trading digital assets.</p>

                {/* Input Fields and Buttons */}
                <div>
                    <label htmlFor="payerIdentity">Payee: </label>
                    <input
                        type="text"
                        id="payerIdentity"
                        name="payerIdentity"
                        value={payerIdentity}
                        onChange={handlePayerIdentityChange}
                    />
                </div>

                <div>
                    <label htmlFor="reason">Reason: </label>
                    <input
                        type="text"
                        id="reason"
                        name="reason"
                        value={reason}
                        onChange={handleReasonChange}
                    />
                </div>

                <button onClick={createReq}>Request for Invoice</button>

                {requestId && <p>{requestId}</p>}

                <button onClick={payReq}>Pay the request</button>
            </div>
        </div>

        {/* ... (rest of your component) */}
        </>
    );
}
    
export default Fetch;