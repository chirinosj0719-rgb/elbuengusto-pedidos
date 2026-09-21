/*
 * Catálogo de El Buen Gusto.
 * Fuente: "EBG Carta Delivery 2026-03-20.pdf" (vigente desde el 01/12/2025)
 *         "Carta Bocaditos EBG 10-12-2025.pdf" (vigente desde el 10/12/2025)
 *
 * Para cambiar un precio basta con editar el número aquí.
 *
 * Campos de cada producto:
 *   id        identificador único dentro de su catálogo (no cambiarlo si ya hay pedidos)
 *   nombre    como aparece en la web y en el mensaje de WhatsApp
 *   unidad    texto corto opcional ("x 5 und.")
 *   desc      descripción opcional
 *   precio    precio en soles (catálogo "carta")
 *   precios   { cantidad: precio } para bocaditos por 25 / 50 unidades (catálogo "eventos")
 *   opciones  sabores o variantes a elegir
 *   foto      nombre base de la imagen en /img (opcional)
 */
window.EBG_CATALOGO = {
  carta: {
    titulo: "Carta",
    nota: "Precios en soles por producto. Vigentes desde el 1 de diciembre de 2025, sujetos a disponibilidad.",
    categorias: [
      {
        id: "sanguchitos",
        nombre: "Mini sanguchitos",
        nota: "Cada pedido trae 5 unidades.",
        items: [
          { id: "asado-cebolla", nombre: "Sándwich de Asado con Cebolla Blanca", unidad: "x 5 und.", precio: 11.5, desc: "Relleno de asado de res y cebolla blanca dulce." },
          { id: "croissant-jamon-queso", nombre: "Croissant con Jamón y Queso", unidad: "x 5 und.", precio: 11.5, desc: "Croissant mini relleno de jamón inglés, queso gouda y un toque de mantequilla.", foto: "croissant" },
          { id: "lechon", nombre: "Sándwich de Lechón al Horno", unidad: "x 5 und.", precio: 14.5, desc: "En pan ciabatta, con cebolla y camote frito.", foto: "lechon" },
          { id: "pavo", nombre: "Sándwich de Pavo al Horno", unidad: "x 5 und.", precio: 14, desc: "En pan francés, con cebolla, mayonesa y lechuga." },
          { id: "petit-pollo", nombre: "Petit Pan de Pollo", unidad: "x 5 und.", precio: 10, desc: "Petit pan relleno de pollo con mayonesa, castañas y apio encurtido." },
          { id: "salame", nombre: "Sándwich de Salame", unidad: "x 5 und.", precio: 14, desc: "En pan ciabatta, con tomate, lechuga y un toque de mayonesa y mostaza." },
          { id: "triple", nombre: "Triple", unidad: "x 5 und.", precio: 15.5, desc: "Relleno de palta, tomate y huevo con mayonesa.", foto: "triple" },
          { id: "butifarritas", nombre: "Butifarritas", unidad: "x 5 und.", precio: 10, desc: "En francés suave, con jamón del país, cebolla y lechuga." },
          { id: "prosciutto", nombre: "Sándwich de Prosciutto y Ajo Encurtido", unidad: "x 5 und.", precio: 14.5, desc: "En pan ciabatta, con tomate y lechuga." },
          { id: "olivado", nombre: "Sándwich Olivado", unidad: "x 5 und.", precio: 9.5, desc: "En pan multigrano relleno de aceitunas verdes, pimiento y queso crema." },
          { id: "aceituna-huevo", nombre: "Sándwich de Aceituna con Huevo", unidad: "x 5 und.", precio: 9.5, desc: "Relleno de aceitunas con castañas, pasas y huevo con mayonesa." },
          { id: "pollo-durazno", nombre: "Sándwich de Pollo con Durazno", unidad: "x 5 und.", precio: 10, desc: "Relleno de pollo con mayonesa, castañas y apio encurtido." },
          { id: "espinaca-queso", nombre: "Sándwich de Espinaca y Queso", unidad: "x 5 und.", precio: 9.5, desc: "Relleno de espinaca con tocino y queso crema." },
          { id: "espinaca-zanahoria", nombre: "Sándwich de Espinaca y Zanahoria", unidad: "x 5 und.", precio: 9.5, desc: "Relleno de espinaca y zanahoria glaseada." },
          { id: "esparrago", nombre: "Enrollado de Espárrago", unidad: "x 5 und.", precio: 9, desc: "Con espárragos blancos y mayonesa." },
          { id: "croissant-pollo", nombre: "Croissant con Pollo", unidad: "x 5 und.", precio: 11.5, desc: "Croissant mini relleno de pollo con mayonesa, castañas y apio encurtido." }
        ]
      },
      {
        id: "dulces",
        nombre: "Dulces",
        nota: "Precio por unidad o porción.",
        items: [
          { id: "alfajor-miel", nombre: "Alfajor de Miel", precio: 4.9, foto: "alfajores" },
          { id: "alfajor-manjar", nombre: "Alfajor de Manjar Blanco", precio: 4.9 },
          { id: "brownie", nombre: "Brownie", precio: 5.5 },
          { id: "muffin", nombre: "Muffin", precio: 6.5, opciones: ["Manzana", "Chocochip"] },
          { id: "cupcake-zanahoria", nombre: "Cupcake de Zanahoria", precio: 6.9 },
          { id: "suspiro", nombre: "Suspiro a la Limeña", precio: 6.9 },
          { id: "relampago", nombre: "Relámpago", precio: 6.5, opciones: ["Chocolate", "Caramelo"], foto: "relampago-card" },
          { id: "bunuelo", nombre: "Buñuelo Relleno de Crema Pastelera", precio: 6.5 },
          { id: "milhojas-manjar", nombre: "Milhojas de Manjar", precio: 5.9 },
          { id: "panuelo", nombre: "Pañuelo Relleno de Manjar", precio: 5.5 },
          { id: "crema-volteada", nombre: "Crema Volteada", precio: 6.9 },
          { id: "cachito", nombre: "Cachito Relleno de Manjar Blanco", precio: 4.9 },
          { id: "cocada", nombre: "Cocada", precio: 5.5 },
          { id: "flan-yuca", nombre: "Flan de Yuca", precio: 5.9 },
          { id: "crostata-frutos-secos", nombre: "Crostata de Frutos Secos", precio: 7.9 },
          { id: "tres-leches", nombre: "Tres Leches de Vainilla", precio: 6.9 },
          { id: "tarta-queso", nombre: "Tarta de Queso", precio: 7.9 },
          { id: "bomba", nombre: "Bomba Rellena de Manjar", precio: 7.9 },
          { id: "strudel", nombre: "Strudel de Manzana", precio: 6.5 },
          { id: "porcion-budin", nombre: "Porción de Budín", precio: 6.9 },
          { id: "porcion-torta-chocolate", nombre: "Porción de Torta de Chocolate", precio: 8.9 },
          { id: "porcion-pie-limon", nombre: "Porción de Pie de Limón", precio: 7.9 }
        ]
      },
      {
        id: "bocaditos-dulces",
        nombre: "Bocaditos dulces",
        nota: "En cajitas de 8, 10 o 25 unidades.",
        items: [
          { id: "alfajorcitos-miel-10", nombre: "Alfajorcitos de Miel", unidad: "x 10 und.", precio: 10.5 },
          { id: "alfajorcitos-miel-25", nombre: "Alfajorcitos de Miel", unidad: "x 25 und.", precio: 25 },
          { id: "alfajorcitos-maicena-25", nombre: "Alfajorcitos de Maicena", unidad: "x 25 und.", precio: 23.5 },
          { id: "merenguitos-25", nombre: "Merenguitos Rellenos", unidad: "x 25 und.", precio: 25 },
          { id: "trufas-10", nombre: "Trufas", unidad: "x 10 und.", precio: 10.5 },
          { id: "trufas-especiales-10", nombre: "Trufas Especiales", unidad: "x 10 und.", precio: 12.5 },
          { id: "mana-10", nombre: "Maná", unidad: "x 10 und.", precio: 18 },
          { id: "bolita-coco-10", nombre: "Bolitas de Coco", unidad: "x 10 und.", precio: 10.5 },
          { id: "macarons-8", nombre: "Macarons", unidad: "x 8 und.", precio: 16 }
        ]
      },
      {
        id: "postres",
        nombre: "Postres enteros",
        nota: "Tortas, pies y kekes completos.",
        items: [
          { id: "keke-platano", nombre: "Keke de Plátano", precio: 24.9 },
          { id: "keke-zanahoria", nombre: "Keke de Zanahoria", precio: 28.9 },
          { id: "keke-ingles", nombre: "Keke Inglés", precio: 19.9 },
          { id: "disco", nombre: "Disco", precio: 44.9, opciones: ["Miel", "Manjar Blanco"] },
          { id: "pie-manzana", nombre: "Pie de Manzana", precio: 47.9 },
          { id: "pie-limon", nombre: "Pie de Limón", precio: 51.9 },
          { id: "torta-chocolate", nombre: "Torta de Chocolate", precio: 74.9 },
          { id: "carrot-cake", nombre: "Carrot Cake", precio: 49.9, foto: "carrot-cake" },
          { id: "tres-leches-vainilla", nombre: "Tres Leches de Vainilla", precio: 44.9 },
          { id: "tres-leches-chocolate", nombre: "Tres Leches de Chocolate", precio: 46.9 },
          { id: "turron-chocolate", nombre: "Turrón de Chocolate", precio: 41.9 },
          { id: "mousse-maracuya", nombre: "Mousse de Maracuyá", precio: 61.9 },
          { id: "terrina-chocolate", nombre: "Terrina de Chocolate", precio: 61.9 },
          { id: "milhojas-fresa", nombre: "Milhojas de Fresa", precio: 55.9 },
          { id: "crostata-frutas", nombre: "Crostata de Frutas Frescas", precio: 55.9 },
          { id: "crostata-frutos-secos-entera", nombre: "Crostata de Frutos Secos", precio: 54.9 },
          { id: "strudel-entero", nombre: "Strudel de Manzana", precio: 29.9 },
          { id: "torta-mana", nombre: "Torta de Maná", precio: 63.9 },
          { id: "torta-mana-doble", nombre: "Torta de Maná Doble", precio: 112.9 },
          { id: "encanelado", nombre: "Encanelado", precio: 52.9 },
          { id: "turron-dona-pepa", nombre: "Turrón de Doña Pepa", unidad: "x kg", precio: 48 },
          { id: "budin", nombre: "Budín", precio: 52.9 },
          { id: "red-velvet", nombre: "Torta Red Velvet", precio: 44.9 },
          { id: "pionono-chocolucuma", nombre: "Pionono Chocolúcuma", precio: 63.9 },
          { id: "pionono-frutas", nombre: "Pionono de Frutas", precio: 63.9 }
        ]
      },
      {
        id: "galleteria",
        nombre: "Galletería",
        items: [
          { id: "orejitas", nombre: "Orejitas de Chancho", unidad: "x 10 und.", precio: 7 },
          { id: "rosquitas", nombre: "Rosquitas", precio: 4.9 },
          { id: "lenguitas", nombre: "Lengüitas de Gato", precio: 6.5 },
          { id: "pita-chips", nombre: "Pita Chips", precio: 8.9 },
          { id: "palitos-queso", nombre: "Palitos de Queso", precio: 10.5 },
          { id: "galletas-punto", nombre: "Galletas de Punto", precio: 9 },
          { id: "biscotelas", nombre: "Biscotelas Grandes", unidad: "x 12 und.", precio: 9.9 }
        ]
      },
      {
        id: "salados",
        nombre: "Salados",
        nota: "Porciones individuales, bocaditos por 25 y pasteles enteros.",
        items: [
          { id: "empanada-carne", nombre: "Empanada de Carne", precio: 8.5 },
          { id: "pastel-porcion", nombre: "Pastel (porción)", precio: 8.5, opciones: ["Acelga", "Alcachofa"], foto: "acelga" },
          { id: "vol-au-vent-queso", nombre: "Vol au Vent de Queso", precio: 8.5 },
          { id: "vol-au-vent-champinones", nombre: "Vol au Vent de Champiñones", precio: 8.5 },
          { id: "empanaditas-picadillo-25", nombre: "Empanaditas de Picadillo", unidad: "x 25 und.", precio: 26.5 },
          { id: "mini-vol-au-vent-25", nombre: "Mini Vol au Vent de Queso", unidad: "x 25 und.", precio: 26.5 },
          { id: "enrollado-salchicha-25", nombre: "Enrollado de Salchicha", unidad: "x 25 und.", precio: 26.5 },
          { id: "pastel-acelga-entero", nombre: "Pastel de Acelga (entero)", precio: 65.9 },
          { id: "pastel-alcachofa-entero", nombre: "Pastel de Alcachofa (entero)", precio: 69.9 },
          { id: "pastel-pollo-entero", nombre: "Pastel de Pollo con Champiñones (entero)", precio: 65.9 },
          { id: "quiche-poro", nombre: "Quiche de Poro (entero)", precio: 55.9 },
          { id: "quiche-cebolla", nombre: "Quiche de Cebolla Caramelizada con Tocino (entero)", precio: 55.9 }
        ]
      },
      {
        id: "panes",
        nombre: "Panes",
        items: [
          { id: "mini-ciabatta-25", nombre: "Mini Ciabatta", unidad: "x 25 und.", precio: 12 },
          { id: "mini-butifarra-25", nombre: "Mini Pancitos para Butifarra", unidad: "x 25 und.", precio: 9.5 },
          { id: "mini-francesitos-25", nombre: "Mini Francesitos", unidad: "x 25 und.", precio: 11 },
          { id: "mini-croissant-25", nombre: "Mini Croissant", unidad: "x 25 und.", precio: 14 },
          { id: "petit-pan-25", nombre: "Petit Pan", unidad: "x 25 und.", precio: 9.5 },
          { id: "chancay", nombre: "Chancay", unidad: "x 3 und.", precio: 5.7 },
          { id: "tostadas", nombre: "Tostadas", precio: 5.5 },
          { id: "baguette", nombre: "Baguette", precio: 4 },
          { id: "molde-multigrano", nombre: "Pan de Molde Multigrano", precio: 9.9 },
          { id: "molde-yema", nombre: "Pan de Molde de Yema", precio: 7.9 },
          { id: "molde-pullman", nombre: "Pan de Molde Pullman (corte PYC)", precio: 17.5 },
          { id: "pan-yema", nombre: "Pan de Yema", unidad: "x 5 und.", precio: 4 },
          { id: "ciabatta-5", nombre: "Ciabatta", unidad: "x 5 und.", precio: 4 },
          { id: "brioche", nombre: "Brioche", precio: 1.9 },
          { id: "baguette-masa-madre", nombre: "Baguette de Masa Madre", precio: 5.5 },
          { id: "campesino-masa-madre", nombre: "Pan Campesino de Masa Madre", precio: 11.9 },
          { id: "campesino-multigrano", nombre: "Pan Campesino Multigrano de Masa Madre", precio: 14.9 },
          { id: "croissant-mantequilla", nombre: "Croissant de Mantequilla", precio: 5.9 }
        ]
      }
    ]
  },

  eventos: {
    titulo: "Bocaditos para eventos",
    nota: "Por 25 o 50 unidades. Pedidos con 48 horas de anticipación, sujetos a disponibilidad. Vigentes desde el 10 de diciembre de 2025.",
    categorias: [
      {
        id: "ev-sanguchitos",
        nombre: "Sanguchitos",
        items: [
          { id: "butifarras", nombre: "Butifarras Criollas", precios: { 25: 47, 50: 94 } },
          { id: "croissant-jamon-queso", nombre: "Croissant con Jamón y Queso", precios: { 25: 54.5, 50: 109 } },
          { id: "croissant-pollo", nombre: "Croissant con Pollo", precios: { 25: 54.5, 50: 109 } },
          { id: "enrollado-esparrago", nombre: "Enrollado de Espárrago", precios: { 25: 41, 50: 82 } },
          { id: "lechon-ciabatta", nombre: "Lechón en Pan Ciabatta", precios: { 25: 70, 50: 140 } },
          { id: "olivado-multigrano", nombre: "Olivado en Pan Multigrano", precios: { 25: 44, 50: 88 } },
          { id: "pavo-frances", nombre: "Pavo en Pan Francés", precios: { 25: 64.5, 50: 129 } },
          { id: "petit-jamon-queso", nombre: "Petit Pan con Jamón y Queso", precios: { 25: 46, 50: 92 } },
          { id: "petit-pollo", nombre: "Petit Pan con Pollo", precios: { 25: 46, 50: 92 } },
          { id: "prosciutto-ajos", nombre: "Prosciutto con Ajos Encurtidos", precios: { 25: 70, 50: 140 } },
          { id: "salame-ciabatta", nombre: "Salame Húngaro en Pan Ciabatta", precios: { 25: 67.5, 50: 135 } },
          { id: "sand-aceituna-huevo", nombre: "Sándwich de Aceituna con Huevo", precios: { 25: 44, 50: 88 } },
          { id: "sand-alcachofa-queso", nombre: "Sándwich de Alcachofa con Queso", precios: { 25: 54.5, 50: 109 } },
          { id: "sand-asado-cebolla", nombre: "Sándwich de Asado con Cebolla Dulce", precios: { 25: 54.5, 50: 109 } },
          { id: "sand-espinaca-tocino", nombre: "Sándwich de Espinaca con Tocino y Queso Crema", precios: { 25: 46.5, 50: 93 } },
          { id: "sand-espinaca-zanahoria", nombre: "Sándwich de Espinaca con Zanahoria Glaseada", precios: { 25: 46.5, 50: 93 } },
          { id: "sand-queso-champinones", nombre: "Sándwich de Queso y Champiñones", precios: { 25: 49, 50: 98 } },
          { id: "sand-triple", nombre: "Sándwich Triple Bocadito", desc: "Palta, tomate y huevo.", precios: { 25: 38, 50: 76 } },
          { id: "sand-jamon-queso", nombre: "Sándwich de Jamón y Queso", precios: { 25: 45, 50: 90 } },
          { id: "sand-pollo", nombre: "Sándwich de Pollo", precios: { 25: 45, 50: 90 } },
          { id: "sand-pollo-durazno", nombre: "Sándwich de Pollo con Durazno (Hawaiano)", precios: { 25: 47, 50: 94 } }
        ]
      },
      {
        id: "ev-salados",
        nombre: "Bocaditos salados",
        items: [
          { id: "empanadita-picadillo", nombre: "Empanadita de Picadillo", precios: { 25: 26.5, 50: 53 } },
          { id: "empanadita-carne", nombre: "Empanadita de Carne (hojaldre)", precios: { 25: 26.5, 50: 53 } },
          { id: "empanadita-queso", nombre: "Empanadita de Queso (hojaldre)", precios: { 25: 26.5, 50: 53 } },
          { id: "empanadita-acelga", nombre: "Empanadita de Acelga (hojaldre)", precios: { 25: 26.5, 50: 53 } },
          { id: "enrollado-salchicha", nombre: "Enrollado de Salchicha", precios: { 25: 26.5, 50: 53 } },
          { id: "pastelito-acelgas", nombre: "Pastelito de Acelgas", precios: { 48: 57.6 } },
          { id: "vol-au-vent-queso", nombre: "Vol au Vent de Queso", precios: { 25: 26.5, 50: 53 } }
        ]
      },
      {
        id: "ev-dulces",
        nombre: "Bocaditos dulces",
        items: [
          { id: "alfajor-miel", nombre: "Alfajor de Miel", precios: { 25: 25, 50: 50 } },
          { id: "alfajor-maicena", nombre: "Alfajor de Maicena", precios: { 25: 23.5, 50: 47 } },
          { id: "bolita-coco", nombre: "Bolita de Coco", precios: { 25: 25, 50: 50 } },
          { id: "bolita-mana", nombre: "Bolita de Maná", precios: { 25: 39.5, 50: 79 } },
          { id: "brownie", nombre: "Brownie", precios: { 25: 24.5, 50: 49 } },
          { id: "bunuelo-crema", nombre: "Buñuelo de Crema", precios: { 25: 26, 50: 52 } },
          { id: "relampago-chocolate", nombre: "Relámpago de Chocolate", precios: { 25: 27, 50: 54 } },
          { id: "relampago-miel", nombre: "Relámpago de Miel", precios: { 25: 27, 50: 54 } },
          { id: "cocadita", nombre: "Cocadita", precios: { 25: 25, 50: 50 } },
          { id: "encanelado", nombre: "Encanelado", precios: { 50: 50 } },
          { id: "guarguero", nombre: "Guargüero", precios: { 50: 60 } },
          { id: "merenguito", nombre: "Merenguito Relleno", precios: { 25: 25, 50: 50 } },
          { id: "mil-hojas", nombre: "Mil Hojas", precios: { 25: 25, 50: 50 } },
          { id: "mini-crumble", nombre: "Mini Crumble de Manzana", precios: { 25: 32.5, 50: 65 } },
          { id: "mini-pie-limon", nombre: "Mini Pie de Limón", precios: { 25: 32.5, 50: 65 } },
          { id: "mini-tartaleta", nombre: "Mini Tartaleta", opciones: ["Blueberry", "Durazno", "Fresa", "Maracuyá"], precios: { 25: 32.5, 50: 65 } },
          { id: "panuelito", nombre: "Pañuelito", precios: { 25: 25, 50: 50 } },
          { id: "pionono", nombre: "Pionono", precios: { 25: 22.5, 50: 45 } },
          { id: "trufa-chocolate", nombre: "Trufa de Chocolate", precios: { 25: 25.5, 50: 51 } },
          { id: "trufa-especial", nombre: "Trufa de Chocolate Especial", precios: { 25: 29, 50: 58 } },
          { id: "macarons", nombre: "Macarons", opciones: ["Chocolate", "Fresa", "Limón", "Maracuyá"], precios: { 25: 40, 50: 80 } },
          { id: "profiterol-fresa", nombre: "Profiterol de Fresa", precios: { 25: 48.5, 50: 97 } },
          { id: "mini-cupcake", nombre: "Mini Cupcake", precios: { 25: 36, 50: 72 } }
        ]
      },
      {
        id: "ev-panes",
        nombre: "Panes y galletería",
        items: [
          { id: "mini-ciabatta", nombre: "Mini Ciabatta", precios: { 25: 12, 50: 24 } },
          { id: "mini-frances", nombre: "Mini Francés", precios: { 25: 11, 50: 22 } },
          { id: "croissant-chico", nombre: "Croissant Chico", precios: { 25: 14, 50: 28 } },
          { id: "pan-butifarra", nombre: "Pan para Butifarra", precios: { 25: 9.5, 50: 19 } },
          { id: "petit-pan", nombre: "Petit Pan", precios: { 25: 9.5, 50: 19 } },
          { id: "mini-multigrano", nombre: "Mini Pan Multigrano", precios: { 25: 11, 50: 22 } },
          { id: "pullman-blanco", nombre: "Pan Pullman Blanco", precio: 17.5 },
          { id: "biscotelas", nombre: "Biscotelas", precio: 23 },
          { id: "orejitas", nombre: "Orejitas de Chancho", precios: { 25: 17.5, 50: 35 } }
        ]
      }
    ]
  }
};

/* Productos con foto que se muestran en "Los favoritos de la casa". */
window.EBG_FAVORITOS = [
  { catalogo: "carta", id: "alfajor-miel", texto: "Los de la nota con Sandra Plevisani." },
  { catalogo: "carta", id: "relampago", texto: "De chocolate o de caramelo." },
  { catalogo: "carta", id: "triple", texto: "Palta, tomate y huevo. Vienen 5." },
  { catalogo: "carta", id: "lechon", texto: "En pan ciabatta, con cebolla y camote frito. Vienen 5." },
  { catalogo: "carta", id: "croissant-jamon-queso", texto: "Jamón inglés y queso gouda. Vienen 5." },
  { catalogo: "carta", id: "carrot-cake", texto: "Postre entero, para compartir." }
];
