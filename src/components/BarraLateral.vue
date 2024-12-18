<template>
    <header>
        <h1>API TESTE</h1>
        <aside class="menu">
            <p class="menu-label">Menu</p>
            <ul class="menu-list">
                <li><a @click="abrirModalCadastro">Novo Cadastro</a></li>      <!--Esses dois @click indicam que ao clicar nas caixas com esses textos, alguma ação tem que acontecer, açoes essas determinadas por funçoes (const abrirModalCadastro, const abrirModalLogin, funçoes essas que estão aqui no BarraLateral mesmo) -->
                <li><a @click="abrirModalLogin">Já possuo Cadastro</a></li>
            </ul>
        </aside>

        <!-- Modal referente ao Novo Cadastro -->
        <div class="modal" :class="{ 'is-active': isModalCadastroActive }">
            <div class="modal-background" @click="fecharModalCadastro"></div>
            <div class="modal-content">
                <div class="box">
                    <h2 class="title">Cadastro de Cliente</h2>
                    <form @submit.prevent="finalizarCadastro">
                        <div class="field">
                            <label class="label">Nome Completo</label>
                            <div class="control">
                                <input class="input" type="text" v-model="nome" required>
                                <!--v-model é o recurso do vue, que cria um vinculo entre o valor do campo de entrada e a variavel. ou seja, quando o usuário digitar algo no campo de entrada, o valor de nome será automaticamente atualizado com o que foi digitado-->
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Email</label>
                            <div class="control">
                                <input class="input" type="email" v-model="email" required>
                            </div>
                            <p v-if="emailInvalido" class="help is-danger">O email precisa ser válido</p>
                            <!--caso email não seja valido, ou seja, não esteja no padrão pedido, exibir mensagem. Função correspondente é a const emailInvalido-->
                        </div>
                        <div class="field">
                            <label class="label">Confirmar Email</label>
                            <div class="control">
                                <input class="input" type="email" v-model="confirmarEmail" required>
                            </div>
                            <p v-if="emailsNaoCorrespondem" class="help is-danger">Os emails não coincidem</p>
                            <!--caso os emails não correspondam, exibir mensagem-->
                        </div>
                        <div class="field">
                            <label class="label">Telefone</label>
                            <div class="control">
                                <input class="input" type="telefone" v-model="telefone" required>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">CNPJ</label>
                            <div class="control">
                                <input class="input" type="cnpj" v-model="cnpj" required>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Senha</label>
                            <div class="control">
                                <input class="input" type="password" v-model="senha" required>
                            </div>
                            <p v-if="senhaCurta" class="help is-danger">A senha deve ter pelo menos 6 caracteres</p>
                            <!--caso a senha seja curta (menor que 6 digitos), exibir mensagem. Função correspondente é const senhacurta. Função correspondente é a const senhacurta -->
                        </div>
                        <div class="field">
                            <label class="label">Confirmar Senha</label>
                            <div class="control">
                                <input class="input" type="password" v-model="confirmarSenha" required>
                            </div>
                            <p v-if="senhasNaoCorrespondem" class="help is-danger">As senhas não coincidem</p>
                            <!--o v-if diz que caso as senhas não correspondam, exibir o seguinte texto. O v-if é condicional a uma função, função essa "senhasNaoCorrespondem (linha 149)"-->
                        </div>
                        <div class="field">
                            <div class="control">
                                <button class="button is-link" type="submit" :disabled="formInvalido">Cadastrar</button>
                                <button class="button" @click="fecharModalCadastro">Cancelar</button>
                            </div>
                            <!-- essa div, especificamente a linha button class "button is-link", representa que o valor dessa propriedade será reativa, ou seja, o botão ficará desabilitado (disabled) se a variável formInvalido for verdadeira. Se formInvalido for false, o botão será habilitado. Função correspondente é a const formInvalido -->
                        </div>
                    </form>
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="fecharModalCadastro"></button>
        </div>

        <!-- Modal referente a Já possuo Cadastro -->
        <div class="modal" :class="{ 'is-active': isModalLoginActive }">
            <div class="modal-background" @click="fecharModalLogin"></div>
            <div class="modal-content">
                <div class="box">
                    <h2 class="title">Login</h2>
                    <form @submit.prevent="finalizarLogin">
                        <div class="field">
                            <label class="label">Email</label>
                            <div class="control">
                                <input class="input" type="email" v-model="loginEmail" required>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Senha</label>
                            <div class="control">
                                <input class="input" type="password" v-model="loginSenha" required>
                            </div>
                        </div>
                        <div class="field">
                            <div class="control">
                                <button class="button is-link" type="submit">Login</button>
                                <button class="button" @click="fecharModalLogin">Cancelar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="fecharModalLogin"></button>
        </div>

    </header>
