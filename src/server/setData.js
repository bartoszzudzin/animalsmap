const mongoose = require('mongoose');
const express = require('express');

function setData(app, CollectionScheme, bodyParser, UsersScheme, MessagesScheme){
    const Collection = mongoose.model('markers', CollectionScheme);
    const UsersCollection = mongoose.model('users', UsersScheme);
    const MsgCollection = mongoose.model('messages', MessagesScheme);

  app.post('/addmarker', async (req, res) =>{
      try{
        const newDoc = new Collection(req.body);
        await newDoc.save();
        res.sendStatus(200);
      }catch(err){
        console.log(err);
        res.sendStatus(500);
      }
    });

  app.delete('/delete-marker/:id', async (req, res) =>{
      const id = req.params.id;
      const email = req.session.user.email;
      try {
        const doc = await Collection.findOne({id: id, addedBy: email});
        console.log("dock =>",doc);
        if (!doc) {
          res.sendStatus(404);
          console.log("Nie znalazłem odpowiedniego elementu")
          return;
        }
        await Collection.deleteOne({id: id, addedBy: email});
        res.sendStatus(204);
      } catch (err) {
        res.status(500).send(err);
      }
    });

  app.post('/adduser', async (req, res) =>{
      try{
        const emailExist = await UsersCollection.findOne({ email: req.body.email });
        if (emailExist) {
          res.status(400).json({ message: 'Adres e-mail jest już w użyciu' });
          return;
        }
        const nicknameExist = await UsersCollection.findOne({ nickname: req.body.nickname });
        if (nicknameExist) {
          res.status(400).json({ message: 'Nazwa użytkownika jest już zajęta' });
          return;
        }
        const newDoc = new UsersCollection(req.body);
        await newDoc.save();
        res.sendStatus(200);
      }catch(err){
        console.log(err);
        res.sendStatus(500);
      }
    })

  app.post('/login', async (req, res) => {
      const { email, password } = req.body;
  
      // Sprawdzenie czy użytkownik o podanych danych istnieje w bazie danych
      const user = await UsersCollection.findOne({ email: email, password: password });
  
      if (user) {
          // Ustawienie wartości sesji
          req.session.user = {
              email: email,
              nickname: user.nickname,
              isLoggedIn: true,
          };
  
          res.json({succes: true});
      } else {
          res.status(401).send('Błąd logowania');
      }
  });

  app.post('/logout', (req, res) => {
    // Usunięcie wartości sesji dla użytkownika
    req.session.destroy(err => {
      if (err) {
        console.error(err);
        res.status(500).send('Błąd serwera');
      } else {
        res.clearCookie('connect.sid'); // Usunięcie ciasteczka sesji
        res.send('Wylogowano pomyślnie');
      }
    });
  });

  app.post('/update-marker/:id', async (req, res) => {
    const id = req.params.id;
    const email = req.session.user.email;
    try {
      const element = await Collection.findOne({ id: id, addedBy: email });
      if (!element) {
        res.sendStatus(404);
        console.log("Nie znalazłem odpowiedniego elementu");
        return;
      }
      await Collection.findOneAndUpdate(
        { id: id, addedBy: email },
        {
          info: req.body.upInfo,
          character: req.body.upChar,
          contactPerson: req.body.upName,
          contactPhone: req.body.upPhone,
        },
        { new: true }
      );
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  });

  app.post('/update-name', async (req, res) =>{
    const email = req.session.user.email;
    try{
      const user = await UsersCollection.findOne({email: email});
      if(!user){
        res.sendStatus(404);
        console.log("Nie znaleziono użytkownika");
        return;
      }
      await UsersCollection.findOneAndUpdate(
        {email: email},
        {name: req.body.name},
        {new: true},
      );
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  });

  app.post('/update-password', async (req, res) =>{
    const email = req.session.user.email;
    try{
      const user = await UsersCollection.findOne({email: email});
      if(!user){
        res.sendStatus(404);
        console.log("Nie znaleziono użytkownika");
        return;
      }
      await UsersCollection.findOneAndUpdate(
        {email: email},
        {password: req.body.password},
        {new: true},
      );
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  });

  app.post('/update-avatar', async (req, res) =>{
    const email = req.session.user.email;
    try{
      const user = await UsersCollection.findOne({email: email});
      if(!user){
        res.sendStatus(404);
        console.log("Nie znaleziono użytkownika");
        return;
      }
      await UsersCollection.findOneAndUpdate(
        {email: email},
        {avatar: req.body.avatar},
        {new: true},
      );
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  })

  app.post('/send-message', async (req, res) =>{
    try{
      const name = req.body.from;
      console.log(req.body.message);
      let query = await MsgCollection.findOne({from: req.body.to, to: req.body.from});
      if(!query){
        query = await MsgCollection.findOne({from: req.body.from, to: req.body.to});
        if(!query){
          query = new MsgCollection(req.body);
          await query.save();
          const update = { $push: { messages: { from: req.body.from, message: req.body.message, date: req.body.date } } };
          const options = {upsert: true};
          await MsgCollection.updateOne(query, update, options);
          res.sendStatus(200);
          return;
        }
      }
      const update = { $push: { messages: { from: req.body.from, message: req.body.message, date: req.body.date } } };
      const options = {upsert: true};
      await MsgCollection.updateOne(query, update, options);
      res.sendStatus(200);

    }catch(err){
      console.log(err);
      res.sendStatus(500);
    }
  });

  app.post('/add-friend', async (req, res) =>{
    const name = req.body.to;
    const nickname = req.session.user.nickname;

    try{
      const user1 = await UsersCollection.findOne({ nickname: nickname });
      const user2 = await UsersCollection.findOne({ nickname: name });

      if (!user1) {
        console.log("user1 Nie znalazłem odpowiedniego elementu");
        res.status(404).send("Nie znaleziono elementu");
        return;
      }
      if (!user2) {
        console.log("user2 Nie znalazłem odpowiedniego elementu");
        res.status(404).send("Nie znaleziono elementu");
        return;
      }

      // const isFriendUser1 = await UsersCollection.findOne({friends: name});
      // const isFriendUser2 = await UsersCollection.findOne({friends: nickname});
      

      await UsersCollection.findOneAndUpdate(
          {nickname: nickname },
          { $addToSet: { friends: name } },
          { new: true }
        );
      await UsersCollection.findOneAndUpdate(
          {nickname: name },
          { $addToSet: { friends: nickname } },
          { new: true }
        );

        return res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  })
}

module.exports = setData;