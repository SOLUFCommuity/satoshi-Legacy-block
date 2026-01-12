// ลิขสิทธิ์ (c) 2008 Satoshi Nakamoto
class CMessageHeader;
class CAddress;
class CInv; class
CRequestTracker;
class CNode;
 
static const unsigned short DEFAULT_PORT = htons(2222);
static const char pchMessageStart[4] = { 0xf9, 0xbe, 0xb4, 0xd9 };
 
class CMessageHeader {
public:
    char pchMessageStart[4];
    char pchCommand[12];
    unsigned int nMessageSize;
    bool IsValid();
};
 
class CAddress {
public:
    uint64 nServices;
    unsigned int ip;
    unsigned short port;
    unsigned int nTime;
    string ToString() const;
};
 
class CInv {
public:
    int type;
    uint256 hash;
    const char* GetCommand() const;
};
 
class CNode {
public:
    uint64 nServices;
    SOCKET hSocket;
    CDataStream vSend;
    CDataStream vRecv;
    CAddress addr;
    bool fInbound;
    void PushMessage(const char* pszCommand);
    void Disconnect();
};
 
inline void RelayInventory(const CInv& inv) {
    CRITICAL_BLOCK(cs_vNodes)
        foreach(CNode* pnode, vNodes)
            if (!pnode->setInventoryKnown.count(inv))
                pnode->vInventoryToSend.push_back(inv);
}