</template>

<script lang="ts">
import clienteHttp from '@/http';
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
    name: 'BarraLateral',
                    //o emit emite os eventos personalizados (nome que muda, email que muda, telefone que muda etc) para o componente pai
    setup(props, { emit }) {  //props: a props aqui é o primeiro argumento da função setup() e deveria conter as propriedades passadas para o componente, quero dizer, as props definidas no componente pai (App.vue) e deverão ser passadas para o componente filho, porem essa funçao não esta mais em uso, por que mesmo assim se eu retira-la, meu projeto dá erro ?
        const isModalCadastroActive = ref(false);   //ref(false) para manter modals fechadas até que elas sejam clicadas
        const isModalLoginActive = ref(false);
        const nome = ref('');
        const email = ref('');
        const confirmarEmail = ref('');
        const telefone = ref('');
        const cnpj = ref('');
        const senha = ref('');
        const confirmarSenha = ref('');
        const loginEmail = ref('');
        const loginSenha = ref('');

        const emailInvalido = computed(() => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;   //função padrao que indica a configuração do email "usuario@dominio.com"
            return !regex.test(email.value);
        });

        //computed() cria propriedades computadas, que são valores derivados de outras variáveis reativas. O valor de uma propriedade computada é automaticamente recalculado quando qualquer uma das variáveis que ela depende é alterada. Nesse caso, a propriedade computada emailsNaoCorrespondem depende das variáveis email e confirmarEmail.
        const emailsNaoCorrespondem = computed(() => email.value !== confirmarEmail.value); //função que anuncia caso os emails sejam diferentes (email.value = campo do email || confirmarEmail.value = campo de confirmar email) (!== significa diferentes)

        //xxxx.value são variáveis reativas. O .value é a maneira de acessar o valor dessas variáveis reativas.

        const senhaCurta = computed(() => senha.value.length < 6); //indica que a senha deve ter 6 digitos

        const senhasNaoCorrespondem = computed(() => senha.value !== confirmarSenha.value);

        const formInvalido = computed(() => {
            return emailInvalido.value || emailsNaoCorrespondem.value || senhaCurta.value || senhasNaoCorrespondem.value;   //função do botão cadastrar - indica que o botão "cadastrar" só sera habilitado caso todas as informaçoes estejam preenchidas corretamente. Caso idenfique que o formInvalido, retornar email invalido ou (||) email não correspondente ou senha fora do padrão ou senha não correspondente 
        });

        const abrirModalCadastro = () => {
            isModalCadastroActive.value = true;
        };

        const fecharModalCadastro = () => {
            isModalCadastroActive.value = false;
        };

        const abrirModalLogin = () => {
            isModalLoginActive.value = true;
        };

        const fecharModalLogin = () => {
            isModalLoginActive.value = false;
        };

        const finalizarCadastro = async () => {  //async significa função assíncrona, o que significa que ela pode usar await para esperar por uma chamada HTTP, antes de continuar a execução.
            try {     //try: usado para tentar executar o código que pode lançar um erro. Caso algo dê errado (por exemplo, se a requisição falhar), o controle será transferido para o bloco catch (linha 202).
                const novoCliente = { //a função está criando um objeto chamado novoCliente, que contém as informações inseridas pelo usuário no formulário. 
                    //As variáveis como nome, email, telefone, cnpj, e senha são variáveis reativas (por isso o ref), e seus valores são acessados com .value.
                    nome: nome.value,
                    email: email.value,
                    telefone: telefone.value,
                    cnpj: cnpj.value,
                    senha: senha.value,
                };



                //se o novo usuario, ao realizar o cadastro, esta sendo emitido a API corretamente, então imagino que o probelma esteja em como o App.vue esta lidando com a atualização. Quando emite o evento de finalizarCadastro aqui no BarraLateral, o App.vue deveria receber essa atualização e adicionar o novo cliente na lista imediatamente, mas isso não ta acontecendo!!!!!!! RESOLVIDO



                const response = await clienteHttp.post('/clientes', novoCliente); 
                //A variável clienteHttp é uma instância de um cliente HTTP, criada com Axios, para fazer requisições HTTP para o servidor, nesse caso, está fazendo uma requisição POST, enviando o obejto novoCliente como o corpo da requisição
                //A função post() é usada para enviar os dados do novoCliente para o servidor na URL /clientes
                //O await é usado aqui para esperar que a requisição HTTP termine antes de continuar a execução do código.

                console.log(response.data);  //Após a requisição ser concluída com sucesso, a resposta (response) que contém os dados do cliente recém cadastrado será exibida no console. O response.data normalmente contém os dados retornados pelo servidor. Vemos isso na pratica no "inspecionar" o console da pagina

                // Limpa os campos de entrada após sucesso no cadastro
                nome.value = '';
                email.value = '';
                confirmarEmail.value = '';
                telefone.value = '';
                cnpj.value = '';
                senha.value = '';
                confirmarSenha.value = '';

                // Fecha o modal após o cadastro
                fecharModalCadastro();

                // Adiciona o novo cliente à lista
                emit('update-clientes', response.data); // Emite o cliente recém cadastrado "update-cliente" para o componente pai
                                                        //O response.data contém os dados do novo cliente que foi cadastrado, e esses dados são enviados para o componente pai (App.vue), que usará esses dados para atualizar a lista de clientes

            } catch (error) {  //catch: Se um erro ocorrer no bloco try, ele é capturado aqui, e o erro é mostrado no console).
                console.error('Erro ao cadastrar cliente:', error);
            }
        };

        const finalizarLogin = () => {   //A função finalizarLogin é atribuída a uma constante, e ela não recebe nenhum parâmetro, por isso esta vazia. Isso significa que ela pode ser chamada quando necessário no código.
            console.log('Fazendo login:', { email: loginEmail.value }); //vai imprimir no console que esta fazendo o login de determinado usuario
            fecharModalLogin(); //chama a função fecharModalLogin (linha 167), para que a modal se feche
        };

        return {
            isModalCadastroActive,
            isModalLoginActive,
            nome,
            email,
            confirmarEmail,
            telefone,
            cnpj,
            senha,
            confirmarSenha,
            loginEmail,
            loginSenha,
            abrirModalCadastro,
            fecharModalCadastro,
            abrirModalLogin,
            fecharModalLogin,
            finalizarCadastro,
            finalizarLogin,
            emailInvalido,
            emailsNaoCorrespondem,
            senhaCurta,
            senhasNaoCorrespondem,
            formInvalido,
        };
    },
});
</script>

<style scoped>
header {
    background: rgb(104, 129, 11);
    width: 100%;
    height: 100vh;
    padding: 1.25rem;
}

@media only screen and (max-width: 768px) {
    header {
        padding: 2.5rem;
        height: auto;
    }
}

h1 {
    font-size: 200%;
    color: black;
}

p {
    color: black;
    font-size: 130%;
}

.help {
    font-size: 0.8rem;
    color: #f14668;
}
</style>
