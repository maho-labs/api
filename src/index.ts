import * as Realm from "realm-web";
import * as utils from "./utils";

// The Worker's environment bindings. See `wrangler.toml` file.
interface Bindings {
  // MongoDB Atlas Application ID
  ATLAS_APPID: string;
}

// Define type alias; available via `realm-web`
type Document = globalThis.Realm.Services.MongoDB.Document;

// Declare the interface for a "todos" document
interface Todo extends Document {
  owner_id: string;
  done: boolean;
  todo: string;
}

let App: Realm.App;

// Define the Worker logic
const worker: ExportedHandler<Bindings> = {
  async fetch(req, env) {
    const url = new URL(req.url);
    App = App || new Realm.App(env.ATLAS_APPID);

    const path = url.pathname.replace(/[/]$/, "");
    const id = url.searchParams.get("id") || "";
    const credentials = Realm.Credentials.anonymous();
    var user = await App.logIn(credentials);
    var client = user.mongoClient("mongodb-atlas");
    const collection = client.db("maho").collection("connections");

    try {
      if (path == "/post") {
        const uri = url.searchParams.get("uri") || "";
        await collection.insertOne({
          _id: id,
          uri: uri,
        });
        return utils.reply("ok");
      }
      // Grab a reference to the "cloudflare.todos" collection
      if (path == "/uri") {
        return utils.reply(
          await collection.findOne({
            _id: id,
          })
        );
      }

      return utils.reply("route not found");
    } catch (err) {
      const msg = (err as Error).message || "Error with query.";
      return utils.toError(msg, 500);
    }
  },
};

// Export for discoverability
export default worker;
