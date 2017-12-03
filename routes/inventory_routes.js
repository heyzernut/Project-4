const FurnitureModel = require('../models/furnitureModel')
const FurnitureStock = require('../models/furnitureStock')
const Location = require('../models/location')
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  FurnitureModel.find({})
  .then(allModels => {
    let allModelsDisplay = []
    if (allModels){
      allModels.forEach(model => {
        FurnitureStock.find({furnitureModel: model.id})
        .then(allStock => {
          let displayModel = {
            itemCode: model.itemCode,
            model: model.model,
            color: model.color,
            dimension: model.dimension,
            stocks: allStock,
            stocksAmt: allStock.length + 1
          }
          allModelsDisplay.push(displayModel)
        })



      })
    }
    res.render('inventory/index', {
      allModelsDisplay})
    }
  )}
)


router.get('/models/new', (req, res) => {
  res.render('inventory/modelsNew')
})


router.post('/models/new', (req, res) => {
  const modelData = req.body.model
  let newModel = new FurnitureModel({
    itemCode: modelData.itemCode,
    model: modelData.model,
    color: modelData.color,
    dimension: modelData.dimension
  })
  newModel.save()
  .then(model => {
    console.log('model save')
    // res.redirect(`/inventories`
    res.redirect(`/inventories/models/${model.itemCode}`)
  }, err => res.direct('/models/new'))
})


router.get('/models/:itemCode', (req, res) => {
  const itemCode = req.params.itemCode
  FurnitureModel.find({itemCode : itemCode})
  .then(foundModel => {
    let furnitureModel = foundModel[0]
    let furnitureModelId = furnitureModel.id

    FurnitureStock.find({furnitureModel:  furnitureModelId})
    .populate('location')
    .then(furnitureStocks => {
      total = 0
      furnitureStocks.forEach(stock => {
        total += stock.quantity
      })
      res.render('inventory/modelInfor', {
        furnitureModel, furnitureStocks, total
      })
    })
    .catch(err => {
      res.render('inventory/modelInfor', {
        furnitureModel
      })
    })
  })
  .catch(err => { res.send('error') })
})

router.get('/models/:itemCode/newStock', (req, res) => {

  const itemCode = req.params.itemCode

  FurnitureModel.find({itemCode : itemCode})
  .then(foundModel => {
    let furnitureModel = foundModel[0]
    // res.render('inventory/modelsNewStock', {
    //   furnitureModel
    // })
    Location.find({})
    .then(locations => {
      res.render('inventory/modelsNewStock', {
        furnitureModel, locations
      })
    })
    .catch(err => {
      res.render('inventory/modelsNewStock', {
        furnitureModel
      })
    })
  })
  .catch(err => {res.send("error")})
})


router.post('/models/:itemCode/newStock', (req, res) => {
  const stockData = req.body.stock
  const itemCode = req.params.itemCode

  let newStock = new FurnitureStock({
    location: stockData.location,
    furnitureModel: stockData.furnitureModel,
    quantity: stockData.quantity,
  })
  newStock.save()
  .then(stock => {
    console.log('stock save')
    // res.redirect(`/inventories`
    res.redirect(`/inventories/models/${itemCode}`)

  }, err => res.direct(`/models/${itemCode}/newStock`))
})



module.exports = router
