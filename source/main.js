import Fastify from 'fastify';
import jwt from 'jsonwebtoken';
import {obtainUser} from "./obtain-user.js";
import {getAuthInfo} from "./get-auth-info.js";

const fastify = Fastify({logger: true});
const JWT_SECRET = process.env.JWT_SECRET;
let id = 1;

const giphyURL = new URL('https://api.giphy.com/v1/gifs/search');
giphyURL.searchParams.set('api_key', process.env.API_KEY);
giphyURL.searchParams.set('limit', '1');
giphyURL.searchParams.set('offset', '0');
giphyURL.searchParams.set('rating', 'g');
giphyURL.searchParams.set('lang', 'en');

const starWarsURL = 'https://swapi.tech';

fastify.get('/api*', async (req, reply) => {
    const authHeader = req.headers.authorization;

    const user = getAuthInfo(authHeader, JWT_SECRET)
    if (!user) {
        reply.code(401)
        return reply.send('Not authorized')
    }

    const requestURL = starWarsURL + req.url;

    const res = await fetch(requestURL);
    const data = await res.json();

    if (req.url.includes('planets?')) {
        for (const planet of data.results) {
            planet.url = 'api/planets/' + planet.uid;
        }
    }
    else if (req.url.includes('planets/')) {
        const planetProperties = data.result.properties;
        planetProperties.animated_image = 'image/' + planetProperties.name;
    }

    reply.type('application/json');

    return reply.send(data);
});

fastify.get('/image/:location', async (req, reply) => {
    const {location} = req.params;
    giphyURL.searchParams.set('q', 'star+wars+' + location.replace(' ', '+'));
    const res = await fetch(giphyURL.toString());
    const json = await res.json();
    const imageURL = json.data[0].images.original.url;
    const image = await fetch(imageURL);
    reply.type(image.headers.get('content-type'));
    return reply.send(image);
});

fastify.post('/auth', async (request, reply) => {
    const {login, password} = request.body;
    try {
        const user = await obtainUser(login, password);
        if (!user) {
            reply.code(401);
            return reply.send('Invalid login or password');
        }
        return jwt.sign({
            id: ++id,
            login: user.login,
        }, JWT_SECRET);
    } catch (err) {
        reply.code(err.code());
        return reply.send(err);
    }
})

const start = async () => {
    try {
        await fastify.listen({port: 3000});
        console.log('Server listening on http://localhost:3000');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();