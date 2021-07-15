import "dotenv/config";

import { Command } from "commander";
import React from "react";
import { render } from "ink";

import { addOptions } from "./helpers/cli/options";

import { SyncCommand } from "./commands/sync";
import { StatusCommand } from "./commands/status";

const program = new Command();

program.version("1.0.0");
const options = addOptions(program);

program
  .command("sync")
  .description("Sync contents of folder with cloud")
  .action(() => {
    render(<SyncCommand options={options}></SyncCommand>);
  });

program
  .command("status")
  .description("Status of cloud directory")
  .action(() => {
    render(<StatusCommand options={options}></StatusCommand>);
  });

program.parse();
