import UserService from "../service"

export default function seedDefaultUser(){
    try {
        const user = new UserService().createAdmin()
        return user
    } catch (error) {
        console.error('❌ Error al sembrar el usuario por defecto:', error)
    }

}