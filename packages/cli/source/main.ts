import "dotenv/config";

import { Command } from "commander";
import pull from "./commands/pull";
import push from "./commands/push";

const program = new Command();

program.name("monjardin").version("1.0.0");

program
  .command("pull")
  .description("Fetch pictures from cloud")
  .action(() => pull());

program
  .command("push")
  .description("Sync pictures to cloud")
  .action(() => push());

program.parse();
