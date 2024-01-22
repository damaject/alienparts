import LdHead from "@/components/LdHead";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faBan,
  faFileArrowUp,
  faFloppyDisk,
  faMaximize,
  faPlus,
  faTrashCan,
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
import LdExport from "@/components/objects/LdExport";
import {faSquare as faUncheck, faSquareCheck as faCheck} from "@fortawesome/free-regular-svg-icons";

const PriceListsExport = () => {

  const {getUser, addNotification, addDialogNotification} = useLdAppContext();

  const [priceListImports, setPriceListImports] = useState([]);
  const [listExports, setListExports] = useState([]);
  const [sources, setSources] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [filteredSources, setFilteredSources] = useState([]);
  const [filteredContractors, setFilteredContractors] = useState([]);
  const [exportName, setExportName] = useState('');
  const [exportContractor, setExportContractor] = useState(-1);
  const [exportSource, setExportSource] = useState(-1);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editExport, setEditExport] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMiniLoading, setIsMiniLoading] = useState(false);
  let isListLoading = false;

  const openDialog = () => {
    setIsDialogOpen(true);
    setExportName('');
    setExportContractor(-1);
    setExportSource(-1);
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
    setExportContractor(newContractor);
    setExportSource(-1);
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
    setExportSource(newSource);
    if (newSource === -1) {
      setExportContractor(-1);
      setFilteredSources(sources);
      setFilteredContractors(contractors);
    }
    else {
      const source = sources.find((source => Number(source.id) === newSource));
      setExportContractor(source ? Number(source.contractor_id) : -1);
    }
  }

  const clickAddConfirm = async (e) => {
    e.preventDefault();

    if (exportName.length === 0) addDialogNotification('Введите название!');
    else if (exportContractor === -1) addDialogNotification('Выберите контрагента!');
    else if (exportSource === -1) addDialogNotification('Выберите источник данных!');
    else {

      const apiRequestPriceListAddExport = new LdApiRequest('pricelist', 'add_export');

      setIsLoading(true);
      const response = await apiRequestPriceListAddExport.request(getUser(), {name: exportName,
        contractor_id: exportContractor, source_id: exportSource});
      setIsLoading(false);

      if (response.status === 1) {
        if (response.data.state === 1) {
          closeDialog();
          addNotification('Импорт успешно добавлен!');
          await loadExports();
        } else addDialogNotification(`State is: ${response.data.state}, error: ${response.data.error}`);
      } else addDialogNotification(`Ошибка запроса: ${response.error}`);

    }
  }

  const loadExports = async () => {
    if (isListLoading) return;

    const apiRequestPriceListExports = new LdApiRequest('pricelist', 'list_exports');

    isListLoading = true;
    setIsMiniLoading(true);
    const response = await apiRequestPriceListExports.request(getUser(), {});
    setIsMiniLoading(false);
    isListLoading = false;

    if (response.status === 1) {
      if (response.data.state === 1) {
        setListExports(response.data.exports);
        setSources(response.data.sources);
        setContractors(response.data.contractors);
        setPriceListImports(response.data.imports);
      } else addNotification(`State is: ${response.data.state}, error: ${response.data.error}`);
    } else addNotification(`Ошибка запроса: ${response.error}`);
  }

  const showExport = (id) => {
    let exportList = listExports.find((list => Number(list.id) === id));
    if (exportList) {
      exportList = {...exportList};
      exportList.active = Boolean(Number(exportList.active));
      setEditExport(exportList);
      setIsEditDialogOpen(true);
    }
    else addNotification('Прайс-лист экспорта не найден!');
  }
  const closeEditDialog = () => setIsEditDialogOpen(false);
  const clickEditClose = () => closeEditDialog();

  const changeEditExportIsActive = async (e) => {
    e.preventDefault();
    setEditExport({...editExport, ['active']: !editExport.active})
  }

  const changeEditExport = async (e, key) => {
    e.preventDefault();
    setEditExport({...editExport, [key]: e.target.value})
  }
  const changeEditExportData = async (e, key) => {
    e.preventDefault();
    setEditExport({...editExport, data: {...editExport.data, [key]: e.target.value}})
  }

  const clickEditDelete = async (e) => {
    e.preventDefault();
  }

  const clickEditSave = async (e) => {
    e.preventDefault();

    const apiRequestExportEdit = new LdApiRequest('pricelist', 'edit_export');

    setIsLoading(true);
    const response = await apiRequestExportEdit.request(getUser(), {
      id: editExport.id,
      active: Number(editExport.active),
      note: editExport.note
    });
    setIsLoading(false);

    if (response.status === 1) {
      if (response.data.state === 1) {
        closeEditDialog();
        addNotification('Прайс-лист успешно сохранен!');
        await loadExports();
      } else addDialogNotification(`State is: ${response.data.state}, error: ${response.data.error}`);
    } else addDialogNotification(`Ошибка запроса: ${response.error}`);

  }

  useEffect(() => {loadExports();}, []);

  return (
    <>
      <LdHead/>
      <LdTitle><FontAwesomeIcon icon={faFileArrowUp}/> Экспорт прайс-листов</LdTitle>
      <LdButton click={clickAdd}><FontAwesomeIcon icon={faPlus}/> Добавить</LdButton>

      <table className='pricelists-export-table'>
        <thead><tr><th>ID</th><th>Название</th><th>Контрагент</th><th>Источник данных</th><th>Обновлено</th><th>Размер</th><th>Примечание</th><th><FontAwesomeIcon icon={faMaximize}/></th></tr></thead>
        <tbody>{listExports.map(list => <LdExport key={list.id} list={list} show={showExport}/>)}</tbody>
      </table>

      <LdLoader loading={isMiniLoading} isMini={true}/>

      <LdDialog isOpen={isDialogOpen} onClose={false}>
        <LdTitle>Новый экспорт</LdTitle>
        <form onSubmit={clickAddConfirm} className="add-form">
          <p>Введите название экспорта, выберите контрагента и источник данных. Задать дополнительные настройки необходимо через редактирование экспорта прайс-листа.</p>

          <label>Название</label>
          <input type="text" placeholder="Введите название" onChange={(e) => setExportName(e.target.value)}/>

          <label>Контрагент</label>
          <select name="list" className={`main-select ${exportContractor !== -1 ? '':'main-select-unselect'}`} value={exportContractor} onChange={selectContractor}>
            <option value={-1}>Выберите контрагента</option>
            {filteredContractors.map(contractor => <option key={contractor.id} value={contractor.id}>{contractor.name}</option>)}
          </select>

          <label>Источник данных</label>
          <select name="list" className={`main-select ${exportSource !== -1 ? '':'main-select-unselect'}`} value={exportSource} onChange={selectSource}>
            <option value={-1}>Выберите источник данных</option>
            {filteredSources.map(source => <option key={source.id} value={source.id}>{source.name} ({source.type_name})</option>)}
          </select>

          <LdSpace height={40}/>
          <button type="submit" className={'green-button'}><FontAwesomeIcon icon={faPlus}/> Добавить</button>
          <LdSpace height={10}/>
          <button onClick={clickCancel}><FontAwesomeIcon icon={faBan}/> Отмена</button>
        </form>
      </LdDialog>

      {editExport && <LdDialog isOpen={isEditDialogOpen} onClose={false}>
        <LdTitle>Экспортируемый прайс-лист {editExport.name}</LdTitle>
        <form onSubmit={clickEditSave} className="edit-form">
          <p>Введите или измените необходимые данные для экспорта прайс-листа, а затем обязательно сохраните их.</p>

          <div className={'edit-form-column'}>

            <label>ID</label>
            <input type="text" value={editExport.id} disabled/>

            <label>Контрагент</label>
            <input type="text" value={editExport.contractor_name} disabled/>

            <div className={'edit-form-semi-column'}>
              <label>Статус прайса</label>
              <button onClick={changeEditExportIsActive} className={`check-button ${editExport.active ? '':'check-button-uncheck'}`}><FontAwesomeIcon icon={editExport.active ? faCheck : faUncheck}/> Активный</button>
            </div>
            <LdSpace width={20}/>
            <div className={'edit-form-semi-column'}>
              <label>Прайс-лист</label>
              <select name="list" className={`main-select ${exportSource !== -1 ? '':'main-select-unselect'}`} value={exportSource} onChange={selectSource}>
                <option value={-1}>Выберите прайс-лист</option>
                {priceListImports.map(list => <option key={list.id} value={list.id}>{list.name}</option>)}
              </select>
            </div>

          </div>

          <LdSpace width={20}/>

          <div className={'edit-form-column'}>
            <label>Название</label>
            <input type="text" value={editExport.name} disabled/>

            <label>Источник данных</label>
            <input type="text" value={`${editExport.source_name} (${editExport.source_type_name})`} disabled/>

            {/*<div className={'edit-form-semi-column'}>*/}
            {/*  <label>Наценка</label>*/}
            {/*  <input type="number" value={editExport.percent} step="0.01" min="0.5" max="10.0" />*/}
            {/*</div>*/}
            {/*<LdSpace width={20}/>*/}

            {/*<div className={'edit-form-semi-column'}>*/}
            <label>Примечание</label>
            <input type="text" value={editExport.note} placeholder="Не заполнено" maxLength="100" onChange={(e) => changeEditExport(e, 'note')}/>
            {/*</div>*/}
          </div>

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

export default PriceListsExport;