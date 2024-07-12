import * as Realm from 'realm-web';
import * as utils from './utils';
let App;
const ObjectId = Realm.BSON.ObjectID;
// Define the Worker logic
const worker = {
    async fetch(req, env) {
        const url = new URL(req.url);
        App = App || new Realm.App(env.ATLAS_APPID);
        const path = url.pathname.replace(/[/]$/, '');
        const id = url.searchParams.get('id') || '';
        const credentials = Realm.Credentials.anonymous();
        var user = await App.logIn(credentials);
        var client = user.mongoClient("mongodb-atlas");
        const collection = client.db("maho").collection("connections");

        try {
            if (path == '/post') {
                const uri = url.searchParams.get('uri') || '';
                await collection.insertOne({
                    _id: id,
                    uri: uri
                })
                return utils.reply('ok');
            }
            // Grab a reference to the "cloudflare.todos" collection
            if (path == '/uri') {
                return utils.reply(await collection.findOne({
                    _id: id
                }));
            }
        } catch (err) {
            const msg = err.message || 'Error with query.';
            return utils.toError(msg, 500);
        }
    }
};
// Export for discoverability
export default worker;
