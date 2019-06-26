
## Librerías clientes de Skycoin
#### Bases de las DApps de 3era generación

----------------

#### Esta presentación: [slides.cuban.tech/skycoin.libs.html](http://slides.cuban.tech/skycoin.libs.html)

----------------

### Información para la Wifi

Red: cubantech

Contraseña: meet-ups

---

## Agenda

- Ecosistema Skycoin
- Comprendiendo los conjuntos de APIs
- Endpoints de la API REST de los nodos
- Especificaciones Open API

--

[![Logotipo Skycoin](img/Skycoin-Cloud-BW-Vertical.png)](http://www.skycoin.net)

- Billeteras
  * Escritorio (Electron), Android, iOS
- Integraciones para intercambios
- Lenguaje de programación CX
  * Contratos inteligentes
- DApps

---

## Librerías principales de Skycoin

- Transpiladas
  * código go => transpilador => código lenguaje X => ...
  * p.e. skycoin-lite
  * necesitan mantenimiento
- API de la criptomoneda
  * código go => cgo => binario + cabecera => ...
- API REST
  * anotaciones go => swagger => especificación => código lenguaje X => ...

---

## Qué son los conjuntos de APIs?

- Agrupan los endpoints de la API
- Tienen intensiones relacionadas
- Son habilitados / deshabilitados de una vez a través de la línea de comandos
  * `--enable-api-sets`
  * `-disable-api-sets`
  * `-enable-all-api-sets``

---

## Conjuntos de la API Skycoin 0.25.1

- `READ` - Interrogar datos. Solo lectura.
- `STATUS` - Subconjunto de `READ` que expone información sobre el estado del nodo
  * Aplicación
  * Red
  * Blockchain
- `PROMETHEUS` - Métricas del nodo en el formato de texto Prometheus

---

## Conjuntos de la API Skycoin 0.25.1

- `TXN` - Operaciones de transacción (sin billetera)
- `WALLET` - Archivos locales de la billetera
- `NET_CTRL` - Administración de la red
- `INSECURE_WALLET_SEED` - Mnemónico BIP39
  * Usado solo por la billetera de escritorio

---

## Otros proyectos

- Skywire
- Demonio de billetera por hardware
- CXO
- DApps (BBS, ...)

---

## ¿Próximo paso?

- Próximo encuentro : ¡¡¡ Explicaciones de los proyectos de Skycoin !!!
- Comunidad de Telegram : [https://t.me/Skycoin](https://t.me/Skycoin)
- Sitio web : [https://www.skycoin.net](https://www.skycoin.net)
- Desarrollo - [https://github.com/skycoin](https://github.com/skycoin)
- Canal de noticias : [https://t.me/skycoinnews](https://t.me/skycoinnews)
- Twitter : [https://twitter.com/Skycoinproject](https://twitter.com/Skycoinproject)
- Soporte : [https://t.me/skycoinsupport](https://t.me/skycoinsupport)

---

# ¡Gracias por participar!

#### ¿Preguntas?


