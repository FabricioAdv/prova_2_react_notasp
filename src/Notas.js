import React, { useState, useContext } from 'react';

import AppContext from './AppContext';

import useDidMount from './mountControlls';

function Notas ()
{
    let { autenticado, logout } = useContext(AppContext);

    var holdNpress;

    const [filtro, setFiltro] = useState('');
    const [notas, setNotas] = useState([]);
    const [novaNota, setNovaNota] = useState(false);
    const [selectNota, setSelectNota] = useState(false);
    const [holdNota, setHoldNota] = useState(false);
    const [auth] = useState(autenticado);

    const [novoTitulo, setNovoTitulo] = useState('');
    const [novaCategoria, setNovaCategoria] = useState('');
    const [novoConteudo, setNovoConteudo] = useState('');
    const [novaData] = useState(Date());

    const [mostraId, setMostraId] = useState(0);
    const [mostraTitulo, setMostraTitulo] = useState('');
    const [mostraCategoria, setMostraCategoria] = useState('');
    const [mostraConteudo, setMostraConteudo] = useState('');
    const [mostraData, setMostraData] = useState('');

    const [holdId, setHoldId] = useState(0);
    const [holdTitulo, setHoldTitulo] = useState('');

    //CRUD
    async function createNotas (nota)
    {
        const result = await fetch('http://localhost:4000/notas', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...nota
            })
        });

        console.log('Create result: ', result);

        await readNotas();

        setNovaNota(false);
        setSelectNota(false);
    }
    async function readNotas ()
    {
        const result = await fetch('http://localhost:4000/notas');
        const json = await result.json();

        setNotas(json);
    }
    async function readNota (id)
    {
        const result = await fetch(`http://localhost:4000/notas/${ id }`);
        const json = await result.json();

        setMostraId(json.id);
        setMostraTitulo(json.titulo);
        setMostraCategoria(json.categoria);
        setMostraConteudo(json.conteudo);
        setMostraData(json.data);

        await readNotas();
    }
    async function updateNotas (nota)
    {
        const result = await fetch(`http://localhost:4000/notas/${ nota.id }`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...nota
            })
        });

        console.log('Updade result: ', result);

        await readNotas();

        setNovaNota(false);
        setSelectNota(false);
    }
    async function deleteNotas (id)
    {
        const result = await fetch(`http://localhost:4000/notas/${ id }`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Delete result: ', result);

        await readNotas();

        setNovaNota(false);
        setSelectNota(false);
        setHoldNota(false);
    }

    useDidMount(() =>
    {
        if (!auth)
        {
            logout();
        }
        else
        {
            readNotas();
        }
    });

    function mostrarNota (id)
    {
        readNota(id);

        setNovaNota(false);
        setSelectNota(true);
    }

    function mostrarCadastroNota ()
    {
        setNovaNota(true);
        setSelectNota(false);
        setHoldNota(false);

        setMostraId(0);
    }

    // Controle de click de um item nam lista
    function mouseDown (id, titulo)
    {
        holdNpress = setTimeout(mostraHold, 500, id, titulo);
    }

    function mouseUp (id)
    {
        if (!holdNota)
        {
            mostrarNota(id);
        }

        clearTimeout(holdNpress);
    }

    function mostraHold (id, titulo)
    {
        setHoldId(id, setHoldTitulo(titulo, setHoldNota(true)));
    }

    const notasFiltradas = notas.filter(item => item.titulo.toLowerCase().indexOf(filtro.toLowerCase()) >= 0);

    function menuStyle (id)
    {
        var menStyle = 'list-group-item list-group-item-action';

        if (id === mostraId)
        {
            menStyle += ' active';
        }

        if (holdNota)
        {
            menStyle += ' disabled';
        }

        return menStyle
    }

    return (<>
        <div className="container my-5">
            <div className="row">
                <div className="col-auto">
                    <input className="form-control mb-4" placeholder="Pesquisar título" type="text" value={ filtro } onChange={ (e) => setFiltro(e.target.value) } />
                    <div className="row mb-3">
                        <div className="col"><h2>Todas as notas</h2></div>
                        <div className="col-auto"><button className="btn btn-primary" onClick={ (e) =>
                        {
                            mostrarCadastroNota();
                        } }>+</button></div>
                    </div>
                    <div className="list-group mb-3">
                        { notasFiltradas.map(nota => <button type="button" key={ nota.id } className={ menuStyle(nota.id) } onMouseDown={ (e) => { mouseDown(nota.id, nota.titulo) } } onMouseUp={ (e) => { mouseUp(nota.id) } }>{ nota.titulo }</button>) }
                    </div>
                    <div className="mb-3">
                        <div className="px-3 py-1 border-bottom border-3">
                            <span>Ações</span>
                        </div>
                        <div className="row px-3 pt-1">
                            <div className="col-7 border-bottom">Clicar</div>
                            <div className="col border-bottom">Abrir</div>
                        </div>
                        <div className="row px-3">
                            <div className="col-7">Clicar e segurar</div>
                            <div className="col">Opções</div>
                        </div>
                    </div>
                    { holdNota ? <>
                        <div className="border rounded-2 mb-3">
                            <div className="mx-3 my-2">
                                <span>Nota selecionada: { holdTitulo }</span>
                            </div>
                            <div className="mx-3 my-2">
                                <span>Apagar a nota selecionada?</span>
                            </div>
                            <div className="row mx-3 my-2">
                                <div className="col">
                                    <button className="btn btn-primary w-100" onClick={ (e) => { setHoldNota(false) } }>Cancelar</button>
                                </div>
                                <div className="col">
                                    <button className="btn btn-danger w-100" onClick={ (e) => deleteNotas(holdId) }>Apagar</button>
                                </div>
                            </div>
                        </div>
                    </> : "" }
                    <div>
                        <button className="btn btn-primary w-100" onClick={ logout }>Sair</button>
                    </div>
                </div>

                <div className="col">
                    { novaNota ? <>
                        <div>
                            <div>
                                <h2>Cadastro de notas</h2>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="titulo" className="form-label">Título</label>
                                <input type="text" className="form-control" id="titulo" value={ novoTitulo } onChange={ (e) => setNovoTitulo(e.target.value) } />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="categoria" className="form-label">Categoria</label>
                                <input type="text" className="form-control" id="categoria" value={ novaCategoria } onChange={ (e) => setNovaCategoria(e.target.value) } />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="conteudo" className="form-label">Conteudo</label>
                                <textarea type="text" className="form-control" id="conteudo" value={ novoConteudo } onChange={ (e) => setNovoConteudo(e.target.value) } />
                            </div>
                            <div className="text-end">
                                <button className="btn btn-primary" onClick={ (e) => createNotas(Object.assign({}, { titulo: novoTitulo, categoria: novaCategoria, conteudo: novoConteudo, data: novaData })) } > Cadastrar nota</button>
                            </div>
                        </div>
                    </> : "" }
                    { selectNota ? <>
                        <div>
                            <div className="row">
                                <div className="col">
                                    <h2>Alteração de notas</h2>
                                </div>
                                <div className="col text-end">
                                    <button className="btn btn-danger" onClick={ (e) => deleteNotas(mostraId) }>Apagar nota</button>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center my-4">
                                Data de alteração: { mostraData }
                            </div>
                            <div className="mb-3">
                                <label htmlFor="titulo" className="form-label">Título</label>
                                <input type="text" className="form-control" id="titulo" value={ mostraTitulo } onChange={ (e) => setMostraTitulo(e.target.value) } />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="categoria" className="form-label">Categoria</label>
                                <input type="text" className="form-control" id="categoria" value={ mostraCategoria } onChange={ (e) => setMostraCategoria(e.target.value) } />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="conteudo" className="form-label">Conteudo</label>
                                <textarea type="text" className="form-control" id="conteudo" value={ mostraConteudo } onChange={ (e) => setMostraConteudo(e.target.value) } />
                            </div>
                            <div className="text-end">
                                <button className="btn btn-primary" onClick={ (e) => updateNotas(Object.assign({}, { id: mostraId, titulo: mostraTitulo, categoria: mostraCategoria, conteudo: mostraConteudo, data: novaData })) } > Alterar nota</button>
                            </div>
                        </div>
                    </> : "" }
                    { !novaNota && !selectNota ? <>
                        <div>
                            <h2>Bem vindo</h2>
                        </div>
                    </> : "" }
                </div>
            </div>
        </div>
    </>
    );
}

export default Notas;