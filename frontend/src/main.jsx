// frontend/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

//CAPTURE GOOGLE TOKENS BEFORE REACT LOADS
const params = new URLSearchParams(window.location.search)

const access = params.get("access_token")
const refresh = params.get("refresh_token")

if (access) {
  localStorage.setItem("access_token", access)
  localStorage.setItem("refresh_token", refresh)

  // clean URL (remove tokens)
  window.history.replaceState({}, "", "/")
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)