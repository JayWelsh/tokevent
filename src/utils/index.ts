import { createBrowserHistory, createHashHistory } from 'history';
import { ChainId, shortenAddress } from '@usedapp/core'
import { JsonRpcProvider, FallbackProvider } from '@ethersproject/providers'
import { utils, Contract } from 'ethers';

import { SvgIconTypeMap } from '@mui/material/SvgIcon';
import { OverridableComponent } from '@mui/material/OverridableComponent';

import { ERC721 } from '../abis';
import { slugToHost, IToken } from '../hosts';
import { IPFS_GATEWAY } from './constants'

export function configureHistory() {
	return window.matchMedia('(display-mode: standalone)').matches
		? createHashHistory()
		: createBrowserHistory()
}

export const centerShortenLongString = (string: string, maxLength: number) => {
	if(typeof string === 'string') {
		if(string.length > maxLength) {
			let charCountForRemoval = string.length - maxLength;
			let stringHalfwayPoint = Math.floor(maxLength/2);
			string = string.slice(0, stringHalfwayPoint) + "..." + string.slice(stringHalfwayPoint + charCountForRemoval, string.length);
			return string;
		}else{
			return string;
		}
	}else{
		return '';
	}
}

const ETHERSCAN_PREFIXES: { [chainId in ChainId]?: string } = {
	1: '',
	3: 'ropsten.',
	4: 'rinkeby.',
	5: 'goerli.',
	42: 'kovan.',
	100: '',
	1337: '',
	56: '',
	97: '',
	137: '',
	361: '',
	365: '',
	1285: '',
	80001: '',
	1666600000: '',
	11297108109: '',
	31337: '',
	250: '',
	43114: '',
	19: '',
	1287: '',
	25: '',
	338: '',
	1284: '',
	42262: '',
	588: '',
	69: '',
	10: '',
	42161: '',
	421611: '',
}
  
export function getEtherscanLink(
	chainId: ChainId,
	data: string,
	type: 'transaction' | 'token' | 'address' | 'block'
): string {
	const prefix = `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}etherscan.io`

	switch (type) {
		case 'transaction': {
		return `${prefix}/tx/${data}`
		}
		case 'token': {
		return `${prefix}/token/${data}`
		}
		case 'block': {
		return `${prefix}/block/${data}`
		}
		case 'address':
		default: {
		return `${prefix}/address/${data}`
		}
	}
}

export function isAddress(address: string | undefined): boolean { 
	try {
		shortenAddress(address ? address : '')
		return true
	}catch{
		return false
	}
}

export function getHostEventURL(hostSlug: string) {
	return `tokevent.org/${hostSlug}`
}

export const verifySignedMessage = async (rawMessage: string, setEvaluationFailedReason?: (arg0: string) => void, setHasCriticalError?: (arg0: boolean) => void) => {
	let parsedMessage = JSON.parse(rawMessage);
	let hasSetErrorMessage = false;
	if(parsedMessage.message && parsedMessage.signedMessage) {
		let originalMessage = JSON.parse(parsedMessage.message);
		if(setEvaluationFailedReason) {
			if(!originalMessage?.account) {
				setEvaluationFailedReason('Missing account property, re-auth with new OTP');
				hasSetErrorMessage = true;
			}
			if(!originalMessage?.hostId) {
				setEvaluationFailedReason('Missing host ID property, re-auth with new OTP');
				hasSetErrorMessage = true;
			}
			if(!originalMessage?.otp) {
				setEvaluationFailedReason('Missing OTP property, re-auth with new OTP');
				hasSetErrorMessage = true;
			}
			if(!originalMessage?.timestamp) {
				setEvaluationFailedReason('Missing timestamp property, re-auth with new OTP');
				hasSetErrorMessage = true;
			}
		}
		if(originalMessage?.account && originalMessage?.hostId && originalMessage?.eventId && originalMessage?.otp && originalMessage?.timestamp) {
			// perform actual verification
			let signer = await utils.verifyMessage(`${parsedMessage.message}`,parsedMessage.signedMessage);
			console.log({signer})
			if(signer === originalMessage.account) {
				return signer;
			}
		}
	}
	if(hasSetErrorMessage && setHasCriticalError) {
		setHasCriticalError(true);
	}
	if(!hasSetErrorMessage && setEvaluationFailedReason) {
		setEvaluationFailedReason('Invalid signature, re-auth with new OTP');
	}
	return false;
}

