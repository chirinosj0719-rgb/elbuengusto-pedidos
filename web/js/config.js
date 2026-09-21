/*
 * Datos del negocio. Todo lo que el cliente podría querer cambiar sin tocar el código.
 * Lo marcado con "CONFIRMAR" no salió de sus materiales: validarlo con la tienda.
 */
window.EBG_CONFIG = {
  nombre: "Pastelería El Buen Gusto",

  // Número al que llegan los pedidos (el mismo de su link bit.ly/buengustowsp), con código de país.
  whatsappPedidos: "51946244168",
  whatsappVisibles: ["946 244 168", "946 244 217"],
  telefono: "(01) 445-8737",
  telefonoLink: "+5114458737",
  email: "ventas@elbuengusto.com.pe",

  direccion: "Calle Torre Tagle 249",
  distrito: "Miraflores, Lima",
  mapsLink: "https://www.google.com/maps/search/?api=1&query=Pasteler%C3%ADa+El+Buen+Gusto+Calle+Torre+Tagle+249+Miraflores",
  wazeLink: "https://www.waze.com/live-map/directions/pe/provincia-de-lima/miraflores/pasteleria-el-buen-gusto?to=place.ChIJkRKXmzzIBZERxcO5fI-c9KI",
  mapsEmbed: "https://maps.google.com/maps?q=Pasteler%C3%ADa%20El%20Buen%20Gusto%2C%20Calle%20Torre%20Tagle%20249%2C%20Miraflores%2C%20Lima&z=16&output=embed",

  // 0 = domingo … 6 = sábado
  diasAtencion: [1, 2, 3, 4, 5, 6],
  horarioTexto: "Lunes a sábado, de 8:00 a 20:00",
  franjas: [
    { desde: "08:00", hasta: "10:00" },
    { desde: "10:00", hasta: "12:00" },
    { desde: "12:00", hasta: "14:00" },
    { desde: "14:00", hasta: "16:00" },
    { desde: "16:00", hasta: "18:00" },
    { desde: "18:00", hasta: "20:00" }
  ],
  diasVisibles: 21,

  // Horas mínimas entre el pedido y la entrega.
  anticipacionEventos: 48,   // de la carta de bocaditos
  anticipacionCarta: 3,      // CONFIRMAR

  delivery: {
    activo: true,            // CONFIRMAR: hoy venden por Rappi / PedidosYa
    nota: "El costo depende del distrito. Te lo confirmamos por WhatsApp antes de preparar tu pedido.",
    distritos: [             // CONFIRMAR zonas de reparto
      "Miraflores", "San Isidro", "Barranco", "Surquillo", "Santiago de Surco",
      "San Borja", "Lince", "Jesús María", "Magdalena del Mar", "San Miguel",
      "Pueblo Libre", "Chorrillos", "La Molina", "Lima Cercado", "Otro distrito"
    ]
  },

  // CONFIRMAR medios de pago
  pagos: [
    { id: "yape", nombre: "Yape" },
    { id: "plin", nombre: "Plin" },
    { id: "transferencia", nombre: "Transferencia bancaria" },
    { id: "tienda", nombre: "Efectivo o tarjeta en tienda", soloRecojo: true }
  ],

  // Datos públicos de su perfil de Google. CONFIRMAR antes de publicar.
  resenas: { nota: "4.5", texto: "+2,400 reseñas en Google" },
  anios: "más de 70 años",

  redes: {
    instagram: "https://www.instagram.com/elbuengusto_pasteleria/",
    facebook: "https://www.facebook.com/PasteleriaElBuenGustoPeru/",
    notaPlevisani: "https://www.youtube.com/watch?v=YTJrXDJjJtY"
  }
};
