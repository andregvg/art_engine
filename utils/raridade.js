const basePath = process.cwd();
const fs = require("fs");
const statsDir = `${basePath}/stats`;

//read jason data
let baseData = fs.readFileSync(`${basePath}/data/metadata.json`);
let data = JSON.parse(baseData);

let collectionSize = data.length;
let stats = {};

data.forEach((nft) => {
    let attributes = nft.attributes;

    attributes.forEach((attribute) => {
        let traitType = attribute.trait_type;
        let value = attribute.value ?? 'null';

        if (!stats[traitType]) {
            stats[traitType] = {}
        }

        if (!stats[traitType][value]) {
            stats[traitType][value] = {
                count: 0,
                rarity: 0,
            };
        }
        stats[traitType][value].count++;
        stats[traitType][value].rarity = 100*stats[traitType][value].count/collectionSize;

    });
});


const buildSetup = () => {
    if (fs.existsSync(statsDir)) {
        fs.rmSync(statsDir, { recursive: true });
    }
    fs.mkdirSync(statsDir);
};

const writeStats = () => {
    fs.writeFileSync(`${statsDir}/stats.json`, JSON.stringify(stats, null, 2));
}

buildSetup();
writeStats();