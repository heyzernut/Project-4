const FurnitureModel = require('../models/furnitureModel')
const FurnitureStock = require('../models/furnitureStock')
const Category = require('../models/category')
const Location = require('../models/location')
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  FurnitureModel.find()
  .populate('category')
  .then(allModels => {
    var allModelsDisplay = []
    var promises = []
    allModels.forEach( model => {
      promises.push(FurnitureStock.find({furnitureModel: model.id})
      .populate('location')
      .then(allStock => {
        total = 0
        allStock.forEach(stock => {
          total += stock.quantity
        })

        let displayModel = {
          itemCode: model.itemCode,
          model: model.model,
          color: model.color,
          dimension: model.dimension,
          barcode: model.barcode,
          category: model.category,
          stocks: allStock,
          totalqty: total
        }
        allModelsDisplay.push(displayModel)
      })
    )
  })

    Promise.all(promises)
    .then(() => {
      res.render('inventory/allModels', {
        allModelsDisplay
      })
      // res.json(allModelsDisplay)
    })
  })
})


router.get('/models/new', (req, res) => {
  Category.find()
  .then(categories => {
    res.render('inventory/modelsNew', {
      categories
    })
  })
  .catch(err => {
    res.send(err)
  })
})
router.post('/models/new', (req, res) => {
  const modelData = req.body.model
  let newModel = new FurnitureModel({
    itemCode: modelData.itemCode,
    model: modelData.model,
    color: modelData.color,
    dimension: modelData.dimension,
    barcode: modelData.barcode,
    category: modelData.category
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
  .populate('category')
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
    Category.find()
    .then(categories => {
      let furnitureModel = foundModel[0]
      res.render('inventory/modelsEdit', {
        furnitureModel, categories
      })
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
      barcode: editFurnitureModel.barcode || furnitureModel.barcode,
      category: editFurnitureModel.category || furnitureModel.category
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
    Location.find()
    .then(locations => {
      res.render('inventory/modelsNewStock', {
        furnitureModel, locations
      })
    })
    .catch(err => { res.send(err) })
  })
  .catch(err => {res.send("error")})
})
router.post('/models/:itemCode/newStock', (req, res) => {
  const stockData = req.body.stock
  const itemCode = req.params.itemCode
  let dataZone = stockData.zone
  let dataShelf = stockData.shelf

  if (typeof stockData.zone === 'object'){
    dataZone = dataZone.join(",").replace(/[,]/g, "")
    dataShelf = dataShelf.join(",").replace(/[,]/g, "")
  }

  let newStock = new FurnitureStock({
    furnitureModel: stockData.furnitureModel,
    quantity: stockData.quantity,
    location: stockData.location,
    zone: dataZone,
    shelf: dataShelf
  })
  newStock.save()
  .then(stock => {
    res.redirect(`/inventory/models/${itemCode}`)
  }, err => res.direct(`/models/${itemCode}/newStock`))
})

router.get('/stocks', (req, res) => {
  const stockId = req.params.id

  FurnitureStock.find()
  .populate('location')
  .populate( {
       path: 'furnitureModel',
       populate: {
         path: 'category',
         model: 'Category'
       }
    })
  .then( furnitureStocks => {
    res.render('inventory/allStocks', {
      furnitureStocks
    })
  })
})
router.get('/stocks/new', (req, res) => {
  FurnitureModel.find()
  .then(furnitureModels => {
    Location.find()
    .then(locations => {
      res.render('inventory/newStock', {
        furnitureModels, locations
      })
    })
    .catch(err => res.send(err))
  })
  .catch(err => {res.send("error")})
})

router.post('/stocks/new', (req, res) => {
  const stockData = req.body.stock

  let dataZone = stockData.zone
  let dataShelf = stockData.shelf

  if (typeof stockData.zone === 'object'){
    dataZone = dataZone.join(",").replace(/[,]/g, "")
    dataShelf = dataShelf.join(",").replace(/[,]/g, "")
  }

  let newStock = new FurnitureStock({
    furnitureModel: stockData.furnitureModel,
    quantity: stockData.quantity,
    location: stockData.location,
    zone: dataZone,
    shelf: dataShelf
  })
  newStock.save()
  .then(stock => {
    res.redirect(`/inventory/stocks`)
  }, err => res.redirect(`/inventory/stocks/new`))
})

router.get('/stocks/:id', (req, res) => {
  const stockId = req.params.id

  FurnitureStock.findById(stockId)
  .populate('location')
  .populate('furnitureModel')
  .then( furnitureStock => {

    res.render('inventory/indivStock', {
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
  FurnitureStock.findById(stockId)
  .then(stock => {
    let dataZone = stockData.zone
    let dataShelf = stockData.shelf

    if (typeof stockData.zone === 'object'){
      dataZone = dataZone.join(",").replace(/[,]/g, "")
      dataShelf = dataShelf.join(",").replace(/[,]/g, "")
    }

    let stockUpdate = {
      quantity:  editFurnitureStocks.quantity || stock.quantity,
      location:  editFurnitureStocks.location || stock.location,
      zone: dataZone || stock.zone,
      shelf: dataShelf || stock.shelf
    }
    FurnitureStock.findByIdAndUpdate(stockId, stockUpdate)
    .then( () => {
      res.redirect(`/inventory/stocks/${stockId}`)
    })

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
