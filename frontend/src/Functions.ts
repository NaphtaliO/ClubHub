import { URL, VERSION } from "@env";
import { useLogout } from "./hooks/useLogout"
import { useAppSelector } from "./hooks/hooks";
const { logout } = useLogout();
const user = useAppSelector((state) => state.user.value)

export const refreshUser = async () => {
    try {
        const response = await fetch(`${URL}/api/${VERSION}/event/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.token}`
            }
        })

        const json = await response.json()

        if (!response.ok) {
            if (json.error === "Request is not authorized") {
                useLogout()
            }
        }
        if (response.ok) {
            return json
        }

    } catch (error) {
        console.log((error as Error).message);
    }
}