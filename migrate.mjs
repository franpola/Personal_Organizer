import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://pnvcxkymqfoemynftfkj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBudmN4a3ltcWZvZW15bmZ0ZmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODgxOTAsImV4cCI6MjA5ODA2NDE5MH0.GoaavOzbmQ47SZcM6JLAZDFc8EGFZC3pV8e5qF_4TYY'
)

// ── Pega aquí el user_id de tu cuenta ──────────────────────────────────────
// Encuéntralo en: https://supabase.com/dashboard/project/pnvcxkymqfoemynftfkj/auth/users
const USER_ID = '917dc5ec-9daf-4293-89d9-8aa97fa09466'

const trips = [{"id":"trip-1782473136394-pdtutn","type":"trip","name":"Lleida Junio 2026","destination":"LLeida, España","status":"planned","dates":{"start":"2026-06-30","end":"2026-07-04"},"flights":[],"accommodation":[{"name":"Hotel Sansi Park","address":"Avenida Alcalde Porqueres 4 25008, Lleida","checkIn":"2026-06-30","checkOut":"2026-07-04","price":325.96,"confirmationCode":"6743664466    7699 ","id":"a-1782497556512-2o1acz"}],"budget":{"total":500,"currency":"EUR"},"expenses":[{"date":"2026-06-26","category":"transport","amount":99.75,"description":"tren ida y vuelta","id":"e-1782497983802-457fel"},{"date":"2026-06-26","category":"accommodation","amount":325.96,"description":"4 noches hotel","id":"e-1782498024850-y49pwm"}],"locations":[],"debrief":null,"transport":[{"mode":"train","from":"MADRID-PUERTA DE ATOCHA-ALMUDENA GRANDES","to":"LLEIDA-PIRINEUS","date":"2026-06-30","time":"17:27","operator":"","price":99.75,"confirmationCode":"XKPXLF","id":"t-1782497921483-wgnrxy"}]},{"id":"trip-1782472929453-l2pb2y","type":"trip","name":"Thailandia 2026","destination":"Jomtien, Thailandia","status":"planned","dates":{"start":"2026-10-12","end":"2026-10-21"},"flights":[],"accommodation":[],"budget":{"total":1500,"currency":"EUR"},"expenses":[],"locations":[],"debrief":null},{"id":"trip-1782400729321-v5g04p","type":"trip","name":"Crucero","destination":"Barcelona, España","status":"planned","dates":{"start":"2026-07-26","end":"2026-08-02"},"flights":[],"accommodation":[{"name":"Barco","address":"Barco Toscana","checkIn":"2026-07-26","checkOut":"2026-08-02","price":0,"confirmationCode":"35735262","id":"a-1782400902950-a6odil"}],"budget":{"total":200,"currency":"EUR"},"expenses":[{"date":"2026-07-25","category":"transport","amount":74.4,"description":"Tren ida y vuelta","id":"e-1782415919056-81g4e0"}],"locations":[],"debrief":null}]

const events = [{"id":"event-1782406978227-jqgycr","type":"event","name":"Cita con Elisabet Psonrie","category":"social","status":"planned","date":"2026-07-01","time":"18:00","venue":{"name":"www.psonrie.com","address":""},"price":72,"link":"","howToGet":"","debrief":null,"notes":"Pregunta inicial: QUÉ ES LO QUE QUIERES QUE CAMBIE EN TU VIDA? EN TI? esto lo puedes responder en lista, oración, historia, lo que se te ocurra, con tus palabras. Esta pregunta nos ayudará a fijar un primer objetivo terapéutico, lo que queremos empezar a lograr. La idea es que tomes contacto con aquello que te gustaría cambiar y no te has animado a proponértelo antes."}]

async function migrate() {
  if (USER_ID === 'PEGA_AQUI_TU_USER_ID') {
    console.error('❌ Primero rellena USER_ID en el script.')
    process.exit(1)
  }

  console.log('📦 Subiendo viajes...')
  for (const trip of trips) {
    const { error } = await supabase.from('trips').upsert({
      id: trip.id,
      user_id: USER_ID,
      data: trip,
    })
    if (error) console.error(`  ❌ ${trip.name}:`, error.message)
    else console.log(`  ✅ ${trip.name}`)
  }

  console.log('📦 Subiendo eventos...')
  for (const event of events) {
    const { error } = await supabase.from('events').upsert({
      id: event.id,
      user_id: USER_ID,
      data: event,
    })
    if (error) console.error(`  ❌ ${event.name}:`, error.message)
    else console.log(`  ✅ ${event.name}`)
  }

  console.log('🎉 Migración completada.')
}

migrate()