export const extractRelevantEvent = async (rawMessage: string) => {
	let isValidMessage = await verifySignedMessage(rawMessage);
	if(isValidMessage) {
		let parsedMessage = JSON.parse(rawMessage);
		if(parsedMessage.message && parsedMessage.signedMessage) {
			let originalMessage = JSON.parse(parsedMessage.message);
			if(originalMessage?.hostId && originalMessage?.eventId) {
				// extract event
				let host = slugToHost[originalMessage?.hostId];
				if(host && host.events) {
					let relevantEvent = host.events.find((item) => item.slug === originalMessage?.eventId);
					if(relevantEvent) {
						return relevantEvent;
					}
				}
			}
		}
	}
	return false;
}

interface ITokenBalanceResult {
	tokenAddress: string
	balance: number
	tokensPerTicket: number
	linkToRelevantHoldings: string
}

export const checkTokenBalances = async (ethersLib: JsonRpcProvider | FallbackProvider, eventTokens: IToken[] | undefined, holder: string) => {
	let results = [];
	if(eventTokens && eventTokens.length > 0) {
		for(let eventToken of eventTokens) {
			if(eventToken.network === 'mainnet') {
				if(eventToken.standard === 'ERC721') {
					const tokenContract = await new Contract(eventToken.address, ERC721, ethersLib);
					const balance = Number(await tokenContract.balanceOf(holder));
					results.push({
						tokenAddress: eventToken.address,
						balance,
						tokensPerTicket: eventToken.tokensPerTicket,
						linkToRelevantHoldings: `https://looksrare.org/accounts/${holder}?filters=%7B%22collection%22%3A%22${eventToken.address}%7D`
					})
				}
			}
		}
	}
	return results;
}

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export interface IEvaluationReport {
	signer: string
	signedOtp: string
	currentOtp: string
	timestamp: number
	tokenBalanceResults: ITokenBalanceResult[]
	ticketEntitlement: number
	onlyAddressVerification: boolean
}

export const extractMessageReport = async (rawMessage: string, tokenBalanceResults: ITokenBalanceResult[], currentOtp: string, onlyAddressVerification: boolean = false) => {
	let isValidMessage = await verifySignedMessage(rawMessage);
	if(isValidMessage) {
		let parsedMessage = JSON.parse(rawMessage);
		if(parsedMessage.message && parsedMessage.signedMessage) {
			let originalMessage = JSON.parse(parsedMessage.message);
			if(originalMessage?.hostId && originalMessage?.eventId) {
				// extract event
				let host = slugToHost[originalMessage?.hostId];
				if(host && host.events) {
					let relevantEvent = host.events.find((item) => item.slug === originalMessage?.eventId);
					let ticketEntitlement = tokenBalanceResults.reduce((acc, item) => acc + Math.floor(item.balance / item.tokensPerTicket), 0);
					if(relevantEvent) {
						let messageReport : IEvaluationReport = {
							signer: originalMessage?.account,
							signedOtp: originalMessage?.otp,
							currentOtp: currentOtp,
							timestamp: originalMessage?.timestamp,
							tokenBalanceResults,
							ticketEntitlement: ticketEntitlement,
							onlyAddressVerification: onlyAddressVerification,
						};
						return messageReport;
					}
				}
			}
		}
	}
	return false;
}

export interface IEvaluationSteps {
  label: string
  IconElement: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
      muiName: string;
  }
}

export const extractIpfsLink = (ipfsLinkRaw: string) => {
	const indexOfIpfsSignature = ipfsLinkRaw.indexOf('ipfs://');
	if(indexOfIpfsSignature > -1) {
		let splitLink = ipfsLinkRaw.split('ipfs://');
		if(splitLink[1]) {
			return `${IPFS_GATEWAY}${splitLink[1]}`
		}
		console.error(`[extractIpfsLink] Invalid IPFS Link (no hash segment): ${ipfsLinkRaw}`);
		return '';
	} else {
		console.error(`[extractIpfsLink] Invalid IPFS Link (no 'ipfs://'): ${ipfsLinkRaw}`);
		return '';
	}
}