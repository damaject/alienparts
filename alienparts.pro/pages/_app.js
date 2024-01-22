import "@/styles/globals.css";
import "@/styles/loader.css";
import "@/styles/tables.css";
import "@/styles/forms.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import {config} from "@fortawesome/fontawesome-svg-core";
import LdLayout from "@/components/LdLayout";
import {LdAppProvider} from "@/utils/LdAppProvider";

config.autoAddCss = false;

const App = ({Component, pageProps}) => (
  <LdAppProvider>
    <LdLayout>
      <Component {...pageProps} />
    </LdLayout>
  </LdAppProvider>
)

export default App;
