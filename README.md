# Quero Açaí API

Api do projeto Fapeap, para conectar comerciantes de batedeiras de açaí com o mercado consumidor local no estado Amapá.

## Pré-requisitos

A aplicação necessita dos seguintes recursos:

- :dragon_face: Node.js (https://nodejs.org/en/)
- :memo: Code Editor (https://code.visualstudio.com/)
- 🐋 Docker (https://www.docker.com/get-started)

Optional:

- 🧶 :cat2: Yarn (https://yarnpkg.com/)

## Instalação

Com o terminal aberto dentro do projeto, utilize o gerenciador de pacotes: [yarn](https://classic.yarnpkg.com/en/docs/getting-started) para instalar as dependências do projeto ou o [npm](https://www.npmjs.com/get-npm).

```bash
yarn
```

```bash
npm install
```

## Docker

Utilize o docker para criar um container do banco de dados postgres, com as seguintes configurações abaixo:<br>Caso a porta **5433** já esteja em uso utilize outra.

```bash
$ docker run --name fapeap_postgres -e POSTGRES_PASSWORD=fapeap -p 5433:5432 -d postgres
```

Em seguida ponha o container pra rodar:

```bash
$ docker start fapeap_postgres
```

## DBeaver

Recomendo utilizar o [DBeaver](https://dbeaver.com/) para visualizar os dados no banco.

Após instalar o software, crie um database chamado: **projeto_fapeap**

![testee](https://user-images.githubusercontent.com/38565099/87255383-ac9b8800-c460-11ea-8cc7-7482e5720815.png)

## Migrations

Após ter seguido todos os passos acima, rode as migrations a partir do projeto no terminal:

```bash
yarn typeorm migration:run
```

## Servidor

Utilize o seguinte comando para subir a API em ambiente de desenvolvimento:

```bash
yarn dev:server
```
