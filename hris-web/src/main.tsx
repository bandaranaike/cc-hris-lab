import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import keycloak from './auth/keycloak'

async function bootstrap() {
    try {
        const authenticated = await keycloak.init({
            onLoad: 'login-required',
            pkceMethod: 'S256',
            checkLoginIframe: false,
        })

        if (!authenticated) {
            await keycloak.login()
            return
        }

        window.setInterval(() => {
            keycloak.updateToken(60).catch(() => {
                void keycloak.login()
            })
        }, 30_000)

        createRoot(document.getElementById('root')!).render(
            <StrictMode>
                <App />
            </StrictMode>,
        )
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'

        createRoot(document.getElementById('root')!).render(
            <main>
                <h1>Authentication could not be initialized</h1>
                <pre>{message}</pre>
            </main>,
        )
    }
}

void bootstrap()