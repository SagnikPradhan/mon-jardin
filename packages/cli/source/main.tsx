import "dotenv/config";

import { Command } from "commander";
import React from "react";
import { render } from "ink";

import { addOptions } from "./helpers/cli/options";
import { PushCommand } from "./commands/push";

const program = new Command();

program.version("1.0.0");
const options = addOptions(program);

program
  .command("push")
  .description("Sync contents of folder with cloud")
  .action(() => {
    render(<PushCommand options={options}></PushCommand>);
  });

program.parse();
