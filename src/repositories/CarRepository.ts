import { PrismaClient } from "@prisma/client";
import { ICarRepository } from "../interfaces/ICarRepository";
import { ICar } from "../interfaces/ICarInterface";
import { AppError } from "../errors/AppError";

const prisma = new PrismaClient();

export class CarRepository implements ICarRepository{
    async findMainCar(userId: string): Promise<ICar> {
        const car = await prisma.car.findFirst({
            where: { userId, mainCar:true }
        })

        if(!car) throw new AppError('Car not found')

        return car
    }

    async findUserCars(userId: string): Promise<ICar[]> {
        const result = await prisma.car.findMany({
            where: {userId, active: true}
        })

        return result
    }

    async findOneCar(id: string): Promise<ICar> {
        const result = await prisma.car.findUnique({
            where: {id}
        });

        if(!result || result.active === false) throw new AppError("car not found");
        
        return result
    }

    async findAll(userId: string): Promise<ICar[]> {
        const result = await prisma.car.findMany({
            where: {userId, active: true}
        })
        return result;
    }

    async insert(props: ICar): Promise<ICar> {
        const result = await prisma.car.create({
            data:props
        })

        return result;
    }

    async update(props: ICar, id: string): Promise<ICar> {
        const result = await prisma.car.update({
            where: { id },
            data: props
        })

        return result;
    }

    async delete(id: string): Promise<void> {
        const result = await prisma.car.findUnique({
            where: { id }
        })

        const races = await prisma.race.findMany({
            where: {carId: id, active: true}
        })
        

        if(!result) throw new AppError('car not found')

        if(races.length > 0) throw new AppError('That car cant be deleted as its linked to a race. Delete the races that contain this car so that you can delete it')

        const result1 = await prisma.car.update({
            where: { id },
            data: {active: false}
        })

    }
    
}