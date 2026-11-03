import Keycloak from 'keycloak-js'

const url = import.meta.env.VITE_KEYCLOAK_URL
const realm = import.meta.env.VITE_KEYCLOAK_REALM
const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID

if (!url || !realm || !clientId) {
    throw new Error('Keycloak configuration is incomplete.')
}

const keycloak = new Keycloak({
    url,
    realm,
    clientId,
})

export default keycloak