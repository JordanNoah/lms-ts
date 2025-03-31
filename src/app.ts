import Server from "./core/main";
import dotenv from 'dotenv';

(()=> {
    main()
})()


function main() {
    dotenv.config()

    new Server().start()
}