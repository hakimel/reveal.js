

## Blockchain, DApps, and Blockstack
#### Basic concepts to get started

----------------

#### These slides: [slides.cuban.tech/dapps.html](http://slides.cuban.tech/dapps.html)

----------------

### Wifi Info

Network: cubantech

Password: meet-ups

---

## Outline

- Replicated state machines (a.k.a RSM)
- Infrastructure, management and admin tools
- Relation betwen RSM and Blockchain
- Execution rules and consensus
- General Theory of DApps
- Blockstack overview
- Blockchain-independent DApp RSM with VirtualChain

<small> Notes about Bitcoin P2P network in-between </small>

---

## State Machines - States

![](img/rsm.states.png)

---

## State Machines - Inputs

![](img/rsm.inputs.png)

---

## State Machines - Transition

![](img/rsm.transition.png)

---

## The scalability problem

![](img/rsm.scale.png)

--

## Stats of the Bitcoin blockchain

![](img/bitcoin.stats.png)

---

## Distributed services as state machines

- Fault tolerance beyond single-node processors
- Replicas of a single server executed on separate processors 
- Protocols for client interactions with replicas
- Physical and electrical isolation for independent server failures
- Let's assume deterministic state machine
  * ... even if Turing complete is possible

---

## The State Machine Approach

- <span style="color: yellow"> Deploy replicas of the software </span>
- Receive client requests (i.e. inputs)
- Order the inputs
- Execute SM transition over and over
- Monitor replicas for differences in State or Output

---

## The State Machine Approach

##### Deploy software to multiple nodes

