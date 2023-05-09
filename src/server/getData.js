const path = require('path');

function getData(app, mongoose, MarkersScheme, UsersScheme, MessagesScheme){
  const Collection = mongoose.model('markers', MarkersScheme)
  const MsgCollection = mongoose.model('messages', MessagesScheme);
  const UsersCollection = mongoose.model('users', UsersScheme);
  
  // app.get('/annoucement/:id', async (req, res) => {
  //   try {
  //     res.sendFile(path.join(__dirname, 'public', 'index.html'));
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).send('Wystąpił błąd');
  //   }
  // })

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
  app.get('/avatar/:name', async (req, res) =>{
    const name = req.params.name;
    try{
      const user = await UsersCollection.findOne({nickname: name}); 
      const imageData = user.avatar.split(',')[1];
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
  app.get('/userAnnouncement/:email', async (req, res) =>{
    const email = req.params.email;
    try{
        const ann = await Collection.find({addedBy: email});
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
  app.get('/checkSession', (req, res) => {
    const user = req.session.user;
    if (user && user.isLoggedIn) {
        res.send(user);
    } else {
        res.status(401).send('Użytkownik nie jest zalogowany');
    }
  });

  app.get('/checkPermission/:id', async (req, res) =>{
    const id = req.params.id;
    const email = req.session.user.email;

    try {
      const doc = await Collection.findOne({id: id, addedBy: email});
      if (!doc) {
        res.sendStatus(404);
        console.log("Nie znalazłem odpowiedniego elementu");
        return;
      }
      res.sendStatus(204);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get('/check-messages/:from/:to', async (req, res) =>{
    const from = req.params.from;
    const to = req.params.to;

    try{
      let messages = await MsgCollection.findOne({from: from, to: to});
      if(!messages){
        messages = await MsgCollection.findOne({from: to, to: from});
        if(!messages){
          res.sendStatus(404);
          console.log("Brak wiadomości");
          return
        }
      }
      res.json(messages.messages);

    }catch(err){
      res.status(500).send(err);
    }
  })

  app.get('/show-friends/:name', async (req, res) =>{
    const name = req.params.name;
    try{
      const user = await UsersCollection.findOne({nickname: name});
      const userFriends = user.friends;
      res.setHeader('Content-Type', 'application/json');
      res.json(userFriends);
    }catch(error){
      res.status(500).send(error);
    }
  })

  app.get('/check-if-friends/:name', async (req, res) =>{
    const name = req.params.name;
    const nickname = req.session.user.nickname;
    try {
      const user = await UsersCollection.findOne({nickname: nickname});
      if(user.friends && user.friends.includes(name)){
        res.status(200).send(true);
      }else{
        res.status(200).send(false);
      }
    } catch(err){
      console.error(err);
      res.status(500).send(err);
    }
  })

}

module.exports = getData;