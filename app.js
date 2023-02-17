import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session';
import msIdExpress from 'microsoft-identity-express';
const appSettings = {
    appCredentials: {
        clientId:  "8ba918cd-43eb-48fe-a460-72f2721d6626",
        tenantId:  "f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
        clientSecret:  "RcG8Q~nzbcLdzmBr4G~mon9xTRRckwXE~LzOQcY5"
    },
    authRoutes: {
        redirect: "https://website-sharer-jonnykim01.azurewebsites.net/redirect", //note: you can explicitly make this "localhost:3000/redirect" or "examplesite.me/redirect"
        error: "/error", // the wrapper will redirect to this route in case of any error.
        unauthorized: "/unauthorized" // the wrapper will redirect to this route in case of unauthorized access attempt.
    }
};

import apiRouter from './routes/api/v1/apiv1.js';
import apiRouter2 from './routes/api/v2/apiv2.js';
import apiRouter3 from './routes/api/v3/apiv3.js';
import models from './models.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessions({
    secret: "This is a secret key! asdasdasds asdttytfhgfh44332",
    saveUninitialized: true,
    cookie: {},
    resave: false
}));

const msid = new msIdExpress.WebAppAuthClientBuilder(appSettings).build();
app.use(msid.initialize());

app.use((req, res, next) => {
    req.models = models;
    next();
});

app.use('/api/v1', apiRouter);
app.use('/api/v2', apiRouter2);
app.use('/api/v3', apiRouter3);

app.get('/signin',
    msid.signIn({postLoginRedirect: '/'})
);

app.get('/signout',
    msid.signOut({postLogoutRedirect: '/'})
);

app.get('/error', (req, res) => {
    res.status(500).send("Error: Server error")
});

app.get('/unauthorized', (req, res) => {
    res.status(401).send("Error: Unauthorized")
});

export default app;