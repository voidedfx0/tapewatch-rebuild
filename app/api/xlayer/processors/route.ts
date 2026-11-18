import { NextResponse } from 'next/server';
import { factoryAbi, processorAbi, processorFactory, xLayerClient } from '@/lib/xlayer';

export const revalidate = 0;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const offset = Math.max(0, Number(url.searchParams.get('offset') ?? 0) || 0);
  const limit = Math.min(25, Math.max(1, Number(url.searchParams.get('limit') ?? 25) || 25));

  try {
    const [chainId, blockNumber, total] = await Promise.all([
      xLayerClient.getChainId(),
      xLayerClient.getBlockNumber(),
      xLayerClient.readContract({ address: processorFactory, abi: factoryAbi, functionName: 'cpuCount' }),
    ]);

    if (chainId !== 196) {
      return NextResponse.json({ error: 'RPC endpoint returned the wrong chain.', expectedChainId: 196, actualChainId: chainId }, { status: 502 });
    }

    const count = Number(total);
    const indexes = Array.from({ length: Math.max(0, Math.min(limit, count - offset)) }, (_, i) => BigInt(offset + i));
    const addresses = await Promise.all(indexes.map(i =>
      xLayerClient.readContract({ address: processorFactory, abi: factoryAbi, functionName: 'cpuAt', args: [i] })
    ));

    const processors = await Promise.all(addresses.map(async (address, i) => {
      let name = '';
      try {
        name = await xLayerClient.readContract({ address, abi: processorAbi, functionName: 'name' });
      } catch {
        // Some processors may not expose a readable ERC-721 name.
      }
      return { number: offset + i + 1, address, name: name || `Processor #${offset + i + 1}` };
    }));

    return NextResponse.json({
      chainId,
      blockNumber: blockNumber.toString(),
      factory: processorFactory,
      total: count,
      offset,
      limit,
      hasMore: offset + processors.length < count,
      processors,
    }, { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown RPC error';
    return NextResponse.json({ error: 'Unable to read the X Layer processor registry.', detail: message }, { status: 502 });
  }
}
