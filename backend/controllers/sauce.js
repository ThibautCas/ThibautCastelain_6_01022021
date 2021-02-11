const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Sauce saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    { 
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    if (req.file) {
      Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {})
    })
        .catch(
          (error) => {
            res.status(500).json({
              error: error
            });
          })
      }
  Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
  .then(
    () => {
      res.status(200).json({
        message: 'Sauce updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
  .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({_id: req.params.id}).then(
        () => {
          res.status(200).json({
            message: 'Sauce Deleted!'
          });
        }
      ).catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
      );
    })
  })
  .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.updateLike = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
  .then(sauce => {
        
    switch (req.body.like) {              
        
        case -1:                                               
            Sauce.updateOne({ _id: req.params.id }, {           
                $inc: {dislikes:1},                             
                $push: {usersDisliked: req.body.userId},       
                _id: req.params.id
            })
                .then(() => res.status(201).json({ message: 'Dislike ajouté !'}))
                .catch( error => res.status(400).json({ error }))
            break;
            
        case 0:                                                                 
            if (sauce.usersLiked.find(user => user === req.body.userId)) {      
                Sauce.updateOne({ _id : req.params.id }, {                     
                    $inc: {likes:-1},                                           
                    $pull: {usersLiked: req.body.userId},                       
                    _id: req.params.id
                })
                    .then(() => res.status(201).json({message: 'Like retiré !'}))
                    .catch( error => res.status(400).json({ error }))
            }
            if (sauce.usersDisliked.find(user => user === req.body.userId)) {   
                Sauce.updateOne({ _id : req.params.id }, {                      
                    $inc: {dislikes:-1},                                       
                    $pull: {usersDisliked: req.body.userId},                  
                    _id: req.params.id
                })
                    .then(() => res.status(201).json({message: 'Dislike retiré !'}))
                    .catch( error => res.status(400).json({ error }));
            }
            break;
        
        case 1:                                                                 
            Sauce.updateOne({ _id: req.params.id }, {                           
                $inc: { likes:1},                                              
                $push: { usersLiked: req.body.userId},                          
                _id: req.params.id
            })
                .then(() => res.status(201).json({ message: 'Like ajouté !'}))
                .catch( error => res.status(400).json({ error }));
            break;

        default:                                                                
            return res.status(500).json({ error });
    }
})
  .catch(error => {res.status(500).json({error: error})})
}