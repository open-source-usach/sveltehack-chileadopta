import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

export type Env = {
	CHILEADOPTA: D1Database;
}

const petSchema = z.object({
    name: z.string(),
    is_exotic: z.string(),
    species_id: z.string(),
    size_id: z.string(),
    breed: z.string(),
    sex_id: z.string(),
    age: z.string(),
    description: z.string(),
    owner_id: z.string(),
    email: z.string(),
    phone_number: z.string(),
    region_id: z.string(),
    commune_id: z.string()
})

const pets = new Hono<{ Bindings: Env }>();

pets.get('/all', async (c) => {

})

pets.get('/byCommune', async (c) => {
    c.env.CHILEADOPTA.prepare('SELECT * FROM communes')
})

pets.put('/new', zValidator('form', petSchema), async (c) => {
    const lol = c.req.valid('form')
    const req = await c.env.CHILEADOPTA.prepare(`INSERT INTO pet (name, is_exotic, species_id, size_id, breed, sex_id, age, description, owner_id, email, phone_number, region_id, commune_id) VALUES ("${lol.name}", ${lol.is_exotic}, ${lol.species_id}, ${lol.size_id}, "${lol.breed}", ${lol.sex_id}, ${lol.age}, "${lol.description}", ${lol.owner_id}, "${lol.email}", "${lol.phone_number}", ${lol.region_id}, ${lol.commune_id})`).all()
    return c.json(req.results)
} )

export default pets