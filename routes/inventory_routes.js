const FurnitureModel = require('../models/furnitureModel')
const FurnitureStock = require('../models/furnitureStock')
const Location = require('../models/location')
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  FurnitureModel.find()
  .then(allModels => {
    var allModelsDisplay = []
    var promises = []
    allModels.forEach(model => {
      promises.push(FurnitureStock.find({furnitureModel: model.id})
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
      }))
    })

    Promise.all(promises)
    .then(() => {
      res.render('inventory/index', {
        allModelsDisplay
      })
      // res.json(allModelsDisplay)

    })
  })
})


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
    // res.redirect(`/inventory`
    res.redirect(`/inventory/models/${model.itemCode}`)
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
      // res.json({furnitureModel: furnitureModel,furnitureStocks: furnitureStocks,  total: total})

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

router.get('/models/:itemCode/edit', (req, res) => {
  const itemCode = req.params.itemCode
  FurnitureModel.find({itemCode : itemCode})
  .then(foundModel => {
    let furnitureModel = foundModel[0]
    res.render('inventory/modelsEdit', {
      furnitureModel
    })
  })
})

router.put('/models/:itemCode', (req, res) => {
  const itemCode = req.params.itemCode
  const editFurnitureModel = req.body.model

  FurnitureModel.find({itemCode : itemCode})
  .then(foundModel => {
    let furnitureModel = foundModel[0]
    let furnitureModelId = furnitureModel.id
    let toUpdate = {
      itemCode: editFurnitureModel.itemCode || furnitureModel.itemCode,
      model: editFurnitureModel.model || furnitureModel.model,
      color: editFurnitureModel.color || furnitureModel.color,
      dimension: editFurnitureModel.dimension || furnitureModel.dimension,
    }

    let modelItemCode = toUpdate.itemCode

    FurnitureModel.findByIdAndUpdate(furnitureModelId, toUpdate)
    .then(() => res.redirect(`/inventory/models/${modelItemCode}`))
    .catch( err => res.send(err))
  })

})

router.delete('/models/:itemCode', (req, res) => {
  const itemCode = req.params.itemCode

  FurnitureModel.find({itemCode : itemCode})
  .then(foundModel => {
    let furnitureModel = foundModel[0]
    let furnitureModelId = furnitureModel.id


    FurnitureModel.findByIdAndRemove(furnitureModelId)
    .then(() => {
      FurnitureStock.find({furnitureModel:  furnitureModelId})
      .then(furnitureStocks => {
        let promises = []
        furnitureStocks.forEach( (stock) => {
          stockId = stock.id
          promises.push(FurnitureStock.findByIdAndRemove(stockId))
        })

        Promise.all(promises)
        .then(() => {
          res.redirect('/inventory')
        })

      })
    })
  })
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
    // res.redirect(`/inventory`
    res.redirect(`/inventory/models/${itemCode}`)

  }, err => res.direct(`/models/${itemCode}/newStock`))
})

router.get('/stocks', (req, res) => {
  const stockId = req.params.id

  FurnitureStock.find()
  .populate('location')
  .populate('furnitureModel')
  .then( furnitureStocks => {
    res.render('inventory/allStocks', {
      furnitureStocks
    })
  })
})

router.get('/stocks/:id', (req, res) => {
  const stockId = req.params.id

  FurnitureStock.findById(stockId)
  .populate('location')
  .populate('furnitureModel')
  .then( furnitureStock => {

    res.render('inventory/stock', {
      furnitureStock
    })
  })
})

router.get('/stocks/:id/edit', (req, res) => {
  const stockId = req.params.id

  FurnitureStock.findById(stockId)
  .populate('location')
  .populate('furnitureModel')
  .then( furnitureStock => {

    Location.find({})
    .then(locations => {
      res.render('inventory/editStock', {
        furnitureStock, locations
      })
    })
  })
})
router.put('/stocks/:id', (req, res) => {
  const stockId = req.params.id
  const editFurnitureStocks = req.body.stock
  let stockUpdate = {
    location:  editFurnitureStocks.location,
    quantity:  editFurnitureStocks.quantity
  }

  FurnitureStock.findByIdAndUpdate(stockId, stockUpdate)
  .then( () => {

    res.redirect(`/inventory/stocks/${stockId}`)
  })
})
router.delete('/stocks/:id', (req, res) => {
  const stockId = req.params.id

  FurnitureStock.findByIdAndRemove(stockId)
  .then( () => {
    res.redirect('/inventory/stocks')
  })
})






module.exports = router
