

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
- Deploying copies of the state machine
- Receiving and ordering client requests with Blockchain
- Executing the RSM
- Sending outputs to the client
- General Theory of DApps
- A (very) quick overview of Bitcoin and Ethereum
- Blockchain-independent DApp RSM with VirtualChain
- Blockstack overview

<small> Notes about P2P network in-between </small>

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

- Software package repositories
  * e.g. [bitcoind @ Debian](https://packages.debian.org/bitcoind), [Blockstack apt repo](https://packages.blockstack.com), ...
- Containers and registries
  * e.g. [Lisk](https://hub.docker.com/u/lisk/), [Blockstack](https://hub.docker.com/u/blockstack), ... @ Docker Hub
- CM tools
  * Ansible, Puppet, Chef, Habitat, ...

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

## Proofs

- Metric
  * Legitimate interest, irreversibility
  * Make decisions about changes in a DApp
- Require *effort* 
  * Modifying past blocks harder than adding new ones
- Coomon examples
  * **Proof of work** (PoW)
  * **Proof of stake** (PoS)
  * **Proof of space** (PoSpace, PoC)
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

- *Driver* : percent ownership that various stakeholders have over the application.

> <small> *OmniLayer* is based on the POS mechanism. </small>

--

## Proof of capacity

- *Driver* : allocation of non-trivial amounts of memory or storage needed to solve a challenge (memory-hard functions).
- Greener alternative to PoW
- Used in PermaCoin, SpaceMint, [BurstCoin](https://en.wikipedia.org/wiki/Burstcoin)

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
- **BF peer** => `getdata` requesting the full block
  * Miner => `block` message
- **HF peer** => `getheaders` (few headers in best block chain)
  * Miner => `headers` message
- **SPV clients** => `getdata` requesting a Merkle block
  * Miner => `merkleblock` followed by some `tx` messages

> <small> since version 0.12.0 </small>

--

## P2P network

##### Block broadcasting - Direct Headers Announcement

- Used if peer signals with `sendheaders` during handshake
- Miner sends `headers` message fror new block
- **HF peer** => Partial validation and sends `getdata`
- Miner => `block` or `merkleblock`

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

![](img/bitcoin-en-soft-fork)

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

- Warning in `[getnetworkinfo](https://bitcoin.org/en/developer-reference#getnetworkinfo)` and run `-alertnotify` command if set.
  * +6 blocks PoW than best valid chain
  * Repeated block and TX version numbers higher than expected consensus
- [Coinbase transaction](https://bitcoin.org/en/glossary/coinbase-transaction) may be spent only after 100 blocks
- [SPV clients](https://bitcoin.org/en/glossary/simplified-payment-verification) may contact different full nodes
  * discard chains with weaker PoW

---

## Bitcoin - Client balance

![](img/bitcoin-en-transaction-propagation.svg)

Wallet software : Add up unspent transactions to determine balance

---

## Fault tolerance (in theory)

- Tolerance for F random independent failures
  * memory errors, hard-drive crash, ...
  * Requires `2F + 1` replicas
- Failed replica can stop without generating outputs
  * Only `F + 1` replicas required
  * ... no existing systems achieve this limit
- [Byzantine failures](https://en.wikipedia.org/wiki/Byzantine_fault_tolerance)
  * random, spurious faults => `2F + 1`
  * malicious, intelligent attacks => `3F + 1`

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

## DApps type II and the Bitcoin blockchain

- Embed additional data to DApp type I transactions
- Bitcoint [OP_RETURN](https://bitcoin.org/en/developer-reference#term-op-return) code
  * Provably prune-able outputs
  * Bitcoin miners will have the option to prune those data

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

## Wrapping Up

- Thank you for coming!
- We'd love your feedback: [bit.ly/blockstack-cuba-feedback](http://bit.ly/blockstack-cuba-feedback)



