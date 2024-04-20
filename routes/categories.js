/** @type{import('fastify').FastifyPluginAsync<>} */
import createError from '@fastify/error';
export default async function categories(app, options) {
    const InvalidCategories = createError('InvalidCategories', 'Categoria Inválida.', 400);

    const categories = app.mongo.db.collection('categories');
    const products = app.mongo.db.collection('products');

    app.get('/categories',
        {
            config: {
                logMe: true
            }
        },
        async (request, reply) => {
            return await categories.find().toArray();
        }
    );

    app.post('/categories', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    img_url: { type: 'string' }
                },
                required: ['name', 'img_url']
            }
        },
        config: {
            requireAuthentication: true
        }
    }, async (request, reply) => {
        let category = request.body;

        await categories.insertOne(category);

        return reply.code(201).send();
    });

    app.get('/categories/:id', async(request, reply) => {
        let id = request.params.id;
        let category = await categories.findOne({ _id: request.params.id });
        return category;
    })

    app.get('/categories/:id/products', {
        config: {logMe: true}
    }, async (request, reply) => {
        let category = await categories.findOne({ _id: request.params.id })
        return await products.find({category: category.name}).toArray()
    });

    app.delete('/categories/:id', {
        config: {
            requireAuthentication: true
        }
    }, async (request, reply) => {
        let id = request.params.id;

        await categories.deleteOne({ _id: request.params.id });

        return reply.code(204).send();;
    });

    app.put('/categories/:id', {
        config: {
            requireAuthentication: true
        }
    }, async (request, reply) => {
        let id = request.params.id;
        let category = request.body;

        await categories.updateOne({ _id: request.params.id }, {
            $set: {
                name: category.name,
                img_url: category.img_url
            }
        });

        return reply.code(204).send();;
    });
}