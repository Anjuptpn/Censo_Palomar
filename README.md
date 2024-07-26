# CensoPalomar

###### Trabajo de Fin de Grado: Aplicación web para aficionados a la colombofilia

###### Demo

Se puede ver el proyecto en funcionamiento en el siguiente enlace: https://censo-palomar.web.app/

## Desarrollado con:

**Node.js** versión: 20.13.1

**Npm** versión: 10.8.0

**Angular** versión: 17.1.1

**Angular Material** versión: 17.3.9

## Cómo instalar el proyecto en local

Para instalarlo, es necesario que se tengan instalados los siguientes programas:

*Node.js* y *Angular*

Para instalarlo, clone o descargue el zip. Y en la carpeta de extracción usar el comando:

```npm install```

Una vez instalado, en el fichero /src/environments/environment.ts colocar la configuración de tu proyecto de Firebase. Que será similar al siguiente código:

```
    export const environment = {
        firebaseConfig: {
            apiKey: "XXXXXXXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXX",
            authDomain: "XXXXXXXXXX.firebaseapp.com",
            projectId: "nombre del proyecto",
            storageBucket: "nombreDelProyecto.appspot.com",
            messagingSenderId: "XXXXXXXXXXXX",
            appId: "X:XXXXXXXXXXXX:web:XXXXXXXXXXXXXXXXXXXXXX"     
        },     
    };
```
Y en el fichero app.config.ts se debe colocar el siguiente código: 

```
    export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes),
        provideAnimations(),
        provideFirebaseApp(()=>initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideStorage(() => getStorage())
    ]}
```

## Iniciar el servidor en local.

Psrs arrancar el servidor en local se usa el comando 

```npm install```

Luego en la dirección `http://localhost:4200/`. Se mostrará la aplicación funcionando.
