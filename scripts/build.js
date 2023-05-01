const fs = require("fs");

const file = JSON.parse(
    fs.readFileSync(
      `${__dirname}/../build/contracts/SupplyChain.json`
    )
);

file.gas = 3000000;

fs.writeFileSync(
  `${__dirname}/../caliperWorkspace/src/SupplyChain.json`,
  JSON.stringify(file, null, 2)
);



