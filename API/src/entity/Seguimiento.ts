import { IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Cita } from './CIta';

@Entity()
export class Seguimiento {
  @PrimaryColumn()
  @IsNotEmpty({ message: 'Debe ingresar valores' })
  Seguimiento_Id: number;

  @ManyToOne(() => Cita, (cita) => cita.seguimiento)
  @JoinColumn({ name: 'Cita_Id' })
  cita: Cita;

  @Column()
  @IsNotEmpty({ message: 'Debe ingresar valores' })
  Resumen_Cita: string;

  @Column()
  @IsNotEmpty({ message: 'Debe ingresar valores' })
  Fecha_Correspondiente: Date;

  @Column()
  @IsNotEmpty({ message: 'Debe ingresar valores' })
  Estado: boolean;
}
