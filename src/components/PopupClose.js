import React from "react"
import styled from "styled-components"

/**
 * Sent when a reader closes a popup with its ✕. Auto-scroll (HomeAutoplay)
 * stops waiting on that popup and carries on, instead of treating the click
 * as the reader taking over.
 */
export const POPUP_CLOSED_EVENT = "petabite:popup-closed"

/** A round ✕ for a popup's corner; place it with `className` / `style`. */
export function PopupClose({ onClose, className, style, label = "Close" }) {
  return (
    <CloseButton
      type="button"
      className={className}
      style={style}
      aria-label={label}
      data-autoplay-skip=""
      onClick={event => {
        event.preventDefault()
        event.stopPropagation()
        onClose?.()
        window.dispatchEvent(new Event(POPUP_CLOSED_EVENT))
      }}
    >
      <svg viewBox="0 0 12 12" aria-hidden="true">
        <path d="M3 3l6 6M9 3l-6 6" />
      </svg>
    </CloseButton>
  )
}

const CloseButton = styled.button`
  position: absolute;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 1.7em;
  height: 1.7em;
  min-width: 24px;
  min-height: 24px;
  padding: 0;
  border: 2px solid #111;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  color: #111;
  font-size: inherit;
  cursor: pointer;
  pointer-events: auto;
  transition: transform 0.15s ease;

  svg {
    width: 58%;
    height: 58%;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.2;
    stroke-linecap: round;
  }

  &:hover {
    transform: scale(1.1);
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent, #6b7fe6);
    outline-offset: 2px;
  }
`

export default PopupClose
