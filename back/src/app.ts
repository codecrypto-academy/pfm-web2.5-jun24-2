import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import cors from 'cors';

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

