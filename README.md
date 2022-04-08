# FrontendRecursosSociales

Este proyecto esta generado con imagen de docker  [Angular CLI](https://github.com/angular/angular-cli) version 7.2.4.
 - [Angular CLI](https://github.com/angular/angular-cli) version 7.3.10.
 - [Ng Bootstrap](https://github.com/ng-bootstrap/ng-bootstrap) v4.0.1

## Instalacion del proyecto via docker

Descargamos la imagen de docker:
  
  `docker pull trion/ng-cli:7.2.4`

Nos dirigimos al directorio donde tenemos el proyecto y seguimos los siguientes pasos:

 - Utilizamos el siguiente comando a instalar, que nos proporcionara la instalación continua del proyecto:
    
    `docker run -u $(id -u) --rm -v "$PWD":/app trion/ng-cli:7.2.4 npm install ci`

 - Compilamos el codigo con el siguiente comando:
    
    `docker run -u $(id -u) --rm -v "$PWD":/app trion/ng-cli:7.2.4 ng build`

Una vez completado los pasos anteriores iniciamos el docker que contiene nuestro sistema:

Iniciamos el proyecto con la imagen de docker `trion/ng-cli:7.2.4`:

   `docker run -u $(id -u) --rm -p 4200:4200 -v "$PWD":/app trion/ng-cli:7.2.4 ng serve --host 0.0.0.0`
  
  - El sistema trabaja con un FAKE-BACKEND para probar el sistema y su funcionamiento.
  - Para habilitar el uso del "fake-bakend" dirijase al archivo `app.module.ts` que se encuentra dentro de `/src/app`
  
    - descomentar las lineas:
      `import { fakeBackendProvider } from "./shared/helpers/fake-backend";`
      `fakeBackendProvider` se encuentra dentro `@NgModule` en el `Providers`

  - Datos de ingreso:
      - Usuario: admin
      - Contraseña: admins

Mediante docker-compose:

 - Levantamos los contenedores

    `docker-compose -p app up -d`

 - Borramos los contenedores

    `docker-compose -p app down`

## Test E2E (end-to-end)

Imagen utilizada para test [Trion/ng-cli-e2e:9.1.5](https://hub.docker.com/r/trion/ng-cli-e2e/).

Creamos una red para los contenedores de docker:

  `docker network create front`

Iniciamos el docker para testing:

  `docker run -u $(id -u) --rm --network=front --name=miangular2 -v "$PWD":/app trion/ng-cli-e2e:7.2.4 ng serve --port 4200 --host miangular2`

Ingresar al servicio que ejecuta angular-cli y ejecutar el siguiente comando:

 - Ejemplo mi servicio es: "miangular2":

   `ng e2e --host miangular2 --port 4300`

Esto ejecutara end-to-end el testeo via [Protractor](http://www.protractortest.org/).

## Ayuda

Para mas ayuda dobre Angular CLI utilice `ng help` o ingresa a [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
