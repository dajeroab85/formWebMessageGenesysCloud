# 📬 Formulario Web para Web Messaging en Genesys Cloud

Este proyecto permite implementar un **formulario web personalizado** que captura información del usuario antes de iniciar una sesión de chat mediante **Web Messaging** en **Genesys Cloud**.

## 🎯 Objetivo

Brindar una experiencia más personalizada en la atención al cliente, recopilando previamente datos clave del usuario (como nombre, correo electrónico y motivo de contacto). Estos datos se adjuntan a la interacción en Genesys Cloud, permitiendo a los agentes contar con contexto desde el inicio de la conversación.

## 🧰 Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- [Genesys Cloud Web Messaging SDK](https://developer.genesys.cloud/)

## ⚙️ Características principales

- Formulario simple y responsivo para captura de datos.
- Integración directa con el SDK de Web Messaging de Genesys Cloud.
- Envío de atributos personalizados junto con la sesión de chat.
- Mejora de la contextualización del agente desde el primer mensaje.

## 🚀 Instalación y uso

### 1. Clona el repositorio


git clone https://github.com/dajeroab85/formWebMessageGenesysCloud.git
cd formWebMessageGenesysCloud


### 2. Configura los valores del SDK

Edita el archivo script.js y actualiza los siguientes valores:
deploymentId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // Deployment ID generado en Genesys Cloud
environment: 'prod-usw2', // Región correspondiente a tu organización (ejemplo: 'prod', 'prod-euw1', 'prod-use1', etc.)

### 3.  Personaliza los campos del formulario

Modifica el archivo index.html para agregar o cambiar los campos necesarios (por ejemplo: nombre, correo, mensaje, etc.).
    💡 Recuerda: Si cambias los campos del formulario, también debes actualizar los selectores correspondientes en script.js.

### 4. Ejecuta el proyecto

Abre index.html desde un servidor web (por ejemplo, Apache, Nginx o mediante Live Server en VSCode) para probar el flujo completo.

🧪 Resultado
Los datos ingresados por el usuario se adjuntan como atributos de contexto en la conversación, visibles para los agentes en Genesys Cloud, mejorando la eficiencia y personalización de la atención.


📄 Licencia
Este proyecto se distribuye bajo la licencia MIT. Puedes utilizarlo, modificarlo y adaptarlo según tus necesidades.

🙋‍♂️ Autor
Desarrollado por Daniel Rodríguez Abreu
Especialista en implementación de Contact Centers con Genesys Cloud
