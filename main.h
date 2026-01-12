// ลิขสิทธิ์ (c) 2008 Satoshi Nakamoto
//
// อนุญาตให้บุคคลใดก็ตามที่ได้รับสำเนา
// ของซอฟต์แวร์นี้และไฟล์เอกสารที่เกี่ยวข้อง ("ซอฟต์แวร์") สามารถดำเนินการ
// ในซอฟต์แวร์ได้โดยไม่มีข้อจำกัดใดๆ รวมถึงสิทธิ์
// ในการใช้ คัดลอก แก้ไข รวม เผยแพร่ แจกจ่าย อนุญาตให้ใช้งานต่อ และ/หรือขาย
// สำเนาของซอฟต์แวร์ และอนุญาตให้บุคคลที่ได้รับซอฟต์แวร์
// สามารถดำเนินการดังกล่าวได้ ภายใต้เงื่อนไขต่อไปนี้:
//
// ข้อความแจ้งลิขสิทธิ์และข้อความแจ้งการอนุญาตข้างต้นจะต้องรวมอยู่ใน
// สำเนาทั้งหมดหรือส่วนสำคัญของซอฟต์แวร์
//
// ซอฟต์แวร์นี้จัดให้ "ตามสภาพที่เป็นอยู่" โดยไม่มีการรับประกันใดๆ ไม่ว่าโดยชัดแจ้งหรือ
// โดยนัย รวมถึงแต่ไม่จำกัดเพียงการรับประกันความสามารถในการใช้งาน
// ความเหมาะสมสำหรับวัตถุประสงค์เฉพาะ กรรมสิทธิ์ และการไม่ละเมิดลิขสิทธิ์ ไม่ว่าในกรณีใดๆ
// ผู้เขียนหรือผู้ถือลิขสิทธิ์จะไม่รับผิดชอบต่อการเรียกร้อง ค่าเสียหาย หรือ
// ความรับผิดอื่นๆ ไม่ว่าจะเป็นการกระทำตามสัญญา การละเมิด หรืออย่างอื่นใด ที่เกิดขึ้น
// จากหรือเกี่ยวข้องกับซอฟต์แวร์ หรือการใช้งานหรือการดำเนินการอื่นๆ
// ในซอฟต์แวร์
 
class COutPoint;
class CInPoint;
class CDiskTxPos;
class CCoinBase; class CTxIn;
class CTxOut;
class CTransaction;
class CBlock;
class CBlockIndex;
class CWalletTx;
class CKeyItem;
 
static const unsigned int MAX_SIZE = 0x02000000;
static const int64 COIN = 1000000;
static const int64 CENT = 10000;
static const int64 TRANSACTIONFEE = 1 * CENT;
static const unsigned int MINPROOFOFWORK = 20;
 
extern map<uint256, CBlockIndex*> mapBlockIndex;
extern const uint256 hashGenesisBlock;
extern CBlockIndex* pindexGenesisBlock;
extern int nBestHeight;
extern CBlockIndex* pindexBest;
extern unsigned int nTransactionsUpdated;
extern int fGenerateBitcoins;
 
FILE* OpenBlockFile(unsigned int nFile, unsigned int nBlockPos, const char* pszMode="rb");
FILE* AppendBlockFile(unsigned int& nFileRet);
bool AddKey(const CKey& key);
vector<unsigned char> GenerateNewKey();
bool AddToWallet(const CWalletTx& wtxIn);
void ReacceptWalletTransactions();
void RelayWalletTransactions();
bool LoadBlockIndex(bool fAllowNew=true);
bool BitcoinMiner();
bool ProcessMessages(CNode* pfrom);
bool ProcessMessage(CNode* pfrom, string strCommand, CDataStream& vRecv);
bool SendMessages(CNode* pto);
int64 CountMoney();
bool CreateTransaction(CScript scriptPubKey, int64 nValue, CWalletTx& txNew);
bool SendMoney(CScript scriptPubKey, int64 nValue, CWalletTx& wtxNew);
 
class CDiskTxPos {
public:
    unsigned int nFile;
    unsigned int nBlockPos;
    unsigned int nTxPos;
    CDiskTxPos() { SetNull(); }
    void SetNull() { nFile = -1; nBlockPos = 0; nTxPos = 0; }
    bool IsNull() const { return (nFile == -1); }
};
