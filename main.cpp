// ลิขสิทธิ์ (c) 2008 Satoshi Nakamoto
#include "headers.h"
#include "sha.h"
 
map<uint256, CTransaction> mapTransactions;
CCriticalSection cs_mapTransactions;
unsigned int nTransactionsUpdated = 0;
map<COutPoint, CInPoint> mapNextTx;
 
map<uint256, CBlockIndex*> mapBlockIndex;
const uint256 hashGenesisBlock("0x000006b15d1327d67e971d1de9116bd60a3a01556c91b6ebaa416ebc0cfaa646");
CBlockIndex* pindexGenesisBlock = NULL;
int nBestHeight = -1;
uint256 hashTimeChainBest = 0;
CBlockIndex* pindexBest = NULL;
 
map<uint256, CWalletTx> mapWallet;
vector<pair<uint256, bool>> vWalletUpdated;
CCriticalSection cs_mapWallet;
 
bool AddToWallet(const CWalletTx& wtxIn) {
    uint256 hash = wtxIn.GetHash();
    CRITICAL_BLOCK(cs_mapWallet) {
        pair<map<uint256, CWalletTx>::iterator, bool> ret = mapWallet.insert(make_pair(hash, wtxIn));
        CWalletTx& wtx = (*ret.first).second;
        if (!wtx.WriteToDisk()) return false;
        vWalletUpdated.push_back(make_pair(hash, true));
    }
    MainFrameRepaint();
    return true;
}
 
int64 GetBlockValue(int64 nFees) {
    int64 nSubsidy = 10000 * CENT;
    for (int i = 100000; i <= nBestHeight; i += 100000)
        nSubsidy /= 2;
    return nSubsidy + nFees;
}
 
unsigned int GetNextWorkRequired(const CBlockIndex* pindexLast) {
    // Difficulty adjustment logic every 30 days target
    return nBits;
}
 
bool CBlock::ConnectBlock(unsigned int nFile, unsigned int nBlockPos, int nHeight) {
    foreach(CTransaction& tx, vtx) {
        if (!tx.ConnectInputs(txdb, posThisTx, nHeight)) return false;
    }
    foreach(CTransaction& tx, vtx) AddToWalletIfMine(tx, this);
    return true;
}
 
bool Reorganize(CBlockIndex* pindexNew, bool fWriteDisk) {
    CBlockIndex* pfork = pindexBest;
    CBlockIndex* plonger = pindexNew;
    while (pfork != plonger) {
        if (!(pfork = pfork->pprev)) return false;
        while (plonger->nHeight > pfork->nHeight)
            if (!(plonger = plonger->pprev)) return false;
    }
    // Switch to longer chain...
    return true;
}
 
bool CBlock::AcceptBlock() {
    // Check Proof of Work, signatures, and link to TimeChain
    if (!WriteToDisk(!fClient, nFile, nBlockPos)) return false;
    if (!AddToBlockIndex(nFile, nBlockPos, true)) return false;
    return true;
}
