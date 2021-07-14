import "dotenv/config";

import { Command } from "commander";
import React from "react";
import { render } from "ink";

import { addOptions } from "./helpers/cli/options";

import { PushCommand } from "./commands/push";
import { StatusCommand } from "./commands/status";

const program = new Command();

program.version("1.0.0");
const options = addOptions(program);

program
  .command("push")
  .description("Sync contents of folder with cloud")
  .action(() => {
    render(<PushCommand options={options}></PushCommand>);
  });

program
  .command("status")
  .description("Status of cloud directory")
  .option("-d, --detail", "Detailed status", false)
  .action((statusOptions) => {
    render(
      <StatusCommand
        detail={statusOptions.detail}
        options={options}
      ></StatusCommand>
    );
  });

program.parse();
