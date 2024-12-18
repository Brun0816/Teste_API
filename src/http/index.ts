import axios, { AxiosInstance } from "axios"
// Aqui temos uma instancia do axios, para que fique responsavel por fazer as requisiçoes
const clienteHttp: AxiosInstance = axios.create({
    baseURL: "http://localhost:3000/" //json server "API simulada" esta rodando nessa porta
})

export default clienteHttp     //exportará para nós o clienteHttp