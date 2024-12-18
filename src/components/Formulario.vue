<template>
    <div class="box">
        <div class="columns">
        </div>
        <h2 class="title">Lista de Clientes Cadastrados</h2>
        <ul>
            <li v-for="cliente in clientesLocais" :key="cliente.email">
                <!--Nesse caso, o v-for está iterando sobre o array clientesLocais (um array de objetos cliente). Para cada elemento dentro desse array (cada cliente), um <li> será gerado. cliente é o nome da variável que irá armazenar cada item do array clientesLocais enquanto o v-for itera-->
                {{ cliente.nome }} - {{ cliente.email }} - CNPJ: {{ cliente.cnpj }} - Telefone: {{ cliente.telefone }}
                <!--o v for é uma diretiva do Vue usada para iterar sobre um array ou lista de dados e cria uma instancia do template para cada item da lista. Para cada item da lista (array), o conteudo da "li" será rendereizado com as informacoes desse cliente (nome, email. telefone, cnpj)-->
                <!--O v-for passa por cada uma das linhas identificando o nome, email, cnpj e telefone dos usuarios, criando um id para cada um-->
                <!--O atributo :key="cliente.email" é necessário quando estamos usando o v-for. A chave key serve para identificar de maneira única cada item na lista, nesse caso estamos usando o email como a chave, isso por que cada cliente tem um email diferente-->
                <span @click="abrirModalEdicao(cliente)" class="icon is-small">
                    <i class="fas fa-edit"></i>
                    <!--Quando clicamos para editarmos o cadastro (abrirModalEdicao), o programa sabe qual cliente editar por que é informado o id (passado pelo v for). Ao abrir o modal de edição do cadastro tem de haver as informacçoes persistidas referentes ao cliente em que cliquei para fazer a edição (nome, email, cnjp e telefone), e isso acontece justamente pois o vfor identificou previamente cada usuario cadastrado e o atribuiu um id unico -->
                </span>
                <span @click="confirmarExclusao(cliente)" class="icon is-small">
                    <i class="fas fa-trash-alt"></i>
                </span>
            </li>
        </ul>

        <!--Como o sistema sabe qual cliente foi clidado para que seja exibida as informaçoes daquele cliente especificamente e sejam persistidas apenas a aquele cliente ??? Quando o cliente clica no icone de edição do cliente (<span @click="abrirModalEdicao(cliente)"), o vue chama a função abrirModalEdicao(cliente), e o cliente que foi passado como argumento (cliente) é o cliente específico que está associado ao ícone que foi clicado.
        O cliente aqui é o objeto que representa um cliente da lista clientesLocais, que contem todas as informaçoes daquele cliente
        Cada item da lista <li> possui um cliente único, e ao clicar no ícone de edição, o Vue passa o objeto cliente correspondente a aquele item-->

        <!-- Modal de Edição do usuario ja cadastrado -->
        <div class="modal" :class="{ 'is-active': isModalEdicaoActive }">
            <div class="modal-background" @click="fecharModalEdicao"></div>
            <div class="modal-content">
                <div class="box">
                    <h2 class="title">Editar Cliente</h2>
                    <form @submit.prevent="salvarEdicao">
                        <div class="field">
                            <label class="label">Nome Completo</label>
                            <div class="control">
                                <input class="input" type="text" v-model="clienteEdicao.nome" required>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Email</label>
                            <div class="control">
                                <input class="input" type="email" v-model="clienteEdicao.email" required>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Telefone</label>
                            <div class="control">
                                <input class="input" type="telefone" v-model="clienteEdicao.telefone" required>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">CNPJ</label>
                            <div class="control">
                                <input class="input" type="cnpj" v-model="clienteEdicao.cnpj" required>
                            </div>
                        </div>
                        <div class="field">
                            <div class="control">
                                <button class="button is-link" type="submit">Salvar</button>
                                <button class="button" @click="fecharModalEdicao">Cancelar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="fecharModalEdicao"></button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import clienteHttp from '@/http';  //import para trazer nosso http do nosso index.ts!!!!

