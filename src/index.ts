#!/usr/bin/env node

import { Command } from '@commander-js/extra-typings';

const cli = new Command()
  .name("git-repo-mover")
  .version('0.0.1')
  .description('Move git repos around!');

const apply = new Command()
  .name("apply")
  .description("Applies the given configuration.")
  .option("-c, --config-path", "The path to the configuration file.", "./config.yaml")
  .action((_, opts) => {  
    console.log(opts.opts().configPath)
  });

cli.addCommand(apply)
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  cli.outputHelp();
}

// else if (program.runAll) {
//   doStuff({
//     outputFolder: outFolder,
//     showBrowser: program.showBrowser,
//     performDownload: true
//   });
// }
// else {
//   doStuff({
//     outputFolder: outFolder,
//     showBrowser: program.showBrowser,
//     performDownload: program.downloadNewEpisodes
//   });
// }