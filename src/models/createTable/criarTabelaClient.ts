import modelTable from '../tabelaClients'

modelTable
    .sync()
    .then(() => console.log('Tabela "Cliente" criada com sucesso'))
    .catch(console.log)