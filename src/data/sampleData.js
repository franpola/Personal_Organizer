export const sampleTrips = [
  {
    id: 'trip-1',
    type: 'trip',
    name: 'Lisboa escapada',
    destination: 'Lisboa, Portugal',
    status: 'past',
    dates: { start: '2024-03-14', end: '2024-03-17' },
    flights: [
      { id: 'f1', from: 'MAD', to: 'LIS', date: '2024-03-14', time: '07:30', airline: 'Iberia', price: 89, confirmationCode: 'IB7823' },
      { id: 'f2', from: 'LIS', to: 'MAD', date: '2024-03-17', time: '21:15', airline: 'TAP', price: 74, confirmationCode: 'TP4421' }
    ],
    accommodation: [
      { id: 'a1', name: 'LX Boutique Hotel', address: 'Rua do Alecrim 12, Lisboa', checkIn: '2024-03-14', checkOut: '2024-03-17', price: 210, confirmationCode: 'BK-99213' }
    ],
    budget: { total: 600, currency: 'EUR' },
    expenses: [
      { id: 'e1', date: '2024-03-14', category: 'transport', amount: 163, description: 'Vuelos ida y vuelta' },
      { id: 'e2', date: '2024-03-14', category: 'accommodation', amount: 210, description: 'LX Boutique 3 noches' },
      { id: 'e3', date: '2024-03-15', category: 'food', amount: 38, description: 'Cena en Taberna da Rua das Flores' },
      { id: 'e4', date: '2024-03-16', category: 'activities', amount: 25, description: 'Tranvía 28 + Castillo São Jorge' }
    ],
    locations: [
      { id: 'l1', name: 'LX Factory', address: 'R. Rodrigues de Faria 103', lat: 38.7014, lng: -9.1768, notes: 'Mercado los domingos' },
      { id: 'l2', name: 'Miradouro da Graça', address: 'Largo da Graça', lat: 38.7176, lng: -9.1297, notes: 'Mejor atardecer de Lisboa' }
    ],
    debrief: {
      rating: 5,
      text: 'Increíble. El Alfama al atardecer es de otro mundo. Repetiría sin dudarlo, quizás más días para llegar hasta Sintra.',
      date: '2024-03-18'
    }
  },
  {
    id: 'trip-2',
    type: 'trip',
    name: 'Berlín verano',
    destination: 'Berlín, Alemania',
    status: 'planned',
    dates: { start: '2025-07-10', end: '2025-07-15' },
    flights: [
      { id: 'f3', from: 'MAD', to: 'BER', date: '2025-07-10', time: '06:55', airline: 'Ryanair', price: 67, confirmationCode: 'FR4490' },
      { id: 'f4', from: 'BER', to: 'MAD', date: '2025-07-15', time: '18:40', airline: 'Vueling', price: 82, confirmationCode: 'VY3312' }
    ],
    accommodation: [
      { id: 'a2', name: 'Michelberger Hotel', address: 'Warschauer Str. 39, Berlin', checkIn: '2025-07-10', checkOut: '2025-07-15', price: 480, confirmationCode: 'MB-5541' }
    ],
    budget: { total: 900, currency: 'EUR' },
    expenses: [
      { id: 'e5', date: '2025-07-10', category: 'transport', amount: 149, description: 'Vuelos ida y vuelta' },
      { id: 'e6', date: '2025-07-10', category: 'accommodation', amount: 480, description: 'Michelberger 5 noches' }
    ],
    locations: [
      { id: 'l3', name: 'Berghain', address: 'Am Wriezener Bahnhof, Berlin', lat: 52.5109, lng: 13.4404, notes: 'Intentar el sábado noche' },
      { id: 'l4', name: 'East Side Gallery', address: 'Mühlenstraße 3-100', lat: 52.5051, lng: 13.4399, notes: 'Trozo del Muro con murales' }
    ],
    debrief: null
  }
]

export const sampleEvents = [
  {
    id: 'event-1',
    type: 'event',
    name: 'Flamenco en Casa Patas',
    category: 'music',
    status: 'past',
    date: '2024-04-05',
    time: '22:30',
    venue: { name: 'Casa Patas', address: 'C/ Cañizares 10, Madrid', lat: 40.4122, lng: -3.7015 },
    price: 38,
    link: 'https://casapatas.com',
    howToGet: 'Metro Antón Martín (L1). Salida Atocha, 5 min andando.',
    debrief: {
      rating: 4,
      text: 'Espectáculo soberbio. La bailaora principal fue impresionante. Un poco masificado de turistas pero el arte lo compensa. Volería.',
      date: '2024-04-06'
    }
  },
  {
    id: 'event-2',
    type: 'event',
    name: 'Tech Meetup Madrid — IA en producción',
    category: 'tech',
    status: 'past',
    date: '2024-05-22',
    time: '19:00',
    venue: { name: 'Telefónica Innovation Hub', address: 'C/ Gran Vía 28, Madrid', lat: 40.4200, lng: -3.7022 },
    price: 0,
    link: 'https://meetup.com/tech-madrid',
    howToGet: 'Metro Gran Vía (L1, L5). Entrada por Gran Vía.',
    debrief: {
      rating: 3,
      text: 'Las charlas bien pero demasiado superficiales para mi nivel. El networking fue lo mejor — conocí a un dev que trabaja en Factorial. Para repetir si el tema es más específico.',
      date: '2024-05-23'
    }
  },
  {
    id: 'event-3',
    type: 'event',
    name: 'Exposición Sorolla — Museo Thyssen',
    category: 'art',
    status: 'planned',
    date: '2025-06-14',
    time: '11:00',
    venue: { name: 'Museo Thyssen-Bornemisza', address: 'Paseo del Prado 8, Madrid', lat: 40.4158, lng: -3.6942 },
    price: 15,
    link: 'https://museothyssen.org',
    howToGet: 'Metro Banco de España (L2). Paseo del Prado dirección Atocha, 3 min.',
    debrief: null
  }
]
