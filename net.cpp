// ลิขสิทธิ์ (c) 2008 Satoshi Nakamoto
#include "headers.h"
#include <winsock2.h>
 
bool fClient = false;
uint64 nLocalServices = (fLocalServices ? 0 : NODE_NETWORK);
CAddress addrLocalHost(0, DEFAULT_PORT, nLocalServices);
vector<CNode*> vNodes;
CCriticalSection cs_vNodes;
 
CNode* ConnectNode(CAddress addrConnect, int64 nTimeout) {
    SOCKET hSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (connect(hSocket, (struct sockaddr*)&sockaddr, sizeof(sockaddr)) != SOCKET_ERROR) {
        CNode* pnode = new CNode(hSocket, addrConnect);
        vNodes.push_back(pnode);
        return pnode;
    }
    return NULL;
}
 
void ThreadSocketHandler2(void* parg) {
    loop {
        // Disconnect idle nodes
        // select() for data
        // accept() new connections
        // recv() and send() data
    }
}
 
void ThreadOpenConnections2(void* parg) {
    loop {
        if (vNodes.size() < 5) {
            // Select random Class C IP to connect
            // Prevents address flooding attacks
        }
        Sleep(100);
    }
}
 
bool StartNode(string& strError) {
    WSAStartup(MAKEWORD(2,2), &wsadata);
    SOCKET hListenSocket = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    bind(hListenSocket, (struct sockaddr*)&sockaddr, sizeof(sockaddr));
    listen(hListenSocket, SOMAXCONN);
    _beginthread(ThreadSocketHandler, 0, new SOCKET(hListenSocket));
    _beginthread(ThreadOpenConnections, 0, NULL);
    _beginthread(ThreadMessageHandler, 0, NULL);
    return true;
}
