import { useState } from 'react'
import { Star, MessageSquare, CheckCircle } from 'lucide-react'
import { formatDate } from '../utils/helpers'
import './DebriefSection.css'

export default function DebriefSection({ debrief, onSave, planName }) {
  const [editing, setEditing] = useState(!debrief)
  const [rating, setRating] = useState(debrief?.rating || 0)
  const [hoverRating, setHoverRating] = useState(0)
  const [text, setText] = useState(debrief?.text || '')

  function handleSave() {
    if (!rating || !text.trim()) return
    onSave({ rating, text: text.trim(), date: new Date().toISOString().split('T')[0] })
    setEditing(false)
  }

  if (!editing && debrief) {
    return (
      <section className="debrief-section">
        <div className="debrief-header">
          <div className="debrief-title-row">
            <MessageSquare size={18} strokeWidth={1.5} />
            <h2>Cómo fue</h2>
          </div>
          <button className="btn-edit-debrief" onClick={() => setEditing(true)}>Editar</button>
        </div>
        <div className="debrief-display">
          <div className="debrief-rating-row">
            <div className="debrief-stars-lg">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={22}
                  fill={i < debrief.rating ? 'currentColor' : 'none'}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span className="debrief-date">Escrito el {formatDate(debrief.date)}</span>
          </div>
          <blockquote className="debrief-text">
            {debrief.text}
          </blockquote>
        </div>
      </section>
    )
  }

  return (
    <section className="debrief-section debrief-form-section">
      <div className="debrief-title-row">
        <MessageSquare size={18} strokeWidth={1.5} />
        <h2>¿Cómo fue {planName}?</h2>
      </div>
      <p className="debrief-hint">Anota tus impresiones mientras las tienes frescas.</p>

      <div className="debrief-rating-input">
        <span className="field-label">Valoración</span>
        <div className="stars-input">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              className="star-btn"
              onMouseEnter={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(i + 1)}
              aria-label={`${i + 1} estrellas`}
            >
              <Star
                size={28}
                fill={(hoverRating || rating) > i ? 'currentColor' : 'none'}
                strokeWidth={1.5}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="debrief-text-input">
        <label className="field-label" htmlFor="debrief-text">Notas</label>
        <textarea
          id="debrief-text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="¿Qué tal fue? ¿A quién conociste? ¿Volvería? ¿Qué cambiaría?"
          rows={5}
        />
      </div>

      <div className="debrief-actions">
        {debrief && (
          <button className="btn-cancel" onClick={() => setEditing(false)}>Cancelar</button>
        )}
        <button
          className="btn-save-debrief"
          onClick={handleSave}
          disabled={!rating || !text.trim()}
        >
          <CheckCircle size={16} />
          Guardar valoración
        </button>
      </div>
    </section>
  )
}