interface Cliente {  //é uma estrutura que organiza os objetos, ou seja, Bruno bruno@gmail.com (11)12345678 123456789, ou seja, ela descreve a forma/estrutura dos objetos que você deseja usar, especificando quais propriedades e métodos eles devem ter. As interfaces ajudam a garantir que os objetos sigam uma determinada forma. Não criei um arquivo só para as interfaces pois estava me confundindo
    id?: number  //id opcional
    nome: string;
    email: string;
    telefone: string;
    cnpj: string;
}
export default defineComponent({
    name: 'FormularioVue',
    props: {   //o props define as propriedades que o componente pode vir a receber
        clientes: {
            type: Array as PropType<Cliente[]>,
            required: true, //indica que a propriedade cliente é obrigatoria 
        },
    },
    emits: ['update-clientes'],  //referenciamos p/ sabermos que sera atualizado no componente pai App.vue

    setup(props, { emit }) {

        const isModalEdicaoActive = ref(false);
        const clienteEdicao = ref<Cliente>({ id: 0, nome: '', email: '', telefone: '', cnpj: '' });

        const clientesLocais = ref<Cliente[]>([...props.clientes]);  //clientesLocais não é uma função, mas sim uma variável reativa (um ref) que contém um array de objetos clientes, ou seja, recebo através da prop clientes. Logo, podemos afirmar que o valor de clientesLocais é copiado a prop clientes (passado pelo componente pai, App.vue linha 28, onde há uma função const clientes) e usamos o "[...props.clientes]" para fazer uma cópia dos dados, garantindo que a manipulação local não afete diretamente a prop original.

        watch(() => props.clientes, (novosClientes) => {   //observa as mudanças na prop clientes
            clientesLocais.value = [...novosClientes];     // Sincroniza os clientes locais com a prop 'clientes' atualizada
        });

        const abrirModalEdicao = (cliente: Cliente) => {  //as informaçoes previas do cliente estao armazenadas no ClientesLocais (clientes.value = response.data;  // Armazena os clientesLocais) no App.vue
            clienteEdicao.value = { ...cliente };  //Aqui a função está copiando todas as propriedades do cliente que foi clicado para a variável clienteEdicao. Isso significa que o clienteEdicao agora contém todas as informações do cliente.
            //clienteEdicao é um ref (uma variável reativa) que foi definida inicialmente com valores vazios (como nome: '', email: '', telefone: '', cnpj: ''), mas quando você clica no ícone de edição, ele é preenchido com os dados do cliente que foi passado.
            isModalEdicaoActive.value = true;
        };   //as alteraçoes feitas aqui na edição estão sob o v-model, que esta ligado com o clienteEdicao, ou seja, qualquer alteração feita nesses campos será refletida automaticamente na variável clienteEdicao

        const fecharModalEdicao = () => {
            isModalEdicaoActive.value = false;
        };

        //salvar edição do cliente -- A função salvarEdicao envia os dados atualizados para o servidor, e a lista de clientes é atualizada
        const salvarEdicao = async () => {
            try {
                const updatedCliente = { ...clienteEdicao.value }; //Aqui, esta criando uma cópia dos dados do cliente que está sendo editado.
                const response = await clienteHttp.put(`/clientes/${updatedCliente.id}`, updatedCliente);
                //Aqui estamos fazendo uma requisição HTTP PUT para a API. Essa requisição tem o objetivo de atualizar os dados de um cliente no servidor.

                // Atualiza a lista local com os dados atualizados
                const index = clientesLocais.value.findIndex(cliente => cliente.id === updatedCliente.id); //essa linha encontra o índice do cliente na lista local clientesLocais com o mesmo id que o cliente que foi atualizado, ou seja, volta o cliente editado para o mesmo local onde estava, e não para o final da lista (array)
                if (index !== -1) {
                    clientesLocais.value[index] = response.data;
                }

                // Emite a lista de clientes atualizada para o componente pai (App.vue), onde a lista original de clientes foi definida, para atualizar a lista de clientes no estado do componente pai.
                //utilizando spread operator [...] para garantir que não altere diretamente a lista original, mas faça uma cópia 
                //emit('update-clientes', [...clientesLocais.value]);

                fecharModalEdicao();
            } catch (error) {
                console.error('Erro ao salvar edição:', error);
            }
        };

        const confirmarExclusao = async (cliente: Cliente) => {
            if (confirm(`Tem certeza que deseja excluir o cliente ${cliente.nome}?`)) {
                try {
                    // Fazendo um DELETE na API
                    await clienteHttp.delete(`/clientes/${cliente.id}`);

                    // Atualiza a lista local removendo o cliente excluído
                    clientesLocais.value = clientesLocais.value.filter(c => c.id !== cliente.id);

                    // Emite a lista de clientes atualizada para o componente pai
                    //emit('update-clientes', [...clientesLocais.value]);

                    console.log('Cliente excluído:', cliente);
                } catch (error) {
                    console.error('Erro ao excluir cliente:', error);
                }
            }
        };


        const excluirCliente = (cliente: Cliente) => {
            clientesLocais.value = clientesLocais.value.filter(c => c.email !== cliente.email);
            emit('update-clientes', [...clientesLocais.value]); // Emite a lista atualizada para o pai
            console.log('Cliente excluído:', cliente);
        };


        return {
            isModalEdicaoActive,
            clienteEdicao,
            abrirModalEdicao,
            fecharModalEdicao,
            salvarEdicao,
            confirmarExclusao,
            excluirCliente,
            clientesLocais,
        };
    },
});
</script>

<style scoped>
.icon {
    margin-left: 10px;
    cursor: pointer;
}
</style>
