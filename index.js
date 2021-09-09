const polka = require('polka')
const send = require('@polka/send-type');
// const parse = require('@polka/url');
const {
    json
} = require('body-parser');

const app = polka();
app.use(json());
const products = [{
    name: `กระท่อม`,
    price: 100.00
}, {
    name: `กัญชง`,
    price: 999.00
}];


app.get('/', (_req, res) => {
    send(res, 200, {
        msg: `Welcom to telegram chat bot`
    });
});

app.post('/', (req, res) => {
    const body = req.body.queryResult;
    console.log(body.queryText);
    const intentname = body.intent.displayName;
    const parameters = body.parameters;
    let responseText;
    if (intentname === `product`) {
        for (const p of products) {
            if (!responseText) {
                responseText = p.name;
            } else {
                responseText = responseText.concat(`\n`, p.name);
            }
        }
        responseText += `\nคุณต้องการซื้ออะไร`
    } else if (intentname == `buy`) {
        if (products.some(o => o.name === parameters.pname)) {
            const pindex = products.findIndex(o => o.name === parameters.pname);
            responseText = `${parameters.pname} ราคากิโลกรัมละ ${products[pindex].price} บาท`;
            responseText += `\nซื้อสินค้าทั้นที? (ใช่/ไม่)`;
        } else {
            responseText = `ไม่พบ ${parameters.pname} ในรายการสินค้า`;
        }
    } else if (intentname == `buy - decide`) {
        if (parameters.decide === `ใช่`) {
            responseText = `รอแอดมินติดต่อกลับแปปนะ`
        } else {
            responseText = `มีไรนึกถึงร้านเราได้เสมอน่ะ`
        }
    }

    send(res, 200, {
        "fulfillmentMessages": [{
            "text": {
                "text": [
                    responseText
                ]
            }
        }]
    });
});


app.listen('3000', err => {
    if (err) throw err;
    console.log(`Running on http://localhost:3000`)
});