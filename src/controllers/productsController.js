const fs = require("fs");
const path = require("path");

const productsFilePath = path.join(__dirname, "../data/productsDataBase.json");
const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));

const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
  // Root - Show all products
  index: (req, res) => {
    res.render("products", {
      products,
      toThousand,
    });
  },

  // Detail - Detail from one product
  detail: (req, res) => {
    const detailProduct = products.find(
      (product) => product.id === +req.params.id
    );
    return res.render("detail", {
      detailProduct,
      toThousand,
    });
  },

  // Create - Form to create
  create: (req, res) => {
    res.render("product-create-form");
  },

  // Create -  Method to store
  store: (req, res) => {
    const lastID = products[products.length - 1].id;

	const { name, price, discount, category, description } = req.body

    const newProduct = {
      id: lastID + 1,
      name: name.trim(),
      price: +price,
      discount: +discount,
      category: category,
      description: description.trim(),
      image: "defaul-image.png",
    };

	products.push(newProduct)

	fs.writeFileSync(productsFilePath, JSON.stringify(products), 'utf-8')

	return res.redirect('/products/detail/' + newProduct.id)

  },

  // Update - Form to edit
  edit: (req, res) => {
	const product = products.find((product) => product.id === +req.params.id)
    res.render('product-edit-form', {
		...product
	})
  },
  // Update - Method to update
  update: (req, res) => {
    const { name, price, discount, category, description } = req.body

	const productsUpdated = products.map(product => {
		if (product.id === +req.params.id) {
			product.name = name.trim(),
			product.price = +price,
			product.discount = +discount,
			product.category = category,
			product.description = description.trim()
		}

		return product

	})

	fs.writeFileSync(productsFilePath, JSON.stringify(productsUpdated), 'utf-8')

	return res.redirect('/products/detail/' + req.params.id)

  },

  // Delete - Delete one product from DB
  destroy : (req, res) => {
	
	const {id} = req.params;
	
	const traerJSON = () => {
		
		const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
		
		const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		
		return products;
	}
	
	const products = traerJSON();

	const nuevaLista = products.filter(product => product.id !== +id);
	
	const nuevoJSON = JSON.stringify(nuevaLista);
	
	fs.writeFileSync(productsFilePath,nuevoJSON,"utf-8");
	
	return res.redirect('/');

},
};

module.exports = controller;