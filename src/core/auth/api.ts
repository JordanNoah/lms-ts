import { eventBus } from "@/core/events/eventBus"
import {PluginAPI} from "@/core/http/pluginApi"
import { Context } from "hono"

const authPlugin: PluginAPI = {
    prefix: '/auth',
    routes: [
        {
            method: 'POST',
            path: '/login',
            handler: async (c:Context) => {
                eventBus.emit('UserLogedIn', {
                    email: 'soutjordan@gmail.com',
                    role: 'student'
                })
                return c.json({
                    message: 'Login successful',
                })
            }
        }
    ]
}

export default authPlugin