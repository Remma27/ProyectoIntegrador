import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Cita } from '../entity/CIta';
import { features } from 'process';
import { validate } from 'class-validator';
import { json } from 'body-parser';
import { Estudiante } from '../entity/Estudiante';

export class CitaController {
  static getAll = async (req: Request, res: Response) => {
    try {
      const citasRepo = AppDataSource.getRepository(Cita);
      const citas = await citasRepo.find({ where: { estudiante: true } });
      if (citas.length === 0)
        return res.status(404).json({ message: 'No hay citas activas' });
      return res.status(200).json(citas);
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  };

  static getById = async (req: Request, res: Response) => {
    try {
      const Cita_Id = parseInt(req.params['id']);
      const citasRepo = AppDataSource.getRepository(Cita);
      let cita;
      try {
        cita = await citasRepo.findOneOrFail({
          where: { Cita_Id },
        });
      } catch (error) {
        return res
          .status(404)
          .json({ message: 'Cita no encontrada o inactiva' });
      }
      return res.status(200).json(cita);
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  };

  static getByEstado = async (req: Request, res: Response) => {
    try {
      const estado = req.params['Estado']; // Estado es un string
      const citasRepo = AppDataSource.getRepository(Cita);

      try {
        const cita = await citasRepo.find({
          where: { Estado: estado },
        });
        return res.status(200).json(cita);
      } catch (error) {
        return res
          .status(404)
          .json({ message: 'Cita no encontrada o inactiva' });
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

  static insert = async (req: Request, res: Response) => {
    /*formato
            "Estudiante_Id":9,
            "Encargado_Nombre":"Juntuan Mario",
            "Aprobacion_Cita":"Pendiente",
            "Fecha_Cita":"2023-12-12"
        */
    try {
      const {
        Estudiante_Id,
        Encargado_Nombre,
        Observacion_Cita,
        Fecha_Cita,
        Estado,
      } = req.body;

      const citasRepo = AppDataSource.getRepository(Cita);

      const estudianteRepo = AppDataSource.getRepository(Estudiante);
      const estudianteExistente = await estudianteRepo.findOne({
        where: { Estudiante_Id },
      });

      if (!estudianteExistente) {
        return res.status(404).json({ message: 'Estudiante no existente' });
      }

      let cita = new Cita();
      cita.estudiante = Estudiante_Id;
      cita.Encargado_Nombre = Encargado_Nombre;
      cita.Observacion_Cita = Observacion_Cita;
      cita.Fecha_Cita = Fecha_Cita;
      cita.Estado = Estado;
      const errores = await validate(cita, {
        validationError: { target: false, value: false },
      });
      if (errores.length > 0) {
        return res.status(400).json(errores);
      }
      try {
        await citasRepo.save(cita);
        return res
          .status(201)
          .json({ message: 'Cita insertada correctamente' });
      } catch (error) {
        return res.status(400).json({ message: 'No se pudo insertar la cita' });
      }
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  };

  static update = async (req: Request, res: Response) => {
    /*formato
            "Cita_Id":1,
            "Estudiante_Id":9,
            "Encargado_Nombre":"Juntuan Mario",
            "Aprobacion_Cita":"Pendiente",
            "Fecha_Cita":"2023-12-12"
        */
    try {
      const {
        Cita_Id,
        Estudiante_Id,
        Encargado_Nombre,
        Observacion_Cita,
        Fecha_Cita,
        Estado,
      } = req.body;
      const citasRepo = AppDataSource.getRepository(Cita);
      /*const citaExistente = await citasRepo.findOne({
        where: { Cita_Id },
      });
      if (!citaExistente)
        return res.status(404).json({ message: 'Cita inexistente' });*/

      /*const estudianteRepo = AppDataSource.getRepository(Estudiante);
      const estudianteExistente = await estudianteRepo.findOne({
        where: { Estudiante_Id, Estado: true },
      });
      if (estudianteExistente) {
        return res.status(404).json({ message: 'Estudiante no existente' });
      }*/
      let cita: Cita;
      try {
        cita = await citasRepo.findOneOrFail({ where: { Cita_Id } });
      } catch (error) {
        return res.status(404).json({ message: 'Cita inexistente' });
      }
      //let cita = new Cita();
      cita.estudiante = Estudiante_Id;
      cita.Encargado_Nombre = Encargado_Nombre;
      cita.Observacion_Cita = Observacion_Cita;
      cita.Fecha_Cita = Fecha_Cita;
      cita.Estado = Estado;
      const errores = await validate(cita, {
        validationError: { target: false, value: false },
      });
      if (errores.length > 0) {
        return res.status(400).json(errores);
      }
      try {
        await citasRepo.save(cita);
        return res
          .status(200)
          .json({ message: 'Cita actualizada correctamente' });
      } catch (error) {
        return res
          .status(400)
          .json({ message: 'No se pudo actualizar la cita' });
      }
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  };

  static delete = async (req: Request, res: Response) => {
    try {
      const Cita_Id = parseInt(req.params['id']);
      if (!Cita_Id)
        return res.status(400).json({ message: 'Debe indicar el id' });
      const citasRepo = AppDataSource.getRepository(Cita);
      let cita: Cita;
      try {
        cita = await citasRepo.findOneOrFail({
          where: { Cita_Id },
        });
      } catch (error) {
        return res.status(404).json({ message: 'Cita no encontrada ' });
      }
      const errores = await validate(cita, {
        validationError: { target: false, value: false },
      });
      if (errores.length > 0) {
        return res.status(400).json(errores);
      }
      try {
        await citasRepo.delete(cita);
        return res
          .status(200)
          .json({ message: 'Cita eliminada correctamente' });
      } catch (error) {
        return res.status(400).json({ message: 'No se pudo eliminar la cita' });
      }
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  };
}

export default CitaController;
