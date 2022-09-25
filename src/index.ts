import express from 'express';
import hbs from 'hbs';
import 'reflect-metadata';
import { AppDatasource } from './services/db';
import { Price } from './models/price.model';

const app = express();
app.set('view engine', 'hbs');

const port = process.env.PORT ?? 3000;
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const priceRepository = AppDatasource.getRepository(Price);

app.get('/', async (req, res) => {
	console.log(req.headers)
	const exchanges = await priceRepository.find();
	console.log('Consumo de web: ' + req.socket.remoteAddress);
	res.render('index', {
		exchange: exchanges,
	});
});

app.get('/exchanges_data', async (req, res) => {
	const exchanges = await priceRepository.find();
	console.log('Consumo de api: ' + req.socket.remoteAddress);
	return res.json(exchanges);
});

app.get('/healtz', (_, res) => {
	return res.status(200).send('ok');
});

app.get('*', (req, res) => {
	res.send('<h1>WHAT???</h1>');
});

AppDatasource.initialize()
	.then(() => {
		console.log('Conexion a base de datos exitosa');
		app.listen(port, () => {
			console.log(`Server started in port: ${port}`);
		});
	})
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
