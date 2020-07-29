let array = [
  {
    cantidad: 5,
    celular: {
      nombre_celular: "gato",
      precio_celular: 750,
    },
  },
  {
    cantidad: 10,
    celular: {
      nombre_celular: "gato1",
      precio_celular: 200,
    },
  },
  {
    cantidad: 17,
    celular: {
      nombre_celular: "perro",
      precio_celular: 300,
    },
  },
];

comprobar = false;
console.log(comprobar);
for (let index_1 = 0; index_1 < array.length; index_1++) {
  const element_1 = array[index_1];
  for (let index_2 = 0; index_2 < array.length; index_2++) {
    const element_2 = array[index_2];
    if (index_1 === index_2) {
      console.log("kk")
      break;
    }
    if (element_1.celular.nombre_celular === element_2.celular.nombre_celular) {
      comprobar = true;
      break;
    }
  }
}

console.log("ss", comprobar);
