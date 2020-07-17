import database from '../config/db';

const productionController = {
    add(req, res) {
        let formdata = req.body.raw;
        let ProductCode = formdata['ProductCode'];
        let Family = 'NOFAMILY';
        let noformfields = ["ProductCode", "Family"];

        database.query('SELECT * FROM product_head WHERE product_code=?', ProductCode)
            .then(result => {
                if (result.length > 0) {
                    res.json({ message: 'Product code is already exist!', error: 0, result: ProductCode })
                }
            })
            .catch(err => {
                console.log('error', err);
                res.json({ message: 'Oops, error occured!', error: 1, result: err });
            });

        database.query('INSERT INTO product_head(product_code, family_name) VALUES(?,?)', [ProductCode, Family])
            .then(result => {
                let ProductHeaderID = result.insertId;
                let Finalproductcode = "";

                Object.keys(formdata).forEach(key => {
                    let fieldName = key;
                    if (noformfields.indexOf(fieldName) < 0) {
                        let filedNameArray = fieldName.split("-");
                        let optionvalue;
                        if (filedNameArray[1] == "select")
                            optionvalue = formdata[key].split("_");

                        let ProductCharChildId = filedNameArray[1] == "select" ? optionvalue[0] : 0;
                        let val = formdata[key] == '' ? 0 : formdata[key];
                        let ProductCharChildValue = filedNameArray[1] == "select" ? 0 : val;

                        Finalproductcode += (filedNameArray[1] == "select" && val != 0 && optionvalue[1] != "NOFAMILY") ? optionvalue[1] : "";
                        Finalproductcode += (filedNameArray[1] != "select" && val != '' && filedNameArray[3] != "NOFAMILY") ? filedNameArray[3] : "";

                        database.query('INSERT INTO product_body(product_header_id, product_char_father_id, product_char_child_id, product_char_child_value) VALUES(?,?,?,?)',
                            [ProductHeaderID, filedNameArray[2], ProductCharChildId, ProductCharChildValue])
                            .then(result => {
                                // console.log('productbody data is saved', result)
                            })
                            .catch(err => res.json({ message: 'Oops, error occured!', error: 1, result: err }));
                    }
                });

                database.query('update product_head set family_name=? where id=?', [Finalproductcode, ProductHeaderID])
                    .then(result => {
                        res.json({ message: 'Saved successfully!', error: 0, result: result });
                    })
                    .catch(err => res.json({ message: 'Oops, error occured!', error: 1, result: err }));
            })
            .catch(err => {
                console.log('errrr', err);
                res.json({ message: 'Oops, error occured!', error: 1, result: err });
            });
    }
};

export default productionController;
