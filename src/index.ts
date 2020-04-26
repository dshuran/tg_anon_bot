import {accessToken} from "./AccessToken";
import {BotTests} from "./BotTests";
import {dbManager} from "./DatabaseManager";

const appTests = new BotTests(accessToken.get(), '@anon_bot_channel');
appTests.execute()