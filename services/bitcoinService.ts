
import { Block } from '../types';

/**
 * Maps external Blockchain.info API data to our internal Block interface.
 */
const mapApiDataToBlock = (data: any): Block => {
  return {
    hash: data.hash,
    confirmations: 0, 
    strippedsize: data.size,
    size: data.size,
    weight: data.weight || data.size * 4,
    height: data.height,
    version: data.ver,
    versionHex: data.ver.toString(16).padStart(8, '0'),
    merkleroot: data.mrkl_root,
    tx: data.tx.map((t: any) => ({
      txid: t.hash,
      hash: t.hash,
      version: t.ver,
      size: t.size,
      vsize: t.vsize || t.size,
      weight: t.weight || t.size * 4,
      locktime: t.lock_time,
      vin: t.inputs.map((i: any) => ({
        coinbase: i.script, 
        sequence: i.sequence
      })),
      vout: t.out.map((o: any, index: number) => ({
        value: o.value / 100000000, 
        n: index,
        scriptPubKey: {
          asm: o.script,
          hex: o.script,
          reqSigs: 1,
          type: 'pubkeyhash',
          addresses: [o.addr]
        }
      })),
      hex: '' 
    })),
    time: data.time,
    mediantime: data.time,
    nonce: data.nonce,
    bits: data.bits.toString(16),
    difficulty: 0, 
    chainwork: '',
    nextblockhash: data.next_block?.[0] || '',
    prevblockhash: data.prev_block || '',
    nTx: data.n_tx
  };
};

export const fetchBlockByHash = async (hash: string): Promise<Block | null> => {
  try {
    const response = await fetch(`https://blockchain.info/rawblock/${hash}?cors=true`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return mapApiDataToBlock(data);
  } catch (error) {
    console.error("Error fetching block by hash:", error);
    return null;
  }
};

export const fetchBlockByHeight = async (height: number): Promise<Block | null> => {
  try {
    // Blockchain.info uses block-height API to get hash first, or direct rawblock height support
    const response = await fetch(`https://blockchain.info/rawblock/${height}?cors=true`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return mapApiDataToBlock(data);
  } catch (error) {
    console.error("Error fetching block by height:", error);
    return null;
  }
};
