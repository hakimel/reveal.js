
## Skycoin client libraries
#### Foundations of 3rd generation DApps

----------------

#### These slides: [slides.cuban.tech/skycoin.api.node.html](http://slides.cuban.tech/skycoin.libs.html)

----------------

### Wifi Info

Network: cubantech

Password: meet-ups

---

## Outline

- Skycoin Ecosystem
- Understanding API sets
- Node REST API endpoints
- Open API specs

--

[![Skycoin logo](img/Skycoin-Cloud-BW-Vertical.png)](http://www.skycoin.net)

- Wallets
  * Desktop (Electron), Android, iOS
- Exchange integrations
- CX programming language
  * Smart contracts
- DApps

---

## Skycoin core libraries

- Transpiled
  * go src => transpiler => lang X src => ...
  * e.g. skycoin-lite
  * need maintenance
- Crypto API
  * go src => cgo => binary + header => ...
- REST API
  * go annotations => swagger => spec => lang X src => ...

---

## What are API sets?

- Groups API endpoints
- Related in intent
- Enabled / disabled at once via CLI
  * `--enable-api-sets`
  * `-disable-api-sets`
  * `-enable-all-api-sets``

---

## Skycoin 0.25.1 API sets 

- `READ` - Query data. Read only.
- `STATUS` - A subset of `READ` exposing node status
  * Application
  * Network
  * Blockchain
- `PROMETHEUS` - Node metrics in Prometheus text format

---

## Skycoin 0.25.1 API sets 

- `TXN` - Transaction ops (no wallet)
- `WALLET` - Local wallet files
- `NET_CTRL` - Network admin
- `INSECURE_WALLET_SEED` - BIP39 mnemonic
  * Used by desktop wallet only

---

## Other projects 

- Skywire
- Hardware wallet daemon
- CXO
- DApps (BBS, ...)

---

## What's next?

- Next meetup : Skycoin projects explained !!!
- Telegram community : [https://t.me/Skycoin](https://t.me/Skycoin)
- Website: [https://www.skycoin.net](https://www.skycoin.net)
- Development - [https://github.com/skycoin](https://github.com/skycoin)
- News Channel: [https://t.me/skycoinnews](https://t.me/skycoinnews)
- Twitter: [https://twitter.com/Skycoinproject](https://twitter.com/Skycoinproject)
- Support: [https://t.me/skycoinsupport](https://t.me/skycoinsupport)

---

# Thank you for coming!

#### Questions?


