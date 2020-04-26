import {accessToken} from "./AccessToken";
import {BotTests} from "./BotTests";

const appTests = new BotTests(accessToken.get(), '@anon_bot_channel');
appTests.execute()
