const mongoConf = require("../../core/mongo.core");

module.exports = async (req, res, next) => {
  try {
    const { name, age } = req.body;
    console.log(req)

    const db = mongoConf.db();
    const coll = await db.collection("test_collections");

    const writeResult = await coll.insertOne({
      name,
      age
    });

    res.status(200).json(writeResult.ops[0]);
  } catch (error) {
    next(error);
  }
};
