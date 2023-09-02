import "./Fetch.css";
import { RequestNetwork } from '@requestnetwork/request-client.js';
import { Web3SignatureProvider } from '@requestnetwork/web3-signature';
import { useWalletClient } from "wagmi";
import { ethers } from "ethers";
import { Types, Utils } from "@requestnetwork/request-client.js";
import { hasSufficientFunds, utils } from "@requestnetwork/payment-processor";
import { approveErc20, hasErc20Approval } from "@requestnetwork/payment-processor";
import { payRequest } from "@requestnetwork/payment-processor";



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


    const payeeIdentity = '0x7199D548f1B30EA083Fe668202fd5E621241CC89';
    const payerIdentity = '0x7199D548f1B30EA083Fe668202fd5E621241CC89';
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
        reason: '🍕',
        dueDate: '2023.06.16',
    },
    
    // The identity that signs the request, either payee or payer identity.
    signer: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payeeIdentity,
    },
    };


    async function createReq() {
        const request = await requestClient.createRequest(requestCreateParameters);
        console.log("request: ", request);
        const confirmedRequestData = await request.waitForConfirmation();
        console.log("confirmedRequestData: ", confirmedRequestData);
        //01808aed041ca46973c99228fce8b6174819c98bcb25df648e1747f01c2a9eabba
    }

    async function payReq() {
        const request = await requestClient.fromRequestId(
            "01b5f990297f33907e8af74d8645bb3ec548c896528206a2213b05724f5c0427d8",
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


    return(
        <>
            <h1> Mantle X Request</h1>
            <button onClick={createReq}>Request for Invoice</button>

            <button onClick={payReq}> Pay the request</button>
        </> 
    );
}

export default Fetch;