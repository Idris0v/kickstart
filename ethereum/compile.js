const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const outputPath = path.resolve(__dirname, 'build');

fs.removeSync(outputPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf-8');
const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(outputPath);

for (const contract in output) {
    if (Object.hasOwnProperty.call(output, contract)) {
        fs.outputJSONSync(
            path.resolve(outputPath, contract.replace(':', '') + '.json'),
            output[contract]
        );
    }
}
