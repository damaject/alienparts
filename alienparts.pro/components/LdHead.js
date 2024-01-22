import Head from "next/head";

const LdHead = ({title, description}) => {

  return (
    <Head>
      <title>{title || 'Alienparts'}</title>
      <meta name="description" content={description || 'Alienparts'}/>
      <meta name="keywords" content=""/>
      <meta name="viewport" content="width=device-width, initial-scale=0.7"/>
      <meta name="theme-color" content="#000000"/>
      <link rel="icon" href="/img/favicon.png"/>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
      <link rel="stylesheet"href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700&display=swap" />
      {/*<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css"/>*/}
    </Head>
  )
}

export default LdHead;