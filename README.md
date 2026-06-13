# Para poder correr el proyecto el proyecto necesitas tener estas herramientas en tu computadora:
* Java JDK 21
* Node.js 18 o mayor
* Git
* MySQL 

## Instalación del repositorio en tu computadora
Pon esto en una línea de comandos dentro de la carpeta donde quieres tener descargado el repositorio:
~~~
git clone https://github.com/AlexanderMaldonadoHernandez/GreenSwap.git
~~~

## Levantar el backend
Dentro de la carpeta backend, abrir el archivo src/main/resources/application.properties y verificar que las credenciales (usuario, contraseña y URL de la base de datos) coincidan con tu entorno local. Esto todavía queda pendiente porque no hay base de datos todavía.
Para poder conectarse a la base de datos se ejecuta:
~~~
mvnw spring-boot:run
~~~
Recuerda que se debe estar en la carpeta de backend para ejecutar el comando anterior.

### Conexión con la base de datos
Para que se tenga una conexión exitosa deben tener esto:
* Nombre de la base de datos: greenswap
* Contraseña de la base de datos: 1234
Asumiendo que ya tienen MySQL workbench instalado, deben de poner el siguiente comando para crear la base de datos:
~~~
CREATE DATABASE greenswap;
~~~

## Levantar el frontend
Primero que todo debemos estar en la carpeta de frontend:
~~~
cd frontend
~~~
Este comando es para descargar todas las dependencias necesarias para correr el frontend:
~~~
npm install
~~~
Para iniciar el servidor de manera local:
~~~
npm run dev
~~~
