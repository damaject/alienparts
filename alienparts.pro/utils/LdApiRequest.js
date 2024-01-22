

class LdApiRequest {

  constructor(section, action) {
    this._loading = false;
    this.section = section;
    this.action = action;
  }

  async request(user, requestData) {
    const API_ENDPOINT = '<api_endpoint>';
    const mainData = {
      app_token: '<app_token>',
      user_id: 0,
      auth_token: '',
      section: this.section,
      action: this.action
    };

    if (user != null) {
      mainData.user_id = user.id;
      mainData.auth_token = user.token;
    }

    requestData = {data: {...mainData, ...requestData}};

    console.log(requestData);

    requestData = JSON.stringify(requestData);

    try {
      this._loading = true;
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: requestData
      });
      const data = await response.json();
      this._loading = false;

      console.log(data);

      if (!response.ok) return {status: 0, error: "Response status not OK!"};
      return {status: 1, data: data};

    } catch (error) {
      return {status: 0, error: "Exception!"};
    }
  }

  get isLoading() {
    return this._loading;
  }

}

export default LdApiRequest;