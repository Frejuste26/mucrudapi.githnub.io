let express = require('express');
let mongoose = require('mongoose');
let app = express();
let port = process.env.PORT || 3001;
let Product = require('./Models/product.model.js')

app.use(express.json());
app.use(express.urlencoded({extended: false}))

mongoose.connect("mongodb://localhost:27017/APICRUD")
.then(()  => {
    console.log("connected to the database");
    app.listen(port, () => {
        console.log("Services started")
    });
})
.catch( ()  => {
    console.log("Connection failed");
});

app.get('/', (request, response) =>{
    response.send("Welcome to My API CRUD Service")
} );

app.get('/api/products', async (request, response) => {
    try {
        const products = await Product.find({});
        response.status(200).json(products);
    } catch (error) {
        response.status(500).send({message: error.message});
    }
})

app.get('/api/product/:id', async (request, response) => {
    try {
        const {id} = request.params;
        const product = await Product.findById(id);
        response.status(200).json(product);
    } catch (error) {
        response.status(500).send({message: error.message});
    }
})

app.put('/api/product/:id', async (request, response) => {
    try{
        const {id} = request.params;
        const product = await Product.findByIdAndUpdate(id, request.body);
        if(!product){
            return response.status(404).json({message: "Product not Fund"})
        }
        const UpdateProduct = await Product.findById(id);
        response.status(200).json(UpdateProduct)
    }catch (error){
        response.status(500).json({message: error.message})
    }
})

app.delete('/api/product/:id', async (request, response) => {
    try{
        const {id} = request.params;
        const product = await Product.findByIdAndDelete(id)
        if(!product){
            return response.status(404).json({message: "Product Not Found"})
        }
        response.status(200).json({message: "Product Deleted Successfully"})
    }catch (error){
        response.status(500).json({message: error.message})
    }
})

app.post('/api/products', async (request, response) => {
    try {
        let product = await Product.create(request.body)
        response.status(200).json(product);
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})