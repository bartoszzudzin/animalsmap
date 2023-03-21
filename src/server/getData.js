const path = require('path');

function getData(app, mongoose, MarkersScheme){
  const Collection = mongoose.model('markers', MarkersScheme)
  
  app.get('/map', async (req, res) => {
    try {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } catch (err) {
      console.error(err);
      res.status(500).send('Wystąpił błąd');
    }
  })
  app.get('/search', async (req, res) => {
    try {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } catch (err) {
      console.error(err);
      res.status(500).send('Wystąpił błąd');
    }
  })
  app.get('/about', async (req, res) => {
    try {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } catch (err) {
      console.error(err);
      res.status(500).send('Wystąpił błąd');
    }
  })
  app.get('/map', async (req, res) => {
    try {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } catch (err) {
      console.error(err);
      res.status(500).send('Wystąpił błąd');
    }
  })
  app.get('/annoucement/:id', async (req, res) => {
    try {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } catch (err) {
      console.error(err);
      res.status(500).send('Wystąpił błąd');
    }
  })


  

  app.get('/markers', async (req, res) =>{
      try{
          const marker = await Collection.find({});
          res.json(marker);
      }catch(err){
          console.log(err);
      }
  })
  app.get('/image/:id', async(req,res) =>{
    const id = req.params.id;
    try{
      const marker = await Collection.findOne({id: id});
      const imageData = marker.image.split(',')[1];
      let buffer = Buffer.from(imageData, "base64");
      res.send(buffer)
    }catch(err){
      console.log(err);
    }
  })
  app.get('/getAnnoucement/:id', async (req, res) =>{
      const id = req.params.id;
      try{
          const ann = await Collection.findOne({id: id});
          res.json(ann);
      }catch(err){
          console.log(err);
      }
  })

  app.get('/search/:phrase', async (req, res) => {
      try {
        const tags = req.params.phrase.split(" ");
        console.log(tags);
        const queries = [];
    
        for (let i = 0; i < tags.length; i++) {
          queries.push(Collection.find({city: {$regex: tags[i], $options: 'i'}}));
          queries.push(Collection.find({street: {$regex: tags[i], $options: 'i'}}));
          queries.push(Collection.find({name: {$regex: tags[i], $options: 'i'}}));
          queries.push(Collection.find({race: {$regex: tags[i], $options: 'i'}}));
          queries.push(Collection.find({info: {$regex: tags[i], $options: 'i'}}));
        }
    
        const results = await Promise.all(queries);
        // Połącz wyniki zapytań w jedną tablicę
        const mergedResults = [].concat(...results);
        const filteredResults = mergedResults.filter((el, index, arr) => {
          return index === arr.findIndex((t) => t.id === el.id);
        });
        console.log("wynik =>",filteredResults);
        res.send(filteredResults);
      } catch (err) {
        console.log(err);
        res.sendStatus(500);
      }
  });
}

module.exports = getData;