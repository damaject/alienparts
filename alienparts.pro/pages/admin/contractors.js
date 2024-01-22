import LdHead from "@/components/LdHead";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faBan,
  faEnvelopeOpenText, faFloppyDisk,
  faHandshakeSimple, faMaximize,
  faPlus,
  faSquareCheck, faSquareXmark, faTrashCan, faXmark
} from "@fortawesome/free-solid-svg-icons";
import LdTitle from "@/components/LdTitle";
import LdButton from "@/components/LdButton";
import LdDialog from "@/components/LdDialog";
import LdSpace from "@/components/LdSpace";
import LdLoader from "@/components/LdLoader";
import {useEffect, useState} from "react";
import LdApiRequest from "@/utils/LdApiRequest";
import {useLdAppContext} from "@/utils/LdAppProvider";
import LdContractor from "@/components/objects/LdContractor";
import {faSquare as faUncheck, faSquareCheck as faCheck} from "@fortawesome/free-regular-svg-icons";

const Contractors = () => {

  const {getUser, addNotification, addDialogNotification} = useLdAppContext();

  const [contractors, setContractors] = useState([]);
  const [contractorName, setContractorName] = useState('');
  const [contractorCode, setContractorCode] = useState('');
  const [contractorIsBuyer, setContractorIsBuyer] = useState(false);
  const [contractorIsSupplier, setContractorIsSupplier] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editContractor, setEditContractor] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMiniLoading, setIsMiniLoading] = useState(false);
  let isListLoading = false;

  const openDialog = () => {
    setIsDialogOpen(true);
    setContractorName('');
    setContractorCode('');
    setContractorIsBuyer(false);
    setContractorIsSupplier(false);
  }
  const closeDialog = () => setIsDialogOpen(false);
  const clickCancel = () => closeDialog();

  const changeContractorIsBuyer = async (e) => {
    e.preventDefault();
    setContractorIsBuyer(!contractorIsBuyer);
  }

  const changeContractorIsSupplier = async (e) => {
    e.preventDefault();
    setContractorIsSupplier(!contractorIsSupplier);
  }

  const clickAdd = async (e) => {
    e.preventDefault();
    openDialog();
  }

  const clickAddConfirm = async (e) => {
    e.preventDefault();

    if (contractorName.length === 0) addDialogNotification('Введите название!');
    else if (contractorCode.length === 0) addDialogNotification('Введите код!');
    else if (!contractorIsBuyer && !contractorIsSupplier) addDialogNotification('Выберите тип сотрудничества!');
    else {

      const apiRequestContractorAdd = new LdApiRequest('contractor', 'add');

      setIsLoading(true);
      const response = await apiRequestContractorAdd.request(getUser(), {code: contractorCode,
        name: contractorName, buyer: Number(contractorIsBuyer), supplier: Number(contractorIsSupplier)});
      setIsLoading(false);

      if (response.status === 1) {
        if (response.data.state === 1) {
          closeDialog();
          addNotification('Контрагент успешно добавлен!');
          await loadContractors();
        } else addDialogNotification(`State is: ${response.data.state}, error: ${response.data.error}`);
      } else addDialogNotification(`Ошибка запроса: ${response.error}`);

    }
  }

  const loadContractors = async () => {
    if (isListLoading) return;

    const apiRequestContractorList = new LdApiRequest('contractor', 'list');

    isListLoading = true;
    setIsMiniLoading(true);
    const response = await apiRequestContractorList.request(getUser(), {});
    setIsMiniLoading(false);
    isListLoading = false;

    if (response.status === 1) {
      if (response.data.state === 1) {
        setContractors(response.data.contractors);
        console.log(contractors);
      } else addNotification(`State is: ${response.data.state}, error: ${response.data.error}`);
    } else addNotification(`Ошибка запроса: ${response.error}`);
  }

  const showContractor = (id) => {
    let contractor = contractors.find((contractor => Number(contractor.id) === id));
    if (contractor) {
      contractor = {...contractor};
      contractor.buyer = Boolean(Number(contractor.buyer));
      contractor.supplier = Boolean(Number(contractor.supplier));
      setEditContractor(contractor);
      setIsEditDialogOpen(true);
    }
    else addNotification('Контрагент не найден!');
  }
  const closeEditDialog = () => setIsEditDialogOpen(false);
  const clickEditClose = () => closeEditDialog();

  const changeEditContractorIsBuyer = async (e) => {
    e.preventDefault();
    setEditContractor({...editContractor, ['buyer']: !editContractor.buyer})
  }

  const changeEditContractorIsSupplier = async (e) => {
    e.preventDefault();
    setEditContractor({...editContractor, ['supplier']: !editContractor.supplier})
  }

  const changeEditContractor = async (e, key) => {
    e.preventDefault();
    setEditContractor({...editContractor, [key]: e.target.value})
  }

  const clickEditDelete = async (e) => {
    e.preventDefault();
  }

  const clickEditSave = async (e) => {
    e.preventDefault();

    const apiRequestContractorEdit = new LdApiRequest('contractor', 'edit');

    setIsLoading(true);
    const response = await apiRequestContractorEdit.request(getUser(), {
      id: editContractor.id,
      legal_name: editContractor.legal_name,
      legal_address: editContractor.legal_address,
      real_address: editContractor.real_address,
      inn: editContractor.inn,
      kpp: editContractor.kpp,
      contract: editContractor.contract,
      buyer: Number(editContractor.buyer),
      supplier: Number(editContractor.supplier),
      note: editContractor.note
    });
    setIsLoading(false);

    if (response.status === 1) {
      if (response.data.state === 1) {
        closeEditDialog();
        addNotification('Контрагент успешно сохранен!');
        await loadContractors();
      } else addDialogNotification(`State is: ${response.data.state}, error: ${response.data.error}`);
    } else addDialogNotification(`Ошибка запроса: ${response.error}`);

  }

  useEffect(() => {loadContractors();}, []);

  return (
    <>
      <LdHead/>
      <LdTitle><FontAwesomeIcon icon={faHandshakeSimple}/> Контрагенты</LdTitle>
      <LdButton click={clickAdd}><FontAwesomeIcon icon={faPlus}/> Добавить</LdButton>

      <table className='contractors-table'>
        <thead><tr><th>ID</th><th>Код</th><th>Название</th><th>Юридическое название</th><th>Тип сотрудничества</th><th>Примечание</th><th><FontAwesomeIcon icon={faMaximize}/></th></tr></thead>
        <tbody>{contractors.map(contractor => <LdContractor key={contractor.id} contractor={contractor} show={showContractor}/>)}</tbody>
      </table>

      <LdLoader loading={isMiniLoading} isMini={true}/>

      <LdDialog isOpen={isDialogOpen} onClose={false}>
        <LdTitle>Новый контрагент</LdTitle>
        <form onSubmit={clickAddConfirm} className="add-form">
          <p>Введите внутреннее название контрагента, 3-х символьный код и выберите тип сотрудничества. Юридическую информацию необходимо будет внести через редактирование контрагента.</p>

          <label>Название</label>
          <input type="text" placeholder="Введите название, пример: Alienparts" maxLength="20" onChange={(e) => setContractorName(e.target.value)}/>

          <label>Код</label>
          <input type="text" placeholder="Введите код, пример: ALN" maxLength="3" onChange={(e) => setContractorCode(e.target.value)}/>

          <label>Тип сотрудничества</label>
          <button onClick={changeContractorIsBuyer}  className={`check-button ${contractorIsBuyer ? '':'check-button-uncheck'}`}><FontAwesomeIcon icon={contractorIsBuyer ? faCheck : faUncheck}/> Покупатель</button>
          <LdSpace width={20}/>
          <button onClick={changeContractorIsSupplier} className={`check-button ${contractorIsSupplier ? '':'check-button-uncheck'}`}><FontAwesomeIcon icon={contractorIsSupplier ? faCheck : faUncheck}/> Поставщик</button>

          <LdSpace height={40}/>
          <button type="submit" className={'green-button'}><FontAwesomeIcon icon={faPlus}/> Добавить</button>
          <LdSpace height={10}/>
          <button onClick={clickCancel}><FontAwesomeIcon icon={faBan}/> Отмена</button>
        </form>
      </LdDialog>

      {editContractor && <LdDialog isOpen={isEditDialogOpen} onClose={false}>
        <LdTitle>Контрагент {editContractor.name}</LdTitle>
        <form onSubmit={clickEditSave} className="edit-form">
          <p>Введите или измените необходимые данные контрагента, а затем обязательно сохраните их.</p>

          <div className={'edit-form-column'}>
            <div className={'edit-form-semi-column'}>
              <label>ID</label>
              <input type="text" value={editContractor.id} disabled/>
            </div>
            <LdSpace width={20}/>
            <div className={'edit-form-semi-column'}>
              <label>Код</label>
              <input type="text" value={editContractor.code} disabled/>
            </div>

            <label>Тип сотрудничества</label>
            <button onClick={changeEditContractorIsBuyer}  className={`check-button ${editContractor.buyer ? '':'check-button-uncheck'}`}><FontAwesomeIcon icon={editContractor.buyer ? faCheck : faUncheck}/> Покупатель</button>
            <LdSpace width={20}/>
            <button onClick={changeEditContractorIsSupplier} className={`check-button ${editContractor.supplier ? '':'check-button-uncheck'}`}><FontAwesomeIcon icon={editContractor.supplier ? faCheck : faUncheck}/> Поставщик</button>

            <label>ИНН</label>
            <input type="text" value={editContractor.inn} placeholder="Не заполнено" maxLength="20" onChange={(e) => changeEditContractor(e, 'inn')}/>
          </div>

          <LdSpace width={20}/>

          <div className={'edit-form-column'}>
            <label>Название</label>
            <input type="text" value={editContractor.name} disabled/>

            <label>Юридическое название</label>
            <input type="text" value={editContractor.legal_name} placeholder="Не заполнено" maxLength="100" onChange={(e) => changeEditContractor(e, 'legal_name')}/>

            <label>КПП</label>
            <input type="text" value={editContractor.kpp} placeholder="Не заполнено" maxLength="20" onChange={(e) => changeEditContractor(e, 'kpp')}/>
          </div>

          <label>Юридический адрес</label>
          <input type="text" value={editContractor.legal_address} placeholder="Не заполнено" maxLength="200" onChange={(e) => changeEditContractor(e, 'legal_address')}/>

          <label>Фактический адрес</label>
          <input type="text" value={editContractor.real_address} placeholder="Не заполнено" maxLength="200" onChange={(e) => changeEditContractor(e, 'real_address')}/>

          <div className={'edit-form-column'}>
            <label>Договор</label>
            <input type="text" value={editContractor.contract} placeholder="Не заполнено" maxLength="100" onChange={(e) => changeEditContractor(e, 'contract')}/>
          </div>

          <LdSpace width={20}/>

          <div className={'edit-form-column'}>
            <label>Примечание</label>
            <input type="text" value={editContractor.note} placeholder="Не заполнено" maxLength="100" onChange={(e) => changeEditContractor(e, 'note')}/>
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

export default Contractors;