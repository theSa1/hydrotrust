const fs = require("fs");
const solc = require("solc");

const source = fs.readFileSync("MyContract.sol", "utf8");

const input = {
  language: "Solidity",
  sources: {
    "MyContract.sol": { content: source },
  },
  settings: {
    evmVersion: "paris",
    outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

const contract = output.contracts["MyContract.sol"]["HydrogenSubsidyContract"];
console.log("ABI:", JSON.stringify(contract, null, 2));
fs.writeFileSync("MyContractABI.json", JSON.stringify(contract.abi, null, 2));
fs.writeFileSync("MyContractBytecode.txt", contract.evm.bytecode.object);

console.log("Compiled!");
