const FurnitureModel = require('../models/furnitureModel')
const FurnitureStock = require('../models/furnitureStock')

const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  FurnitureModel.find({})
  .then(allModels => {
    let allModelsDisplay = []
    if (allModels){
      allModelsDisplay = allModels.map(model => {
        let allStock = FurnitureStock.find({furnitureModel: model.id})
        let displayModel = model.push({stocks: allStock})
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
    res.redirect(`/inventories`
    // res.redirect(`inventories/models/${model.itemCode}`
    )
  }, err => res.direct('/models/new'))
})


router.get('/:itemCode', (req, res) => {
  const itemCode = req.params.itemCode
  FurnitureModel.find({itemCode: itemCode})
  .then(model => {
    let modelId = model.id
    FurnitureStock.find({furnitureModel: modelId})
    .then(furniturestocks => {
      res.render('inventory/modelInfor', {
        model, furniturestocks
      })
    })
  })
})





module.exports = router
