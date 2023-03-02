import { z } from 'zod';


export const petSchema = z.object({
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

export const editPetSchema = z.object({
    pet_id: z.string(),
    name: z.string(),
    is_adopted: z.string(),
    size_id: z.string(),
    breed: z.string(),
    sex_id: z.string(),
    age: z.string(),
    description: z.string(),
    email: z.string(),
    phone_number: z.string(),
    region_id: z.string(),
    commune_id: z.string()
})

export const deletePetSchema = z.object({
    pet_id: z.string(),
    owner_id: z.string()
})

export const setAdoptedSchema = z.object({
    pet_id: z.string(),
    owner_id: z.string()
})

