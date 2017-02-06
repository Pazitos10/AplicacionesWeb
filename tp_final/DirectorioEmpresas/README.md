# Directorio de Empresas
Esta aplicación permitirá el registro, geolocalización y búsqueda de empresas por distintas categorías. Hará uso de un servidor de nodeJS para realizar la geolocalización de las empresas registradas y de servicios web de Google para mostrar información adicional como reseñas realizadas por otros usuarios en [Google Places](https://developers.google.com/places/?hl=es)

## Features
* **Gestión de usuarios**. Permitirá registro de usuarios mediante el uso de distintas redes sociales, así como de usuarios propios del sistema

![](https://k61.kn3.net/A/C/8/F/A/6/521.png)

![](https://k61.kn3.net/B/6/F/8/5/8/414.png)


* **Detección automática de ubicación** del usuario utilizando HTML5. Al ingresar el usuario en el sistema mostrará su ubicación en el mapa
* **CRUD de Empresas**. Permtirá la gestión de Empresas
	* **Listado de Empresas**
		![](https://k61.kn3.net/5/9/F/3/B/9/377.png)
  * **Consulta de Empresas**
		![](https://k61.kn3.net/6/A/3/1/5/D/918.png)
  * **Creación de Empresas**
		![](https://k61.kn3.net/4/8/4/6/6/7/704.png)
  * **Edición de Empresas**
		![](https://k61.kn3.net/9/3/B/6/F/5/BA9.png)
  * **Eliminación de Empresas**
  	![](https://k61.kn3.net/4/D/7/F/8/9/EB5.png)
* **CRUD de Categorías**. Permitirá la gestión de Categorías
* **Servicio de geolocalización**. Luego de crear o modificar un registro de empresas se utilizarán servicios web para obtener las coordenadas de la dirección, de manera de poder mostrarla en el mapa
* **Información adicional**. Realizará un cruce de información con los servicios web de Google Places para mostrar al usuario información adicional acerca de la Empresa seleccionada
* **Búsqueda de empresas**. Permitirá la búsqueda de empresas por categorías y radio de distancia. Las mostrará en el mapa, junto con la información adicional que se haya obtenido de los servicios web detallados anteriormente.

![general_con_resultados](https://k61.kn3.net/8/0/7/E/5/5/CD1.png)

![general_con_reviews](https://k61.kn3.net/C/9/7/2/4/6/650.png)


### Diseño responsivo

![responsivo_con_resultados](https://k61.kn3.net/1/9/D/1/7/2/E40.png)

![responsivo_con_reviews](https://k61.kn3.net/3/2/6/D/B/F/197.png)

![responsivo_con_mapa](https://k61.kn3.net/8/C/B/1/3/F/764.png)
