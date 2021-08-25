import modelTable from '../tabelaLogins'

modelTable
    .sync()
    .then(() => console.log('Tabela "login" criada com sucesso'))
    .catch(console.log("Erro"))