import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { Env, ownerRes } from './types'
import { petSchema, editPetSchema, deletePetSchema, setAdoptedSchema } from './schemas';





const pets = new Hono<{ Bindings: Env }>();

pets.get('/', async (c) => {
    const req = await c.env.CHILEADOPTA.prepare('SELECT * FROM pets').all()
    return c.json(req.results, 200)
})

pets.get('/:pet_id', async (c) => {
    const code = c.req.param('pet_id')
    const req = await c.env.CHILEADOPTA.prepare(`SELECT * FROM pets WHERE id = ${code}`).all()
    return c.json(req.results, 200)
})

pets.get('/fromUser/:owner_id', async (c) => {
    const code = c.req.param('owner_id')
    const req = await c.env.CHILEADOPTA.prepare(`SELECT * FROM pets WHERE owner_id = ${code}`).all()
    return c.json(req.results, 200)
})

pets.put('/new', zValidator('form', petSchema), async (c) => {
    const form = c.req.valid('form')
    const req = await c.env.CHILEADOPTA.prepare(`INSERT INTO pets (name, is_exotic, species_id, size_id, breed, sex_id, age, description, owner_id, email, phone_number, region_id, commune_id) VALUES ("${form.name}", ${form.is_exotic}, ${form.species_id}, ${form.size_id}, "${form.breed}", ${form.sex_id}, ${form.age}, "${form.description}", ${form.owner_id}, "${form.email}", "${form.phone_number}", ${form.region_id}, ${form.commune_id})`).all()
    return c.json({message: "The pet has been added successfully"}, 200)
})

pets.post('/delete', zValidator('form', deletePetSchema), async (c) => {
    const form = c.req.valid('form')
    const req = await c.env.CHILEADOPTA.prepare(`SELECT owner_id FROM pets WHERE id = ${form.pet_id}`).all()
    const owner = req.results as ownerRes
    if (!(0 in owner)) {
        return c.json({message: "There is not pet with this id!"}, 403)
    }
    if (owner[0].owner_id === parseInt(form.owner_id)) {
        const adoptReq = await c.env.CHILEADOPTA.prepare(`DELETE FROM pets WHERE id = ${form.pet_id}`).all()
        return c.json({message: 'The pet has been deleted successfully'}, 200)
    }
    return c.json({message: "You don't have permission to do this!"}, 403)
})

pets.post('/setAdopted', zValidator('form', setAdoptedSchema), async (c) => {
    const form = c.req.valid('form')
    const req = await c.env.CHILEADOPTA.prepare(`SELECT owner_id FROM pets WHERE id = ${form.pet_id}`).all()
    const owner = req.results as ownerRes
    if (!(0 in owner)) {
        return c.json({message: "There is not pet with this id!"}, 403)
    }
    if (owner[0].owner_id === parseInt(form.owner_id)) {
        const adoptReq = await c.env.CHILEADOPTA.prepare(`UPDATE pets SET is_adopted = 1 WHERE id = ${form.pet_id}`).all()
        return c.json({message: 'The pet has been adopted successfully'}, 200)
    }
    return c.json({message: "You don't have permission to do this!"}, 403)
})

pets.post('/edit', zValidator('form', editPetSchema), async (c) => {
    const form = c.req.valid('form')
    const req = await c.env.CHILEADOPTA.prepare(`UPDATE pets SET name = "${form.name}", is_adopted = ${form.is_adopted}, size_id = ${form.size_id}, breed = "${form.breed}", sex_id = ${form.sex_id}, age = ${form.age}, description = "${form.description}", email = "${form.email}", phone_number = "${form.phone_number}", region_id = ${form.region_id}, commune_id = ${form.commune_id} WHERE id = ${form.pet_id}`).run()
    return c.json({message: "The pet's information has been updated successfully"}, 200)
})


export default pets