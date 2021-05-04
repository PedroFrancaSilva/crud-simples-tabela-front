import "../styles/crud_table.css";
import "../styles/roboto.css";
import "../styles/material_icons.css";
import "react-toastify/dist/ReactToastify.min.css";
import 'react-overlay-loader/styles.css';
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Loader } from 'react-overlay-loader';

function CrudTable() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [fields, setFields] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
  });

  //Lida com Modais
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const handleAddClose = () => setShowAdd(false);
  const handleDeleteClose = () => setShowDelete(false);
  const handleEditClose = () => setShowEdit(false);
  const handleAddShow = () => setShowAdd(true);
  const handleEditShow = (user) => {
    setFields(user);
    setShowEdit(true);
  };
  const handleDeleteShow = (idUser) => {
    setFields({ _id: idUser });
    setShowDelete(true);
  };

  /**
   * Preenche a tabela com a lista de usuários cadastrados
   */
  useEffect(() => {
    setLoading(true);
    updateListUsers();
  }, []);

  async function updateListUsers() {
    let response = await axios(`${process.env.REACT_APP_API}/users/all`);
    setUsers(response.data);
    setLoading(false);
  }

  //Hadles:

  function handleFieldsChange(event) {
    fields[event.target.name] = event.target.value;
    setFields(fields);
  }

  async function handleAddSubmit(event) {
    let response;
    event.preventDefault();

    setLoading(true);
    handleAddClose();
    response = await axios.post(
      `${process.env.REACT_APP_API}/users/add`,
      fields
    );
    setLoading(false);

    if (response.data.result === "error") {
      toast.error("Não foi possível realizar o cadastro!");
    } else {
      toast.success("Cadastro realizado com sucesso!");
    }

    setFields({
      name: "",
      email: "",
      cpf: "",
      phone: "",
    });
    updateListUsers();
  }

  async function handleUpdateSubmit(event) {
    let response;
    event.preventDefault();

    setLoading(true);
    handleEditClose();
    response = await axios.put(
      `${process.env.REACT_APP_API}/users/update`,
      fields
    );
    setLoading(false);

    if (response.data.result === "error") {
      toast.error("Não foi possível editar o registro!");
    } else {
      toast.success("Edição realizada com sucesso!");
    }

    setFields({
      name: "",
      email: "",
      cpf: "",
      phone: "",
    });
    updateListUsers();
  }

  async function handleDeleteSubmit(event) {
    let response;
    event.preventDefault();

    setLoading(true);
    handleDeleteClose();
    response = await axios.delete(`${process.env.REACT_APP_API}/users/delete`, {
      data: fields,
    });
    setLoading(false);

    if (response.data.result === "error") {
      toast.error("Não foi possível apagar o registro!");
    } else {
      toast.success("O registro foi apagado com sucesso!");
    }

    setFields({
      name: "",
      email: "",
      cpf: "",
      phone: "",
    });

    updateListUsers();
  }

  return (
    <div>
      <div className="container-xl">
        <div className="table-responsive">
          <div className="table-wrapper">
            <div className="table-title">
              <div className="row">
                <div className="col-sm-6">
                  <h2>
                    Gerenciar <b>Usuários</b>
                  </h2>
                </div>
                <div className="col-sm-6">
                  <Button onClick={handleAddShow} className="btn btn-success">
                    <i className="material-icons">&#xE147;</i>{" "}
                    <span>Adicionar novo usuário</span>
                  </Button>
                </div>
              </div>
            </div>
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th></th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>CPF</th>
                  <th>Telefone</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} value={user._id}>
                    <td></td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.cpf}</td>
                    <td>{user.phone}</td>
                    <td>
                      <button
                        onClick={() => handleEditShow(user)}
                        className="edit"
                        data-toggle="modal"
                      >
                        <i
                          className="material-icons"
                          data-toggle="tooltip"
                          title="Edit"
                        >
                          &#xE254;
                        </i>
                      </button>
                      <button
                        onClick={() => handleDeleteShow(user._id)}
                        className="delete"
                        data-toggle="modal"
                      >
                        <i
                          className="material-icons"
                          data-toggle="tooltip"
                          title="Delete"
                        >
                          &#xE872;
                        </i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Modal HTML */}
      <Modal show={showDelete} onHide={handleDeleteClose}>
        <form onSubmit={handleDeleteSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Apagar Usuário</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Tem certeza que quer deletar os registros?</p>
            <p className="text-warning">
              <small>Esta ação não pode ser desfeita.</small>
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleDeleteClose} className="btn btn-default">
              <span>Cancelar</span>
            </Button>
            <Button type="submit" className="btn btn-danger">
              <span>Apagar</span>
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/**editUserModal */}
      <Modal show={showEdit} onHide={handleEditClose}>
        <form onSubmit={handleUpdateSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Usuário</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                name="name"
                defaultValue={fields.name}
                className="form-control"
                required
                onChange={handleFieldsChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                defaultValue={fields.email}
                className="form-control"
                required
                onChange={handleFieldsChange}
              />
            </div>
            <div className="form-group">
              <label>CPF</label>
              <input
                defaultValue={fields.cpf}
                name="cpf"
                className="form-control"
                required
                onChange={handleFieldsChange}
              />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input
                type="text"
                name="phone"
                defaultValue={fields.phone}
                className="form-control"
                required
                onChange={handleFieldsChange}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleEditClose} className="btn btn-default">
              <span>Cancelar</span>
            </Button>
            <Button type="submit" className="btn btn-info">
              <span>Salvar</span>
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/**Add User Modal */}
      <Modal show={showAdd} onHide={handleAddClose}>
        <form onSubmit={handleAddSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Adicionar Usuário</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                className="form-control"
                name="name"
                required
                onChange={handleFieldsChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                required
                onChange={handleFieldsChange}
              />
            </div>
            <div className="form-group">
              <label>CPF</label>
              <input
                className="form-control"
                required
                name="cpf"
                onChange={handleFieldsChange}
              />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                required
                onChange={handleFieldsChange}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleAddClose} className="btn btn-default">
              <span>Cancelar</span>
            </Button>
            <Button type="submit" className="btn btn-success">
              <span>Adicionar</span>
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ToastContainer />

      <Loader fullPage={loading} loading={loading} />
    </div>
  );
}

export default CrudTable;
