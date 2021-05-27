import React, { useState } from 'react';
import { useHistory, Route } from 'react-router-dom';

import Notas from './Notas';

import AppContext from './AppContext';

import useDidMount from './mountControlls';

function App ()
{
    let history = useHistory();

    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [autenticado, setAutenticado] = useState(false);
    const [loginInvalido, setLoginInvalido] = useState(false);

    useDidMount(() =>
    {
        if (autenticado)
        {
            history.push('/notas');
        }
        else
        {
            history.push('/login');
        }
    });

    function userAutenticado ()
    {
        setAutenticado(true, history.push('/notas'));
    }

    function logout ()
    {
        setNome('');
        setSenha('');
        setAutenticado(false, history.push('/login'));
    }

    const validarAcesso = function ()
    {
        if (nome === 'admin' && senha === 'admin')
        {
            userAutenticado();
        }
        else
        {
            setLoginInvalido(true);
        }
    }

    return <>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossOrigin="anonymous" />
        <AppContext.Provider value={ {
            autenticado, userAutenticado, logout
        } }>
            <Route exact path="/login" render={ () => <div>
                <div className="container">
                    <h1>Controle de acesso às notas pessoais</h1>
                    { loginInvalido && (<p style={ { color: "red" } }> Usuário e/ou senha inválido(s)! Tente novamente</p>) }
                    <label>Nome:</label>
                    <input className="form-control my-2" type="text" value={ nome } onChange={ (e) => setNome(e.target.value) } />
                    <label>Senha:</label>
                    <input className="form-control my-2" type="password" value={ senha } onChange={ (e) => setSenha(e.target.value) } />
                    <button className="btn btn-primary my-2 w-100" onClick={ validarAcesso }>Acessar</button>
                </div>
            </div>
            } />
            <Route exact path="/notas" render={ () => <div>
                <Notas />
            </div>
            } />
        </AppContext.Provider></>;
}

export default App;