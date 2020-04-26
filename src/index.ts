import {accessToken} from "./AccessToken";
import {BotTests} from "./BotTests";
import {dbManager} from "./database/DatabaseManager";

//const appTests = new BotTests(accessToken.get(), '@anon_bot_channel');
//appTests.execute()
dbManager.SetDefaults();
//dbManager.addUserToWhitelist('@vasya')
//dbManager.removeUserFromWhilelist('@dima')
//const res = dbManager.userInWhitelist('@vasya')
//console.log(res)
dbManager.addChatAdmin('@dshuran')
