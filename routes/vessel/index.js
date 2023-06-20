const Sequelize = require('sequelize');
const { Op } = require("sequelize");
const routes = require('express').Router();
const { Vessel } = require("../../models");
//const { Voyage } = require('./functions/Associations/vesselAssociations');
const { Voyage } = require('../../functions/Associations/vesselAssociations');

routes.post("/create", async(req, res) => {
    try {
      const exists = await Vessel.findOne({
        where: {
        [Op.or]: [
          {name:Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')),'LIKE','%'+req.body.data.name.toLowerCase() + '%')},
          {code:req.body.data.code}
        ]}
      });
      if(exists){
        res.json({status:'exists'});
      } else {
        const result = await Vessel.create(req.body.data);
        res.json({status:'success', result:result});
      }
    }
    catch (error) {
      res.json({status:'error', result:error});
    }
});

routes.get("/getVessels", async(req, res) => {
    try {
      const result = await Vessel.findAll({
        order: [['createdAt', 'DESC']]
      });
      res.json({status:'success', result:result});
    }
    catch (error) {
      res.json({status:'error', result:error});
    }
});

routes.post("/findVoyages", async(req, res) => {
  try {
    console.log(req.body)
    const result = await Voyage.findAll({
      where:{
          VesselId:req.body.id ,
      }
    });
    res.json({status:'success', result:result});
  }
  catch (error) {
    res.json({status:'error', result:error});
  }
});

routes.post("/createVoyage", async(req, res) => {
  try {
    let data = req.body;
    delete data.id;
    const result = await Voyage.create(data);
    res.json({status:'success', result:result});
  }
  catch (error) {
    res.json({status:'error', result:error});
  }
});

routes.post("/editVoyage", async(req, res) => {
  try {
    let data = req.body;
    const result = await Voyage.update(data,{
      where:{id:data.id}
    });
    res.json({status:'success', result:result});
  }
  catch (error) {
    console.log(error)
    res.json({status:'error', result:error});
  }
});

routes.get("/get", async(req, res) => {
    try {
      const result = await Vessel.findAll({
        order: [['createdAt', 'DESC']]
      });
      res.json({status:'success', result:result});
    }
    catch (error) {
      res.json({status:'error', result:error});
    }
});

routes.post("/edit", async(req, res) => {
    try {
      const exists = await Vessel.findOne({
        where:{
            id:{ [Op.ne]: req.body.data.id },
            name:{ [Op.eq]: req.body.data.name}
        }
      });
      if(exists){
          res.json({status:'exists', result:exists});
      } else {
          await Vessel.update(req.body.data,{
            where:{id:req.body.data.id}
          });
          const result = await Vessel.findOne({where:{id:req.body.data.id}})
          res.json({status:'success', result:result});
      }
    }
    catch (error) {
      res.json({status:'error', result:error});
    }
});

module.exports = routes;