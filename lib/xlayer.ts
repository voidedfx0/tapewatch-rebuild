import { createPublicClient, defineChain, http, parseAbi } from 'viem';

export const xLayer = defineChain({
  id: 196,
  name: 'X Layer',
  nativeCurrency: { name: 'OKB', symbol: 'OKB', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.xlayer.tech'] } },
  blockExplorers: { default: { name: 'OKX Explorer', url: 'https://www.oklink.com/xlayer' } },
});

export const xLayerClient = createPublicClient({
  chain: xLayer,
  transport: http('https://rpc.xlayer.tech', { timeout: 15_000, retryCount: 2 }),
});

export const processorFactory = '0x1f09DAeFA827f02CBb40967cc91b259763760761' as const;

export const factoryAbi = parseAbi([
  'function cpuCount() view returns (uint256)',
  'function cpuAt(uint256 i) view returns (address)',
  'function isCPU(address) view returns (bool)',
]);

export const processorAbi = parseAbi([
  'function name() view returns (string)',
]);
