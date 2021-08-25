import modelTable from '../tabelaOs'

modelTable
    .sync()
    .then(() => console.log('Tabela "OS" criada com sucesso'))
    .catch(console.log)