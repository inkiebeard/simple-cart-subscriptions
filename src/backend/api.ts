import express from 'express';
import * as auth from './auth';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use((req, res, next) => {
  console.log(`[request ${new Date().toISOString()}] ${req.method}: ${req.url}`, {
    ...(req.body && {body: req.body}),
    ...(req.params && {params: req.params}),
    ...(req.query && {query: req.query}),
  });
})

app.use(auth.middleware)

app.get('/', (req, res) => {
  res.send('Hello World!');
} );
