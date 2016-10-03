#Directorio de Empresas
Esta aplicación permitirá el registro, geolocalización y búsqueda de empresas por distintas categorías. Hará uso de un servidor de nodeJS para realizar la geolocalización de las empresas registradas y de servicios web de Google para mostrar información adicional como reseñas realizadas por otros usuarios en [Google Places](https://developers.google.com/places/?hl=es)

##Features
* **Gestión de usuarios**. Permitirá registro de usuarios mediante el uso de distintas redes sociales, así como de usuarios propios del sistema
* **Detección automática de ubicación** del usuario utilizando HTML5. Al ingresar el usuario en el sistema mostrará su ubicación en el mapa
* **CRUD de Empresas**. Permtirá la gestión de Empresas
* **CRUD de Categorías**. Permitirá la gestión de Categorías
* **CRUD de Localidades** ¿?
* **CRUD de Provincias** ¿?
* **Servicio de geolocalización**. Luego de crear o modificar un registro de empresas se utilizarán servicios web para obtener las coordenadas de la dirección, de manera de poder mostrarla en el mapa
* **Información adicional**. Realizará un cruce de información con los servicios web de Google Places para mostrar al usuario información adicional acerca de la Empresa seleccionada
* **Búsqueda de empresas**. Permitirá la búsqueda de empresas por categorías y las mostrará en el mapa, junto con la información adicional que se haya obtenido de los servicios web detallados anteriormente