import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

export type Env = {
	CHILEADOPTA: D1Database;
}

export type lol = {
    bruh: string
}

export interface passwordRes {
    [key: number]: {
        password: string
    }
}

const schema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
    phone_number: z.string(),
    type_id: z.string(),
    webpage: z.string(),
    description: z.string()
})

const loginSchema = z.object({
    email: z.string(),
    password:z.string()
})



const users = new Hono<{ Bindings: Env }>();

users.post('/profile', zValidator('form', z.object({id: z.string()})), async (c) => {
    const form = c.req.valid("form")
    const res = await c.env.CHILEADOPTA.prepare(`SELECT * FROM user WHERE id = ${form.id}`).all()
    return c.json(res.results)
})

users.post('/login', zValidator('form', loginSchema), async (c) => {
    const form = c.req.valid("form")
    const res = await c.env.CHILEADOPTA.prepare(`SELECT password FROM user WHERE email = "${form.email}"`).all()
    const pass = res.results as passwordRes
    if (pass[0].password == form.password) {
        console.log("anache")
        return c.text(":3")
    }
    return c.text(":c")
})

users.get('/all', async (c) => {
    const res = await c.env.CHILEADOPTA.prepare("SELECT * FROM user").all()
    console.log(res.results)
    return c.json(res.results)
})


users.put('/register', zValidator('form', schema), async (c) => {
    const form = c.req.valid("form")
    const query = await c.env.CHILEADOPTA.prepare(`INSERT INTO user (name, email, password, phone_number, type_id, webpage, description) VALUES ("${form.name}", "${form.email}", "${form.password}", "${form.phone_number}", ${form.type_id}, "${form.webpage}", "${form.description}");`).all()
    console.log(form)
    return c.json(query)
})

export default users;
