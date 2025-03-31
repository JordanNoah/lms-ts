import { eventBus } from '@/core/events/eventBus';

eventBus.on('UserRegistered', async (event) => {
    const {email, role} = event.data;
    console.log(`📧 [Auth Plugin] Bienvenido ${email}!`);
});

eventBus.on('UserLogedIn', async (event) => {
    const {email, role} = event.data;
    console.log(`📧 [Auth Plugin] ${email} ha iniciado sesión!`);
})
