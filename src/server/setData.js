const mongoose = require('mongoose');

function setData(app, CollectionScheme, bodyParser){
    const Collection = mongoose.model('markers', CollectionScheme);

    app.post('/addmarker', async (req, res) =>{
      try{
        const newDoc = new Collection(req.body);
        await newDoc.save();
        res.sendStatus(200);
      }catch(err){
        console.log(err);
        res.sendStatus(500);
      }
    })

}

module.exports = setData;