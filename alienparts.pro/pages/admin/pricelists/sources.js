import LdHead from "@/components/LdHead";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faBan, faDatabase, faFloppyDisk,
  faMaximize,
  faPlus, faTrashCan, faXmark
} from "@fortawesome/free-solid-svg-icons";
import LdTitle from "@/components/LdTitle";
import LdButton from "@/components/LdButton";
import LdLoader from "@/components/LdLoader";
import {useEffect, useState} from "react";
import {useLdAppContext} from "@/utils/LdAppProvider";
import LdApiRequest from "@/utils/LdApiRequest";
import LdDialog from "@/components/LdDialog";
import LdSpace from "@/components/LdSpace";
import LdSource from "@/components/objects/LdSource";

const PriceListsSources = () => {

  const {getUser, addNotification, addDialogNotification} = useLdAppContext();

  const [sources, setSources] = useState([]);
  const [sourceTypes, setSourceTypes] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [sourceName, setSourceName] = useState('');
  const [sourceContractor, setSourceContractor] = useState(-1);
  const [sourceType, setSourceType] = useState(-1);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editSource, setEditSource] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMiniLoading, setIsMiniLoading] = useState(false);
  let isListLoading = false;

  const openDialog = () => {
    setIsDialogOpen(true);
    setSourceName('');
    setSourceContractor(-1);
    setSourceType(-1);
  }
  const closeDialog = () => setIsDialogOpen(false);
  const clickCancel = () => closeDialog();

  const clickAdd = async (e) => {
    e.preventDefault();
    openDialog();
  }

  const clickAddConfirm = async (e) => {
    e.preventDefault();

    if (sourceName.length === 0) addDialogNotification('Введите название!');
    else if (sourceContractor === -1) addDialogNotification('Выберите контрагента!');
    else if (sourceType === -1) addDialogNotification('Выберите тип источника!');
    else {

      const apiRequestPriceListAddSource = new LdApiRequest('pricelist', 'add_source');

      setIsLoading(true);
      const response = await apiRequestPriceListAddSource.request(getUser(), {name: sourceName,
        contractor_id: sourceContractor, type_id: sourceType});
      setIsLoading(false);

      if (response.status === 1) {
        if (response.data.state === 1) {
          closeDialog();
          addNotification('Источник данных успешно добавлен!');
          await loadSources();
        } else addDialogNotification(`State is: ${response.data.state}, error: ${response.data.error}`);
      } else addDialogNotification(`Ошибка запроса: ${response.error}`);

    }
  }

  const loadSources = async () => {
    if (isListLoading) return;

    const apiRequestPriceListSources = new LdApiRequest('pricelist', 'list_sources');

    isListLoading = true;
    setIsMiniLoading(true);
    const response = await apiRequestPriceListSources.request(getUser(), {});
    setIsMiniLoading(false);
    isListLoading = false;

    if (response.status === 1) {
      if (response.data.state === 1) {
        setSources(response.data.sources);
        setSourceTypes(response.data.source_types);
        setContractors(response.data.contractors);
      } else addNotification(`State is: ${response.data.state}, error: ${response.data.error}`);
    } else addNotification(`Ошибка запроса: ${response.error}`);
  }

  const showSource = (id) => {
    let source = sources.find((source => Number(source.id) === id));
    if (source) {
      setEditSource({...source});
      setIsEditDialogOpen(true);
    }
    else addNotification('Источник данных не найден!');
  }
  const closeEditDialog = () => setIsEditDialogOpen(false);
  const clickEditClose = () => closeEditDialog();

  const changeEditSource = async (e, key) => {
    e.preventDefault();
    setEditSource({...editSource, [key]: e.target.value})
  }
  const changeEditSourceData = async (e, key) => {
    e.preventDefault();
    setEditSource({...editSource, data: {...editSource.data, [key]: e.target.value}})
  }

  const clickEditDelete = async (e) => {
    e.preventDefault();
  }

  const clickEditSave = async (e) => {
    e.preventDefault();

    const apiRequestSourceEdit = new LdApiRequest('pricelist', 'edit_source');

    setIsLoading(true);
    const response = await apiRequestSourceEdit.request(getUser(), {
      id: editSource.id, note: editSource.note, data: editSource.data
    });
    setIsLoading(false);

    if (response.status === 1) {
      if (response.data.state === 1) {
        closeEditDialog();
        addNotification('Источник данных успешно сохранен!');
        await loadSources();
      } else addDialogNotification(`State is: ${response.data.state}, error: ${response.data.error}`);
    } else addDialogNotification(`Ошибка запроса: ${response.error}`);

  }

  useEffect(() => {loadSources();}, []);

  return (
    <>
      <LdHead/>
      <LdTitle><FontAwesomeIcon icon={faDatabase}/> Источники данных</LdTitle>
      <LdButton click={clickAdd}><FontAwesomeIcon icon={faPlus}/> Добавить</LdButton>

      <table className='pricelists-sources-table'>
        <thead><tr><th>ID</th><th>Название</th><th>Контрагент</th><th>Тип</th><th>Примечание</th><th><FontAwesomeIcon icon={faMaximize}/></th></tr></thead>
        <tbody>{sources.map(source => <LdSource key={source.id} source={source} show={showSource}/>)}</tbody>
      </table>

      <LdLoader loading={isMiniLoading} isMini={true}/>

      <LdDialog isOpen={isDialogOpen} onClose={false}>
        <LdTitle>Новый источник данных</LdTitle>
        <form onSubmit={clickAddConfirm} className="add-form">
          <p>Введите название источника, выберите контрагента и тип источника. Задать дополнительные настройки необходимо через редактирование источника данных.</p>

          <label>Название</label>
          <input type="text" placeholder="Введите название" onChange={(e) => setSourceName(e.target.value)}/>

          <label>Контрагент</label>
          <select name="list" className={`main-select ${sourceContractor !== -1 ? '':'main-select-unselect'}`} value={sourceContractor} onChange={(e) => setSourceContractor(Number(e.target.value))}>
            <option value={-1}>Выберите контрагента</option>
            {contractors.map(contractor => <option key={contractor.id} value={contractor.id}>{contractor.name}</option>)}
          </select>

          <label>Тип источника</label>
          <select name="list" className={`main-select ${sourceType !== -1 ? '':'main-select-unselect'}`} value={sourceType} onChange={(e) => setSourceType(Number(e.target.value))}>
            <option value={-1}>Выберите тип источника</option>
            {sourceTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
          </select>

          <LdSpace height={40}/>
          <button type="submit" className={'green-button'}><FontAwesomeIcon icon={faPlus}/> Добавить</button>
          <LdSpace height={10}/>
          <button onClick={clickCancel}><FontAwesomeIcon icon={faBan}/> Отмена</button>
        </form>
      </LdDialog>

      {editSource && <LdDialog isOpen={isEditDialogOpen} onClose={false}>
        <LdTitle>Источник данных {editSource.name}</LdTitle>
        <form onSubmit={clickEditSave} className="edit-form">
          <p>Введите или измените необходимые данные источника данных, а затем обязательно сохраните их.</p>

          <div className={'edit-form-column'}>
            <div className={'edit-form-semi-column'}>
              <label>ID</label>
              <input type="text" value={editSource.id} disabled/>
            </div>
            <LdSpace width={20}/>
            <div className={'edit-form-semi-column'}>
              <label>Тип источника</label>
              <input type="text" value={editSource.type_name} disabled/>
            </div>

            <label>Контрагент</label>
            <input type="text" value={editSource.contractor_name} disabled/>
          </div>

          <LdSpace width={20}/>

          <div className={'edit-form-column'}>
            <label>Название</label>
            <input type="text" value={editSource.name} disabled/>

            <label>Примечание</label>
            <input type="text" value={editSource.note} placeholder="Не заполнено" maxLength="100" onChange={(e) => changeEditSource(e, 'note')}/>
          </div>

          {editSource.type === 'link' && (
            <>
              <label>Ссылка на публичную папку</label>
              <input type="text" value={editSource.data.link} placeholder="Не заполнено, пример: https://example.com/folder/" maxLength="100" onChange={(e) => changeEditSourceData(e, 'link')}/>
            </>
          )}

          {editSource.type === 'email' && (
            <>
              <label>Почтовый ящик</label>
              <input type="email" value={editSource.data.email} placeholder="Не заполнено, пример: pricelist@example.com" maxLength="100" onChange={(e) => changeEditSourceData(e, 'email')}/>
            </>
          )}

          {editSource.type === 'ftp' && (
            <>
              <div className={'edit-form-column'}>
                <label>Адрес FTP-сервера</label>
                <input type="text" value={editSource.data.url} placeholder="Не заполнено, пример: ftp.example.com" maxLength="100" onChange={(e) => changeEditSourceData(e, 'url')}/>
              </div>

              <LdSpace width={20}/>

              <div className={'edit-form-column'}>
                <div className={'edit-form-semi-column'}>
                  <label>Логин</label>
                  <input type="text" value={editSource.data.login} placeholder="Не заполнено" maxLength="100" onChange={(e) => changeEditSourceData(e, 'login')}/>
                </div>
                <LdSpace width={20}/>
                <div className={'edit-form-semi-column'}>
                  <label>Пароль</label>
                  <input type="text" value={editSource.data.password} placeholder="Не заполнено" maxLength="100" onChange={(e) => changeEditSourceData(e, 'password')}/>
                </div>
              </div>
            </>
          )}

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

export default PriceListsSources;