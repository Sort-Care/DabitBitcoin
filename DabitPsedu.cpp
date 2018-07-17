#include <ctime>
#include <vector>

using namespace std;

//Transaction Data
struct TransactionData{
    double amount;
    strinng senderKey;
    string receiverKey;
    time_t timestamp;
};



//Block Class
class Block
{
public:
    Block(int idx, TransactionData d, size_t prevHash);

        //Get Hash
    size_t getHash();

        //Get Previous Hash
    size_t getPrevHash();

        //TransactionData
    TransactionData data;

        //Validate Hash
    bool isHashValid();

private:
    int index;
    size_t blockHash;
    size_t previousHash;
    size_t generateHash();
};

Block::Block(int idx,TransactionData d,size_t prevHash)
{
    index = idx;
    data = d;
    previousHash = prevHash;
    blockHash = generateHash();
    
}

size_t Block::generateHash(){
    hash<string> hash1;
    hash<size_t> hash2;
    hash<size_t> finalHash;
    string toHash = to_string(data.amount)
        + data.receiverKey
        + data.senderKey
        + to_string(data.timestamp);

    return finalHash(hash1(toHash) + hash2(previousHash));
};


size_t Block::getHash(){
    return blockHash;
};

bool Block::isHashValid(){
    return generateHash() == blockHash;
}

size_t Block::getPrevHash(){
    return previousHash;
};



//Blockchain Class
class Blockchain
{
public:
    vector<Block> chain;
    
private:
    Block createGenesisBlock();

        //Constructor
    Blockchain();

        //Blockchain main utility
    void addBlock(TransactionData data);
    bool isChainValid();
    
};


Blockchain::Blockchain(){
    Block genesis = createGenesisBlock();
    chain.push_back(genesis);
};

Block Blockchain::createGenesisBlock(){
    time_t current;
    TransactionData d;
    d.amount = 0;
    d.receiverKey = "None";
    d.senderKey = "None";
    d.timestamp = time(&current);

    hash<int> hash1;
    Block genesis(0, d, hash1(0));
    return genesis;
};

void Blockchain::addBlock(TransactionData d){
    int index = (int)chain.size()-1;
}


