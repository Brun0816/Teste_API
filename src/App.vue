<template>
  <main class="columns is-gapless is-multiline">
    <div class="column is-one-quarter">
      <BarraLateral @update-clientes="atualizarClientes" />
      <!--indica que quando o componente BarraLateral emeitir o evento update-clientes, o metodo atualizar clientes será chamado no componente pai-->
    </div>
    <div class="column is-three-quarter"> <!--Template refere-se ao layout da pagina-->
      <Formulario :clientes="clientes" @update-clientes="atualizarClientes" />
      <!-- @update-clientes é a forma abreviada de v-on: update-clientes aqui no Vue. v-on é uma diretiva usada para ouvir eventos, nesse caso o update-clientes. Significa que  quando um evento específico é disparado por um componente filho, o componente pai pode reagir a ele, no meu caso, a atualização da lista para um novo cliente cadastrado. 
      Quando o componente BarraLateral disparar (emitir) o evento update-clientes (linha 208 BarraLateral = emit('update-clientes', response.data);), o Vue irá chamar a função atualizarClientes (const atualizarClientes) aqui no App.vue.-->
    </div>
  </main>
</template>

<!--Componente filho (BarraLateral): O componente BarraLateral vai emitir o evento update-clientes em algum momento, nesse caso quando o botão "cadastrar" é clicado).
Componente pai: O componente pai ouve esse evento com @update-clientes="atualizarClientes", e, quando o evento é disparado, ele chama a função atualizarClientes que esta aqui no App.vue.-->


<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import BarraLateral from './components/BarraLateral.vue';
import Formulario from './components/Formulario.vue';   //importamos com o import oque queremos trazer até esta pagina, no caso, ate esse componente Pai
import clienteHttp from './http';  //import para trazer nosso http do nosso index.ts!!!!

// Definindo a interface Cliente aqui no App.vue
interface Cliente {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  cnpj: string;
}

export default defineComponent({
  name: 'App',
  components: { BarraLateral, Formulario },  //por obvio chamamos nossos dois componentes
  setup() {  //o setup é uma função e seu retorno sera oque se exibirá no template
    const clientes = ref<Cliente[]>([]);  // Agora o TypeScript entende o tipo de dados que será manipulado, pois declaramos na interface Cliente (linha 26)
    //aqui declaramos a constante cliente. Usamos const porque não pretendemos reatribuir essa variável a um novo valor, mas sim modificar seu conteúdo.
    //o ref cria uma referencia reativa, ou seja, o vue vai monitorar qualquer mudança e atualizar a interface quando o valor mudar. e começamos com o [] pois é um array, ou seja, lista, e vazia pois ainda não ha cliente cadastrados
    //usamos o const para declarar variaveis

    // Função carregarClientes: Essa função faz uma requisição HTTP para a API para obter todos os clientes e atualizar a variável clientes. Isso para que a lista de clientes seja atualizada toda vez que o cadastro for concluído
    const carregarClientes = async () => {   //async significa função assíncrona, o que significa que ela pode usar await para esperar por uma chamada HTTP, antes de continuar a execução.
      try {
        const response = await clienteHttp.get('/clientes');
        clientes.value = response.data;   //usamos o .value para acessar o valor de clientes. e ele é = response.data pois o response vai armazenar esse valor. isso tudo para atualizar a lista de clientes na interface 
      } catch (error) {
        console.error('Erro ao carregar lista de clientes:', error);
      }
      //try: usado para tentar executar o código que pode lançar um erro. Nesse caso, estou tentando fazer uma requisição HTTP, e pode acontecer algum erro.
      //catch (error): Se esse erro acontecer dentro do try, o controle será transferido para o catch (como um if e else). Nesse caso, o erro será impresso no console com a mensagem "erro ao carregar lista de clientes".
    };

    // Chama a função para carregar os clientes quando o componente é montado
    onMounted(() => {  //Utilizamos onMounted() para garantir que a requisição seja feita assim que o componente App.vue for montado na tela.
      carregarClientes();
    });

    // Função para adicionar um cliente à lista de forma reativa
    const adicionarCliente = (novocliente: Cliente) => { //O parâmetro cliente que a função recebe é um objeto do tipo Cliente (contendo os dados da Interface)
      clientes.value = [...clientes.value, novocliente]; //[...clientes.value, cliente] adiciona o novo cliente (cliente) ao final dessa cópia do array. Como resultado, o array agora contém todos os clientes anteriores, mais o novo cliente.
      //clientes.value é a forma de acessar o valor real armazenado dentro de clientes, que é um array de objetos do tipo Cliente. Ou seja, clientes.value já é o array de clientes existentes (no momento da chamada da função) 
      // Adiciona o novo cliente à lista criando uma nova referência
      //[...] (operador spread): é usado para "expandir" o conteúdo de um array em uma nova estrutura. No caso dessa linha, ele está pegando todos os itens que já existem dentro de clientes.value e criando uma nova cópia desses itens.

      //então podemos dizer que clientes.value (que representa a lista de clientes cadastrados naquele momento), é igual a lista copiada de clientes.value + o novo cliente cadastrado (novocliente)
    };  


    //adicionarCliente é uma função presente apenas no App.vue!!!!


    // Função chamada quando o evento 'update-clientes' é emitido (BarraLateral linha 208) 
    // Função que será chamada para atualizar a lista de clientes, ou seja, a função atualizarClientes chama a função adicionarClientes
    const atualizarClientes = (novoCliente: Cliente) => {  //novoCliente é o objeto contendo as informações do cliente recém-adicionado. Ele é enviado (do BarraLateral linha 208) para o componente pai (App.vue), onde o evento é escutado.
      adicionarCliente(novoCliente);  // Adiciona o cliente à lista sem recarregar todos
    };


//COMO ESTAVA FAZENDO ANTES O atualizarClientes
    // const atualizarClientes = (novoCliente: any) => { clientes.value.push(novoCliente);};
    // o clientes é uma variavel reativa do tipo ref, que esta aqui na linha 28, o .value é usado para acessar o valor dessa variavel (clientes)
    //Já o push() é uma função que adiciona um novo item ao final do array, no caso, Clientes (linha 28). Aqui, ele está adicionando o novoCliente (vem do nosso BarraLateral, especificamente linha 172, na qual criamos a const novoCliente, indicando oque sera recebido) à lista de clientes, que será armazenado no Clientes.value.
    //Aqui então estou passando fazendo o push de forma correta, ou seja trazendo o cliente para a lista corretamente, porem de forma "manual", oque exigia a atualização da pagina


    return {  //oque retornarmos estará disponivel no template (normalmente retornaremos variaveis, metodos etc)
      clientes,
      atualizarClientes
    };
  }
});
</script>
