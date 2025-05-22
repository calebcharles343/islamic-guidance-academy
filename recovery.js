const { MongoClient } = require("mongodb");

async function recoverWithStableConnection() {
  const uri =
    "mongodb+srv://murshidu075:Olayiwola555314@cluster0.f7kpb.mongodb.net/IslamicGuidance?retryWrites=true&w=majority&appName=Cluster0";

  const client = new MongoClient(uri, {
    connectTimeoutMS: 60000,
    socketTimeoutMS: 60000,
    serverSelectionTimeoutMS: 60000,
    retryWrites: true,
    retryReads: true,
  });

  try {
    console.log("Establishing connection...");
    await client.connect();
    console.log("Connection successful!");

    const localDb = client.db("local");
    const islamicGuidanceDb = client.db("IslamicGuidance");

    // 1. Verify oplog access
    // const oplogCount = await islamicGuidanceDb
    //   .collection("oplog.rs")
    //   .countDocuments();
    // console.log(`Oplog contains ${oplogCount} operations`);

    const allStationOps = await islamicGuidanceDb
      .collection("oplog.rs")
      .find({ ns: "IslamicGuidance.stations" })
      .sort({ ts: -1 })
      .limit(10)
      .toArray();

    console.log("Recent station operations:", allStationOps);

    const collectionInfo = await client
      .db("IslamicGuidance")
      .listCollections({ name: "stations" })
      .toArray();

    console.log("collectionInfo:", collectionInfo);

    if (collectionInfo.length === 0) {
      console.log("Collection was DROPPED (not just documents deleted)");
      // Check oplog for drop operation
      const dropOp = await localDb
        .collection("oplog.rs")
        .find({ ns: "IslamicGuidance", op: "c", "o.drop": "stations" })
        .next();
    }

    // 2. Find station deletions
    const deletions = await islamicGuidanceDb
      .collection("oplog.rs")
      .find({
        ns: "IslamicGuidance.stations",
        op: "d",
        ts: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      })
      .sort({ ts: -1 })
      .toArray();

    console.log(`Found ${deletions.length} deletion events`);

    // 3. Recovery logic...
    if (deletions.length > 0) {
      console.log("Starting recovery...");
      // Insert your recovery logic here
    } else {
      console.log("No recent deletions found in oplog");
    }
  } catch (error) {
    console.error("Operation failed:", error);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

recoverWithStableConnection();
