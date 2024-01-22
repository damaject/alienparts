import LdHead from "@/components/LdHead";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faBan,
  faDesktop,
  faFloppyDisk,
  faMaximize,
  faPeopleGroup,
  faPlus, faTrash, faTrashCan,
  faUsers, faXmark
} from "@fortawesome/free-solid-svg-icons";
import LdTitle from "@/components/LdTitle";
import LdButton from "@/components/LdButton";
import {useEffect, useState} from "react";
import {useLdAppContext} from "@/utils/LdAppProvider";
import LdUser from "@/components/objects/LdUser";
import LdLoader from "@/components/LdLoader";
import LdApiRequest from "@/utils/LdApiRequest";
import LdStaff from "@/components/objects/LdStaff";
import LdDialog from "@/components/LdDialog";
import {faSquare as faUncheck, faSquareCheck as faCheck} from "@fortawesome/free-regular-svg-icons";
import LdSpace from "@/components/LdSpace";

const Staff = () => {

  const access = {
    sections: {
      staff: 'Сотрудники', contractor: 'Контрагенты', data_source: 'Источники данных',
      import_pricelist: 'Импорт прайс-листов', export_pricelist: 'Экспорт прайс-листов'
    },
    actions: {view: 'Просмотр', add: 'Добавление', edit: 'Редактирование', delete: 'Удаление'}
  };

  const {getUser, addNotification, addDialogNotification} = useLdAppContext();

  const [staff, setStaff] = useState([]);
  const [staffLogin, setStaffLogin] = useState('');
  const [staffJobTitle, setStaffJobTitle] = useState('');

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editStaff, setEditStaff] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMiniLoading, setIsMiniLoading] = useState(false);
  let isListLoading = false;

  const openDialog = () => {
    setIsDialogOpen(true);
    setStaffLogin('');
    setStaffJobTitle('');
  }
  const closeDialog = () => setIsDialogOpen(false);
  const clickCancel = () => closeDialog();

  const clickAdd = async (e) => {
    e.preventDefault();
    openDialog();
  }

  const clickAddConfirm = async (e) => {
    e.preventDefault();

    if (staffLogin.length === 0) addDialogNotification('Введите логин!');
    else if (staffJobTitle.length === 0) addDialogNotification('Введите должность!');
    else {

      const apiRequestStaffAdd = new LdApiRequest('staff', 'add');

      setIsLoading(true);
      const response = await apiRequestStaffAdd.request(getUser(), {login: staffLogin, job_title: staffJobTitle});
      setIsLoading(false);

      if (response.status === 1) {
        if (response.data.state === 1) {
          closeDialog();
          addNotification('Сотрудник успешно добавлен!');
          await loadStaff();
        } else addDialogNotification(`State is: ${response.data.state}, error: ${response.data.error}`);
      } else addDialogNotification(`Ошибка запроса: ${response.error}`);

    }
  }

  const loadStaff = async () => {
    if (isListLoading) return;

    const apiRequestStaffList = new LdApiRequest('staff', 'list');

    isListLoading = true;
    setIsMiniLoading(true);
    const response = await apiRequestStaffList.request(getUser(), {});
    setIsMiniLoading(false);
    isListLoading = false;

    if (response.status === 1) {
      if (response.data.state === 1) {
        setStaff(response.data.staff);
        console.log(response.data.staff);
      } else addNotification(`State is: ${response.data.state}, error: ${response.data.error}`);
    } else addNotification(`Ошибка запроса: ${response.error}`);
  }

  const showStaff = (id) => {
    let eStaff = staff.find((staff => Number(staff.id) === id));
    if (eStaff) {
      eStaff = {...eStaff};
      eStaff.active = Boolean(Number(eStaff.active));

      for(const section in access.sections) {
        for(const action in access.actions) {
          eStaff.access[section][action] = Boolean(Number(eStaff.access[section][action]));
        }
      }

      setEditStaff(eStaff);
      setIsEditDialogOpen(true);
    }
    else addNotification('Сотрудник не найден!');
  }
  const closeEditDialog = () => setIsEditDialogOpen(false);
  const clickEditClose = () => closeEditDialog();

  const changeEditStaffIsActive = async (e) => {
    e.preventDefault();
    setEditStaff({...editStaff, ['active']: !editStaff.active})
  }

  const changeEditStaff = async (e, key) => {
    e.preventDefault();
    setEditStaff({...editStaff, [key]: e.target.value})
  }

  const changeEditStaffAccess = async (e, section, action) => {
    e.preventDefault();
    setEditStaff({...editStaff, access: {...editStaff.access, [section]: {...editStaff.access[section], [action]: !editStaff.access[section][action]}}})
  }

  const clickEditDelete = async (e) => {
    e.preventDefault();
  }

  const clickEditSave = async (e) => {
    e.preventDefault();

    const apiRequestStaffEdit = new LdApiRequest('staff', 'edit');

    let eStaff = {...editStaff}
    for(const section in access.sections) {
      for(const action in access.actions) {
        eStaff.access[section][action] = Number(eStaff.access[section][action]);
      }
    }

    setIsLoading(true);
    const response = await apiRequestStaffEdit.request(getUser(), {
      id: editStaff.id,
      job_title: editStaff.job_title,
      access: eStaff.access,
      active: Number(editStaff.active),
      note: editStaff.note
    });
    setIsLoading(false);

    if (response.status === 1) {
      if (response.data.state === 1) {
        closeEditDialog();
        addNotification('Сотрудник успешно сохранен!');
        await loadStaff();
      } else addDialogNotification(`State is: ${response.data.state}, error: ${response.data.error}`);
    } else addDialogNotification(`Ошибка запроса: ${response.error}`);

  }

  useEffect(() => {loadStaff();}, []);

  return (
    <>
      <LdHead/>
      <LdTitle><FontAwesomeIcon icon={faPeopleGroup}/> Сотрудники</LdTitle>
      <LdButton click={clickAdd}><FontAwesomeIcon icon={faPlus}/> Добавить</LdButton>

      <table className='staff-table'>
        <thead><tr><th>ID</th><th>Почта</th><th>ФИО</th><th>Должность</th><th>Примечание</th><th><FontAwesomeIcon icon={faMaximize}/></th></tr></thead>
        <tbody>{staff.map(staff => <LdStaff key={staff.id} staff={staff} show={showStaff}/>)}</tbody>
      </table>

      <LdLoader loading={isMiniLoading} isMini={true}/>

      <LdDialog isOpen={isDialogOpen} onClose={false}>
        <LdTitle>Новый сотрудник</LdTitle>
        <form onSubmit={clickAddConfirm} className="add-form">
          <p>Введите логин или e-mail пользователя и введите должность сотрудника. Задать права доступа необходимо через редактирование сотрудника.</p>

          <label>Логин</label>
          <input type="text" placeholder="Введите логин или e-mail" onChange={(e) => setStaffLogin(e.target.value)}/>

          <label>Должность</label>
          <input type="text" placeholder="Введите должность, пример: Менеджер" maxLength="100" onChange={(e) => setStaffJobTitle(e.target.value)}/>

          <LdSpace height={40}/>
          <button type="submit" className={'green-button'}><FontAwesomeIcon icon={faPlus}/> Добавить</button>
          <LdSpace height={10}/>
          <button onClick={clickCancel}><FontAwesomeIcon icon={faBan}/> Отмена</button>
        </form>
      </LdDialog>

      {editStaff && <LdDialog isOpen={isEditDialogOpen} onClose={false}>
        <LdTitle>Сотрудник {`${editStaff.surname} ${editStaff.name} ${editStaff.patronymic}`}</LdTitle>
        <form onSubmit={clickEditSave} className="edit-form">
          <p>Введите или измените необходимые данные сотрудника, а затем обязательно сохраните их.</p>

          <div className={'edit-form-column'}>
            <label>ФИО</label>
            <input type="text" value={`${editStaff.surname} ${editStaff.name} ${editStaff.patronymic}`} disabled/>

            <label>Почта</label>
            <input type="email" value={editStaff.email} disabled/>
          </div>

          <LdSpace width={20}/>

          <div className={'edit-form-column'}>
            <div className={'edit-form-semi-column'}>
              <label>ID</label>
              <input type="text" value={editStaff.id} disabled/>
            </div>
            <LdSpace width={20}/>
            <div className={'edit-form-semi-column'}>
              <label>Статус</label>
              <button onClick={changeEditStaffIsActive}  className={`check-button ${editStaff.active ? '':'check-button-uncheck'}`}><FontAwesomeIcon icon={editStaff.active ? faCheck : faUncheck}/> Активный</button>
            </div>

            <label>Примечание</label>
            <input type="text" value={editStaff.note} placeholder="Не заполнено" maxLength="100" onChange={(e) => changeEditStaff(e, 'note')}/>
          </div>

          <div className={'edit-form-column'}>
            <label>Должность</label>
            <input type="text" value={editStaff.job_title} placeholder="Не заполнено" maxLength="100" onChange={(e) => changeEditStaff(e, 'job_title')}/>
          </div>

          <LdSpace height={20}/>
          <LdTitle>Права доступа</LdTitle>
          <p>Настройте права доступа сотрудника по каждому разделу и действию.</p>

          {Object.keys(access.sections).map(section => (
            <>
              <label>{access.sections[section]}</label>
              {Object.keys(access.actions).map(action => (
                <>
                  {action !== 'view' && <LdSpace width={20}/>}
                  <div className={'edit-form-semi-column'}>
                    <button onClick={(e) => changeEditStaffAccess(e, section, action)} className={`check-button ${editStaff.access[section][action] ? '':'check-button-uncheck'}`}><FontAwesomeIcon icon={editStaff.access[section][action] ? faCheck : faUncheck}/> {access.actions[action]}</button>
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

export default Staff;