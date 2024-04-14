/** @type{import('fastify').FastifyPluginAsync<>} */
export default async function auth(app, options) {

    app.post('/auth', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    username: { type: 'string' },
                    password: { type: 'string' },
                },
                required: ['username', 'password']
            }
        },
    }, async (request, reply) => {
        let user = request.body;
        request.log.info(`Login for user ${user.username}`)
        delete user.password
        return{
            'x-acess-token': app.jwt.sign(user)
        }
    });
}