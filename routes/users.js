var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var crypto = require('crypto');
var email = require('emailjs');
var async = require('async');

module.exports = function (app) {
  'use strict';

  var config = app.get('config');
  var jwtSecret = config.JWT_SECRET;

  app.get('/api/users/current', function (req, res) {
    if (!req.user || !req.user.id) {
      return res.status(503).end();
    }
    Users.findById(req.user.id).lean().exec(function (err, user) {
      if (err) {
        return res.status(503).end(err);
      }

      if (!user) {
        return res.status(401).end('user not found');
      }

      res.send(user);
    })
  });

  app.post('/api/users/register', function (req, res, next) {
    var body = req.body;

    if (!body.password || !body.email || !body.name) {
      return res.status(400).end('Заповнено не всі обов\'язкові поля.');
    }

    Users.findOne({
      'email': body.email
    }, function (err, user) {
      if (err) {
        return res.status(400).end(err);
      }

      if (user) {
        return res.status(400).end('Ви вже зареєстровані, перейдіть на сторінку авторизації');
      }

      var newUser = new Users({
        name: body.name,
        email: body.email,
        password: md5(body.password)
      });

      newUser.save(function (err, user) {
        if (err) {
          return res.status(400).end(err);
        }
        user = user.toObject();
        delete user.password;
        req.userData = user;

        afterRegEmail(user);

        next();
      });
    });
  }, auth);

  app.post('/api/users/login', function (req, res, next) {
    var body = req.body;

    if (!body.email || !body.password) {
      return res.status(400).end('Заповнено не всі обов\'язкові поля.');
    }

    Users.findOne({
      email: body.email,
      password: md5(body.password)
    }).lean().exec(function (err, user) {
      if (err) {
        return res.status(503).end(err);
      }

      if (!user) {
        return res.status(401).end('Ви ще не зареєстровані або не правильно ввели дані.');
      }

      req.userData = user;
      next();
    })
  }, auth);

  app.get('/api/users', function (req, res) {
    Users.find().lean().exec(function (err, users) {
      res.json({error: err, users: users});
    });
  });

  app.delete('/api/users/:id', function (req, res) {
    Users.remove({_id: req.params.id}).exec(function (err) {
      res.json({error: err});
    });
  });

  app.put('/api/users/addPerson', function (req, res) {
    Users.findByIdAndUpdate(req.user.id, {
      $push: {
        guests: req.body
      }
    }, function (err, user) {
      res.json({error: err, user: user});
    });
  });

  app.put('/api/users/removePerson', function (req, res) {
    Users.update({email: req.user.email}, {
      $set: {guests: req.body.guests}
    }).exec(function (err, user) {
      res.json({error: err, user: user});
    });
  });

  app.put('/api/users/checkPerson', function (req, res) {
    Users.findOneAndUpdate({email: req.user.email, 'guests.name': req.body.name}, {
      $set: {
        'guests.$.status': req.body.status
      }
    }, function (err, user) {
      res.json({error: err, user: user});
    });
  });

  app.put('/api/users/checkMe', function (req, res) {
    Users.findOneAndUpdate({email: req.user.email}, {
      $set: {
        'status': req.body.status
      }
    }, function (err, user) {
      res.json({error: err, user: user});
    });
  });

  function auth(req, res) {
    var user = req.userData;
    var token = jwt.sign({
      email: user.email,
      id: user._id
    }, jwtSecret);
    res.send({
      token: token,
      user: user
    });
  }

  function md5(string) {
    return crypto.createHash('md5').update(string).digest('hex');
  }

  app.post('/api/sendEmail', function (req, res) {
    Users.find().lean().exec(function (err, users) {
      if (!err) {
        async.eachSeries(users, function (user, cb) {
          var server = email.server.connect({
            user: config.EMAIL,
            password: config.EMAIL_PASS,
            host: 'smtp.gmail.com',
            ssl: true
          });

          server.send({
            text: req.body.text || '',
            from: "telnov.com <mail@telnov.com>",
            to: user.email,
            subject: req.body.subject || ''
          }, function () {
            cb();
          });
        }, function () {
          res.json({error: null});
        });
      }
    })
  });

  function afterRegEmail(user) {
    var server = email.server.connect({
      user: config.EMAIL,
      password: config.EMAIL_PASS,
      host: 'smtp.gmail.com',
      ssl: true
    });

    var name = user.name;
    var mess = 'Шановний(а) ' + name + '.<br />' +
      'Дякуємо, що зареєструвалися на нашому сайті.<br />' +
      'Для того, аби нам було простіше готуватися до нашого свята, велике прохання до вас якомога швидше виконати кілька наступних кроків.<br />' +
      '1) Нам дуже важливо знати точну кількість гостей.<br />' +
      'Тому у розділі “Гості” на сайті додайте будь ласка ваших супутників на святі, які точно будуть присутніми (ваша половинка та діти).<br />' +
      '2) Якщо ви вирішили зробити нам один або кілька подарунків, перерахованих  у розділі “Вішліст”, обов’язково відмітьте його(їх), натиснувши на чекбокс.<br />' +
      'Обов’язково зніміть виділення, якщо ви натиснули випадково. Тому що в іншому випадку, його не зможе обрати інший гість.<br /><br />' +
      'Наразі це все, з нетерпінням чекаємо нашої зустрічі. Якщо матимемо свіжі новини обов’язково повідомимо вас.<br />' +
      'Так само і ви пишіть, телефонуйте нам, якщо маєте запитання чи пропозиції.<br />' +
      'Хорошого вам дня.<br />' +
      'Сашко та Аня.<br /><br /><br />' +
      'Уважаемый(ая) ' + name + '.<br />' +
      'Спасибо, что зарегистрировались на нашем сайте.<br />' +
      'Для того, чтобы нам было проще готовиться к нашему празднику, большая просьба к вам как можно скорее выполнить несколько следующих шагов.<br />' +
      '1) Нам очень важно знать точное количество гостей.<br />' +
      'Поэтому в разделе “Гости” на сайте добавьте, пожалуйста, ваших спутников на празднике, которые точно будут присутствовать (Ваша половинка и дети).<br />' +
      '2) Если вы решили сделать один или несколько подарков, перечисленных в разделе “Вишлист”, обязательно отметьте его(их), нажав на чекбокс.<br />' +
      'Обязательно снимите выделение, если вы нажали случайно. Потому что в противном случае, его не сможет выбрать другой гость.<br /><br />' +
      'Пока это все, с нетерпением ждем нашей встречи. Если у нас еще будут новости, то мы обязательно сообщим вам.<br />' +
      'Пишите, звоните и вы нам, если есть какие-то вопросы или предложения.<br />' +
      'Хорошего вам дня.<br />' +
      'Саша и Аня.';

    server.send({
      from: "telnov.com <mail@telnov.com>",
      to: user.email,
      subject: 'telnov.com',
      attachment: [{data: mess, alternative: true}]
    }, function () {

    });
  }
};
