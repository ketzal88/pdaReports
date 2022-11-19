# Exportacion a PDF

## Links
Programas necesarios para el proyecto:
- [Node](https://nodejs.org/download/release/v14.16.0/) - node-v14.16.0-x64.msi
- [Git](https://git-scm.com/download/win)

## Instalación Angular Cli

```sh
npm install -g @angular/cli
```

## Pasos para ejecutar el proyecto

### Clonar repositorio

```sh
cd pathFolder
git clone https://gitlab.com/pda-devops/front-end/angular-pda3.0.git
```

### Branch pdf

```sh
cd angular-pda3.0
git checkout pdf
```

### Instalar dependencias
```sh
cd angular-pda3.0
npm install
```

### Ejecutar localmente
```sh
cd angular-pda3.0
ng serve -c pdf
```

> Nota: `pathFolder` es la ruta del proyecto donde voy a descargar el proyecto.

## Pasos para movernos al branch de local
```sh
cd angular-pda3.0
git checkout pdf-jsalas
```

## Pasos para actualizar cambios del branch pdf al branch local
```sh
cd angular-pda3.0
git checkout pdf
git pull
git checkout pdf-jsalas
git pull origin pdf
git push
```

## Pasos para subir cambios al branch local
```sh
cd angular-pda3.0
git checkout pdf-jsalas
git add .
git commit -m "Mensaje de commit"
git push
```