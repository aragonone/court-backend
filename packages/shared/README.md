# Court Backend shared

This repo provides a set of JavaScript components shared by all of the repos contained in this mono-repo.

### Models

It provides a set of JS classes to encapsulate certain web3 behavior shared among all the repos:

#### Artifacts

This JS class is in charge of providing JS wrappers for smart contracts (a.k.a. contract artifacts). 
It provides two flavors of artifacts, one [`dynamic`](./models/artifacts/DynamicArtifacts.js) and another one [`static`](./models/artifacts/StaticArtifacts.js), following the same interface. 
The difference is that the dynamic one will load the contract schemas lazily, while the static one will load all of them before hand.     

#### Court

This JS class is intended to be a JS wrapper exposing all the functionality required to interact with an Aragon Court instance. It basically encapsulates all the complexity behind its different smart contracts, exposing a single interface.
This class is used by all the projects of the Aragon Court back-office to interact with a court instance.  

#### Environments

This JS class is in charge of providing all the web3 commonly used components in a web3 application like: a web3 instance, a web3 provider, an artifacts object, the default sender, and some other particular entities like a court instance, a court subgraph, among others.
It also provides two different flavors of environments, one for [`browser`](./models/evironments/BrowserEnvironment.js) and another one based on [`Truffle configs`](./models/evironments/TruffleEnvironment.js). 
The first one is only used by the back-office frontend app where all the components mentioned above are built based on a browser web3 provider like `Metamask`, while the second one is used by all the other back-office projects (`cli`, `server`, and `services`) where all these components are derived from a Truffle config file. 

### Helpers

It provides the following helper functions:
- [`email-client`](./helpers/email-client.js): Handles sending emails through Postmark
- [`gas-price-oracle`](./helpers/gas-price-oracle.js): Get gas price oracle object used to know the current gas prices being paid on each network
- [`get-wallet-from-pk`](./helpers/get-wallet-from-pk.js): Decode Ethereum address based on a private key
- [`logger`](./helpers/logger.js): Logger object that provides a friendly interface for fancy logging 
- [`numbers`](./helpers/numbers.js): BigNumber-related helper functions
- [`sleep`](./helpers/sleep.js): Sleep function to wait a number of seconds 
- [`times`](./helpers/times.js): Time constants for using with `Date()`
- [`voting`](./helpers/voting.js): Utils related to the CR Voting module of Aragon Court
