const Benchmark = require("benchmark");
const benchFs = require("fs");
const zlib = require("zlib");
const simdjsonbenchmark = require("../index");

const examplePath = `${__dirname}/../jsonexamples`;
const benchJsonExamples: any = {
  apache_builds: benchFs.readFileSync(`${examplePath}/apache_builds.json`, `utf-8`),
  canada: benchFs.readFileSync(`${examplePath}/canada.json`, `utf-8`),
  citm_catalog: benchFs.readFileSync(`${examplePath}/citm_catalog.json`, `utf-8`),
  github_events: benchFs.readFileSync(`${examplePath}/github_events.json`, `utf-8`),
  gsoc_2018: benchFs.readFileSync(`${examplePath}/gsoc-2018.json`, `utf-8`),
  instruments: benchFs.readFileSync(`${examplePath}/instruments.json`, `utf-8`),
  marine_ik: benchFs.readFileSync(`${examplePath}/marine_ik.json`, `utf-8`),
  mesh_pretty: benchFs.readFileSync(`${examplePath}/mesh.pretty.json`, `utf-8`),
  mesh: benchFs.readFileSync(`${examplePath}/mesh.json`, `utf-8`),
  numbers: benchFs.readFileSync(`${examplePath}/numbers.json`, `utf-8`),
  random: benchFs.readFileSync(`${examplePath}/random.json`, `utf-8`),
  // 190MB file, compressed to 21MB
  sf_citylots: zlib.gunzipSync(benchFs.readFileSync(`${examplePath}/sf_citylots.json.gz`)).toString(),
  twitter: benchFs.readFileSync(`${examplePath}/twitter.json`, `utf-8`),
  twitterescaped: benchFs.readFileSync(`${examplePath}/twitterescaped.json`, `utf-8`),
  update_center: benchFs.readFileSync(`${examplePath}/update-center.json`, `utf-8`),
}

const Bsuite = new Benchmark.Suite();

let fileName: any, jsonStr: any;
for ([fileName, jsonStr] of Object.entries(benchJsonExamples)) {
  Bsuite.add(`${fileName}.json#simdjson`, function(){
    simdjsonbenchmark.lazyParse(jsonStr);
  })
  Bsuite.add(`${fileName}.json#JSON`, function(){
    JSON.parse(jsonStr);
  })
}

Bsuite
  .on(`cycle`, function(event: { target: { times: { period: number; }; }; }) {
    console.log(`${event.target} => ${(event.target.times.period * 1000).toFixed(3)}ms`)
  })
  .on(`complete`, function(this: any): any {
    const columns = [
      `filename`,
      `filesize (MB)`,
      `JSON.parse(ms)`,
      `simdjson.lazyParse (ms)`,
      `JSON.parse (GB/s)`,
      `simdjson.lazyParse (GB/s)`,
      `X faster`,
    ];

    console.log(``);
    console.log(`| ${columns.join(` | `)} |`);
    // filename is left aligned, numbers are right aligned
    console.log(`| ${columns.map(col => col === `filename` ? `:--` : `--:`).join(` | `)} |`)

    let benches: any;
    benches = this.filter(() => true);
    for (var i = 0; i < benches.length; i+=2) {
      const fileName = benches[i].name.split(`#`)[0];
      const fileSize = Buffer.byteLength(benchJsonExamples[fileName.split(`.`)[0]]) / 1e6;
      const jsonParseMs = benches[i + 1].times.period * 1000;
      const simdLazyParseMs = benches[i].times.period * 1000;
      const jsonParseGbps = fileSize / jsonParseMs;
      const simdjsonLazyParseGbps = fileSize / simdLazyParseMs;
      const xFaster = jsonParseMs / simdLazyParseMs;
      const row = [
        fileName,
        fileSize.toFixed(2),
        jsonParseMs.toFixed(3),
        simdLazyParseMs.toFixed(3),
        jsonParseGbps.toFixed(2),
        simdjsonLazyParseGbps.toFixed(2),
        xFaster.toFixed(2),
      ];

      console.log(`| ${row.join(` | `)} |`);
    }
  })
  .run({async: false });

