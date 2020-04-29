import {accessToken} from "./AccessToken";
import {BotTests} from "./BotTests";
import {dbManager} from "./DatabaseManager";
import {ChatManager} from "./ChatManager";

const appTests = new BotTests(accessToken.get(), '@anon_bot_channel');
const chatManager = new ChatManager(accessToken.get(), '@anon_bot_channel');
appTests.execute()
    .then(() => dbManager.setDefaults())
    .then(() => chatManager.startPolling())