<small> [![](img/dockercuba.logo.png)](http://docker.cuban.tech) </small>

<small> [docker.cuban.tech](http://docker.cuban.tech) </small>

- Software package repositories
  * e.g. [bitcoind @ Debian](https://packages.debian.org/bitcoind), [Blockstack apt repo](https://packages.blockstack.com), ...
- Containers and registries
  * e.g. [Lisk](https://hub.docker.com/u/lisk/), [Blockstack](https://hub.docker.com/u/blockstack), ... @ Docker Hub
- CM tools (Ansible, Puppet, Chef, Habitat, ...)

--

## State of CM - Q1 2017

![](img/forrester_wave_cm_q1.jpg)

---

## The State Machine Approach

- Deploy replicas of the software
- <span style="color: yellow">Receive client requests (i.e. inputs)</span>
- Order the inputs
- Execute SM transition over and over
- Monitor replicas for differences in State or Output

---

## The State Machine Approach

##### Receive client requests

- Multiple solutions
- e.g. Bitcoin transactions

--

## Bitcoin - Anatomy of transactions

##### Important meta-data (except [coinbase transactions](https://bitcoin.org/en/glossary/coinbase-transaction))

<small> ![](img/bitcoin-en-tx-overview.svg) </small>

- Transaction (global) ID
- Version number (protocol evolution)
- Locktime
  * Earliest time TX can be added to the block chain
  * Time-locked transactions only valid in the future
  * Cancellations

--

## Bitcoin - Anatomy of transactions

##### Inputs and outputs

<small> ![](img/bitcoin-en-tx-overview.svg) </small>

- Output(s) : Implicit array index
  * Amount (satoshis)
  * Pubkey script ( Unlock to spend )
- Input(s)
  * Spent output (Transaction ID + Output index)
  * Sequence number (related to locktime)
  * Signature script (params to unlock Pubkey script)

> **Bitcoin** is a public distributed ledger.

--

## Bitcoin - Sample transaction

<small> blocktrail.com </small>

![](img/bitcoin.tx.c60e4dc5e69c19ff53a45954d8a8996fd9aac6fda317fd7238dec6a482c718cf.png)

--

## Bitcoin - Sending transactions

##### Pay-To-Public-Key-Hash (P2PKH) setup

![](img/bitcoin-en-creating-p2pkh-output.svg)

- ECDSA secp256k1 (elliptic) curve
  * Deterministic public key (hash) generation

--

## Bitcoin - Sending transactions

##### Pay-To-Script-Hash (P2SH) setup

![](img/bitcoin-en-creating-p2sh-output.svg)

- Redeem script hash instead of public key hash
  * Supports [PubKey scripts opcodes](https://bitcoin.org/eb/developer-reference#opcodes)

--

## Bitcoin - Sending transactions

##### Finalize TX

![](img/bitcoin-en-tx-overview-utxo.svg)

- Sender creates UTXO with PubKey script
  * ... using the public key hash of the receiver
- Sender broadcasts transaction (P2P network)
- Miners add it to a block (... more details later ...)
- Wallet : UTXO amount as spendable balance

--

## Bitcoin - Spending P2PKH outputs

![](img/bitcoin-en-unlocking-p2pkh-output.svg)

- Lookup transaction ID and index for UTXO
- Sender creates TX input and also add:
  * Sequence number
  * Signature & PubKey (script params)

--

## Bitcoin - Spending P2SH outputs

![](img/bitcoin-en-unlocking-p2sh-output.svg)

- Lookup transaction ID and index for UTXO
- Sender creates TX input and also add:
  * Sequence number
  * Signature & PubKey (script params)

--

## Bitcoin - Spending outputs

##### Last steps

- Sender prepares UTXO for recipient (as before)
- Sender broadcasts transaction (P2P network)
- Miners add it to a block
  * Script validation ! ( A-ha! )
- Wallet : Update balance

--

## Bitcoin - Standard P2PKH public script

##### Execution stack timeline

![](img/bitcoin-en-p2pkh-stack.svg)

---

# P2P network

A very peculiar monster

--

## P2P network

##### Peer discovery - Bitcon seed DNS

```
;; QUESTION SECTION
;seed.bitcoin.sipa.be       IN  A

;; ANSWER SECTION
seed.bitcoin.sipa.be.   60  IN  A   192.0.2.113
seed.bitcoin.sipa.be.   60  IN  A   198.51.100.231
seed.bitcoin.sipa.be.   60  IN  A   203.0.113.183
```

- Connect to port `8333` (mainnet) or `18333` (testnet)
- Followed by `addr` messages announcing addresses of peers

--

## P2P network

##### Connecting to peers

- Send [`version` message](https://bitcoin.org/en/developer-reference#version)
  * local version number, block, and current time
- Peer responds with its own `version` message
- Send `getaddr` and receive `addr` of new peers (discovery)

--

## P2P network

##### Transaction broadcasting

- Send [`inv` message](https://bitcoin.org/en/developer-reference#inv) to a peer.
- Wait for `getdata` message
- Send transaction data in `tx` message
- Peer forwards transactions to other peers
- Full nodes keep track of unconfirmed transactions in [memory pool](https://bitcoin.org/en/developer-guide#memory-pool)

> ... to be continued ...

---

## The State Machine Approach

- Deploy replicas of the software
- Receive client requests (i.e. inputs)
- <span style="color: yellow">Order the inputs</span>
- Execute SM transition over and over
- Monitor replicas for differences in State or Output

---

## The State Machine Approach

##### Ordering of inputs

- Mutiple solutions
- [Blockchain](https://en.wikipedia.org/wiki/Blockchain_database) ?
- Bitcoin transactions !

--

## Bitcoin - Transaction spending

![](img/bitcoin-en-tx-overview-spending.svg)

Causal ordering : Chain of ownership

---

## The State Machine Approach

- Deploy replicas of the software 
- Receive client requests (i.e. inputs)
- Order the inputs
- <span style="color: yellow">Execute SM transition over and over</span>
- Monitor replicas for differences in State or Output

---

## The State Machine Approach

##### Execute the state machine

![](img/rsm.transition.png)

- Execute inputs in the chosen order on each replica

--

## Bitcoin - Transaction propagation

![](img/bitcoin-en-transaction-propagation.svg)

---

## Bitcoin blockchain

##### Design goals

- Public ledger
  * Ordered and timestamped transactions
- Storage distributed over Bitcoin [full nodes](https://bitcoin.org/en/glossary/node)
- Protect against
  * [double spending](https://bitcoin.org/en/glossary/double-spend)
  * modification of previous transaction records

--

## Bitcoin blockchain

##### Overview

![](img/bitcoin-en-blockchain-overview.svg)

--

## Bitcoin block header

- **Version** : 4 bytes
- **Previous block header hash** : 32 bytes
- **Merkle root hash** : 32 bytes
- **Time** : 4 bytes
- **nBits** : 4 bytes
- **nonce** : 4 bytes

--

## Bitcoin Block 493387

<small> blocktrail.com </small>

[![](img/bitcoin.block.493387.png)](https://www.blocktrail.com/BTC/block/000000000000000000ad396808fdc05052655d8a80aee7ffc538b71828ea03d3)

--

## Bitcoin Block 493387 - Transactions

Coinbase transaction comes first

[![](img/bitcoin.txs.493387.png)](https://www.blocktrail.com/BTC/block/000000000000000000ad396808fdc05052655d8a80aee7ffc538b71828ea03d3)

---

## Proofs

- Metric
  * Prove legitimate interest, irreversibility
  * Make decisions about changes in a DApp
- Modifying past blocks harder than adding new ones
- Common examples
  * **Proof of work** (PoW)
  * **Proof of stake** (PoS)
  * **Proof of space** (PoSpace)
  * **Proof of collaboration** (PoC)
  * **Proof of replication** (PoR)
- Can be used in parallel
  * e.g. [PeerCoin](http://peercoin.net) relies on PoW + PoS

--

## Proof of work

- *Driver* : Amount of computational work (CPU, GPU, NPU, ...) that contributed to the operation of the DApp.
- Resource intense (power, cooling, ...)
- The mechanism for establishing consensus through POW is commonly called mining.

> <small> *Bitcoin* uses that approach for its day-to-day operation. </small>

--

## Proof of stake

- *Driver* : new coins according to number of coins (stake) you hold
- May be abused by those who hold enough coins.
- Usually combined with other proof

> <small> *OmniLayer* is based on the POS mechanism. </small>

--

## Proof of capacity

- *Driver* : allocation of non-trivial amounts of memory or storage needed to solve a challenge (memory-hard functions).
- Greener alternative to PoW

> <small> PoStorage is used in PermaCoin, SpaceMint, [BurstCoin](https://en.wikipedia.org/wiki/Burstcoin) </small>

--

## Proof of collaboration

- Collaboratively Validating Nodes (in short CVNs)
  * [Decide](https://chain.fair-coin.org/download/FairCoin2-white-paper-V1.1.pdf) what node creates next block
  * Approve CVN by digitally signing a piece of data containing winner's ID
  * With required signatures gather TX and create new block
- No reward (new money) for block creation (small fee)
- Power consumption is low (CVNs on a Raspberry3)

> <small> FairCoin (fork of Bitcoin 0.12) implements PoC since July 18th 2017</small>

---

## Merkle tree - Prunning transactions

![](img/bitcoin-en-merkle-prune.png)

**Operating modes** : [SPV clients](https://bitcoin.org/en/glossary/simplified-payment-verification) vs [full node](https://bitcoin.org/en/glossary/node)

---

## P2P network (contd.)

##### Initial Block Download

- First run : Node only contains [block 0](https://bitcoin.org/en/glossary/genesis-block)
- Choose remote peer (a.k.a sync node)
- Download from block 1 to current tip of sync node's best block chain
  * Blocks-first (up until version 0.9.3)
  * Headers-first (from 0.10.0 onwards)

---

## Bitcoin mining

- Add new blocks to the block chain
- Make transation history hard to modify
- Strategies
  * Solo mining
  * Pooled mining

---

## Bitcoin mining - Solo mining

![](img/bitcoin-en-solo-mining-overview.svg)

- Miner generates new blocks on his own
- Completely claims block reward and transaction fees
- Large payments
- Higher variance (longer time between them)

---

## Bitcoin mining - Pooled mining

![](img/bitcoin-en-pooled-mining-overview.svg)

- Group of miners pool resources with other miners
- Find bocks more often at easier bits targets
- Proceeds shared amongst miners
  * Correlated to relative hash power PoW
- Small payments
- Lower variance (i.e. shorter time between payments)

--

## SlushPool

<small> [slushpool.com/home/](https://slushpool.com/home/) </small>

![](img/slushpool.png)

<small> Minted coins : `+1M BTC` mined since Dec 2010. `ZCASH` since Apr 20th 2017</small>

--

## SlushPool

##### Hash rate

![](img/slushpool.hashrate.20171113.png)

--

## SlushPool

##### Hash rate distribution

![](img/slushpool.hashratedist.20171113.png)

--

## Bitmain - AntMiner

<small> [bitmaintech.com](https://bitmaintech.com/) </small>

![](img/bitmain.antminer.s9.png)

<small> Minted coins : `BTC` </small>

--

## Bitmain - AntPool

<small> [bitmaintech.com](https://bitmaintech.com/) </small>

![](img/bitmain.antpool.png)

--

## BTCC Pool

<small> [pool.btcc.com](https://pool.btcc.com/) </small>

![](img/btcc.png)

<small> Minted coins : `BTC` </small>

---

## Bitcoin mining hardware

##### Installed capacity - 2017/11/13

<div style="width: 500px; display: inline-block; margin-left: auto; magin-right: auto"> ![](img/btc.hashrate.20171113.png) </div>

- +2 EHash/s , 10,000 metric tonnes of hardware
- Enough material to build another Eiffel tower.

--

## Bitcoin mining hardware - Energy

![](img/bitcoin.pow.energy.asic.jpg)

Application specific integrated circuits, a.k.a. ASICs

--

## Energy consumption of Bitcoin PoW

<small> ... according to [BitcoinEnergyConsumption.com](https://BitcoinEnergyConsumption.com)</small>

![](img/bitcoin.pow.energy.png)

- Projected to be comparable to Denmark's in 2020 

---

## P2P network (contd.)

##### Block broadcasting - Unsolicited Push

- Miner includes mined block in new [`block` message](https://bitcoin.org/en/developer-reference#block)
- Miner sends message to its full nodes peers

> <small> since version 0.12.0 </small>

--

## P2P network

##### Block broadcasting - Standard Block Relay

- Standard method
- Miner sends `inv` message to all (SPV and full node) peers
  * Includes inventory referring to the block
- **BF peer** &rArr; `getdata` requesting the full block
  * Miner &rArr; `block` message
- **HF peer** &rArr; `getheaders` (few headers in best block chain)
  * Miner &rArr; `headers` message
- **SPV clients** &rArr; `getdata` requesting a Merkle block
  * Miner &rArr; `merkleblock` followed by some `tx` messages

> <small> since version 0.12.0 </small>

--

## P2P network

##### Block broadcasting - Direct Headers Announcement

- Used if peer signals with `sendheaders` during handshake
- Miner sends `headers` message fror new block
- **HF peer** &rArr; Partial validation and sends `getdata`
- Miner &rArr; `block` or `merkleblock`

> <small> since version 0.12.0 </small>

---

## The State Machine Approach

- Deploy replicas of the software 
- Receive client requests (i.e. inputs)
- Order the inputs
- Execute SM transition over and over
- <span style="color: yellow">Monitor replicas for differences in State or Output</span>

---

## The State Machine Approach

##### Sending outputs

- Each replica generates output
  * Non faulty replicas will always produce same output
- Faulty outputs filtered out
  * Consensus
- Correct output sent back to client

--

## Consensus

- Nakamoto consensus
- [Paxos](https://en.wikipedia.org/wiki/Paxos_%28computer_science%29)
- Quorum systems
- [Raft](https://raft.github.io/)
- [Obelisk](https://blog.skycoin.net/statement/obelisk-the-skycoin-consensus-algorithm/)

---

## Bitcoin - Nakamoto consensus

##### Occasional vs Extended Forking

![](img/bitcoin-en-blockchain-fork.svg)

- Simultaneous blocks mined, nodes choose winner
- Peers prefer forks with stronger PoW
  * longest fork
  * highest block height : distance to [block 0](https://bitcoin.org/en/glossary/genesis-block)

--

## Bitcoin - Nakamoto consensus

##### Soft fork

![](img/bitcoin-en-soft-fork.svg)

- When ?
  * Quite often e.g. concurrent miners
  * Upgraded consensus rules reject formerly valid blocks
    + [UASF](https://bitcoin.org/en/glossary/uasf) flag day vs [MASF](https://bitcoin.org/en/glossary/masf) hash rate majority signalling

--

## Bitcoin - Nakamoto consensus

##### Soft fork resolution

- Eliminate (stale and orphan) blocks in low PoW forks
- Iterate over transactions in stale and orphan blocks
  * discard it if TX belongs in another block of highest PoW fork
  * move it back to TX mempool otherwise
    + to be included in a future block by this miner
    + (optionally?) broadcast to the P2P network

--

## Bitcoin - Nakamoto consensus

##### Hard forks

![](img/bitcoin-en-hard-fork.svg)

- When?
  * Extend blockchain to prevent third-party 51% attack
  * Upgraded consensus accept formerly rejected blocks
  * Network partition

--

## Bitcoin - Corollaries of hard forks

- Warning in [`getnetworkinfo`](https://bitcoin.org/en/developer-reference#getnetworkinfo) and run `-alertnotify` command if set.
  * +6 blocks PoW than best valid chain
  * Repetition of block and TX with version numbers higher than expected consensus
- [Coinbase transaction](https://bitcoin.org/en/glossary/coinbase-transaction) may be spent only after 100 blocks
- [SPV clients](https://bitcoin.org/en/glossary/simplified-payment-verification) may contact different full nodes
  * discard chains with weaker PoW

---

## Bitcoin - Client balance

![](img/bitcoin-en-transaction-propagation.svg)

Wallet software : Add up UTXO to determine balance

---

## Fault tolerance (in theory)

- Tolerance for F random independent failures
  * memory errors, hard-drive crash, ...
  * Requires `2F + 1` replicas
- Failed replica can stop without generating outputs
  * Only `F + 1` replicas required
  * ... no existing systems achieve this limit
- [Byzantine failures](https://en.wikipedia.org/wiki/Byzantine_fault_tolerance)
  * random, spurious faults &rArr; `2F + 1`
  * malicious, intelligent attacks &rArr; `3F + 1`

--

## Bitcoin node 

##### Minimum requirements

- Desktop or laptop (Windows, Mac OS X, or Linux)
- 125 GB of HDD space, 2 GB RAM
- Broadband Internet with upload &ge; 400 Kbps (50 KB/s)
  * Unmetered connection, or high upload limits, respect upload limits
  * +100 GB IBD
  * &asymp; 20 gigabytes download a month
  * +200 GB upload a month
- +6 hours a day with full node running
- +8 connections and active sync peers

--

## Bitcoin node

> Most ordinary folks should **NOT** be running a full node.
> We need full nodes that are always on, have more than 8 connections
> *(if you have only 8 then you are part of the problem, not part of the solution)*,
> and have a high-bandwidth connection to the Internet.

Gavin Andresen, Bitcoin Foundation’s Chief Scientist, in [Reddit post](http://www.reddit.com/r/Bitcoin/comments/1scd4z/im_running_a_full_node_and_so_should_you/cdw3lrh?context=3)

---

# General Theory of DApps

---

## Definition of a DApp - Open source

- It must operate autonomously
- No entity controlling the majority of its tokens
- Data and records in a public, decentralized block chain.

> <small> e.g. **Bitcoin** apps are open-source, no entity controls Bitcoin and its records are open and public. </small>

---

## Definition of a DApp - Generation of tokens

- The purpose of a token is to allow access to the DApp application.
- Must generate tokens according to a standard algorithm
  * Possibly distribute tokens at the beginning of operation
- Tokens must be necessary for the use of the application
- Contribution from users rewarded by payment in the application's tokens.

> <small> e.g. **Bitcoin** generates bitcoins (tokens) with a predetermined algorithm that cannot be changed. Tokens are necessary for Bitcoin to function. Bitcoin miners are rewarded with bitcoins for their contributions in securing the Bitcoin network. </small>

---

## Definition of a DApp - Consensus

- Protocol may be adapted in response to
  * proposed improvements
  * market feedback
- Changes decided by majority consensus of its users.

> <small> e.g. All changes to **Bitcoin** must be approved by a majority consensus of its users through the proof-of-work mechanism. </small>

---

## Classification of DApps - Type I

##### According to use of blockchain

- They have their own block chain.

> <small> *Bitcoin*, *Litecoin* and other [alt-coins](https://en.wikipedia.org/wiki/List_of_cryptocurrencies) </small>

---

## Classification of DApps - Type II

##### According to use of blockchain

- Use the block chain of a type I decentralized application.
- They are protocols
  * Tokens that are necessary for their function.

> <small> *OmniLayer* (formerly *Master Protocol*) and *Blockstack* are examples of type II decentralized application. </small>

--

## DApps type II

##### Bitcoin null data transactions

- Embed additional data in DApp type I transactions
- Bitcoin [OP_RETURN](https://bitcoin.org/en/developer-reference#term-op-return) code
  * Provably prune-able outputs
  * Bitcoin miners will have the option to prune those data

> Blockstack is a type II DApp

---

## Classification of DApps - Type III

##### According to use of blockchain

- They use the protocol of a type II decentralized application.
- They are protocols and have tokens that are necessary for their function.

> <small> *Omni* (formerly *Mastercoin*), and *Blockstack* apps are examples of type III decentralized applications. </small>

---

## Foundational steps of a DApp

- Publication of whitepaper
- Distribution of initial tokens
- Delegation of ownership

---

## Sections of the DApp whitepaper

- Intentions and goals of the DApp
- Plans for token distribution
- Mechanism for establishing consensus
- Oversight of the DApp
- Management of developer bounties
- Technical description of the DApp

---

## Distributing tokens - Mining

- Tokens are distributed to those who contribute most work to the operation of a DApp.

> <small> Taking *Bitcoin* as an example, bitcoins are distributed through a predetermined algorithm to the miners that verify transactions and maintain the Bitcoin block chain. </small>

---

## Distributing tokens - Fund raising

- Tokens are distributed to those who fund the initial development of the DApp.

> <small> Taking the *Master Protocol* as an example, Mastercoins were initially distributed to those who sent bitcoins to a given address at the rate of 100 Mastercoins per bitcoin sent. The bitcoins collected were then used to fund the development of applications that promoted the development of the Master Protocol. </small>

---

## Distributing tokens - Development

- Tokens are generated using a predefined mechanism and are only available for the development of the DApp.

> <small> In addition to its fund-raising mechanism, the Master Protocol used the collaboration mechanism to fund its future development. Some Mastercoins are distributed via a community-driven bounty system based on the PoS mechanism.

---

# Blockstack

---

## Why Blockstack ?

The Internet is +40 years old now

- [Critical services offline](https://www.wired.com/2016/10/internet-outage-ddos-dns-dyn/) by attacks like DDoS on DNS servers
- Implicit trust e.g. [TurkTrust CA issued false security certificates for Google](http: //cnet.co/2oArU6O)
- Desktop to cloud creates SPoF e.g. [Yahoo! losing data for 500M people](http: //nyti.ms/2oAqn0G.)

--

## Why Blockstack ?

##### Ryan Shea, Blockstack co-founder

<video src="http://videos.cuban.tech/blockstack/Why%20has%20Blockstack%20built%20a%20decentralized%20internet--iwd_wd3waA.mp4" controls width="800"></video>

---

## What is Blockstack?

- A New Internet for Decentralized Applications
- Open source
- Re-decentralize the Internet
- Users own their data

--

## Trust-to-trust design principle

##### Muneeb Ali, Blockstack CTO

<video src="http://videos.cuban.tech/blockstack/What%20is%20the%20trust-to-trust%20design%20principle-LwFGczn1hrA.mp4" controls width="800"></video>

---

## Blockstack goals

- Decentralized Naming & Discovery
  * Register and use human-readable names
  * Discover network resources without trusting any remote parties
- Decentralized Storage
  * Store data without revealing it to any remote parties.
- Comparable Performance

---

## Blockstack - Key decisions

- Survive Failures of Underlying Blockchains
- Keep Complexity and Logic Outside of Blockchains
  * opposite to NameCoin, Ethereum, etc ...
- Scalable Index for Global Data

---

## Blockstack architecture

![](img/bsk-architecture-diagram5.png)

---

## Blockstack layers

- Virtual blockchain, on top of Bitcoin blockchain
- **Atlas**, a peer-network
  * Global index for discovery information
- **Gaia**, decentralized storage system

> <small> Users do not need to trust any data layer </small>

---

## Blockstack - Blockchain layer

<small> DApp type II </small>

![](img/blockstack.blocks.png)

--

## Blockstack - Nameops transactions

[![](img/blockstack.nameops.493935.png)](https://explorer.blockstack.org/nameops/493935)

--

## Sample Blockstack null data transaction

<small> NAME_REGISTRATION bluestack.id </small>

[![](img/bitcoin.tx.702e76497a6061222208698c4d0fbed6ca768d10832e1b8da9184a8ea6f5ded8.png)](https://www.blocktrail.com/BTC/tx/702e76497a6061222208698c4d0fbed6ca768d10832e1b8da9184a8ea6f5ded8)

---

## Blockstack - Virtualchain layer

##### Why?

- Fork*-consistent RSMs on existing blockchains
- Fork detection & recovery
- Cross-chain migration
  * [Reasons](https://blockstack.org/blog/why-blockstack-is-migrating-to-the-bitcoin-blockchain) for Blockstack to migrate from Namecoin to Bitcoin

--

## Blockstack - Virtualchain layer

##### ... according to Muneeb Ali, Blockstack CTO

<video src="http://videos.cuban.tech/blockstack/What%20is%20a%20Virtual%20Chain%20What%20makes%20it%20a%20powerful%20solution%20for%20longevity%20and%20scalability-LBft0c4RZcQ.mp4" controls width="800"></video>

--

## Blockstack - Virtualchain

##### Filtering and ordering OP_RETURN TXs

<div style="display: inline-block; background-color: #fff"> ![](img/bsk-virtual-blockchain.png) </div>

---

## Blockstack apps - Explorer and AppStore

![](img/bsk-appstore.png)

---

## Blockstack apps - iTunes clone

![](img/bsk-app-itunes.png)

---

## Blockstack apps - Afia

![](img/bsk-app-afia.png)

---

## Blockstack apps - Casa

![](img/bsk-app-casa.png)

---

## Wrapping Up

- Thank you for coming!
- We'd love your feedback: [bit.ly/blockstack-cuba-feedback](http://bit.ly/blockstack-cuba-feedback)



