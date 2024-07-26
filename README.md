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

Una vez instalado, es necesario crear un proyecto en Firebase siguiendo estos pasos:

1. Dirigirse a la consola de firebase, https://firebase.google.com
2. Iniciar sesión con una cuenta de Google
3. Seleccionar "Crear un Proyecto"
4. Ingresar el nombre del proyecto
5. Seleccionar si quieres activar Google Analytics en el proyecto
6. Agregar Firebase a Aplicación web
7. Registrar el nombre de la app en la pantalla que aparece
8. Ya el proyecto está creado, copiar las claves para configurar Firebase.


Una vez creado el proyecto, en el fichero /src/environments/environment.ts colocar la configuración de tu proyecto de Firebase. Que será similar al siguiente código:

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
puede que sea necesario instalar Firebase CLI utilizando los siguientes comandos:

Instalación: ```npm install -g firebase-tools```

Inicio de sesión: ```firebase-login```

Inicializar firebase: ```firebase-init```

## Iniciar el servidor en local.

Para arrancar el servidor en local se usa el comando 

```ng serve```

Luego en la dirección `http://localhost:4200/`. Se mostrará la aplicación funcionando.
