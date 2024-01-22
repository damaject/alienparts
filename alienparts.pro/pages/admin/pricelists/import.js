import LdHead from "@/components/LdHead";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faBan,
  faEdit,
  faFileArrowDown,
  faFloppyDisk,
  faMaximize,
  faPlus, faTrashCan,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import LdTitle from "@/components/LdTitle";
import LdButton from "@/components/LdButton";
import {useEffect, useState} from "react";
import {useLdAppContext} from "@/utils/LdAppProvider";
import LdLoader from "@/components/LdLoader";
import LdApiRequest from "@/utils/LdApiRequest";
import LdDialog from "@/components/LdDialog";
import LdSpace from "@/components/LdSpace";
import LdImport from "@/components/objects/LdImport";
import {faSquare as faUncheck, faSquareCheck as faCheck} from "@fortawesome/free-regular-svg-icons";
import LdTableMiniButton from "@/components/LdTableMiniButton";

const PriceListsImport = () => {

  const listTypes = [
    {id: 1, type: 'txt', name: 'Текстовый (.txt)', short_name: 'TXT'},
    {id: 2, type: 'csv', name: 'Текстовый (.csv)', short_name: 'CSV'},
    {id: 3, type: 'xlsx', name: 'Excel (.xlsx)', short_name: 'XLSX'},
  ];

  const listDelimiters = [
    {id: 1, type: 'type1', name: 'Запятая (,)'},
    {id: 2, type: 'type2', name: 'Точка с запятой (;)'},
    {id: 3, type: 'type3', name: 'Табуляция (   )'},
  ];

  const listStructures = [
    {id: 1, type: 'type1', name: 'Бренд, номер, название, цена, кол-во'},
    {id: 2, type: 'type2', name: 'Номер, бренд, цена, название, кол-во'},
    {id: 3, type: 'type3', name: 'Бренд, номер, название, кол-во, цена'},
    {id: 4, type: 'type4', name: 'Номер, название, бренд, кол-во, цена'},
    {id: 5, type: 'type5', name: 'Номер, бренд, цена, кол-во, название'},
  ];

  const listTemp = {id: 0, path: '', name: '', type_id: -1, delimiter_id: -1, structure_id: -1, filter_count: 0};

  const {getUser, addNotification, addDialogNotification} = useLdAppContext();

  const [imports, setImports] = useState([]);
  const [sources, setSources] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [filteredSources, setFilteredSources] = useState([]);
  const [filteredContractors, setFilteredContractors] = useState([]);
  const [importName, setImportName] = useState('');
  const [importContractor, setImportContractor] = useState(-1);
  const [importSource, setImportSource] = useState(-1);
  const [importFilesFrom, setImportFilesFrom] = useState('');

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editImport, setEditImport] = useState(null);

  const [isListDialogOpen, setIsListDialogOpen] = useState(false);
  const [editList, setEditList] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMiniLoading, setIsMiniLoading] = useState(false);
  let isListLoading = false;

  const openDialog = () => {
    setIsDialogOpen(true);
    setImportName('');
    setImportContractor(-1);
    setImportSource(-1);
    setFilteredSources(sources);
    setFilteredContractors(contractors);
  }
  const closeDialog = () => setIsDialogOpen(false);
  const clickCancel = () => closeDialog();

  const clickAdd = async (e) => {
    e.preventDefault();
    openDialog();
  }

  const selectContractor = async (e) => {
    e.preventDefault();
    const newContractor = Number(e.target.value);
    setImportContractor(newContractor);
    setImportSource(-1);
    if (newContractor === -1) {
      setFilteredSources(sources);
      setFilteredContractors(contractors);
    }
    else {
      setFilteredSources(sources.filter(source => Number(source.contractor_id) === newContractor));
    }
  }
  const selectSource = async (e) => {
    e.preventDefault();
    const newSource = Number(e.target.value);
    setImportSource(newSource);
    if (newSource === -1) {
      setImportContractor(-1);
      setFilteredSources(sources);
      setFilteredContractors(contractors);
    }
    else {
      const source = sources.find((source => Number(source.id) === newSource));
      setImportContractor(source ? Number(source.contractor_id) : -1);
    }
  }

  const clickAddConfirm = async (e) => {
    e.preventDefault();

    if (importName.length === 0) addDialogNotification('Введите название!');
    else if (importContractor === -1) addDialogNotification('Выберите контрагента!');
    else if (importSource === -1) addDialogNotification('Выберите источник данных!');
    else {

      const apiRequestPriceListAddImport = new LdApiRequest('pricelist', 'add_import');

      setIsLoading(true);
      const response = await apiRequestPriceListAddImport.request(getUser(), {name: importName,
        contractor_id: importContractor, source_id: importSource});
      setIsLoading(false);

      if (response.status === 1) {
        if (response.data.state === 1) {
          closeDialog();
          addNotification('Импорт успешно добавлен!');
          await loadImports();
        } else addDialogNotification(`State is: ${response.data.state}, error: ${response.data.error}`);
      } else addDialogNotification(`Ошибка запроса: ${response.error}`);

    }
  }

  const loadImports = async () => {
    if (isListLoading) return;

    const apiRequestPriceListImports = new LdApiRequest('pricelist', 'list_imports');

    isListLoading = true;
    setIsMiniLoading(true);
    const response = await apiRequestPriceListImports.request(getUser(), {});
    setIsMiniLoading(false);
    isListLoading = false;

    if (response.status === 1) {
      if (response.data.state === 1) {
        setImports(response.data.imports);
        setSources(response.data.sources);
        setContractors(response.data.contractors);
      } else addNotification(`State is: ${response.data.state}, error: ${response.data.error}`);
    } else addNotification(`Ошибка запроса: ${response.error}`);
  }

  const showImport = (id) => {
    let importList = imports.find((list => Number(list.id) === id));
    if (importList) {
      importList = {...importList};
      importList.active = Boolean(Number(importList.active));
      importList.shared = Boolean(Number(importList.shared));
      if (importList.source_type === 'hand') setImportFilesFrom(`Импортируемый файл в ручную`);
      else if (importList.source_type === 'link') setImportFilesFrom(`Импортируемые файлы по прямой ссылке (${importList.source_data.link})`);
      else if (importList.source_type === 'email') setImportFilesFrom(`Импортируемые файлы с почтового ящика (${importList.source_data.email})`);
      else if (importList.source_type === 'ftp') setImportFilesFrom(`Импортируемые файлы по FTP (${importList.source_data.url}, ${importList.source_data.login})`);
      else if (importList.source_type === 'custom') setImportFilesFrom(`Импортируемые файлы custom`);
      setEditImport(importList);
      setIsEditDialogOpen(true);
    }
    else addNotification('Прайс-лист импорта не найден!');
  }
  const closeEditDialog = () => setIsEditDialogOpen(false);
  const clickEditClose = () => closeEditDialog();

  const changeEditImportIsActive = async (e) => {
    e.preventDefault();
    setEditImport({...editImport, ['active']: !editImport.active})
  }
  const changeEditImportIsShared = async (e) => {
    e.preventDefault();
    setEditImport({...editImport, ['shared']: !editImport.shared})
  }
  const changeEditImport = async (e, key) => {
    e.preventDefault();
    setEditImport({...editImport, [key]: e.target.value})
  }
  const changeEditImportData = async (e, key) => {
    e.preventDefault();
    setEditImport({...editImport, data: {...editImport.data, [key]: e.target.value}})
  }

  const clickEditDelete = async (e) => {
    e.preventDefault();
  }
  const clickEditSave = async (e) => {
    e.preventDefault();

    const apiRequestImportEdit = new LdApiRequest('pricelist', 'edit_import');

    setIsLoading(true);
    const response = await apiRequestImportEdit.request(getUser(), {
      id: editImport.id,
      region: editImport.region,
      income_days: editImport.income_days,
      percent: editImport.percent,
      active: Number(editImport.active),
      shared: Number(editImport.shared),
      data: editImport.data,
      note: editImport.note
    });
    setIsLoading(false);

    if (response.status === 1) {
      if (response.data.state === 1) {
        closeEditDialog();
        addNotification('Прайс-лист успешно сохранен!');
        await loadImports();
      } else addDialogNotification(`State is: ${response.data.state}, error: ${response.data.error}`);
    } else addDialogNotification(`Ошибка запроса: ${response.error}`);

  }

  const clickAddList = async (e) => {
    e.preventDefault();
    let newList = {...listTemp};
    newList.id = editImport.data.lists.reduce((max, current) => (current.id > max ? current.id : max), 0) + 1;
    setEditImport({...editImport, data: {...editImport.data, lists: [...editImport.data.lists, newList]}});
    showList(newList);
  }
  const showList = (list) => {
    let eList = list;
    if (eList) {
      eList = {...eList};
      setEditList(eList);
      setIsListDialogOpen(true);
    }
    else addNotification('Файл прайс-листа не найден!');
  }
  const closeListDialog = () => setIsListDialogOpen(false);
  const clickListClose = () => closeListDialog();

  const getListItemNameById = (id, list) => {
    const item = list.find(item => item.id === id);
    return item ? item.name : '';
  };
  const getListItemShortNameById = (id, list) => {
    const item = list.find(item => item.id === id);
    return item ? item.short_name : '';
  };

  const changeEditList = async (e, key) => {
    e.preventDefault();
    setEditList({...editList, [key]: e.target.value})
  }
  const changeEditListSelect = async (e, key) => {
    e.preventDefault();
    setEditList({...editList, [key]: Number(e.target.value)})
  }
  const clickEditListAddFilter = async (e) => {
    e.preventDefault();
    setEditList({...editList, filter_count: (editList.filter_count + 1)})
  }
  const clickEditListSave = async (e) => {
    e.preventDefault();
    closeListDialog();
    setEditImport({...editImport, data: {...editImport.data, lists: editImport.data.lists.map(list => list.id === editList.id ? editList : list)}});
  }
  const clickEditListDelete = async (e) => {
    e.preventDefault();
    closeListDialog();
    setEditImport({...editImport, data: {...editImport.data, lists: editImport.data.lists.filter(list => list.id !== editList.id)}});
  }

  useEffect(() => {loadImports();}, []);

  return (
    <>
      <LdHead/>
      <LdTitle><FontAwesomeIcon icon={faFileArrowDown}/> Импорт прайс-листов</LdTitle>
      <LdButton click={clickAdd}><FontAwesomeIcon icon={faPlus}/> Добавить</LdButton>

      <table className='pricelists-import-table'>
        <thead><tr><th>ID</th><th>Название</th><th>Контрагент</th><th>Источник данных</th><th>Обновлено</th><th>Размер</th><th>Примечание</th><th><FontAwesomeIcon icon={faMaximize}/></th></tr></thead>
        <tbody>{imports.map(list => <LdImport key={list.id} list={list} show={showImport}/>)}</tbody>
      </table>

      <LdLoader loading={isMiniLoading} isMini={true}/>

      <LdDialog isOpen={isDialogOpen} onClose={false}>
        <LdTitle>Новый импорт</LdTitle>
        <form onSubmit={clickAddConfirm} className="add-form">
          <p>Введите название импорта, выберите контрагента и источник данных. Задать дополнительные настройки необходимо через редактирование импорта прайс-листа.</p>

          <label>Название</label>
          <input type="text" placeholder="Введите название" onChange={(e) => setImportName(e.target.value)}/>

          <label>Контрагент</label>
          <select name="list" className={`main-select ${importContractor !== -1 ? '':'main-select-unselect'}`} value={importContractor} onChange={selectContractor}>
            <option value={-1}>Выберите контрагента</option>
            {filteredContractors.map(contractor => <option key={contractor.id} value={contractor.id}>{contractor.name}</option>)}
          </select>

          <label>Источник данных</label>
          <select name="list" className={`main-select ${importSource !== -1 ? '':'main-select-unselect'}`} value={importSource} onChange={selectSource}>
            <option value={-1}>Выберите источник данных</option>
            {filteredSources.map(source => <option key={source.id} value={source.id}>{source.name} ({source.type_name})</option>)}
          </select>

          <LdSpace height={40}/>
          <button type="submit" className={'green-button'}><FontAwesomeIcon icon={faPlus}/> Добавить</button>
          <LdSpace height={10}/>
          <button onClick={clickCancel}><FontAwesomeIcon icon={faBan}/> Отмена</button>
        </form>
      </LdDialog>

      {editImport && <LdDialog isOpen={isEditDialogOpen} onClose={false}>
        <LdTitle>Импортируемый прайс-лист {editImport.name}</LdTitle>
        <form onSubmit={clickEditSave} className="edit-form">
          <p>Введите или измените необходимые данные для импорта прайс-листа, а затем обязательно сохраните их.</p>

          <div className={'edit-form-column'}>

            <label>ID</label>
            <input type="text" value={editImport.id} disabled/>

            <label>Контрагент</label>
            <input type="text" value={editImport.contractor_name} disabled/>

            <div className={'edit-form-semi-column'}>
              <label>Статус прайса</label>
              <button onClick={changeEditImportIsActive}  className={`check-button ${editImport.active ? '':'check-button-uncheck'}`}><FontAwesomeIcon icon={editImport.active ? faCheck : faUncheck}/> Активный</button>
            </div>
            <LdSpace width={20}/>
            <div className={'edit-form-semi-column'}>
              <label>Доступность прайса</label>
              <button onClick={changeEditImportIsShared} className={`check-button ${editImport.shared ? '':'check-button-uncheck'}`}><FontAwesomeIcon icon={editImport.shared ? faCheck : faUncheck}/> Публичный</button>
            </div>

            <label>Регион</label>
            <input type="text" value={editImport.region} placeholder="Не заполнено, например: Москва" maxLength="20" onChange={(e) => changeEditImport(e, 'region')}/>
          </div>

          <LdSpace width={20}/>

          <div className={'edit-form-column'}>
            <label>Название</label>
            <input type="text" value={editImport.name} disabled/>

            <label>Источник данных</label>
            <input type="text" value={`${editImport.source_name} (${editImport.source_type_name})`} disabled/>

            <div className={'edit-form-semi-column'}>
              <label>Наценка</label>
              <input type="number" value={editImport.percent} step="0.01" min="0.5" max="10.0" onChange={(e) => changeEditImport(e, 'percent')}/>
            </div>
            <LdSpace width={20}/>
            <div className={'edit-form-semi-column'}>
              <label>Сроки поставки</label>
              <input type="text" value={editImport.income_days} placeholder="Не заполнено" maxLength="10" onChange={(e) => changeEditImport(e, 'income_days')}/>
            </div>

            <label>Примечание</label>
            <input type="text" value={editImport.note} placeholder="Не заполнено" maxLength="100" onChange={(e) => changeEditImport(e, 'note')}/>
          </div>

          {/*{editSource.type === 'link' && (*/}
          {/*  <>*/}
          {/*    <label>Ссылка на публичную папку</label>*/}
          {/*    <input type="text" value={editSource.data.link} placeholder="Не заполнено, пример: https://example.com/folder/" maxLength="100" onChange={(e) => changeEditSourceData(e, 'link')}/>*/}
          {/*  </>*/}
          {/*)}*/}

          {/*{editSource.type === 'email' && (*/}
          {/*  <>*/}
          {/*    <label>Почтовый ящик</label>*/}
          {/*    <input type="email" value={editSource.data.email} placeholder="Не заполнено, пример: pricelist@example.com" maxLength="100" onChange={(e) => changeEditSourceData(e, 'email')}/>*/}
          {/*  </>*/}
          {/*)}*/}

          <label>{importFilesFrom}</label>
          <table className='pricelists-import-item-table'>
            <thead><tr><th>Путь к файлу</th><th>Название</th><th>Формат</th><th>Разделитель</th><th>Структура</th><th>Фильтры</th><th><FontAwesomeIcon icon={faEdit}/></th></tr></thead>
            <tbody>
              {editImport.data.lists.map(list =>
                <tr>
                  <td>{list.path}</td>
                  <td>{list.name}</td>
                  <td>{getListItemShortNameById(list.type_id, listTypes)}</td>
                  <td>{getListItemNameById(list.delimiter_id, listDelimiters)}</td>
                  <td>{getListItemNameById(list.structure_id, listStructures)}</td>
                  <td>{list.filter_count}</td>
                  <td><LdTableMiniButton click={() => showList(list)}><FontAwesomeIcon icon={faEdit}/></LdTableMiniButton></td>
                </tr>)
              }
            </tbody>
          </table>
          <button onClick={clickAddList}><FontAwesomeIcon icon={faAdd}/> Добавить</button>

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

      {editList && <LdDialog isOpen={isListDialogOpen} onClose={false}>
        <LdTitle>Редактирование файла</LdTitle>
        <form onSubmit={clickEditListSave} className="edit-list-form">
          <p>Введите путь к файлу, его название, выберите формат, разделитель и структуру файла, а также добавите фильтрацию.</p>

          <label>Путь к файлу</label>
          <input type="text" value={editList.path} placeholder="Не заполнено" maxLength="100" onChange={(e) => changeEditList(e, 'path')}/>

          <label>Название</label>
          <input type="text" value={editList.name} placeholder="Не заполнено" maxLength="100" onChange={(e) => changeEditList(e, 'name')}/>

          <div className={'edit-form-column'}>
            <label>Формат</label>
            <select name="list" className={`main-select ${editList.type_id !== -1 ? '':'main-select-unselect'}`} value={editList.type_id} onChange={(e) => changeEditListSelect(e, 'type_id')}>
              <option value={-1}>Не выбрано</option>
              {listTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
            </select>
          </div>
          <LdSpace width={20}/>
          <div className={'edit-form-column'}>
            <label>Разделитель</label>
            <select name="list" className={`main-select ${editList.delimiter_id !== -1 ? '':'main-select-unselect'}`} value={editList.delimiter_id} onChange={(e) => changeEditListSelect(e, 'delimiter_id')}>
              <option value={-1}>Не выбрано</option>
              {listDelimiters.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
            </select>
          </div>

          <label>Структура</label>
          <select name="list" className={`main-select ${editList.structure_id !== -1 ? '':'main-select-unselect'}`} value={editList.structure_id} onChange={(e) => changeEditListSelect(e, 'structure_id')}>
            <option value={-1}>Не выбрано</option>
            {listStructures.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
          </select>

          <LdSpace height={10}/>
          <button onClick={clickEditListAddFilter}><FontAwesomeIcon icon={faPlus}/> Добавить фильтрацию</button>
          <LdSpace height={20}/>

          <button onClick={clickListClose}><FontAwesomeIcon icon={faXmark}/> Закрыть</button>

          <div className={'edit-form-column'}>
            <button onClick={clickEditListDelete} className={'red-button'}><FontAwesomeIcon icon={faTrashCan}/> Удалить</button>
          </div>
          <LdSpace width={20}/>
          <div className={'edit-form-column'}>
            <button type="submit" className={'green-button'}><FontAwesomeIcon icon={faFloppyDisk}/> Сохранить</button>
          </div>

        </form>
      </LdDialog>}

      <LdLoader loading={isLoading}/>
    </>
  );
};

export default PriceListsImport;