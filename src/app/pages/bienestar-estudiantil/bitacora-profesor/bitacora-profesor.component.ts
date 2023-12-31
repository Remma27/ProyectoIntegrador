import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BitacoraForm } from 'src/app/shared/formsModels/bitacoraForms';
import { BitacoraServices } from 'src/app/shared/services/bitacora.service';

@Component({
  selector: 'app-bitacora-profesor',
  templateUrl: './bitacora-profesor.component.html',
  styleUrls: ['./bitacora-profesor.component.scss'],
})
export class BitacoraProfesorComponent {
  constructor(
    public bitacoraForm: BitacoraForm,
    private srvBitacora: BitacoraServices,
    private mensajeria: ToastrService
  ) {}

  guardar() {
    if (this.bitacoraForm.baseForm.valid) {
      this.srvBitacora.insert(this.bitacoraForm.baseForm.value).subscribe(
        (dato) => {
          console.log(dato);
          this.mensajeria.success('¡Guardado correctamente!');
          this.bitacoraForm.baseForm.reset();
          window.location.reload();
        },
        (error) => {
          this.mensajeria.error(
            'El estudiante no esta registrado en la base de datos'
          );
        }
      );
    } else {
      this.mensajeria.error('Se produjo un error');
    }
  }
}
