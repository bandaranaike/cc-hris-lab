import { useEffect, useState } from 'react'
import keycloak from './auth/keycloak'

type HealthResponse = {
    status: string
    service: string
    dependencies?: Record<string, string>
    timestamp: string
}

function App() {
    const [result, setResult] = useState('Checking Laravel API…')
    const [loading, setLoading] = useState(false)

    const username =
        keycloak.tokenParsed?.preferred_username ??
        keycloak.tokenParsed?.sub ??
        'Unknown user'

    const roles =
        (keycloak.tokenParsed?.realm_access as { roles?: string[] } | undefined)
            ?.roles ?? []

    async function checkHealth() {
        setLoading(true)

        try {
            const response = await fetch('/api/health/ready')
            const data: HealthResponse = await response.json()

            setResult(JSON.stringify(data, null, 2))
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error'
            setResult(`API request failed: ${message}`)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void checkHealth()
    }, [])

    return (
        <main>
            <h1>CC HRIS Lab</h1>
            <p>React SPA → Keycloak SSO → edge Nginx → Laravel API</p>

            <p>
                Signed in as: <strong>{username}</strong>
            </p>

            <p>Roles: {roles.join(', ') || 'No realm roles in token'}</p>

            <button type="button" onClick={checkHealth} disabled={loading}>
                {loading ? 'Checking…' : 'Check API readiness'}
            </button>

            <button
                type="button"
                onClick={() => {
                    void keycloak.logout({
                        redirectUri: window.location.origin,
                    })
                }}
            >
                Sign out
            </button>

            <pre>{result}</pre>
        </main>
    )
}

export default App