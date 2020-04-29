import {accessToken} from "./AccessToken";
import {dbManager} from "./DatabaseManager";
import {ChatManager} from "./ChatManager";
import chalk from "chalk";

const chatManager = new ChatManager(accessToken.get(), '@anon_bot_channel');
dbManager.setDefaults()
chatManager.startPolling().then(() => console.log(chalk.red('polling has started')))