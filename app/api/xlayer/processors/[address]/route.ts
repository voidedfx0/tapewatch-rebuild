import { NextResponse } from 'next/server';
import { isAddress } from 'viem';
import { processorAbi, processorFactory, xLayerClient } from '@/lib/xlayer';

export const revalidate = 0;

export async function GET(_request: Request, context: { params: Promise<{ address: string }> }) {
  const { address } = await context.params;
  if (!isAddress(address)) return NextResponse.json({ error: 'Invalid contract address.' }, { status: 400 });
  const contract = address as `0x${string}`;

  try {
    const [chainId, blockNumber, code, isProcessor] = await Promise.all([
      xLayerClient.getChainId(),
      xLayerClient.getBlockNumber(),
      xLayerClient.getCode({ address: contract }),
      xLayerClient.readContract({ address: processorFactory, abi: [{ type: 'function', name: 'isCPU', stateMutability: 'view', inputs: [{ name: '', type: 'address' }], outputs: [{ name: '', type: 'bool' }] }], functionName: 'isCPU', args: [contract] }),
    ]);
    if (chainId !== 196) return NextResponse.json({ error: 'RPC endpoint returned the wrong chain.' }, { status: 502 });

    let name = 'Unavailable';
    if (isProcessor) {
      try { name = await xLayerClient.readContract({ address: contract, abi: processorAbi, functionName: 'name' }); } catch {}
    }

    return NextResponse.json({
      chainId,
      blockNumber: blockNumber.toString(),
      address: contract,
      isProcessor,
      name,
      hasCode: Boolean(code && code !== '0x'),
      bytecodeBytes: code && code !== '0x' ? (code.length - 2) / 2 : 0,
      explorerUrl: `https://www.oklink.com/xlayer/address/${contract}`,
    }, { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown RPC error';
    return NextResponse.json({ error: 'Unable to inspect this X Layer contract.', detail: message }, { status: 502 });
  }
}
