import LdHead from "@/components/LdHead";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFloppyDisk, faMaximize, faTrashCan, faUsers, faXmark} from "@fortawesome/free-solid-svg-icons";
import LdTitle from "@/components/LdTitle";
import LdLoader from "@/components/LdLoader";
import {useLdAppContext} from "@/utils/LdAppProvider";
import {useEffect, useState} from "react";
import LdApiRequest from "@/utils/LdApiRequest";
import LdUser from "@/components/objects/LdUser";
import LdDialog from "@/components/LdDialog";
import LdSpace from "@/components/LdSpace";
import {faSquare as faUncheck, faSquareCheck as faCheck} from "@fortawesome/free-regular-svg-icons";

const Users = () => {

  const access = {
    sections: {
      user: 'Пользователи'
    },
    actions: {view: 'Просмотр', edit: 'Редактирование', delete: 'Удаление'}
  };

  const {getUser, addNotification, addDialogNotification} = useLdAppContext();

  const [users, setUsers] = useState([]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMiniLoading, setIsMiniLoading] = useState(false);
  let isListLoading = false;



  const loadUsers = async () => {
    if (isListLoading) return;

    const apiRequestRootUsers = new LdApiRequest('root', 'users');

    isListLoading = true;
    setIsMiniLoading(true);
    const response = await apiRequestRootUsers.request(getUser(), {});
    setIsMiniLoading(false);
    isListLoading = false;

    if (response.status === 1) {
      if (response.data.state === 1) {
        setUsers(response.data.users);
      } else addNotification(`State is: ${response.data.state}, error: ${response.data.error}`);
    } else addNotification(`Ошибка запроса: ${response.error}`);
  }

  const showUser = (id) => {
    let user = users.find((user => Number(user.id) === id));
    if (user) {
      user = {...user};
      user.active = Boolean(Number(user.active));

      user.access.root = Boolean(Number(user.access.root));
      for(const section in access.sections) {
        for(const action in access.actions) {
          user.access[section][action] = Boolean(Number(user.access[section][action]));
        }
      }

      setEditUser(user);
      setIsEditDialogOpen(true);
    }
    else addNotification('Пользователь не найден!');
  }
  const closeEditDialog = () => setIsEditDialogOpen(false);
  const clickEditClose = () => closeEditDialog();

  const changeEditUserIsActive = async (e) => {
    e.preventDefault();
    setEditUser({...editUser, ['active']: !editUser.active})
  }

  const changeEditUserIsRoot = async (e) => {
    e.preventDefault();
    setEditUser({...editUser, access: {...editUser.access, ['root']: !editUser.access.root}})
  }

  const changeEditUser = async (e, key) => {
    e.preventDefault();
    setEditUser({...editUser, [key]: e.target.value})
  }

  const changeEditUserAccess = async (e, section, action) => {
    e.preventDefault();
    setEditUser({...editUser, access: {...editUser.access, [section]: {...editUser.access[section], [action]: !editUser.access[section][action]}}})
  }

  const clickEditDelete = async (e) => {
    e.preventDefault();
  }

  const clickEditSave = async (e) => {
    e.preventDefault();

    const apiRequestRootUserEdit = new LdApiRequest('root', 'edit_user');

    let user = {...editUser}
    user.access.root = Number(user.access.root);
    for(const section in access.sections) {
      for(const action in access.actions) {
        user.access[section][action] = Number(user.access[section][action]);
      }
    }

    setIsLoading(true);
    const response = await apiRequestRootUserEdit.request(getUser(), {
      id: editUser.id,
      name: editUser.name,
      surname: editUser.surname,
      patronymic: editUser.patronymic,
      access: user.access,
      active: Number(editUser.active),
      note: editUser.note
    });
    setIsLoading(false);

    if (response.status === 1) {
      if (response.data.state === 1) {
        closeEditDialog();
        addNotification('Пользователь успешно сохранен!');
        await loadUsers();
      } else addDialogNotification(`State is: ${response.data.state}, error: ${response.data.error}`);
    } else addDialogNotification(`Ошибка запроса: ${response.error}`);

  }

  useEffect(() => {loadUsers();}, []);

  return (
    <>
      <LdHead/>
      <LdTitle><FontAwesomeIcon icon={faUsers}/> Пользователи</LdTitle>

      <table className='users-table'>
        <thead><tr><th>ID</th><th>Логин</th><th>Почта</th><th>ФИО</th><th>Активность</th><th>Регистрация</th><th>Примечание</th><th><FontAwesomeIcon icon={faMaximize}/></th></tr></thead>
        <tbody>{users.map(user => <LdUser key={user.id} user={user} show={showUser}/>)}</tbody>
      </table>

      <LdLoader loading={isMiniLoading} isMini={true}/>

      {editUser && <LdDialog isOpen={isEditDialogOpen} onClose={false}>
        <LdTitle>Пользователь {`${editUser.surname} ${editUser.name} ${editUser.patronymic}`}</LdTitle>
        <form onSubmit={clickEditSave} className="edit-form">
          <p>Введите или измените необходимые данные пользователя, а затем обязательно сохраните их.</p>

          <div className={'edit-form-column'}>
            <div className={'edit-form-semi-column'}>
              <label>ID</label>
              <input type="text" value={editUser.id} disabled/>
            </div>
            <LdSpace width={20}/>
            <div className={'edit-form-semi-column'}>
              <label>Статус</label>
              <button onClick={changeEditUserIsActive}  className={`check-button ${editUser.active ? '':'check-button-uncheck'}`}><FontAwesomeIcon icon={editUser.active ? faCheck : faUncheck}/> Активный</button>
            </div>

            <label>Фамилия</label>
            <input type="text" value={editUser.surname} placeholder="Не заполнено" maxLength="100" onChange={(e) => changeEditUser(e, 'surname')}/>

            <label>Имя</label>
            <input type="text" value={editUser.name} placeholder="Не заполнено" maxLength="100" onChange={(e) => changeEditUser(e, 'name')}/>

            <label>Отчество</label>
            <input type="text" value={editUser.patronymic} placeholder="Не заполнено" maxLength="100" onChange={(e) => changeEditUser(e, 'patronymic')}/>
          </div>

          <LdSpace width={20}/>

          <div className={'edit-form-column'}>
            <label>Логин</label>
            <input type="text" value={editUser.login} disabled/>

            <label>Почта</label>
            <input type="email" value={editUser.email} disabled/>

            <div className={'edit-form-semi-column'}>
              <label>Активность</label>
              <input type="text" value={editUser.last_activity_time} disabled/>
            </div>
            <LdSpace width={20}/>
            <div className={'edit-form-semi-column'}>
              <label>Регистрация</label>
              <input type="text" value={editUser.registration_time} disabled/>
            </div>

            <label>Примечание</label>
            <input type="text" value={editUser.note} placeholder="Не заполнено" maxLength="100" onChange={(e) => changeEditUser(e, 'note')}/>
          </div>

          <LdSpace height={20}/>
          <LdTitle>Права root-доступа</LdTitle>
          <p>Настройте права root-доступа пользователя по каждому разделу и действию.</p>

          <label>Root-доступ</label>
          <div className={'edit-form-semi-column'}>
            <button onClick={changeEditUserIsRoot} className={`check-button ${editUser.access.root ? '':'check-button-uncheck'}`}><FontAwesomeIcon icon={editUser.access.root ? faCheck : faUncheck}/> Активный</button>
          </div>

          {Object.keys(access.sections).map(section => (
            <>
              <label>{access.sections[section]}</label>
              {Object.keys(access.actions).map(action => (
                <>
                  {action !== 'view' && <LdSpace width={20}/>}
                  <div className={'edit-form-semi-column'}>
                    <button onClick={(e) => changeEditUserAccess(e, section, action)} className={`check-button ${editUser.access[section][action] ? '':'check-button-uncheck'}`}><FontAwesomeIcon icon={editUser.access[section][action] ? faCheck : faUncheck}/> {access.actions[action]}</button>
                  </div>
                </>
              ))}
            </>
          ))}

          <LdSpace height={40}/>

          <div className={'edit-form-semi-column'}>
            <button onClick={clickEditDelete} className={'red-button'}><FontAwesomeIcon icon={faTrashCan}/> Удалить</button>
          </div>
          <LdSpace width={20}/>
          <div className={'edit-form-column'}>
            <button onClick={clickEditClose}><FontAwesomeIcon icon={faXmark}/> Закрыть</button>
          </div>
          <LdSpace width={20}/>
          <div className={'edit-form-semi-column'}>
            <button type="submit" className={'green-button'}><FontAwesomeIcon icon={faFloppyDisk}/> Сохранить</button>
          </div>

        </form>
      </LdDialog>}

      <LdLoader loading={isLoading}/>
    </>
  );
};

export default Users;